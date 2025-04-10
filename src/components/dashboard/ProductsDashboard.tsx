
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface ProductsDashboardProps {
  userEmail: string;
}

// Define proper interfaces for our data
interface ProductData {
  id: string;
  name: string;
  totalQuantity: number;
  totalSales: number;
  count: number;
}

interface TopProductData {
  name: string;
  sales: number;
}

const ProductsDashboard: React.FC<ProductsDashboardProps> = ({ userEmail }) => {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        // Get all bills for this user
        const { data: billsData, error: billsError } = await supabase
          .from('bills')
          .select('id')
          .eq('customer_email', userEmail);

        if (billsError) {
          console.error('Error fetching bills data:', billsError);
          return;
        }

        if (!billsData || billsData.length === 0) {
          setIsLoading(false);
          return;
        }

        // Get bill IDs
        const billIds = billsData.map(bill => bill.id);

        // Get bill items for these bills
        const { data: itemsData, error: itemsError } = await supabase
          .from('bill_items')
          .select('*')
          .in('bill_id', billIds);

        if (itemsError) {
          console.error('Error fetching bill items:', itemsError);
          return;
        }

        if (itemsData) {
          // Process product data
          const productMap: Record<string, ProductData> = {};
          
          itemsData.forEach(item => {
            const productId = item.product_id || item.product_name;
            if (!productMap[productId]) {
              productMap[productId] = {
                id: productId,
                name: item.product_name,
                totalQuantity: 0,
                totalSales: 0,
                count: 0
              };
            }
            
            productMap[productId].totalQuantity += item.quantity || 0;
            productMap[productId].totalSales += (item.price * item.quantity) || 0;
            productMap[productId].count += 1;
          });
          
          const products = Object.values(productMap);
          
          // Sort by total sales
          const sortedProducts = [...products].sort((a, b) => b.totalSales - a.totalSales);
          
          setProductData(sortedProducts);
          setTopProducts(sortedProducts.slice(0, 5).map(product => ({
            name: product.name,
            sales: product.totalSales
          })));
        }
      } catch (error) {
        console.error('Error in products data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchProductData();

      // Subscribe to real-time updates
      const channel = supabase
        .channel('products-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bill_items'
          },
          () => {
            // Refresh data when new bill items are added
            fetchProductData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading product data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Selling Products</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {topProducts.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Sales']}
                  labelFormatter={(label) => `Product: ${label}`}
                />
                <Bar dataKey="sales" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">No product data available</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Product Sales Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Product</th>
                  <th className="py-2 text-right">Units Sold</th>
                  <th className="py-2 text-right">Total Sales</th>
                </tr>
              </thead>
              <tbody>
                {productData.length > 0 ? (
                  productData.map((product) => (
                    <tr key={product.id} className="border-b">
                      <td className="py-2 text-left">{product.name}</td>
                      <td className="py-2 text-right">{product.totalQuantity}</td>
                      <td className="py-2 text-right">₹{product.totalSales.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No product data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsDashboard;

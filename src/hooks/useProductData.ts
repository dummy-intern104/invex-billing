
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Define proper interfaces for our data
export interface ProductData {
  id: string;
  name: string;
  totalQuantity: number;
  totalSales: number;
  count: number;
}

export interface TopProductData {
  name: string;
  sales: number;
}

// Define types matching the database schema
interface BillData {
  id: string;
  total: number;
  created_at: string;
  created_by: string;
  bill_number: string;
  customer_email: string;
}

interface BillItemData {
  id: string;
  bill_id: string;
  product_id: string;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

export const useProductData = (userEmail: string) => {
  const [productData, setProductData] = useState<ProductData[]>([]);
  const [topProducts, setTopProducts] = useState<TopProductData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProductData = async () => {
      setIsLoading(true);
      try {
        // Get bills filtered by current user
        const { data: billsData, error: billsError } = await supabase
          .from('bills')
          .select('id')
          .eq('created_by', userEmail);

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
          // Safely cast the data
          const typedItemsData = itemsData as unknown as BillItemData[];
          
          // Process product data
          const productMap: Record<string, ProductData> = {};
          
          typedItemsData.forEach(item => {
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

      // Subscribe to real-time updates for bills
      const billsChannel = supabase
        .channel('products-bills-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bills',
            filter: `created_by=eq.${userEmail}` // Filter for current user's bills only
          },
          () => {
            console.log('Bills changed, refreshing product data');
            fetchProductData();
          }
        )
        .subscribe();

      // Subscribe to real-time updates for bill_items
      const itemsChannel = supabase
        .channel('products-items-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bill_items'
          },
          () => {
            console.log('Bill items changed, refreshing product data');
            fetchProductData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(billsChannel);
        supabase.removeChannel(itemsChannel);
      };
    }
  }, [userEmail]);

  return { productData, topProducts, isLoading };
};

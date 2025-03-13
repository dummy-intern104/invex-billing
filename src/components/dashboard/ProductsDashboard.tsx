
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, Package, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

interface ProductSalesData {
  product_name: string;
  quantity: number;
  revenue: number;
}

interface StockLevelData {
  name: string;
  value: number;
}

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#ff0000'];

const ProductsDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [topProducts, setTopProducts] = useState<ProductSalesData[]>([]);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>([]);
  const [stockLevels, setStockLevels] = useState<StockLevelData[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [outOfStock, setOutOfStock] = useState(0);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch bill items to calculate top products
        const { data: billItems, error: billItemsError } = await supabase
          .from('bill_items')
          .select('product_name, quantity, price');
          
        if (billItemsError) throw billItemsError;
        
        // Fetch products for stock levels
        const { data: products, error: productsError } = await supabase
          .from('products')
          .select('*')
          .order('stock', { ascending: true });
          
        if (productsError) throw productsError;
        
        // Process top products by quantity sold
        const productSalesMap = new Map<string, ProductSalesData>();
        
        if (billItems) {
          billItems.forEach(item => {
            const productName = item.product_name;
            const quantity = Number(item.quantity);
            const price = Number(item.price);
            const revenue = quantity * price;
            
            if (productSalesMap.has(productName)) {
              const existingData = productSalesMap.get(productName)!;
              productSalesMap.set(productName, {
                product_name: productName,
                quantity: existingData.quantity + quantity,
                revenue: existingData.revenue + revenue
              });
            } else {
              productSalesMap.set(productName, {
                product_name: productName,
                quantity,
                revenue
              });
            }
          });
        }
        
        // Convert to array and sort by quantity
        const topProductsArray = Array.from(productSalesMap.values())
          .sort((a, b) => b.quantity - a.quantity)
          .slice(0, 5);
          
        setTopProducts(topProductsArray);
        
        // Process stock levels
        if (products) {
          // Categorize products by stock level
          const stockCategories: StockLevelData[] = [
            { name: 'Out of Stock', value: 0 },
            { name: 'Low Stock (1-5)', value: 0 },
            { name: 'Medium Stock (6-20)', value: 0 },
            { name: 'High Stock (21+)', value: 0 }
          ];
          
          let outOfStockCount = 0;
          
          products.forEach(product => {
            const stock = product.stock;
            
            if (stock === 0) {
              stockCategories[0].value += 1;
              outOfStockCount += 1;
            } else if (stock <= 5) {
              stockCategories[1].value += 1;
            } else if (stock <= 20) {
              stockCategories[2].value += 1;
            } else {
              stockCategories[3].value += 1;
            }
          });
          
          setStockLevels(stockCategories);
          setLowStockProducts(products.filter(p => p.stock <= 5).slice(0, 5));
          setTotalProducts(products.length);
          setOutOfStock(outOfStockCount);
        }
        
      } catch (error) {
        console.error("Error fetching product data:", error);
        toast({
          title: "Error",
          description: "Could not fetch product data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              <span>Top Selling Products</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ChartContainer
                config={{
                  quantity: { label: "Quantity Sold", color: "#8b5cf6" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topProducts}
                    margin={{ top: 5, right: 30, left: 20, bottom: 60 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis 
                      dataKey="product_name" 
                      tick={{ fontSize: 12 }} 
                      angle={-45} 
                      textAnchor="end"
                      height={60}
                    />
                    <YAxis tick={{ fontSize: 12 }} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value, name) => {
                            return [value, "Quantity Sold"];
                          }}
                        />
                      }
                    />
                    <Legend />
                    <Bar 
                      dataKey="quantity" 
                      name="Quantity Sold"
                      fill="var(--color-quantity, #8b5cf6)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle>Stock Level Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={stockLevels}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    nameKey="name"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {stockLevels.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [`${value} products`, 'Quantity']} />
                </PieChart>
              </ResponsiveContainer>
              <div className="text-center text-sm text-muted-foreground mt-2">
                <p>Total Products: {totalProducts}</p>
                <p>Out of Stock: {outOfStock}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-orange-500" />
            <span>Low Stock Alert</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {lowStockProducts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Product Name</TableHead>
                  <TableHead>Product ID</TableHead>
                  <TableHead>Current Stock</TableHead>
                  <TableHead>Price</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {lowStockProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.product_id}</TableCell>
                    <TableCell>
                      <span className={product.stock === 0 ? "text-red-500 font-bold" : "text-orange-500 font-semibold"}>
                        {product.stock === 0 ? "Out of Stock" : product.stock}
                      </span>
                    </TableCell>
                    <TableCell>₹{parseFloat(product.price).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No low stock products found
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductsDashboard;

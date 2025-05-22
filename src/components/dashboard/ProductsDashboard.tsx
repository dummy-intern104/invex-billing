
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useProductData } from "@/hooks/useProductData";
import ProductBarChart from './products/ProductBarChart';
import ProductsTable from './products/ProductsTable';
import ProductAddForm from './products/ProductAddForm';
import ProductsListing from './products/ProductsListing';

interface ProductsDashboardProps {
  userEmail: string;
}

const ProductsDashboard: React.FC<ProductsDashboardProps> = ({ userEmail }) => {
  const { productData, topProducts, isLoading, refetch } = useProductData(userEmail);
  const [activeTab, setActiveTab] = useState("management");

  const handleProductAdded = () => {
    refetch();
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Products</h2>
        <ProductAddForm onProductAdded={handleProductAdded} />
      </div>
      
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
          <TabsTrigger value="management">Sales Analytics</TabsTrigger>
          <TabsTrigger value="products">Product Inventory</TabsTrigger>
        </TabsList>
        
        <TabsContent value="management" className="space-y-6">
          <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Top Selling Products</CardTitle>
            </CardHeader>
            <CardContent className="h-[400px]">
              <ProductBarChart topProducts={topProducts} isLoading={isLoading} />
            </CardContent>
          </Card>
          
          <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Product Sales Details</CardTitle>
            </CardHeader>
            <CardContent>
              <ProductsTable productData={productData} isLoading={isLoading} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="products" className="space-y-6">
          <ProductsListing />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductsDashboard;

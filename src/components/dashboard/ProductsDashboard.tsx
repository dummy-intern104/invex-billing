
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductData } from "@/hooks/useProductData";
import ProductBarChart from './products/ProductBarChart';
import ProductsTable from './products/ProductsTable';
import ProductAddForm from './products/ProductAddForm';

interface ProductsDashboardProps {
  userEmail: string;
}

const ProductsDashboard: React.FC<ProductsDashboardProps> = ({ userEmail }) => {
  const { productData, topProducts, isLoading, refetch } = useProductData(userEmail);

  const handleProductAdded = () => {
    refetch();
  };

  return (
    <div className="grid grid-cols-1 gap-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-medium text-gray-700 dark:text-gray-300">Product Management</h2>
        <ProductAddForm onProductAdded={handleProductAdded} />
      </div>
      
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
    </div>
  );
};

export default ProductsDashboard;

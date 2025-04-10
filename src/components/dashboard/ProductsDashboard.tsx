
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useProductData } from "@/hooks/useProductData";
import ProductBarChart from './products/ProductBarChart';
import ProductsTable from './products/ProductsTable';

interface ProductsDashboardProps {
  userEmail: string;
}

const ProductsDashboard: React.FC<ProductsDashboardProps> = ({ userEmail }) => {
  const { productData, topProducts, isLoading } = useProductData(userEmail);

  return (
    <div className="grid grid-cols-1 gap-6">
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

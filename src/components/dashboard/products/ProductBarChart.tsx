
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TopProductData {
  name: string;
  sales: number;
}

interface ProductBarChartProps {
  topProducts: TopProductData[];
  isLoading: boolean;
}

const ProductBarChart: React.FC<ProductBarChartProps> = ({ topProducts, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading product data...</div>
      </div>
    );
  }

  if (topProducts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">No product data available</div>
      </div>
    );
  }

  return (
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
  );
};

export default ProductBarChart;

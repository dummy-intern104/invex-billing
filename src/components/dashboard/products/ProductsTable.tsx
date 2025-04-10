
import React from 'react';

interface ProductData {
  id: string;
  name: string;
  totalQuantity: number;
  totalSales: number;
  count: number;
}

interface ProductsTableProps {
  productData: ProductData[];
  isLoading: boolean;
}

const ProductsTable: React.FC<ProductsTableProps> = ({ productData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading product data...</div>
      </div>
    );
  }

  return (
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
  );
};

export default ProductsTable;

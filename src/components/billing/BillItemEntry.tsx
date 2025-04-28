
import React from "react";
import { Input } from "@/components/ui/input";
import { BillItem } from "@/types/billing";
import { Product } from "@/integrations/supabase/database.types";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface BillItemEntryProps {
  item: BillItem;
  index: number;
  products: Product[];
  onItemChange: (index: number, field: keyof BillItem, value: string | number) => void;
  removeItem?: () => void;
}

const BillItemEntry: React.FC<BillItemEntryProps> = ({ 
  item, 
  index, 
  products, 
  onItemChange,
  removeItem
}) => {
  return (
    <div className="flex flex-wrap gap-3 items-end p-4 border border-gray-200 dark:border-gray-700 rounded-md bg-white dark:bg-gray-800/50">
      <div className="w-full md:w-[48%] space-y-1">
        <label htmlFor={`product-${index}`} className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Product/Service
        </label>
        <select
          id={`product-${index}`}
          value={item.product_id}
          onChange={(e) => onItemChange(index, 'product_id', e.target.value)}
          className="w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 text-sm text-gray-900 dark:text-gray-100 bg-white dark:bg-gray-800"
        >
          <option value="">Select a product</option>
          {products.map((product) => (
            <option key={product.id} value={product.id}>
              {product.name} (₹{product.price})
            </option>
          ))}
          <option value="manual">Enter manually</option>
        </select>
      </div>

      {(item.product_id === 'manual' || item.product_id === '') && (
        <div className="w-full md:w-[48%] space-y-1">
          <label htmlFor={`product-name-${index}`} className="text-sm font-medium text-gray-600 dark:text-gray-300">
            Description
          </label>
          <Input
            id={`product-name-${index}`}
            type="text"
            value={item.product_name}
            onChange={(e) => onItemChange(index, 'product_name', e.target.value)}
            placeholder="Enter product or service name"
          />
        </div>
      )}
      
      <div className="w-full sm:w-[20%] space-y-1">
        <label htmlFor={`quantity-${index}`} className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Quantity
        </label>
        <Input
          id={`quantity-${index}`}
          type="number"
          min="1"
          value={item.quantity}
          onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
        />
      </div>
      
      <div className="w-full sm:w-[20%] space-y-1">
        <label htmlFor={`price-${index}`} className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Price
        </label>
        <Input
          id={`price-${index}`}
          type="number"
          min="0"
          step="0.01"
          value={item.price}
          onChange={(e) => onItemChange(index, 'price', e.target.value)}
        />
      </div>
      
      <div className="w-full sm:w-[15%] space-y-1">
        <label className="text-sm font-medium text-gray-600 dark:text-gray-300">
          Subtotal
        </label>
        <div className="px-3 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 rounded-md text-right">
          ₹{(item.quantity * item.price).toFixed(2)}
        </div>
      </div>

      {removeItem && (
        <div className="flex items-center ml-auto">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={removeItem}
            className="h-9 w-9 border-red-200 hover:bg-red-50 hover:text-red-600"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};

export default BillItemEntry;

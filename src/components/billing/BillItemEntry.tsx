
import React, { useEffect } from "react";
import { Input } from "@/components/ui/input";
import { BillItem, Product } from "@/types/billing";

interface BillItemEntryProps {
  item: BillItem;
  index: number;
  products: Product[];
  onItemChange: (index: number, field: keyof BillItem, value: string | number) => void;
}

const BillItemEntry: React.FC<BillItemEntryProps> = ({ 
  item, 
  index, 
  products, 
  onItemChange 
}) => {
  // When manual entry is selected, clear product_id and enable manual name entry
  useEffect(() => {
    if (item.product_id === "manual") {
      onItemChange(index, 'product_name', '');
    }
  }, [item.product_id, index, onItemChange]);

  return (
    <div className="grid grid-cols-12 gap-3">
      <div className="col-span-3">
        <select
          value={item.product_id}
          onChange={(e) => onItemChange(index, 'product_id', e.target.value)}
          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
        >
          <option value="">Select Product</option>
          <option value="manual">Enter Manually</option>
          {products.map((product) => (
            <option key={product.id} value={product.product_id}>
              {product.name} (₹{product.price.toFixed(2)})
              {product.stock <= 0 ? ' - Out of Stock' : product.stock < 5 ? ` - Only ${product.stock} left` : ''}
            </option>
          ))}
        </select>
      </div>
      <div className="col-span-4">
        <Input 
          placeholder="Product Name" 
          value={item.product_name}
          onChange={(e) => onItemChange(index, 'product_name', e.target.value)}
          className="border-gray-300 focus-visible:ring-purple-400"
          disabled={item.product_id !== "" && item.product_id !== "manual"}
        />
      </div>
      <div className="col-span-2">
        <Input 
          placeholder="Quantity" 
          type="number"
          min="0"
          value={item.quantity || ""}
          onChange={(e) => onItemChange(index, 'quantity', e.target.value)}
          className="border-gray-300 focus-visible:ring-purple-400"
        />
      </div>
      <div className="col-span-3">
        <Input 
          placeholder="Price" 
          type="number"
          min="0"
          step="0.01"
          value={item.price || ""}
          onChange={(e) => onItemChange(index, 'price', e.target.value)}
          className="border-gray-300 focus-visible:ring-purple-400"
          prefix="₹"
          disabled={item.product_id !== "" && item.product_id !== "manual" && item.product_id !== undefined}
        />
      </div>
    </div>
  );
};

export default BillItemEntry;

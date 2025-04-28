
import React from "react";
import { Button } from "@/components/ui/button";
import { BillItem } from "@/types/billing";
import { Product } from "@/integrations/supabase/database.types";
import BillItemEntry from "./BillItemEntry";

interface BillItemsListProps {
  items: BillItem[];
  products: Product[];
  onItemChange: (index: number, field: keyof BillItem, value: string | number) => void;
  addNewItem: () => void;
}

const BillItemsList: React.FC<BillItemsListProps> = ({
  items,
  products,
  onItemChange,
  addNewItem
}) => {
  return (
    <div className="space-y-4">
      <h3 className="font-medium text-gray-700 dark:text-gray-200">Item Entry</h3>
      {items.map((item, index) => (
        <BillItemEntry 
          key={index} 
          item={item} 
          index={index} 
          products={products} 
          onItemChange={onItemChange} 
        />
      ))}
      
      <Button 
        type="button" 
        variant="outline" 
        onClick={addNewItem}
        className="w-full border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
      >
        + Add Item
      </Button>
    </div>
  );
};

export default BillItemsList;


import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { BillItem, Product } from "@/types/billing";
import { Printer } from "lucide-react";
import BillItemEntry from "./BillItemEntry";
import BillSummary from "./BillSummary";

interface BillFormInputProps {
  billNumber: string;
  email: string;
  items: BillItem[];
  products: Product[];
  onBillNumberChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onItemChange: (index: number, field: keyof BillItem, value: string | number) => void;
  addNewItem: () => void;
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  onSubmit: (e: React.FormEvent) => void;
}

const BillFormInput: React.FC<BillFormInputProps> = ({
  billNumber,
  email,
  items,
  products,
  onBillNumberChange,
  onEmailChange,
  onItemChange,
  addNewItem,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="bill" className="text-gray-700 dark:text-gray-200 font-medium">Invoice Number</Label>
        <Input 
          id="bill" 
          value={billNumber}
          onChange={(e) => onBillNumberChange(e.target.value)}
          placeholder="Enter invoice number" 
          className="border-gray-300 focus-visible:ring-purple-400"
        />
      </div>
      
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
      
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-8">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium mb-2 block">
            Customer Email/Number
          </Label>
          <Input 
            id="email" 
            placeholder="customer@example.com" 
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>
        <div className="col-span-4">
          <BillSummary 
            subtotal={calculateSubtotal()} 
            tax={calculateTax()} 
            total={calculateTotal()} 
          />
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
      >
        <Printer className="h-4 w-4 mr-2" />
        Generate Bill
      </Button>
    </form>
  );
};

export default BillFormInput;

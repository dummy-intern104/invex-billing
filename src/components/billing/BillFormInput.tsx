
import React from "react";
import { Button } from "@/components/ui/button";
import { BillItem, Product } from "@/integrations/supabase/database.types";
import { Printer } from "lucide-react";
import BillFormHeader from "./BillFormHeader";
import BillItemsList from "./BillItemsList";
import BillCustomerInfo from "./BillCustomerInfo";
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
      <BillFormHeader 
        billNumber={billNumber} 
        onBillNumberChange={onBillNumberChange} 
      />
      
      <BillItemsList 
        items={items} 
        products={products} 
        onItemChange={onItemChange} 
        addNewItem={addNewItem} 
      />
      
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-8">
          <BillCustomerInfo 
            email={email}
            onEmailChange={onEmailChange}
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

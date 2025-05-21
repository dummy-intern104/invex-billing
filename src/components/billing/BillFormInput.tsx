
import React from "react";
import { Button } from "@/components/ui/button";
import { BillItem } from "@/types/billing";
import { Product } from "@/integrations/supabase/database.types";
import { Printer } from "lucide-react";
import BillFormHeader from "./BillFormHeader";
import BillItemsList from "./BillItemsList";
import BillCustomerInfo from "./BillCustomerInfo";
import BillSummary from "./BillSummary";
import PaymentModeSelector from "./PaymentModeSelector";
import { PaymentMode } from "@/hooks/useBillForm";

interface BillFormInputProps {
  billNumber: string;
  email: string;
  items: BillItem[];
  products: Product[];
  paymentMode: PaymentMode;
  onBillNumberChange: (value: string) => void;
  onEmailChange: (value: string) => void;
  onPaymentModeChange: (mode: PaymentMode) => void;
  onItemChange: (index: number, field: keyof BillItem, value: string | number) => void;
  addNewItem: () => void;
  removeItem?: (index: number) => void;
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
  paymentMode,
  onBillNumberChange,
  onEmailChange,
  onPaymentModeChange,
  onItemChange,
  addNewItem,
  removeItem,
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
        removeItem={removeItem}
      />
      
      <div className="grid grid-cols-12 gap-3 items-start">
        <div className="col-span-12 md:col-span-8 space-y-4">
          <BillCustomerInfo 
            email={email}
            onEmailChange={onEmailChange}
          />
          
          <PaymentModeSelector
            paymentMode={paymentMode}
            onPaymentModeChange={onPaymentModeChange}
          />
        </div>
        <div className="col-span-12 md:col-span-4">
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

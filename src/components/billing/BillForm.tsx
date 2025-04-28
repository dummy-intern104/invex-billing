
import React from "react";
import { BillItem } from "@/integrations/supabase/database.types";
import BillFormInput from "./BillFormInput";
import BillPrintPreview from "./BillPrintPreview";
import { useBillForm } from "@/hooks/useBillForm";

interface BillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
}

const BillForm: React.FC<BillFormProps> = ({ onSubmit }) => {
  const {
    billNumber,
    email,
    items,
    products,
    isLoading,
    showPrintPreview,
    setBillNumber,
    setEmail,
    handleItemChange,
    addNewItem,
    handlePaymentStatus,
    handlePrintPreview,
    getSubtotal,
    getTax,
    getTotal,
    setShowPrintPreview
  } = useBillForm({ onSubmit });

  return (
    <div>
      {showPrintPreview ? (
        <BillPrintPreview
          billNumber={billNumber}
          email={email}
          items={items}
          calculateSubtotal={getSubtotal}
          calculateTax={getTax}
          calculateTotal={getTotal}
          onPaymentStatus={handlePaymentStatus}
          onBackToEdit={() => setShowPrintPreview(false)}
          isLoading={isLoading}
        />
      ) : (
        <BillFormInput
          billNumber={billNumber}
          email={email}
          items={items}
          products={products}
          onBillNumberChange={setBillNumber}
          onEmailChange={setEmail}
          onItemChange={handleItemChange}
          addNewItem={addNewItem}
          calculateSubtotal={getSubtotal}
          calculateTax={getTax}
          calculateTotal={getTotal}
          onSubmit={(e) => { e.preventDefault(); handlePrintPreview(); }}
        />
      )}
    </div>
  );
};

export default BillForm;

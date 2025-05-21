
import React from "react";
import { BillItem } from "@/types/billing";
import BillFormInput from "./BillFormInput";
import BillPrintPreview from "./BillPrintPreview";
import { useBillForm } from "@/hooks/useBillForm";

interface BillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
  onBillCreated?: (newBill: any) => void;
  initialBillNumber?: string;
}

const BillForm: React.FC<BillFormProps> = ({ onSubmit, onBillCreated, initialBillNumber = "" }) => {
  const {
    billNumber,
    email,
    items,
    products,
    isLoading,
    showPrintPreview,
    paymentMode,
    setBillNumber,
    setEmail,
    setPaymentMode,
    handleItemChange,
    addNewItem,
    removeItem,
    handlePaymentStatus,
    handlePrintPreview,
    getSubtotal,
    getTax,
    getTotal,
    setShowPrintPreview
  } = useBillForm({ onSubmit, onBillCreated });

  // Set the initial bill number received from props
  React.useEffect(() => {
    if (initialBillNumber) {
      setBillNumber(initialBillNumber);
    }
  }, [initialBillNumber, setBillNumber]);

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
          paymentMode={paymentMode}
          onBillNumberChange={setBillNumber}
          onEmailChange={setEmail}
          onPaymentModeChange={setPaymentMode}
          onItemChange={handleItemChange}
          addNewItem={addNewItem}
          removeItem={removeItem}
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

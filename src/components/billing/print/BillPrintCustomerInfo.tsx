
import React from "react";
import { PaymentMode } from "@/hooks/useBillForm";

interface BillPrintCustomerInfoProps {
  email: string;
  state: string;
  billNumber: string;
  currentDate: string;
  paymentMode: PaymentMode;
}

const BillPrintCustomerInfo: React.FC<BillPrintCustomerInfoProps> = ({
  email,
  state,
  billNumber,
  currentDate,
  paymentMode
}) => {
  return (
    <div className="grid grid-cols-2 gap-4 mt-4 text-sm">
      <div>
        <p><strong>Customer Email:</strong> {email}</p>
        <p><strong>State/Province:</strong> {state}</p>
        <p><strong>Payment Mode:</strong> {paymentMode}</p>
      </div>
      <div className="text-right">
        <p><strong>Invoice Number:</strong> {billNumber}</p>
        <p><strong>Date:</strong> {currentDate}</p>
      </div>
    </div>
  );
};

export default BillPrintCustomerInfo;

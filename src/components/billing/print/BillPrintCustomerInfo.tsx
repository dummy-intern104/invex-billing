
import React from "react";

interface BillPrintCustomerInfoProps {
  email: string;
  state: string;
  billNumber: string;
  currentDate: string;
}

const BillPrintCustomerInfo: React.FC<BillPrintCustomerInfoProps> = ({
  email,
  state,
  billNumber,
  currentDate
}) => {
  return (
    <div className="bill-sections flex justify-between">
      <div className="bill-to w-1/2">
        <h3 className="font-bold text-base">Bill To</h3>
        <p className="font-semibold">{email}</p>
        <p className="text-sm">{email?.split('@')[0] || 'Customer'}</p>
        <p className="text-sm">Contact No.: N/A</p>
        <p className="text-sm">GSTIN: N/A</p>
        <p className="text-sm">State: {state?.split('-')[1] || 'Tamil Nadu'}</p>
      </div>
      <div className="invoice-details w-1/2 text-right">
        <h3 className="font-bold text-base">Invoice Details</h3>
        <p className="text-sm">Invoice No.: {billNumber}</p>
        <p className="text-sm">Date: {currentDate}</p>
        <p className="text-sm">Place of supply: {state || '33-Tamil Nadu'}</p>
      </div>
    </div>
  );
};

export default BillPrintCustomerInfo;


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
        <h3 className="font-bold text-sm mb-1">Bill To</h3>
        <p className="text-xs mb-0 font-semibold">{email?.split('@')[0] || 'Customer'}</p>
        <p className="text-xs mb-0">{email}</p>
        <p className="text-xs mb-0">Contact No.: N/A</p>
        <p className="text-xs mb-0">GSTIN: N/A</p>
        <p className="text-xs mb-0">State: {state?.split('-')[1] || 'Tamil Nadu'}</p>
      </div>
      <div className="invoice-details w-1/2 text-right">
        <h3 className="font-bold text-sm mb-1">Invoice Details</h3>
        <p className="text-xs mb-0">Invoice No.: {billNumber}</p>
        <p className="text-xs mb-0">Date: {currentDate}</p>
        <p className="text-xs mb-0">Place of supply: {state || '33-Tamil Nadu'}</p>
      </div>
    </div>
  );
};

export default BillPrintCustomerInfo;

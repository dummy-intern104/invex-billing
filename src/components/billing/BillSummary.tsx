
import React from "react";

interface BillSummaryProps {
  subtotal: number;
  tax: number;
  total: number;
}

const BillSummary: React.FC<BillSummaryProps> = ({ subtotal, tax, total }) => {
  return (
    <div className="bg-black text-white p-2.5 rounded text-center font-medium">
      <div className="text-xs text-gray-400">Subtotal: ₹{subtotal.toFixed(2)}</div>
      <div className="text-xs text-gray-400">GST (18%): ₹{tax.toFixed(2)}</div>
      <div>Total: ₹{total.toFixed(2)}</div>
    </div>
  );
};

export default BillSummary;

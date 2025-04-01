
import React from "react";

interface BillPrintAmountSectionProps {
  totalInWords: string;
  calculateSubtotal: () => number;
  calculateTotal: () => number;
}

const BillPrintAmountSection: React.FC<BillPrintAmountSectionProps> = ({
  totalInWords,
  calculateSubtotal,
  calculateTotal
}) => {
  return (
    <div className="amount-section flex justify-between mt-6">
      <div className="amount-words w-3/5">
        <div className="section-header bg-blue-500 text-white px-2 py-1">Invoice Amount (In Words)</div>
        <p className="p-2 border border-gray-300">{totalInWords}</p>
      </div>
      <div className="amount-table w-2/5">
        <div className="section-header bg-blue-500 text-white px-2 py-1">Amount</div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1">Sub Total</td>
              <td className="border border-gray-300 p-1 text-right">₹ {calculateSubtotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">Total</td>
              <td className="border border-gray-300 p-1 text-right">₹ {calculateTotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">Received</td>
              <td className="border border-gray-300 p-1 text-right">₹ {calculateTotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1">Balance</td>
              <td className="border border-gray-300 p-1 text-right">₹ 0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillPrintAmountSection;

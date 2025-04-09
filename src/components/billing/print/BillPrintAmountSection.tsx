
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
    <div className="amount-section flex justify-between mt-3">
      <div className="amount-words w-3/5">
        <div className="section-header bg-[#4A7ADB] text-white px-2 py-1 text-xs">Invoice Amount (In Words)</div>
        <p className="p-1 border border-gray-300 text-xs">{totalInWords}</p>
      </div>
      <div className="amount-table w-2/5">
        <div className="section-header bg-[#4A7ADB] text-white px-2 py-1 text-xs">Amount</div>
        <table className="w-full border-collapse">
          <tbody>
            <tr>
              <td className="border border-gray-300 p-1 text-xs">Sub Total</td>
              <td className="border border-gray-300 p-1 text-right text-xs">₹ {calculateSubtotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs">Total</td>
              <td className="border border-gray-300 p-1 text-right text-xs">₹ {calculateTotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs">Received</td>
              <td className="border border-gray-300 p-1 text-right text-xs">₹ {calculateTotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td className="border border-gray-300 p-1 text-xs">Balance</td>
              <td className="border border-gray-300 p-1 text-right text-xs">₹ 0.00</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default BillPrintAmountSection;

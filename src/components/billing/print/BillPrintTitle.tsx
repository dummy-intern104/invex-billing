
import React from "react";

interface BillPrintTitleProps {
  reprinted?: boolean;
}

const BillPrintTitle: React.FC<BillPrintTitleProps> = ({ reprinted = false }) => {
  return (
    <div className="invoice-title">
      <h2 className="text-center text-xl font-bold">Tax Invoice</h2>
    </div>
  );
};

export default BillPrintTitle;

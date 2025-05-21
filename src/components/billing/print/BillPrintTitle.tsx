
import React from "react";

interface BillPrintTitleProps {
  reprinted?: boolean;
}

const BillPrintTitle: React.FC<BillPrintTitleProps> = ({ reprinted = false }) => {
  return (
    <div className="invoice-title relative">
      <h2 className="text-center text-xl font-bold">Tax Invoice</h2>
      {reprinted && (
        <div className="reprinted-stamp absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-[-30deg] text-red-500/50 text-2xl font-bold border-2 border-red-500/50 px-2 py-1 pointer-events-none">
          REPRINTED
        </div>
      )}
    </div>
  );
};

export default BillPrintTitle;

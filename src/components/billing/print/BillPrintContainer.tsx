
import React from "react";
import { Separator } from "@/components/ui/separator";
import { CompanyProfile } from "@/types/company";
import { BillItem } from "@/types/billing";
import { PaymentMode } from "@/hooks/useBillForm";

import BillPrintHeader from "./BillPrintHeader";
import BillPrintTitle from "./BillPrintTitle";
import BillPrintCustomerInfo from "./BillPrintCustomerInfo";
import BillPrintItemsTable from "./BillPrintItemsTable";
import BillPrintAmountSection from "./BillPrintAmountSection";
import BillPrintTerms from "./BillPrintTerms";
import BillPrintBankDetails from "./BillPrintBankDetails";
import BillPrintFooter from "./BillPrintFooter";

interface BillPrintContainerProps {
  companyData: CompanyProfile;
  email: string;
  billNumber: string;
  currentDate: string;
  validItems: BillItem[];
  calculateSubtotal: () => number;
  calculateTotal: () => number;
  totalInWords: string;
  paymentMode: PaymentMode;
  reprinted?: boolean;
}

const BillPrintContainer: React.FC<BillPrintContainerProps> = ({
  companyData,
  email,
  billNumber,
  currentDate,
  validItems,
  calculateSubtotal,
  calculateTotal,
  totalInWords,
  paymentMode,
  reprinted = false
}) => {
  return (
    <div className="invoice-container">
      {reprinted && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <p className="transform rotate-45 text-red-500 opacity-30 text-5xl font-bold">REPRINTED</p>
        </div>
      )}
    
      <BillPrintHeader companyData={companyData} />
      
      <Separator className="my-2 border-black" />
      
      <BillPrintTitle />
      
      <BillPrintCustomerInfo 
        email={email} 
        state={companyData.state} 
        billNumber={billNumber} 
        currentDate={currentDate} 
        paymentMode={paymentMode}
      />
      
      <BillPrintItemsTable 
        items={validItems} 
        calculateSubtotal={calculateSubtotal} 
      />
      
      <BillPrintAmountSection
        totalInWords={totalInWords}
        calculateSubtotal={calculateSubtotal}
        calculateTotal={calculateTotal}
      />
      
      <BillPrintTerms />
      
      <BillPrintBankDetails companyData={companyData} />
      
      <BillPrintFooter companyData={companyData} />
    </div>
  );
};

export default BillPrintContainer;

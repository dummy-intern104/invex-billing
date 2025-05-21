
import React, { useRef, useEffect, useState } from "react";
import { BillItem } from "@/types/billing";
import BillActions from "./BillActions";
import { format } from "date-fns";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { CompanyProfile } from "@/types/company";
import BillPrintContainer from "./print/BillPrintContainer";
import { handlePrint } from "./print/BillPrintService";
import { numberToWords } from "@/utils/numberToWords";

interface BillPrintPreviewProps {
  billNumber: string;
  email: string;
  items: BillItem[];
  calculateSubtotal: () => number;
  calculateTax: () => number;
  calculateTotal: () => number;
  onPaymentStatus: (status: 'paid' | 'cancelled') => void;
  onBackToEdit: () => void;
  isLoading: boolean;
  reprinted?: boolean;
}

const defaultCompanyProfile: CompanyProfile = {
  logo_url: "",
  signature_url: "",
  company_name: "Marzelet Info Technology",
  address: "Ground floor Old no.33, New No 10 Andavar Street, Sivashakthi Nagar, Chennai",
  phone: "9629997391",
  email: "admin@marzelet.info",
  gstin: "33AASCSM2238G1ZJ",
  state: "33-Tamil Nadu",
  bank_name: "INDIAN OVERSEAS BANK, CHENNAI, AVADI",
  account_number: "00080200000163",
  ifsc_code: "IOBA0000008",
  account_holder_name: "Marzelet Info Technology Pvt Ltd",
  user_id: ""
};

const BillPrintPreview: React.FC<BillPrintPreviewProps> = ({
  billNumber,
  email,
  items,
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  onPaymentStatus,
  onBackToEdit,
  isLoading,
  reprinted = false
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const { profile, loading } = useCompanyProfile();
  const [companyData, setCompanyData] = useState<CompanyProfile>(defaultCompanyProfile);
  const validItems = items.filter(item => item.product_name && item.quantity > 0);
  const currentDate = format(new Date(), "dd-MM-yyyy");
  
  useEffect(() => {
    if (profile) {
      setCompanyData(profile);
    }
  }, [profile]);
  
  const totalInWords = `${numberToWords(Math.floor(calculateTotal()))} Rupees only`;
  
  const printHandler = () => {
    handlePrint({
      printRef,
      billNumber
    });
  };
  
  return (
    <div className="print-preview bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
      <div ref={printRef} className="relative">
        <BillPrintContainer
          companyData={companyData}
          email={email}
          billNumber={billNumber}
          currentDate={currentDate}
          validItems={validItems}
          calculateSubtotal={calculateSubtotal}
          calculateTotal={calculateTotal}
          totalInWords={totalInWords}
          reprinted={reprinted}
        />
      </div>
      
      <BillActions
        onPaymentStatus={onPaymentStatus}
        onPrint={printHandler}
        onBackToEdit={onBackToEdit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BillPrintPreview;

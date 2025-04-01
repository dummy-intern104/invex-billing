import React, { useRef, useEffect, useState } from "react";
import { BillItem } from "@/types/billing";
import BillActions from "./BillActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { CompanyProfile } from "@/types/company";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import BillPrintHeader from "./print/BillPrintHeader";
import BillPrintTitle from "./print/BillPrintTitle";
import BillPrintCustomerInfo from "./print/BillPrintCustomerInfo";
import BillPrintItemsTable from "./print/BillPrintItemsTable";
import BillPrintAmountSection from "./print/BillPrintAmountSection";
import BillPrintTerms from "./print/BillPrintTerms";
import BillPrintBankDetails from "./print/BillPrintBankDetails";
import BillPrintFooter from "./print/BillPrintFooter";

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
  isLoading
}) => {
  const printRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { profile, loading } = useCompanyProfile();
  const [companyData, setCompanyData] = useState<CompanyProfile>(defaultCompanyProfile);
  const validItems = items.filter(item => item.product_name && item.quantity > 0);
  const currentDate = format(new Date(), "dd-MM-yyyy");
  
  useEffect(() => {
    if (profile) {
      setCompanyData(profile);
    }
  }, [profile]);
  
  const numberToWords = (num: number) => {
    const units = ["", "One", "Two", "Three", "Four", "Five", "Six", "Seven", "Eight", "Nine", "Ten"];
    const teens = ["", "Eleven", "Twelve", "Thirteen", "Fourteen", "Fifteen", "Sixteen", "Seventeen", "Eighteen", "Nineteen"];
    const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
    
    if (num === 0) return "Zero";
    
    const convertLessThanThousand = (n: number) => {
      if (n === 0) return "";
      else if (n < 10) return units[n];
      else if (n < 20) return teens[n - 10];
      else if (n < 100) return tens[Math.floor(n / 10)] + (n % 10 !== 0 ? " " + units[n % 10] : "");
      else return units[Math.floor(n / 100)] + " Hundred" + (n % 100 !== 0 ? " " + convertLessThanThousand(n % 100) : "");
    };
    
    let result = "";
    if (num < 1000) {
      result = convertLessThanThousand(num);
    } else if (num < 100000) {
      result = convertLessThanThousand(Math.floor(num / 1000)) + " Thousand";
      if (num % 1000 !== 0) result += " " + convertLessThanThousand(num % 1000);
    }
    
    return result;
  };
  
  const totalInWords = `${numberToWords(Math.floor(calculateTotal()))} Rupees only`;
  
  const handlePrint = () => {
    const printContent = document.createElement('div');
    printContent.innerHTML = printRef.current?.innerHTML || '';
    
    const windowFeatures = 'left=0,top=0,width=800,height=600';
    const printWindow = window.open('', '_blank', windowFeatures);
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Print Invoice #${billNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 20px; margin: 0; }
              .invoice-container { max-width: 800px; margin: 0 auto; border: 1px solid #000; padding: 15px; }
              .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
              .logo { width: 80px; height: 80px; }
              .company-details { text-align: right; font-size: 12px; }
              .invoice-title { text-align: center; font-weight: bold; margin: 10px 0; font-size: 16px; }
              h2 { margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 13px; }
              th, td { padding: 8px; text-align: left; border: 1px solid #ddd; }
              th { background-color: #4a86e8; color: white; }
              .text-right { text-align: right; }
              .section-header { background-color: #4a86e8; color: white; padding: 5px 10px; margin: 10px 0; font-weight: bold; }
              .bill-sections { display: flex; justify-content: space-between; }
              .bill-to { width: 48%; }
              .invoice-details { width: 48%; text-align: right; }
              .separator { border-top: 1px solid #000; margin: 15px 0; }
              .footer { display: flex; justify-content: space-between; margin-top: 30px; }
              .bank-details, .signature { width: 48%; }
              .terms { margin: 20px 0; }
              .amount-section { display: flex; justify-content: space-between; }
              .amount-words { width: 60%; }
              .amount-table { width: 38%; }
              .amount-table table { border-collapse: collapse; width: 100%; }
              .amount-table td { padding: 5px; border: none; text-align: right; }
              .signature-image { max-width: 150px; max-height: 60px; }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };
  
  return (
    <div className="print-preview bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
      <div className="flex justify-end mb-4">
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1 text-xs"
          onClick={() => navigate('/company-profile')}
        >
          <Settings className="h-3 w-3" />
          Edit Company Details
        </Button>
      </div>
      
      <div ref={printRef} className="invoice-container">
        <BillPrintHeader companyData={companyData} />
        
        <Separator className="my-4 border-black" />
        
        <BillPrintTitle />
        
        <BillPrintCustomerInfo 
          email={email} 
          state={companyData.state} 
          billNumber={billNumber} 
          currentDate={currentDate} 
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
      
      <BillActions
        onPaymentStatus={onPaymentStatus}
        onPrint={handlePrint}
        onBackToEdit={onBackToEdit}
        isLoading={isLoading}
      />
    </div>
  );
};

export default BillPrintPreview;

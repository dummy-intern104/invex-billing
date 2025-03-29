
import React, { useRef } from "react";
import { BillItem } from "@/types/billing";
import BillActions from "./BillActions";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";

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
  const validItems = items.filter(item => item.product_name && item.quantity > 0);
  const currentDate = format(new Date(), "dd-MM-yyyy");
  
  // Function to convert number to words
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
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      
      printWindow.document.close();
      printWindow.focus();
      
      // Print after a small delay to ensure content is fully loaded
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  };
  
  return (
    <div className="print-preview bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
      <div ref={printRef} className="invoice-container">
        {/* Company Header */}
        <div className="header">
          <div className="logo">
            <img src="/lovable-uploads/f7274a46-e7a9-4cd9-8b66-22332c791f91.png" alt="Company Logo" width="80" />
          </div>
          <div className="company-details">
            <h2 className="text-lg font-bold mb-0">Marzelet Info Technology</h2>
            <p className="text-sm mb-0">Ground floor Old no.33, New No 10 Andavar Street, Sivashakthi Nagar</p>
            <p className="text-sm mb-0">Chennai</p>
            <p className="text-sm mb-0">Phone no.: 9629997391 Email: admin@marzelet.info</p>
            <p className="text-sm mb-0">GSTIN: 33AASCSM2238G1ZJ, State: 33-Tamil Nadu</p>
          </div>
        </div>
        
        <Separator className="my-4 border-black" />
        
        <div className="invoice-title">
          <h2 className="text-center text-xl font-bold">Tax Invoice</h2>
        </div>
        
        {/* Bill To and Invoice Details */}
        <div className="bill-sections flex justify-between">
          <div className="bill-to w-1/2">
            <h3 className="font-bold text-base">Bill To</h3>
            <p className="font-semibold">{email}</p>
            <p className="text-sm">{email?.split('@')[0] || 'Customer'}</p>
            <p className="text-sm">Contact No.: N/A</p>
            <p className="text-sm">GSTIN: N/A</p>
            <p className="text-sm">State: 33-Tamil Nadu</p>
          </div>
          <div className="invoice-details w-1/2 text-right">
            <h3 className="font-bold text-base">Invoice Details</h3>
            <p className="text-sm">Invoice No.: {billNumber}</p>
            <p className="text-sm">Date: {currentDate}</p>
            <p className="text-sm">Place of supply: 33-Tamil Nadu</p>
          </div>
        </div>
        
        {/* Items Table */}
        <Table className="mt-6">
          <TableHeader>
            <TableRow>
              <TableHead className="w-12 bg-blue-500 text-white">#</TableHead>
              <TableHead className="bg-blue-500 text-white">Item name</TableHead>
              <TableHead className="bg-blue-500 text-white text-right">Quantity</TableHead>
              <TableHead className="bg-blue-500 text-white text-right">Price/Unit</TableHead>
              <TableHead className="bg-blue-500 text-white text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {validItems.map((item, index) => (
              <TableRow key={index} className="border">
                <TableCell className="border">{index + 1}</TableCell>
                <TableCell className="border">{item.product_name}</TableCell>
                <TableCell className="border text-right">{item.quantity}</TableCell>
                <TableCell className="border text-right">₹ {item.price.toFixed(2)}</TableCell>
                <TableCell className="border text-right">₹ {(item.quantity * item.price).toFixed(2)}</TableCell>
              </TableRow>
            ))}
            <TableRow>
              <TableCell colSpan={4} className="text-right font-bold border">Total</TableCell>
              <TableCell className="text-right font-bold border">₹ {calculateSubtotal().toFixed(2)}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
        
        {/* Amount in Words and Calculation */}
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
        
        {/* Terms and Conditions */}
        <div className="terms mt-6">
          <div className="section-header bg-blue-500 text-white px-2 py-1">Terms and Conditions</div>
          <p className="p-2 border border-gray-300">Thanks for doing business with us!</p>
        </div>
        
        {/* Bank Details */}
        <div className="bank-details mt-6">
          <div className="section-header bg-blue-500 text-white px-2 py-1">Bank Details</div>
          <div className="p-2 border border-gray-300">
            <p className="text-sm mb-1">Name: INDIAN OVERSEAS BANK, CHENNAI, AVADI</p>
            <p className="text-sm mb-1">Account No.: 00080200000163</p>
            <p className="text-sm mb-1">IFSC code: IOBA0000008</p>
            <p className="text-sm mb-1">Account holder's name: Marzelet Info Technology Pvt Ltd</p>
          </div>
        </div>
        
        {/* Signature */}
        <div className="footer mt-6 flex justify-between">
          <div className="w-1/2">
            <p>For: Marzelet Info Technology</p>
          </div>
          <div className="w-1/2 text-right">
            <div className="mt-12">
              <p>Authorized Signatory</p>
            </div>
          </div>
        </div>
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

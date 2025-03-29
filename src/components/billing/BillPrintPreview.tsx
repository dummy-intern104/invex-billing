
import React, { useRef } from "react";
import { BillItem } from "@/types/billing";
import BillActions from "./BillActions";

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
              body { font-family: Arial, sans-serif; padding: 20px; }
              h2 { margin-bottom: 10px; }
              table { width: 100%; border-collapse: collapse; margin: 15px 0; }
              th, td { padding: 8px; text-align: left; border-bottom: 1px solid #ddd; }
              th { border-top: 2px solid #000; border-bottom: 2px solid #000; }
              tfoot td { border-top: 2px solid #000; font-weight: bold; }
              .text-right { text-align: right; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; }
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
      <div ref={printRef}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">INVOICE</h2>
          <div>
            <p className="font-medium text-gray-700">Invoice #: {billNumber}</p>
            <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
          </div>
        </div>
        
        <div className="mb-6">
          <p className="font-medium text-gray-700">Customer: {email}</p>
        </div>
        
        <table className="w-full mb-6">
          <thead className="border-b-2 border-gray-300">
            <tr>
              <th className="text-left py-2">Item</th>
              <th className="text-right py-2">Qty</th>
              <th className="text-right py-2">Price</th>
              <th className="text-right py-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {validItems.map((item, index) => (
              <tr key={index} className="border-b border-gray-200">
                <td className="py-2">{item.product_name}</td>
                <td className="text-right py-2">{item.quantity}</td>
                <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                <td className="text-right py-2">₹{(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
          <tfoot className="border-t-2 border-gray-300">
            <tr>
              <td colSpan={3} className="text-right py-2 font-medium">Subtotal:</td>
              <td className="text-right py-2">₹{calculateSubtotal().toFixed(2)}</td>
            </tr>
            <tr>
              <td colSpan={3} className="text-right py-2 font-medium">GST (18%):</td>
              <td className="text-right py-2">₹{calculateTax().toFixed(2)}</td>
            </tr>
            <tr className="font-bold">
              <td colSpan={3} className="text-right py-2">Total:</td>
              <td className="text-right py-2">₹{calculateTotal().toFixed(2)}</td>
            </tr>
          </tfoot>
        </table>
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

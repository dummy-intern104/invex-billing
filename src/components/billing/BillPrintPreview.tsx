
import React from "react";
import { Button } from "@/components/ui/button";
import { BillItem } from "@/types/billing";
import { Check, Loader2, X } from "lucide-react";

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
  const validItems = items.filter(item => item.product_id && item.quantity > 0);
  
  return (
    <div className="print-preview bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
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
      
      <div className="flex justify-center space-x-4 mt-8">
        <Button 
          onClick={() => onPaymentStatus('paid')} 
          variant="default"
          className="bg-green-600 hover:bg-green-700"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Check className="h-4 w-4 mr-2" />
              Mark as Paid
            </>
          )}
        </Button>
        
        <Button 
          onClick={() => onPaymentStatus('cancelled')} 
          variant="outline"
          className="border-red-300 text-red-700 hover:bg-red-50"
          disabled={isLoading}
        >
          <X className="h-4 w-4 mr-2" />
          Cancel
        </Button>
        
        <Button 
          onClick={onBackToEdit} 
          variant="outline"
          disabled={isLoading}
        >
          Back to Edit
        </Button>
      </div>
    </div>
  );
};

export default BillPrintPreview;

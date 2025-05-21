
import React, { useState, useEffect, useRef } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogFooter
} from "@/components/ui/dialog";
import { Loader2, Package, Receipt, Printer } from "lucide-react";
import { BillHistoryItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/utils/billCalculations";
import { Button } from "@/components/ui/button";
import { useCompanyProfile } from "@/hooks/useCompanyProfile";
import { format } from "date-fns";

interface BillDetailDialogProps {
  bill: BillHistoryItem | null;
  isOpen: boolean;
  onClose: () => void;
}

interface BillItemData {
  id: string;
  bill_id: string;
  product_id: string | null;
  product_name: string;
  quantity: number;
  price: number;
  created_at: string;
}

const BillDetailDialog: React.FC<BillDetailDialogProps> = ({ bill, isOpen, onClose }) => {
  const [billItems, setBillItems] = useState<BillItemData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { profile } = useCompanyProfile();
  const printableContentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchBillItems = async () => {
      if (!bill) return;
      
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bill_items')
          .select('*')
          .eq('bill_id', bill.id);
          
        if (error) throw error;
        
        if (data) {
          setBillItems(data);
        }
      } catch (error) {
        console.error('Error fetching bill items:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen && bill) {
      fetchBillItems();
    }
  }, [bill, isOpen]);

  const handlePrint = () => {
    if (!bill || !profile) return;

    const printContent = document.createElement('div');
    printContent.innerHTML = printableContentRef.current?.innerHTML || '';
    
    const windowFeatures = 'left=0,top=0,width=800,height=600';
    const printWindow = window.open('', '_blank', windowFeatures);
    
    if (printWindow) {
      const currentDate = format(new Date(), "dd-MM-yyyy");
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Reprint Invoice #${bill.bill_number}</title>
            <style>
              @page {
                size: A4;
                margin: 10mm;
              }
              body {
                font-family: Arial, sans-serif;
                padding: 10px;
                margin: 0;
                font-size: 12px;
              }
              .invoice-container {
                max-width: 100%;
                margin: 0 auto;
                border: 1px solid #000;
                padding: 10px;
              }
              .header {
                display: flex;
                justify-content: space-between;
                align-items: center;
                margin-bottom: 5px;
              }
              .logo {
                width: 60px;
                height: 60px;
              }
              .company-details {
                text-align: right;
                font-size: 10px;
              }
              .invoice-title {
                text-align: center;
                font-weight: bold;
                margin: 5px 0;
                font-size: 14px;
                position: relative;
              }
              .reprinted-stamp {
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%) rotate(-30deg);
                color: rgba(255, 0, 0, 0.5);
                font-size: 24px;
                font-weight: bold;
                border: 2px solid rgba(255, 0, 0, 0.5);
                padding: 5px 10px;
                pointer-events: none;
              }
              h2 {
                margin-bottom: 5px;
                font-size: 14px;
              }
              h3 {
                margin-bottom: 3px;
                font-size: 12px;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                margin: 10px 0;
                font-size: 10px;
              }
              th, td {
                padding: 3px 5px;
                text-align: left;
                border: 1px solid #ddd;
                font-size: 10px;
              }
              th {
                background-color: #4A7ADB;
                color: white;
              }
              .text-right {
                text-align: right;
              }
              .text-center {
                text-align: center;
              }
              .section-header {
                background-color: #4A7ADB;
                color: white;
                padding: 3px 5px;
                margin: 5px 0;
                font-weight: bold;
              }
              .bill-sections {
                display: flex;
                justify-content: space-between;
              }
              .bill-to {
                width: 48%;
              }
              .invoice-details {
                width: 48%;
                text-align: right;
              }
              .separator {
                border-top: 1px solid #000;
                margin: 10px 0;
              }
              .footer {
                display: flex;
                justify-content: space-between;
                margin-top: 15px;
              }
              .bank-details, .signature {
                width: 48%;
              }
              .terms {
                margin: 10px 0;
              }
              .amount-table {
                width: 100%;
              }
              .amount-table table {
                border-collapse: collapse;
                width: 100%;
              }
              .amount-table td {
                padding: 3px;
                border: 1px solid #ddd;
              }
              .signature-image {
                max-width: 100px;
                max-height: 40px;
              }
              p {
                margin: 2px 0;
              }
            </style>
          </head>
          <body>
            <div class="invoice-container">
              <!-- Company Header -->
              <div class="header">
                <div class="logo">
                  ${profile.logo_url ? `<img src="${profile.logo_url}" alt="Company Logo" width="60" height="60" />` : 
                   `<div style="width:60px;height:60px;border:1px dashed #ccc;display:flex;align-items:center;justify-content:center;">
                      <span style="font-size:10px;color:#999;">No Logo</span>
                    </div>`}
                </div>
                <div class="company-details">
                  <h2>${profile.company_name}</h2>
                  <p>${profile.address}</p>
                  <p>Phone no.: ${profile.phone} Email: ${profile.email}</p>
                  <p>GSTIN: ${profile.gstin}, State: ${profile.state}</p>
                </div>
              </div>
              
              <div class="separator"></div>
              
              <!-- Invoice Title -->
              <div class="invoice-title">
                <h2>Tax Invoice</h2>
                <div class="reprinted-stamp">REPRINTED</div>
              </div>
              
              <!-- Customer & Invoice Info -->
              <div class="bill-sections">
                <div class="bill-to">
                  <h3>Bill To</h3>
                  <p>${bill.customer_email?.split('@')[0] || 'Customer'}</p>
                  <p>${bill.customer_email}</p>
                  <p>Contact No.: N/A</p>
                  <p>GSTIN: N/A</p>
                  <p>State: ${profile.state?.split('-')[1] || 'Tamil Nadu'}</p>
                </div>
                <div class="invoice-details">
                  <h3>Invoice Details</h3>
                  <p>Invoice No.: ${bill.bill_number}</p>
                  <p>Original Date: ${new Date(bill.created_at).toLocaleDateString()}</p>
                  <p>Reprint Date: ${currentDate}</p>
                  <p>Place of supply: ${profile.state || '33-Tamil Nadu'}</p>
                </div>
              </div>
              
              <!-- Items Table -->
              <table>
                <thead>
                  <tr>
                    <th style="width:10px;">#</th>
                    <th>Item name</th>
                    <th style="width:20px;text-align:center;">Qty</th>
                    <th style="width:24px;text-align:right;">Price/Unit</th>
                    <th style="width:24px;text-align:right;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${billItems.map((item, index) => `
                    <tr>
                      <td style="text-align:center;">${index + 1}</td>
                      <td>${item.product_name}</td>
                      <td style="text-align:center;">${item.quantity}</td>
                      <td style="text-align:right;">₹ ${item.price.toFixed(2)}</td>
                      <td style="text-align:right;">₹ ${(item.quantity * item.price).toFixed(2)}</td>
                    </tr>
                  `).join('')}
                  <tr>
                    <td colspan="4" style="text-align:right;font-weight:bold;">Total</td>
                    <td style="text-align:right;font-weight:bold;">₹ ${parseFloat(bill.total.toString()).toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              
              <!-- Terms -->
              <div class="terms">
                <div class="section-header">Terms and Conditions</div>
                <p style="padding:5px;border:1px solid #ddd;">Thanks for doing business with us!</p>
              </div>
              
              <!-- Bank Details -->
              <div class="bank-details">
                <div class="section-header">Bank Details</div>
                <div style="padding:5px;border:1px solid #ddd;">
                  <p>Name: ${profile.bank_name}</p>
                  <p>Account No.: ${profile.account_number}</p>
                  <p>IFSC code: ${profile.ifsc_code}</p>
                  <p>Account holder's name: ${profile.account_holder_name}</p>
                </div>
              </div>
              
              <!-- Footer -->
              <div class="footer">
                <div style="width:50%;">
                  <p>For: ${profile.company_name}</p>
                </div>
                <div style="width:50%;text-align:right;">
                  <div style="margin-top:20px;">
                    ${profile.signature_url ? 
                      `<img src="${profile.signature_url}" alt="Authorized Signature" style="max-width:100px;max-height:40px;" />` : ''}
                  </div>
                  <p>Authorized Signatory</p>
                </div>
              </div>
            </div>
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

  if (!bill) return null;

  const calculateItemTotal = (item: BillItemData) => {
    return item.quantity * item.price;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5 text-purple-500" />
            Invoice Details - {bill.bill_number}
          </DialogTitle>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex justify-between mb-4">
            <div>
              <h3 className="font-medium text-sm text-gray-500">Customer</h3>
              <p className="font-medium">{bill.customer_email}</p>
            </div>
            <div className="text-right">
              <h3 className="font-medium text-sm text-gray-500">Date</h3>
              <p>{new Date(bill.created_at).toLocaleDateString()}</p>
            </div>
          </div>

          <div className="border rounded-md mt-4">
            <div className="bg-gray-50 dark:bg-gray-800 px-4 py-2 rounded-t-md">
              <h3 className="font-medium">Items</h3>
            </div>
            
            {isLoading ? (
              <div className="flex justify-center py-8">
                <Loader2 className="h-6 w-6 text-purple-500 animate-spin" />
              </div>
            ) : (
              <div className="p-4">
                <div className="space-y-2">
                  {billItems.map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-2 border-b last:border-0">
                      <div className="flex items-center">
                        <Package className="h-4 w-4 mr-2 text-purple-400" />
                        <div>
                          <p className="font-medium">{item.product_name}</p>
                          <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium">{formatCurrency(calculateItemTotal(item))}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>{formatCurrency(parseFloat(bill.total.toString()))}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Hidden printable content for reference */}
        <div ref={printableContentRef} className="hidden"></div>

        <DialogFooter className="mt-6">
          <Button 
            onClick={handlePrint}
            className="bg-green-600 hover:bg-green-700 text-white flex items-center gap-2"
          >
            <Printer className="h-4 w-4" /> Reprint Invoice
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default BillDetailDialog;

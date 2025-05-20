
import React, { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Loader2, Package, Receipt } from "lucide-react";
import { BillHistoryItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";

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

  if (!bill) return null;

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
                      <p className="font-medium">₹{(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
                
                <div className="mt-4 pt-2 border-t">
                  <div className="flex justify-between font-medium">
                    <p>Total</p>
                    <p>₹{parseFloat(bill.total.toString()).toFixed(2)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BillDetailDialog;

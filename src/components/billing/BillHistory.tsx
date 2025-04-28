
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Loader2, Package } from "lucide-react";
import { BillHistoryItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface BillHistoryProps {
  billHistory: BillHistoryItem[];
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

interface EnhancedBillHistoryItem extends BillHistoryItem {
  items?: BillItemData[];
}

const BillHistory: React.FC<BillHistoryProps> = ({ billHistory: initialBillHistory }) => {
  const [billHistory, setBillHistory] = useState<EnhancedBillHistoryItem[]>(initialBillHistory);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Update local state when prop changes (to handle immediate updates)
  useEffect(() => {
    setBillHistory(initialBillHistory as EnhancedBillHistoryItem[]);
    if (initialBillHistory.length > 0) {
      setIsLoading(false);
    }
  }, [initialBillHistory]);

  useEffect(() => {
    if (!user) return;
    
    const fetchBillHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', user.email)
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          const enhancedBills = await Promise.all(data.map(async (bill) => {
            const { data: billItems } = await supabase
              .from('bill_items')
              .select('*')
              .eq('bill_id', bill.id);
              
            return {
              ...bill,
              items: billItems || []
            };
          }));
          
          setBillHistory(enhancedBills as unknown as EnhancedBillHistoryItem[]);
        }
      } catch (error) {
        console.error('Error fetching bill history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();

    const billsChannel = supabase
      .channel('bills-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bills',
          filter: `created_by=eq.${user.email}`
        },
        () => {
          fetchBillHistory();
        }
      )
      .subscribe();

    const billItemsChannel = supabase
      .channel('bill-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'bill_items'
        },
        () => {
          fetchBillHistory();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(billsChannel);
      supabase.removeChannel(billItemsChannel);
    };
  }, [user]);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
      <CardContent className="p-6">
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {billHistory.map((bill) => (
              <div 
                key={bill.id} 
                className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 text-purple-500 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{bill.bill_number}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bill.customer_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-gray-200">₹{parseFloat(bill.total.toString()).toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(bill.created_at || new Date()).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {bill.items && bill.items.length > 0 && (
                  <div className="mt-2 pt-2 border-t border-gray-100 dark:border-gray-800">
                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Products:</p>
                    <div className="space-y-1">
                      {bill.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex items-center text-xs text-gray-600 dark:text-gray-400">
                          <Package className="h-3 w-3 mr-1 text-purple-400" />
                          <span className="truncate max-w-[70%]">{item.product_name}</span>
                          <span className="ml-auto">x{item.quantity}</span>
                        </div>
                      ))}
                      {bill.items.length > 3 && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                          +{bill.items.length - 3} more items
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {billHistory.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400 col-span-full">
                No invoices generated yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillHistory;


import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Loader2, Package } from "lucide-react";
import { BillHistoryItem, BillItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface BillHistoryProps {
  billHistory: BillHistoryItem[];
}

interface EnhancedBillHistoryItem extends BillHistoryItem {
  items?: BillItem[];
}

const BillHistory: React.FC<BillHistoryProps> = ({ billHistory: initialBillHistory }) => {
  const [billHistory, setBillHistory] = useState<EnhancedBillHistoryItem[]>(initialBillHistory);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    // Only proceed if we have a user
    if (!user) return;
    
    // Fetch bills created by the current user
    const fetchBillHistory = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', user.id) // Filter by the user who created the bill
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        
        if (data) {
          // Fetch bill items for each bill
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
          
          setBillHistory(enhancedBills);
        }
      } catch (error) {
        console.error('Error fetching bill history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();

    // Subscribe to realtime changes for bills created by this user
    const billsChannel = supabase
      .channel('bills-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'bills',
          filter: `created_by=eq.${user.id}` // Only listen for changes to bills created by this user
        },
        () => {
          // Refresh bill history when any changes occur
          fetchBillHistory();
        }
      )
      .subscribe();

    // Subscribe to realtime changes for bill_items
    const billItemsChannel = supabase
      .channel('bill-items-changes')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen for all events
          schema: 'public',
          table: 'bill_items'
        },
        () => {
          // Refresh bill history when items change
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
                      {new Date(bill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                {/* Display products in the bill */}
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

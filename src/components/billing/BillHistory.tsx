
import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt, Loader2 } from "lucide-react";
import { BillHistoryItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";

interface BillHistoryProps {
  billHistory: BillHistoryItem[];
}

const BillHistory: React.FC<BillHistoryProps> = ({ billHistory: initialBillHistory }) => {
  const [billHistory, setBillHistory] = useState<BillHistoryItem[]>(initialBillHistory);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch bill history from Supabase
    const fetchBillHistory = async () => {
      try {
        const { data, error } = await supabase
          .from('bills')
          .select('*')
          .order('created_at', { ascending: false });
          
        if (error) throw error;
        if (data) setBillHistory(data);
      } catch (error) {
        console.error('Error fetching bill history:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBillHistory();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'bills'
        },
        (payload) => {
          const newBill = payload.new as BillHistoryItem;
          setBillHistory(prev => [newBill, ...prev]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recent Bills
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
          </div>
        ) : (
          <div className="space-y-3">
            {billHistory.map((bill, index) => (
              <div 
                key={bill.id} 
                className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Receipt className="h-4 w-4 text-purple-500 mr-2" />
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">{bill.bill_number}</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{bill.customer_email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-800 dark:text-gray-200">${parseFloat(bill.total.toString()).toFixed(2)}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(bill.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            
            {billHistory.length === 0 && (
              <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                No bills generated yet
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BillHistory;

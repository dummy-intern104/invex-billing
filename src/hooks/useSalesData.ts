
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Define simple, non-circular interfaces
interface SalesDataItem {
  name: string;
  amount: number;
}

interface UseSalesDataResult {
  salesData: SalesDataItem[];
  totalSales: number;
  averageSale: number;
  invoiceCount: number;
  isLoading: boolean;
}

export const useSalesData = (userEmail: string): UseSalesDataResult => {
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  const [totalSales, setTotalSales] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      try {
        // Get user ID from email
        const { data: userData, error: userError } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', userEmail)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
          setIsLoading(false);
          return;
        }

        const userId = userData?.id;

        // Get bills created by this user
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', userId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales data:', error);
          setIsLoading(false);
          return;
        }

        if (billsData) {
          // Calculate metrics
          const total = billsData.reduce((sum, bill) => sum + (bill.total || 0), 0);
          const count = billsData.length;
          const avg = count > 0 ? total / count : 0;

          setTotalSales(total);
          setInvoiceCount(count);
          setAverageSale(avg);

          // Process data for charts
          const processedData = billsData.slice(0, 7).map(bill => ({
            name: new Date(bill.created_at).toLocaleDateString(),
            amount: bill.total || 0,
          }));

          setSalesData(processedData);
        }
      } catch (error) {
        console.error('Error in sales data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchSalesData();

      // Get user ID from email for realtime subscription
      const getUserIdForSubscription = async () => {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('id')
            .eq('email', userEmail)
            .single();
          
          if (data) {
            // Subscribe to real-time updates for bills created by this user
            const billsChannel = supabase
              .channel('sales-dashboard-bills')
              .on(
                'postgres_changes',
                {
                  event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
                  schema: 'public',
                  table: 'bills',
                  filter: `created_by=eq.${data.id}` // Filter by bills created by this user
                },
                () => {
                  console.log('Bills table changed, refreshing sales data');
                  fetchSalesData();
                }
              )
              .subscribe();

            return () => {
              supabase.removeChannel(billsChannel);
            };
          }
        } catch (error) {
          console.error('Error setting up subscription:', error);
        }
      };
      
      getUserIdForSubscription();
    }
  }, [userEmail]);

  return {
    salesData,
    totalSales,
    averageSale,
    invoiceCount,
    isLoading
  };
};

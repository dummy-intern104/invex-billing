
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

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
        // Get all bills data without filtering by customer_email
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales data:', error);
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

      // Subscribe to real-time updates for bills table
      const billsChannel = supabase
        .channel('sales-dashboard-bills')
        .on(
          'postgres_changes',
          {
            event: '*', // Listen for all events (INSERT, UPDATE, DELETE)
            schema: 'public',
            table: 'bills'
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
  }, [userEmail]);

  return {
    salesData,
    totalSales,
    averageSale,
    invoiceCount,
    isLoading
  };
};

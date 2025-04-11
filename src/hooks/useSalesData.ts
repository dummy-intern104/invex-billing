
import { useState, useEffect } from 'react';
import { supabase } from "@/integrations/supabase/client";

// Define simpler interfaces to avoid deep type instantiation
interface SalesDataItem {
  name: string;
  amount: number;
}

interface BillData {
  id: string;
  total: number;
  created_at: string;
  created_by: string;
  bill_number: string;
  customer_email: string;
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
        // Filter bills by created_by to only get the current user's bills
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', userEmail)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching sales data:', error);
          return;
        }

        if (billsData) {
          // Explicitly cast to correct type
          const typedBillsData = billsData as BillData[];
          
          // Calculate metrics
          const total = typedBillsData.reduce((sum, bill) => sum + (bill.total || 0), 0);
          const count = typedBillsData.length;
          const avg = count > 0 ? total / count : 0;

          setTotalSales(total);
          setInvoiceCount(count);
          setAverageSale(avg);

          // Process data for charts
          const processedData: SalesDataItem[] = typedBillsData.slice(0, 7).map(bill => ({
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
            table: 'bills',
            filter: `created_by=eq.${userEmail}` // Filter for current user's bills only
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

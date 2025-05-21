
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface PaymentsDashboardProps {
  userEmail: string;
}

interface Payment {
  id: string;
  customer_email: string;
  bill_number: string;
  payment_mode: string;
  payment_date: string;
  total: number;
}

const PaymentsDashboard: React.FC<PaymentsDashboardProps> = ({ userEmail }) => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      setIsLoading(true);
      try {
        // Get all bills with payment information
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .eq('created_by', userEmail)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching payments data:', error);
          return;
        }

        // Transform bills data to payment data
        const paymentsData = billsData?.map(bill => ({
          id: bill.id,
          customer_email: bill.customer_email,
          bill_number: bill.bill_number,
          payment_mode: bill.payment_mode || 'Unpaid',
          payment_date: bill.payment_date || bill.created_at,
          total: bill.total
        })) || [];

        setPayments(paymentsData);
      } catch (error) {
        console.error('Error in payments data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchPayments();

      // Subscribe to real-time updates for bills
      const billsChannel = supabase
        .channel('payments-bills-updates')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'bills',
            filter: `created_by=eq.${userEmail}`
          },
          () => {
            console.log('Bills changed, refreshing payments data');
            fetchPayments();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(billsChannel);
      };
    }
  }, [userEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading payment data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Invoice #</th>
                  <th className="py-2 text-left">Customer</th>
                  <th className="py-2 text-right">Amount</th>
                  <th className="py-2 text-center">Payment Mode</th>
                  <th className="py-2 text-right">Payment Date</th>
                </tr>
              </thead>
              <tbody>
                {payments.length > 0 ? (
                  payments.map((payment) => (
                    <tr key={payment.id} className="border-b">
                      <td className="py-2 text-left">{payment.bill_number}</td>
                      <td className="py-2 text-left">{payment.customer_email}</td>
                      <td className="py-2 text-right">₹{payment.total.toLocaleString()}</td>
                      <td className="py-2 text-center">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          payment.payment_mode === 'Cash' ? 'bg-green-100 text-green-800' :
                          payment.payment_mode === 'Card' ? 'bg-blue-100 text-blue-800' :
                          payment.payment_mode === 'UPI' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.payment_mode}
                        </span>
                      </td>
                      <td className="py-2 text-right">
                        {new Date(payment.payment_date).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No payment data available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentsDashboard;

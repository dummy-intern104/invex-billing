
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface SalesDashboardProps {
  userEmail: string;
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ userEmail }) => {
  const [salesData, setSalesData] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [averageSale, setAverageSale] = useState(0);
  const [invoiceCount, setInvoiceCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSalesData = async () => {
      setIsLoading(true);
      try {
        // Get sales data filtered by the current user's email
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .eq('customer_email', userEmail)
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
    }
  }, [userEmail]);

  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading sales data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
          <p className="text-xs text-muted-foreground">
            From {invoiceCount} invoices
          </p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Average Sale</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">₹{averageSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
          <p className="text-xs text-muted-foreground">Per invoice</p>
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Invoice Count</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{invoiceCount}</div>
          <p className="text-xs text-muted-foreground">Total invoices</p>
        </CardContent>
      </Card>
      
      <Card className="md:col-span-2 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">No sales data available</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sales Distribution</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={salesData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="amount"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {salesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Amount']}
                  labelFormatter={(label) => `Date: ${label}`}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">No sales data available</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;


import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CreditCard, TrendingUp, Users, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  ResponsiveContainer,
  Tooltip, 
  Legend 
} from "recharts";
import { format, subDays, startOfToday } from "date-fns";

const SalesDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [salesData, setSalesData] = useState<any[]>([]);
  const [totalSales, setTotalSales] = useState<number>(0);
  const [avgTicketSize, setAvgTicketSize] = useState<number>(0);
  const [totalTransactions, setTotalTransactions] = useState<number>(0);
  const [totalCustomers, setTotalCustomers] = useState<number>(0);

  useEffect(() => {
    const fetchSalesData = async () => {
      try {
        setIsLoading(true);
        
        // Get all bills
        const { data: bills, error: billsError } = await supabase
          .from('bills')
          .select('*')
          .order('created_at', { ascending: true });
          
        if (billsError) throw billsError;
        
        // Get unique customers
        const { count: customerCount, error: countError } = await supabase
          .from('clients')
          .select('*', { count: 'exact', head: true });
          
        if (countError) throw countError;
        
        // Process data for chart - group by date
        const today = startOfToday();
        const last30Days = Array.from({ length: 30 }, (_, i) => {
          const date = subDays(today, 29 - i);
          return format(date, 'yyyy-MM-dd');
        });
        
        // Initialize with all dates having 0 sales
        const salesByDate: Record<string, { date: string, sales: number, transactions: number }> = {};
        last30Days.forEach(date => {
          salesByDate[date] = { date, sales: 0, transactions: 0 };
        });
        
        // Aggregate sales data
        let totalAmount = 0;
        
        if (bills) {
          bills.forEach(bill => {
            const billDate = format(new Date(bill.created_at), 'yyyy-MM-dd');
            if (salesByDate[billDate]) {
              salesByDate[billDate].sales += Number(bill.total);
              salesByDate[billDate].transactions += 1;
              totalAmount += Number(bill.total);
            }
          });
        }
        
        // Convert to array for recharts
        const chartData = Object.values(salesByDate);
        
        setSalesData(chartData);
        setTotalSales(totalAmount);
        setTotalTransactions(bills?.length || 0);
        setAvgTicketSize(totalAmount / (bills?.length || 1));
        setTotalCustomers(customerCount || 0);
      } catch (error) {
        console.error("Error fetching sales data:", error);
        toast({
          title: "Error",
          description: "Could not fetch sales data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSalesData();
  }, [toast]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">₹{totalSales.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              <CreditCard className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Avg. Ticket Size</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">₹{avgTicketSize.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</div>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalTransactions}</div>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Customers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="text-2xl font-bold">{totalCustomers}</div>
              <Users className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
        <CardHeader>
          <CardTitle>Sales Trend (Last 30 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ChartContainer
              config={{
                sales: { label: "Sales", color: "#8b5cf6" },
                transactions: { label: "Transactions", color: "#06b6d4" },
              }}
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                >
                  <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                  <XAxis 
                    dataKey="date" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => {
                      const date = new Date(value);
                      return format(date, 'dd MMM');
                    }}
                    angle={-45}
                    textAnchor="end"
                    height={60}
                  />
                  <YAxis 
                    yAxisId="left" 
                    tick={{ fontSize: 12 }} 
                    tickFormatter={(value) => `₹${value}`} 
                  />
                  <YAxis 
                    yAxisId="right" 
                    orientation="right" 
                    tick={{ fontSize: 12 }} 
                  />
                  <ChartTooltip
                    content={
                      <ChartTooltipContent
                        formatter={(value, name) => {
                          if (name === "sales") {
                            return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, "Sales"];
                          }
                          return [value, "Transactions"];
                        }}
                        labelFormatter={(label) => {
                          const date = new Date(label);
                          return format(date, 'dd MMM yyyy');
                        }}
                      />
                    }
                  />
                  <Legend />
                  <Line
                    name="Sales"
                    key="sales"
                    type="monotone"
                    dataKey="sales"
                    yAxisId="left"
                    stroke="var(--color-sales, #8b5cf6)"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line
                    name="Transactions"
                    key="transactions"
                    type="monotone"
                    dataKey="transactions"
                    yAxisId="right"
                    stroke="var(--color-transactions, #06b6d4)"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesDashboard;

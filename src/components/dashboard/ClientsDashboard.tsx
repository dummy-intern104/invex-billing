
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from "@/components/ui/table";
import { Loader2, Users, UserCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Client } from "@/types/billing";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid,
  Tooltip, 
  Legend,
  ResponsiveContainer
} from "recharts";

const ClientsDashboard = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [topClients, setTopClients] = useState<Client[]>([]);
  const [recentClients, setRecentClients] = useState<Client[]>([]);
  const [clientStats, setClientStats] = useState({
    totalClients: 0,
    averagePurchase: 0,
  });

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch top clients by total purchase amount
        const { data: clients, error: clientsError } = await supabase
          .from('clients')
          .select('*')
          .order('total_purchases', { ascending: false });
          
        if (clientsError) throw clientsError;
        
        // Calculate client stats
        if (clients) {
          const totalPurchases = clients.reduce((sum, client) => sum + Number(client.total_purchases), 0);
          const avgPurchase = clients.length > 0 ? totalPurchases / clients.length : 0;
          
          setClientStats({
            totalClients: clients.length,
            averagePurchase: avgPurchase,
          });
          
          // Set top clients
          setTopClients(clients.slice(0, 5));
          
          // Set recent clients (sort by updated_at)
          const recentClientsList = [...clients].sort((a, b) => 
            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
          ).slice(0, 5);
          
          setRecentClients(recentClientsList);
        }
        
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Error",
          description: "Could not fetch client data",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              <span>Client Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Total Clients</p>
                <p className="text-3xl font-bold">{clientStats.totalClients}</p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/30 p-4 rounded-lg text-center">
                <p className="text-muted-foreground text-sm">Avg. Purchase</p>
                <p className="text-3xl font-bold">₹{clientStats.averagePurchase.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</p>
              </div>
            </div>
            
            <div className="h-64">
              <ChartContainer
                config={{
                  value: { label: "Total Purchase", color: "#8b5cf6" },
                }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={topClients.map(client => ({
                      name: client.email.split('@')[0], // Just showing username part for chart
                      value: Number(client.total_purchases)
                    }))}
                    margin={{ top: 5, right: 30, left: 20, bottom: 30 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} horizontal={true} vertical={false} />
                    <XAxis type="number" tick={{ fontSize: 12 }} tickFormatter={(value) => `₹${value.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`} />
                    <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} width={100} />
                    <ChartTooltip
                      content={
                        <ChartTooltipContent
                          formatter={(value) => {
                            return [`₹${value.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`, "Total Purchase"];
                          }}
                        />
                      }
                    />
                    <Legend />
                    <Bar 
                      dataKey="value" 
                      name="Total Purchase"
                      fill="var(--color-value, #8b5cf6)" 
                    />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-white/90 dark:bg-black/40 backdrop-blur-sm border-purple-100 dark:border-purple-900/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle className="h-5 w-5" />
              <span>Recent Clients</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {recentClients.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Purchases</TableHead>
                    <TableHead>Total Spent</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentClients.map((client) => (
                    <TableRow key={client.id}>
                      <TableCell className="font-medium">{client.email}</TableCell>
                      <TableCell>{client.purchase_count}</TableCell>
                      <TableCell>₹{parseFloat(client.total_purchases.toString()).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No client data available
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientsDashboard;

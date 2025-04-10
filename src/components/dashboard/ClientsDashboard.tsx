
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { supabase } from "@/integrations/supabase/client";

interface ClientsDashboardProps {
  userEmail: string;
}

// Define proper interfaces for our data
interface ClientData {
  email: string;
  billCount: number;
  totalSpent: number;
}

interface TopClientData {
  name: string;
  spent: number;
}

const ClientsDashboard: React.FC<ClientsDashboardProps> = ({ userEmail }) => {
  const [clientData, setClientData] = useState<ClientData[]>([]);
  const [topClients, setTopClients] = useState<TopClientData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchClientData = async () => {
      setIsLoading(true);
      try {
        // Get bills data filtered by the current user's email
        const { data: billsData, error } = await supabase
          .from('bills')
          .select('*')
          .eq('customer_email', userEmail);

        if (error) {
          console.error('Error fetching client data:', error);
          return;
        }

        if (billsData) {
          // Process client data
          const clientMap: Record<string, ClientData> = {};
          
          billsData.forEach(bill => {
            const clientEmail = bill.customer_email;
            if (!clientMap[clientEmail]) {
              clientMap[clientEmail] = {
                email: clientEmail,
                billCount: 0,
                totalSpent: 0
              };
            }
            
            clientMap[clientEmail].billCount += 1;
            clientMap[clientEmail].totalSpent += bill.total || 0;
          });
          
          const clients = Object.values(clientMap);
          
          // Sort by total spent
          const sortedClients = [...clients].sort((a, b) => b.totalSpent - a.totalSpent);
          
          setClientData(sortedClients);
          setTopClients(sortedClients.slice(0, 5).map(client => ({
            name: client.email.split('@')[0], // Just use the part before @ for brevity
            spent: client.totalSpent
          })));
        }
      } catch (error) {
        console.error('Error in clients data fetch:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (userEmail) {
      fetchClientData();

      // Subscribe to real-time updates
      const channel = supabase
        .channel('clients-updates')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'bills',
            filter: `customer_email=eq.${userEmail}`
          },
          () => {
            // Refresh data when a new bill is added
            fetchClientData();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [userEmail]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading client data...</div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Clients by Spending</CardTitle>
        </CardHeader>
        <CardContent className="h-[400px]">
          {topClients.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topClients}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`₹${value}`, 'Spent']}
                  labelFormatter={(label) => `Client: ${label}`}
                />
                <Bar dataKey="spent" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500 dark:text-gray-400">No client data available</div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Client Purchase Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-left">Client Email</th>
                  <th className="py-2 text-right">Invoices</th>
                  <th className="py-2 text-right">Total Spent</th>
                </tr>
              </thead>
              <tbody>
                {clientData.length > 0 ? (
                  clientData.map((client) => (
                    <tr key={client.email} className="border-b">
                      <td className="py-2 text-left">{client.email}</td>
                      <td className="py-2 text-right">{client.billCount}</td>
                      <td className="py-2 text-right">₹{client.totalSpent.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="py-4 text-center text-gray-500 dark:text-gray-400">
                      No client data available
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

export default ClientsDashboard;

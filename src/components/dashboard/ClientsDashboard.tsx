
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useClientsData } from "@/hooks/useClientsData";
import ClientsTable from './clients/ClientsTable';
import ClientsBarChart from './clients/ClientsBarChart';
import SalesMetricCard from './sales/SalesMetricCard';

interface ClientsDashboardProps {
  userEmail: string;
}

const ClientsDashboard: React.FC<ClientsDashboardProps> = ({ userEmail }) => {
  const { clientsData, topClients, totalClients, isLoading } = useClientsData(userEmail);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SalesMetricCard 
        title="Total Clients" 
        value={totalClients}
        subtitle="Active clients"
      />
      
      <Card className="md:col-span-2 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Top Clients</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ClientsBarChart topClients={topClients} isLoading={isLoading} />
        </CardContent>
      </Card>
      
      <Card className="md:col-span-3 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>All Clients</CardTitle>
        </CardHeader>
        <CardContent>
          <ClientsTable clientsData={clientsData} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
};

export default ClientsDashboard;

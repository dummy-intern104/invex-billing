
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Client } from '@/types/billing';

interface ClientsBarChartProps {
  topClients: Client[];
  isLoading: boolean;
}

const ClientsBarChart: React.FC<ClientsBarChartProps> = ({ topClients, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">Loading client data...</div>
      </div>
    );
  }

  if (topClients.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-gray-500 dark:text-gray-400">No client data available</div>
      </div>
    );
  }

  const chartData = topClients.map(client => ({
    name: client.name || client.email.split('@')[0],
    amount: client.total_purchases
  }));

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip 
          formatter={(value) => [`₹${value}`, 'Amount']}
          labelFormatter={(label) => `Client: ${label}`}
        />
        <Bar dataKey="amount" fill="#82ca9d" />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default ClientsBarChart;

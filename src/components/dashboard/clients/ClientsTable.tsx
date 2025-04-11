
import React from 'react';
import { Client } from '@/types/billing';

interface ClientsTableProps {
  clientsData: Client[];
  isLoading: boolean;
}

const ClientsTable: React.FC<ClientsTableProps> = ({ clientsData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500 dark:text-gray-400">Loading client data...</div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="py-2 text-left">Client</th>
            <th className="py-2 text-left">Email</th>
            <th className="py-2 text-right">Purchase Count</th>
            <th className="py-2 text-right">Total Purchases</th>
          </tr>
        </thead>
        <tbody>
          {clientsData.length > 0 ? (
            clientsData.map((client) => (
              <tr key={client.id} className="border-b">
                <td className="py-2 text-left">{client.name || client.email.split('@')[0]}</td>
                <td className="py-2 text-left">{client.email}</td>
                <td className="py-2 text-right">{client.purchase_count}</td>
                <td className="py-2 text-right">₹{client.total_purchases.toLocaleString()}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4} className="py-4 text-center text-gray-500 dark:text-gray-400">
                No client data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ClientsTable;

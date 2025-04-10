
import React from 'react';
import { useSalesData } from '@/hooks/useSalesData';
import SalesMetricCard from './sales/SalesMetricCard';
import SalesBarChart from './sales/SalesBarChart';
import SalesPieChart from './sales/SalesPieChart';

interface SalesDashboardProps {
  userEmail: string;
}

const SalesDashboard: React.FC<SalesDashboardProps> = ({ userEmail }) => {
  const { salesData, totalSales, averageSale, invoiceCount, isLoading } = useSalesData(userEmail);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <SalesMetricCard 
        title="Total Sales" 
        value={`₹${totalSales.toLocaleString()}`}
        subtitle={`From ${invoiceCount} invoices`}
      />
      
      <SalesMetricCard 
        title="Average Sale" 
        value={`₹${averageSale.toLocaleString(undefined, { maximumFractionDigits: 0 })}`}
        subtitle="Per invoice"
      />
      
      <SalesMetricCard 
        title="Invoice Count" 
        value={invoiceCount}
        subtitle="Total invoices"
      />
      
      <SalesBarChart salesData={salesData} isLoading={isLoading} />
      
      <SalesPieChart salesData={salesData} isLoading={isLoading} />
    </div>
  );
};

export default SalesDashboard;

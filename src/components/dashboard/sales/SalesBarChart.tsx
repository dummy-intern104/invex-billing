
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesDataItem {
  name: string;
  amount: number;
}

interface SalesBarChartProps {
  salesData: SalesDataItem[];
  isLoading: boolean;
}

const SalesBarChart: React.FC<SalesBarChartProps> = ({ salesData, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="md:col-span-2 bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sales Overview</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <div className="flex items-center justify-center h-full">
            <div className="text-gray-500 dark:text-gray-400">Loading sales data...</div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
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
  );
};

export default SalesBarChart;


import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

interface SalesDataItem {
  name: string;
  amount: number;
}

interface SalesPieChartProps {
  salesData: SalesDataItem[];
  isLoading: boolean;
}

const SalesPieChart: React.FC<SalesPieChartProps> = ({ salesData, isLoading }) => {
  const COLORS = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c'];

  if (isLoading) {
    return (
      <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Sales Distribution</CardTitle>
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
  );
};

export default SalesPieChart;

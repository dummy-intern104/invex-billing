
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface SalesMetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
}

const SalesMetricCard: React.FC<SalesMetricCardProps> = ({ title, value, subtitle }) => {
  return (
    <Card className="bg-white/90 dark:bg-gray-800/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {subtitle && (
          <p className="text-xs text-muted-foreground">
            {subtitle}
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default SalesMetricCard;

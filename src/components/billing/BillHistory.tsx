
import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Receipt } from "lucide-react";
import { BillHistoryItem } from "@/types/billing";

interface BillHistoryProps {
  billHistory: BillHistoryItem[];
}

const BillHistory: React.FC<BillHistoryProps> = ({ billHistory }) => {
  return (
    <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
      <CardContent className="p-6">
        <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
          Recent Bills
        </h2>
        
        <div className="space-y-3">
          {billHistory.map((bill, index) => (
            <div 
              key={index} 
              className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center">
                  <Receipt className="h-4 w-4 text-purple-500 mr-2" />
                  <div>
                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{bill.id}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{bill.customer}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-800 dark:text-gray-200">${bill.total.toFixed(2)}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{bill.date}</p>
                </div>
              </div>
            </div>
          ))}
          
          {billHistory.length === 0 && (
            <div className="text-center py-6 text-gray-500 dark:text-gray-400">
              No bills generated yet
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BillHistory;

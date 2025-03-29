
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BillFormHeaderProps {
  billNumber: string;
  onBillNumberChange: (value: string) => void;
}

const BillFormHeader: React.FC<BillFormHeaderProps> = ({
  billNumber,
  onBillNumberChange
}) => {
  return (
    <div className="space-y-3">
      <Label htmlFor="bill" className="text-gray-700 dark:text-gray-200 font-medium">Invoice Number</Label>
      <Input 
        id="bill" 
        value={billNumber}
        onChange={(e) => onBillNumberChange(e.target.value)}
        placeholder="Enter invoice number" 
        className="border-gray-300 focus-visible:ring-purple-400"
      />
    </div>
  );
};

export default BillFormHeader;

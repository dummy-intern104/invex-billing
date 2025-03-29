
import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface BillCustomerInfoProps {
  email: string;
  onEmailChange: (value: string) => void;
}

const BillCustomerInfo: React.FC<BillCustomerInfoProps> = ({
  email,
  onEmailChange
}) => {
  return (
    <div className="space-y-3">
      <div>
        <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium mb-2 block">
          Customer Email
        </Label>
        <Input 
          id="email" 
          placeholder="customer@example.com" 
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
          className="border-gray-300 focus-visible:ring-purple-400"
        />
      </div>
      <div className="text-xs text-gray-500">
        <p>Note: Customer name and address will be auto-generated from email for the invoice.</p>
      </div>
    </div>
  );
};

export default BillCustomerInfo;

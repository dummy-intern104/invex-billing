
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
    <div>
      <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium mb-2 block">
        Customer Email/Number
      </Label>
      <Input 
        id="email" 
        placeholder="customer@example.com" 
        value={email}
        onChange={(e) => onEmailChange(e.target.value)}
        className="border-gray-300 focus-visible:ring-purple-400"
      />
    </div>
  );
};

export default BillCustomerInfo;

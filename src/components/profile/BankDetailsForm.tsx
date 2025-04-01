
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CompanyProfile } from "@/types/company";

interface BankDetailsFormProps {
  bankData: CompanyProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BankDetailsForm: React.FC<BankDetailsFormProps> = ({
  bankData,
  onChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Bank Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="bank_name">Bank Name</Label>
          <Input
            id="bank_name"
            name="bank_name"
            value={bankData.bank_name}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_number">Account Number</Label>
          <Input
            id="account_number"
            name="account_number"
            value={bankData.account_number}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="ifsc_code">IFSC Code</Label>
          <Input
            id="ifsc_code"
            name="ifsc_code"
            value={bankData.ifsc_code}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="account_holder_name">Account Holder's Name</Label>
          <Input
            id="account_holder_name"
            name="account_holder_name"
            value={bankData.account_holder_name}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

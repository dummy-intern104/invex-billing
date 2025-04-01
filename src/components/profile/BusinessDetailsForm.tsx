
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CompanyProfile } from "@/types/company";

interface BusinessDetailsFormProps {
  businessData: CompanyProfile;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}

export const BusinessDetailsForm: React.FC<BusinessDetailsFormProps> = ({
  businessData,
  onChange
}) => {
  return (
    <div>
      <h3 className="text-lg font-medium mb-4">Business Details</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="company_name">Company Name</Label>
          <Input
            id="company_name"
            name="company_name"
            value={businessData.company_name}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            value={businessData.email}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            name="phone"
            value={businessData.phone}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gstin">GSTIN</Label>
          <Input
            id="gstin"
            name="gstin"
            value={businessData.gstin}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State</Label>
          <Input
            id="state"
            name="state"
            value={businessData.state}
            onChange={onChange}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label htmlFor="address">Address</Label>
          <Textarea
            id="address"
            name="address"
            value={businessData.address}
            onChange={onChange}
            rows={3}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>
      </div>
    </div>
  );
};

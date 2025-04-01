
import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintHeaderProps {
  companyData: CompanyProfile;
}

const BillPrintHeader: React.FC<BillPrintHeaderProps> = ({ companyData }) => {
  return (
    <div className="header">
      <div className="logo">
        {companyData.logo_url ? (
          <img src={companyData.logo_url} alt="Company Logo" width="80" />
        ) : (
          <div className="w-20 h-20 border border-dashed flex items-center justify-center">
            <span className="text-xs text-gray-400">No Logo</span>
          </div>
        )}
      </div>
      <div className="company-details">
        <h2 className="text-lg font-bold mb-0">{companyData.company_name}</h2>
        <p className="text-sm mb-0">{companyData.address}</p>
        <p className="text-sm mb-0">Phone no.: {companyData.phone} Email: {companyData.email}</p>
        <p className="text-sm mb-0">GSTIN: {companyData.gstin}, State: {companyData.state}</p>
      </div>
    </div>
  );
};

export default BillPrintHeader;


import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintHeaderProps {
  companyData: CompanyProfile;
}

const BillPrintHeader: React.FC<BillPrintHeaderProps> = ({ companyData }) => {
  return (
    <div className="header flex justify-between items-center">
      <div className="logo">
        {companyData.logo_url ? (
          <img src={companyData.logo_url} alt="Company Logo" width="60" height="60" />
        ) : (
          <div className="w-16 h-16 border border-dashed flex items-center justify-center">
            <span className="text-xs text-gray-400">No Logo</span>
          </div>
        )}
      </div>
      <div className="company-details text-right">
        <h2 className="text-base font-bold mb-0">{companyData.company_name}</h2>
        <p className="text-xs mb-0">{companyData.address}</p>
        <p className="text-xs mb-0">Phone no.: {companyData.phone} Email: {companyData.email}</p>
        <p className="text-xs mb-0">GSTIN: {companyData.gstin}, State: {companyData.state}</p>
      </div>
    </div>
  );
};

export default BillPrintHeader;

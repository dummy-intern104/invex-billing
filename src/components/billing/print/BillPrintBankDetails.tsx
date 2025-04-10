
import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintBankDetailsProps {
  companyData: CompanyProfile;
}

const BillPrintBankDetails: React.FC<BillPrintBankDetailsProps> = ({
  companyData
}) => {
  return (
    <div className="bank-details mt-3">
      <div className="section-header bg-[#1EAEDB] text-white px-2 py-1 text-xs">Bank Details</div>
      <div className="p-1 border border-gray-300">
        <p className="text-xs mb-0">Name: {companyData.bank_name}</p>
        <p className="text-xs mb-0">Account No.: {companyData.account_number}</p>
        <p className="text-xs mb-0">IFSC code: {companyData.ifsc_code}</p>
        <p className="text-xs mb-0">Account holder's name: {companyData.account_holder_name}</p>
      </div>
    </div>
  );
};

export default BillPrintBankDetails;

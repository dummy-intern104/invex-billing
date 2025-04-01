
import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintBankDetailsProps {
  companyData: CompanyProfile;
}

const BillPrintBankDetails: React.FC<BillPrintBankDetailsProps> = ({
  companyData
}) => {
  return (
    <div className="bank-details mt-6">
      <div className="section-header bg-blue-500 text-white px-2 py-1">Bank Details</div>
      <div className="p-2 border border-gray-300">
        <p className="text-sm mb-1">Name: {companyData.bank_name}</p>
        <p className="text-sm mb-1">Account No.: {companyData.account_number}</p>
        <p className="text-sm mb-1">IFSC code: {companyData.ifsc_code}</p>
        <p className="text-sm mb-1">Account holder's name: {companyData.account_holder_name}</p>
      </div>
    </div>
  );
};

export default BillPrintBankDetails;

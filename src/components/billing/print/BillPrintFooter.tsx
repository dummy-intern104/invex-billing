
import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintFooterProps {
  companyData: CompanyProfile;
}

const BillPrintFooter: React.FC<BillPrintFooterProps> = ({
  companyData
}) => {
  return (
    <div className="footer mt-6 flex justify-between">
      <div className="w-1/2">
        <p>For: {companyData.company_name}</p>
      </div>
      <div className="w-1/2 text-right">
        <div className="mt-8 flex justify-end">
          {companyData.signature_url ? (
            <img 
              src={companyData.signature_url} 
              alt="Authorized Signature" 
              className="signature-image"
            />
          ) : null}
        </div>
        <p>Authorized Signatory</p>
      </div>
    </div>
  );
};

export default BillPrintFooter;


import React from "react";
import { CompanyProfile } from "@/types/company";

interface BillPrintFooterProps {
  companyData: CompanyProfile;
}

const BillPrintFooter: React.FC<BillPrintFooterProps> = ({
  companyData
}) => {
  return (
    <div className="footer mt-3 flex justify-between">
      <div className="w-1/2">
        <p className="text-xs mb-0">For: {companyData.company_name}</p>
      </div>
      <div className="w-1/2 text-right">
        <div className="mt-4 flex justify-end">
          {companyData.signature_url ? (
            <img 
              src={companyData.signature_url} 
              alt="Authorized Signature" 
              className="signature-image"
              style={{ maxWidth: "100px", maxHeight: "40px" }}
            />
          ) : null}
        </div>
        <p className="text-xs mb-0">Authorized Signatory</p>
      </div>
    </div>
  );
};

export default BillPrintFooter;

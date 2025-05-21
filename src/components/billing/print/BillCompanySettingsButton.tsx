
import React from "react";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BillCompanySettingsButton: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex justify-end mb-4">
      <Button
        variant="outline"
        size="sm"
        className="flex items-center gap-1 text-xs"
        onClick={() => navigate('/company-profile')}
      >
        <Settings className="h-3 w-3" />
        Edit Company Details
      </Button>
    </div>
  );
};

export default BillCompanySettingsButton;

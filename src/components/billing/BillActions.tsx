
import React from "react";
import { Button } from "@/components/ui/button";
import { Check, Loader2, Printer, X } from "lucide-react";

interface BillActionsProps {
  onPaymentStatus: (status: 'paid' | 'cancelled') => void;
  onPrint: () => void;
  onBackToEdit: () => void;
  isLoading: boolean;
}

const BillActions: React.FC<BillActionsProps> = ({
  onPaymentStatus,
  onPrint,
  onBackToEdit,
  isLoading
}) => {
  return (
    <div className="flex flex-wrap justify-center gap-3 mt-8">
      <Button 
        onClick={() => onPaymentStatus('paid')} 
        variant="default"
        className="bg-green-600 hover:bg-green-700"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Check className="h-4 w-4 mr-2" />
            Mark as Paid
          </>
        )}
      </Button>
      
      <Button 
        onClick={onPrint} 
        variant="default"
        className="bg-blue-600 hover:bg-blue-700"
        disabled={isLoading}
      >
        <Printer className="h-4 w-4 mr-2" />
        Print Invoice
      </Button>
      
      <Button 
        onClick={() => onPaymentStatus('cancelled')} 
        variant="outline"
        className="border-red-300 text-red-700 hover:bg-red-50"
        disabled={isLoading}
      >
        <X className="h-4 w-4 mr-2" />
        Cancel
      </Button>
      
      <Button 
        onClick={onBackToEdit} 
        variant="outline"
        disabled={isLoading}
      >
        Back to Edit
      </Button>
    </div>
  );
};

export default BillActions;

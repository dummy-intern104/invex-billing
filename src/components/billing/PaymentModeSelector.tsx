
import React from "react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { DollarSign, CreditCard, Wallet } from "lucide-react";
import { PaymentMode } from "@/hooks/useBillForm";

interface PaymentModeSelectorProps {
  paymentMode: PaymentMode;
  onPaymentModeChange: (mode: PaymentMode) => void;
}

const PaymentModeSelector: React.FC<PaymentModeSelectorProps> = ({
  paymentMode,
  onPaymentModeChange
}) => {
  return (
    <div className="space-y-2">
      <Label className="font-medium">Payment Mode</Label>
      <RadioGroup
        value={paymentMode}
        onValueChange={(value) => onPaymentModeChange(value as PaymentMode)}
        className="grid grid-cols-2 gap-4 sm:grid-cols-4"
      >
        <div>
          <RadioGroupItem value="Cash" id="cash" className="peer sr-only" />
          <Label
            htmlFor="cash"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <DollarSign className="h-6 w-6 mb-2" />
            Cash
          </Label>
        </div>
        <div>
          <RadioGroupItem value="Card" id="card" className="peer sr-only" />
          <Label
            htmlFor="card"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <CreditCard className="h-6 w-6 mb-2" />
            Card
          </Label>
        </div>
        <div>
          <RadioGroupItem value="UPI" id="upi" className="peer sr-only" />
          <Label
            htmlFor="upi"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <Wallet className="h-6 w-6 mb-2" />
            UPI
          </Label>
        </div>
        <div>
          <RadioGroupItem value="Unpaid" id="unpaid" className="peer sr-only" />
          <Label
            htmlFor="unpaid"
            className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary"
          >
            <div className="h-6 w-6 mb-2 relative">
              <CreditCard className="absolute" />
              <div className="absolute w-full h-0.5 bg-red-500 transform rotate-45 top-1/2 -translate-y-1/2"></div>
            </div>
            Unpaid
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
};

export default PaymentModeSelector;

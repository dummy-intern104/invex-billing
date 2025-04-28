
import { BillItem } from "@/integrations/supabase/database.types";
import { calculateSubtotal, calculateTax, calculateTotal } from "@/utils/billCalculations";

export const useBillCalculation = (items: BillItem[]) => {
  const getSubtotal = () => calculateSubtotal(items);
  const getTax = () => calculateTax(items);
  const getTotal = () => calculateTotal(items);

  return {
    getSubtotal,
    getTax,
    getTotal
  };
};

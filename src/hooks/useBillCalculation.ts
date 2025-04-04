
import { BillItem } from "@/types/billing";
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


import { BillItem } from "@/types/billing";

// Tax rate (18% GST for India)
export const TAX_RATE = 0.18;

export const calculateSubtotal = (items: BillItem[]): number => {
  return items.reduce((total, item) => total + (item.quantity * item.price), 0);
};

export const calculateTax = (items: BillItem[]): number => {
  return calculateSubtotal(items) * TAX_RATE;
};

export const calculateTotal = (items: BillItem[]): number => {
  return calculateSubtotal(items) + calculateTax(items);
};

// Store the last used invoice number in localStorage
const getLastInvoiceNumber = (): number => {
  const lastNumber = localStorage.getItem('lastInvoiceNumber');
  return lastNumber ? parseInt(lastNumber, 10) : 1000; // Starting from 1000 instead of 100000
};

// Update the localStorage with the new invoice number
const setLastInvoiceNumber = (number: number): void => {
  localStorage.setItem('lastInvoiceNumber', number.toString());
};

// Generate a sequential invoice number
export const generateBillNumber = () => {
  const lastNumber = getLastInvoiceNumber();
  const newNumber = lastNumber + 1;
  setLastInvoiceNumber(newNumber);
  return `MRZ-${newNumber}`;
};

export const formatCurrency = (amount: number): string => {
  return amount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2
  });
};

export const validateBillForm = (
  billNumber: string,
  email: string,
  items: BillItem[]
): { isValid: boolean; errorMessage?: string } => {
  // Validate basic fields
  if (!billNumber.trim() || !email.trim()) {
    return {
      isValid: false,
      errorMessage: "Please fill in all required fields"
    };
  }
  
  // Check if at least one item is fully filled
  const validItems = items.filter(item => 
    item.product_name.trim() !== "" && 
    item.quantity > 0 && 
    item.price > 0
  );
  
  if (validItems.length === 0) {
    return {
      isValid: false,
      errorMessage: "Please add at least one valid item to the bill"
    };
  }

  return { isValid: true };
};


import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBillProduct } from "@/hooks/useBillProduct";
import { useBillItems } from "@/hooks/useBillItems";
import { useBillCalculation } from "@/hooks/useBillCalculation";
import { generateBillNumber, validateBillForm } from "@/utils/billCalculations";
import { BillItem } from "@/types/billing";

interface UseBillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
  onBillCreated?: (newBill: any) => void;
}

export type PaymentMode = 'UPI' | 'Card' | 'Cash' | 'Unpaid';

export const useBillForm = ({ onSubmit, onBillCreated }: UseBillFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [billNumber, setBillNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('pending');
  const [paymentMode, setPaymentMode] = useState<PaymentMode>('Unpaid');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  const { products } = useBillProduct();
  const { items, handleItemChange: baseHandleItemChange, updateItemWithProduct, addNewItem, resetItems, removeItem } = useBillItems();
  const { getSubtotal, getTax, getTotal } = useBillCalculation(items);

  // Generate initial bill number only once when component mounts
  useEffect(() => {
    // We don't generate a new bill number here anymore
    // This will be set when the dialog opens in Billing.tsx
  }, []);

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    if (field === 'product_id' && typeof value === 'string' && value !== 'manual' && value !== '') {
      updateItemWithProduct(index, value, products);
    } else {
      baseHandleItemChange(index, field, value);
    }
  };

  const handlePaymentStatus = (status: 'paid' | 'cancelled') => {
    setPaymentStatus(status);
    
    if (status === 'paid') {
      handleSubmit();
    } else if (status === 'cancelled') {
      toast({
        title: "Bill cancelled",
        description: "The bill has been cancelled",
      });
      
      // Do NOT generate a new bill number when cancelling
      setEmail("");
      resetItems();
      setPaymentStatus('pending');
      setShowPrintPreview(false);
    }
  };

  const handlePrintPreview = () => {
    const validation = validateBillForm(billNumber, email, items);
    
    if (!validation.isValid) {
      toast({
        title: "Missing information",
        description: validation.errorMessage,
        variant: "destructive",
      });
      return;
    }

    setShowPrintPreview(true);
  };

  const handleSubmit = async () => {
    if (!user?.email) {
      toast({
        title: "Authentication error",
        description: "You must be logged in to create bills",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      const total = getTotal();
      
      const billData = {
        bill_number: billNumber,
        customer_email: email,
        total: total,
        created_by: user.email,
        payment_mode: paymentMode,
        payment_date: paymentMode !== 'Unpaid' ? new Date().toISOString() : null
      };
      
      const { data: newBill, error: billError } = await supabase
        .from('bills')
        .insert(billData)
        .select()
        .single();
      
      if (billError) {
        console.error('Bill insert error:', billError);
        throw billError;
      }
      
      const validItems = items.filter(item => 
        item.product_name.trim() !== "" && 
        item.quantity > 0 && 
        item.price > 0
      );
      
      const billItems = validItems.map(item => ({
        bill_id: newBill.id,
        product_id: item.product_id === "manual" ? null : item.product_id,
        product_name: item.product_name,
        quantity: item.quantity,
        price: item.price
      }));
      
      const { error: itemsError } = await supabase
        .from('bill_items')
        .insert(billItems);
      
      if (itemsError) {
        console.error('Bill items insert error:', itemsError);
        throw itemsError;
      }
      
      // Call the new onBillCreated callback if it exists
      if (onBillCreated) {
        // Add items to the bill to match what BillHistory expects
        const enhancedBill = {
          ...newBill,
          items: billItems
        };
        onBillCreated(enhancedBill);
      }
      
      onSubmit(billNumber, email, items, total);
      
      // Generate a new bill number ONLY after successful payment
      // The invoice number is only changed AFTER a successful payment
      const newBillNumber = generateBillNumber();
      setBillNumber(newBillNumber);
      setEmail("");
      resetItems();
      setPaymentStatus('pending');
      setPaymentMode('Unpaid');
      setShowPrintPreview(false);
      
      toast({
        title: "Receipt sent",
        description: `Receipt has been successfully generated and sent to ${email}`,
      });
    } catch (error) {
      console.error('Error saving bill:', error);
      toast({
        title: "Error saving bill",
        description: "There was an error saving the bill",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    billNumber,
    email,
    items,
    products,
    isLoading,
    showPrintPreview,
    paymentMode,
    setBillNumber,
    setEmail,
    setPaymentMode,
    handleItemChange,
    addNewItem,
    removeItem,
    handlePaymentStatus,
    handlePrintPreview,
    getSubtotal,
    getTax,
    getTotal,
    setShowPrintPreview
  };
};

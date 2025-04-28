import { useState, useEffect } from "react";
import { BillItem, Bill } from "@/integrations/supabase/database.types";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useBillProduct } from "@/hooks/useBillProduct";
import { useBillItems } from "@/hooks/useBillItems";
import { useBillCalculation } from "@/hooks/useBillCalculation";

interface UseBillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
}

export const useBillForm = ({ onSubmit }: UseBillFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [billNumber, setBillNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('pending');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  const { products } = useBillProduct();
  const { items, handleItemChange: baseHandleItemChange, updateItemWithProduct, addNewItem, resetItems } = useBillItems();
  const { getSubtotal, getTax, getTotal } = useBillCalculation(items);

  useEffect(() => {
    setBillNumber(generateBillNumber());
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
      
      setBillNumber(generateBillNumber());
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
      
      console.log("Creating bill with user email:", user.email);
      
      const billData: Bill['Insert'] = {
        bill_number: billNumber,
        customer_email: email,
        total: total,
        created_by: user.email
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
      
      const billItems: BillItem['Insert'][] = validItems.map(item => ({
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
      
      onSubmit(billNumber, email, items, total);
      
      setBillNumber(generateBillNumber());
      setEmail("");
      resetItems();
      setPaymentStatus('pending');
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
    setBillNumber,
    setEmail,
    handleItemChange,
    addNewItem,
    handlePaymentStatus,
    handlePrintPreview,
    getSubtotal,
    getTax,
    getTotal,
    setShowPrintPreview
  };
};

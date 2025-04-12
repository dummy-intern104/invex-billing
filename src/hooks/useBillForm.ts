
import { useState, useEffect } from "react";
import { BillItem } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  generateBillNumber,
  validateBillForm
} from "@/utils/billCalculations";
import { useBillProduct } from "@/hooks/useBillProduct";
import { useBillItems } from "@/hooks/useBillItems";
import { useBillCalculation } from "@/hooks/useBillCalculation";
import { useAuth } from "@/context/AuthContext";

interface UseBillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
}

export const useBillForm = ({ onSubmit }: UseBillFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth(); // Get the current user
  const [billNumber, setBillNumber] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('pending');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  const { products } = useBillProduct();
  const { items, handleItemChange: baseHandleItemChange, updateItemWithProduct, addNewItem, resetItems } = useBillItems();
  const { getSubtotal, getTax, getTotal } = useBillCalculation(items);

  // Generate unique bill number on component mount
  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  // Wrap the handleItemChange to include product lookup
  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    if (field === 'product_id' && typeof value === 'string' && value !== 'manual' && value !== '') {
      // This is a product selection
      updateItemWithProduct(index, value, products);
    } else {
      // Let the base handler manage the change
      baseHandleItemChange(index, field, value);
    }
  };

  const handlePaymentStatus = (status: 'paid' | 'cancelled') => {
    setPaymentStatus(status);
    
    if (status === 'paid') {
      handleSubmit();
    } else if (status === 'cancelled') {
      // Reset form without saving
      toast({
        title: "Bill cancelled",
        description: "The bill has been cancelled",
      });
      
      // Reset form
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
      // Calculate total
      const total = getTotal();
      
      console.log("Creating bill with user email:", user.email);
      
      // Insert bill into bills table with created_by field
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          bill_number: billNumber,
          customer_email: email,
          total: total,
          created_by: user.email // Add the created_by field with the current user's email
        })
        .select();
      
      if (billError) {
        console.error('Bill insert error:', billError);
        throw billError;
      }
      
      // Insert bill items
      if (billData && billData.length > 0) {
        const billId = billData[0].id;
        
        // Map items to include bill_id
        const validItems = items.filter(item => 
          item.product_name.trim() !== "" && 
          item.quantity > 0 && 
          item.price > 0
        );
        
        const billItems = validItems.map(item => ({
          bill_id: billId,
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
      }
      
      // Call the parent component's submit handler
      onSubmit(billNumber, email, items, total);
      
      // Reset form
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

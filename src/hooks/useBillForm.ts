
import { useState, useEffect } from "react";
import { BillItem, Product } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import {
  calculateSubtotal,
  calculateTax,
  calculateTotal,
  generateBillNumber,
  validateBillForm
} from "@/utils/billCalculations";

interface UseBillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
}

export const useBillForm = ({ onSubmit }: UseBillFormProps) => {
  const { toast } = useToast();
  const [billNumber, setBillNumber] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<BillItem[]>([
    { product_id: "", product_name: "", quantity: 0, price: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('pending');
  const [showPrintPreview, setShowPrintPreview] = useState(false);

  // Fetch available products
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
          
        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  // Generate unique bill number on component mount
  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'price') {
      newItems[index][field] = Number(value) || 0;
    } else if (field === 'product_id' && typeof value === 'string') {
      // Handle the manual entry option
      if (value === "manual") {
        newItems[index].product_id = "manual";
        // Don't reset product_name if already set - let the user keep their manual entry
        if (!newItems[index].product_name) {
          newItems[index].product_name = "";
        }
        // Only reset price if it wasn't manually set or was 0
        if (newItems[index].price === 0) {
          newItems[index].price = 0;
        }
      } else if (value === "") {
        // If "Select Product" is chosen
        newItems[index].product_id = "";
        newItems[index].product_name = "";
        newItems[index].price = 0;
      } else {
        // Find the selected product
        const product = products.find(p => p.product_id === value);
        if (product) {
          newItems[index].product_id = product.product_id;
          newItems[index].product_name = product.name;
          newItems[index].price = product.price;
        }
      }
    } else {
      // For string fields like product_name
      // @ts-ignore - TypeScript doesn't know that these fields are strings
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { product_id: "", product_name: "", quantity: 0, price: 0 }]);
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
      setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
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
    setIsLoading(true);
    
    try {
      // Calculate total
      const total = calculateTotal(items);
      
      // Insert bill into bills table
      const { data: billData, error: billError } = await supabase
        .from('bills')
        .insert({
          bill_number: billNumber,
          customer_email: email,
          total: total
        })
        .select();
      
      if (billError) throw billError;
      
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
        
        if (itemsError) throw itemsError;
      }
      
      // Call the parent component's submit handler
      onSubmit(billNumber, email, items, total);
      
      // Reset form
      setBillNumber(generateBillNumber());
      setEmail("");
      setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
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

  // Helper functions for calculations
  const getSubtotal = () => calculateSubtotal(items);
  const getTax = () => calculateTax(items);
  const getTotal = () => calculateTotal(items);

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

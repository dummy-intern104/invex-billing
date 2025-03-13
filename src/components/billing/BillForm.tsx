
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2 } from "lucide-react";
import { BillItem, Product } from "@/types/billing";
import { supabase } from "@/integrations/supabase/client";
import { v4 as uuidv4 } from 'uuid';

interface BillFormProps {
  onSubmit: (billNumber: string, email: string, items: BillItem[], total: number) => void;
}

const BillForm: React.FC<BillFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [billNumber, setBillNumber] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<BillItem[]>([
    { product_id: "", product_name: "", quantity: 0, price: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);

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

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'price') {
      newItems[index][field] = Number(value) || 0;
    } else if (field === 'product_id' && typeof value === 'string') {
      // Find the selected product
      const product = products.find(p => p.product_id === value);
      if (product) {
        newItems[index].product_id = product.product_id;
        newItems[index].product_name = product.name;
        newItems[index].price = product.price;
      }
    } else {
      // @ts-ignore - TypeScript doesn't know that these fields are strings
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { product_id: "", product_name: "", quantity: 0, price: 0 }]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Validate basic fields
    if (!billNumber.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }
    
    // Check if at least one item is fully filled
    const validItems = items.filter(item => 
      item.product_id.trim() !== "" && 
      item.product_name.trim() !== "" && 
      item.quantity > 0 && 
      item.price > 0
    );
    
    if (validItems.length === 0) {
      toast({
        title: "No valid items",
        description: "Please add at least one valid item to the bill",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // Calculate total
      const total = calculateTotal();
      
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
        const billItems = validItems.map(item => ({
          bill_id: billId,
          product_id: item.product_id,
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
      onSubmit(billNumber, email, validItems, total);
      
      // Reset form
      setBillNumber(generateBillNumber());
      setEmail("");
      setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
      
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

  // Generate unique bill number
  const generateBillNumber = () => {
    return `BILL-${Date.now().toString().slice(-6)}`;
  };

  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="bill" className="text-gray-700 dark:text-gray-200 font-medium">Enter Bill</Label>
        <Input 
          id="bill" 
          value={billNumber}
          onChange={(e) => setBillNumber(e.target.value)}
          placeholder="Enter bill number or title" 
          className="border-gray-300 focus-visible:ring-purple-400"
        />
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <select
                value={item.product_id}
                onChange={(e) => handleItemChange(index, 'product_id', e.target.value)}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-400"
              >
                <option value="">Select Product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.product_id}>
                    {product.name} (${product.price.toFixed(2)})
                  </option>
                ))}
              </select>
            </div>
            <div className="col-span-4">
              <Input 
                placeholder="Product Name" 
                value={item.product_name}
                onChange={(e) => handleItemChange(index, 'product_name', e.target.value)}
                className="border-gray-300 focus-visible:ring-purple-400"
              />
            </div>
            <div className="col-span-2">
              <Input 
                placeholder="Quantity" 
                type="number"
                min="0"
                value={item.quantity || ""}
                onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                className="border-gray-300 focus-visible:ring-purple-400"
              />
            </div>
            <div className="col-span-3">
              <Input 
                placeholder="Price" 
                type="number"
                min="0"
                step="0.01"
                value={item.price || ""}
                onChange={(e) => handleItemChange(index, 'price', e.target.value)}
                className="border-gray-300 focus-visible:ring-purple-400"
              />
            </div>
          </div>
        ))}
        
        <Button 
          type="button" 
          variant="outline" 
          onClick={addNewItem}
          className="w-full border-dashed border-gray-300 hover:border-purple-400 hover:bg-purple-50 dark:hover:bg-purple-900/20"
        >
          + Add Item
        </Button>
      </div>
      
      <div className="grid grid-cols-12 gap-3 items-end">
        <div className="col-span-8">
          <Label htmlFor="email" className="text-gray-700 dark:text-gray-200 font-medium mb-2 block">
            Customer Email/Number
          </Label>
          <Input 
            id="email" 
            placeholder="customer@example.com" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border-gray-300 focus-visible:ring-purple-400"
          />
        </div>
        <div className="col-span-4">
          <div className="bg-black text-white p-2.5 rounded text-center font-medium">
            Total: ${calculateTotal().toFixed(2)}
          </div>
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Processing...
          </>
        ) : (
          <>
            <Send className="h-4 w-4 mr-2" />
            Send Receipt
          </>
        )}
      </Button>
    </form>
  );
};

export default BillForm;

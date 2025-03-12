
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send } from "lucide-react";
import { BillItem } from "@/types/billing";

interface BillFormProps {
  onSubmit: (bill: string, email: string, items: BillItem[], total: number) => void;
}

const BillForm: React.FC<BillFormProps> = ({ onSubmit }) => {
  const { toast } = useToast();
  const [bill, setBill] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<BillItem[]>([
    { id: "", name: "", quantity: 0, price: 0 }
  ]);

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const handleItemChange = (index: number, field: keyof BillItem, value: string | number) => {
    const newItems = [...items];
    
    if (field === 'quantity' || field === 'price') {
      newItems[index][field] = Number(value) || 0;
    } else {
      // @ts-ignore - TypeScript doesn't know that these fields are strings
      newItems[index][field] = value;
    }
    
    setItems(newItems);
  };

  const addNewItem = () => {
    setItems([...items, { id: "", name: "", quantity: 0, price: 0 }]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate basic fields
    if (!bill.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }
    
    // Check if at least one item is fully filled
    const validItems = items.filter(item => 
      item.id.trim() !== "" && 
      item.name.trim() !== "" && 
      item.quantity > 0 && 
      item.price > 0
    );
    
    if (validItems.length === 0) {
      toast({
        title: "No valid items",
        description: "Please add at least one valid item to the bill",
        variant: "destructive",
      });
      return;
    }
    
    // Call the parent component's submit handler
    onSubmit(bill, email, items, calculateTotal());
    
    // Reset form
    setBill("");
    setEmail("");
    setItems([{ id: "", name: "", quantity: 0, price: 0 }]);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-3">
        <Label htmlFor="bill" className="text-gray-700 dark:text-gray-200 font-medium">Enter Bill</Label>
        <Input 
          id="bill" 
          value={bill}
          onChange={(e) => setBill(e.target.value)}
          placeholder="Enter bill number or title" 
          className="border-gray-300 focus-visible:ring-purple-400"
        />
      </div>
      
      <div className="space-y-4">
        {items.map((item, index) => (
          <div key={index} className="grid grid-cols-12 gap-3">
            <div className="col-span-3">
              <Input 
                placeholder="Product ID" 
                value={item.id}
                onChange={(e) => handleItemChange(index, 'id', e.target.value)}
                className="border-gray-300 focus-visible:ring-purple-400"
              />
            </div>
            <div className="col-span-4">
              <Input 
                placeholder="Product Name" 
                value={item.name}
                onChange={(e) => handleItemChange(index, 'name', e.target.value)}
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
      >
        <Send className="h-4 w-4 mr-2" />
        Send Receipt
      </Button>
    </form>
  );
};

export default BillForm;

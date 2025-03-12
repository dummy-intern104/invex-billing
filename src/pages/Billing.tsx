
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Send, Receipt } from "lucide-react";

interface BillItem {
  id: string;
  name: string;
  quantity: number;
  price: number;
}

const Billing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bill, setBill] = useState("");
  const [email, setEmail] = useState("");
  const [items, setItems] = useState<BillItem[]>([
    { id: "", name: "", quantity: 0, price: 0 }
  ]);
  const [billHistory, setBillHistory] = useState<Array<{id: string, customer: string, total: number, date: string}>>([]);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Create sample bill history for UI
      setBillHistory([
        { id: "BILL-001", customer: "customer@example.com", total: 250, date: new Date().toLocaleDateString() },
        { id: "BILL-002", customer: "another@example.com", total: 175.50, date: new Date().toLocaleDateString() },
        { id: "BILL-003", customer: "test@example.com", total: 450, date: new Date().toLocaleDateString() }
      ]);
    }
  }, [user, navigate]);

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
    
    // Create new receipt and add to history
    const newBill = {
      id: `BILL-${String(billHistory.length + 1).padStart(3, '0')}`,
      customer: email,
      total: calculateTotal(),
      date: new Date().toLocaleDateString()
    };
    
    setBillHistory([newBill, ...billHistory]);
    
    // Reset form
    setBill("");
    setEmail("");
    setItems([{ id: "", name: "", quantity: 0, price: 0 }]);
    
    toast({
      title: "Receipt sent",
      description: `Receipt ${newBill.id} has been successfully generated and sent to ${email}`,
    });
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return null; // Don't render anything while checking auth state
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <header className="border-b border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider">
              Billing
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
            <Button variant="outline" onClick={handleLogout}>Logout</Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Billing Form - 7 columns on desktop */}
          <div className="md:col-span-7">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
              <CardContent className="p-6">
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
              </CardContent>
            </Card>
          </div>
          
          {/* Bill History - 5 columns on desktop */}
          <div className="md:col-span-5">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
              <CardContent className="p-6">
                <h2 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-200">
                  Recent Bills
                </h2>
                
                <div className="space-y-3">
                  {billHistory.map((bill, index) => (
                    <div 
                      key={index} 
                      className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                    >
                      <div className="flex justify-between items-center">
                        <div className="flex items-center">
                          <Receipt className="h-4 w-4 text-purple-500 mr-2" />
                          <div>
                            <h3 className="font-medium text-gray-800 dark:text-gray-200">{bill.id}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400">{bill.customer}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-gray-800 dark:text-gray-200">${bill.total.toFixed(2)}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{bill.date}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  
                  {billHistory.length === 0 && (
                    <div className="text-center py-6 text-gray-500 dark:text-gray-400">
                      No bills generated yet
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;

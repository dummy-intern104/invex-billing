
import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Send, Loader2, Printer, Check, X } from "lucide-react";
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
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'paid' | 'cancelled'>('pending');
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  
  // Tax rate (18% GST for India)
  const TAX_RATE = 0.18;

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

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.quantity * item.price), 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * TAX_RATE;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
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

  const handlePaymentStatus = (status: 'paid' | 'cancelled') => {
    setPaymentStatus(status);
    
    if (status === 'paid') {
      handleSubmit();
    } else {
      toast({
        title: "Bill cancelled",
        description: "The bill has been cancelled",
        variant: "destructive",
      });
      // Reset form
      setBillNumber(generateBillNumber());
      setEmail("");
      setItems([{ product_id: "", product_name: "", quantity: 0, price: 0 }]);
      setPaymentStatus('pending');
    }
  };

  const handlePrintPreview = () => {
    // Validate basic fields
    if (!billNumber.trim() || !email.trim()) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
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
      return;
    }

    setShowPrintPreview(true);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
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
        const validItems = items.filter(item => 
          item.product_id.trim() !== "" && 
          item.product_name.trim() !== "" && 
          item.quantity > 0 && 
          item.price > 0
        );
        
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

  // Generate unique bill number
  const generateBillNumber = () => {
    return `INV-${Date.now().toString().slice(-6)}`;
  };

  useEffect(() => {
    setBillNumber(generateBillNumber());
  }, []);

  return (
    <div>
      {showPrintPreview ? (
        <div className="print-preview bg-white p-6 rounded-lg border border-gray-200 shadow-lg">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">INVOICE</h2>
            <div>
              <p className="font-medium text-gray-700">Invoice #: {billNumber}</p>
              <p className="text-sm text-gray-600">Date: {new Date().toLocaleDateString()}</p>
            </div>
          </div>
          
          <div className="mb-6">
            <p className="font-medium text-gray-700">Customer: {email}</p>
          </div>
          
          <table className="w-full mb-6">
            <thead className="border-b-2 border-gray-300">
              <tr>
                <th className="text-left py-2">Item</th>
                <th className="text-right py-2">Qty</th>
                <th className="text-right py-2">Price</th>
                <th className="text-right py-2">Total</th>
              </tr>
            </thead>
            <tbody>
              {items.filter(item => item.product_id && item.quantity > 0).map((item, index) => (
                <tr key={index} className="border-b border-gray-200">
                  <td className="py-2">{item.product_name}</td>
                  <td className="text-right py-2">{item.quantity}</td>
                  <td className="text-right py-2">₹{item.price.toFixed(2)}</td>
                  <td className="text-right py-2">₹{(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot className="border-t-2 border-gray-300">
              <tr>
                <td colSpan={3} className="text-right py-2 font-medium">Subtotal:</td>
                <td className="text-right py-2">₹{calculateSubtotal().toFixed(2)}</td>
              </tr>
              <tr>
                <td colSpan={3} className="text-right py-2 font-medium">GST (18%):</td>
                <td className="text-right py-2">₹{calculateTax().toFixed(2)}</td>
              </tr>
              <tr className="font-bold">
                <td colSpan={3} className="text-right py-2">Total:</td>
                <td className="text-right py-2">₹{calculateTotal().toFixed(2)}</td>
              </tr>
            </tfoot>
          </table>
          
          <div className="flex justify-center space-x-4 mt-8">
            <Button 
              onClick={() => handlePaymentStatus('paid')} 
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Mark as Paid
                </>
              )}
            </Button>
            
            <Button 
              onClick={() => handlePaymentStatus('cancelled')} 
              variant="outline"
              className="border-red-300 text-red-700 hover:bg-red-50"
              disabled={isLoading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            
            <Button 
              onClick={() => setShowPrintPreview(false)} 
              variant="outline"
              disabled={isLoading}
            >
              Back to Edit
            </Button>
          </div>
        </div>
      ) : (
        <form onSubmit={(e) => { e.preventDefault(); handlePrintPreview(); }} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="bill" className="text-gray-700 dark:text-gray-200 font-medium">Invoice Number</Label>
            <Input 
              id="bill" 
              value={billNumber}
              onChange={(e) => setBillNumber(e.target.value)}
              placeholder="Enter invoice number" 
              className="border-gray-300 focus-visible:ring-purple-400"
            />
          </div>
          
          <div className="space-y-4">
            <h3 className="font-medium text-gray-700 dark:text-gray-200">Item Entry</h3>
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
                        {product.name} (₹{product.price.toFixed(2)})
                        {product.stock <= 0 ? ' - Out of Stock' : product.stock < 5 ? ` - Only ${product.stock} left` : ''}
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
                    prefix="₹"
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
                <div className="text-xs text-gray-400">Subtotal: ₹{calculateSubtotal().toFixed(2)}</div>
                <div className="text-xs text-gray-400">GST (18%): ₹{calculateTax().toFixed(2)}</div>
                <div>Total: ₹{calculateTotal().toFixed(2)}</div>
              </div>
            </div>
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
          >
            <Printer className="h-4 w-4 mr-2" />
            Generate Bill
          </Button>
        </form>
      )}
    </div>
  );
};

export default BillForm;

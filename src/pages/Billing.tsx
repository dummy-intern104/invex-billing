
import React from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";

const Billing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Redirect to login if not authenticated
  React.useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Invoice generated",
      description: "Your invoice has been successfully generated",
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
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider">
            Invex AI Billing
          </h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">
                Generate Invoice
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                Create a new invoice for your customer
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer" className="text-gray-700 dark:text-gray-200">Customer Name</Label>
                  <Input 
                    id="customer" 
                    placeholder="Enter customer name" 
                    className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="amount" className="text-gray-700 dark:text-gray-200">Amount</Label>
                  <Input 
                    id="amount" 
                    type="number" 
                    placeholder="0.00" 
                    className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description" className="text-gray-700 dark:text-gray-200">Description</Label>
                  <Input 
                    id="description" 
                    placeholder="Enter description" 
                    className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white"
                >
                  Generate Invoice
                </Button>
              </CardFooter>
            </form>
          </Card>

          <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30">
            <CardHeader>
              <CardTitle className="text-xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">
                Recent Transactions
              </CardTitle>
              <CardDescription className="text-center text-gray-600 dark:text-gray-300">
                View your recent billing activity
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Customer A</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invoice #001</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-gray-200">$250.00</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2023-07-01</p>
                    </div>
                  </div>
                </div>
                <div className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Customer B</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invoice #002</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-gray-200">$175.50</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2023-06-25</p>
                    </div>
                  </div>
                </div>
                <div className="border border-purple-100 dark:border-purple-800/30 rounded-md p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <h3 className="font-medium text-gray-800 dark:text-gray-200">Customer C</h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">Invoice #003</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-gray-800 dark:text-gray-200">$450.00</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">2023-06-18</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Billing;

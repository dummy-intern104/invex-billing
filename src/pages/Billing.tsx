
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import BillingHeader from "@/components/billing/BillingHeader";
import BillForm from "@/components/billing/BillForm";
import BillHistory from "@/components/billing/BillHistory";
import { BillHistoryItem, BillItem } from "@/types/billing";

const Billing = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [billHistory, setBillHistory] = useState<BillHistoryItem[]>([]);
  
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

  const handleBillSubmit = (bill: string, email: string, items: BillItem[], total: number) => {
    // Create new receipt and add to history
    const newBill = {
      id: `BILL-${String(billHistory.length + 1).padStart(3, '0')}`,
      customer: email,
      total: total,
      date: new Date().toLocaleDateString()
    };
    
    setBillHistory([newBill, ...billHistory]);
    
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
      <BillingHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Billing Form - 7 columns on desktop */}
          <div className="md:col-span-7">
            <Card className="bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30 shadow-lg">
              <CardContent className="p-6">
                <BillForm onSubmit={handleBillSubmit} />
              </CardContent>
            </Card>
          </div>
          
          {/* Bill History - 5 columns on desktop */}
          <div className="md:col-span-5">
            <BillHistory billHistory={billHistory} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Billing;

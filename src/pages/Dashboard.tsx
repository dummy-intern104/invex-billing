
import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import BillingHeader from "@/components/billing/BillingHeader";
import SalesDashboard from "@/components/dashboard/SalesDashboard";
import ProductsDashboard from "@/components/dashboard/ProductsDashboard";
import ClientsDashboard from "@/components/dashboard/ClientsDashboard";
import MobileNavbar from "@/components/layout/MobileNavbar";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("sales");
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      // Only for display purposes, to show loading state
      setTimeout(() => setLoading(false), 500);
    }
  }, [user, navigate]);
  
  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-r from-indigo-500/10 via-purple-500/10 to-pink-500/10">
      <BillingHeader user={user} onLogout={handleLogout} />

      <main className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">Business Dashboard</h1>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 bg-white/20 dark:bg-black/20 backdrop-blur-sm">
            <TabsTrigger value="sales">Sales Overview</TabsTrigger>
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="clients">Clients</TabsTrigger>
          </TabsList>
          
          <TabsContent value="sales" className="space-y-6">
            <SalesDashboard userEmail={user.email} />
          </TabsContent>
          
          <TabsContent value="products" className="space-y-6">
            <ProductsDashboard userEmail={user.email} />
          </TabsContent>
          
          <TabsContent value="clients" className="space-y-6">
            <ClientsDashboard userEmail={user.email} />
          </TabsContent>
        </Tabs>
      </main>
      
      <MobileNavbar />
    </div>
  );
};

export default Dashboard;

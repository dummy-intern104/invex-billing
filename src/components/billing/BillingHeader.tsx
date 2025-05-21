
import React from "react";
import { User } from "@supabase/supabase-js";
import { Button } from "@/components/ui/button";
import { LogOut, ShoppingBag, LayoutDashboard, Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface BillingHeaderProps {
  user: User;
  onLogout: () => void;
}

const BillingHeader: React.FC<BillingHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-md shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
              POS System
            </h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-4">
              <Link 
                to="/billing" 
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 text-sm font-medium flex items-center gap-1"
              >
                <ShoppingBag className="h-4 w-4" />
                Billing
              </Link>
              <Link 
                to="/dashboard" 
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 text-sm font-medium flex items-center gap-1"
              >
                <LayoutDashboard className="h-4 w-4" />
                Dashboard
              </Link>
              <Link 
                to="/company-profile" 
                className="text-gray-600 hover:text-purple-600 dark:text-gray-300 dark:hover:text-purple-400 text-sm font-medium flex items-center gap-1"
              >
                <Settings className="h-4 w-4" />
                Company Details
              </Link>
            </nav>
            
            <div className="flex items-center space-x-2">
              <div className="text-sm text-gray-600 dark:text-gray-400 hidden sm:block">
                {user.email}
              </div>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onLogout}
                className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
              >
                <LogOut className="h-4 w-4" />
                <span className="sr-only md:not-sr-only md:ml-2">Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default BillingHeader;

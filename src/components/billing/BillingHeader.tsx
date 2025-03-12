
import React from "react";
import { Button } from "@/components/ui/button";
import { User } from "@supabase/supabase-js";

interface BillingHeaderProps {
  user: User;
  onLogout: () => Promise<void>;
}

const BillingHeader: React.FC<BillingHeaderProps> = ({ user, onLogout }) => {
  return (
    <header className="border-b border-purple-100 dark:border-purple-900/30 bg-white/80 dark:bg-black/20 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent tracking-wider">
            Billing
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700 dark:text-gray-300">{user.email}</span>
          <Button variant="outline" onClick={onLogout}>Logout</Button>
        </div>
      </div>
    </header>
  );
};

export default BillingHeader;

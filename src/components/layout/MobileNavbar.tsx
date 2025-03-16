
import React from "react";
import { Link } from "react-router-dom";
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from "@/components/ui/sheet";
import { Menu, FileText, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

const MobileNavbar: React.FC = () => {
  const isMobile = useIsMobile();

  return (
    <div className={`fixed ${isMobile ? 'top-4 left-4' : 'bottom-4 left-4'} z-50 md:hidden`}>
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" className="rounded-full shadow-lg bg-purple-600 hover:bg-purple-700 text-white">
            <Menu className="h-5 w-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[240px] bg-white/95 backdrop-blur-sm dark:bg-gray-900/95 p-0">
          <nav className="flex flex-col h-full py-6">
            <div className="px-4 mb-6">
              <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">
                POS System
              </h2>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Navigation
              </p>
            </div>

            <div className="flex-1 px-2 space-y-2">
              <Link 
                to="/billing" 
                className="flex items-center gap-3 px-3 py-3 text-sm rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300"
              >
                <FileText className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Billing
              </Link>
              <Link 
                to="/dashboard" 
                className="flex items-center gap-3 px-3 py-3 text-sm rounded-md hover:bg-purple-100 dark:hover:bg-purple-900/30 text-gray-700 dark:text-gray-300"
              >
                <LayoutDashboard className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                Dashboard
              </Link>
            </div>
          </nav>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MobileNavbar;

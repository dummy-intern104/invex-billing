
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Loader2, LogIn } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";

export function LoginForm() {
  const { isLoading } = useAuth();
  const [userRole, setUserRole] = useState("employee");
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userRole === "admin") {
      // For admin login, redirect directly to admin app
      window.location.href = "https://invexai-marzlet.netlify.app";
    } else {
      // For employee role - existing login logic
      navigate("/login");
    }
  };

  const handleRoleChange = (value: string) => {
    setUserRole(value);
  };

  return (
    <div className="w-full min-h-screen px-4 sm:px-0 py-4 sm:py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent break-words tracking-wider letter-spacing-wide">
          Invex AI
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 px-2 break-words">
          Your AI-powered investment assistant
        </p>
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-lg bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">
            {userRole === "admin" ? "Admin Login" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            {userRole === "admin" 
              ? "Click below to access admin portal" 
              : "Enter your credentials to sign in"}
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-gray-700 dark:text-gray-200">I am a:</Label>
              <RadioGroup 
                defaultValue="employee" 
                value={userRole}
                onValueChange={handleRoleChange}
                className="flex space-x-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="employee" id="employee" />
                  <Label htmlFor="employee" className="text-gray-700 dark:text-gray-200">Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="admin" id="admin" />
                  <Label htmlFor="admin" className="text-gray-700 dark:text-gray-200">Admin</Label>
                </div>
              </RadioGroup>
            </div>
            
            {/* Conditionally render email/password only for employee login */}
            {userRole === "employee" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
                  <Input 
                    id="email" 
                    name="email"
                    type="email" 
                    placeholder="your.email@example.com" 
                    required
                    className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                  <Input 
                    id="password" 
                    name="password"
                    type="password" 
                    required
                    className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                  />
                </div>
              </>
            )}
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            {userRole === "admin" ? (
              <Button 
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    <LogIn className="mr-2 h-4 w-4" /> 
                    Sign in to Admin Portal
                  </>
                )}
              </Button>
            ) : (
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white" 
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>Sign in</>
                )}
              </Button>
            )}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

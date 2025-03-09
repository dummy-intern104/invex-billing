
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export function LoginForm() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // This is a mock authentication
      // In a real app, you would connect this to a backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (formData.email && formData.password) {
        toast({
          title: "Login Successful",
          description: "Welcome back!",
        });
      } else {
        throw new Error("Please enter both email and password");
      }
    } catch (error) {
      toast({
        title: "Login Failed",
        description: error instanceof Error ? error.message : "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full shadow-lg bg-white/90 backdrop-blur-sm border-indigo-100 dark:bg-black/40 dark:border-purple-900/30">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">Welcome back</CardTitle>
        <CardDescription className="text-center text-gray-600 dark:text-gray-300">
          Enter your credentials to sign in
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 dark:text-gray-200">Email</Label>
            <Input 
              id="email" 
              name="email"
              type="email" 
              placeholder="your.email@example.com" 
              value={formData.email}
              onChange={handleChange}
              required
              className="border-indigo-100 focus-visible:ring-indigo-400 dark:border-purple-800/30"
            />
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
              <Button variant="link" className="px-0 font-normal h-auto text-indigo-600 hover:text-indigo-700 dark:text-purple-400 dark:hover:text-purple-300" type="button">
                Forgot password?
              </Button>
            </div>
            <Input 
              id="password" 
              name="password"
              type="password" 
              value={formData.password}
              onChange={handleChange}
              required
              className="border-indigo-100 focus-visible:ring-indigo-400 dark:border-purple-800/30"
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white" 
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Sign in"}
          </Button>
          <div className="text-center text-sm text-gray-600 dark:text-gray-300">
            Don't have an account?{" "}
            <Button variant="link" className="p-0 h-auto font-normal text-indigo-600 hover:text-indigo-700 dark:text-purple-400 dark:hover:text-purple-300" type="button">
              Sign up
            </Button>
          </div>
        </CardFooter>
      </form>
    </Card>
  );
}

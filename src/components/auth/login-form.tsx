
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export function LoginForm() {
  const { signIn, signUp, isLoading } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [userRole, setUserRole] = useState("employee");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (userRole === "admin") {
      // Redirect admin users directly to the external app
      window.location.href = "https://invexai-marzlet.netlify.app";
      return;
    }
    
    if (isSignUp) {
      await signUp(formData.email, formData.password, formData.username);
      // After successful signup, redirect to billing page
      window.location.href = "/billing";
    } else {
      const success = await signIn(formData.email, formData.password);
      // After successful signin, redirect to billing page
      if (success) {
        window.location.href = "/billing";
      }
    }
  };

  const toggleAuthMode = () => {
    setIsSignUp(!isSignUp);
  };

  return (
    <div className="w-full px-4 sm:px-0 py-4 sm:py-0">
      <div className="mb-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent break-words tracking-wider">
          Invex AI
        </h1>
        <p className="mt-2 text-gray-600 dark:text-gray-300 px-2 break-words">
          Your AI-powered investment assistant
        </p>
      </div>
      
      <Card className="w-full max-w-md mx-auto shadow-lg bg-white/90 backdrop-blur-sm border-purple-100 dark:bg-black/40 dark:border-purple-900/30">
        <CardHeader className="space-y-1">
          <CardTitle className="text-xl sm:text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-400">
            {isSignUp ? "Create Account" : "Welcome back"}
          </CardTitle>
          <CardDescription className="text-center text-gray-600 dark:text-gray-300">
            {isSignUp 
              ? "Enter your details to create your account" 
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
                onValueChange={setUserRole}
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
            
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="username" className="text-gray-700 dark:text-gray-200">Username</Label>
                <Input 
                  id="username" 
                  name="username"
                  type="text" 
                  placeholder="your_username" 
                  value={formData.username}
                  onChange={handleChange}
                  className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
                />
              </div>
            )}
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
                className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-gray-700 dark:text-gray-200">Password</Label>
                {!isSignUp && (
                  <Button variant="link" className="px-0 font-normal h-auto text-indigo-600 hover:text-indigo-700 dark:text-purple-400 dark:hover:text-purple-300" type="button">
                    Forgot password?
                  </Button>
                )}
              </div>
              <Input 
                id="password" 
                name="password"
                type="password" 
                value={formData.password}
                onChange={handleChange}
                required
                className="border-purple-100 focus-visible:ring-purple-400 dark:border-purple-800/30"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 hover:from-indigo-600 hover:via-purple-600 hover:to-pink-600 text-white" 
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isSignUp ? "Creating account..." : "Signing in..."}
                </>
              ) : (
                <>{isSignUp ? "Sign up" : "Sign in"}</>
              )}
            </Button>
            <div className="text-center text-sm text-gray-600 dark:text-gray-300">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <Button 
                variant="link" 
                className="p-0 h-auto font-normal text-indigo-600 hover:text-indigo-700 dark:text-purple-400 dark:hover:text-purple-300" 
                type="button"
                onClick={toggleAuthMode}
              >
                {isSignUp ? "Sign in" : "Sign up"}
              </Button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

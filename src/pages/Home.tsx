
import { useNavigate } from "react-router-dom";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useAuth } from "@/context/AuthContext";
import { FeaturesSection } from "@/components/sections/features-section";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleGetStartedClick = () => {
    if (user) {
      // If user is authenticated, redirect directly to the billing page for employees
      navigate("/billing");
    } else {
      // If not authenticated, redirect to login page
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen overflow-x-hidden flex flex-col">
      <BackgroundPaths 
        title="Invex AI"
        subtitle="Your AI-powered investment assistant that helps you make smarter financial decisions with real-time market analysis."
        primaryButtonText="Get Started"
        onPrimaryButtonClick={handleGetStartedClick}
        showLoginButton={true}
        onLoginClick={handleLoginClick}
      />
      <FeaturesSection />
      
      <footer className="mt-auto py-6 text-center text-sm text-gray-500 dark:text-gray-400 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
        <div className="container mx-auto px-4">
          © 2025 Marzlet Info Tech. Developed by our dedicated team. <a href="https://invexai-team.netlify.app" className="text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300 transition-colors" target="_blank" rel="noopener noreferrer">invexai-team.netlify.app</a>
        </div>
      </footer>
    </div>
  );
}

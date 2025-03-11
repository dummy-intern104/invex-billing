
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
    // Always go to login page regardless of auth status
    navigate("/login");
  };

  return (
    <div className="min-h-screen overflow-x-hidden">
      <BackgroundPaths 
        title="Invex AI"
        subtitle="Your AI-powered investment assistant that helps you make smarter financial decisions with real-time market analysis."
        primaryButtonText="Get Started"
        onPrimaryButtonClick={handleGetStartedClick}
        showLoginButton={true}
        onLoginClick={handleLoginClick}
      />
      <FeaturesSection />
    </div>
  );
}

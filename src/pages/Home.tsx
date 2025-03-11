
import { useNavigate } from "react-router-dom";
import { BackgroundPaths } from "@/components/ui/background-paths";
import { useAuth } from "@/context/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const handleLoginClick = () => {
    navigate("/login");
  };

  const handleGetStartedClick = () => {
    // If user is logged in, go to the external app, otherwise go to login
    if (user) {
      window.location.href = "https://invexai-marzlet.netlify.app";
    } else {
      navigate("/login");
    }
  };

  return (
    <BackgroundPaths 
      title="Invex AI"
      subtitle="Your AI-powered investment assistant that helps you make smarter financial decisions with real-time market analysis."
      primaryButtonText="Get Started"
      onPrimaryButtonClick={handleGetStartedClick}
      showLoginButton={true}
      onLoginClick={handleLoginClick}
    />
  );
}

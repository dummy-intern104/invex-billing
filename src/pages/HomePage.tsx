
import React from "react";
import { Button } from "@/components/ui/button";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <BackgroundBeamsWithCollision theme="gradient" speed="default" density="dense">
      <div className="min-h-screen flex flex-col items-center px-4 py-12 sm:py-24">
        {/* Header with login button */}
        <header className="w-full max-w-7xl flex justify-between items-center mb-12 sm:mb-24">
          <div className="flex items-center">
            <div className="w-10 h-10 bg-white/90 rounded-lg shadow-md flex items-center justify-center">
              <span className="text-indigo-600 font-bold text-xl">I</span>
            </div>
          </div>
          <Button 
            className="bg-white text-indigo-600 hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Login
          </Button>
        </header>

        {/* Main content */}
        <div className="w-full max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6">
              Invex AI
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8">
              Your AI-powered Investment Assistant
            </p>
            <Button
              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-medium px-8 py-6 h-auto text-lg"
              onClick={() => window.location.href = "https://invexai-marzlet.netlify.app"}
            >
              Get started
            </Button>
          </div>
          
          <div className="flex justify-center md:justify-end">
            <div className="relative w-full max-w-md">
              <img 
                src="/lovable-uploads/e9a2fe65-07cb-4a34-ab5c-6d996d04108f.png" 
                alt="AI Investment Assistant" 
                className="rounded-xl shadow-2xl"
              />
            </div>
          </div>
        </div>

        {/* Features section */}
        <div className="w-full max-w-7xl mt-24 sm:mt-32">
          <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-16">
            What we do?
          </h2>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                AI-Powered Analytics
              </h3>
              <p className="text-gray-600 text-center">
                Advanced AI algorithms analyze market trends and investment opportunities.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Client Management
              </h3>
              <p className="text-gray-600 text-center">
                Streamlined client portfolio management with personalized recommendations.
              </p>
            </div>
            
            <div className="bg-white rounded-xl p-8 shadow-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4 text-center">
                Dual Stock Tracking
              </h3>
              <p className="text-gray-600 text-center">
                Monitor multiple markets simultaneously with real-time data analysis.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="w-full max-w-7xl mt-24 sm:mt-32 py-6 flex flex-col sm:flex-row justify-between items-center text-white/80 text-sm">
          <div>© 2025 Invex AI</div>
          <div>Developed by Our Team</div>
        </footer>
      </div>
    </BackgroundBeamsWithCollision>
  );
};

export default HomePage;

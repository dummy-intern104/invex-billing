
import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { LoginForm } from "@/components/auth/login-form";

function BackgroundBeamsWithCollisionDemo() {
  return (
    <BackgroundBeamsWithCollision 
      theme="gradient" 
      speed="default" 
      density="dense"
      className="min-h-screen py-8 md:py-0"
    >
      <div className="relative z-20 w-full max-w-md mx-auto px-4 py-8 sm:py-10 flex items-center min-h-[100vh]">
        <LoginForm />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export { BackgroundBeamsWithCollisionDemo };

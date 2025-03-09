
import React from "react";
import { BackgroundBeamsWithCollision } from "@/components/ui/background-beams-with-collision";
import { LoginForm } from "@/components/auth/login-form";

function BackgroundBeamsWithCollisionDemo() {
  return (
    <BackgroundBeamsWithCollision>
      <div className="relative z-20 w-full max-w-md mx-auto">
        <LoginForm />
      </div>
    </BackgroundBeamsWithCollision>
  );
}

export { BackgroundBeamsWithCollisionDemo };

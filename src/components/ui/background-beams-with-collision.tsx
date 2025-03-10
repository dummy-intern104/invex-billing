
"use client";
import { cn } from "@/lib/utils";
import React, { useRef } from "react";
import { CollisionMechanism } from "./background-beams/collision-mechanism";
import { defaultBeams, beamThemes, BeamTheme, createFastBeams, createSlowBeams, createDenseBeams } from "./background-beams/beam-config";

export type BeamSpeed = "default" | "fast" | "slow";
export type BeamDensity = "default" | "dense";
export type BeamThemeKey = keyof typeof beamThemes;

export interface BackgroundBeamsProps {
  children: React.ReactNode;
  className?: string;
  beams?: typeof defaultBeams;
  theme?: BeamThemeKey;
  speed?: BeamSpeed;
  density?: BeamDensity;
  containerClassName?: string;
}

export const BackgroundBeamsWithCollision = ({
  children,
  className,
  beams: customBeams,
  theme = "default",
  speed = "default",
  density = "default",
  containerClassName,
}: BackgroundBeamsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const parentRef = useRef<HTMLDivElement>(null);
  
  // Select the appropriate theme
  const selectedTheme: BeamTheme = beamThemes[theme] || beamThemes.default;
  
  // Set up beams based on speed and density options
  let finalBeams = customBeams || defaultBeams;
  
  if (!customBeams) {
    if (speed === "fast") {
      finalBeams = createFastBeams();
    } else if (speed === "slow") {
      finalBeams = createSlowBeams();
    }
    
    if (density === "dense") {
      finalBeams = createDenseBeams();
    }
  }

  return (
    <div
      ref={parentRef}
      className={cn(
        `h-96 md:h-[40rem] bg-gradient-to-b dark:from-neutral-950 dark:to-neutral-800 relative flex items-center w-full justify-center overflow-hidden ${selectedTheme.bgFrom} ${selectedTheme.bgTo}`,
        className
      )}
    >
      {finalBeams.map((beam, index) => (
        <CollisionMechanism
          key={`${beam.initialX}-${index}-beam`}
          beamOptions={beam}
          beamColor={selectedTheme.beamColor}
          explosionColor={selectedTheme.explosionColors[index % selectedTheme.explosionColors.length]}
          containerRef={containerRef}
          parentRef={parentRef}
        />
      ))}

      {children}
      <div
        ref={containerRef}
        className={cn("absolute bottom-0 bg-neutral-100 w-full inset-x-0 pointer-events-none", containerClassName)}
        style={{
          boxShadow:
            "0 0 24px rgba(34, 42, 53, 0.06), 0 1px 1px rgba(0, 0, 0, 0.05), 0 0 0 1px rgba(34, 42, 53, 0.04), 0 0 4px rgba(34, 42, 53, 0.08), 0 16px 68px rgba(47, 48, 55, 0.05), 0 1px 0 rgba(255, 255, 255, 0.1) inset",
        }}
      ></div>
    </div>
  );
};

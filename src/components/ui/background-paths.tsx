
"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

function FloatingPaths({ position }: { position: number }) {
    const paths = Array.from({ length: 36 }, (_, i) => ({
        id: i,
        d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
            380 - i * 5 * position
        } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
            152 - i * 5 * position
        } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
            684 - i * 5 * position
        } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
        color: `rgba(15,23,42,${0.1 + i * 0.03})`,
        width: 0.5 + i * 0.03,
    }));

    return (
        <div className="absolute inset-0 pointer-events-none">
            <svg
                className="w-full h-full text-slate-950 dark:text-white"
                viewBox="0 0 696 316"
                fill="none"
            >
                <title>Background Paths</title>
                {paths.map((path) => (
                    <motion.path
                        key={path.id}
                        d={path.d}
                        stroke="currentColor"
                        strokeWidth={path.width}
                        strokeOpacity={0.1 + path.id * 0.03}
                        initial={{ pathLength: 0.3, opacity: 0.6 }}
                        animate={{
                            pathLength: 1,
                            opacity: [0.3, 0.6, 0.3],
                            pathOffset: [0, 1, 0],
                        }}
                        transition={{
                            duration: 20 + Math.random() * 10,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "linear",
                        }}
                    />
                ))}
            </svg>
        </div>
    );
}

export function BackgroundPaths({
    title = "Background Paths",
    subtitle,
    primaryButtonText,
    primaryButtonLink,
    onPrimaryButtonClick,
    secondaryButtonText,
    secondaryButtonLink,
    onSecondaryButtonClick,
    showLoginButton = false,
    onLoginClick,
}: {
    title?: string;
    subtitle?: string;
    primaryButtonText?: string;
    primaryButtonLink?: string;
    onPrimaryButtonClick?: () => void;
    secondaryButtonText?: string;
    secondaryButtonLink?: string;
    onSecondaryButtonClick?: () => void;
    showLoginButton?: boolean;
    onLoginClick?: () => void;
}) {
    const words = title.split(" ");

    return (
        <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-white dark:bg-neutral-950">
            {showLoginButton && (
                <div className="absolute top-4 right-4 z-20">
                    <Button 
                        variant="ghost" 
                        onClick={onLoginClick}
                        className="bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-black/10 dark:hover:bg-black/20 text-black dark:text-white border border-black/10 dark:border-white/10"
                    >
                        Login
                    </Button>
                </div>
            )}
            
            <div className="absolute inset-0">
                <FloatingPaths position={1} />
                <FloatingPaths position={-1} />
            </div>

            <div className="relative z-10 container mx-auto px-4 md:px-6 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 2 }}
                    className="max-w-4xl mx-auto"
                >
                    <h1 className="text-5xl sm:text-7xl md:text-8xl font-bold mb-8 tracking-tighter">
                        {words.map((word, wordIndex) => (
                            <span
                                key={wordIndex}
                                className="inline-block mr-4 last:mr-0"
                            >
                                {word.split("").map((letter, letterIndex) => (
                                    <motion.span
                                        key={`${wordIndex}-${letterIndex}`}
                                        initial={{ y: 100, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{
                                            delay:
                                                wordIndex * 0.1 +
                                                letterIndex * 0.03,
                                            type: "spring",
                                            stiffness: 150,
                                            damping: 25,
                                        }}
                                        className="inline-block text-transparent bg-clip-text 
                                        bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500
                                        dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400"
                                    >
                                        {letter}
                                    </motion.span>
                                ))}
                            </span>
                        ))}
                    </h1>

                    {subtitle && (
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.8 }}
                            className="text-xl md:text-2xl text-gray-700 dark:text-gray-300 mb-12 max-w-3xl mx-auto"
                        >
                            {subtitle}
                        </motion.p>
                    )}

                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.5, duration: 0.8 }}
                        className="flex flex-col sm:flex-row items-center justify-center gap-4"
                    >
                        {primaryButtonText && (
                            <div
                                className="inline-block group relative bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 
                                p-px rounded-2xl backdrop-blur-lg overflow-hidden shadow-lg 
                                hover:shadow-xl transition-shadow duration-300"
                            >
                                <Button
                                    variant="ghost"
                                    onClick={onPrimaryButtonClick}
                                    className="rounded-[1.15rem] px-8 py-6 text-lg font-semibold backdrop-blur-md 
                                    bg-white/95 hover:bg-white/100 dark:bg-black/95 dark:hover:bg-black/100 
                                    text-black dark:text-white transition-all duration-300 
                                    group-hover:-translate-y-0.5 border border-black/10 dark:border-white/10
                                    hover:shadow-md dark:hover:shadow-neutral-800/50"
                                >
                                    <span className="opacity-90 group-hover:opacity-100 transition-opacity">
                                        {primaryButtonText}
                                    </span>
                                    <span
                                        className="ml-3 opacity-70 group-hover:opacity-100 group-hover:translate-x-1.5 
                                        transition-all duration-300"
                                    >
                                        →
                                    </span>
                                </Button>
                            </div>
                        )}

                        {secondaryButtonText && (
                            <Button 
                                variant="outline" 
                                onClick={onSecondaryButtonClick}
                                className="rounded-xl px-8 py-6 text-lg font-semibold bg-transparent 
                                border border-gray-300 dark:border-gray-700 hover:bg-gray-100 
                                dark:hover:bg-gray-900 text-gray-800 dark:text-gray-200"
                            >
                                {secondaryButtonText}
                            </Button>
                        )}
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}


"use client";

import { useEffect, useRef } from "react";
import { motion, useInView, useAnimation } from "framer-motion";

interface FeatureCardProps {
  title: string;
  delay: number;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, delay }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ 
        delay: delay, 
        duration: 0.5,
        type: "spring",
        stiffness: 100
      }}
      className="w-full sm:w-auto flex-1 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 m-2 text-center"
    >
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-2">{title}</h3>
    </motion.div>
  );
};

export function FeaturesSection() {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false, amount: 0.3 });
  
  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    }
  }, [controls, isInView]);
  
  return (
    <section 
      ref={ref}
      className="py-20 px-4 w-full bg-white dark:bg-neutral-950"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={controls}
          variants={{
            visible: { opacity: 1, y: 0 }
          }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
            What we do?
          </h2>
        </motion.div>
        
        <div className="flex flex-col sm:flex-row justify-center items-stretch gap-6 flex-wrap">
          <FeatureCard title="AI-Powered Analytics" delay={0.2} />
          <FeatureCard title="Client Management" delay={0.4} />
          <FeatureCard title="Dual Stock Tracking" delay={0.6} />
        </div>
      </div>
    </section>
  );
}

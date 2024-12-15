import React from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface Step {
  id: number;
  label: string;
}

interface StepIndicatorProps {
  steps: Step[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <div className="relative mb-12">
      {/* Progress Bar */}
      <div className="absolute top-5 left-0 w-full">
        {/* Background Bar */}
        <div className="h-1 bg-gray-800" />
        
        {/* Active Progress Bar */}
        <motion.div
          className="absolute top-0 left-0 h-1 bg-[#573cff]"
          initial={{ width: '0%' }}
          animate={{
            width: `${((currentStep - 1) / (steps.length - 1)) * 100}%`,
          }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Step Indicators */}
      <div className="relative z-10 flex justify-between">
        {steps.map((step) => {
          const isActive = currentStep === step.id;
          const isCompleted = currentStep > step.id;

          return (
            <div key={step.id} className="flex flex-col items-center">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-colors ${
                  isActive || isCompleted
                    ? 'bg-[#573cff] text-white'
                    : 'bg-gray-800 text-gray-400'
                }`}
                initial={false}
                animate={{
                  scale: isActive ? 1.2 : 1,
                }}
                transition={{ duration: 0.2 }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{step.id}</span>
                )}
              </motion.div>
              <span className={`text-sm ${
                isActive ? 'text-white' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default StepIndicator;
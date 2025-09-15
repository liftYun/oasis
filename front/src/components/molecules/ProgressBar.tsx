'use client';

interface ProgressBarProps {
  totalSteps: number;
  currentStep: number;
  className?: string;
}

export function ProgressBar({ totalSteps, currentStep, className }: ProgressBarProps) {
  return (
    <div className={`flex w-full gap-1 ${className}`}>
      {Array.from({ length: totalSteps }, (_, i) => (
        <div
          key={i}
          className={`h-1 rounded-full flex-1 ${i === currentStep - 1 ? 'bg-blue-500' : 'bg-gray-200'}`}
        />
      ))}
    </div>
  );
}

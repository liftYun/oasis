'use client';

import React, { createContext, useContext, useMemo } from 'react';

export interface StepFlowContextValue {
  currentStep: number;
  canGoPrev: boolean;
  goPrevStep: () => void;
}

const StepFlowContext = createContext<StepFlowContextValue | undefined>(undefined);

interface StepFlowProviderProps {
  value: StepFlowContextValue;
  children: React.ReactNode;
}

export function StepFlowProvider({ value, children }: StepFlowProviderProps) {
  const memoizedValue = useMemo<StepFlowContextValue>(() => value, [value]);
  return <StepFlowContext.Provider value={memoizedValue}>{children}</StepFlowContext.Provider>;
}

export function useStepFlow(): StepFlowContextValue | undefined {
  return useContext(StepFlowContext);
}

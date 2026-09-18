import * as React from 'react';

export interface StepItem {
  id: string | number;
  title?: string;
  label?: string;
  description?: string;
}

export interface StepperProps {
  steps: StepItem[];
  activeStep?: number; // 0-indexed
  currentStep?: number; // 1-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps,
  activeStep,
  currentStep,
  onStepClick,
  className = '',
}) => {
  const activeIdx = currentStep !== undefined ? currentStep - 1 : activeStep ?? 0;

  return (
    <div
      className={`boost-stepper ${className}`}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
        fontFamily: 'inherit',
        position: 'relative',
      }}
    >
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIdx;
        const isCurrent = idx === activeIdx;
        const isClickable = onStepClick && idx <= activeIdx;
        const displayLabel = step.label || step.title || '';

        return (
          <div
            key={step.id}
            onClick={() => isClickable && onStepClick(idx)}
            style={{
              display: 'flex',
              alignItems: 'center',
              flex: idx === steps.length - 1 ? 'none' : 1,
              cursor: isClickable ? 'pointer' : 'default',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#16a34a' : isCurrent ? '#2563eb' : '#f1f5f9',
                  color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: `2px solid ${isCompleted ? '#16a34a' : isCurrent ? '#2563eb' : '#cbd5e1'}`,
                  transition: 'all 0.2s ease',
                  flexShrink: 0,
                }}
              >
                {isCompleted ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? '#0f172a' : '#64748b',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayLabel}
                </span>
                {step.description && (
                  <span style={{ fontSize: '11px', color: '#94a3b8' }}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: idx < activeIdx ? '#16a34a' : '#e2e8f0',
                  margin: '0 12px',
                  minWidth: '24px',
                  transition: 'background-color 0.2s ease',
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};


Stepper.displayName = 'Stepper';

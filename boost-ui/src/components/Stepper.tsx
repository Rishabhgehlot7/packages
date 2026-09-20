import * as React from 'react';

export interface StepItem {
  id: string | number;
  title?: string;
  label?: string;
  description?: string;
}

export interface StepperProps {
  steps?: StepItem[];
  activeStep?: number; // 0-indexed
  currentStep?: number; // 1-indexed
  onStepClick?: (stepIndex: number) => void;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps = [],
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
        overflowX: 'auto',
        WebkitOverflowScrolling: 'touch',
        padding: '4px 0',
      }}
    >
      <style>
        {`
          :root[data-theme="dark"] .boost-stepper-circle.inactive,
          .dark .boost-stepper-circle.inactive {
            background-color: rgba(255, 255, 255, 0.06) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-stepper-circle.current,
          .dark .boost-stepper-circle.current {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
            box-shadow: 0 0 14px rgba(99, 102, 241, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-stepper-label.current,
          .dark .boost-stepper-label.current {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-stepper-label.inactive,
          .dark .boost-stepper-label.inactive {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-stepper-line.inactive,
          .dark .boost-stepper-line.inactive {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        `}
      </style>
      {steps.map((step, idx) => {
        const isCompleted = idx < activeIdx;
        const isCurrent = idx === activeIdx;
        const isClickable = onStepClick && idx <= activeIdx;
        const displayLabel = step.label || step.title || '';
        const circleState = isCompleted ? 'completed' : isCurrent ? 'current' : 'inactive';

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
                className={`boost-stepper-circle ${circleState}`}
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--boost-primary, #2563eb)' : 'var(--boost-bg-subtle, #f1f5f9)',
                  color: isCompleted || isCurrent ? '#ffffff' : 'var(--boost-muted, #64748b)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  border: `2px solid ${isCompleted ? '#10b981' : isCurrent ? 'var(--boost-primary, #2563eb)' : 'var(--boost-border, #cbd5e1)'}`,
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
                  className={`boost-stepper-label ${isCurrent ? 'current' : 'inactive'}`}
                  style={{
                    fontSize: '13px',
                    fontWeight: isCurrent ? 700 : 500,
                    color: isCurrent ? 'var(--boost-text, #0f172a)' : 'var(--boost-muted, #64748b)',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {displayLabel}
                </span>
                {step.description && (
                  <span style={{ fontSize: '11px', color: 'var(--boost-muted, #94a3b8)' }}>
                    {step.description}
                  </span>
                )}
              </div>
            </div>

            {idx < steps.length - 1 && (
              <div
                className={`boost-stepper-line ${idx < activeIdx ? 'completed' : 'inactive'}`}
                style={{
                  flex: 1,
                  height: '2px',
                  backgroundColor: idx < activeIdx ? '#10b981' : 'var(--boost-border, #e2e8f0)',
                  margin: '0 12px',
                  minWidth: '20px',
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

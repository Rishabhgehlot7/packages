import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

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
  stylePreset?: UIStylePreset;
  className?: string;
}

export const Stepper: React.FC<StepperProps> = ({
  steps = [],
  activeStep,
  currentStep,
  onStepClick,
  stylePreset: stylePresetProp,
  className = '',
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const activeIdx = currentStep !== undefined ? currentStep - 1 : activeStep ?? 0;

  const getCircleStyles = (isCompleted: boolean, isCurrent: boolean): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: 700,
      transition: 'all 0.2s ease',
      flexShrink: 0,
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          border: '2px solid #000000',
          backgroundColor: isCompleted ? '#10b981' : isCurrent ? '#fbbf24' : '#ffffff',
          color: '#000000',
          boxShadow: isCurrent ? '3px 3px 0px #000000' : '2px 2px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '50%',
          border: '1px solid rgba(255, 255, 255, 0.5)',
          backgroundColor: isCompleted ? 'rgba(16, 185, 129, 0.85)' : isCurrent ? 'rgba(99, 102, 241, 0.85)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
          boxShadow: isCurrent ? '0 0 14px rgba(99, 102, 241, 0.5)' : 'none',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: '#e0e5ec',
          color: isCompleted ? '#10b981' : isCurrent ? 'var(--boost-primary, #2563eb)' : '#94a3b8',
          boxShadow: isCurrent ? 'inset 2px 2px 5px #c8cdd5, inset -2px -2px 5px #f8fdff' : '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '50%',
          background: isCompleted ? 'linear-gradient(135deg, #10b981, #059669)' : isCurrent ? 'linear-gradient(135deg, #6366f1, #4f46e5)' : 'var(--boost-surface, #ffffff)',
          border: isCompleted || isCurrent ? 'none' : '1px solid rgba(99, 102, 241, 0.2)',
          color: isCompleted || isCurrent ? '#ffffff' : '#94a3b8',
          boxShadow: isCompleted ? '0 0 12px rgba(16, 185, 129, 0.5)' : isCurrent ? '0 0 16px rgba(99, 102, 241, 0.6)' : 'none',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '50%',
          border: 'none',
          backgroundColor: isCompleted ? '#386a20' : isCurrent ? 'var(--boost-primary, #6750a4)' : 'var(--boost-surface-secondary, #e8def8)',
          color: isCompleted || isCurrent ? '#ffffff' : '#49454f',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '50%',
          border: `1px solid ${isCompleted ? '#10b981' : isCurrent ? '#3b82f6' : 'rgba(255, 255, 255, 0.12)'}`,
          backgroundColor: isCompleted ? '#059669' : isCurrent ? '#2563eb' : '#1e293b',
          color: isCompleted || isCurrent ? '#ffffff' : '#64748b',
        };
      default:
        return {
          ...base,
          borderRadius: '50%',
          backgroundColor: isCompleted ? '#10b981' : isCurrent ? 'var(--boost-primary, #2563eb)' : 'var(--boost-bg-subtle, #f1f5f9)',
          color: isCompleted || isCurrent ? '#ffffff' : 'var(--boost-muted, #64748b)',
          border: `2px solid ${isCompleted ? '#10b981' : isCurrent ? 'var(--boost-primary, #2563eb)' : 'var(--boost-border, #cbd5e1)'}`,
        };
    }
  };

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
                className={`boost-stepper-circle boost-stepper-circle-preset-${preset} ${circleState}`}
                style={getCircleStyles(isCompleted, isCurrent)}
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

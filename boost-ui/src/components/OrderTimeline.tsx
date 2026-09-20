import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export type OrderStage = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';

export interface OrderTimelineProps {
  currentStage: OrderStage;
  dates?: {
    placed?: string;
    confirmed?: string;
    shipped?: string;
    out_for_delivery?: string;
    delivered?: string;
  };
  stylePreset?: UIStylePreset;
  className?: string;
}

const STAGES: Array<{ id: OrderStage; label: string }> = [
  { id: 'placed', label: 'Order Placed' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'shipped', label: 'Shipped' },
  { id: 'out_for_delivery', label: 'Out for Delivery' },
  { id: 'delivered', label: 'Delivered' },
];

export const OrderTimeline: React.FC<OrderTimelineProps> = ({
  currentStage,
  dates = {},
  stylePreset: stylePresetProp,
  className = '',
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  const progressPercent = currentIndex >= 0 ? (currentIndex / (STAGES.length - 1)) * 100 : 0;

  const getNodeStyles = (status: 'passed' | 'current' | 'upcoming'): React.CSSProperties => {
    const base: React.CSSProperties = {
      width: '32px',
      height: '32px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: 700,
      transition: 'all 0.3s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return {
          ...base,
          borderRadius: '2px',
          border: '2px solid #000000',
          backgroundColor: status === 'passed' ? '#10b981' : status === 'current' ? '#fbbf24' : '#ffffff',
          color: '#000000',
          boxShadow: status === 'current' ? '3px 3px 0px #000000' : '2px 2px 0px #000000',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          ...base,
          borderRadius: '9999px',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          backgroundColor: status === 'passed' ? 'rgba(16, 185, 129, 0.85)' : status === 'current' ? 'rgba(99, 102, 241, 0.85)' : 'rgba(255, 255, 255, 0.4)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          color: '#ffffff',
          boxShadow: status === 'current' ? '0 0 15px rgba(99, 102, 241, 0.5)' : 'none',
        };
      case 'neumorphism':
        return {
          ...base,
          borderRadius: '9999px',
          border: 'none',
          backgroundColor: status === 'passed' ? '#10b981' : status === 'current' ? '#2563eb' : '#e0e5ec',
          color: status === 'upcoming' ? 'var(--boost-text-muted, #94a3b8)' : '#ffffff',
          boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
        };
      case 'gradient-glow':
        return {
          ...base,
          borderRadius: '9999px',
          background: status === 'passed' ? 'linear-gradient(135deg, #10b981, #059669)' : status === 'current' ? 'linear-gradient(135deg, #4f46e5, #8b5cf6)' : 'var(--boost-surface, #ffffff)',
          border: status === 'upcoming' ? '1px solid rgba(99, 102, 241, 0.2)' : 'none',
          color: status === 'upcoming' ? 'var(--boost-text-muted, #94a3b8)' : '#ffffff',
          boxShadow: status === 'passed' ? '0 0 12px rgba(16, 185, 129, 0.5)' : status === 'current' ? '0 0 16px rgba(99, 102, 241, 0.7)' : 'none',
        };
      case 'material-you':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: status === 'passed' ? '#386a20' : status === 'current' ? 'var(--boost-primary, #6750a4)' : 'var(--boost-surface-secondary, #e8def8)',
          color: status === 'upcoming' ? '#49454f' : '#ffffff',
        };
      case 'dark-first':
        return {
          ...base,
          borderRadius: '9999px',
          backgroundColor: status === 'passed' ? '#059669' : status === 'current' ? '#2563eb' : '#1e293b',
          border: status === 'upcoming' ? '1px solid rgba(255, 255, 255, 0.12)' : 'none',
          color: status === 'upcoming' ? '#64748b' : '#ffffff',
        };
      default:
        return base;
    }
  };

  return (
    <div className={`boost-order-timeline ${className}`} style={{ padding: '16px 8px', width: '100%', boxSizing: 'border-box' }}>
      <style>{`
        .boost-timeline-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          width: 100%;
        }
        .boost-timeline-track-bg {
          position: absolute;
          top: 15px;
          left: 18px;
          right: 18px;
          height: 3px;
          background-color: var(--boost-border, #e2e8f0);
          z-index: 0;
          border-radius: 9999px;
        }
        .boost-timeline-track-fill {
          position: absolute;
          top: 15px;
          left: 18px;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #059669);
          z-index: 1;
          border-radius: 9999px;
          transition: width 0.4s ease;
        }
        :root[data-theme="dark"] .boost-timeline-track-bg,
        .dark .boost-timeline-track-bg {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .boost-timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
          max-width: 90px;
        }
        .boost-timeline-node {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .boost-timeline-node.passed {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.35);
        }
        .boost-timeline-node.current {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(16, 185, 129, 0.4);
          animation: boostPulse 2s infinite;
        }
        .boost-timeline-node.upcoming {
          background: var(--boost-surface, #ffffff);
          border: 2px solid var(--boost-border, #cbd5e1);
          color: var(--boost-text-muted, #94a3b8);
        }
        :root[data-theme="dark"] .boost-timeline-node.upcoming,
        .dark .boost-timeline-node.upcoming {
          background: #111827 !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .boost-timeline-label {
          margin-top: 8px;
          font-size: 11px;
          text-align: center;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .boost-timeline-label.current {
          font-weight: 700;
          color: var(--boost-text-primary, #0f172a);
        }
        .boost-timeline-label.passed {
          font-weight: 600;
          color: var(--boost-text-primary, #0f172a);
        }
        .boost-timeline-label.upcoming {
          font-weight: 500;
          color: var(--boost-text-muted, #94a3b8);
        }
        :root[data-theme="dark"] .boost-timeline-label.current,
        .dark .boost-timeline-label.current {
          color: #ffffff !important;
        }
        :root[data-theme="dark"] .boost-timeline-label.passed,
        .dark .boost-timeline-label.passed {
          color: #e2e8f0 !important;
        }
        :root[data-theme="dark"] .boost-timeline-label.upcoming,
        .dark .boost-timeline-label.upcoming {
          color: #64748b !important;
        }
        @keyframes boostPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      `}</style>

      <div className="boost-timeline-container">
        {/* Track Line Background */}
        <div className="boost-timeline-track-bg" />

        {/* Dynamic Progress Fill */}
        <div
          className="boost-timeline-track-fill"
          style={{ width: `calc(${progressPercent}% * 0.88)` }}
        />

        {STAGES.map((stage, idx) => {
          const isPassed = idx < currentIndex;
          const isCurrent = idx === currentIndex;
          const status = isCurrent ? 'current' : isPassed ? 'passed' : 'upcoming';

          return (
            <div key={stage.id} className="boost-timeline-step">
              <div
                className={`boost-timeline-node boost-timeline-node-preset-${preset} ${status}`}
                style={getNodeStyles(status)}
              >
                {isPassed ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                ) : isCurrent ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="4" fill="currentColor"></circle>
                  </svg>
                ) : (
                  idx + 1
                )}
              </div>

              <div className={`boost-timeline-label ${status}`}>
                {stage.label}
              </div>

              {dates[stage.id] && (
                <div style={{ fontSize: '10px', color: 'var(--boost-text-muted, #94a3b8)', marginTop: '3px' }}>
                  {dates[stage.id]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

OrderTimeline.displayName = 'OrderTimeline';

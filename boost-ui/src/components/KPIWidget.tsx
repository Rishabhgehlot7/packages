import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface KPIWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  value: string | number;
  change?: number | string; // e.g. 12.5, "+12.5%", or -4.2
  changePeriod?: string; // e.g. "vs last month"
  icon?: React.ReactNode;
  subtitle?: string;
  sparkline?: React.ReactNode;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const KPIWidget: React.FC<KPIWidgetProps> = ({
  title,
  value,
  change,
  changePeriod = 'vs last month',
  icon,
  subtitle,
  sparkline,
  stylePreset: stylePresetProp,
  className = '',
  style,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const numericChange = typeof change === 'string' ? parseFloat(change.replace('%', '').replace('+', '')) : change;
  const isPositive = numericChange !== undefined && !isNaN(numericChange) ? numericChange >= 0 : undefined;

  const getCardStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = { padding: 'clamp(16px,3.5vw,24px)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxSizing: 'border-box', transition: 'transform 0.2s ease, box-shadow 0.2s ease' };
    switch (preset) {
      case 'neo-brutalism': return { ...base, backgroundColor: '#ffffff', border: '3px solid #000', borderRadius: '2px', boxShadow: '5px 5px 0px #000' };
      case 'glassmorphism': return { ...base, backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' };
      case 'neumorphism': return { ...base, backgroundColor: '#e0e5ec', border: 'none', borderRadius: '20px', boxShadow: '8px 8px 18px #c8cdd5, -8px -8px 18px #f8fdff' };
      case 'gradient-glow': return { ...base, backgroundColor: 'var(--boost-surface,#ffffff)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', boxShadow: '0 0 24px rgba(99,102,241,0.14)' };
      case 'material-you': return { ...base, backgroundColor: 'var(--boost-surface,#fffbfe)', border: '1px solid var(--boost-border,#e2e8f0)', borderRadius: '24px' };
      case 'dark-first': return { ...base, backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' };
      default: return { ...base, borderRadius: 'var(--boost-radius,16px)', backgroundColor: 'var(--boost-surface,#ffffff)', border: '1px solid var(--boost-border,#e2e8f0)', boxShadow: 'var(--boost-shadow-sm,0 4px 12px rgba(0,0,0,0.04))' };
    }
  };

  return (
    <div
      className={`boost-kpi-widget boost-kpi-widget-preset-${preset} ${className}`}
      style={{ ...getCardStyles(), ...style }}
      {...props}
    >
      <style>{`
        :root[data-theme="dark"] .boost-kpi-widget-preset-${preset} {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255,255,255,0.1) !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5) !important;
        }
      `}</style>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '14px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 600,
            color: 'var(--boost-muted, #64748b)',
            letterSpacing: '-0.01em',
          }}
        >
          {title}
        </span>
        {icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: '10px',
              backgroundColor: 'rgba(59, 130, 246, 0.08)',
              color: 'var(--boost-primary, #2563eb)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '18px',
              flexShrink: 0,
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ marginBottom: '12px' }}>
        <div
          style={{
            fontSize: 'clamp(24px, 4vw, 32px)',
            fontWeight: 800,
            color: 'var(--boost-text, #0f172a)',
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
          }}
        >
          {value}
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '8px',
        }}
      >
        {numericChange !== undefined && !isNaN(numericChange) && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '12px',
                fontWeight: 700,
                padding: '3px 8px',
                borderRadius: '999px',
                backgroundColor: isPositive ? 'rgba(34, 197, 94, 0.12)' : 'rgba(239, 68, 68, 0.12)',
                color: isPositive ? '#16a34a' : '#dc2626',
              }}
            >
              {isPositive ? '▲ +' : '▼ '}
              {Math.abs(numericChange)}%
            </span>
            {changePeriod && (
              <span
                style={{
                  fontSize: '12px',
                  color: 'var(--boost-text-muted, #94a3b8)',
                }}
              >
                {changePeriod}
              </span>
            )}
          </div>
        )}

        {subtitle && !change && (
          <span
            style={{
              fontSize: '12px',
              color: 'var(--boost-text-muted, #94a3b8)',
            }}
          >
            {subtitle}
          </span>
        )}

        {sparkline && <div>{sparkline}</div>}
      </div>
    </div>
  );
};


KPIWidget.displayName = 'KPIWidget';

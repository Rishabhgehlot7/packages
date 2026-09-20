import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';

export interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  trend?: { value: number | string; isPositive?: boolean } | string | number;
  isPositive?: boolean;
  period?: string;
  description?: string;
  icon?: React.ReactNode;
  stylePreset?: UIStylePreset;
  className?: string;
  style?: React.CSSProperties;
}

export const StatsCard: React.FC<StatsCardProps> = ({
  title,
  value,
  change,
  trend,
  isPositive = true,
  period = 'vs last month',
  description,
  icon,
  stylePreset: stylePresetProp,
  className = '',
  style,
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;

  const computedChange =
    change !== undefined
      ? change
      : typeof trend === 'object' && trend !== null
      ? `${(trend as any).value > 0 && !String((trend as any).value).includes('+') ? '+' : ''}${(trend as any).value}%`
      : trend !== undefined
      ? trend
      : undefined;

  const computedIsPositive =
    typeof trend === 'object' && trend !== null && (trend as any).isPositive !== undefined
      ? (trend as any).isPositive
      : isPositive;

  const computedPeriod = description || period;

  const getCardStyles = (): React.CSSProperties => {
    const base: React.CSSProperties = {
      fontFamily: 'inherit', width: '100%', boxSizing: 'border-box',
      padding: 'clamp(16px, 2.5vw, 22px)', transition: 'transform 0.2s ease, box-shadow 0.2s ease',
    };
    switch (preset) {
      case 'neo-brutalism':
        return { ...base, backgroundColor: '#ffffff', border: '3px solid #000', borderRadius: '2px', boxShadow: '5px 5px 0px #000' };
      case 'glassmorphism':
        return { ...base, backgroundColor: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)', border: '1px solid rgba(255,255,255,0.4)', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0,0,0,0.08)' };
      case 'neumorphism':
        return { ...base, backgroundColor: '#e0e5ec', border: 'none', borderRadius: '20px', boxShadow: '8px 8px 18px #c8cdd5, -8px -8px 18px #f8fdff' };
      case 'gradient-glow':
        return { ...base, backgroundColor: 'var(--boost-surface, #ffffff)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '14px', boxShadow: '0 0 24px rgba(99,102,241,0.14)' };
      case 'material-you':
        return { ...base, backgroundColor: 'var(--boost-surface, #fffbfe)', border: '1px solid var(--boost-border, #e2e8f0)', borderRadius: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' };
      case 'dark-first':
        return { ...base, backgroundColor: '#0f172a', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '12px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' };
      default:
        return { ...base, backgroundColor: 'var(--boost-surface, #ffffff)', border: '1px solid var(--boost-border, #e2e8f0)', borderRadius: 'var(--boost-radius, 16px)', boxShadow: 'var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))' };
    }
  };

  const textColor = preset === 'dark-first' ? '#f8fafc' : preset === 'neo-brutalism' ? '#000' : 'var(--boost-text, #0f172a)';
  const mutedColor = preset === 'dark-first' ? '#64748b' : preset === 'neo-brutalism' ? '#374151' : 'var(--boost-text-muted, #64748b)';
  const iconBg = preset === 'neo-brutalism' ? '#fbbf24' : preset === 'dark-first' ? '#1e293b' : preset === 'neumorphism' ? '#e0e5ec' : 'var(--boost-surface-secondary, #f1f5f9)';
  const iconShadow = preset === 'neumorphism' ? '3px 3px 7px #c8cdd5, -3px -3px 7px #f8fdff' : 'none';

  return (
    <div
      className={`boost-stats-card boost-stats-card-preset-${preset} ${className}`}
      style={{ ...getCardStyles(), ...style }}
    >
      <style>{`
        :root[data-theme="dark"] .boost-stats-card-preset-${preset} {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255,255,255,0.1) !important;
          box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5) !important;
        }
      `}</style>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
        <span style={{ fontSize: '13px', fontWeight: 600, color: mutedColor }}>{title}</span>
        {icon && (
          <div style={{ width: '38px', height: '38px', borderRadius: preset === 'material-you' ? '16px' : preset === 'neo-brutalism' ? '2px' : '10px', backgroundColor: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--boost-primary, #2563eb)', boxShadow: iconShadow, border: preset === 'neo-brutalism' ? '2px solid #000' : 'none' }}>
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: 'clamp(22px,2.5vw,28px)', fontWeight: 800, color: textColor, marginBottom: '8px', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      {computedChange !== undefined && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px' }}>
          <span style={{ fontWeight: 700, color: computedIsPositive ? '#16a34a' : '#dc2626', backgroundColor: computedIsPositive ? 'rgba(34,197,94,0.1)' : 'rgba(220,38,38,0.1)', padding: '2px 8px', borderRadius: preset === 'neo-brutalism' ? '2px' : '9999px', display: 'inline-flex', alignItems: 'center', gap: '3px', border: preset === 'neo-brutalism' ? `1px solid ${computedIsPositive ? '#16a34a' : '#dc2626'}` : 'none' }}>
            {computedIsPositive ? (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
            ) : (
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
            )}
            {computedChange}
          </span>
          <span style={{ color: mutedColor }}>{computedPeriod}</span>
        </div>
      )}
    </div>
  );
};

StatsCard.displayName = 'StatsCard';

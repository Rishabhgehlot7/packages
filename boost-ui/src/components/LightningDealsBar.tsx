import * as React from 'react';
import type { UIStylePreset } from '../types/presets';
import { useBoostPreset } from './BoostProvider';


/**
 * LightningDealsBarProps — Properties for the lightning deal countdown bar.
 */
export interface LightningDealsBarProps {
  dealTitle?: string;
  endsAt?: Date | string | number;
  dealEndsInSeconds?: number;
  percentageClaimed?: number;
  claimedPercent?: number;
  totalQuantity?: number;
  claimedQuantity?: number;
  badgeColor?: string;
  className?: string;
  style?: React.CSSProperties;
  stylePreset?: UIStylePreset;
  onExpire?: () => void;
  hideOnExpire?: boolean;
}

export const LightningDealsBar: React.FC<LightningDealsBarProps> = ({
  dealTitle = 'LIGHTNING DEAL',
  endsAt,
  dealEndsInSeconds,
  percentageClaimed = 78,
  claimedPercent,
  totalQuantity,
  claimedQuantity,
  badgeColor = '#ef4444',
  className = '',
  style,
  stylePreset: stylePresetProp,
  onExpire,
  hideOnExpire = true,
  ...props
}) => {
  const { stylePreset: inheritedPreset } = useBoostPreset();
  const preset = stylePresetProp ?? inheritedPreset;
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 2,
    minutes: 0,
    seconds: 0,
    isExpired: false,
  });

  const effectivePercent = claimedPercent !== undefined 
    ? claimedPercent 
    : (props as any).claimedPercent !== undefined 
      ? (props as any).claimedPercent 
      : percentageClaimed;

  const secondsProp = dealEndsInSeconds || (props as any).dealEndsInSeconds;

  React.useEffect(() => {
    let end: number;
    if (secondsProp) {
      end = Date.now() + Number(secondsProp) * 1000;
    } else if (endsAt) {
      const parsed = new Date(endsAt).getTime();
      end = isNaN(parsed) ? Date.now() + 7200 * 1000 : parsed;
    } else {
      end = Date.now() + 7200 * 1000;
    }

    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeLeft({
        hours: isNaN(hours) ? 0 : hours,
        minutes: isNaN(minutes) ? 0 : minutes,
        seconds: isNaN(seconds) ? 0 : seconds,
        isExpired: false
      });
    };

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, [endsAt, secondsProp]);

  const pad = (n: number) => String(n).padStart(2, '0');

  // Compute claimed %
  let percent = effectivePercent;
  if (totalQuantity && claimedQuantity !== undefined) {
    percent = Math.round((claimedQuantity / totalQuantity) * 100);
  }
  percent = Math.min(100, Math.max(0, percent));

  if (timeLeft.isExpired && hideOnExpire) {
    return null;
  }

  const getContainerStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          background: '#ffffff',
          border: '3px solid #000000',
          boxShadow: '5px 5px 0px #000000',
          borderRadius: '2px',
        };
      case 'glassmorphism':
        return {
          background: 'rgba(255, 255, 255, 0.75)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.4)',
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.12)',
          borderRadius: '16px',
        };
      case 'neumorphism':
        return {
          background: 'var(--boost-surface, #e6ecf5)',
          border: 'none',
          boxShadow: '6px 6px 14px #d1d9e6, -6px -6px 14px #ffffff',
          borderRadius: '16px',
        };
      case 'gradient-glow':
        return {
          background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(239, 68, 68, 0.1) 100%), var(--boost-surface, #ffffff)',
          border: '1px solid rgba(245, 158, 11, 0.4)',
          boxShadow: '0 0 25px rgba(245, 158, 11, 0.25)',
          borderRadius: '16px',
        };
      case 'material-you':
        return {
          background: 'var(--boost-surface-variant, #fff7ed)',
          border: 'none',
          borderRadius: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        };
      case 'dark-first':
        return {
          background: '#0f172a',
          border: '1px solid #334155',
          boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
          borderRadius: '16px',
        };
      case 'minimal':
      default:
        return {
          background: 'linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(254, 226, 226, 0.25) 100%), var(--boost-surface, #ffffff)',
          border: '1px solid var(--boost-border, rgba(245, 158, 11, 0.25))',
          boxShadow: '0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 2px 6px rgba(0, 0, 0, 0.03)',
          borderRadius: '16px',
        };
    }
  };

  const getTimerBoxStyles = (isSec?: boolean): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          borderRadius: '0px',
          border: '2px solid #000000',
          boxShadow: '2px 2px 0px #000000',
          background: isSec ? '#ef4444' : '#000000',
          color: '#ffffff',
          fontWeight: 800,
        };
      case 'glassmorphism':
        return {
          borderRadius: '6px',
          background: isSec ? 'rgba(239, 68, 68, 0.85)' : 'rgba(15, 23, 42, 0.75)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.25)',
        };
      case 'neumorphism':
        return {
          borderRadius: '6px',
          background: 'var(--boost-surface, #e6ecf5)',
          boxShadow: 'inset 2px 2px 4px #d1d9e6, inset -2px -2px 4px #ffffff',
          color: isSec ? '#ef4444' : 'var(--boost-text-primary, #0f172a)',
          border: 'none',
        };
      case 'material-you':
        return {
          borderRadius: '8px',
          background: isSec ? '#fee2e2' : 'var(--boost-surface-container-high, #ffedd5)',
          color: isSec ? '#991b1b' : 'var(--boost-text-primary, #431407)',
          border: 'none',
          fontWeight: 800,
        };
      default:
        return {};
    }
  };

  const getBadgeStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '2px solid #000000',
          borderRadius: '0px',
          boxShadow: '2px 2px 0px #000000',
          background: '#ef4444',
          color: '#ffffff',
          fontWeight: 900,
        };
      case 'neumorphism':
        return {
          border: 'none',
          boxShadow: '3px 3px 6px #d1d9e6, -3px -3px 6px #ffffff',
        };
      case 'material-you':
        return {
          borderRadius: '12px',
        };
      default:
        return {};
    }
  };

  const getTrackStyles = (): React.CSSProperties => {
    switch (preset) {
      case 'neo-brutalism':
        return {
          border: '2px solid #000000',
          borderRadius: '0px',
          background: '#ffffff',
        };
      case 'neumorphism':
        return {
          boxShadow: 'inset 2px 2px 5px #c8d0dc, inset -2px -2px 5px #ffffff',
          backgroundColor: 'transparent',
        };
      case 'material-you':
        return {
          borderRadius: '8px',
          backgroundColor: '#ffedd5',
        };
      default:
        return {};
    }
  };

  const containerPresetStyle = getContainerStyles();

  return (
    <div
      className={`boost-lightning-deals-bar boost-deals-preset-${preset} ${className}`}
      style={{
        padding: '16px 20px',
        display: 'flex',
        flexDirection: 'column',
        gap: '12px',
        width: '100%',
        boxSizing: 'border-box',
        ...containerPresetStyle,
        ...style,
      }}
    >
      <style>
        {`
          .boost-lightning-deals-bar {
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-deals-preset-glassmorphism,
          .dark .boost-deals-preset-glassmorphism {
            background: rgba(15, 23, 42, 0.75) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }

          :root[data-theme="dark"] .boost-deals-preset-neumorphism,
          .dark .boost-deals-preset-neumorphism {
            background: #1e293b !important;
            box-shadow: 6px 6px 14px #0d1522, -6px -6px 14px #2f3d54 !important;
          }

          .boost-deal-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #ffffff;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
            text-transform: uppercase;
          }

          .boost-deal-badge-icon {
            animation: boost-pulse 1.8s infinite;
          }

          @keyframes boost-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.85; }
          }

          .boost-timer-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            height: 28px;
            padding: 0 6px;
            border-radius: 6px;
            background: var(--boost-text-primary, #0f172a);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }

          :root[data-theme="dark"] .boost-timer-box,
          .dark .boost-timer-box {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #f8fafc;
          }

          .boost-timer-box.seconds {
            background: #ef4444;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          }

          .boost-deal-track {
            height: 8px;
            background-color: var(--boost-bg-muted, rgba(0, 0, 0, 0.06));
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
          }

          :root[data-theme="dark"] .boost-deal-track,
          .dark .boost-deal-track {
            background-color: rgba(255, 255, 255, 0.08);
          }

          .boost-deal-fill {
            height: 100%;
            border-radius: 9999px;
            background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
          }
        `}
      </style>

      {/* Top Header: Badge + Countdown Timer */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span
            className="boost-deal-badge"
            style={{
              backgroundColor: badgeColor !== '#ef4444' ? badgeColor : undefined,
              ...getBadgeStyles(),
            }}
          >
            <svg className="boost-deal-badge-icon" width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
            </svg>
            {dealTitle}
          </span>
        </div>

        {/* Countdown Timer with aligned 'Ends in:' */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              color: 'var(--boost-text-secondary, #64748b)',
              display: 'inline-flex',
              alignItems: 'center',
              lineHeight: 1,
            }}
          >
            Ends in:
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <span className="boost-timer-box" style={getTimerBoxStyles()}>
              {pad(timeLeft.hours)}h
            </span>
            <span style={{ fontWeight: 800, color: 'var(--boost-text-muted, #94a3b8)', lineHeight: 1 }}>:</span>
            <span className="boost-timer-box" style={getTimerBoxStyles()}>
              {pad(timeLeft.minutes)}m
            </span>
            <span style={{ fontWeight: 800, color: 'var(--boost-text-muted, #94a3b8)', lineHeight: 1 }}>:</span>
            <span className="boost-timer-box seconds" style={getTimerBoxStyles(true)}>
              {pad(timeLeft.seconds)}s
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Claim Progress Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div className="boost-deal-track" style={getTrackStyles()}>
          <div
            className="boost-deal-fill"
            style={{
              width: `${percent}%`,
              borderRadius: preset === 'neo-brutalism' ? '0px' : undefined,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            fontSize: '12px',
            color: 'var(--boost-text-primary, #334155)',
            fontWeight: 600,
          }}
        >
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            🔥 <strong>{percent}%</strong> Claimed
          </span>
          <span style={{ color: percent > 80 ? '#dc2626' : 'var(--boost-text-muted, #64748b)', fontWeight: 600 }}>
            {percent > 85 ? '⚡ Only a few left!' : 'Hurry, limited stock!'}
          </span>
        </div>
      </div>
    </div>
  );
};

LightningDealsBar.displayName = 'LightningDealsBar';

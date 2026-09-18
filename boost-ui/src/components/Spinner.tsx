import React from 'react';

export interface SpinnerProps extends React.SVGAttributes<SVGSVGElement> {
  size?: 'sm' | 'md' | 'lg' | number;
  color?: string;
  strokeWidth?: number;
}

export const Spinner: React.FC<SpinnerProps> = ({
  size = 'md',
  color = 'currentColor',
  strokeWidth = 2.5,
  style,
  ...props
}) => {
  const pixelSize = typeof size === 'number' ? size : size === 'sm' ? 16 : size === 'lg' ? 32 : 24;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{
        animation: 'boost-spin 0.8s linear infinite',
        ...style,
      }}
      {...props}
    >
      <circle cx="12" cy="12" r="10" strokeOpacity="0.2" />
      <path d="M12 2a10 10 0 0 1 10 10" />
      <style>{`
        @keyframes boost-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </svg>
  );
};


Spinner.displayName = 'Spinner';

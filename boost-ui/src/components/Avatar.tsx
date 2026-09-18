import * as React from 'react';

export interface AvatarProps {
  src?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'busy' | 'away';
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({
  src,
  name,
  size = 'md',
  status,
  className = '',
}) => {
  const [imgError, setImgError] = React.useState(false);

  const getSize = () => {
    switch (size) {
      case 'sm': return { dim: 32, font: 12, dot: 8 };
      case 'lg': return { dim: 52, font: 18, dot: 12 };
      case 'xl': return { dim: 72, font: 24, dot: 16 };
      case 'md':
      default: return { dim: 40, font: 14, dot: 10 };
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'online': return '#16a34a';
      case 'offline': return '#94a3b8';
      case 'busy': return '#dc2626';
      case 'away': return '#eab308';
      default: return undefined;
    }
  };

  const getInitials = (str?: string) => {
    if (!str) return 'U';
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0] || ''}${parts[1][0] || ''}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };

  const s = getSize();
  const statusColor = getStatusColor();

  return (
    <div
      className={`boost-avatar ${className}`}
      style={{
        position: 'relative',
        display: 'inline-flex',
        width: `${s.dim}px`,
        height: `${s.dim}px`,
        borderRadius: '50%',
        backgroundColor: '#e2e8f0',
        color: '#334155',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'inherit',
        fontWeight: 600,
        fontSize: `${s.font}px`,
        userSelect: 'none',
        flexShrink: 0,
      }}
    >
      {src && !imgError ? (
        <img
          src={src}
          alt={name || 'Avatar'}
          onError={() => setImgError(true)}
          style={{
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            objectFit: 'cover',
          }}
        />
      ) : (
        <span>{getInitials(name)}</span>
      )}

      {statusColor && (
        <span
          style={{
            position: 'absolute',
            bottom: '0',
            right: '0',
            width: `${s.dot}px`,
            height: `${s.dot}px`,
            borderRadius: '50%',
            backgroundColor: statusColor,
            border: '2px solid #ffffff',
          }}
        />
      )}
    </div>
  );
};

export interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  max?: number;
  spacing?: number;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

export const AvatarGroup: React.FC<AvatarGroupProps> = ({
  children,
  max = 4,
  spacing = -10,
  size,
  className = '',
  style,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const excess = childrenArray.length - max;

  return (
    <div
      className={`boost-avatar-group ${className}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        flexDirection: 'row',
        ...style,
      }}
      {...props}
    >
      {visibleAvatars.map((child, index) => (
        <div
          key={index}
          style={{
            marginLeft: index === 0 ? 0 : `${spacing}px`,
            border: '2px solid #ffffff',
            borderRadius: '50%',
            display: 'inline-flex',
            zIndex: visibleAvatars.length - index,
          }}
        >
          {React.isValidElement(child) && size
            ? React.cloneElement(child as React.ReactElement<any>, { size })
            : child}
        </div>
      ))}

      {excess > 0 && (
        <div
          style={{
            marginLeft: `${spacing}px`,
            border: '2px solid #ffffff',
            borderRadius: '50%',
            backgroundColor: 'var(--boost-surface, #f1f5f9)',
            color: 'var(--boost-text, #0f172a)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontWeight: 700,
            fontSize: '12px',
            width: size === 'sm' ? '32px' : size === 'lg' ? '52px' : '40px',
            height: size === 'sm' ? '32px' : size === 'lg' ? '52px' : '40px',
            zIndex: 0,
            userSelect: 'none',
          }}
        >
          +{excess}
        </div>
      )}
    </div>
  );
};



Avatar.displayName = 'Avatar';
AvatarGroup.displayName = 'AvatarGroup';

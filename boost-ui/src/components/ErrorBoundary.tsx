'use client';

import * as React from 'react';

/**
 * ErrorBoundary — Catches React render errors and displays a graceful fallback UI.
 * Prevents the entire app from crashing when a single component throws.
 *
 * @example
 * ```tsx
 * <ErrorBoundary fallback={<p>Something broke</p>}>
 *   <MyComponent />
 * </ErrorBoundary>
 * ```
 */
export interface ErrorBoundaryProps {
  /** Children to render under error protection */
  children: React.ReactNode;
  /** Optional custom fallback UI. Receives the error and a reset function */
  fallback?: React.ReactNode | ((error: Error, reset: () => void) => React.ReactNode);
  /** Called when an error is caught (useful for logging) */
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  static displayName = 'ErrorBoundary';

  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo): void {
    this.props.onError?.(error, errorInfo);
    // Dev warning in non-production
    if (process.env.NODE_ENV !== 'production') {
      console.warn('[BoostEngine ErrorBoundary] Caught an error:', error.message, errorInfo.componentStack);
    }
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  render(): React.ReactNode {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        if (typeof this.props.fallback === 'function') {
          return (this.props.fallback as (err: Error, reset: () => void) => React.ReactNode)(
            this.state.error,
            this.handleReset
          );
        }
        return this.props.fallback;
      }

      // Default fallback UI
      return (
        <div
          style={{
            padding: '24px',
            borderRadius: 'var(--boost-radius, 12px)',
            backgroundColor: 'var(--boost-destructive-bg, rgba(239,68,68,0.1))',
            border: '1px solid var(--boost-destructive-border, rgba(239,68,68,0.25))',
            color: 'var(--boost-destructive-text, #dc2626)',
            fontFamily: 'var(--boost-font, system-ui, sans-serif)',
            fontSize: '14px',
            textAlign: 'center' as const,
          }}
          role="alert"
        >
          <p style={{ fontWeight: 600, margin: '0 0 8px' }}>
            ⚠️ Something went wrong
          </p>
          <p style={{ margin: '0 0 12px', opacity: 0.8, fontSize: '13px' }}>
            {this.state.error.message || 'An unexpected error occurred'}
          </p>
          <button
            onClick={this.handleReset}
            style={{
              padding: '8px 18px',
              backgroundColor: 'var(--boost-primary, #2563eb)',
              color: '#fff',
              border: 'none',
              borderRadius: 'var(--boost-radius, 8px)',
              cursor: 'pointer',
              fontSize: '13px',
            }}
          >
            Try again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}
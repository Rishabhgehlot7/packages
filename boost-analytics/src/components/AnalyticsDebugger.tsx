import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { EventLog, AnalyticsDiagnosis } from '../types';
import {
  getEventLogs,
  clearEventLogs,
  onAnalyticsEvent,
  diagnoseAnalytics,
  fireTestEvent,
} from '../tracker';

/**
 * On-Screen Live Analytics Tester & Debugger Widget.
 * Shows real-time event stream, connection status with Meta Pixel & GTM,
 * and lets developers fire 1-click test events.
 */
export function AnalyticsDebugger(): React.ReactElement | null {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [logs, setLogs] = useState<EventLog[]>([]);
  const [diagnosis, setDiagnosis] = useState<AnalyticsDiagnosis>({
    metaPixelReady: false,
    gtmReady: false,
    clarityReady: false,
    totalEventsFired: 0,
  });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Load initial state
    setLogs(getEventLogs());
    setDiagnosis(diagnoseAnalytics());

    // Subscribe to new incoming events
    const unsubscribe = onAnalyticsEvent((_, allLogs) => {
      setLogs([...allLogs]);
      setDiagnosis(diagnoseAnalytics());
    });

    // Re-check diagnosis after scripts load
    const timer = setInterval(() => {
      setDiagnosis(diagnoseAnalytics());
    }, 2000);

    return () => {
      unsubscribe();
      clearInterval(timer);
    };
  }, []);

  if (!mounted || typeof document === 'undefined' || !document.body) {
    return null;
  }

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '16px',
        right: '16px',
        zIndex: 999999,
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        fontSize: '13px',
      }}
    >
      {/* Floating Pill Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: '#0f172a',
            color: '#f8fafc',
            padding: '8px 14px',
            borderRadius: '9999px',
            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.3)',
            border: '1px solid #334155',
            cursor: 'pointer',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#1e293b')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#0f172a')}
        >
          <span>🎯</span>
          <span>Analytics Test Mode</span>
          {logs.length > 0 && (
            <span
              style={{
                backgroundColor: '#2563eb',
                color: '#fff',
                fontSize: '11px',
                padding: '1px 6px',
                borderRadius: '9999px',
              }}
            >
              {logs.length}
            </span>
          )}
        </button>
      )}

      {/* Expanded Live Event Drawer */}
      {isOpen && (
        <div
          style={{
            width: '380px',
            maxHeight: '520px',
            backgroundColor: '#090d16',
            color: '#f1f5f9',
            borderRadius: '16px',
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.6)',
            border: '1px solid #1e293b',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '12px 16px',
              backgroundColor: '#0f172a',
              borderBottom: '1px solid #1e293b',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '16px' }}>🎯</span>
              <strong style={{ fontSize: '14px', color: '#fff' }}>
                Analytics Inspector
              </strong>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                cursor: 'pointer',
                fontSize: '18px',
                lineHeight: 1,
              }}
            >
              ✕
            </button>
          </div>

          {/* Connection Status Indicators */}
          <div
            style={{
              padding: '10px 16px',
              backgroundColor: '#131b2e',
              borderBottom: '1px solid #1e293b',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '6px',
              fontSize: '11px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{diagnosis.metaPixelReady ? '🟢' : '🔴'}</span>
              <span>
                Meta Pixel: <strong>{diagnosis.metaPixelReady ? 'Active' : 'Missing'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{diagnosis.gtmReady ? '🟢' : '🔴'}</span>
              <span>
                GTM/GA4: <strong>{diagnosis.gtmReady ? 'Active' : 'Missing'}</strong>
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span>{diagnosis.clarityReady ? '🟢' : '⚪'}</span>
              <span>
                Clarity: <strong>{diagnosis.clarityReady ? 'Active' : 'Off'}</strong>
              </span>
            </div>
            <div style={{ color: '#94a3b8', textAlign: 'right' }}>
              Events Logged: <strong style={{ color: '#fff' }}>{logs.length}</strong>
            </div>
          </div>

          {/* Live Action Test Buttons */}
          <div
            style={{
              padding: '8px 16px',
              backgroundColor: '#0c1222',
              display: 'flex',
              gap: '8px',
              borderBottom: '1px solid #1e293b',
            }}
          >
            <button
              onClick={() => fireTestEvent('AddToCart')}
              style={{
                flex: 1,
                padding: '6px 8px',
                backgroundColor: '#2563eb',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              🛒 Test AddToCart
            </button>
            <button
              onClick={() => fireTestEvent('Purchase')}
              style={{
                flex: 1,
                padding: '6px 8px',
                backgroundColor: '#16a34a',
                color: '#fff',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              💳 Test Purchase
            </button>
            <button
              onClick={() => clearEventLogs()}
              title="Clear event history"
              style={{
                padding: '6px 10px',
                backgroundColor: '#334155',
                color: '#f8fafc',
                border: 'none',
                borderRadius: '6px',
                fontSize: '11px',
                cursor: 'pointer',
              }}
            >
              Clear
            </button>
          </div>

          {/* Real-time Event Feed */}
          <div
            style={{
              padding: '8px 12px',
              overflowY: 'auto',
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
            }}
          >
            {logs.length === 0 ? (
              <div
                style={{
                  textAlign: 'center',
                  padding: '30px 10px',
                  color: '#64748b',
                  fontSize: '12px',
                }}
              >
                <div>Waiting for events...</div>
                <div style={{ marginTop: '4px', fontSize: '11px' }}>
                  Click "Test AddToCart" or interact with products on page
                </div>
              </div>
            ) : (
              logs.map((log) => {
                const isExpanded = expandedId === log.id;
                return (
                  <div
                    key={log.id}
                    onClick={() => setExpandedId(isExpanded ? null : log.id)}
                    style={{
                      backgroundColor: '#111827',
                      border: '1px solid #1f2937',
                      borderRadius: '8px',
                      padding: '8px 10px',
                      cursor: 'pointer',
                      transition: 'border-color 0.15s ease',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '4px',
                      }}
                    >
                      <strong
                        style={{
                          color: '#38bdf8',
                          fontSize: '12px',
                          fontWeight: 600,
                        }}
                      >
                        {log.eventName}
                      </strong>
                      <span style={{ fontSize: '10px', color: '#64748b' }}>
                        {log.timestamp}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                      {log.channels.map((ch) => (
                        <span
                          key={ch}
                          style={{
                            fontSize: '10px',
                            backgroundColor:
                              ch === 'Meta Pixel'
                                ? 'rgba(59, 130, 246, 0.2)'
                                : 'rgba(16, 185, 129, 0.2)',
                            color: ch === 'Meta Pixel' ? '#60a5fa' : '#34d399',
                            padding: '1px 5px',
                            borderRadius: '4px',
                          }}
                        >
                          {ch}
                        </span>
                      ))}
                    </div>

                    {isExpanded && (
                      <pre
                        style={{
                          marginTop: '8px',
                          padding: '6px',
                          backgroundColor: '#030712',
                          color: '#cbd5e1',
                          fontSize: '10px',
                          borderRadius: '4px',
                          overflowX: 'auto',
                          maxHeight: '140px',
                          whiteSpace: 'pre-wrap',
                          wordBreak: 'break-all',
                        }}
                      >
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    )}
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

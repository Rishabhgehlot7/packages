'use client';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BoostNotificationsManager } from '../notif-manager';
import { NotificationRecord, NotificationTemplate, NotificationChannel, NotificationRecipient, NotificationsConfig } from '../notif-types';

const NotifContext = createContext<{ manager: BoostNotificationsManager } | null>(null);
function useCtx() { const c = useContext(NotifContext); if (!c) throw new Error('Use inside <BoostNotificationsProvider>'); return c; }

export function BoostNotificationsProvider({ config, children }: { config?: Partial<NotificationsConfig>; children: React.ReactNode }) {
  const [manager] = useState(() => new BoostNotificationsManager(config));
  return <NotifContext.Provider value={{ manager }}>{children}</NotifContext.Provider>;
}

export function useNotifications() { return useCtx().manager; }

export function useNotificationHistory(recipientId: string) {
  const { manager } = useCtx();
  const [history, setHistory] = useState<NotificationRecord[]>(() => manager.getHistory(recipientId));
  useEffect(() => {
    const refresh = ({ recipientId: rid }: { id: string; channel: NotificationChannel; recipientId: string }) => {
      if (rid === recipientId) setHistory(manager.getHistory(recipientId));
    };
    manager.on('notification:sent', refresh);
    manager.on('notification:failed', ({ id, channel, error }) => setHistory(manager.getHistory(recipientId)));
    return () => { manager.removeAllListeners('notification:sent'); };
  }, [manager, recipientId]);

  const send = useCallback((template: NotificationTemplate | string, variables?: Record<string, string>, channel?: NotificationChannel) =>
    manager.send({ template, recipient: { id: recipientId }, variables, channel }), [manager, recipientId]);

  return { history, send };
}

export function useWebhooks() {
  const { manager } = useCtx();
  const [webhooks, setWebhooks] = useState(() => manager.getWebhooks());
  useEffect(() => {
    const refresh = () => setWebhooks(manager.getWebhooks());
    manager.on('webhook:triggered', refresh);
    return () => { manager.off('webhook:triggered', refresh); };
  }, [manager]);

  const registerWebhook = useCallback((url: string, events: string[], secret?: string) => {
    const wh = manager.registerWebhook(url, events, secret);
    setWebhooks(manager.getWebhooks());
    return wh;
  }, [manager]);

  return { webhooks, registerWebhook };
}

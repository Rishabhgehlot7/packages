// @boostengine/notifications — Updated Entry Point
export { BoostNotificationsManager } from './notif-manager';
export type {
  NotificationRecord, NotificationChannel, NotificationTemplate,
  NotificationRecipient, NotificationsConfig, NotificationStatus,
  WebhookRegistration, WebhookPayload, NotificationsEvents,
} from './notif-types';
export { DEFAULT_NOTIFICATIONS_CONFIG } from './notif-types';
export { notificationsAgentTools } from './notif-agent';
export type { NotificationsAgentToolName } from './notif-agent';
// Backward compat: re-export existing manager
export * from './manager';

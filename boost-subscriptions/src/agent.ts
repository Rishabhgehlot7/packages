/**
 * @boostengine/subscriptions - AI Agent Tool Definitions
 */

import { SubscriptionEngine } from './engine';
import { CreateSubscriptionInput, SubscriptionFrequency } from './types';

export interface AgentSubscriptionToolsOptions {
  engine: SubscriptionEngine;
}

export function createSubscriptionAgentTools(options: AgentSubscriptionToolsOptions) {
  const { engine } = options;

  return [
    {
      name: 'get_customer_subscriptions',
      description: 'Retrieve all active, paused, or previous subscriptions for a customer by their customer ID or email.',
      parameters: {
        type: 'object',
        properties: {
          customerId: { type: 'string', description: 'Unique customer identifier' }
        },
        required: ['customerId']
      },
      handler: async (args: { customerId: string }) => {
        const subs = engine.getCustomerSubscriptions(args.customerId);
        return {
          success: true,
          count: subs.length,
          subscriptions: subs
        };
      }
    },
    {
      name: 'pause_customer_subscription',
      description: 'Pause a customer subscription until a future date or indefinitely.',
      parameters: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string', description: 'The subscription ID to pause' },
          untilDate: { type: 'string', description: 'Optional ISO date string when subscription will automatically resume' }
        },
        required: ['subscriptionId']
      },
      handler: async (args: { subscriptionId: string; untilDate?: string }) => {
        try {
          const sub = engine.pauseSubscription(args.subscriptionId, args.untilDate);
          return {
            success: true,
            message: `Subscription ${args.subscriptionId} is now paused.`,
            subscription: sub
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'resume_customer_subscription',
      description: 'Resume a currently paused customer subscription.',
      parameters: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string', description: 'The subscription ID to resume' }
        },
        required: ['subscriptionId']
      },
      handler: async (args: { subscriptionId: string }) => {
        try {
          const sub = engine.resumeSubscription(args.subscriptionId);
          return {
            success: true,
            message: `Subscription ${args.subscriptionId} has been resumed. Next billing: ${sub.nextBillingDate}`,
            subscription: sub
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'skip_subscription_delivery',
      description: 'Skip the upcoming delivery cycle for a subscription without cancelling it.',
      parameters: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string', description: 'The subscription ID to skip' }
        },
        required: ['subscriptionId']
      },
      handler: async (args: { subscriptionId: string }) => {
        try {
          const sub = engine.skipNextDelivery(args.subscriptionId);
          return {
            success: true,
            message: `Next delivery skipped. New billing date: ${sub.nextBillingDate}`,
            subscription: sub
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'cancel_customer_subscription',
      description: 'Cancel an ongoing subscription upon customer request, recording the feedback reason.',
      parameters: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string', description: 'The subscription ID to cancel' },
          reason: { type: 'string', description: 'Reason for cancellation (e.g. too expensive, moving, excess inventory)' }
        },
        required: ['subscriptionId', 'reason']
      },
      handler: async (args: { subscriptionId: string; reason: string }) => {
        try {
          const sub = engine.cancelSubscription(args.subscriptionId, args.reason);
          return {
            success: true,
            message: `Subscription ${args.subscriptionId} has been cancelled.`,
            subscription: sub
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'update_subscription_frequency',
      description: 'Modify the auto-delivery schedule frequency for a subscription (e.g. change from 30 days to 14 days).',
      parameters: {
        type: 'object',
        properties: {
          subscriptionId: { type: 'string', description: 'The subscription ID' },
          frequency: {
            type: 'string',
            enum: ['daily', 'weekly', 'biweekly', 'monthly', 'bimonthly', 'quarterly', 'yearly', 'custom_days'],
            description: 'New delivery frequency'
          },
          intervalDays: { type: 'number', description: 'Custom interval days if frequency is custom_days' }
        },
        required: ['subscriptionId', 'frequency']
      },
      handler: async (args: { subscriptionId: string; frequency: SubscriptionFrequency; intervalDays?: number }) => {
        try {
          const sub = engine.updateFrequency(args.subscriptionId, args.frequency, args.intervalDays);
          return {
            success: true,
            message: `Frequency updated to ${args.frequency}. Next delivery: ${sub.nextDeliveryDate}`,
            subscription: sub
          };
        } catch (err: any) {
          return { success: false, error: err.message };
        }
      }
    },
    {
      name: 'get_subscription_business_metrics',
      description: 'Fetch real-time MRR, ARR, AOV, churn rate, and active subscriber metrics.',
      parameters: {
        type: 'object',
        properties: {}
      },
      handler: async () => {
        const metrics = engine.getMetrics();
        return {
          success: true,
          metrics
        };
      }
    }
  ];
}

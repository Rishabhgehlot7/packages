import { OmnichannelEngine, comms } from './engine';
import {
  OrderNotificationParams,
  ShippingNotificationParams,
  DeliveryNotificationParams,
  OutForDeliveryNotificationParams,
  CartRecoveryParams,
  CODVerificationParams,
} from './types';

export interface AgentToolDeclaration {
  name: string;
  description: string;
  parameters: {
    type: 'object';
    properties: Record<string, any>;
    required?: string[];
  };
}

/**
 * CommunicationsAgentToolkit
 *
 * Provides ready-to-use function calling schemas and execution methods for:
 * - OpenAI Function Calling / Tools
 * - Anthropic Claude Tools
 * - Google Gemini Function Declarations
 * - Vercel AI SDK / LangChain / Cursor / Windsurf
 */
export class CommunicationsAgentToolkit {
  constructor(private engine: OmnichannelEngine = comms) {}

  /**
   * Universal Agent Tool Definitions (JSON Schema compliant)
   */
  public getDeclarations(): AgentToolDeclaration[] {
    return [
      {
        name: 'send_order_update',
        description:
          'Send an eCommerce order notification (order confirmed, shipped, out for delivery, or delivered) to a customer via WhatsApp or SMS with automatic fallback.',
        parameters: {
          type: 'object',
          properties: {
            stage: {
              type: 'string',
              enum: ['confirmed', 'shipped', 'out_for_delivery', 'delivered'],
              description: 'The order lifecycle milestone stage.',
            },
            customerName: { type: 'string', description: 'Name of the customer.' },
            phone: { type: 'string', description: 'Customer phone number in E.164 or national format (e.g. +919876543210).' },
            orderId: { type: 'string', description: 'Unique alphanumeric order ID.' },
            amount: { type: 'number', description: 'Total order value in INR.' },
            courierName: { type: 'string', description: 'Courier company name if shipped (e.g. Bluedart, Delhivery).' },
            awbNumber: { type: 'string', description: 'Tracking/AWB number if shipped.' },
            trackingUrl: { type: 'string', description: 'Live tracking URL.' },
            expectedDelivery: { type: 'string', description: 'Estimated delivery date or timeframe.' },
            storeName: { type: 'string', description: 'Store or brand name.' },
          },
          required: ['stage', 'customerName', 'phone', 'orderId'],
        },
      },
      {
        name: 'send_smart_otp',
        description:
          'Generate and dispatch a cryptographic 4 or 6-digit OTP with multi-tier failover (WhatsApp ➔ SMS ➔ Voice call) for login or checkout verification.',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Recipient phone number (e.g. +919876543210).' },
            customerName: { type: 'string', description: 'Optional customer name for personalized message.' },
            length: { type: 'number', enum: [4, 6], description: 'OTP length (default 6).' },
            validityMinutes: { type: 'number', description: 'Validity duration in minutes (default 5).' },
          },
          required: ['phone'],
        },
      },
      {
        name: 'verify_smart_otp',
        description:
          'Cryptographically verify an entered OTP against a previously issued token without requiring database storage.',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Customer phone number.' },
            otp: { type: 'string', description: 'The 4 or 6 digit OTP entered by user.' },
            token: { type: 'string', description: 'HMAC signed token returned when OTP was dispatched.' },
          },
          required: ['phone', 'otp', 'token'],
        },
      },
      {
        name: 'send_cart_recovery',
        description:
          'Send a high-conversion personalized abandoned cart recovery notification with discount promo code and checkout link via WhatsApp or SMS.',
        parameters: {
          type: 'object',
          properties: {
            customerName: { type: 'string', description: 'Name of the buyer.' },
            phone: { type: 'string', description: 'Customer phone number.' },
            cartUrl: { type: 'string', description: 'Direct checkout URL with restored cart items.' },
            discountCode: { type: 'string', description: 'Promo coupon code (e.g. SAVE10).' },
            itemCount: { type: 'number', description: 'Number of items left in bag.' },
          },
          required: ['customerName', 'phone', 'cartUrl'],
        },
      },
      {
        name: 'send_customer_message',
        description:
          'Send a direct custom message or notification to a customer across WhatsApp, SMS, or Email.',
        parameters: {
          type: 'object',
          properties: {
            channel: {
              type: 'string',
              enum: ['whatsapp', 'sms', 'email'],
              description: 'Target communication channel.',
            },
            to: { type: 'string', description: 'Recipient phone number or email address.' },
            message: { type: 'string', description: 'Text message content.' },
            subject: { type: 'string', description: 'Email subject line (required if channel is email).' },
          },
          required: ['channel', 'to', 'message'],
        },
      },
      {
        name: 'trigger_ai_voice_call',
        description:
          'Trigger an autonomous AI voice agent call (Bolna AI / MCUBE) for automated COD order confirmation or support inquiry.',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Customer phone number to call.' },
            customerName: { type: 'string', description: 'Name of the customer.' },
            orderId: { type: 'string', description: 'Order ID to verify.' },
            amount: { type: 'number', description: 'Order amount to confirm.' },
          },
          required: ['phone', 'customerName', 'orderId', 'amount'],
        },
      },
      {
        name: 'check_channel_health',
        description:
          'Inspect the current configuration and availability of WhatsApp, SMS, Voice, RCS, and Email providers.',
        parameters: {
          type: 'object',
          properties: {},
        },
      },
    ];
  }

  /**
   * OpenAI Tools Format
   */
  public getOpenAITools() {
    return this.getDeclarations().map((tool) => ({
      type: 'function' as const,
      function: {
        name: tool.name,
        description: tool.description,
        parameters: tool.parameters,
      },
    }));
  }

  /**
   * Anthropic Claude Tools Format
   */
  public getAnthropicTools() {
    return this.getDeclarations().map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.parameters,
    }));
  }

  /**
   * Google Gemini API Tool Declarations Format
   */
  public getGeminiTools() {
    return [
      {
        functionDeclarations: this.getDeclarations().map((tool) => ({
          name: tool.name,
          description: tool.description,
          parameters: tool.parameters,
        })),
      },
    ];
  }

  /**
   * Vercel AI SDK Tool Format
   */
  public getVercelAITools() {
    const toolsObj: Record<string, any> = {};
    for (const tool of this.getDeclarations()) {
      toolsObj[tool.name] = {
        description: tool.description,
        parameters: tool.parameters,
        execute: async (args: any) => this.execute(tool.name, args),
      };
    }
    return toolsObj;
  }

  /**
   * Execute an Agent Tool Invocation by Name
   */
  public async execute(toolName: string, args: Record<string, any>): Promise<any> {
    switch (toolName) {
      case 'send_order_update': {
        const { stage, customerName, phone, orderId, amount, courierName, awbNumber, trackingUrl, expectedDelivery, storeName } = args;
        if (stage === 'confirmed') {
          return this.engine.sendOrderConfirmation({
            customerName,
            phone,
            orderId,
            amount: amount || 0,
            trackingUrl,
            storeName,
          });
        } else if (stage === 'shipped') {
          return this.engine.sendShippingUpdate({
            customerName,
            phone,
            orderId,
            courierName: courierName || 'Express Courier',
            awbNumber: awbNumber || 'PENDING',
            trackingUrl: trackingUrl || '',
            expectedDelivery,
            storeName,
          });
        } else if (stage === 'out_for_delivery') {
          return this.engine.sendOutForDelivery({
            customerName,
            phone,
            orderId,
            trackingUrl,
            storeName,
          });
        } else if (stage === 'delivered') {
          return this.engine.sendOrderDelivered({
            customerName,
            phone,
            orderId,
            storeName,
          });
        }
        throw new Error(`Unsupported order stage: ${stage}`);
      }

      case 'send_smart_otp': {
        return this.engine.otp.sendSmartOTP({
          phone: args.phone,
          customerName: args.customerName,
          length: args.length || 6,
          validityMinutes: args.validityMinutes || 5,
        });
      }

      case 'verify_smart_otp': {
        return this.engine.otp.verifyOTP({
          phone: args.phone,
          otp: args.otp,
          token: args.token,
        });
      }

      case 'send_cart_recovery': {
        return this.engine.sendAbandonedCartAlert({
          customerName: args.customerName,
          phone: args.phone,
          cartUrl: args.cartUrl,
          discountCode: args.discountCode,
          itemCount: args.itemCount,
        });
      }

      case 'send_customer_message': {
        const { channel, to, message, subject } = args;
        if (channel === 'whatsapp') {
          return this.engine.quickWhatsApp(to, message);
        } else if (channel === 'sms') {
          return this.engine.quickSMS(to, message);
        } else if (channel === 'email') {
          return this.engine.quickEmail(to, subject || 'Store Update', message);
        }
        throw new Error(`Unsupported channel: ${channel}`);
      }

      case 'trigger_ai_voice_call': {
        return this.engine.sendAIVoiceOrderConfirmation({
          phone: args.phone,
          customerName: args.customerName,
          orderId: args.orderId,
          amount: args.amount,
        });
      }

      case 'check_channel_health': {
        return {
          status: 'ready',
          activeProviders: {
            whatsapp: (this.engine as any).whatsappAdapter?.name || 'none',
            sms: (this.engine as any).smsAdapter?.name || 'none',
            voice: (this.engine as any).voiceAdapter?.name || 'none',
            rcs: (this.engine as any).rcsAdapter?.name || 'none',
            email: (this.engine as any).emailAdapter?.name || 'none',
          },
          supportedChannels: ['whatsapp', 'sms', 'voice', 'telephony', 'rcs', 'email'],
        };
      }

      default:
        throw new Error(`Unknown communications agent tool: ${toolName}`);
    }
  }
}

export const agentToolkit = new CommunicationsAgentToolkit();

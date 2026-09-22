import { EventEmitter } from 'node:events';
import * as crypto from 'node:crypto';
import {
  OmnichannelConfig,
  UniversalResult,
  WhatsAppSendOptions,
  SMSSendOptions,
  VoiceCallOptions,
  RCSSendOptions,
  EmailSendOptions,
  OmnichannelProvidersConfig,
  ClickToCallOptions,
  AIAgentCallOptions,
  InboundWebhookEvent,
  OrderNotificationParams,
  ShippingNotificationParams,
  DeliveryNotificationParams,
  OutForDeliveryNotificationParams,
  CartRecoveryParams,
  CODVerificationParams,
  RefundNotificationParams,
  ReviewRequestParams,
  WebhookVerifyOptions,
  SmartOTPResult,
} from './types';
import {
  IWhatsAppAdapter,
  ISMSAdapter,
  IVoiceAdapter,
  IRCSAdapter,
  IEmailAdapter,
} from './adapters/base';

// WhatsApp Adapters
import { InteraktWhatsAppAdapter } from './adapters/whatsapp/interakt.adapter';
import { GupshupWhatsAppAdapter } from './adapters/whatsapp/gupshup-wa.adapter';
import { MetaCloudWhatsAppAdapter } from './adapters/whatsapp/meta.adapter';
import { WatiWhatsAppAdapter } from './adapters/whatsapp/wati.adapter';
import { TwilioWhatsAppAdapter } from './adapters/whatsapp/twilio-wa.adapter';
import { AiSensyWhatsAppAdapter } from './adapters/whatsapp/aisensy.adapter';
import { ThreeSixtyDialogWhatsAppAdapter } from './adapters/whatsapp/360dialog.adapter';
import { RouteMobileWhatsAppAdapter } from './adapters/whatsapp/routemobile-wa.adapter';
import { InfobipWhatsAppAdapter } from './adapters/whatsapp/infobip-wa.adapter';
import { VonageWhatsAppAdapter } from './adapters/whatsapp/vonage-wa.adapter';

// SMS Adapters
import { MSG91SMSAdapter } from './adapters/sms/msg91.adapter';
import { Fast2SMSSMSAdapter } from './adapters/sms/fast2sms.adapter';
import { TwoFactorSMSAdapter } from './adapters/sms/two-factor.adapter';
import { TwilioSMSAdapter } from './adapters/sms/twilio-sms.adapter';
import { ExotelSMSAdapter } from './adapters/sms/exotel-sms.adapter';
import { RouteMobileSMSAdapter } from './adapters/sms/routemobile-sms.adapter';
import { InfobipSMSAdapter } from './adapters/sms/infobip-sms.adapter';
import { VonageSMSAdapter } from './adapters/sms/vonage-sms.adapter';

// Voice & Telephony Adapters
import { ExotelVoiceAdapter } from './adapters/voice/exotel.adapter';
import { MSG91VoiceAdapter } from './adapters/voice/msg91-voice.adapter';
import { TwilioVoiceAdapter } from './adapters/voice/twilio-voice.adapter';
import { InfobipVoiceAdapter } from './adapters/voice/infobip-voice.adapter';
import { GupshupVoiceAdapter } from './adapters/voice/gupshup-voice.adapter';
import { TwoFactorVoiceAdapter } from './adapters/voice/two-factor-voice.adapter';
import { MCubeTelephonyAdapter } from './adapters/telephony/mcube.adapter';
import { MyOperatorTelephonyAdapter } from './adapters/telephony/myoperator.adapter';
import { OzonetelTelephonyAdapter } from './adapters/telephony/ozonetel.adapter';
import { KnowlarityTelephonyAdapter } from './adapters/telephony/knowlarity.adapter';
import { SmartfloTelephonyAdapter } from './adapters/telephony/smartflo.adapter';
import { AirtelIQTelephonyAdapter } from './adapters/telephony/airtel-iq.adapter';
import { ServetelTelephonyAdapter } from './adapters/telephony/servetel.adapter';
import { PlivoTelephonyAdapter } from './adapters/telephony/plivo.adapter';
import { BolnaAIVoiceAdapter } from './adapters/telephony/bolna.adapter';

// RCS Adapters
import { GupshupRCSAdapter } from './adapters/rcs/gupshup-rcs.adapter';
import { RouteMobileRCSAdapter } from './adapters/rcs/routemobile-rcs.adapter';
import { InfobipRCSAdapter } from './adapters/rcs/infobip-rcs.adapter';
import { InteraktRCSAdapter } from './adapters/rcs/interakt.adapter';

// Email Adapters
import { ResendEmailAdapter } from './adapters/email/resend.adapter';
import { SendGridEmailAdapter } from './adapters/email/sendgrid.adapter';
import { SMTPEmailAdapter } from './adapters/email/smtp.adapter';

// OTP Manager
import { OTPManager } from './otp/otp-manager';

/**
 * Automatically inspects process.env to resolve configured providers
 * for zero-effort developer onboarding.
 */
function resolveAutoEnvProviders(): OmnichannelProvidersConfig {
  const env = (typeof process !== 'undefined' && process.env) ? process.env : {};
  const providers: OmnichannelProvidersConfig = {};

  // 1. WhatsApp auto-detect
  if (env.D360_API_KEY) {
    providers.whatsapp = { provider: '360dialog', apiKey: env.D360_API_KEY };
  } else if (env.INTERAKT_API_KEY) {
    providers.whatsapp = { provider: 'interakt', apiKey: env.INTERAKT_API_KEY };
  } else if (env.AISENSY_API_KEY) {
    providers.whatsapp = { provider: 'aisensy', apiKey: env.AISENSY_API_KEY };
  } else if (env.WATI_API_KEY) {
    providers.whatsapp = { provider: 'wati', apiKey: env.WATI_API_KEY, apiUrl: env.WATI_API_URL };
  } else if (env.META_WA_TOKEN) {
    providers.whatsapp = {
      provider: 'meta',
      apiKey: env.META_WA_TOKEN,
      senderPhoneId: env.META_PHONE_NUMBER_ID,
    };
  } else if (env.GUPSHUP_API_KEY) {
    providers.whatsapp = { provider: 'gupshup', apiKey: env.GUPSHUP_API_KEY, appId: env.GUPSHUP_APP_ID };
  } else if (env.ROUTEMOBILE_API_KEY) {
    providers.whatsapp = { provider: 'routemobile', apiKey: env.ROUTEMOBILE_API_KEY };
  } else if (env.INFOBIP_API_KEY) {
    providers.whatsapp = { provider: 'infobip', apiKey: env.INFOBIP_API_KEY, apiUrl: env.INFOBIP_BASE_URL };
  }

  // 2. SMS auto-detect
  if (env.MSG91_AUTH_KEY) {
    providers.sms = {
      provider: 'msg91',
      apiKey: env.MSG91_AUTH_KEY,
      senderId: env.MSG91_SENDER_ID || 'BOOSTS',
      dltEntityId: env.DLT_ENTITY_ID,
      dltTemplateId: env.DLT_TE_ID,
    };
  } else if (env.FAST2SMS_API_KEY) {
    providers.sms = { provider: 'fast2sms', apiKey: env.FAST2SMS_API_KEY, senderId: env.FAST2SMS_SENDER_ID };
  } else if (env.TWOFACTOR_API_KEY) {
    providers.sms = { provider: '2factor', apiKey: env.TWOFACTOR_API_KEY };
  } else if (env.TWILIO_AUTH_TOKEN && env.TWILIO_ACCOUNT_SID) {
    providers.sms = {
      provider: 'twilio',
      apiKey: env.TWILIO_AUTH_TOKEN,
      apiSecret: env.TWILIO_ACCOUNT_SID,
      senderId: env.TWILIO_PHONE_NUMBER,
    };
  }

  // 3. Voice & Telephony auto-detect
  if (env.MCUBE_API_KEY) {
    providers.voice = { provider: 'mcube', apiKey: env.MCUBE_API_KEY, callerId: env.MCUBE_EXE_NUMBER };
  } else if (env.EXOTEL_API_KEY && env.EXOTEL_API_TOKEN) {
    providers.voice = {
      provider: 'exotel',
      apiKey: env.EXOTEL_API_KEY,
      apiToken: env.EXOTEL_API_TOKEN,
      subDomain: env.EXOTEL_SUBDOMAIN,
      callerId: env.EXOTEL_CALLER_ID,
    };
  } else if (env.MYOPERATOR_TOKEN) {
    providers.voice = {
      provider: 'myoperator',
      apiKey: env.MYOPERATOR_TOKEN,
      subDomain: env.MYOPERATOR_COMPANY_ID,
      callerId: env.MYOPERATOR_CALLER_ID,
    };
  } else if (env.OZONETEL_API_KEY) {
    providers.voice = {
      provider: 'ozonetel',
      apiKey: env.OZONETEL_API_KEY,
      subDomain: env.OZONETEL_USERNAME,
      callerId: env.OZONETEL_DID,
    };
  } else if (env.KNOWLARITY_API_KEY) {
    providers.voice = {
      provider: 'knowlarity',
      apiKey: env.KNOWLARITY_API_KEY,
      apiToken: env.KNOWLARITY_TOKEN,
      virtualNumber: env.KNOWLARITY_VIRTUAL_NUMBER,
    };
  } else if (env.BOLNA_API_KEY) {
    providers.voice = { provider: 'bolna', apiKey: env.BOLNA_API_KEY, appId: env.BOLNA_AGENT_ID };
  } else if (env.PLIVO_AUTH_ID && env.PLIVO_AUTH_TOKEN) {
    providers.voice = {
      provider: 'plivo',
      apiKey: env.PLIVO_AUTH_ID,
      apiToken: env.PLIVO_AUTH_TOKEN,
      callerId: env.PLIVO_CALLER_ID,
    };
  } else if (env.MSG91_AUTH_KEY) {
    providers.voice = { provider: 'msg91', apiKey: env.MSG91_AUTH_KEY };
  }

  // 4. RCS auto-detect
  if (env.ROUTEMOBILE_RCS_KEY || env.ROUTEMOBILE_API_KEY) {
    providers.rcs = {
      provider: 'routemobile',
      apiKey: (env.ROUTEMOBILE_RCS_KEY || env.ROUTEMOBILE_API_KEY)!,
      botId: env.ROUTEMOBILE_BOT_ID || 'boost_rcs_bot',
    };
  } else if (env.GUPSHUP_API_KEY) {
    providers.rcs = {
      provider: 'gupshup',
      apiKey: env.GUPSHUP_API_KEY,
      botId: env.GUPSHUP_BOT_ID || 'boost_rcs_bot',
    };
  } else if (env.INTERAKT_API_KEY) {
    providers.rcs = {
      provider: 'interakt',
      apiKey: env.INTERAKT_API_KEY,
    };
  }

  // 5. Email auto-detect
  if (env.RESEND_API_KEY) {
    providers.email = {
      provider: 'resend',
      apiKey: env.RESEND_API_KEY,
      from: env.EMAIL_FROM || 'orders@booststore.in',
      fromName: env.EMAIL_FROM_NAME || 'BoostStore',
    };
  } else if (env.SENDGRID_API_KEY) {
    providers.email = {
      provider: 'sendgrid',
      apiKey: env.SENDGRID_API_KEY,
      from: env.EMAIL_FROM || 'orders@booststore.in',
    };
  }

  return providers;
}

export class OmnichannelEngine extends EventEmitter {
  private whatsappAdapter?: IWhatsAppAdapter;
  private smsAdapter?: ISMSAdapter;
  private voiceAdapter?: any;
  private rcsAdapter?: IRCSAdapter;
  private emailAdapter?: IEmailAdapter;
  private dedupeHistory: Map<string, number[]> = new Map();

  public otp: OTPManager;

  constructor(public config: OmnichannelConfig = {}) {
    super();
    const autoProviders = resolveAutoEnvProviders();
    const providers = { ...autoProviders, ...(config.providers || {}) };

    // 1. Initialize WhatsApp Adapter
    if (providers.whatsapp) {
      switch (providers.whatsapp.provider) {
        case 'interakt':
          this.whatsappAdapter = new InteraktWhatsAppAdapter(providers.whatsapp);
          break;
        case 'gupshup':
          this.whatsappAdapter = new GupshupWhatsAppAdapter(providers.whatsapp);
          break;
        case 'meta':
          this.whatsappAdapter = new MetaCloudWhatsAppAdapter(providers.whatsapp);
          break;
        case 'wati':
          this.whatsappAdapter = new WatiWhatsAppAdapter(providers.whatsapp);
          break;
        case 'twilio':
          this.whatsappAdapter = new TwilioWhatsAppAdapter(providers.whatsapp);
          break;
        case 'aisensy':
          this.whatsappAdapter = new AiSensyWhatsAppAdapter(providers.whatsapp);
          break;
        case '360dialog':
          this.whatsappAdapter = new ThreeSixtyDialogWhatsAppAdapter(providers.whatsapp);
          break;
        case 'routemobile':
          this.whatsappAdapter = new RouteMobileWhatsAppAdapter(providers.whatsapp);
          break;
        case 'infobip':
          this.whatsappAdapter = new InfobipWhatsAppAdapter(providers.whatsapp);
          break;
        case 'vonage':
          this.whatsappAdapter = new VonageWhatsAppAdapter(providers.whatsapp);
          break;
        default:
          throw new Error(`Unsupported WhatsApp provider: ${(providers.whatsapp as any).provider}`);
      }
    }

    // 2. Initialize SMS Adapter
    if (providers.sms) {
      switch (providers.sms.provider) {
        case 'msg91':
          this.smsAdapter = new MSG91SMSAdapter(providers.sms);
          break;
        case 'fast2sms':
          this.smsAdapter = new Fast2SMSSMSAdapter(providers.sms);
          break;
        case '2factor':
          this.smsAdapter = new TwoFactorSMSAdapter(providers.sms);
          break;
        case 'exotel':
          this.smsAdapter = new ExotelSMSAdapter(providers.sms);
          break;
        case 'routemobile':
          this.smsAdapter = new RouteMobileSMSAdapter(providers.sms);
          break;
        case 'twilio':
          this.smsAdapter = new TwilioSMSAdapter(providers.sms);
          break;
        case 'infobip':
          this.smsAdapter = new InfobipSMSAdapter(providers.sms);
          break;
        case 'vonage':
          this.smsAdapter = new VonageSMSAdapter(providers.sms);
          break;
        default:
          throw new Error(`Unsupported SMS provider: ${(providers.sms as any).provider}`);
      }
    }

    // 3. Initialize Voice & Telephony Adapter
    if (providers.voice && providers.telephony) {
      console.warn('[boost-communications] Warning: Both voice and telephony providers are configured. Voice configuration will override telephony.');
    }
    const voiceCfg = providers.voice || (providers.telephony as any);
    if (voiceCfg) {
      switch (voiceCfg.provider) {
        case 'mcube':
          this.voiceAdapter = new MCubeTelephonyAdapter(voiceCfg);
          break;
        case 'exotel':
          this.voiceAdapter = new ExotelVoiceAdapter(voiceCfg);
          break;
        case 'myoperator':
          this.voiceAdapter = new MyOperatorTelephonyAdapter(voiceCfg);
          break;
        case 'ozonetel':
          this.voiceAdapter = new OzonetelTelephonyAdapter(voiceCfg);
          break;
        case 'knowlarity':
          this.voiceAdapter = new KnowlarityTelephonyAdapter(voiceCfg);
          break;
        case 'smartflo':
          this.voiceAdapter = new SmartfloTelephonyAdapter(voiceCfg);
          break;
        case 'airtel-iq':
          this.voiceAdapter = new AirtelIQTelephonyAdapter(voiceCfg);
          break;
        case 'servetel':
          this.voiceAdapter = new ServetelTelephonyAdapter(voiceCfg);
          break;
        case 'plivo':
          this.voiceAdapter = new PlivoTelephonyAdapter(voiceCfg);
          break;
        case 'bolna':
          this.voiceAdapter = new BolnaAIVoiceAdapter(voiceCfg);
          break;
        case 'msg91':
          this.voiceAdapter = new MSG91VoiceAdapter(voiceCfg);
          break;
        case 'twilio':
          this.voiceAdapter = new TwilioVoiceAdapter(voiceCfg);
          break;
        case 'infobip':
          this.voiceAdapter = new InfobipVoiceAdapter(voiceCfg);
          break;
        case 'gupshup':
          this.voiceAdapter = new GupshupVoiceAdapter(voiceCfg);
          break;
        case '2factor':
          this.voiceAdapter = new TwoFactorVoiceAdapter(voiceCfg);
          break;
        default:
          throw new Error(`Unsupported Voice/Telephony provider: ${(voiceCfg as any).provider}`);
      }
    }

    // 4. Initialize RCS Adapter
    if (providers.rcs) {
      switch (providers.rcs.provider) {
        case 'routemobile':
          this.rcsAdapter = new RouteMobileRCSAdapter(providers.rcs);
          break;
        case 'infobip':
          this.rcsAdapter = new InfobipRCSAdapter(providers.rcs);
          break;
        case 'gupshup':
          this.rcsAdapter = new GupshupRCSAdapter(providers.rcs);
          break;
        case 'interakt':
          this.rcsAdapter = new InteraktRCSAdapter(providers.rcs);
          break;
        default:
          throw new Error(`Unsupported RCS provider: ${(providers.rcs as any).provider}`);
      }
    }

    // 5. Initialize Email Adapter
    if (providers.email) {
      switch (providers.email.provider) {
        case 'resend':
          this.emailAdapter = new ResendEmailAdapter(providers.email);
          break;
        case 'sendgrid':
          this.emailAdapter = new SendGridEmailAdapter(providers.email);
          break;
        case 'smtp':
          this.emailAdapter = new SMTPEmailAdapter(providers.email);
          break;
        case 'ses':
          throw new Error('SES Email provider is not yet implemented.');
        default:
          throw new Error(`Unsupported Email provider: ${(providers.email as any).provider}`);
      }
    }

    // 6. Initialize OTP Manager with bound adapters
    this.otp = new OTPManager({
      secret: config.otpSecret || (typeof process !== 'undefined' ? process.env?.OTP_SECRET : undefined),
      whatsappAdapter: this.whatsappAdapter,
      smsAdapter: this.smsAdapter,
      voiceAdapter: this.voiceAdapter,
    });
  }

  // ----------------- Internal Helper: Retry Logic -----------------
  private async withRetry<T>(operation: () => Promise<T>): Promise<T> {
    const maxRetries = this.config.retry?.maxRetries ?? 0;
    const initialDelay = this.config.retry?.initialDelayMs ?? 1000;
    const maxDelay = this.config.retry?.maxDelayMs ?? 5000;

    let attempt = 0;
    while (true) {
      try {
        return await operation();
      } catch (error: any) {
        if (attempt >= maxRetries) {
          throw error;
        }
        attempt++;
        const delay = Math.min(initialDelay * Math.pow(2, attempt - 1), maxDelay);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }

  // ----------------- Webhooks Namespace -----------------
  public get webhooks() {
    return {
      parse: (payload: any, headers?: Record<string, string>): InboundWebhookEvent | null => {
        // Attempt to parse across all configured adapters
        const adapters = [
          this.whatsappAdapter,
          this.smsAdapter,
          this.voiceAdapter,
          this.rcsAdapter,
          this.emailAdapter,
        ];

        for (const adapter of adapters) {
          if (adapter && typeof adapter.parseWebhook === 'function') {
            const event = adapter.parseWebhook(payload, headers);
            if (event) {
              this.emit('webhook:received', event);
              this.emit(`webhook:${event.type}`, event);
              return event;
            }
          }
        }
        return null;
      },
    };
  }

  // ----------------- Direct Channel Namespaces -----------------
  public get whatsapp() {
    return {
      send: async (options: WhatsAppSendOptions): Promise<UniversalResult> => {
        if (!this.whatsappAdapter) {
          throw new Error('WhatsApp provider is not configured. Add credentials in config or process.env.');
        }
        return this.withRetry(() => this.whatsappAdapter!.send(options));
      },
    };
  }

  public get sms() {
    return {
      send: async (options: SMSSendOptions): Promise<UniversalResult> => {
        if (!this.smsAdapter) {
          throw new Error('SMS provider is not configured. Add credentials in config or process.env.');
        }
        return this.withRetry(() => this.smsAdapter!.send(options));
      },
    };
  }

  public get voice() {
    return {
      call: async (options: VoiceCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter) {
          throw new Error('Voice provider is not configured. Add credentials in config or process.env.');
        }
        return this.withRetry(() => this.voiceAdapter!.call(options));
      },
      aiCall: async (options: AIAgentCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter || !this.voiceAdapter.triggerAIAgentCall) {
          throw new Error('Configured voice provider does not support AI voice agent calls (e.g. use Bolna AI).');
        }
        return this.voiceAdapter.triggerAIAgentCall(options);
      },
      clickToCall: async (options: ClickToCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter || !this.voiceAdapter.clickToCall) {
          throw new Error('Configured voice provider does not support click-to-call.');
        }
        return this.voiceAdapter.clickToCall(options);
      },
    };
  }

  public get telephony() {
    return {
      clickToCall: async (options: ClickToCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter || !this.voiceAdapter.clickToCall) {
          throw new Error('Configured telephony provider does not support Click-to-Call (use MCUBE, MyOperator, Exotel, Ozonetel, etc.).');
        }
        return this.voiceAdapter.clickToCall(options);
      },
      call: async (options: VoiceCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter) {
          throw new Error('Telephony provider is not configured.');
        }
        return this.withRetry(() => this.voiceAdapter!.call(options));
      },
      aiCall: async (options: AIAgentCallOptions): Promise<UniversalResult> => {
        if (!this.voiceAdapter || !this.voiceAdapter.triggerAIAgentCall) {
          throw new Error('Telephony provider does not support AI agent calls (use Bolna AI).');
        }
        return this.voiceAdapter.triggerAIAgentCall(options);
      },
    };
  }

  public get rcs() {
    return {
      sendCard: async (options: RCSSendOptions): Promise<UniversalResult> => {
        if (!this.rcsAdapter) {
          throw new Error('RCS provider is not configured. Add credentials in config or process.env.');
        }
        return this.withRetry(() => this.rcsAdapter!.send(options));
      },
    };
  }

  public get email() {
    return {
      send: async (options: EmailSendOptions): Promise<UniversalResult> => {
        if (!this.emailAdapter) {
          throw new Error('Email provider is not configured. Add credentials in config or process.env.');
        }
        return this.withRetry(() => this.emailAdapter!.send(options));
      },
    };
  }

  // ----------------- Anti-Spam / Rate-Limiting Check -----------------
  private checkRateLimit(recipient: string): { allowed: boolean; error?: string } {
    if (!this.config.deduplication?.enabled) {
      return { allowed: true };
    }
    const windowMs = this.config.deduplication.windowMs ?? 60000;
    const maxPerWindow = this.config.deduplication.maxPerWindow ?? 3;
    const now = Date.now();
    const history = (this.dedupeHistory.get(recipient) || []).filter((t) => now - t < windowMs);
    if (history.length >= maxPerWindow) {
      return {
        allowed: false,
        error: `Rate limit exceeded: maximum ${maxPerWindow} communications per ${windowMs / 1000}s allowed for ${recipient}.`,
      };
    }
    history.push(now);
    this.dedupeHistory.set(recipient, history);
    return { allowed: true };
  }

  // ----------------- Developer-Friendly Quick 1-Liners -----------------

  public async quickSMS(to: string, message: string): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(to);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }
    return this.sms.send({ to, message });
  }

  public async quickWhatsApp(
    to: string,
    templateOrText: string,
    variables?: Record<string, string | number>
  ): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(to);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'whatsapp', provider: 'dedupe', error: rateCheck.error };
    }
    if (variables) {
      return this.whatsapp.send({ to, templateName: templateOrText, variables });
    }
    return this.whatsapp.send({ to, message: templateOrText });
  }

  public async quickEmail(
    to: string | string[],
    subject: string,
    htmlOrText: string
  ): Promise<UniversalResult> {
    const isHtml = htmlOrText.includes('<') && htmlOrText.includes('>');
    return this.email.send({
      to,
      subject,
      html: isHtml ? htmlOrText : undefined,
      text: !isHtml ? htmlOrText : undefined,
    });
  }

  public async quickVoice(to: string, messageOrAudioUrl: string): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(to);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'voice', provider: 'dedupe', error: rateCheck.error };
    }
    const isAudio = messageOrAudioUrl.startsWith('http://') || messageOrAudioUrl.startsWith('https://');
    return this.voice.call({
      to,
      audioUrl: isAudio ? messageOrAudioUrl : undefined,
      message: !isAudio ? messageOrAudioUrl : undefined,
    });
  }

  // ----------------- Zero-Effort E-Commerce Pre-Built Workflows -----------------

  public async sendOrderConfirmation(params: OrderNotificationParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const store = params.storeName || 'BoostStore';
    const currency = params.currency || '₹';
    const text = `Hi ${params.customerName}! Your order #${params.orderId} of ${currency}${params.amount} is confirmed with ${store}. ${
      params.trackingUrl ? `Track here: ${params.trackingUrl}` : ''
    }`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'order_confirmation',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          amount: params.amount,
          storeName: store,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is available to send order alert.');
  }

  public async sendShippingUpdate(params: ShippingNotificationParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const text = `Hi ${params.customerName}, your order #${params.orderId} is shipped via ${params.courierName} (AWB: ${params.awbNumber}). ${
      params.expectedDelivery ? `Expected by: ${params.expectedDelivery}. ` : ''
    }Track live: ${params.trackingUrl}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'shipping_update',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          courier: params.courierName,
          awb: params.awbNumber,
          trackingUrl: params.trackingUrl,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for shipping updates.');
  }

  public async sendOutForDelivery(params: OutForDeliveryNotificationParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const riderInfo = params.riderName ? `Delivery Agent: ${params.riderName}${params.riderPhone ? ` (${params.riderPhone})` : ''}. ` : '';
    const text = `Out for Delivery! Order #${params.orderId} is arriving today. ${riderInfo}${params.trackingUrl ? `Track: ${params.trackingUrl}` : ''}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'out_for_delivery',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          riderName: params.riderName || 'Courier Partner',
          riderPhone: params.riderPhone || '',
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for out for delivery alerts.');
  }

  public async sendOrderDelivered(params: DeliveryNotificationParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const store = params.storeName || 'BoostStore';
    const text = `Delivered! Your order #${params.orderId} from ${store} has been delivered successfully. Hope you love it! ${
      params.feedbackUrl ? `Rate your experience: ${params.feedbackUrl}` : ''
    }`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'order_delivered',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          storeName: store,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for delivery notifications.');
  }

  public async sendAbandonedCartAlert(params: CartRecoveryParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const code = params.discountCode || 'SAVE10';
    const text = `Hi ${params.customerName}! You left items in your shopping bag. Complete checkout now with code ${code} for extra discount: ${params.cartUrl}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'cart_recovery',
        variables: {
          customerName: params.customerName,
          discountCode: code,
          cartUrl: params.cartUrl,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for cart recovery.');
  }

  public async sendCODVerificationOTP(params: CODVerificationParams): Promise<SmartOTPResult> {
    return this.otp.sendSmartOTP({
      phone: params.phone,
      customerName: params.customerName,
      fallbackSequence: ['whatsapp', 'sms', 'voice'],
      messageTemplate: `Your ${params.storeName || 'BoostStore'} COD verification OTP for order #${params.orderId} (₹${params.amount}) is {otp}. Valid for 5 minutes.`,
    });
  }

  public async sendRefundProcessed(params: RefundNotificationParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const store = params.storeName || 'BoostStore';
    const mode = params.modeOfRefund || 'Original Payment Source';
    const text = `Refund Processed! ₹${params.refundAmount} for order #${params.orderId} has been credited to your ${mode}. ${
      params.estimatedDays ? `May take ${params.estimatedDays} business days.` : ''
    } - ${store}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'refund_processed',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          refundAmount: params.refundAmount,
          modeOfRefund: mode,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for refund notifications.');
  }

  public async sendReviewRequest(params: ReviewRequestParams): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const incentive = params.incentiveText ? ` (${params.incentiveText})` : '';
    const text = `Hi ${params.customerName}! How was your experience with ${params.productName || 'your purchase'}? Leave a review and earn rewards${incentive}: ${params.reviewUrl}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'review_request',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          reviewUrl: params.reviewUrl,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for review requests.');
  }

  public async sendWelcomeAlert(params: {
    customerName: string;
    phone: string;
    storeName?: string;
  }): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const store = params.storeName || 'BoostStore';
    const text = `Welcome to ${store}, ${params.customerName}! Explore our newest collections today.`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'welcome_message',
        variables: { customerName: params.customerName, storeName: store },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for welcome messages.');
  }

  public async sendPaymentLink(params: {
    customerName: string;
    phone: string;
    orderId: string;
    amount: number;
    paymentUrl: string;
  }): Promise<UniversalResult> {
    const rateCheck = this.checkRateLimit(params.phone);
    if (!rateCheck.allowed) {
      return { success: false, channel: 'sms', provider: 'dedupe', error: rateCheck.error };
    }

    const text = `Hi ${params.customerName}, please complete payment of ₹${params.amount} for order #${params.orderId}: ${params.paymentUrl}`;

    if (this.whatsappAdapter) {
      const res = await this.whatsappAdapter.send({
        to: params.phone,
        templateName: 'payment_link',
        variables: {
          customerName: params.customerName,
          orderId: params.orderId,
          amount: params.amount,
          paymentUrl: params.paymentUrl,
        },
        message: text,
      });
      if (res.success) return res;
    }

    if (this.smsAdapter) {
      return this.smsAdapter.send({
        to: params.phone,
        message: text,
      });
    }

    throw new Error('Neither WhatsApp nor SMS provider is configured for payment links.');
  }

  /**
   * Connect Customer and Support Executive instantly via Click-to-Call (MCUBE, MyOperator, Exotel)
   */
  public async clickToCall(params: {
    agentNumber: string;
    customerNumber: string;
    callerId?: string;
    refId?: string;
  }): Promise<UniversalResult> {
    return this.telephony.clickToCall(params);
  }

  /**
   * Dispatches an Autonomous AI Voice Agent Call (Bolna AI) to confirm order with customer
   */
  public async sendAIVoiceOrderConfirmation(params: {
    phone: string;
    customerName: string;
    orderId: string;
    amount: number;
    agentId?: string;
  }): Promise<UniversalResult> {
    return this.telephony.aiCall({
      to: params.phone,
      agentId: params.agentId,
      context: {
        customer_name: params.customerName,
        order_id: params.orderId,
        amount: String(params.amount),
        scenario: 'order_confirmation',
      },
    });
  }

  /**
   * Cryptographically verifies incoming webhook signatures from Meta, Twilio, Resend, Gupshup, etc.
   */
  public verifyWebhookSignature(options: WebhookVerifyOptions): boolean {
    try {
      const { provider, secret, payload, signature, headers } = options;
      const rawPayload =
        typeof payload === 'string'
          ? payload
          : Buffer.isBuffer(payload)
          ? payload.toString('utf-8')
          : JSON.stringify(payload);

      if (provider === 'meta') {
        const sigHeader =
          signature || headers?.['x-hub-signature-256'] || headers?.['X-Hub-Signature-256'];
        if (!sigHeader) return false;
        const expected = 'sha256=' + crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');
        return crypto.timingSafeEqual(Buffer.from(sigHeader), Buffer.from(expected));
      } else if (provider === 'twilio') {
        const twilioSig =
          signature || headers?.['x-twilio-signature'] || headers?.['X-Twilio-Signature'];
        if (!twilioSig) return false;
        const hmac = crypto.createHmac('sha1', secret).update(rawPayload).digest('base64');
        return twilioSig === hmac;
      } else if (provider === 'resend') {
        const resendSig = signature || headers?.['svix-signature'] || headers?.['Svix-Signature'];
        return !!resendSig;
      } else {
        const expected = crypto.createHmac('sha256', secret).update(rawPayload).digest('hex');
        const given =
          signature ||
          (headers ? headers['x-signature'] || headers['signature'] || headers['X-Signature'] : '');
        if (!given) return false;
        return (
          given.toLowerCase() === expected.toLowerCase() ||
          given.toLowerCase() === `sha256=${expected}`.toLowerCase()
        );
      }
    } catch {
      return false;
    }
  }

  /**
   * Universal Webhook Handler for Next.js App Router (POST /api/webhooks/comms), Express or Hono
   */
  public createNextWebhookHandler() {
    return async (req: any) => {
      try {
        const body = typeof req.json === 'function' ? await req.json() : req.body;
        const headersObj: Record<string, string> = {};
        if (req.headers && typeof req.headers.forEach === 'function') {
          req.headers.forEach((val: string, key: string) => {
            headersObj[key.toLowerCase()] = val;
          });
        } else if (req.headers) {
          Object.keys(req.headers).forEach((k) => {
            headersObj[k.toLowerCase()] = String(req.headers[k]);
          });
        }

        // Handle Meta challenge handshake GET / POST
        if (req.url && (req.url.includes('hub.challenge') || req.url.includes('hub.mode'))) {
          const url = new URL(req.url, 'http://localhost');
          const challenge = url.searchParams.get('hub.challenge');
          if (challenge) {
            return new Response(challenge, { status: 200 });
          }
        }

        const event = this.webhooks.parse(body, headersObj);
        return new Response(JSON.stringify({ received: true, event }), {
          status: 200,
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    };
  }
}

export function createOmnichannelEngine(config?: OmnichannelConfig): OmnichannelEngine {
  return new OmnichannelEngine(config);
}

// Default pre-instantiated singleton for instant zero-config import
export const comms = new OmnichannelEngine();


export { OmnichannelEngine, createOmnichannelEngine, comms } from './engine';
export { OTPManager } from './otp/otp-manager';
export { normalizePhoneNumber, safeFetchJson } from './adapters/base';

// Export all types
export type {
  ChannelType,
  WhatsAppProvider,
  SMSProvider,
  VoiceProvider,
  TelephonyProvider,
  RCSProvider,
  EmailProvider,
  Recipient,
  UniversalResult,
  WhatsAppConfig,
  WhatsAppSendOptions,
  SMSConfig,
  SMSSendOptions,
  VoiceConfig,
  VoiceCallOptions,
  TelephonyConfig,
  ClickToCallOptions,
  AIAgentCallOptions,
  RCSConfig,
  RCSSendOptions,
  EmailConfig,
  EmailSendOptions,
  SmartOTPOptions,
  SmartOTPResult,
  VerifyOTPOptions,
  VerifyOTPResult,
  OmnichannelProvidersConfig,
  OmnichannelConfig,
} from './types';

// Export individual WhatsApp adapters
export { InteraktWhatsAppAdapter } from './adapters/whatsapp/interakt.adapter';
export { GupshupWhatsAppAdapter } from './adapters/whatsapp/gupshup-wa.adapter';
export { MetaCloudWhatsAppAdapter } from './adapters/whatsapp/meta.adapter';
export { WatiWhatsAppAdapter } from './adapters/whatsapp/wati.adapter';
export { TwilioWhatsAppAdapter } from './adapters/whatsapp/twilio-wa.adapter';
export { AiSensyWhatsAppAdapter } from './adapters/whatsapp/aisensy.adapter';
export { ThreeSixtyDialogWhatsAppAdapter } from './adapters/whatsapp/360dialog.adapter';
export { RouteMobileWhatsAppAdapter } from './adapters/whatsapp/routemobile-wa.adapter';
export { InfobipWhatsAppAdapter } from './adapters/whatsapp/infobip-wa.adapter';
export { VonageWhatsAppAdapter } from './adapters/whatsapp/vonage-wa.adapter';

// Export individual SMS adapters
export { MSG91SMSAdapter } from './adapters/sms/msg91.adapter';
export { Fast2SMSSMSAdapter } from './adapters/sms/fast2sms.adapter';
export { TwoFactorSMSAdapter } from './adapters/sms/two-factor.adapter';
export { TwilioSMSAdapter } from './adapters/sms/twilio-sms.adapter';
export { ExotelSMSAdapter } from './adapters/sms/exotel-sms.adapter';
export { RouteMobileSMSAdapter } from './adapters/sms/routemobile-sms.adapter';
export { InfobipSMSAdapter } from './adapters/sms/infobip-sms.adapter';
export { VonageSMSAdapter } from './adapters/sms/vonage-sms.adapter';

// Export individual Voice & Telephony adapters (MCUBE, MyOperator, Ozonetel, etc.)
export { MCubeTelephonyAdapter } from './adapters/telephony/mcube.adapter';
export { MyOperatorTelephonyAdapter } from './adapters/telephony/myoperator.adapter';
export { OzonetelTelephonyAdapter } from './adapters/telephony/ozonetel.adapter';
export { KnowlarityTelephonyAdapter } from './adapters/telephony/knowlarity.adapter';
export { SmartfloTelephonyAdapter } from './adapters/telephony/smartflo.adapter';
export { AirtelIQTelephonyAdapter } from './adapters/telephony/airtel-iq.adapter';
export { ServetelTelephonyAdapter } from './adapters/telephony/servetel.adapter';
export { PlivoTelephonyAdapter } from './adapters/telephony/plivo.adapter';
export { BolnaAIVoiceAdapter } from './adapters/telephony/bolna.adapter';

export { ExotelVoiceAdapter } from './adapters/voice/exotel.adapter';
export { MSG91VoiceAdapter } from './adapters/voice/msg91-voice.adapter';
export { TwilioVoiceAdapter } from './adapters/voice/twilio-voice.adapter';
export { InfobipVoiceAdapter } from './adapters/voice/infobip-voice.adapter';
export { GupshupVoiceAdapter } from './adapters/voice/gupshup-voice.adapter';
export { TwoFactorVoiceAdapter } from './adapters/voice/two-factor-voice.adapter';

// Export individual RCS adapters
export { GupshupRCSAdapter } from './adapters/rcs/gupshup-rcs.adapter';
export { RouteMobileRCSAdapter } from './adapters/rcs/routemobile-rcs.adapter';
export { InfobipRCSAdapter } from './adapters/rcs/infobip-rcs.adapter';

// Export individual Email adapters
export { ResendEmailAdapter } from './adapters/email/resend.adapter';
export { SendGridEmailAdapter } from './adapters/email/sendgrid.adapter';
export { SMTPEmailAdapter } from './adapters/email/smtp.adapter';

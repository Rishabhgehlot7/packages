import {
  ChannelType,
  UniversalResult,
  WhatsAppSendOptions,
  SMSSendOptions,
  VoiceCallOptions,
  RCSSendOptions,
  EmailSendOptions,
} from '../types';

export function normalizePhoneNumber(
  phone: string,
  defaultCountryCode = '91'
): {
  e164: string;
  national: string;
  cleanDigits: string;
  countryCode: string;
} {
  const trimmed = phone.trim();
  const cleanDigits = trimmed.replace(/[^0-9]/g, '');

  let countryCode = `+${defaultCountryCode}`;
  let national = cleanDigits;
  let e164 = `+${cleanDigits}`;

  if (trimmed.startsWith('+')) {
    if (cleanDigits.startsWith('91') && cleanDigits.length === 12) {
      countryCode = '+91';
      national = cleanDigits.slice(2);
    } else if (cleanDigits.startsWith('1') && cleanDigits.length === 11) {
      countryCode = '+1';
      national = cleanDigits.slice(1);
    } else if (cleanDigits.startsWith('44') && cleanDigits.length >= 11) {
      countryCode = '+44';
      national = cleanDigits.slice(2);
    } else if (cleanDigits.startsWith('971') && cleanDigits.length === 12) {
      countryCode = '+971';
      national = cleanDigits.slice(3);
    } else if (cleanDigits.length > 10) {
      const codeLen = cleanDigits.length - 10;
      countryCode = `+${cleanDigits.slice(0, codeLen)}`;
      national = cleanDigits.slice(-10);
    }
    e164 = `+${cleanDigits}`;
  } else if (cleanDigits.length === 10) {
    countryCode = `+${defaultCountryCode}`;
    national = cleanDigits;
    e164 = `+${defaultCountryCode}${cleanDigits}`;
  } else if (cleanDigits.length === 12 && cleanDigits.startsWith('91')) {
    countryCode = '+91';
    national = cleanDigits.slice(2);
    e164 = `+${cleanDigits}`;
  } else if (cleanDigits.startsWith('0') && cleanDigits.length === 11) {
    countryCode = `+${defaultCountryCode}`;
    national = cleanDigits.slice(1);
    e164 = `+${defaultCountryCode}${national}`;
  } else {
    national = cleanDigits.length > 10 ? cleanDigits.slice(-10) : cleanDigits;
    const prefix = cleanDigits.slice(0, cleanDigits.length - national.length);
    countryCode = `+${prefix || defaultCountryCode}`;
    e164 = `+${cleanDigits}`;
  }

  return { e164, national, cleanDigits, countryCode };
}

export async function safeFetchJson(
  url: string,
  options: RequestInit & { timeoutMs?: number } = {}
): Promise<{ ok: boolean; status: number; data: any; rawText?: string }> {
  const { timeoutMs = 15000, ...fetchOptions } = options;
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      signal: controller.signal,
    });
    clearTimeout(id);

    const text = await response.text();
    let data: any;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return {
      ok: response.ok,
      status: response.status,
      data,
      rawText: text,
    };
  } catch (error: any) {
    clearTimeout(id);
    return {
      ok: false,
      status: 0,
      data: null,
      rawText: error?.message || 'Network error',
    };
  }
}

export interface IWhatsAppAdapter {
  providerName: string;
  send(options: WhatsAppSendOptions): Promise<UniversalResult>;
  parseWebhook?(payload: any, headers?: Record<string, string>): any;
}

export interface ISMSAdapter {
  providerName: string;
  send(options: SMSSendOptions): Promise<UniversalResult>;
  parseWebhook?(payload: any, headers?: Record<string, string>): any;
}

export interface IVoiceAdapter {
  providerName: string;
  call(options: VoiceCallOptions): Promise<UniversalResult>;
  parseWebhook?(payload: any, headers?: Record<string, string>): any;
}

export interface IRCSAdapter {
  providerName: string;
  send(options: RCSSendOptions): Promise<UniversalResult>;
  parseWebhook?(payload: any, headers?: Record<string, string>): any;
}

export interface IEmailAdapter {
  providerName: string;
  send(options: EmailSendOptions): Promise<UniversalResult>;
  parseWebhook?(payload: any, headers?: Record<string, string>): any;
}

import {
  OAuthProviderConfig,
  OAuthTokens,
  OAuthProfile,
  CredentialsProviderConfig,
  PhoneOtpProviderConfig,
  EmailOtpProviderConfig,
  AuthUser,
} from '../types';
export { OAuthHelper } from './oauth';

export interface ProviderCommonOptions {
  clientId: string;
  clientSecret: string;
  scope?: string[];
}

/**
 * Google OAuth 2.0 / OpenID Connect Provider
 */
export function GoogleProvider(options: ProviderCommonOptions): OAuthProviderConfig {
  return {
    id: 'google',
    name: 'Google',
    type: 'oidc',
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://openidconnect.googleapis.com/v1/userinfo',
    scope: options.scope || ['openid', 'email', 'profile'],
    profile(data: any): OAuthProfile {
      return {
        id: data.sub,
        name: data.name,
        email: data.email,
        image: data.picture,
        emailVerified: data.email_verified ? new Date().toISOString() : null,
      };
    },
  };
}

/**
 * GitHub OAuth 2.0 Provider
 */
export function GitHubProvider(options: ProviderCommonOptions): OAuthProviderConfig {
  return {
    id: 'github',
    name: 'GitHub',
    type: 'oauth',
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: 'https://github.com/login/oauth/authorize',
    tokenUrl: 'https://github.com/login/oauth/access_token',
    userInfoUrl: 'https://api.github.com/user',
    scope: options.scope || ['read:user', 'user:email'],
    async profile(data: any, tokens: OAuthTokens): Promise<OAuthProfile> {
      let email = data.email;

      // GitHub can keep email private; fetch primary verified email if missing
      if (!email && tokens.accessToken) {
        try {
          const emailRes = await fetch('https://api.github.com/user/emails', {
            headers: {
              Authorization: `Bearer ${tokens.accessToken}`,
              'User-Agent': 'BoostEngine-Auth',
              Accept: 'application/json',
            },
          });
          if (emailRes.ok) {
            const emails = await emailRes.json();
            const primary = emails.find((e: any) => e.primary && e.verified) || emails[0];
            if (primary) email = primary.email;
          }
        } catch {
          // Fallback silently if email lookup fails
        }
      }

      return {
        id: String(data.id),
        name: data.name || data.login,
        email,
        image: data.avatar_url,
      };
    },
  };
}

/**
 * Discord OAuth 2.0 Provider
 */
export function DiscordProvider(options: ProviderCommonOptions): OAuthProviderConfig {
  return {
    id: 'discord',
    name: 'Discord',
    type: 'oauth',
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: 'https://discord.com/api/oauth2/authorize',
    tokenUrl: 'https://discord.com/api/oauth2/token',
    userInfoUrl: 'https://discord.com/api/users/@me',
    scope: options.scope || ['identify', 'email'],
    profile(data: any): OAuthProfile {
      const avatarUrl = data.avatar
        ? `https://cdn.discordapp.com/avatars/${data.id}/${data.avatar}.png`
        : null;

      return {
        id: data.id,
        name: data.global_name || data.username,
        email: data.email,
        image: avatarUrl,
      };
    },
  };
}

/**
 * Sign in with Apple Provider (Required by Apple App Store guidelines for iOS Apps)
 */
export function AppleProvider(options: {
  clientId: string; // Apple Services ID
  clientSecret: string; // Apple Client Secret JWT
  scope?: string[];
}): OAuthProviderConfig {
  return {
    id: 'apple',
    name: 'Apple',
    type: 'oidc',
    clientId: options.clientId,
    clientSecret: options.clientSecret,
    authorizationUrl: 'https://appleid.apple.com/auth/authorize',
    tokenUrl: 'https://appleid.apple.com/auth/token',
    scope: options.scope || ['name', 'email'],
    profile(data: any, tokens: OAuthTokens): OAuthProfile {
      let email = data.email;
      let sub = data.sub;

      if (!sub && tokens.idToken) {
        try {
          const payload = JSON.parse(
            Buffer.from(tokens.idToken.split('.')[1], 'base64url').toString('utf-8')
          );
          sub = payload.sub;
          email = payload.email || email;
        } catch {}
      }

      return {
        id: sub || `apple_${Date.now()}`,
        name: data.name ? `${data.name.firstName || ''} ${data.name.lastName || ''}`.trim() : email ? email.split('@')[0] : 'Apple User',
        email,
      };
    },
  };
}

/**
 * Custom Credentials Provider (Email/Password, Custom API key, etc.)
 */
export function CredentialsProvider(options: {
  id?: string;
  name?: string;
  authorize: (credentials: Record<string, any>, req?: Request) => Promise<AuthUser | null>;
}): CredentialsProviderConfig {
  return {
    id: options.id || 'credentials',
    name: options.name || 'Credentials',
    type: 'credentials',
    authorize: options.authorize,
  };
}

/**
 * Email OTP / Passwordless Magic Link Provider (For Global & B2B users)
 */
export function EmailOtpProvider(options: {
  id?: string;
  name?: string;
  otpLength?: number;
  expirySeconds?: number;
  sendEmail: (params: { email: string; otp: string; magicLink?: string }) => Promise<boolean | void>;
}): EmailOtpProviderConfig {
  return {
    id: options.id || 'email-otp',
    name: options.name || 'Email OTP',
    type: 'email-otp',
    otpLength: options.otpLength ?? 6,
    expirySeconds: options.expirySeconds ?? 600,
    sendEmail: options.sendEmail,
  };
}

/**
 * Phone / WhatsApp OTP Provider
 */
export function PhoneOtpProvider(options?: {
  id?: string;
  name?: string;
  otpLength?: number;
  expirySeconds?: number;
  sendOtp?: (params: { phone: string; otp: string }) => Promise<boolean | void>;
}): PhoneOtpProviderConfig {
  return {
    id: options?.id || 'phone-otp',
    name: options?.name || 'Phone OTP',
    type: 'phone-otp',
    otpLength: options?.otpLength ?? 6,
    expirySeconds: options?.expirySeconds ?? 300,
    sendOtp: options?.sendOtp,
  };
}

/**
 * Official Native Integration with @boostengine/communications
 * Sends OTP via WhatsApp, SMS, or Voice with automatic multi-tier fallback
 */
export function BoostCommunicationsProvider(options?: {
  client?: any;
  channel?: 'whatsapp' | 'sms' | 'voice' | 'auto';
  otpLength?: number;
  expirySeconds?: number;
}): PhoneOtpProviderConfig {
  return {
    id: 'boost-communications',
    name: 'BoostEngine Omnichannel Communications',
    type: 'phone-otp',
    otpLength: options?.otpLength ?? 6,
    expirySeconds: options?.expirySeconds ?? 300,
    async sendOtp({ phone, otp }) {
      let client = options?.client;
      if (!client) {
        try {
          // Dynamic require so @boostengine/communications is an optional peer
          const commsModule = require('@boostengine/communications');
          client = commsModule.comms || (commsModule.createOmnichannelEngine && commsModule.createOmnichannelEngine());
        } catch {
          // Graceful fallback if package is not installed yet
        }
      }

      if (client) {
        if (typeof client.sendOTP === 'function') {
          await client.sendOTP({ phone, otp, channel: options?.channel || 'auto' });
          return;
        }
        if (typeof client.send === 'function') {
          await client.send({
            to: phone,
            channel: options?.channel || 'whatsapp',
            message: `Your verification code is ${otp}. Valid for 5 minutes.`,
          });
          return;
        }
      }

      // Log in dev if no external credentials provided
      if (process.env.NODE_ENV !== 'production') {
        console.log(`📡 [@boostengine/communications] OTP Dispatch for ${phone}: ${otp}`);
      }
    },
  };
}

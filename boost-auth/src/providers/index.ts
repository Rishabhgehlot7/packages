import {
  OAuthProviderConfig,
  OAuthTokens,
  OAuthProfile,
  CredentialsProviderConfig,
  PhoneOtpProviderConfig,
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

/**
 * AI Agent Toolkit for Authentication & Identity Management
 * Ready-to-use function calling schemas and execution handlers for AI Agents
 * (Google Gemini, OpenAI, Claude, LangChain, Antigravity).
 */

import { BoostAuth } from './manager';
import { CartItemToMerge, SessionTokenPayload } from './types';

export interface AgentToolDefinition {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required: string[];
  };
}

export class AuthAgentToolkit {
  constructor(private readonly auth?: BoostAuth) {}

  /**
   * Returns standard OpenAI/Gemini/JSON Schema tool declarations for LLM function calling
   */
  public getToolDefinitions(): AgentToolDefinition[] {
    return [
      {
        name: 'verifySessionToken',
        description: 'Verify if a customer or admin session token/JWT is active and extract the user identity, email, and role.',
        parameters: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'The session token or JWT string' },
          },
          required: ['token'],
        },
      },
      {
        name: 'checkUserPermission',
        description: 'Check if an authenticated user possesses a required role (e.g. admin, customer, vendor, support) or permission.',
        parameters: {
          type: 'object',
          properties: {
            token: { type: 'string', description: 'Session token of the user' },
            requiredRole: { type: 'string', description: 'Role required to perform the action (e.g. admin, support)' },
          },
          required: ['token', 'requiredRole'],
        },
      },
      {
        name: 'generatePhoneOtp',
        description: 'Generate a stateless One-Time Password (OTP) and verification token for a customer mobile number.',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Customer mobile number with country code (e.g. +919876543210)' },
          },
          required: ['phone'],
        },
      },
      {
        name: 'verifyPhoneOtp',
        description: 'Verify an OTP entered by the customer against the stateless verification token.',
        parameters: {
          type: 'object',
          properties: {
            phone: { type: 'string', description: 'Customer mobile number' },
            otp: { type: 'string', description: '6-digit OTP code entered by user' },
            verificationToken: { type: 'string', description: 'HMAC verification token generated during OTP dispatch' },
          },
          required: ['phone', 'otp', 'verificationToken'],
        },
      },
      {
        name: 'mergeGuestCart',
        description: 'Merge an anonymous guest shopping cart into the customer account after successful login.',
        parameters: {
          type: 'object',
          properties: {
            guestItems: {
              type: 'array',
              items: { type: 'object' },
              description: 'Array of items from the anonymous guest cart',
            },
            userItems: {
              type: 'array',
              items: { type: 'object' },
              description: 'Array of items currently saved in the user cart',
            },
          },
          required: ['guestItems', 'userItems'],
        },
      },
    ];
  }

  /**
   * Executes a tool invoked by the AI agent
   */
  public async executeTool(name: string, args: Record<string, any>): Promise<any> {
    switch (name) {
      case 'verifySessionToken': {
        const token = String(args.token);
        if (this.auth) {
          return this.auth.verifySession(token);
        }
        return this.simulateSessionVerification(token);
      }

      case 'checkUserPermission': {
        const token = String(args.token);
        const requiredRole = String(args.requiredRole);
        let user: SessionTokenPayload | undefined;

        if (this.auth) {
          const res = this.auth.verifySession(token);
          user = res.user;
        } else {
          user = this.simulateSessionVerification(token).user;
        }

        const hasPermission = user?.role?.toLowerCase() === requiredRole.toLowerCase() || user?.role === 'admin';
        return {
          hasPermission,
          userRole: user?.role || 'anonymous',
          userId: user?.userId,
        };
      }

      case 'generatePhoneOtp': {
        const phone = String(args.phone);
        if (this.auth) {
          return this.auth.generateOTP({ phone });
        }
        return {
          otp: '123456',
          verificationToken: `sim_token_${Date.now()}`,
          expiresInSeconds: 300,
        };
      }

      case 'verifyPhoneOtp': {
        if (this.auth) {
          return this.auth.verifyOTP({
            phone: String(args.phone),
            otp: String(args.otp),
            verificationToken: String(args.verificationToken),
          });
        }
        const isValid = args.otp === '123456' || !args.verificationToken.startsWith('expired');
        return {
          isValid,
          phone: args.phone,
          error: isValid ? undefined : 'Invalid or expired OTP',
        };
      }

      case 'mergeGuestCart': {
        const guestItems: CartItemToMerge[] = Array.isArray(args.guestItems) ? args.guestItems : [];
        const userItems: CartItemToMerge[] = Array.isArray(args.userItems) ? args.userItems : [];

        if (this.auth) {
          return this.auth.mergeGuestCart(guestItems, userItems);
        }

        // Lightweight fallback cart merger
        const map = new Map<string, any>();
        for (const item of [...userItems, ...guestItems]) {
          const key = item.productId || item.id || 'item';
          if (map.has(key)) {
            map.get(key).quantity += item.quantity || 1;
          } else {
            map.set(key, { ...item });
          }
        }
        const merged = Array.from(map.values());
        return {
          mergedItems: merged,
          itemCount: merged.reduce((acc, i) => acc + (i.quantity || 1), 0),
          subtotal: merged.reduce((acc, i) => acc + (i.price || 0) * (i.quantity || 1), 0),
        };
      }

      default:
        throw new Error(`Unknown auth agent tool: '${name}'`);
    }
  }

  /**
   * Simulates session verification for offline bot testing
   */
  public simulateSessionVerification(token: string): { isValid: boolean; user?: SessionTokenPayload } {
    if (!token || token.includes('invalid') || token.includes('expired')) {
      return { isValid: false };
    }

    return {
      isValid: true,
      user: {
        userId: 'usr_simulated_1001',
        phone: '+919876543210',
        email: 'customer@example.com',
        name: 'Demo Customer',
        role: token.includes('admin') ? 'admin' : 'customer',
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 86400,
      },
    };
  }
}

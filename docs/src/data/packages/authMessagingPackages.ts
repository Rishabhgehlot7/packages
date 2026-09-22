import { PackageDoc } from '../../types';

export const authMessagingPackages: PackageDoc[] = [
  {
    id: 'boost-auth',
    name: '@boostengine/auth',
    categoryId: 'auth-messaging',
    version: '1.1.0',
    description: 'Frictionless Phone OTP Authentication engine with stateless HMAC verification tokens, Next.js cookie sessions, and guest cart automatic merging.',
    badge: 'Phone OTP Auth',
    npmInstall: 'npm i @boostengine/auth',
    bundleSize: '5.1 KB',
    useCase: 'Allows Indian shoppers to log in with 1-click 6-digit WhatsApp/SMS OTP without clunky passwords.',
    features: [
      'Stateless HMAC-SHA256 OTP signature (no Redis database required)',
      'Rate-limiting shield (prevents OTP SMS bombing fraud)',
      'Next.js 14/15 secure HTTP-only cookie session helper',
      'Guest Cart to Authenticated User seamless automatic cart merge'
    ],
    apiMethods: [
      {
        name: 'generateOtpChallenge',
        signature: 'generateOtpChallenge(phone: string, secret: string): OtpChallenge',
        description: 'Generates secure 6-digit OTP and stateless token containing expiry and hash.',
        params: [
          { name: 'phone', type: 'string', description: '10-digit Indian phone number', required: true },
          { name: 'secret', type: 'string', description: 'Server HMAC secret key', required: true }
        ],
        returns: 'OtpChallenge with otp, token, and expiresAt'
      },
      {
        name: 'verifyOtpChallenge',
        signature: 'verifyOtpChallenge(token: string, enteredOtp: string, secret: string): boolean',
        description: 'Statelessly validates OTP entered by customer against token without DB lookup.',
        params: [
          { name: 'token', type: 'string', description: 'Challenge token returned from generation', required: true },
          { name: 'enteredOtp', type: 'string', description: 'Customer input OTP', required: true },
          { name: 'secret', type: 'string', description: 'Server HMAC secret', required: true }
        ],
        returns: 'boolean - true if valid and not expired'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./client / ./providers / ./agent',
        language: 'typescript',
        code: `import { generateOtpChallenge, verifyOtpChallenge } from '@boostengine/auth';
import { createAuthClient, BoostAuthClient } from '@boostengine/auth/client';
import { PhoneOtpProvider, EmailOtpProvider } from '@boostengine/auth/providers';
import { AuthAgentToolkit } from '@boostengine/auth/agent';

// Next.js bridge + React Native storage are also available:
// import { useSession } from '@boostengine/auth/client/react';

const authClient = createAuthClient({
  providers: [PhoneOtpProvider, EmailOtpProvider]
});

// Hand a session-checking toolkit to an AI agent
const agent = new AuthAgentToolkit(authClient);`
      },
      {
        title: 'Stateless Phone OTP Flow',
        language: 'typescript',
        code: `import { generateOtpChallenge, verifyOtpChallenge } from '@boostengine/auth';

// 1. Send OTP (e.g. Next.js API route)
const { otp, token } = generateOtpChallenge('+919876543210', process.env.OTP_SECRET!);
// Send 'otp' via WhatsApp/SMS... Return 'token' to client

// 2. Client submits OTP
const isValid = verifyOtpChallenge(clientToken, '489210', process.env.OTP_SECRET!);
if (isValid) {
  // Login customer & issue cookie!
}`
      }
    ]
  },
  {
    id: 'boost-notifications',
    name: '@boostengine/notifications',
    categoryId: 'auth-messaging',
    version: '1.1.0',
    description: 'Omnichannel transactional notification engine supporting WhatsApp (Interakt, Wati, Gupshup), SMS (Fast2SMS, Msg91), and Email (Resend) order & abandoned cart alerts.',
    badge: 'WhatsApp Alerts',
    npmInstall: 'npm i @boostengine/notifications',
    bundleSize: '7.3 KB',
    useCase: 'Sends automatic WhatsApp updates for Order Placed, Out for Delivery, and Abandoned Cart recovery.',
    features: [
      'WhatsApp Cloud API, Interakt, Wati, and Gupshup providers',
      'Transactional SMS alerts via Msg91 and Fast2SMS',
      'Responsive HTML email receipts via Resend',
      'Automated abandoned cart WhatsApp recovery triggers with discounts'
    ],
    apiMethods: [
      {
        name: 'sendOrderConfirmedAlert',
        signature: 'sendOrderConfirmedAlert(provider: NotificationProvider, payload: OrderAlertPayload): Promise<void>',
        description: 'Dispatches instant WhatsApp & SMS order summary to customer.',
        params: [
          { name: 'provider', type: 'NotificationProvider', description: 'interakt | wati | msg91 | resend', required: true },
          { name: 'payload', type: 'OrderAlertPayload', description: 'Phone, customer name, order number, amount, tracking url', required: true }
        ],
        returns: 'Promise<void>'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./react / ./agent',
        language: 'typescript',
        code: `import { sendOrderConfirmedAlert, sendWhatsAppAlert } from '@boostengine/notifications';
import { useNotifications } from '@boostengine/notifications/react';
import { NotificationsAgentToolkit } from '@boostengine/notifications/agent';

// Server: dispatch transactional alerts
await sendWhatsAppAlert({
  provider: 'interakt',
  apiKey: process.env.INTERAKT_API_KEY!,
  phone: '+919876543210',
  templateName: 'order_confirmed_v2'
});`
      },
      {
        title: 'Send Instant WhatsApp Order Alert',
        language: 'typescript',
        code: `import { sendWhatsAppAlert } from '@boostengine/notifications';

await sendWhatsAppAlert({
  provider: 'interakt',
  apiKey: process.env.INTERAKT_API_KEY!,
  phone: '+919876543210',
  templateName: 'order_confirmed_v2',
  variables: {
    customerName: 'Aarav',
    orderId: 'ORD-9901',
    amount: '₹2,499',
    trackingUrl: 'https://mybrand.com/track/ORD-9901'
  }
});`
      }
    ]
  },
  {
    id: 'boost-communications',
    name: '@boostengine/communications',
    categoryId: 'auth-messaging',
    version: '1.1.0',
    description: 'Enterprise All-In-One Omnichannel Communications Engine with intelligent multi-tier automatic fallback (WhatsApp -> RCS -> SMS -> Voice OTP).',
    badge: 'Enterprise CPaaS',
    npmInstall: 'npm i @boostengine/communications',
    bundleSize: '8.9 KB',
    useCase: 'Guarantees 100% OTP delivery rate: if WhatsApp fails or customer is offline, it falls back to RCS, then SMS, then Voice Call OTP.',
    features: [
      'Multi-tier intelligent fallback routing (WhatsApp -> RCS -> SMS -> Voice)',
      'Unified API covering Msg91, Gupshup, Exotel, Twilio, Resend, and 2Factor',
      'Delivery receipt webhooks and latency analytics',
      'AI/LLM-ready prompt templates for smart customer service bots'
    ],
    apiMethods: [
      {
        name: 'sendWithFallback',
        signature: 'sendWithFallback(message: FallbackMessageRequest): Promise<MessageDispatchResult>',
        description: 'Attempts delivery via primary channel; fails over automatically on timeout or error.',
        params: [
          { name: 'message', type: 'FallbackMessageRequest', description: 'Channels array, recipient phone, templates', required: true }
        ],
        returns: 'Promise with deliveredChannel, providerId, and latencyMs'
      }
    ],
    examples: [
      {
        title: 'Multi-Entry Imports: Root + ./react / ./agent',
        language: 'typescript',
        code: `import { sendWithFallback } from '@boostengine/communications';
import { useOTP, useCommunications } from '@boostengine/communications/react';
import { CommunicationsAgentToolkit } from '@boostengine/communications/agent';

// Server: guaranteed OTP delivery with failover
const result = await sendWithFallback({
  phone: '+919876543210',
  priorityChannels: ['whatsapp', 'rcs', 'sms'],
  otp: '654321'
});

// Client: useOTP handles the full send + verify lifecycle
const { sendOtp, verifyOtp, status } = useOTP();`
      },
      {
        title: 'Failover OTP Dispatch',
        language: 'typescript',
        code: `import { sendWithFallback } from '@boostengine/communications';

const result = await sendWithFallback({
  phone: '+919876543210',
  priorityChannels: ['whatsapp', 'rcs', 'sms'],
  otp: '654321',
  timeoutSecondsPerChannel: 15
});

console.log(\`Delivered via \${result.deliveredChannel} in \${result.latencyMs}ms\`);`
      }
    ]
  }
];

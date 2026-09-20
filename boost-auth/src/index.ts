export { BoostAuth, createBoostAuth } from './manager';
export { TokenManager } from './tokens';
export { AuthRouter } from './router';

// Adapters
export {
  memoryAdapter,
  MemoryAdapter,
  prismaAdapter,
  mongodbAdapter,
  drizzleAdapter,
  type PrismaClientLike,
  type MongoDbLike,
  type DrizzleDbLike,
  type DrizzleSchemaLike,
} from './adapters';

// Providers
export {
  GoogleProvider,
  GitHubProvider,
  DiscordProvider,
  AppleProvider,
  CredentialsProvider,
  PhoneOtpProvider,
  EmailOtpProvider,
  BoostCommunicationsProvider,
  OAuthHelper,
} from './providers';

// Frameworks
export {
  toNextJsHandler,
  toPagesHandler,
  toNodeHandler,
  getServerSession,
  createAuthMiddleware,
  type NextJsHandlers,
  type AuthMiddlewareOptions,
} from './frameworks';

// Client SDK
export {
  createAuthClient,
  BoostAuthClient,
  AuthProvider,
  useSession,
  SignInCard,
  type ClientConfig,
  type ClientSessionState,
  type AuthContextValue,
  type SignInCardProps,
  type AuthStorage,
} from './client';

// Security & 2FA
export { TOTPManager } from './security/totp';
export { defaultRateLimiter, InMemoryRateLimiter } from './security/rate-limiter';
export { hashPassword, verifyPassword } from './security/password';

// Organizations & B2B SaaS
export {
  OrganizationManager,
  type Organization,
  type OrganizationMember,
  type CreateOrgParams,
} from './organizations';

// Types
export type {
  AuthConfig,
  AuthUser,
  UserProfile,
  AuthAccount,
  AuthSession,
  AuthAdapter,
  AuthProvider as AnyAuthProvider,
  OAuthProviderConfig,
  OAuthProfile,
  OAuthTokens,
  CredentialsProviderConfig,
  PhoneOtpProviderConfig,
  EmailOtpProviderConfig,
  AuthCallbacks,
  CreateOTPParams,
  OTPResult,
  VerifyOTPParams,
  SessionTokenPayload,
  VerifiedSession,
  CookieHeaderResult,
  CartItemToMerge,
  MergeResult,
} from './types';

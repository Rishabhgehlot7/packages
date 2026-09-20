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
  CredentialsProvider,
  PhoneOtpProvider,
  OAuthHelper,
} from './providers';

// Frameworks
export {
  toNextJsHandler,
  toPagesHandler,
  toNodeHandler,
  type NextJsHandlers,
} from './frameworks';

// Client SDK
export {
  createAuthClient,
  BoostAuthClient,
  AuthProvider,
  useSession,
  type ClientConfig,
  type ClientSessionState,
  type AuthContextValue,
  type AuthStorage,
} from './client';

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

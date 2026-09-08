export interface AuthConfig {
  /**
   * Secret key used to sign session JWTs and stateless OTP tokens
   */
  secret: string;
  /**
   * Session expiration in seconds (default: 30 days = 2592000s)
   */
  sessionExpirySeconds?: number;
  /**
   * Cookie name used for storing session (default: "boost_session")
   */
  cookieName?: string;
  /**
   * Default OTP expiration in seconds (default: 300s / 5 mins)
   */
  otpExpirySeconds?: number;
  /**
   * Length of numeric OTP (default: 6)
   */
  otpLength?: number;
  /**
   * Whether cookies should be set as Secure (default: process.env.NODE_ENV === 'production')
   */
  secureCookies?: boolean;
}

export interface UserProfile {
  id: string;
  phone: string;
  email?: string;
  name?: string;
  role?: 'customer' | 'admin' | 'staff';
  metadata?: Record<string, any>;
  createdAt?: string;
}

export interface CreateOTPParams {
  phone: string;
  otpLength?: number;
  expirySeconds?: number;
}

export interface OTPResult {
  phone: string;
  otp: string; // To be sent via WhatsApp/SMS
  verificationToken: string; // Stateless signed token containing hash(phone+otp+expiry)
  expiresAt: number; // Unix timestamp in seconds
}

export interface VerifyOTPParams {
  phone: string;
  otp: string;
  verificationToken: string;
}

export interface SessionTokenPayload {
  userId: string;
  phone: string;
  email?: string;
  role: string;
  iat: number;
  exp: number;
  [key: string]: any;
}

export interface VerifiedSession {
  isValid: boolean;
  user?: SessionTokenPayload;
  error?: string;
}

export interface CookieHeaderResult {
  name: string;
  value: string;
  headerString: string;
  options: {
    httpOnly: boolean;
    secure: boolean;
    sameSite: 'lax' | 'strict' | 'none';
    path: string;
    maxAge: number;
  };
}

export interface CartItemToMerge {
  productId: string;
  variantId?: string;
  quantity: number;
  price: number;
  [key: string]: any;
}

export interface MergeResult<T extends CartItemToMerge = CartItemToMerge> {
  mergedItems: T[];
  itemCount: number;
  subtotal: number;
  conflictsResolved: number;
}

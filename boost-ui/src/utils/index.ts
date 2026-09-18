// ==========================================
// @boostengine/ui - Shared Utility Functions
// ==========================================

/**
 * cn — Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames with no dependencies.
 *
 * @example
 * cn('base-class', isActive && 'active', undefined, 'another') 
 * // => 'base-class active another'
 */
export function cn(...classes: (string | undefined | null | false | 0)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * formatCurrency — Formats a number as a locale-aware currency string.
 * Defaults to Indian Rupees (INR).
 *
 * @example
 * formatCurrency(1499)           // => '₹1,499'
 * formatCurrency(49.99, 'USD')   // => '$49.99'
 * formatCurrency(1200, 'EUR', 'de-DE') // => '1.200 €'
 */
export function formatCurrency(
  amount: number,
  currency: string = 'INR',
  locale: string = 'en-IN'
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2,
  }).format(amount);
}

/**
 * formatNumber — Formats a number with locale-aware separators.
 *
 * @example
 * formatNumber(1482900)  // => '14,82,900' (Indian system)
 * formatNumber(1482900, 'en-US') // => '1,482,900'
 */
export function formatNumber(
  value: number,
  locale: string = 'en-IN',
  options?: Intl.NumberFormatOptions
): string {
  return new Intl.NumberFormat(locale, options).format(value);
}

/**
 * formatDate — Formats a Date object or ISO string in a human-readable form.
 *
 * @example
 * formatDate(new Date())  // => '18 Sep 2026'
 * formatDate('2026-09-18', 'en-US', { year: 'numeric', month: 'long' }) // => 'September 2026'
 */
export function formatDate(
  date: Date | string | number,
  locale: string = 'en-IN',
  options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'short', year: 'numeric' }
): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  if (isNaN(d.getTime())) return 'Invalid Date';
  return new Intl.DateTimeFormat(locale, options).format(d);
}

/**
 * formatRelativeTime — Returns a human-friendly relative time string.
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000))  // => '1 minute ago'
 * formatRelativeTime(new Date(Date.now() + 3600000)) // => 'in 1 hour'
 */
export function formatRelativeTime(date: Date | string | number): string {
  const d = typeof date === 'string' || typeof date === 'number' ? new Date(date) : date;
  const seconds = Math.round((d.getTime() - Date.now()) / 1000);
  const absSeconds = Math.abs(seconds);
  const suffix = seconds < 0 ? ' ago' : ' from now';
  const prefix = seconds < 0 ? '' : 'in ';

  if (absSeconds < 60) return seconds < 0 ? 'just now' : 'in a few seconds';
  if (absSeconds < 3600) return `${prefix}${Math.floor(absSeconds / 60)} minute${Math.floor(absSeconds / 60) !== 1 ? 's' : ''}${suffix}`;
  if (absSeconds < 86400) return `${prefix}${Math.floor(absSeconds / 3600)} hour${Math.floor(absSeconds / 3600) !== 1 ? 's' : ''}${suffix}`;
  if (absSeconds < 2592000) return `${prefix}${Math.floor(absSeconds / 86400)} day${Math.floor(absSeconds / 86400) !== 1 ? 's' : ''}${suffix}`;
  if (absSeconds < 31536000) return `${prefix}${Math.floor(absSeconds / 2592000)} month${Math.floor(absSeconds / 2592000) !== 1 ? 's' : ''}${suffix}`;
  return `${prefix}${Math.floor(absSeconds / 31536000)} year${Math.floor(absSeconds / 31536000) !== 1 ? 's' : ''}${suffix}`;
}

/**
 * truncate — Truncates a string to a max length, appending an ellipsis.
 *
 * @example
 * truncate('Hello World', 8) // => 'Hello...'
 */
export function truncate(text: string, maxLength: number, ellipsis: string = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}

/**
 * slugify — Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify('Hello World! 2026') // => 'hello-world-2026'
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * generateId — Generates a random short alphanumeric ID.
 * Not cryptographically secure — for UI key generation only.
 *
 * @example
 * generateId()     // => 'a3f9k2'
 * generateId(12)   // => 'p9z1x4j2m8r3'
 */
export function generateId(length: number = 8): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

/**
 * clamp — Clamps a number between a min and max value.
 *
 * @example
 * clamp(150, 0, 100) // => 100
 * clamp(-5, 0, 100)  // => 0
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/**
 * groupBy — Groups an array of objects by a key.
 *
 * @example
 * groupBy([{type:'A', v:1}, {type:'B', v:2}, {type:'A', v:3}], 'type')
 * // => { A: [...], B: [...] }
 */
export function groupBy<T extends Record<string, unknown>>(
  array: T[],
  key: keyof T
): Record<string, T[]> {
  return array.reduce<Record<string, T[]>>((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}

/**
 * deepMerge — Recursively merges two plain objects (useful for config merging).
 *
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } })
 * // => { a: 1, b: { c: 2, d: 3 } }
 */
export function deepMerge<T extends Record<string, unknown>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };
  for (const key in source) {
    const sourceVal = source[key];
    const targetVal = result[key];
    if (
      sourceVal !== null &&
      typeof sourceVal === 'object' &&
      !Array.isArray(sourceVal) &&
      typeof targetVal === 'object' &&
      targetVal !== null &&
      !Array.isArray(targetVal)
    ) {
      result[key] = deepMerge(
        targetVal as Record<string, unknown>,
        sourceVal as Record<string, unknown>
      ) as T[Extract<keyof T, string>];
    } else if (sourceVal !== undefined) {
      result[key] = sourceVal as T[Extract<keyof T, string>];
    }
  }
  return result;
}

/**
 * omit — Creates a new object without the specified keys.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']) // => { a: 1 }
 */
export function omit<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Omit<T, K> {
  const result = { ...obj };
  keys.forEach((k) => delete result[k]);
  return result as Omit<T, K>;
}

/**
 * pick — Creates a new object with only the specified keys.
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 */
export function pick<T extends Record<string, unknown>, K extends keyof T>(
  obj: T,
  keys: K[]
): Pick<T, K> {
  return keys.reduce<Partial<Pick<T, K>>>((acc, k) => {
    if (k in obj) acc[k] = obj[k];
    return acc;
  }, {}) as Pick<T, K>;
}

/**
 * debounce — Returns a debounced version of a function.
 *
 * @example
 * const debouncedSearch = debounce((q: string) => search(q), 400);
 */
export function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(
  fn: T,
  delayMs: number
): (...args: Parameters<T>) => void {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}

/**
 * getInitials — Extracts initials from a full name (up to 2 characters).
 *
 * @example
 * getInitials('Aarav Sharma')  // => 'AS'
 * getInitials('Priya')         // => 'P'
 */
export function getInitials(name: string, maxChars: number = 2): string {
  if (!name) return '';
  return name
    .trim()
    .split(/\s+/)
    .slice(0, maxChars)
    .map((word) => word[0]?.toUpperCase() ?? '')
    .join('');
}

/**
 * isValidEmail — Basic email format validation.
 *
 * @example
 * isValidEmail('user@example.com') // => true
 * isValidEmail('invalid')           // => false
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

/**
 * isValidIndianPincode — Validates a 6-digit Indian postal (pin) code.
 *
 * @example
 * isValidIndianPincode('110001') // => true
 * isValidIndianPincode('1234')   // => false
 */
export function isValidIndianPincode(pincode: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}

/**
 * isValidIndianMobile — Validates a 10-digit Indian mobile number.
 *
 * @example
 * isValidIndianMobile('9876543210') // => true
 */
export function isValidIndianMobile(mobile: string): boolean {
  return /^[6-9]\d{9}$/.test(mobile.replace(/[\s\-+]/g, ''));
}

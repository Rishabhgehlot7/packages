/**
 * Check and set a session key to prevent duplicate event firing (e.g. Purchase on refresh).
 */
export function isEventDuplicate(key: string): boolean {
  if (typeof window === 'undefined') return true;
  try {
    const storageKey = `boost_event_${key}`;
    if (sessionStorage.getItem(storageKey)) {
      return true;
    }
    sessionStorage.setItem(storageKey, 'true');
    return false;
  } catch {
    return false;
  }
}

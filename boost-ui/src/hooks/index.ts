'use client';

import * as React from 'react';

// ==========================================
// @boostengine/ui - Shared Utility Hooks
// ==========================================

/**
 * useMediaQuery — Reactive CSS media query hook.
 * SSR-safe (returns false on server during hydration).
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);
    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * useClickOutside — Fires callback when user clicks outside the provided ref.
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 * return <div ref={ref}>...</div>;
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
  handler: () => void
): React.RefObject<T> {
  const ref = React.useRef<T>(null);

  React.useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (!ref.current || ref.current.contains(event.target as Node)) return;
      handler();
    };
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }, [handler]);

  return ref as React.RefObject<T>;
}

/**
 * useDebounce — Delays updating a value until after a specified delay.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 400);
 */
export function useDebounce<T>(value: T, delayMs: number = 300): T {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value);

  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);

  return debouncedValue;
}

/**
 * useLocalStorage — Persistent state backed by localStorage with JSON serialization.
 * SSR-safe.
 *
 * @example
 * const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  const [storedValue, setStoredValue] = React.useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = React.useCallback(
    (value: T | ((prev: T) => T)) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore));
        }
      } catch (error) {
        console.warn(`useLocalStorage: Failed to set "${key}"`, error);
      }
    },
    [key, storedValue]
  );

  const removeValue = React.useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: Failed to remove "${key}"`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
}

/**
 * useWindowSize — Reactive window width and height.
 * Returns { width: 0, height: 0 } on SSR.
 *
 * @example
 * const { width, height } = useWindowSize();
 */
export function useWindowSize(): { width: number; height: number } {
  const [size, setSize] = React.useState({ width: 0, height: 0 });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  return size;
}

/**
 * useScrollPosition — Reactive scroll Y and X position of the window.
 *
 * @example
 * const { scrollY } = useScrollPosition();
 * const isScrolled = scrollY > 60;
 */
export function useScrollPosition(): { scrollX: number; scrollY: number } {
  const [scroll, setScroll] = React.useState({ scrollX: 0, scrollY: 0 });

  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const handler = () =>
      setScroll({ scrollX: window.scrollX, scrollY: window.scrollY });
    window.addEventListener('scroll', handler, { passive: true });
    return () => window.removeEventListener('scroll', handler);
  }, []);

  return scroll;
}

/**
 * usePrevious — Returns the previous value of a state or prop.
 *
 * @example
 * const prevCount = usePrevious(count);
 */
export function usePrevious<T>(value: T): T | undefined {
  const ref = React.useRef<T | undefined>(undefined);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}

/**
 * useCopyToClipboard — Copies text to clipboard and provides a `copied` state.
 * `copied` auto-resets after `resetMs` milliseconds.
 *
 * @example
 * const { copy, copied } = useCopyToClipboard();
 * <button onClick={() => copy('some text')}>{copied ? 'Copied!' : 'Copy'}</button>
 */
export function useCopyToClipboard(resetMs: number = 2000): {
  copy: (text: string) => Promise<boolean>;
  copied: boolean;
} {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const copy = React.useCallback(
    async (text: string): Promise<boolean> => {
      if (!navigator?.clipboard) return false;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        if (timerRef.current) clearTimeout(timerRef.current);
        timerRef.current = setTimeout(() => setCopied(false), resetMs);
        return true;
      } catch {
        return false;
      }
    },
    [resetMs]
  );

  React.useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return { copy, copied };
}

/**
 * useToggle — Simple boolean toggle with optional initial value.
 *
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 */
export function useToggle(
  initial: boolean = false
): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>] {
  const [value, setValue] = React.useState(initial);
  const toggle = React.useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}

/**
 * useIntersectionObserver — Tracks whether an element is visible in the viewport.
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 * return <div ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>Fade in</div>;
 */
export function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(
  options: IntersectionObserverInit = {}
): [React.RefObject<T>, boolean] {
  const ref = React.useRef<T>(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);

  React.useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);

  return [ref as React.RefObject<T>, isIntersecting];
}

/**
 * useIsomorphicLayoutEffect — useLayoutEffect on client, useEffect on server (SSR-safe).
 * Use this instead of useLayoutEffect in library code.
 */
export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' ? React.useLayoutEffect : React.useEffect;

/**
 * UseFormOptions — Options for useForm hook.
 */
export interface UseFormOptions<T extends Record<string, any>> {
  initialValues: T;
  validate?: (values: T) => Partial<Record<keyof T, string>>;
  schema?: {
    safeParse?: (data: unknown) => {
      success: boolean;
      error?: { issues?: Array<{ path: (string | number)[]; message: string }> };
    };
    validateSync?: (
      data: unknown,
      options?: any
    ) => any;
  };
  onSubmit?: (values: T) => void | Promise<void>;
}

/**
 * useForm — Lightweight, zero-dependency form state management hook with schema validation (Zod/Yup) and submission tracking.
 *
 * @example
 * const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
 *   initialValues: { email: '', password: '' },
 *   schema: myZodSchema,
 *   onSubmit: async (v) => await login(v),
 * });
 */
export function useForm<T extends Record<string, any>>({
  initialValues,
  validate,
  schema,
  onSubmit,
}: UseFormOptions<T>) {
  const [values, setValues] = React.useState<T>(initialValues);
  const [errors, setErrors] = React.useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = React.useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const runValidation = React.useCallback(
    (vals: T): Partial<Record<keyof T, string>> => {
      let combinedErrors: Partial<Record<keyof T, string>> = {};

      // 1. Zod standard safeParse support
      if (schema && typeof schema.safeParse === 'function') {
        const result = schema.safeParse(vals);
        if (!result.success && result.error?.issues) {
          for (const issue of result.error.issues) {
            const field = issue.path[0] as keyof T;
            if (field && !combinedErrors[field]) {
              combinedErrors[field] = issue.message;
            }
          }
        }
      }

      // 2. Custom validate function support
      if (validate) {
        const customErrs = validate(vals);
        combinedErrors = { ...combinedErrors, ...customErrs };
      }

      return combinedErrors;
    },
    [validate, schema]
  );

  const handleChange = React.useCallback(
    (field: keyof T, value: any) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (touched[field]) {
          const errs = runValidation(next);
          setErrors(errs);
        }
        return next;
      });
    },
    [touched, runValidation]
  );

  const handleBlur = React.useCallback(
    (field: keyof T) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      const errs = runValidation(values);
      setErrors(errs);
    },
    [runValidation, values]
  );

  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);

  const handleSubmit = React.useCallback(
    async (e?: React.FormEvent) => {
      if (e && typeof e.preventDefault === 'function') {
        e.preventDefault();
      }

      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key as keyof T] = true;
        return acc;
      }, {} as Partial<Record<keyof T, boolean>>);
      setTouched(allTouched);

      const errs = runValidation(values);
      setErrors(errs);
      if (Object.keys(errs).length > 0) return;

      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, runValidation, onSubmit]
  );

  const getFieldError = React.useCallback(
    (field: keyof T): string | undefined => (touched[field] ? errors[field] : undefined),
    [errors, touched]
  );

  const setFieldValue = React.useCallback((field: keyof T, val: any) => {
    handleChange(field, val);
  }, [handleChange]);

  const setFieldError = React.useCallback((field: keyof T, err: string | undefined) => {
    setErrors((prev) => ({ ...prev, [field]: err }));
  }, []);

  const hasErrors = Object.keys(errors).length > 0;
  const isValid = !hasErrors;
  const validationSummary = Object.values(errors).filter(Boolean) as string[];

  return {
    values,
    errors,
    touched,
    isSubmitting,
    hasErrors,
    isValid,
    validationSummary,
    getFieldError,
    setFieldValue,
    setFieldError,
    handleChange,
    handleBlur,
    setValues,
    setErrors,
    setTouched,
    reset,
    handleSubmit,
  };
}

/**
 * useFocusTrap — Traps focus within a specified element when active.
 * Useful for modals, drawers, and dialogs for WAI-ARIA compliance.
 *
 * @example
 * const ref = useRef<HTMLDivElement>(null);
 * useFocusTrap(ref, isOpen);
 * return <div ref={ref}>...</div>;
 */
export function useFocusTrap<T extends HTMLElement = HTMLElement>(
  ref: React.RefObject<T | null> | React.MutableRefObject<T | null> | { current: T | null },
  isActive: boolean
) {
  React.useEffect(() => {
    if (!isActive || !ref.current) return;

    const element = ref.current;
    
    // Find all focusable elements
    const focusableSelectors = [
      'a[href]',
      'button:not([disabled])',
      'textarea:not([disabled])',
      'input:not([disabled]):not([type="hidden"])',
      'select:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
    ].join(',');
    
    const focusableElements = Array.from(element.querySelectorAll<HTMLElement>(focusableSelectors));
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (focusableElements.length === 0) {
        e.preventDefault();
        return;
      }

      if (e.shiftKey) {
        // Shift + Tab
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        // Tab
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    };

    // Auto-focus first element when trap activates, unless already focused inside
    if (firstElement && !element.contains(document.activeElement)) {
      // Small timeout to ensure element is fully rendered and focusable
      setTimeout(() => firstElement.focus(), 10);
    }

    element.addEventListener('keydown', handleKeyDown);
    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [isActive, ref]);
}

/**
 * useAnnounce — WAI-ARIA live announcement hook for screen readers.
 * Injects polite or assertive announcements into an offscreen live region.
 *
 * @example
 * const announce = useAnnounce();
 * announce('Cart updated with 2 items', 'polite');
 */
export function useAnnounce() {
  const announce = React.useCallback((message: string, mode: 'polite' | 'assertive' = 'polite') => {
    if (typeof document === 'undefined') return;

    const containerId = `boost-a11y-live-${mode}`;
    let container = document.getElementById(containerId);

    if (!container) {
      container = document.createElement('div');
      container.id = containerId;
      container.setAttribute('aria-live', mode);
      container.setAttribute('aria-atomic', 'true');
      container.setAttribute('role', mode === 'assertive' ? 'alert' : 'status');
      // Visually hidden styles
      Object.assign(container.style, {
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        border: '0',
      });
      document.body.appendChild(container);
    }

    // Set text to empty first, then set message to trigger screen reader announcement
    container.textContent = '';
    setTimeout(() => {
      if (container) {
        container.textContent = message;
      }
    }, 50);
  }, []);

  return announce;
}



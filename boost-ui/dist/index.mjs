'use client';
import * as React from 'react';
import { useState } from 'react';
import { jsxs, jsx, Fragment } from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';

// src/hooks/index.ts
function useMediaQuery(query) {
  const [matches, setMatches] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);
    const handler = (event) => setMatches(event.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);
  return matches;
}
function useClickOutside(handler) {
  const ref = React.useRef(null);
  React.useEffect(() => {
    const listener = (event) => {
      if (!ref.current || ref.current.contains(event.target)) return;
      handler();
    };
    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);
    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [handler]);
  return ref;
}
function useDebounce(value, delayMs = 300) {
  const [debouncedValue, setDebouncedValue] = React.useState(value);
  React.useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delayMs);
    return () => clearTimeout(timer);
  }, [value, delayMs]);
  return debouncedValue;
}
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = React.useState(() => {
    if (typeof window === "undefined") return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  const setValue = React.useCallback(
    (value) => {
      try {
        const valueToStore = value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        if (typeof window !== "undefined") {
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
      if (typeof window !== "undefined") {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn(`useLocalStorage: Failed to remove "${key}"`, error);
    }
  }, [key, initialValue]);
  return [storedValue, setValue, removeValue];
}
function useWindowSize() {
  const [size, setSize] = React.useState({ width: 0, height: 0 });
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const updateSize = () => setSize({ width: window.innerWidth, height: window.innerHeight });
    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);
  return size;
}
function useScrollPosition() {
  const [scroll, setScroll] = React.useState({ scrollX: 0, scrollY: 0 });
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = () => setScroll({ scrollX: window.scrollX, scrollY: window.scrollY });
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);
  return scroll;
}
function usePrevious(value) {
  const ref = React.useRef(void 0);
  React.useEffect(() => {
    ref.current = value;
  });
  return ref.current;
}
function useCopyToClipboard(resetMs = 2e3) {
  const [copied, setCopied] = React.useState(false);
  const timerRef = React.useRef(null);
  const copy = React.useCallback(
    async (text) => {
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
  React.useEffect(() => () => {
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);
  return { copy, copied };
}
function useToggle(initial = false) {
  const [value, setValue] = React.useState(initial);
  const toggle = React.useCallback(() => setValue((v) => !v), []);
  return [value, toggle, setValue];
}
function useIntersectionObserver(options = {}) {
  const ref = React.useRef(null);
  const [isIntersecting, setIsIntersecting] = React.useState(false);
  React.useEffect(() => {
    if (!ref.current || typeof IntersectionObserver === "undefined") return;
    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
    }, options);
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [options]);
  return [ref, isIntersecting];
}
var useIsomorphicLayoutEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
function useForm({
  initialValues,
  validate,
  onSubmit
}) {
  const [values, setValues] = React.useState(initialValues);
  const [errors, setErrors] = React.useState({});
  const [touched, setTouched] = React.useState({});
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const handleChange = React.useCallback(
    (field, value) => {
      setValues((prev) => {
        const next = { ...prev, [field]: value };
        if (validate) {
          const errs = validate(next);
          setErrors(errs);
        }
        return next;
      });
    },
    [validate]
  );
  const handleBlur = React.useCallback(
    (field) => {
      setTouched((prev) => ({ ...prev, [field]: true }));
      if (validate) {
        const errs = validate(values);
        setErrors(errs);
      }
    },
    [validate, values]
  );
  const reset = React.useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  const handleSubmit = React.useCallback(
    async (e) => {
      if (e && typeof e.preventDefault === "function") {
        e.preventDefault();
      }
      const allTouched = Object.keys(values).reduce((acc, key) => {
        acc[key] = true;
        return acc;
      }, {});
      setTouched(allTouched);
      if (validate) {
        const errs = validate(values);
        setErrors(errs);
        if (Object.keys(errs).length > 0) return;
      }
      if (onSubmit) {
        setIsSubmitting(true);
        try {
          await onSubmit(values);
        } finally {
          setIsSubmitting(false);
        }
      }
    },
    [values, validate, onSubmit]
  );
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    setValues,
    setErrors,
    setTouched,
    reset,
    handleSubmit
  };
}

// src/utils/index.ts
function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}
function formatCurrency(amount, currency = "INR", locale = "en-IN") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: amount % 1 === 0 ? 0 : 2,
    maximumFractionDigits: 2
  }).format(amount);
}
function formatNumber(value, locale = "en-IN", options) {
  return new Intl.NumberFormat(locale, options).format(value);
}
function formatDate(date, locale = "en-IN", options = { day: "numeric", month: "short", year: "numeric" }) {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  if (isNaN(d.getTime())) return "Invalid Date";
  return new Intl.DateTimeFormat(locale, options).format(d);
}
function formatRelativeTime(date) {
  const d = typeof date === "string" || typeof date === "number" ? new Date(date) : date;
  const seconds = Math.round((d.getTime() - Date.now()) / 1e3);
  const absSeconds = Math.abs(seconds);
  const suffix = seconds < 0 ? " ago" : " from now";
  const prefix = seconds < 0 ? "" : "in ";
  if (absSeconds < 60) return seconds < 0 ? "just now" : "in a few seconds";
  if (absSeconds < 3600) return `${prefix}${Math.floor(absSeconds / 60)} minute${Math.floor(absSeconds / 60) !== 1 ? "s" : ""}${suffix}`;
  if (absSeconds < 86400) return `${prefix}${Math.floor(absSeconds / 3600)} hour${Math.floor(absSeconds / 3600) !== 1 ? "s" : ""}${suffix}`;
  if (absSeconds < 2592e3) return `${prefix}${Math.floor(absSeconds / 86400)} day${Math.floor(absSeconds / 86400) !== 1 ? "s" : ""}${suffix}`;
  if (absSeconds < 31536e3) return `${prefix}${Math.floor(absSeconds / 2592e3)} month${Math.floor(absSeconds / 2592e3) !== 1 ? "s" : ""}${suffix}`;
  return `${prefix}${Math.floor(absSeconds / 31536e3)} year${Math.floor(absSeconds / 31536e3) !== 1 ? "s" : ""}${suffix}`;
}
function truncate(text, maxLength, ellipsis = "...") {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - ellipsis.length) + ellipsis;
}
function slugify(text) {
  return text.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
function generateId(length = 8) {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
}
function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}
function groupBy(array, key) {
  return array.reduce((acc, item) => {
    const groupKey = String(item[key]);
    if (!acc[groupKey]) acc[groupKey] = [];
    acc[groupKey].push(item);
    return acc;
  }, {});
}
function deepMerge(target, source) {
  const result = { ...target };
  for (const key in source) {
    const sourceVal = source[key];
    const targetVal = result[key];
    if (sourceVal !== null && typeof sourceVal === "object" && !Array.isArray(sourceVal) && typeof targetVal === "object" && targetVal !== null && !Array.isArray(targetVal)) {
      result[key] = deepMerge(
        targetVal,
        sourceVal
      );
    } else if (sourceVal !== void 0) {
      result[key] = sourceVal;
    }
  }
  return result;
}
function omit(obj, keys) {
  const result = { ...obj };
  keys.forEach((k) => delete result[k]);
  return result;
}
function pick(obj, keys) {
  return keys.reduce((acc, k) => {
    if (k in obj) acc[k] = obj[k];
    return acc;
  }, {});
}
function debounce(fn, delayMs) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delayMs);
  };
}
function getInitials(name, maxChars = 2) {
  if (!name) return "";
  return name.trim().split(/\s+/).slice(0, maxChars).map((word) => word[0]?.toUpperCase() ?? "").join("");
}
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}
function isValidIndianPincode(pincode) {
  return /^[1-9][0-9]{5}$/.test(pincode.trim());
}
function isValidIndianMobile(mobile) {
  return /^[6-9]\d{9}$/.test(mobile.replace(/[\s\-+]/g, ""));
}
var defaultLightTokens = {
  primary: "#2563eb",
  primaryHover: "#1d4ed8",
  background: "#ffffff",
  surface: "#f8fafc",
  text: "#0f172a",
  textMuted: "#64748b",
  border: "#e2e8f0",
  radius: "8px",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};
var defaultDarkTokens = {
  primary: "#3b82f6",
  primaryHover: "#60a5fa",
  background: "#090d16",
  surface: "#0f172a",
  text: "#f8fafc",
  textMuted: "#94a3b8",
  border: "#1e293b",
  radius: "8px",
  fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
};
var BoostThemeContext = React.createContext(void 0);
if (typeof document !== "undefined") {
  const STYLE_ID = "__boost_ui_defaults__";
  if (!document.getElementById(STYLE_ID)) {
    const style = document.createElement("style");
    style.id = STYLE_ID;
    style.textContent = `
      :root, [data-theme="light"] {
        --boost-primary: #2563eb;
        --boost-primary-hover: #1d4ed8;
        --boost-bg: #ffffff;
        --boost-surface: #f8fafc;
        --boost-text: #0f172a;
        --boost-text-muted: #64748b;
        --boost-muted: #64748b;
        --boost-border: #e2e8f0;
        --boost-radius: 12px;
        --boost-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.05);
        --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.08);
        --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.12);
        --boost-shadow-glow: 0 0 24px rgba(37, 99, 235, 0.22);
        --boost-glass-bg: rgba(255, 255, 255, 0.85);
        --boost-glass-border: rgba(226, 232, 240, 0.8);
      }
      [data-theme="dark"], .dark {
        --boost-primary: #3b82f6;
        --boost-primary-hover: #60a5fa;
        --boost-bg: #090d16;
        --boost-surface: #0f172a;
        --boost-text: #f8fafc;
        --boost-text-muted: #94a3b8;
        --boost-muted: #94a3b8;
        --boost-border: #1e293b;
        --boost-radius: 12px;
        --boost-font: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
        --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
        --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.4);
        --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.55);
        --boost-shadow-glow: 0 0 24px rgba(59, 130, 246, 0.35);
        --boost-glass-bg: rgba(15, 23, 42, 0.85);
        --boost-glass-border: rgba(255, 255, 255, 0.1);
        color-scheme: dark;
      }
      @media (prefers-color-scheme: dark) {
        :root:not([data-theme="light"]) {
          --boost-primary: #3b82f6;
          --boost-primary-hover: #60a5fa;
          --boost-bg: #090d16;
          --boost-surface: #0f172a;
          --boost-text: #f8fafc;
          --boost-text-muted: #94a3b8;
          --boost-muted: #94a3b8;
          --boost-border: #1e293b;
          --boost-shadow-sm: 0 1px 3px rgba(0, 0, 0, 0.3);
          --boost-shadow-md: 0 4px 16px -2px rgba(0, 0, 0, 0.4);
          --boost-shadow-lg: 0 12px 32px -4px rgba(0, 0, 0, 0.55);
          --boost-shadow-glow: 0 0 24px rgba(59, 130, 246, 0.35);
          --boost-glass-bg: rgba(15, 23, 42, 0.85);
          --boost-glass-border: rgba(255, 255, 255, 0.1);
          color-scheme: dark;
        }
      }

      /* Dark theme contrast safety guards */
      [data-theme="dark"] .boost-btn-secondary,
      .dark .boost-btn-secondary {
        background-color: var(--boost-surface, #0f172a) !important;
        color: var(--boost-text, #f8fafc) !important;
        border-color: var(--boost-border, #1e293b) !important;
      }
      [data-theme="dark"] .boost-btn-outline,
      .dark .boost-btn-outline {
        color: var(--boost-text, #f8fafc) !important;
        border-color: var(--boost-border, #334155) !important;
      }
      [data-theme="dark"] .boost-btn-ghost,
      .dark .boost-btn-ghost {
        color: var(--boost-text, #f8fafc) !important;
      }
      [data-theme="dark"] input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]),
      .dark input:not([type="checkbox"]):not([type="radio"]):not([type="range"]):not([type="submit"]):not([type="button"]),
      [data-theme="dark"] textarea,
      .dark textarea,
      [data-theme="dark"] select,
      .dark select {
        background-color: var(--boost-surface, #0f172a);
        color: var(--boost-text, #f8fafc);
        border-color: var(--boost-border, #1e293b);
      }
      [data-theme="dark"] .boost-badge-success, .dark .boost-badge-success { color: #4ade80 !important; }
      [data-theme="dark"] .boost-badge-warning, .dark .boost-badge-warning { color: #fbbf24 !important; }
      [data-theme="dark"] .boost-badge-destructive, .dark .boost-badge-destructive { color: #f87171 !important; }
      @keyframes boost-spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
      }
      @keyframes boost-pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.4; }
      }
      @keyframes boost-shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
      @keyframes boost-fadeIn {
        from { opacity: 0; transform: translateY(8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-slideUp {
        from { opacity: 0; transform: translateY(24px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-slideDown {
        from { opacity: 0; transform: translateY(-8px); }
        to { opacity: 1; transform: translateY(0); }
      }
      @keyframes boost-scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
      }
      @keyframes boost-float {
        0%, 100% { transform: translateY(0); }
        50% { transform: translateY(-6px); }
      }
    `;
    document.head.appendChild(style);
  }
}
var BoostProvider = ({
  children,
  mode: controlledMode,
  defaultMode = "system",
  storageKey = "boost-theme",
  syncDocumentClass = true,
  tokens = {},
  darkTokens = {},
  className = ""
}) => {
  const [internalMode, setInternalMode] = React.useState(() => {
    if (typeof window !== "undefined" && storageKey) {
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored === "light" || stored === "dark" || stored === "system") {
          return stored;
        }
      } catch {
      }
    }
    return defaultMode;
  });
  const mode = controlledMode !== void 0 ? controlledMode : internalMode;
  const [systemIsDark, setSystemIsDark] = React.useState(() => {
    if (typeof window === "undefined") return false;
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setSystemIsDark(mediaQuery.matches);
    const handler = (e) => setSystemIsDark(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  const resolvedMode = mode === "system" ? systemIsDark ? "dark" : "light" : mode;
  React.useEffect(() => {
    if (typeof document === "undefined" || !syncDocumentClass) return;
    document.documentElement.setAttribute("data-theme", resolvedMode);
    if (resolvedMode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [resolvedMode, syncDocumentClass]);
  const currentTokens = React.useMemo(() => {
    if (resolvedMode === "dark") {
      return { ...defaultDarkTokens, ...darkTokens };
    }
    return { ...defaultLightTokens, ...tokens };
  }, [resolvedMode, tokens, darkTokens]);
  const setMode = (newMode) => {
    setInternalMode(newMode);
    if (typeof window !== "undefined" && storageKey) {
      try {
        localStorage.setItem(storageKey, newMode);
      } catch {
      }
    }
  };
  const toggleMode = () => {
    const nextMode = resolvedMode === "dark" ? "light" : "dark";
    setMode(nextMode);
  };
  const cssVariables = React.useMemo(() => {
    const isDark = resolvedMode === "dark";
    return `
      :root {
        --boost-primary: ${currentTokens.primary};
        --boost-primary-hover: ${currentTokens.primaryHover};
        --boost-bg: ${currentTokens.background};
        --boost-surface: ${currentTokens.surface};
        --boost-text: ${currentTokens.text};
        --boost-text-muted: ${currentTokens.textMuted};
        --boost-muted: ${currentTokens.textMuted};
        --boost-border: ${currentTokens.border};
        --boost-radius: ${currentTokens.radius};
        --boost-font: ${currentTokens.fontFamily};
        --boost-shadow-sm: ${isDark ? "0 1px 3px rgba(0, 0, 0, 0.3)" : "0 1px 3px rgba(0, 0, 0, 0.05)"};
        --boost-shadow-md: ${isDark ? "0 4px 16px -2px rgba(0, 0, 0, 0.4)" : "0 4px 16px -2px rgba(0, 0, 0, 0.08)"};
        --boost-shadow-lg: ${isDark ? "0 12px 32px -4px rgba(0, 0, 0, 0.55)" : "0 12px 32px -4px rgba(0, 0, 0, 0.12)"};
        --boost-shadow-glow: 0 0 24px ${isDark ? "rgba(59, 130, 246, 0.35)" : "rgba(37, 99, 235, 0.22)"};
        --boost-glass-bg: ${isDark ? "rgba(15, 23, 42, 0.85)" : "rgba(255, 255, 255, 0.85)"};
        --boost-glass-border: ${isDark ? "rgba(255, 255, 255, 0.1)" : "rgba(226, 232, 240, 0.8)"};
      }
      [data-theme="${resolvedMode}"] {
        --boost-primary: ${currentTokens.primary};
        --boost-primary-hover: ${currentTokens.primaryHover};
        --boost-bg: ${currentTokens.background};
        --boost-surface: ${currentTokens.surface};
        --boost-text: ${currentTokens.text};
        --boost-text-muted: ${currentTokens.textMuted};
        --boost-muted: ${currentTokens.textMuted};
        --boost-border: ${currentTokens.border};
      }
    `;
  }, [currentTokens, resolvedMode]);
  return /* @__PURE__ */ jsxs(
    BoostThemeContext.Provider,
    {
      value: {
        mode,
        resolvedMode,
        setMode,
        toggleMode,
        tokens: currentTokens
      },
      children: [
        /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: cssVariables } }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: `boost-theme-wrapper ${resolvedMode} ${className}`,
            "data-theme": resolvedMode,
            style: {
              backgroundColor: currentTokens.background,
              color: currentTokens.text,
              fontFamily: currentTokens.fontFamily,
              minHeight: "100%",
              transition: "background-color 0.2s ease, color 0.2s ease"
            },
            children
          }
        )
      ]
    }
  );
};
var useTheme = () => {
  const context = React.useContext(BoostThemeContext);
  if (!context) {
    return {
      mode: "light",
      resolvedMode: "light",
      setMode: () => {
      },
      toggleMode: () => {
      },
      tokens: defaultLightTokens
    };
  }
  return context;
};
BoostProvider.displayName = "BoostProvider";
var ThemeToggle = ({
  variant = "icon",
  size = "md",
  showLabel = true,
  className = "",
  style
}) => {
  const { mode, resolvedMode, toggleMode, setMode } = useTheme();
  const [standaloneMode, setStandaloneMode] = React.useState(() => {
    if (typeof document !== "undefined") {
      const current = document.documentElement.getAttribute("data-theme");
      if (current === "dark" || current === "light") return current;
      if (document.documentElement.classList.contains("dark")) return "dark";
    }
    return "light";
  });
  const effectiveResolvedMode = resolvedMode || standaloneMode;
  const handleToggle = () => {
    if (toggleMode && resolvedMode) {
      toggleMode();
    } else {
      const next = effectiveResolvedMode === "dark" ? "light" : "dark";
      setStandaloneMode(next);
      if (typeof document !== "undefined") {
        document.documentElement.setAttribute("data-theme", next);
        if (next === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    }
  };
  const handleSelectMode = (newMode) => {
    if (setMode) {
      setMode(newMode);
    } else {
      setStandaloneMode(newMode);
      if (typeof document !== "undefined") {
        const nextResolved = newMode === "system" ? window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light" : newMode;
        document.documentElement.setAttribute("data-theme", nextResolved);
        if (nextResolved === "dark") document.documentElement.classList.add("dark");
        else document.documentElement.classList.remove("dark");
      }
    }
  };
  const isDark = effectiveResolvedMode === "dark";
  const sizeMap = {
    sm: { buttonPadding: "6px 10px", iconSize: 14, fontSize: "12px", height: "28px", pillPadding: "2px" },
    md: { buttonPadding: "8px 14px", iconSize: 16, fontSize: "13px", height: "36px", pillPadding: "3px" },
    lg: { buttonPadding: "10px 18px", iconSize: 18, fontSize: "14px", height: "44px", pillPadding: "4px" }
  }[size];
  const SunIcon = ({ size: s }) => /* @__PURE__ */ jsxs("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "5" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "1", x2: "12", y2: "3" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "21", x2: "12", y2: "23" }),
    /* @__PURE__ */ jsx("line", { x1: "4.22", y1: "4.22", x2: "5.64", y2: "5.64" }),
    /* @__PURE__ */ jsx("line", { x1: "18.36", y1: "18.36", x2: "19.78", y2: "19.78" }),
    /* @__PURE__ */ jsx("line", { x1: "1", y1: "12", x2: "3", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "21", y1: "12", x2: "23", y2: "12" }),
    /* @__PURE__ */ jsx("line", { x1: "4.22", y1: "19.78", x2: "5.64", y2: "18.36" }),
    /* @__PURE__ */ jsx("line", { x1: "18.36", y1: "5.64", x2: "19.78", y2: "4.22" })
  ] });
  const MoonIcon = ({ size: s }) => /* @__PURE__ */ jsx("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" }) });
  const MonitorIcon = ({ size: s }) => /* @__PURE__ */ jsxs("svg", { width: s, height: s, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
    /* @__PURE__ */ jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
    /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
  ] });
  if (variant === "segmented") {
    const options = [
      { id: "light", label: "Light", icon: /* @__PURE__ */ jsx(SunIcon, { size: sizeMap.iconSize }) },
      { id: "dark", label: "Dark", icon: /* @__PURE__ */ jsx(MoonIcon, { size: sizeMap.iconSize }) },
      { id: "system", label: "Auto", icon: /* @__PURE__ */ jsx(MonitorIcon, { size: sizeMap.iconSize }) }
    ];
    return /* @__PURE__ */ jsx(
      "div",
      {
        className: `boost-theme-segmented ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          backgroundColor: "var(--boost-surface, rgba(0, 0, 0, 0.05))",
          borderRadius: "999px",
          padding: sizeMap.pillPadding,
          border: "1px solid var(--boost-border, rgba(0, 0, 0, 0.1))",
          boxSizing: "border-box",
          ...style
        },
        children: options.map((opt) => {
          const isSelected = mode === opt.id || !mode && opt.id === effectiveResolvedMode;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleSelectMode(opt.id),
              "aria-label": `Switch to ${opt.label} mode`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: sizeMap.buttonPadding,
                fontSize: sizeMap.fontSize,
                fontWeight: isSelected ? 600 : 500,
                color: isSelected ? "var(--boost-text, #0f172a)" : "var(--boost-text-muted, #64748b)",
                backgroundColor: isSelected ? "var(--boost-bg, #ffffff)" : "transparent",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                boxShadow: isSelected ? "var(--boost-shadow-sm, 0 2px 6px rgba(0,0,0,0.08))" : "none",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
              },
              children: [
                opt.icon,
                showLabel && /* @__PURE__ */ jsx("span", { children: opt.label })
              ]
            },
            opt.id
          );
        })
      }
    );
  }
  if (variant === "switch") {
    return /* @__PURE__ */ jsx(
      "button",
      {
        type: "button",
        role: "switch",
        "aria-checked": isDark,
        onClick: handleToggle,
        "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
        className: `boost-theme-switch ${className}`,
        style: {
          width: size === "sm" ? "44px" : size === "lg" ? "60px" : "52px",
          height: size === "sm" ? "24px" : size === "lg" ? "32px" : "28px",
          borderRadius: "999px",
          backgroundColor: isDark ? "var(--boost-primary, #3b82f6)" : "var(--boost-surface, #e2e8f0)",
          border: "1px solid var(--boost-border, rgba(0,0,0,0.1))",
          padding: "2px",
          display: "inline-flex",
          alignItems: "center",
          cursor: "pointer",
          position: "relative",
          transition: "background-color 0.25s ease",
          boxSizing: "border-box",
          ...style
        },
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: size === "sm" ? "18px" : size === "lg" ? "26px" : "22px",
              height: size === "sm" ? "18px" : size === "lg" ? "26px" : "22px",
              borderRadius: "50%",
              backgroundColor: "#ffffff",
              boxShadow: "0 2px 5px rgba(0, 0, 0, 0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              transform: isDark ? `translateX(${size === "sm" ? "20px" : size === "lg" ? "28px" : "24px"})` : "translateX(0px)",
              transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              color: isDark ? "#0f172a" : "#f59e0b"
            },
            children: isDark ? /* @__PURE__ */ jsx(MoonIcon, { size: sizeMap.iconSize - 2 }) : /* @__PURE__ */ jsx(SunIcon, { size: sizeMap.iconSize - 2 })
          }
        )
      }
    );
  }
  if (variant === "button") {
    return /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleToggle,
        className: `boost-theme-button ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: sizeMap.buttonPadding,
          fontSize: sizeMap.fontSize,
          fontWeight: 600,
          color: "var(--boost-text, #0f172a)",
          backgroundColor: "var(--boost-surface, #f8fafc)",
          border: "1px solid var(--boost-border, #e2e8f0)",
          borderRadius: "var(--boost-radius, 10px)",
          cursor: "pointer",
          boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))",
          transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
          ...style
        },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                color: isDark ? "#60a5fa" : "#f59e0b",
                display: "inline-flex",
                alignItems: "center",
                transform: isDark ? "rotate(0deg)" : "rotate(0deg)",
                transition: "transform 0.3s ease"
              },
              children: isDark ? /* @__PURE__ */ jsx(MoonIcon, { size: sizeMap.iconSize }) : /* @__PURE__ */ jsx(SunIcon, { size: sizeMap.iconSize })
            }
          ),
          showLabel && /* @__PURE__ */ jsx("span", { children: isDark ? "Dark Mode" : "Light Mode" })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsx(
    "button",
    {
      type: "button",
      onClick: handleToggle,
      "aria-label": isDark ? "Switch to light mode" : "Switch to dark mode",
      title: isDark ? "Switch to light mode" : "Switch to dark mode",
      className: `boost-theme-icon-toggle ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        width: sizeMap.height,
        height: sizeMap.height,
        borderRadius: "var(--boost-radius, 10px)",
        backgroundColor: "var(--boost-surface, #f8fafc)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        color: isDark ? "#60a5fa" : "#f59e0b",
        cursor: "pointer",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.04))",
        transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
        padding: 0,
        ...style
      },
      children: /* @__PURE__ */ jsx(
        "span",
        {
          style: {
            display: "inline-flex",
            transform: isDark ? "rotate(-12deg)" : "rotate(0deg)",
            transition: "transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
          },
          children: isDark ? /* @__PURE__ */ jsx(MoonIcon, { size: sizeMap.iconSize + 2 }) : /* @__PURE__ */ jsx(SunIcon, { size: sizeMap.iconSize + 2 })
        }
      )
    }
  );
};
ThemeToggle.displayName = "ThemeToggle";
var Button = React.forwardRef(
  ({
    children,
    variant = "primary",
    size = "md",
    isLoading,
    loading,
    leftIcon,
    rightIcon,
    fullWidth = false,
    disabled,
    className = "",
    style,
    ...props
  }, ref) => {
    const getVariantStyles = () => {
      switch (variant) {
        case "primary":
          return {
            backgroundColor: "var(--boost-primary, #2563eb)",
            color: "#ffffff",
            border: "1px solid transparent",
            boxShadow: "0 1px 3px rgba(37, 99, 235, 0.2)"
          };
        case "secondary":
          return {
            backgroundColor: "var(--boost-surface, #f1f5f9)",
            color: "var(--boost-text, #0f172a)",
            border: "1px solid var(--boost-border, #e2e8f0)"
          };
        case "outline":
          return {
            backgroundColor: "transparent",
            color: "var(--boost-text, #0f172a)",
            border: "1px solid var(--boost-border, #cbd5e1)"
          };
        case "ghost":
          return {
            backgroundColor: "transparent",
            color: "var(--boost-text, #0f172a)",
            border: "1px solid transparent"
          };
        case "destructive":
          return {
            backgroundColor: "#dc2626",
            color: "#ffffff",
            border: "1px solid transparent",
            boxShadow: "0 1px 3px rgba(220, 38, 38, 0.25)"
          };
        case "link":
          return {
            backgroundColor: "transparent",
            color: "var(--boost-primary, #2563eb)",
            border: "none",
            padding: 0,
            textDecoration: "underline"
          };
        default:
          return {};
      }
    };
    const getSizeStyles = () => {
      if (variant === "link") return {};
      switch (size) {
        case "sm":
          return {
            padding: "6px 14px",
            fontSize: "12px",
            borderRadius: "var(--boost-radius, 8px)"
          };
        case "lg":
          return {
            padding: "13px 26px",
            fontSize: "15px",
            borderRadius: "var(--boost-radius, 12px)"
          };
        case "md":
        default:
          return {
            padding: "9px 18px",
            fontSize: "14px",
            borderRadius: "var(--boost-radius, 10px)"
          };
      }
    };
    const isBusy = loading ?? isLoading ?? false;
    const baseStyles = {
      display: fullWidth ? "flex" : "inline-flex",
      width: fullWidth ? "100%" : "auto",
      alignItems: "center",
      justifyContent: "center",
      gap: "8px",
      fontFamily: "inherit",
      fontWeight: 600,
      cursor: disabled || isBusy ? "not-allowed" : "pointer",
      opacity: disabled || isBusy ? 0.6 : 1,
      transition: "all 0.15s ease",
      outline: "none",
      userSelect: "none",
      ...getSizeStyles(),
      ...getVariantStyles(),
      ...style
    };
    return /* @__PURE__ */ jsxs(
      "button",
      {
        ref,
        disabled: disabled || isBusy,
        className: `boost-btn boost-btn-${variant} ${className}`,
        style: baseStyles,
        ...props,
        children: [
          isBusy && /* @__PURE__ */ jsx(
            "svg",
            {
              width: "16",
              height: "16",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              strokeLinecap: "round",
              style: {
                animation: "boost-spin 0.8s linear infinite"
              },
              children: /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
            }
          ),
          !isLoading && leftIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: leftIcon }),
          /* @__PURE__ */ jsx("span", { children }),
          !isLoading && rightIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: rightIcon })
        ]
      }
    );
  }
);
Button.displayName = "Button";
var IconButton = React.forwardRef(
  ({
    icon,
    label,
    variant = "secondary",
    size = "md",
    isLoading = false,
    disabled,
    className = "",
    style,
    ...props
  }, ref) => {
    const getSize = () => {
      switch (size) {
        case "sm":
          return { width: "28px", height: "28px", padding: "4px" };
        case "lg":
          return { width: "44px", height: "44px", padding: "10px" };
        case "md":
        default:
          return { width: "36px", height: "36px", padding: "8px" };
      }
    };
    const getBgColor = () => {
      switch (variant) {
        case "primary":
          return { bg: "#2563eb", color: "#fff", border: "none" };
        case "outline":
          return { bg: "transparent", color: "#0f172a", border: "1px solid #cbd5e1" };
        case "ghost":
          return { bg: "transparent", color: "#0f172a", border: "none" };
        case "destructive":
          return { bg: "#dc2626", color: "#fff", border: "none" };
        case "secondary":
        default:
          return { bg: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0" };
      }
    };
    const s = getSize();
    const v = getBgColor();
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        "aria-label": label,
        title: label,
        disabled: disabled || isLoading,
        className: `boost-icon-btn ${className}`,
        style: {
          width: s.width,
          height: s.height,
          padding: s.padding,
          backgroundColor: v.bg,
          color: v.color,
          border: v.border,
          borderRadius: "6px",
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || isLoading ? "not-allowed" : "pointer",
          opacity: disabled || isLoading ? 0.6 : 1,
          transition: "all 0.15s ease",
          outline: "none",
          ...style
        },
        ...props,
        children: icon
      }
    );
  }
);
IconButton.displayName = "IconButton";
var ButtonGroup = ({
  children,
  orientation = "horizontal",
  className = "",
  style
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-button-group ${className}`,
      style: {
        display: "inline-flex",
        flexDirection: orientation === "vertical" ? "column" : "row",
        borderRadius: "6px",
        overflow: "hidden",
        border: "1px solid #cbd5e1",
        ...style
      },
      children: React.Children.map(children, (child) => {
        if (!React.isValidElement(child)) return child;
        const typedChild = child;
        return React.cloneElement(typedChild, {
          style: {
            ...typedChild.props.style,
            borderRadius: 0,
            border: "none",
            borderRight: orientation === "horizontal" ? "1px solid #cbd5e1" : "none",
            borderBottom: orientation === "vertical" ? "1px solid #cbd5e1" : "none"
          }
        });
      })
    }
  );
};
ButtonGroup.displayName = "ButtonGroup";
var FloatingActionButton = ({
  icon,
  label,
  position = "bottom-right",
  className = "",
  style,
  ...props
}) => {
  const getPositionStyles = () => {
    switch (position) {
      case "bottom-left":
        return { bottom: "24px", left: "24px" };
      case "top-right":
        return { top: "24px", right: "24px" };
      case "top-left":
        return { top: "24px", left: "24px" };
      case "bottom-right":
      default:
        return { bottom: "24px", right: "24px" };
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      className: `boost-fab ${className}`,
      style: {
        position: "fixed",
        zIndex: 999,
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: label ? "12px 20px" : "14px",
        borderRadius: label ? "9999px" : "50%",
        backgroundColor: "#2563eb",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.4)",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...getPositionStyles(),
        ...style
      },
      ...props,
      children: [
        icon,
        label && /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
};
FloatingActionButton.displayName = "FloatingActionButton";
var LinkButton = ({
  href,
  children,
  variant = "primary",
  size = "md",
  leftIcon,
  rightIcon,
  className = "",
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return { backgroundColor: "#f1f5f9", color: "#0f172a", border: "1px solid #e2e8f0" };
      case "outline":
        return { backgroundColor: "transparent", color: "#0f172a", border: "1px solid #cbd5e1" };
      case "ghost":
        return { backgroundColor: "transparent", color: "#0f172a", border: "none" };
      case "destructive":
        return { backgroundColor: "#dc2626", color: "#ffffff", border: "none" };
      case "link":
        return { backgroundColor: "transparent", color: "#2563eb", border: "none", padding: 0, textDecoration: "underline" };
      case "primary":
      default:
        return { backgroundColor: "#2563eb", color: "#ffffff", border: "none" };
    }
  };
  const getSizeStyles = () => {
    if (variant === "link") return {};
    switch (size) {
      case "sm":
        return { padding: "6px 12px", fontSize: "12px", borderRadius: "4px" };
      case "lg":
        return { padding: "12px 24px", fontSize: "16px", borderRadius: "8px" };
      case "md":
      default:
        return { padding: "9px 16px", fontSize: "14px", borderRadius: "6px" };
    }
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      className: `boost-link-btn ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
        ...getSizeStyles(),
        ...getVariantStyles(),
        ...style
      },
      ...props,
      children: [
        leftIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: leftIcon }),
        /* @__PURE__ */ jsx("span", { children }),
        rightIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: rightIcon })
      ]
    }
  );
};
LinkButton.displayName = "LinkButton";
var CopyButton = ({
  text,
  label = "Copy",
  copiedLabel = "Copied!",
  timeout = 2e3,
  variant = "outline",
  size = "md",
  className = "",
  style,
  ...props
}) => {
  const [copied, setCopied] = React.useState(false);
  const handleCopy = async (e) => {
    e.stopPropagation();
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), timeout);
    } catch (err) {
      console.error("Failed to copy to clipboard", err);
    }
  };
  const isSmall = size === "sm";
  const getVariantStyles = () => {
    switch (variant) {
      case "solid":
        return {
          backgroundColor: copied ? "#16a34a" : "var(--boost-primary, #2563eb)",
          color: "#ffffff",
          border: "none"
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
          color: copied ? "#16a34a" : "var(--boost-text, #0f172a)",
          border: "none"
        };
      default:
        return {
          backgroundColor: "transparent",
          color: copied ? "#16a34a" : "var(--boost-text, #0f172a)",
          border: `1px solid ${copied ? "#16a34a" : "var(--boost-border, #cbd5e1)"}`
        };
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleCopy,
      className: `boost-copy-button ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: isSmall ? "4px 8px" : "6px 12px",
        borderRadius: "var(--boost-radius, 6px)",
        fontSize: isSmall ? "12px" : "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
        ...getVariantStyles(),
        ...style
      },
      ...props,
      children: [
        copied ? /* @__PURE__ */ jsx(
          "svg",
          {
            width: isSmall ? "14" : "16",
            height: isSmall ? "14" : "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.5",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" })
          }
        ) : /* @__PURE__ */ jsxs(
          "svg",
          {
            width: isSmall ? "14" : "16",
            height: isSmall ? "14" : "16",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            strokeLinecap: "round",
            strokeLinejoin: "round",
            children: [
              /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
              /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
            ]
          }
        ),
        /* @__PURE__ */ jsx("span", { children: copied ? copiedLabel : label })
      ]
    }
  );
};
CopyButton.displayName = "CopyButton";
var Input = React.forwardRef(
  ({
    label,
    error,
    helperText,
    leftIcon,
    rightIcon,
    fullWidth = true,
    disabled,
    className = "",
    id,
    style,
    ...props
  }, ref) => {
    const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, "-")}` : void 0);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-input-wrapper ${className}`,
        style: {
          display: fullWidth ? "flex" : "inline-flex",
          flexDirection: "column",
          gap: "6px",
          fontFamily: "inherit",
          width: fullWidth ? "100%" : "auto"
        },
        children: [
          label && /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: inputId,
              style: {
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--boost-text, #334155)",
                letterSpacing: "-0.01em"
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                position: "relative",
                display: "flex",
                alignItems: "center",
                width: "100%"
              },
              children: [
                leftIcon && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      position: "absolute",
                      left: "12px",
                      display: "inline-flex",
                      color: "var(--boost-muted, #64748b)",
                      pointerEvents: "none"
                    },
                    children: leftIcon
                  }
                ),
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    ref,
                    id: inputId,
                    disabled,
                    style: {
                      width: "100%",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      paddingLeft: leftIcon ? "38px" : "14px",
                      paddingRight: rightIcon ? "38px" : "14px",
                      fontSize: "14px",
                      color: "var(--boost-text, #0f172a)",
                      backgroundColor: disabled ? "rgba(0, 0, 0, 0.03)" : "var(--boost-bg, #ffffff)",
                      border: `1px solid ${error ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                      borderRadius: "var(--boost-radius, 10px)",
                      outline: "none",
                      transition: "border-color 0.15s ease, box-shadow 0.15s ease",
                      boxSizing: "border-box",
                      ...style
                    },
                    ...props
                  }
                ),
                rightIcon && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      position: "absolute",
                      right: "12px",
                      display: "inline-flex",
                      color: "var(--boost-muted, #64748b)"
                    },
                    children: rightIcon
                  }
                )
              ]
            }
          ),
          error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#ef4444", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-muted, #64748b)" }, children: helperText }) : null
        ]
      }
    );
  }
);
Input.displayName = "Input";
var Textarea = React.forwardRef(
  ({
    label,
    error,
    helperText,
    maxChars,
    fullWidth = true,
    disabled,
    className = "",
    id,
    value,
    onChange,
    style,
    ...props
  }, ref) => {
    const textareaId = id || (label ? `textarea-${label.toLowerCase().replace(/\s+/g, "-")}` : void 0);
    const charCount = typeof value === "string" ? value.length : 0;
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-textarea-wrapper ${className}`,
        style: {
          display: fullWidth ? "flex" : "inline-flex",
          flexDirection: "column",
          gap: "6px",
          fontFamily: "inherit",
          width: fullWidth ? "100%" : "auto"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            label && /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: textareaId,
                style: {
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "#334155"
                },
                children: label
              }
            ),
            maxChars && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: charCount > maxChars ? "#ef4444" : "#64748b" }, children: [
              charCount,
              "/",
              maxChars
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "textarea",
            {
              ref,
              id: textareaId,
              disabled,
              value,
              onChange,
              style: {
                width: "100%",
                padding: "10px 12px",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: disabled ? "#f8fafc" : "#ffffff",
                border: `1px solid ${error ? "#ef4444" : "#cbd5e1"}`,
                borderRadius: "6px",
                outline: "none",
                minHeight: "80px",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
                ...style
              },
              ...props
            }
          ),
          error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
        ]
      }
    );
  }
);
Textarea.displayName = "Textarea";
var Select = React.forwardRef(
  ({
    label,
    error,
    helperText,
    options,
    placeholder,
    fullWidth = true,
    disabled,
    className = "",
    id,
    style,
    ...props
  }, ref) => {
    const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, "-")}` : void 0);
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-select-wrapper ${className}`,
        style: {
          display: fullWidth ? "flex" : "inline-flex",
          flexDirection: "column",
          gap: "6px",
          fontFamily: "inherit",
          width: fullWidth ? "100%" : "auto"
        },
        children: [
          label && /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: selectId,
              style: {
                fontSize: "13px",
                fontWeight: 600,
                color: "#334155"
              },
              children: label
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: "100%" }, children: [
            /* @__PURE__ */ jsxs(
              "select",
              {
                ref,
                id: selectId,
                disabled,
                style: {
                  width: "100%",
                  paddingTop: "8px",
                  paddingBottom: "8px",
                  paddingLeft: "12px",
                  paddingRight: "36px",
                  fontSize: "14px",
                  color: "#0f172a",
                  backgroundColor: disabled ? "#f8fafc" : "#ffffff",
                  border: `1px solid ${error ? "#ef4444" : "#cbd5e1"}`,
                  borderRadius: "6px",
                  outline: "none",
                  appearance: "none",
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  ...style
                },
                ...props,
                children: [
                  placeholder && /* @__PURE__ */ jsx("option", { value: "", disabled: true, children: placeholder }),
                  options.map((opt) => /* @__PURE__ */ jsx("option", { value: opt.value, disabled: opt.disabled, children: opt.label }, opt.value))
                ]
              }
            ),
            /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  position: "absolute",
                  right: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                  color: "#64748b",
                  display: "inline-flex"
                },
                children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
              }
            )
          ] }),
          error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
        ]
      }
    );
  }
);
Select.displayName = "Select";
var MultiSelect = ({
  label,
  options,
  value,
  onChange,
  placeholder = "Select options...",
  error,
  className = "",
  disabled = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const toggleOption = (val) => {
    if (value.includes(val)) {
      onChange(value.filter((v) => v !== val));
    } else {
      onChange([...value, val]);
    }
  };
  const removeChip = (e, val) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== val));
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `boost-multiselect-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        position: "relative",
        width: "100%"
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: label }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => !disabled && setIsOpen((prev) => !prev),
            style: {
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "6px",
              padding: "6px 12px",
              minHeight: "38px",
              backgroundColor: disabled ? "#f8fafc" : "#ffffff",
              border: `1px solid ${error ? "#ef4444" : isOpen ? "#2563eb" : "#cbd5e1"}`,
              borderRadius: "6px",
              cursor: disabled ? "not-allowed" : "pointer",
              boxSizing: "border-box"
            },
            children: [
              value.length === 0 ? /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", color: "#94a3b8" }, children: placeholder }) : value.map((val) => {
                const opt = options.find((o) => o.value === val);
                return /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px",
                      backgroundColor: "#e0e7ff",
                      color: "#3730a3",
                      padding: "2px 8px",
                      borderRadius: "4px",
                      fontSize: "12px",
                      fontWeight: 500
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { children: opt ? opt.label : val }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          onClick: (e) => removeChip(e, val),
                          style: {
                            display: "inline-flex",
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: 1
                          },
                          children: "\xD7"
                        }
                      )
                    ]
                  },
                  val
                );
              }),
              /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", display: "inline-flex", color: "#64748b" }, children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) }) })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              zIndex: 100,
              maxHeight: "200px",
              overflowY: "auto",
              padding: "4px"
            },
            children: options.map((opt) => {
              const isSelected = value.includes(opt.value);
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => toggleOption(opt.value),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    fontSize: "13px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "#f1f5f9" : "transparent",
                    color: "#0f172a"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: opt.label }),
                    isSelected && /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
                  ]
                },
                opt.value
              );
            })
          }
        ),
        error && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error })
      ]
    }
  );
};
MultiSelect.displayName = "MultiSelect";
var Checkbox = React.forwardRef(
  ({ label, description, indeterminate, checked, disabled, className = "", style, ...props }, ref) => {
    const inputRef = React.useRef(null);
    React.useImperativeHandle(ref, () => inputRef.current);
    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.indeterminate = Boolean(indeterminate);
      }
    }, [indeterminate]);
    return /* @__PURE__ */ jsxs(
      "label",
      {
        className: `boost-checkbox-label ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "flex-start",
          gap: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          userSelect: "none",
          fontFamily: "inherit",
          opacity: disabled ? 0.6 : 1,
          ...style
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { position: "relative", display: "flex", alignItems: "center", marginTop: "2px" }, children: /* @__PURE__ */ jsx(
            "input",
            {
              ref: inputRef,
              type: "checkbox",
              checked,
              disabled,
              style: {
                width: "16px",
                height: "16px",
                accentColor: "#2563eb",
                cursor: disabled ? "not-allowed" : "pointer",
                margin: 0
              },
              ...props
            }
          ) }),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "#1e293b" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: description })
          ] })
        ]
      }
    );
  }
);
Checkbox.displayName = "Checkbox";
var Radio = React.forwardRef(
  ({ label, description, className = "", style, disabled, ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "label",
      {
        style: {
          display: "inline-flex",
          alignItems: "flex-start",
          gap: "8px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          userSelect: "none",
          fontFamily: "inherit",
          ...style
        },
        className: `boost-radio ${className}`,
        children: [
          /* @__PURE__ */ jsx(
            "input",
            {
              ref,
              type: "radio",
              disabled,
              style: {
                width: "16px",
                height: "16px",
                accentColor: "#2563eb",
                cursor: disabled ? "not-allowed" : "pointer",
                marginTop: "2px"
              },
              ...props
            }
          ),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "#1e293b" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: description })
          ] })
        ]
      }
    );
  }
);
Radio.displayName = "Radio";
var RadioGroup = ({
  name,
  options,
  value,
  onChange,
  orientation = "vertical",
  className = "",
  disabled = false
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-radio-group ${className}`,
      style: {
        display: "flex",
        flexDirection: orientation === "horizontal" ? "row" : "column",
        gap: "12px",
        fontFamily: "inherit"
      },
      children: options.map((opt) => {
        const isChecked = value === opt.value;
        const isDisabled = disabled || opt.disabled;
        return /* @__PURE__ */ jsx(
          Radio,
          {
            name,
            value: opt.value,
            checked: isChecked,
            disabled: isDisabled,
            onChange: () => onChange(opt.value),
            label: opt.label,
            description: opt.description
          },
          String(opt.value)
        );
      })
    }
  );
};
RadioGroup.displayName = "RadioGroup";
var Switch = React.forwardRef(
  ({
    checked,
    onChange,
    label,
    description,
    disabled = false,
    size = "md",
    className = ""
  }, ref) => {
    const getSizes = () => {
      switch (size) {
        case "sm":
          return { width: 32, height: 18, circle: 14, translate: 14 };
        case "lg":
          return { width: 52, height: 28, circle: 22, translate: 24 };
        case "md":
        default:
          return { width: 44, height: 24, circle: 18, translate: 20 };
      }
    };
    const s = getSizes();
    return /* @__PURE__ */ jsxs(
      "label",
      {
        className: `boost-switch-wrapper ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          cursor: disabled ? "not-allowed" : "pointer",
          opacity: disabled ? 0.6 : 1,
          userSelect: "none",
          fontFamily: "inherit"
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              ref,
              type: "button",
              role: "switch",
              "aria-checked": checked,
              disabled,
              onClick: () => !disabled && onChange(!checked),
              style: {
                width: `${s.width}px`,
                height: `${s.height}px`,
                backgroundColor: checked ? "#2563eb" : "#cbd5e1",
                borderRadius: "9999px",
                position: "relative",
                transition: "background-color 0.2s ease",
                border: "none",
                padding: 0,
                cursor: disabled ? "not-allowed" : "pointer",
                outline: "none"
              },
              children: /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    width: `${s.circle}px`,
                    height: `${s.circle}px`,
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    position: "absolute",
                    top: "50%",
                    left: "3px",
                    transform: `translateY(-50%) translateX(${checked ? `${s.translate}px` : "0px"})`,
                    transition: "transform 0.2s ease",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.2)",
                    display: "block"
                  }
                }
              )
            }
          ),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "#1e293b" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: description })
          ] })
        ]
      }
    );
  }
);
Switch.displayName = "Switch";
var DatePicker = ({
  label,
  value,
  onChange,
  minDate,
  maxDate,
  error,
  helperText,
  disabled = false,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-datepicker-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        width: "100%"
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: label }),
        /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%" }, children: /* @__PURE__ */ jsx(
          "input",
          {
            type: "date",
            value,
            onChange: (e) => onChange(e.target.value),
            min: minDate,
            max: maxDate,
            disabled,
            style: {
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              color: "#0f172a",
              backgroundColor: disabled ? "#f8fafc" : "#ffffff",
              border: `1px solid ${error ? "#ef4444" : "#cbd5e1"}`,
              borderRadius: "6px",
              outline: "none",
              boxSizing: "border-box"
            }
          }
        ) }),
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
      ]
    }
  );
};
DatePicker.displayName = "DatePicker";
var TimePicker = ({
  label,
  value,
  onChange,
  error,
  helperText,
  disabled = false,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-timepicker-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        width: "100%"
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "time",
            value,
            onChange: (e) => onChange(e.target.value),
            disabled,
            style: {
              width: "100%",
              padding: "8px 12px",
              fontSize: "14px",
              color: "#0f172a",
              backgroundColor: disabled ? "#f8fafc" : "#ffffff",
              border: `1px solid ${error ? "#ef4444" : "#cbd5e1"}`,
              borderRadius: "6px",
              outline: "none",
              boxSizing: "border-box"
            }
          }
        ),
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
      ]
    }
  );
};
TimePicker.displayName = "TimePicker";
var FileUpload = ({
  label,
  accept,
  maxFiles = 5,
  maxSizeMB = 10,
  onFilesSelected,
  error,
  helperText,
  disabled = false,
  className = ""
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [fileList, setFileList] = React.useState([]);
  const inputRef = React.useRef(null);
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files);
      setFileList(droppedFiles);
      onFilesSelected(droppedFiles);
    }
  };
  const handleChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFileList(selectedFiles);
      onFilesSelected(selectedFiles);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-fileupload-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        width: "100%"
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: label }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            onDragOver: (e) => {
              e.preventDefault();
              setIsDragOver(true);
            },
            onDragLeave: () => setIsDragOver(false),
            onDrop: handleDrop,
            onClick: () => !disabled && inputRef.current?.click(),
            style: {
              border: `2px dashed ${error ? "#ef4444" : isDragOver ? "#2563eb" : "#cbd5e1"}`,
              borderRadius: "8px",
              padding: "24px",
              textAlign: "center",
              backgroundColor: isDragOver ? "#eff6ff" : disabled ? "#f8fafc" : "#ffffff",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.15s ease"
            },
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "file",
                  accept,
                  multiple: maxFiles > 1,
                  onChange: handleChange,
                  disabled,
                  style: { display: "none" }
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsxs("svg", { width: "28", height: "28", viewBox: "0 0 24 24", fill: "none", stroke: "#64748b", strokeWidth: "2", children: [
                  /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                  /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "#1e293b" }, children: "Click to upload or drag and drop" }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#64748b" }, children: [
                  "Maximum ",
                  maxFiles,
                  " files, up to ",
                  maxSizeMB,
                  "MB"
                ] })
              ] })
            ]
          }
        ),
        fileList.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }, children: fileList.map((f, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "4px 8px",
              background: "#f1f5f9",
              borderRadius: "4px",
              fontSize: "12px",
              color: "#334155"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: f.name }),
              /* @__PURE__ */ jsxs("span", { style: { color: "#64748b" }, children: [
                (f.size / (1024 * 1024)).toFixed(2),
                " MB"
              ] })
            ]
          },
          i
        )) }),
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
      ]
    }
  );
};
FileUpload.displayName = "FileUpload";
var SearchInput = React.forwardRef(
  ({ value, onChange, onClear, fullWidth = true, className = "", style, placeholder = "Search...", ...props }, ref) => {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-search-input-wrapper ${className}`,
        style: {
          position: "relative",
          display: fullWidth ? "flex" : "inline-flex",
          alignItems: "center",
          width: fullWidth ? "100%" : "auto",
          fontFamily: "inherit"
        },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                position: "absolute",
                left: "12px",
                display: "inline-flex",
                color: "#64748b",
                pointerEvents: "none"
              },
              children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx(
            "input",
            {
              ref,
              type: "text",
              value,
              onChange,
              placeholder,
              style: {
                width: "100%",
                paddingTop: "8px",
                paddingBottom: "8px",
                paddingLeft: "36px",
                paddingRight: value && onClear ? "36px" : "12px",
                fontSize: "14px",
                color: "#0f172a",
                backgroundColor: "#ffffff",
                border: "1px solid #cbd5e1",
                borderRadius: "6px",
                outline: "none",
                boxSizing: "border-box",
                ...style
              },
              ...props
            }
          ),
          value && onClear && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onClear,
              "aria-label": "Clear search",
              style: {
                position: "absolute",
                right: "10px",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                color: "#94a3b8",
                cursor: "pointer",
                padding: "2px"
              },
              children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
              ] })
            }
          )
        ]
      }
    );
  }
);
SearchInput.displayName = "SearchInput";
var FormField = ({
  label,
  required = false,
  error,
  helperText,
  children,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-form-field ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxs("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: [
          label,
          required && /* @__PURE__ */ jsx("span", { style: { color: "#ef4444", marginLeft: "4px" }, children: "*" })
        ] }),
        children,
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#64748b" }, children: helperText }) : null
      ]
    }
  );
};
FormField.displayName = "FormField";
var OTPInput = React.forwardRef(
  ({
    length = 6,
    value,
    onChange,
    onComplete,
    disabled = false,
    error,
    className = ""
  }, ref) => {
    const inputsRef = React.useRef([]);
    React.useImperativeHandle(ref, () => inputsRef.current[0]);
    const handleKeyDown = (e, idx) => {
      if (e.key === "Backspace") {
        if (!value[idx] && idx > 0) {
          inputsRef.current[idx - 1]?.focus();
        }
      }
    };
    const handleChange = (e, idx) => {
      const char = e.target.value.slice(-1).replace(/\D/g, "");
      const chars = value.split("");
      chars[idx] = char;
      const newOtp = chars.join("").slice(0, length);
      onChange(newOtp);
      if (char && idx < length - 1) {
        inputsRef.current[idx + 1]?.focus();
      }
      if (newOtp.length === length && onComplete) {
        onComplete(newOtp);
      }
    };
    const handlePaste = (e) => {
      e.preventDefault();
      const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
      if (pasted) {
        onChange(pasted);
        if (pasted.length === length && onComplete) {
          onComplete(pasted);
        }
        inputsRef.current[Math.min(pasted.length, length - 1)]?.focus();
      }
    };
    return /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-otp-wrapper ${className}`,
        style: {
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "8px",
          fontFamily: "inherit"
        },
        children: [
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "8px" }, children: Array.from({ length }).map((_, idx) => /* @__PURE__ */ jsx(
            "input",
            {
              ref: (el) => {
                inputsRef.current[idx] = el;
              },
              type: "text",
              inputMode: "numeric",
              maxLength: 1,
              value: value[idx] || "",
              onChange: (e) => handleChange(e, idx),
              onKeyDown: (e) => handleKeyDown(e, idx),
              onPaste: handlePaste,
              disabled,
              style: {
                width: "42px",
                height: "48px",
                fontSize: "20px",
                fontWeight: 700,
                textAlign: "center",
                color: "#0f172a",
                backgroundColor: disabled ? "#f8fafc" : "#ffffff",
                border: `1.5px solid ${error ? "#ef4444" : value[idx] ? "#2563eb" : "#cbd5e1"}`,
                borderRadius: "8px",
                outline: "none",
                transition: "all 0.15s ease"
              }
            },
            idx
          )) }),
          error && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#dc2626", fontWeight: 500 }, children: error })
        ]
      }
    );
  }
);
OTPInput.displayName = "OTPInput";
var FileDropzone = ({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeMB = 10,
  title = "Click to upload or drag & drop files here",
  subtitle = `Supports files up to ${maxSizeMB}MB`,
  disabled = false,
  className = "",
  style
}) => {
  const [isDragOver, setIsDragOver] = React.useState(false);
  const [error, setError] = React.useState(null);
  const [fileList, setFileList] = React.useState([]);
  const inputRef = React.useRef(null);
  const validateAndAddFiles = (newFiles) => {
    if (!newFiles || newFiles.length === 0) return;
    setError(null);
    const validFiles = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    for (let i = 0; i < newFiles.length; i++) {
      const file = newFiles[i];
      if (file.size > maxSizeBytes) {
        setError(`File "${file.name}" exceeds the ${maxSizeMB}MB limit.`);
        return;
      }
      validFiles.push(file);
    }
    const updated = multiple ? [...fileList, ...validFiles] : validFiles;
    setFileList(updated);
    onFilesSelected(updated);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    validateAndAddFiles(e.dataTransfer.files);
  };
  const removeFile = (idx, e) => {
    e.stopPropagation();
    const updated = fileList.filter((_, i) => i !== idx);
    setFileList(updated);
    onFilesSelected(updated);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-file-dropzone ${className}`,
      style: {
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            onDragOver: (e) => {
              e.preventDefault();
              if (!disabled) setIsDragOver(true);
            },
            onDragLeave: () => setIsDragOver(false),
            onDrop: handleDrop,
            onClick: () => !disabled && inputRef.current?.click(),
            style: {
              border: `2px dashed ${isDragOver ? "var(--boost-primary, #2563eb)" : "var(--boost-border, #cbd5e1)"}`,
              borderRadius: "var(--boost-radius, 12px)",
              backgroundColor: isDragOver ? "rgba(37, 99, 235, 0.04)" : "var(--boost-surface, #f8fafc)",
              padding: "36px 20px",
              textAlign: "center",
              cursor: disabled ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              opacity: disabled ? 0.6 : 1
            },
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  ref: inputRef,
                  type: "file",
                  accept,
                  multiple,
                  disabled,
                  style: { display: "none" },
                  onChange: (e) => validateAndAddFiles(e.target.files)
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                    color: "var(--boost-primary, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 16px auto"
                  },
                  children: /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      width: "24",
                      height: "24",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: [
                        /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                        /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
                        /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
                      ]
                    }
                  )
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    fontSize: "15px",
                    fontWeight: 600,
                    margin: "0 0 6px 0",
                    color: "var(--boost-text, #0f172a)"
                  },
                  children: title
                }
              ),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    fontSize: "13px",
                    color: "var(--boost-text-muted, #64748b)",
                    margin: 0
                  },
                  children: subtitle
                }
              )
            ]
          }
        ),
        error && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              marginTop: "10px",
              fontSize: "13px",
              color: "#dc2626",
              fontWeight: 500
            },
            children: [
              "\u26A0 ",
              error
            ]
          }
        ),
        fileList.length > 0 && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              marginTop: "16px",
              display: "flex",
              flexDirection: "column",
              gap: "8px"
            },
            children: fileList.map((file, idx) => /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  backgroundColor: "var(--boost-surface, #f1f5f9)",
                  border: "1px solid var(--boost-border, #e2e8f0)",
                  fontSize: "13px"
                },
                children: [
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      style: {
                        fontWeight: 500,
                        color: "var(--boost-text, #0f172a)",
                        maxWidth: "80%",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap"
                      },
                      children: [
                        file.name,
                        " (",
                        (file.size / 1024 / 1024).toFixed(2),
                        " MB)"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: (e) => removeFile(idx, e),
                      style: {
                        background: "none",
                        border: "none",
                        color: "#dc2626",
                        cursor: "pointer",
                        fontWeight: 700,
                        fontSize: "14px"
                      },
                      children: "\u2715"
                    }
                  )
                ]
              },
              idx
            ))
          }
        )
      ]
    }
  );
};
FileDropzone.displayName = "FileDropzone";
var Loader = ({
  size = "md",
  color = "#2563eb",
  text,
  className = ""
}) => {
  const getDimension = () => {
    switch (size) {
      case "sm":
        return 16;
      case "lg":
        return 36;
      case "md":
      default:
        return 24;
    }
  };
  const dim = getDimension();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-loader ${className}`,
      style: {
        display: "inline-flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes boost-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` }),
        /* @__PURE__ */ jsx(
          "svg",
          {
            width: dim,
            height: dim,
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: color,
            strokeWidth: "2.5",
            strokeLinecap: "round",
            style: { animation: "boost-spin 0.8s linear infinite" },
            children: /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 1 1-6.219-8.56" })
          }
        ),
        text && /* @__PURE__ */ jsx("span", { style: { fontSize: size === "sm" ? "12px" : "14px", color: "#64748b" }, children: text })
      ]
    }
  );
};
Loader.displayName = "Loader";
var Spinner = ({
  size = "md",
  color = "currentColor",
  strokeWidth = 2.5,
  style,
  ...props
}) => {
  const pixelSize = typeof size === "number" ? size : size === "sm" ? 16 : size === "lg" ? 32 : 24;
  return /* @__PURE__ */ jsxs(
    "svg",
    {
      width: pixelSize,
      height: pixelSize,
      viewBox: "0 0 24 24",
      fill: "none",
      stroke: color,
      strokeWidth,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      style: {
        animation: "boost-spin 0.8s linear infinite",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeOpacity: "0.2" }),
        /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" }),
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes boost-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      ` })
      ]
    }
  );
};
Spinner.displayName = "Spinner";
var ProgressBar = ({
  value,
  label,
  showPercentage = false,
  color = "#2563eb",
  height = 8,
  className = ""
}) => {
  const clamped = Math.min(100, Math.max(0, value));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-progress-bar ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        width: "100%",
        fontFamily: "inherit"
      },
      children: [
        (label || showPercentage) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", fontSize: "12px", fontWeight: 500, color: "#334155" }, children: [
          label && /* @__PURE__ */ jsx("span", { children: label }),
          showPercentage && /* @__PURE__ */ jsxs("span", { children: [
            Math.round(clamped),
            "%"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100%",
              height: `${height}px`,
              backgroundColor: "#e2e8f0",
              borderRadius: "9999px",
              overflow: "hidden"
            },
            children: /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: `${clamped}%`,
                  height: "100%",
                  backgroundColor: color,
                  borderRadius: "9999px",
                  transition: "width 0.3s ease"
                }
              }
            )
          }
        )
      ]
    }
  );
};
ProgressBar.displayName = "ProgressBar";
var Skeleton = ({
  variant = "text",
  width,
  height,
  className = "",
  style
}) => {
  const getRadius = () => {
    switch (variant) {
      case "circular":
        return "50%";
      case "rectangular":
        return "8px";
      case "text":
      default:
        return "4px";
    }
  };
  const getDefaultHeight = () => {
    switch (variant) {
      case "circular":
        return width || 40;
      case "rectangular":
        return 120;
      case "text":
      default:
        return 16;
    }
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        @keyframes boost-shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      ` }),
    /* @__PURE__ */ jsx(
      "div",
      {
        className: `boost-skeleton ${className}`,
        style: {
          width: width ? typeof width === "number" ? `${width}px` : width : "100%",
          height: height ? typeof height === "number" ? `${height}px` : height : `${getDefaultHeight()}px`,
          borderRadius: getRadius(),
          background: "linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%)",
          backgroundSize: "200% 100%",
          animation: "boost-shimmer 1.5s infinite",
          ...style
        }
      }
    )
  ] });
};
Skeleton.displayName = "Skeleton";
var Toast = ({
  title,
  message,
  variant = "info",
  onClose,
  className = "",
  style
}) => {
  const getTheme = () => {
    switch (variant) {
      case "success":
        return { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", icon: "#16a34a" };
      case "warning":
        return { bg: "#fffbeb", border: "#fde68a", text: "#854d0e", icon: "#d97706" };
      case "error":
        return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "#dc2626" };
      case "info":
      default:
        return { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", icon: "#2563eb" };
    }
  };
  const theme = getTheme();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-toast ${className}`,
      role: "alert",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 16px",
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
        fontFamily: "inherit",
        maxWidth: "380px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { marginTop: "2px", display: "flex", color: theme.icon, flexShrink: 0 }, children: [
          variant === "success" && /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
          variant === "error" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
            /* @__PURE__ */ jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
          ] }),
          variant === "warning" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
          ] }),
          variant === "info" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title && /* @__PURE__ */ jsx("div", { style: { fontSize: "14px", fontWeight: 600, color: theme.text, marginBottom: "2px" }, children: title }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", color: theme.text, lineHeight: 1.4 }, children: message })
        ] }),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "aria-label": "Close notification",
            style: {
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: theme.text,
              opacity: 0.6,
              display: "flex",
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
var ToastContext = React.createContext(void 0);
var ToastProvider = ({
  children,
  position = "bottom-right",
  defaultDuration = 4e3
}) => {
  const [toasts, setToasts] = React.useState([]);
  const dismiss = React.useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);
  const addToast = React.useCallback(
    (options) => {
      const id = options.id || `toast-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`;
      const duration = options.duration !== void 0 ? options.duration : defaultDuration;
      const newToast = {
        ...options,
        id
      };
      setToasts((prev) => [...prev, newToast]);
      if (duration > 0) {
        setTimeout(() => {
          dismiss(id);
        }, duration);
      }
      return id;
    },
    [defaultDuration, dismiss]
  );
  const toastMethods = React.useMemo(() => {
    const fn = (options) => addToast(options);
    fn.success = (message, title) => addToast({ message, title, variant: "success" });
    fn.error = (message, title) => addToast({ message, title, variant: "error" });
    fn.warning = (message, title) => addToast({ message, title, variant: "warning" });
    fn.info = (message, title) => addToast({ message, title, variant: "info" });
    fn.dismiss = dismiss;
    return fn;
  }, [addToast, dismiss]);
  const getPositionStyles = () => {
    const base = {
      position: "fixed",
      zIndex: 9999,
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      pointerEvents: "none",
      padding: "16px",
      maxWidth: "420px",
      width: "100%",
      boxSizing: "border-box"
    };
    switch (position) {
      case "top-right":
        return { ...base, top: 0, right: 0 };
      case "top-left":
        return { ...base, top: 0, left: 0 };
      case "top-center":
        return { ...base, top: 0, left: "50%", transform: "translateX(-50%)", alignItems: "center" };
      case "bottom-left":
        return { ...base, bottom: 0, left: 0 };
      case "bottom-center":
        return { ...base, bottom: 0, left: "50%", transform: "translateX(-50%)", alignItems: "center" };
      case "bottom-right":
      default:
        return { ...base, bottom: 0, right: 0 };
    }
  };
  return /* @__PURE__ */ jsxs(ToastContext.Provider, { value: { toast: toastMethods }, children: [
    children,
    toasts.length > 0 && /* @__PURE__ */ jsx("div", { className: "boost-toast-container", style: getPositionStyles(), children: toasts.map((t) => /* @__PURE__ */ jsx("div", { style: { pointerEvents: "auto", width: "100%" }, children: /* @__PURE__ */ jsx(
      Toast,
      {
        id: t.id,
        title: t.title,
        message: t.message,
        variant: t.variant,
        onClose: () => dismiss(t.id)
      }
    ) }, t.id)) })
  ] });
};
var useToast = () => {
  const context = React.useContext(ToastContext);
  if (!context) {
    return {
      toast: Object.assign(
        (options) => {
          if (typeof window !== "undefined") console.log(`[Toast] ${options.message}`);
          return "";
        },
        {
          success: (msg) => {
            if (typeof window !== "undefined") console.log(`[Toast Success] ${msg}`);
            return "";
          },
          error: (msg) => {
            if (typeof window !== "undefined") console.error(`[Toast Error] ${msg}`);
            return "";
          },
          warning: (msg) => {
            if (typeof window !== "undefined") console.warn(`[Toast Warning] ${msg}`);
            return "";
          },
          info: (msg) => {
            if (typeof window !== "undefined") console.info(`[Toast Info] ${msg}`);
            return "";
          },
          dismiss: () => {
          }
        }
      )
    };
  }
  return context;
};
Toast.displayName = "Toast";
var Alert = ({
  title,
  children,
  variant = "info",
  icon,
  onClose,
  className = ""
}) => {
  const getTheme = () => {
    switch (variant) {
      case "success":
        return { bg: "#f0fdf4", border: "#86efac", text: "#15803d", iconColor: "#16a34a" };
      case "warning":
        return { bg: "#fffbeb", border: "#fde047", text: "#a16207", iconColor: "#ca8a04" };
      case "destructive":
        return { bg: "#fef2f2", border: "#fca5a5", text: "#b91c1c", iconColor: "#dc2626" };
      case "info":
      default:
        return { bg: "#eff6ff", border: "#93c5fd", text: "#1d4ed8", iconColor: "#2563eb" };
    }
  };
  const theme = getTheme();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-alert boost-alert-${variant} ${className}`,
      role: "alert",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: "8px",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { marginTop: "2px", display: "flex", color: theme.iconColor }, children: icon ? icon : /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title && /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 4px 0", fontSize: "14px", fontWeight: 600, color: theme.text }, children: title }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", color: theme.text, lineHeight: 1.5 }, children })
        ] }),
        onClose && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onClose,
            "aria-label": "Dismiss alert",
            style: {
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: theme.text,
              opacity: 0.6,
              display: "flex"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
Alert.displayName = "Alert";
var Snackbar = ({
  message,
  actionText,
  onAction,
  isOpen,
  onClose,
  duration = 4e3,
  className = ""
}) => {
  React.useEffect(() => {
    if (!isOpen || !onClose) return;
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [isOpen, onClose, duration]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-snackbar ${className}`,
      role: "status",
      style: {
        position: "fixed",
        bottom: "24px",
        left: "50%",
        transform: "translateX(-50%)",
        backgroundColor: "#1e293b",
        color: "#f8fafc",
        padding: "10px 18px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.3)",
        display: "inline-flex",
        alignItems: "center",
        gap: "16px",
        fontSize: "13px",
        fontWeight: 500,
        zIndex: 1e3,
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: message }),
        actionText && onAction && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            style: {
              background: "none",
              border: "none",
              color: "#60a5fa",
              fontWeight: 700,
              fontSize: "13px",
              cursor: "pointer",
              padding: 0
            },
            children: actionText
          }
        )
      ]
    }
  );
};
Snackbar.displayName = "Snackbar";
var EmptyState = ({
  title,
  description,
  actionText,
  onAction,
  icon,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-empty-state ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "48px 24px",
        textAlign: "center",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "#f1f5f9",
              color: "#64748b",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "16px"
            },
            children: icon ? icon : /* @__PURE__ */ jsxs("svg", { width: "32", height: "32", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", children: [
              /* @__PURE__ */ jsx("rect", { x: "2", y: "3", width: "20", height: "14", rx: "2", ry: "2" }),
              /* @__PURE__ */ jsx("line", { x1: "8", y1: "21", x2: "16", y2: "21" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12", y2: "21" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("h3", { style: { margin: "0 0 6px 0", fontSize: "18px", fontWeight: 600, color: "#0f172a" }, children: title }),
        description && /* @__PURE__ */ jsx("p", { style: { margin: "0 0 20px 0", fontSize: "14px", color: "#64748b", maxWidth: "360px", lineHeight: 1.5 }, children: description }),
        actionText && onAction && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            style: {
              backgroundColor: "#2563eb",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "9px 18px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer"
            },
            children: actionText
          }
        )
      ]
    }
  );
};
EmptyState.displayName = "EmptyState";
var ErrorState = ({
  title = "Something went wrong",
  message = "An unexpected error occurred while loading this content. Please try again.",
  onRetry,
  retryText = "Try Again",
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-error-state ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 20px",
        textAlign: "center",
        fontFamily: "inherit",
        backgroundColor: "#fef2f2",
        border: "1px solid #fecaca",
        borderRadius: "8px"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "#fee2e2",
              color: "#dc2626",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "12px"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 6px 0", fontSize: "16px", fontWeight: 600, color: "#991b1b" }, children: title }),
        /* @__PURE__ */ jsx("p", { style: { margin: "0 0 16px 0", fontSize: "13px", color: "#b91c1c", maxWidth: "380px", lineHeight: 1.5 }, children: message }),
        onRetry && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRetry,
            style: {
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "6px",
              padding: "8px 16px",
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer"
            },
            children: retryText
          }
        )
      ]
    }
  );
};
ErrorState.displayName = "ErrorState";
var SuccessMessage = ({
  title,
  message,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-success-message ${className}`,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: "#f0fdf4",
        border: "1px solid #86efac",
        borderRadius: "8px",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { marginTop: "2px", display: "flex", color: "#16a34a" }, children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx("polyline", { points: "9 12 11 14 15 10" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1 }, children: [
          title && /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 4px 0", fontSize: "14px", fontWeight: 600, color: "#15803d" }, children: title }),
          /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", color: "#166534", lineHeight: 1.5 }, children: message })
        ] })
      ]
    }
  );
};
SuccessMessage.displayName = "SuccessMessage";
var Card = React.forwardRef(
  ({ hoverable = false, variant = "elevated", className = "", style, children, ...props }, ref) => {
    const isGlass = variant === "glass";
    const isOutlined = variant === "outlined";
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `boost-card ${hoverable ? "boost-card-hoverable" : ""} ${className}`,
        style: {
          backgroundColor: isGlass ? "var(--boost-glass-bg, rgba(255, 255, 255, 0.8))" : "var(--boost-surface, #ffffff)",
          backdropFilter: isGlass ? "blur(12px)" : void 0,
          WebkitBackdropFilter: isGlass ? "blur(12px)" : void 0,
          border: `1px solid ${isGlass ? "var(--boost-glass-border, rgba(226, 232, 240, 0.8))" : "var(--boost-border, #e2e8f0)"}`,
          borderRadius: "var(--boost-radius, 16px)",
          boxShadow: isOutlined ? "none" : "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
          overflow: "hidden",
          transition: hoverable ? "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1)" : "none",
          fontFamily: "inherit",
          width: "100%",
          boxSizing: "border-box",
          ...style
        },
        ...props,
        children
      }
    );
  }
);
Card.displayName = "Card";
var CardHeader = ({ className = "", style, children, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    style: {
      padding: "clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)",
      borderBottom: "1px solid var(--boost-border, #f1f5f9)",
      boxSizing: "border-box",
      ...style
    },
    className,
    ...props,
    children
  }
);
var CardTitle = ({ className = "", style, children, ...props }) => /* @__PURE__ */ jsx(
  "h3",
  {
    style: {
      margin: 0,
      fontSize: "clamp(16px, 1.8vw, 19px)",
      fontWeight: 700,
      color: "var(--boost-text, #0f172a)",
      letterSpacing: "-0.015em",
      ...style
    },
    className,
    ...props,
    children
  }
);
var CardDescription = ({ className = "", style, children, ...props }) => /* @__PURE__ */ jsx(
  "p",
  {
    style: {
      margin: "4px 0 0 0",
      fontSize: "13px",
      color: "var(--boost-text-muted, #64748b)",
      lineHeight: 1.55,
      ...style
    },
    className,
    ...props,
    children
  }
);
var CardContent = ({ className = "", style, children, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    style: {
      padding: "clamp(14px, 2.5vw, 24px) clamp(16px, 3vw, 24px)",
      boxSizing: "border-box",
      color: "var(--boost-text, #0f172a)",
      ...style
    },
    className,
    ...props,
    children
  }
);
var CardFooter = ({ className = "", style, children, ...props }) => /* @__PURE__ */ jsx(
  "div",
  {
    style: {
      padding: "clamp(12px, 2vw, 16px) clamp(16px, 3vw, 24px)",
      borderTop: "1px solid var(--boost-border, #f1f5f9)",
      backgroundColor: "var(--boost-surface, #f8fafc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "10px",
      boxSizing: "border-box",
      ...style
    },
    className,
    ...props,
    children
  }
);
CardHeader.displayName = "CardHeader";
CardTitle.displayName = "CardTitle";
CardDescription.displayName = "CardDescription";
CardContent.displayName = "CardContent";
CardFooter.displayName = "CardFooter";
var Image = ({
  src,
  alt = "",
  fallbackSrc,
  aspectRatio = "auto",
  objectFit = "cover",
  className = "",
  style,
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);
  const getAspect = () => {
    if (typeof aspectRatio === "string" && aspectRatio.includes("/")) {
      return aspectRatio;
    }
    switch (aspectRatio) {
      case "square":
        return "1 / 1";
      case "video":
        return "16 / 9";
      case "portrait":
        return "3 / 4";
      case "auto":
      default:
        return "auto";
    }
  };
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        overflow: "hidden",
        position: "relative",
        aspectRatio: getAspect(),
        minHeight: "160px",
        backgroundColor: "#1e293b",
        borderRadius: "8px"
      },
      children: /* @__PURE__ */ jsx(
        "img",
        {
          src: imageSrc,
          alt,
          onError: () => setHasError(true),
          className: `boost-image ${className}`,
          style: {
            width: "100%",
            height: "100%",
            objectFit,
            display: "block",
            ...style
          },
          ...props
        }
      )
    }
  );
};
Image.displayName = "Image";
var Avatar = ({
  src,
  name,
  size = "md",
  status,
  className = ""
}) => {
  const [imgError, setImgError] = React.useState(false);
  const getSize = () => {
    switch (size) {
      case "sm":
        return { dim: 32, font: 12, dot: 8 };
      case "lg":
        return { dim: 52, font: 18, dot: 12 };
      case "xl":
        return { dim: 72, font: 24, dot: 16 };
      case "md":
      default:
        return { dim: 40, font: 14, dot: 10 };
    }
  };
  const getStatusColor = () => {
    switch (status) {
      case "online":
        return "#16a34a";
      case "offline":
        return "#94a3b8";
      case "busy":
        return "#dc2626";
      case "away":
        return "#eab308";
      default:
        return void 0;
    }
  };
  const getInitials2 = (str) => {
    if (!str) return "U";
    const parts = str.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2 && parts[0] && parts[1]) {
      return `${parts[0][0] || ""}${parts[1][0] || ""}`.toUpperCase();
    }
    return str.slice(0, 2).toUpperCase();
  };
  const s = getSize();
  const statusColor = getStatusColor();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-avatar ${className}`,
      style: {
        position: "relative",
        display: "inline-flex",
        width: `${s.dim}px`,
        height: `${s.dim}px`,
        borderRadius: "50%",
        backgroundColor: "#e2e8f0",
        color: "#334155",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: `${s.font}px`,
        userSelect: "none",
        flexShrink: 0
      },
      children: [
        src && !imgError ? /* @__PURE__ */ jsx(
          "img",
          {
            src,
            alt: name || "Avatar",
            onError: () => setImgError(true),
            style: {
              width: "100%",
              height: "100%",
              borderRadius: "50%",
              objectFit: "cover"
            }
          }
        ) : /* @__PURE__ */ jsx("span", { children: getInitials2(name) }),
        statusColor && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              position: "absolute",
              bottom: "0",
              right: "0",
              width: `${s.dot}px`,
              height: `${s.dot}px`,
              borderRadius: "50%",
              backgroundColor: statusColor,
              border: "2px solid #ffffff"
            }
          }
        )
      ]
    }
  );
};
var AvatarGroup = ({
  children,
  max = 4,
  spacing = -10,
  size,
  className = "",
  style,
  ...props
}) => {
  const childrenArray = React.Children.toArray(children);
  const visibleAvatars = childrenArray.slice(0, max);
  const excess = childrenArray.length - max;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-avatar-group ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        flexDirection: "row",
        ...style
      },
      ...props,
      children: [
        visibleAvatars.map((child, index) => /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              marginLeft: index === 0 ? 0 : `${spacing}px`,
              border: "2px solid #ffffff",
              borderRadius: "50%",
              display: "inline-flex",
              zIndex: visibleAvatars.length - index
            },
            children: React.isValidElement(child) && size ? React.cloneElement(child, { size }) : child
          },
          index
        )),
        excess > 0 && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              marginLeft: `${spacing}px`,
              border: "2px solid #ffffff",
              borderRadius: "50%",
              backgroundColor: "var(--boost-surface, #f1f5f9)",
              color: "var(--boost-text, #0f172a)",
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              fontSize: "12px",
              width: size === "sm" ? "32px" : size === "lg" ? "52px" : "40px",
              height: size === "sm" ? "32px" : size === "lg" ? "52px" : "40px",
              zIndex: 0,
              userSelect: "none"
            },
            children: [
              "+",
              excess
            ]
          }
        )
      ]
    }
  );
};
Avatar.displayName = "Avatar";
AvatarGroup.displayName = "AvatarGroup";
var Badge = ({
  children,
  variant = "default",
  className = "",
  style
}) => {
  const getTheme = () => {
    switch (variant) {
      case "secondary":
        return { bg: "var(--boost-surface, #f1f5f9)", color: "var(--boost-text, #334155)", border: "1px solid var(--boost-border, #e2e8f0)" };
      case "outline":
        return { bg: "transparent", color: "var(--boost-text, #0f172a)", border: "1px solid var(--boost-border, #cbd5e1)" };
      case "success":
        return { bg: "rgba(34, 197, 94, 0.12)", color: "#16a34a", border: "1px solid rgba(34, 197, 94, 0.25)" };
      case "destructive":
        return { bg: "rgba(239, 68, 68, 0.12)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.25)" };
      case "warning":
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.25)" };
      case "default":
      default:
        return { bg: "var(--boost-primary, #2563eb)", color: "#ffffff", border: "1px solid transparent" };
    }
  };
  const theme = getTheme();
  return /* @__PURE__ */ jsx(
    "span",
    {
      className: `boost-badge boost-badge-${variant} ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        padding: "2px 8px",
        fontSize: "11px",
        fontWeight: 600,
        borderRadius: "9999px",
        backgroundColor: theme.bg,
        color: theme.color,
        border: theme.border,
        letterSpacing: "0.02em",
        fontFamily: "inherit",
        lineHeight: 1.4,
        ...style
      },
      children
    }
  );
};
Badge.displayName = "Badge";
var Tag = ({
  label,
  onRemove,
  color = "#e2e8f0",
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `boost-tag ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "3px 10px",
        backgroundColor: color,
        borderRadius: "4px",
        fontSize: "12px",
        fontWeight: 500,
        color: "#0f172a",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: label }),
        onRemove && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            "aria-label": `Remove ${label}`,
            style: {
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "#64748b",
              display: "inline-flex",
              alignItems: "center"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
Tag.displayName = "Tag";
var Tooltip = ({
  content,
  children,
  position = "top",
  className = ""
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const getPositionStyles = () => {
    switch (position) {
      case "bottom":
        return {
          top: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          right: "calc(100% + 6px)",
          top: "50%",
          transform: "translateY(-50%)"
        };
      case "right":
        return {
          left: "calc(100% + 6px)",
          top: "50%",
          transform: "translateY(-50%)"
        };
      case "top":
      default:
        return {
          bottom: "calc(100% + 6px)",
          left: "50%",
          transform: "translateX(-50%)"
        };
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-tooltip-wrapper ${className}`,
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false),
      onFocus: () => setIsVisible(true),
      onBlur: () => setIsVisible(false),
      style: {
        position: "relative",
        display: "inline-flex"
      },
      children: [
        children,
        isVisible && /* @__PURE__ */ jsx(
          "div",
          {
            role: "tooltip",
            style: {
              position: "absolute",
              zIndex: 1e3,
              backgroundColor: "#0f172a",
              color: "#ffffff",
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "11px",
              fontWeight: 500,
              whiteSpace: "nowrap",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.2)",
              pointerEvents: "none",
              fontFamily: "inherit",
              ...getPositionStyles()
            },
            children: content
          }
        )
      ]
    }
  );
};
Tooltip.displayName = "Tooltip";
var Chip = ({
  label,
  selected = false,
  onClick,
  onDelete,
  avatar,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-chip ${className}`,
      onClick,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: avatar ? "3px 10px 3px 4px" : "4px 12px",
        borderRadius: "9999px",
        backgroundColor: selected ? "#2563eb" : "#f1f5f9",
        color: selected ? "#ffffff" : "#1e293b",
        fontSize: "13px",
        fontWeight: 500,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "all 0.15s ease",
        fontFamily: "inherit"
      },
      children: [
        avatar && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", borderRadius: "50%", overflow: "hidden" }, children: avatar }),
        /* @__PURE__ */ jsx("span", { children: label }),
        onDelete && /* @__PURE__ */ jsx(
          "span",
          {
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
            style: {
              display: "inline-flex",
              cursor: "pointer",
              opacity: 0.7,
              marginLeft: "2px"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
Chip.displayName = "Chip";
var Divider = ({
  orientation = "horizontal",
  label,
  labelPosition = "center",
  className = "",
  style,
  ...props
}) => {
  if (orientation === "vertical") {
    return /* @__PURE__ */ jsx(
      "div",
      {
        role: "separator",
        "aria-orientation": "vertical",
        className: `boost-divider boost-divider-vertical ${className}`,
        style: {
          display: "inline-block",
          width: "1px",
          height: "100%",
          minHeight: "18px",
          backgroundColor: "var(--boost-border, #e2e8f0)",
          margin: "0 8px",
          verticalAlign: "middle",
          ...style
        },
        ...props
      }
    );
  }
  if (!label) {
    return /* @__PURE__ */ jsx(
      "hr",
      {
        role: "separator",
        "aria-orientation": "horizontal",
        className: `boost-divider boost-divider-horizontal ${className}`,
        style: {
          width: "100%",
          height: "1px",
          backgroundColor: "var(--boost-border, #e2e8f0)",
          border: "none",
          margin: "16px 0",
          ...style
        },
        ...props
      }
    );
  }
  const getFlexDistribution = () => {
    switch (labelPosition) {
      case "left":
        return { before: "0.1", after: "1" };
      case "right":
        return { before: "1", after: "0.1" };
      case "center":
      default:
        return { before: "1", after: "1" };
    }
  };
  const distribution = getFlexDistribution();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "separator",
      "aria-orientation": "horizontal",
      className: `boost-divider boost-divider-with-label ${className}`,
      style: {
        display: "flex",
        alignItems: "center",
        width: "100%",
        margin: "16px 0",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flex: distribution.before,
              height: "1px",
              backgroundColor: "var(--boost-border, #e2e8f0)"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              padding: "0 12px",
              fontSize: "12px",
              fontWeight: 500,
              color: "var(--boost-text-muted, #64748b)",
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              whiteSpace: "nowrap"
            },
            children: label
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flex: distribution.after,
              height: "1px",
              backgroundColor: "var(--boost-border, #e2e8f0)"
            }
          }
        )
      ]
    }
  );
};
Divider.displayName = "Divider";
var Accordion = ({
  items,
  allowMultiple = false,
  defaultExpanded = [],
  className = ""
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const toggleItem = (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded(allowMultiple ? [...expanded, id] : [id]);
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-accordion ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        border: "1px solid #e2e8f0",
        borderRadius: "8px",
        overflow: "hidden",
        fontFamily: "inherit"
      },
      children: items.map((item, idx) => {
        const isOpen = expanded.includes(item.id);
        const isLast = idx === items.length - 1;
        return /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              borderBottom: isLast ? "none" : "1px solid #e2e8f0"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  disabled: item.disabled,
                  onClick: () => toggleItem(item.id),
                  "aria-expanded": isOpen,
                  style: {
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    backgroundColor: isOpen ? "#f8fafc" : "#ffffff",
                    border: "none",
                    textAlign: "left",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    opacity: item.disabled ? 0.5 : 1,
                    fontFamily: "inherit",
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "#0f172a",
                    transition: "background-color 0.15s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: item.title }),
                    /* @__PURE__ */ jsx(
                      "svg",
                      {
                        width: "16",
                        height: "16",
                        viewBox: "0 0 24 24",
                        fill: "none",
                        stroke: "currentColor",
                        strokeWidth: "2",
                        style: {
                          transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                          transition: "transform 0.2s ease",
                          color: "#64748b"
                        },
                        children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                      }
                    )
                  ]
                }
              ),
              isOpen && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    padding: "14px 18px",
                    backgroundColor: "#ffffff",
                    fontSize: "13px",
                    color: "#334155",
                    lineHeight: 1.6
                  },
                  children: item.content
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
};
Accordion.displayName = "Accordion";
var Carousel = ({
  items,
  autoPlay = false,
  interval = 4e3,
  showIndicators = true,
  className = "",
  ...props
}) => {
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const slidesList = Array.isArray(items) ? items : Array.isArray(props.slides) ? props.slides.map((s) => s?.content || s) : [];
  const [touchStart, setTouchStart] = React.useState(null);
  const [touchEnd, setTouchEnd] = React.useState(null);
  const prevSlide = () => {
    setCurrentIdx((prev) => prev === 0 ? slidesList.length - 1 : prev - 1);
  };
  const nextSlide = () => {
    setCurrentIdx((prev) => prev === slidesList.length - 1 ? 0 : prev + 1);
  };
  const handleTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const handleTouchMove = (e) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;
    if (isLeftSwipe) {
      nextSlide();
    } else if (isRightSwipe) {
      prevSlide();
    }
  };
  React.useEffect(() => {
    if (!autoPlay || slidesList.length <= 1) return;
    const timer = setInterval(nextSlide, interval);
    return () => clearInterval(timer);
  }, [autoPlay, interval, slidesList.length]);
  if (slidesList.length === 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-carousel ${className}`,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
      style: {
        position: "relative",
        width: "100%",
        overflow: "hidden",
        borderRadius: "var(--boost-radius, 16px)",
        backgroundColor: "#0f172a",
        boxShadow: "var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.1))",
        touchAction: "pan-y",
        userSelect: "none"
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              width: `${slidesList.length * 100}%`,
              transform: `translateX(-${currentIdx * 100 / slidesList.length}%)`,
              transition: "transform 0.45s cubic-bezier(0.16, 1, 0.3, 1)"
            },
            children: slidesList.map((slide, idx) => /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: `${100 / slidesList.length}%`,
                  flexShrink: 0
                },
                children: slide
              },
              idx
            ))
          }
        ),
        slidesList.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: prevSlide,
              "aria-label": "Previous slide",
              style: {
                position: "absolute",
                left: "clamp(8px, 2vw, 16px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(32px, 4vw, 42px)",
                height: "clamp(32px, 4vw, 42px)",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#0f172a",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                zIndex: 2
              },
              children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) })
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: nextSlide,
              "aria-label": "Next slide",
              style: {
                position: "absolute",
                right: "clamp(8px, 2vw, 16px)",
                top: "50%",
                transform: "translateY(-50%)",
                width: "clamp(32px, 4vw, 42px)",
                height: "clamp(32px, 4vw, 42px)",
                borderRadius: "50%",
                backgroundColor: "rgba(255, 255, 255, 0.75)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                color: "#0f172a",
                border: "1px solid rgba(255, 255, 255, 0.6)",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                transition: "all 0.2s ease",
                zIndex: 2
              },
              children: /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) })
            }
          ),
          showIndicators && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "absolute",
                bottom: "14px",
                left: "50%",
                transform: "translateX(-50%)",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "4px 10px",
                borderRadius: "999px",
                backgroundColor: "rgba(0, 0, 0, 0.35)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                zIndex: 2
              },
              children: slidesList.map((_, idx) => /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setCurrentIdx(idx),
                  "aria-label": `Go to slide ${idx + 1}`,
                  style: {
                    border: "none",
                    padding: 0,
                    width: idx === currentIdx ? "22px" : "7px",
                    height: "7px",
                    borderRadius: "4px",
                    backgroundColor: idx === currentIdx ? "#ffffff" : "rgba(255, 255, 255, 0.45)",
                    cursor: "pointer",
                    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)"
                  }
                },
                idx
              ))
            }
          )
        ] })
      ]
    }
  );
};
Carousel.displayName = "Carousel";
var Portal = ({ children, container }) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => {
    setMounted(true);
  }, []);
  if (!mounted || typeof document === "undefined") {
    return null;
  }
  const target = container || document.body;
  return ReactDOM.createPortal(children, target);
};
Portal.displayName = "Portal";
var Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className = ""
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const getWidth = () => {
    switch (size) {
      case "sm":
        return "400px";
      case "lg":
        return "680px";
      case "xl":
        return "840px";
      case "md":
      default:
        return "520px";
    }
  };
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      className: `boost-modal-backdrop ${className}`,
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(8px)",
        WebkitBackdropFilter: "blur(8px)",
        zIndex: 1e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(12px, 3vw, 24px)",
        fontFamily: "inherit",
        boxSizing: "border-box"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            width: "100%",
            maxWidth: getWidth(),
            backgroundColor: "var(--boost-surface, #ffffff)",
            borderRadius: "var(--boost-radius, 18px)",
            border: "1px solid var(--boost-border, #e2e8f0)",
            boxShadow: "var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))",
            display: "flex",
            flexDirection: "column",
            maxHeight: "min(90vh, 850px)",
            overflow: "hidden",
            animation: "boost-modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)"
          },
          children: [
            /* @__PURE__ */ jsx("style", { children: `
            @keyframes boost-modal-scale {
              from { opacity: 0; transform: scale(0.95) translateY(8px); }
              to { opacity: 1; transform: scale(1) translateY(0); }
            }
          ` }),
            (title || description) && /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  padding: "clamp(16px, 3vw, 20px) clamp(18px, 4vw, 28px)",
                  borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  gap: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxs("div", { children: [
                    title && /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "clamp(17px, 2.5vw, 20px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.01em" }, children: title }),
                    description && /* @__PURE__ */ jsx("p", { style: { margin: "4px 0 0 0", fontSize: "13px", color: "var(--boost-muted, #64748b)", lineHeight: 1.4 }, children: description })
                  ] }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "aria-label": "Close modal",
                      style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "var(--boost-muted, #94a3b8)",
                        padding: "6px",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.15s ease"
                      },
                      children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                      ] })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { padding: "clamp(18px, 3.5vw, 28px)", overflowY: "auto", flex: 1, color: "var(--boost-text, #334155)", fontSize: "14px", lineHeight: 1.6 }, children }),
            footer && /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  padding: "clamp(12px, 2.5vw, 16px) clamp(18px, 4vw, 28px)",
                  borderTop: "1px solid var(--boost-border, #e2e8f0)",
                  backgroundColor: "var(--boost-bg, #f8fafc)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  gap: "10px"
                },
                children: footer
              }
            )
          ]
        }
      )
    }
  ) });
};
var Dialog = Modal;
Modal.displayName = "Modal";
Dialog.displayName = "Dialog";
var Drawer = ({
  isOpen,
  onClose,
  title,
  placement = "right",
  size = "380px",
  children,
  className = ""
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  if (!isOpen) return null;
  const getPositionStyles = () => {
    switch (placement) {
      case "left":
        return { top: 0, bottom: 0, left: 0, width: size, maxWidth: "100vw" };
      case "top":
        return { top: 0, left: 0, right: 0, height: size, maxHeight: "100vh" };
      case "bottom":
        return { bottom: 0, left: 0, right: 0, height: size, maxHeight: "100vh" };
      case "right":
      default:
        return { top: 0, bottom: 0, right: 0, width: size, maxWidth: "100vw" };
    }
  };
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      className: `boost-drawer-backdrop ${className}`,
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(3px)",
        zIndex: 1e3,
        fontFamily: "inherit"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            position: "absolute",
            backgroundColor: "#ffffff",
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            ...getPositionStyles()
          },
          children: [
            title && /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  padding: "16px 20px",
                  borderBottom: "1px solid #e2e8f0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                },
                children: [
                  /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 600, color: "#0f172a" }, children: title }),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClose,
                      "aria-label": "Close drawer",
                      style: {
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                        color: "#64748b",
                        padding: "4px",
                        display: "flex"
                      },
                      children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                      ] })
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { padding: "20px", overflowY: "auto", flex: 1 }, children })
          ]
        }
      )
    }
  ) });
};
Drawer.displayName = "Drawer";
var BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  maxHeight = "80vh",
  className = ""
}) => {
  React.useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isOpen]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      className: `boost-bottom-sheet-backdrop ${className}`,
      onClick: onClose,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(2px)",
        zIndex: 1e3,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        fontFamily: "inherit"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          onClick: (e) => e.stopPropagation(),
          style: {
            width: "100%",
            maxWidth: "600px",
            maxHeight,
            backgroundColor: "#ffffff",
            borderRadius: "16px 16px 0 0",
            boxShadow: "0 -10px 25px rgba(0, 0, 0, 0.15)",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
            animation: "boost-sheet-up 0.25s ease-out"
          },
          children: [
            /* @__PURE__ */ jsx("style", { children: `
          @keyframes boost-sheet-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
        ` }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", padding: "10px 0 4px" }, children: /* @__PURE__ */ jsx("div", { style: { width: "36px", height: "4px", backgroundColor: "#cbd5e1", borderRadius: "9999px" } }) }),
            title && /* @__PURE__ */ jsxs("div", { style: { padding: "8px 20px 12px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
              /* @__PURE__ */ jsx("h3", { style: { margin: 0, fontSize: "16px", fontWeight: 600, color: "#0f172a" }, children: title }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onClose,
                  style: { background: "none", border: "none", color: "#94a3b8", cursor: "pointer", padding: "2px" },
                  children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] })
                }
              )
            ] }),
            /* @__PURE__ */ jsx("div", { style: { padding: "20px", overflowY: "auto" }, children })
          ]
        }
      )
    }
  );
};
BottomSheet.displayName = "BottomSheet";
var Popover = ({
  trigger,
  content,
  placement = "bottom-left",
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const popoverRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const getPositionStyles = () => {
    switch (placement) {
      case "bottom-right":
        return { top: "calc(100% + 6px)", right: 0 };
      case "top-left":
        return { bottom: "calc(100% + 6px)", left: 0 };
      case "top-right":
        return { bottom: "calc(100% + 6px)", right: 0 };
      case "bottom-left":
      default:
        return { top: "calc(100% + 6px)", left: 0 };
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: popoverRef,
      className: `boost-popover-wrapper ${className}`,
      style: { position: "relative", display: "inline-flex" },
      children: [
        /* @__PURE__ */ jsx("div", { onClick: () => setIsOpen((prev) => !prev), children: trigger }),
        isOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              zIndex: 500,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              padding: "12px",
              minWidth: "200px",
              fontFamily: "inherit",
              ...getPositionStyles()
            },
            children: content
          }
        )
      ]
    }
  );
};
Popover.displayName = "Popover";
var ConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "primary",
  isLoading = false
}) => {
  return /* @__PURE__ */ jsx(
    Modal,
    {
      isOpen,
      onClose,
      title,
      size: "sm",
      footer: /* @__PURE__ */ jsxs(Fragment, { children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: onClose, disabled: isLoading, children: cancelText }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: variant === "danger" ? "destructive" : "primary",
            size: "sm",
            onClick: onConfirm,
            isLoading,
            children: confirmText
          }
        )
      ] }),
      children: /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "14px", color: "#475569", lineHeight: 1.5 }, children: message })
    }
  );
};
ConfirmationDialog.displayName = "ConfirmationDialog";
var CommandPalette = ({
  isOpen,
  onClose,
  items,
  placeholder = "Type a command or search...",
  emptyText = "No matching commands found.",
  className = ""
}) => {
  const [query, setQuery] = React.useState("");
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const inputRef = React.useRef(null);
  React.useEffect(() => {
    if (isOpen) {
      setQuery("");
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);
  const filteredItems = items.filter(
    (item) => item.label.toLowerCase().includes(query.toLowerCase()) || item.description && item.description.toLowerCase().includes(query.toLowerCase()) || item.group && item.group.toLowerCase().includes(query.toLowerCase())
  );
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % (filteredItems.length || 1));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex(
          (prev) => prev === 0 ? Math.max(0, filteredItems.length - 1) : prev - 1
        );
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredItems[selectedIndex]) {
          filteredItems[selectedIndex].onSelect();
          onClose();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, filteredItems, selectedIndex, onClose]);
  if (!isOpen) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "center",
        paddingTop: "clamp(24px, 8vh, 80px)",
        paddingLeft: "clamp(8px, 3vw, 16px)",
        paddingRight: "clamp(8px, 3vw, 16px)",
        zIndex: 9999,
        boxSizing: "border-box"
      },
      onClick: onClose,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          className: `boost-command-palette ${className}`,
          style: {
            width: "100%",
            maxWidth: "580px",
            backgroundColor: "var(--boost-surface, #ffffff)",
            borderRadius: "var(--boost-radius, 16px)",
            boxShadow: "var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))",
            border: "1px solid var(--boost-border, #e2e8f0)",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box"
          },
          onClick: (e) => e.stopPropagation(),
          children: [
            /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  padding: "16px 20px",
                  borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                  gap: "12px"
                },
                children: [
                  /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      width: "20",
                      height: "20",
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "var(--boost-text-muted, #64748b)",
                      strokeWidth: "2",
                      children: [
                        /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                        /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      ref: inputRef,
                      type: "text",
                      value: query,
                      onChange: (e) => {
                        setQuery(e.target.value);
                        setSelectedIndex(0);
                      },
                      placeholder,
                      style: {
                        border: "none",
                        outline: "none",
                        width: "100%",
                        fontSize: "16px",
                        backgroundColor: "transparent",
                        color: "var(--boost-text, #0f172a)"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "kbd",
                    {
                      style: {
                        fontSize: "11px",
                        fontWeight: 600,
                        padding: "3px 6px",
                        borderRadius: "4px",
                        backgroundColor: "var(--boost-surface, #f1f5f9)",
                        border: "1px solid var(--boost-border, #cbd5e1)",
                        color: "var(--boost-text-muted, #64748b)"
                      },
                      children: "ESC"
                    }
                  )
                ]
              }
            ),
            /* @__PURE__ */ jsx("div", { style: { maxHeight: "340px", overflowY: "auto", padding: "8px" }, children: filteredItems.length === 0 ? /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  padding: "32px 16px",
                  textAlign: "center",
                  color: "var(--boost-text-muted, #64748b)",
                  fontSize: "14px"
                },
                children: emptyText
              }
            ) : filteredItems.map((item, idx) => {
              const isSelected = idx === selectedIndex;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => {
                    item.onSelect();
                    onClose();
                  },
                  onMouseEnter: () => setSelectedIndex(idx),
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 14px",
                    borderRadius: "8px",
                    backgroundColor: isSelected ? "rgba(37, 99, 235, 0.08)" : "transparent",
                    cursor: "pointer",
                    transition: "background-color 0.1s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                      item.icon && /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            color: isSelected ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
                            display: "flex",
                            alignItems: "center"
                          },
                          children: item.icon
                        }
                      ),
                      /* @__PURE__ */ jsxs("div", { children: [
                        /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              fontSize: "14px",
                              fontWeight: 500,
                              color: isSelected ? "var(--boost-primary, #2563eb)" : "var(--boost-text, #0f172a)"
                            },
                            children: item.label
                          }
                        ),
                        item.description && /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              fontSize: "12px",
                              color: "var(--boost-text-muted, #64748b)"
                            },
                            children: item.description
                          }
                        )
                      ] })
                    ] }),
                    item.shortcut && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "4px" }, children: item.shortcut.map((key, kIdx) => /* @__PURE__ */ jsx(
                      "kbd",
                      {
                        style: {
                          fontSize: "10px",
                          fontWeight: 700,
                          padding: "2px 5px",
                          borderRadius: "4px",
                          backgroundColor: "var(--boost-surface, #f1f5f9)",
                          border: "1px solid var(--boost-border, #cbd5e1)",
                          color: "var(--boost-text-muted, #64748b)"
                        },
                        children: key
                      },
                      kIdx
                    )) })
                  ]
                },
                item.id
              );
            }) })
          ]
        }
      )
    }
  );
};
CommandPalette.displayName = "CommandPalette";
var Box = React.forwardRef(
  ({
    as = "div",
    children,
    p,
    px,
    py,
    pt,
    pb,
    pl,
    pr,
    m,
    mx,
    my,
    mt,
    mb,
    ml,
    mr,
    bg,
    color,
    border,
    borderRadius,
    width,
    height,
    maxWidth,
    minHeight,
    display,
    position,
    className = "",
    style,
    ...props
  }, ref) => {
    const Component = as;
    const computedStyle = {
      ...display && { display },
      ...position && { position },
      ...width && { width: typeof width === "number" ? `${width}px` : width },
      ...height && { height: typeof height === "number" ? `${height}px` : height },
      ...maxWidth && { maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth },
      ...minHeight && { minHeight: typeof minHeight === "number" ? `${minHeight}px` : minHeight },
      ...bg && { backgroundColor: bg },
      ...color && { color },
      ...border && { border },
      ...borderRadius && {
        borderRadius: typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius
      },
      ...p !== void 0 && { padding: typeof p === "number" ? `${p}px` : p },
      ...px !== void 0 && {
        paddingLeft: typeof px === "number" ? `${px}px` : px,
        paddingRight: typeof px === "number" ? `${px}px` : px
      },
      ...py !== void 0 && {
        paddingTop: typeof py === "number" ? `${py}px` : py,
        paddingBottom: typeof py === "number" ? `${py}px` : py
      },
      ...pt !== void 0 && { paddingTop: typeof pt === "number" ? `${pt}px` : pt },
      ...pb !== void 0 && { paddingBottom: typeof pb === "number" ? `${pb}px` : pb },
      ...pl !== void 0 && { paddingLeft: typeof pl === "number" ? `${pl}px` : pl },
      ...pr !== void 0 && { paddingRight: typeof pr === "number" ? `${pr}px` : pr },
      ...m !== void 0 && { margin: typeof m === "number" ? `${m}px` : m },
      ...mx !== void 0 && {
        marginLeft: typeof mx === "number" ? `${mx}px` : mx,
        marginRight: typeof mx === "number" ? `${mx}px` : mx
      },
      ...my !== void 0 && {
        marginTop: typeof my === "number" ? `${my}px` : my,
        marginBottom: typeof my === "number" ? `${my}px` : my
      },
      ...mt !== void 0 && { marginTop: typeof mt === "number" ? `${mt}px` : mt },
      ...mb !== void 0 && { marginBottom: typeof mb === "number" ? `${mb}px` : mb },
      ...ml !== void 0 && { marginLeft: typeof ml === "number" ? `${ml}px` : ml },
      ...mr !== void 0 && { marginRight: typeof mr === "number" ? `${mr}px` : mr },
      ...style
    };
    return /* @__PURE__ */ jsx(Component, { ref, className: `boost-box ${className}`, style: computedStyle, ...props, children });
  }
);
Box.displayName = "Box";
var Flex = React.forwardRef(
  ({
    children,
    direction = "row",
    justify = "flex-start",
    align = "center",
    wrap = "nowrap",
    gap,
    inline = false,
    className = "",
    style,
    ...props
  }, ref) => {
    const computedStyle = {
      display: inline ? "inline-flex" : "flex",
      flexDirection: direction,
      justifyContent: justify,
      alignItems: align,
      flexWrap: wrap,
      ...gap !== void 0 && { gap: typeof gap === "number" ? `${gap}px` : gap },
      ...style
    };
    return /* @__PURE__ */ jsx("div", { ref, className: `boost-flex ${className}`, style: computedStyle, ...props, children });
  }
);
Flex.displayName = "Flex";
var Stack = ({
  direction = "column",
  gap = "12px",
  align,
  justify,
  wrap = false,
  fullWidth = false,
  className = "",
  style,
  children,
  ...props
}) => {
  const getGapValue = (val) => typeof val === "number" ? `${val}px` : val;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-stack boost-stack-${direction} ${className}`,
      style: {
        display: "flex",
        flexDirection: direction,
        gap: getGapValue(gap),
        alignItems: align,
        justifyContent: justify,
        flexWrap: typeof wrap === "boolean" ? wrap ? "wrap" : "nowrap" : wrap,
        width: fullWidth ? "100%" : void 0,
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children
    }
  );
};
var HStack = (props) => /* @__PURE__ */ jsx(Stack, { direction: "row", align: "center", ...props });
var VStack = (props) => /* @__PURE__ */ jsx(Stack, { direction: "column", ...props });
Stack.displayName = "Stack";
HStack.displayName = "HStack";
VStack.displayName = "VStack";
var Grid = React.forwardRef(
  ({
    children,
    cols = 1,
    gap = "16px",
    rowGap,
    columnGap,
    align,
    justify,
    autoResponsive = true,
    className = "",
    style,
    ...props
  }, ref) => {
    const rawId = React.useId ? React.useId() : Math.random().toString(36).substring(2, 9);
    const gridClassId = `bg-${rawId.replace(/[^a-zA-Z0-9_-]/g, "")}`;
    const toColVal = (val) => {
      if (val === void 0) return void 0;
      return typeof val === "number" ? `repeat(${val}, minmax(0, 1fr))` : val;
    };
    const toGapVal = (val) => {
      if (val === void 0) return void 0;
      return typeof val === "number" ? `${val}px` : val;
    };
    const isResponsiveCols = typeof cols === "object" && cols !== null;
    const isResponsiveGap = typeof gap === "object" && gap !== null;
    let baseCols = "repeat(1, minmax(0, 1fr))";
    let smCols;
    let mdCols;
    let lgCols;
    let xlCols;
    if (isResponsiveCols) {
      baseCols = toColVal(cols.base) || "repeat(1, minmax(0, 1fr))";
      smCols = toColVal(cols.sm);
      mdCols = toColVal(cols.md);
      lgCols = toColVal(cols.lg);
      xlCols = toColVal(cols.xl);
    } else if (typeof cols === "number" && autoResponsive && cols > 1) {
      baseCols = "repeat(1, minmax(0, 1fr))";
      smCols = cols >= 2 ? "repeat(2, minmax(0, 1fr))" : void 0;
      mdCols = cols >= 3 ? `repeat(${Math.min(3, cols)}, minmax(0, 1fr))` : void 0;
      lgCols = `repeat(${cols}, minmax(0, 1fr))`;
    } else {
      baseCols = toColVal(cols) || "repeat(1, minmax(0, 1fr))";
    }
    const baseGap = isResponsiveGap ? toGapVal(gap.base) || "16px" : toGapVal(gap) || "16px";
    const smGap = isResponsiveGap ? toGapVal(gap.sm) : void 0;
    const mdGap = isResponsiveGap ? toGapVal(gap.md) : void 0;
    const lgGap = isResponsiveGap ? toGapVal(gap.lg) : void 0;
    const responsiveCSS = `
      .${gridClassId} {
        display: grid;
        grid-template-columns: ${baseCols};
        gap: ${baseGap};
      }
      ${smCols || smGap ? `@media (min-width: 640px) { .${gridClassId} { ${smCols ? `grid-template-columns: ${smCols};` : ""} ${smGap ? `gap: ${smGap};` : ""} } }` : ""}
      ${mdCols || mdGap ? `@media (min-width: 768px) { .${gridClassId} { ${mdCols ? `grid-template-columns: ${mdCols};` : ""} ${mdGap ? `gap: ${mdGap};` : ""} } }` : ""}
      ${lgCols || lgGap ? `@media (min-width: 1024px) { .${gridClassId} { ${lgCols ? `grid-template-columns: ${lgCols};` : ""} ${lgGap ? `gap: ${lgGap};` : ""} } }` : ""}
      ${xlCols ? `@media (min-width: 1280px) { .${gridClassId} { grid-template-columns: ${xlCols}; } }` : ""}
    `;
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { dangerouslySetInnerHTML: { __html: responsiveCSS } }),
      /* @__PURE__ */ jsx(
        "div",
        {
          ref,
          className: `boost-grid ${gridClassId} ${className}`,
          style: {
            width: "100%",
            boxSizing: "border-box",
            ...rowGap !== void 0 && { rowGap: typeof rowGap === "number" ? `${rowGap}px` : rowGap },
            ...columnGap !== void 0 && {
              columnGap: typeof columnGap === "number" ? `${columnGap}px` : columnGap
            },
            ...align && { alignItems: align },
            ...justify && { justifyItems: justify },
            ...style
          },
          ...props,
          children
        }
      )
    ] });
  }
);
Grid.displayName = "Grid";
var GridItem = React.forwardRef(
  ({
    children,
    colSpan,
    rowSpan,
    colStart,
    rowStart,
    className = "",
    style,
    ...props
  }, ref) => {
    const gridColumn = colSpan === "full" ? "1 / -1" : colSpan !== void 0 ? `span ${colSpan} / span ${colSpan}` : colStart ? `${colStart}` : void 0;
    const gridRow = rowSpan !== void 0 ? `span ${rowSpan} / span ${rowSpan}` : rowStart ? `${rowStart}` : void 0;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `boost-grid-item ${className}`,
        style: {
          ...gridColumn && { gridColumn },
          ...gridRow && { gridRow },
          ...style
        },
        ...props,
        children
      }
    );
  }
);
GridItem.displayName = "GridItem";
var Section = React.forwardRef(
  ({
    children,
    maxWidth = "1200px",
    py = "64px",
    px = "24px",
    bg = "transparent",
    className = "",
    style,
    ...props
  }, ref) => {
    return /* @__PURE__ */ jsx(
      "section",
      {
        ref,
        className: `boost-section ${className}`,
        style: {
          width: "100%",
          backgroundColor: bg,
          paddingTop: typeof py === "number" ? `${py}px` : py,
          paddingBottom: typeof py === "number" ? `${py}px` : py,
          ...style
        },
        ...props,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
              margin: "0 auto",
              paddingLeft: typeof px === "number" ? `${px}px` : px,
              paddingRight: typeof px === "number" ? `${px}px` : px,
              width: "100%",
              boxSizing: "border-box"
            },
            children
          }
        )
      }
    );
  }
);
Section.displayName = "Section";
var AspectRatio = React.forwardRef(
  ({ ratio = 16 / 9, children, className = "", style, ...props }, ref) => {
    let numericRatio;
    if (typeof ratio === "number") {
      numericRatio = ratio;
    } else if (typeof ratio === "string" && ratio.includes("/")) {
      const [w, h] = ratio.split("/").map(Number);
      numericRatio = w && h ? w / h : 16 / 9;
    } else {
      numericRatio = Number(ratio) || 16 / 9;
    }
    const paddingBottom = `${1 / numericRatio * 100}%`;
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `boost-aspect-ratio ${className}`,
        style: {
          position: "relative",
          width: "100%",
          paddingBottom,
          overflow: "hidden",
          ...style
        },
        ...props,
        children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              width: "100%",
              height: "100%"
            },
            children
          }
        )
      }
    );
  }
);
AspectRatio.displayName = "AspectRatio";
var ScrollArea = React.forwardRef(
  ({
    children,
    maxHeight = "400px",
    maxWidth = "100%",
    direction = "vertical",
    className = "",
    style,
    ...props
  }, ref) => {
    const overflowX = direction === "horizontal" || direction === "both" ? "auto" : "hidden";
    const overflowY = direction === "vertical" || direction === "both" ? "auto" : "hidden";
    return /* @__PURE__ */ jsx(
      "div",
      {
        ref,
        className: `boost-scroll-area ${className}`,
        style: {
          maxHeight: typeof maxHeight === "number" ? `${maxHeight}px` : maxHeight,
          maxWidth: typeof maxWidth === "number" ? `${maxWidth}px` : maxWidth,
          overflowX,
          overflowY,
          scrollbarWidth: "thin",
          scrollbarColor: "var(--boost-border, #cbd5e1) transparent",
          ...style
        },
        ...props,
        children
      }
    );
  }
);
ScrollArea.displayName = "ScrollArea";
var Motion = ({
  animation = "fade-in",
  duration = 500,
  delay = 0,
  triggerOnce = true,
  viewportThreshold = 0.1,
  children,
  style,
  className = "",
  ...props
}) => {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  React.useEffect(() => {
    if (typeof IntersectionObserver === "undefined" || !ref.current) {
      setInView(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) observer.disconnect();
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold: viewportThreshold }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [triggerOnce, viewportThreshold]);
  const getMotionStyle = () => {
    const transition = `opacity ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms, transform ${duration}ms cubic-bezier(0.16, 1, 0.3, 1) ${delay}ms`;
    if (inView) {
      return {
        opacity: 1,
        transform: "none",
        transition
      };
    }
    let transform = "none";
    switch (animation) {
      case "slide-up":
        transform = "translateY(24px)";
        break;
      case "slide-down":
        transform = "translateY(-24px)";
        break;
      case "scale-in":
        transform = "scale(0.94)";
        break;
      case "slide-in-right":
        transform = "translateX(24px)";
        break;
      case "slide-in-left":
        transform = "translateX(-24px)";
        break;
      case "fade-in":
      default:
        transform = "none";
        break;
    }
    return {
      opacity: 0,
      transform,
      transition
    };
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      ref,
      className: `boost-motion ${className}`,
      style: {
        ...getMotionStyle(),
        ...style
      },
      ...props,
      children
    }
  );
};
Motion.displayName = "Motion";
var Header = ({
  logo,
  brandName = "Brand",
  navLinks = [],
  actions,
  sticky = true,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `boost-header ${className}`,
      style: {
        position: sticky ? "sticky" : "static",
        top: 0,
        zIndex: 40,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #e2e8f0",
        padding: "0 24px",
        height: "64px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
          logo,
          /* @__PURE__ */ jsx("span", { style: { fontSize: "18px", fontWeight: 700, color: "#0f172a" }, children: brandName })
        ] }),
        navLinks.length > 0 && /* @__PURE__ */ jsx("nav", { style: { display: "flex", alignItems: "center", gap: "20px" }, children: navLinks.map((link, idx) => /* @__PURE__ */ jsx(
          "a",
          {
            href: link.href,
            style: {
              textDecoration: "none",
              fontSize: "14px",
              fontWeight: 500,
              color: "#475569",
              transition: "color 0.15s ease"
            },
            children: link.label
          },
          idx
        )) }),
        actions && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: actions })
      ]
    }
  );
};
Header.displayName = "Header";
var Navbar = ({
  brandName = "BoostStore",
  logoUrl,
  navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Best Sellers", href: "/collections/bestsellers", badge: "HOT" },
    { label: "New Arrivals", href: "/collections/new" },
    { label: "Sale", href: "/collections/sale", isHighlight: true }
  ],
  searchPlaceholder = "Search for products, brands...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  cartCount = 0,
  wishlistCount = 0,
  onCartClick,
  onWishlistClick,
  onAccountClick,
  onLinkClick,
  isLoggedIn = false,
  userName,
  sticky = true,
  announcementText,
  announcementLink,
  onAnnouncementClose,
  className = ""
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const [localSearch, setLocalSearch] = React.useState(searchValue || "");
  const [openDropdown, setOpenDropdown] = React.useState(null);
  const [announcementVisible, setAnnouncementVisible] = React.useState(true);
  const [expandedMobileItem, setExpandedMobileItem] = React.useState(null);
  React.useEffect(() => {
    if (searchValue !== void 0) {
      setLocalSearch(searchValue);
    }
  }, [searchValue]);
  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (onSearchChange) onSearchChange(val);
  };
  const handleSearchKeyDown = (e) => {
    if (e.key === "Enter" && onSearchSubmit) {
      e.preventDefault();
      onSearchSubmit(localSearch);
    }
  };
  const handleNavigation = (href, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
    setMobileMenuOpen(false);
  };
  const [mobileSearchOpen, setMobileSearchOpen] = React.useState(false);
  return /* @__PURE__ */ jsxs(
    "header",
    {
      className: `boost-navbar ${className}`,
      style: {
        position: sticky ? "sticky" : "relative",
        top: 0,
        zIndex: 40,
        backgroundColor: "var(--boost-glass-bg, rgba(255, 255, 255, 0.88))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--boost-border, #e2e8f0)",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        width: "100%",
        boxSizing: "border-box",
        transition: "background-color 0.2s ease, border-color 0.2s ease"
      },
      children: [
        announcementText && announcementVisible && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-navbar-announcement",
            style: {
              backgroundColor: "var(--boost-primary, #2563eb)",
              color: "#ffffff",
              padding: "7px 16px",
              fontSize: "12px",
              fontWeight: 600,
              textAlign: "center",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              position: "relative"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: announcementText }),
              announcementLink && /* @__PURE__ */ jsx(
                "a",
                {
                  href: announcementLink,
                  style: {
                    color: "#ffffff",
                    textDecoration: "underline",
                    fontWeight: 700
                  },
                  children: "Shop Now \u2192"
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => {
                    setAnnouncementVisible(false);
                    if (onAnnouncementClose) onAnnouncementClose();
                  },
                  "aria-label": "Close announcement",
                  style: {
                    position: "absolute",
                    right: "14px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "rgba(255, 255, 255, 0.85)",
                    cursor: "pointer",
                    display: "flex",
                    padding: "4px"
                  },
                  children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                    /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                    /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                  ] })
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 992px) {
          .boost-navbar .boost-desktop-nav {
            display: none !important;
          }
          .boost-navbar .boost-mobile-hamburger {
            display: inline-flex !important;
          }
        }
        @media (max-width: 640px) {
          .boost-navbar .boost-navbar-search-desktop {
            display: none !important;
          }
          .boost-navbar .boost-mobile-search-btn {
            display: inline-flex !important;
          }
          .boost-navbar .boost-cart-btn-text {
            display: none !important;
          }
        }
        @media (min-width: 641px) {
          .boost-navbar .boost-mobile-search-btn {
            display: none !important;
          }
          .boost-navbar .boost-mobile-search-bar {
            display: none !important;
          }
        }
      ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "0 auto",
              padding: "12px clamp(14px, 3vw, 24px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "clamp(10px, 2vw, 24px)"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                    "aria-label": "Toggle navigation menu",
                    className: "boost-mobile-hamburger",
                    style: {
                      display: "none",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "6px",
                      color: "var(--boost-text, #0f172a)",
                      borderRadius: "8px",
                      transition: "background-color 0.15s ease"
                    },
                    children: mobileMenuOpen ? /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                      /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                      /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                    ] }) : /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "12", x2: "21", y2: "12" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "18", x2: "21", y2: "18" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: "/",
                    onClick: (e) => handleNavigation("/", e),
                    style: {
                      textDecoration: "none",
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    },
                    children: logoUrl ? /* @__PURE__ */ jsx("img", { src: logoUrl, alt: brandName, style: { height: "32px", width: "auto" } }) : /* @__PURE__ */ jsxs(
                      "span",
                      {
                        style: {
                          fontSize: "clamp(18px, 2.2vw, 22px)",
                          fontWeight: 800,
                          letterSpacing: "-0.03em",
                          color: "var(--boost-text, #0f172a)",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                display: "inline-flex",
                                alignItems: "center",
                                justifyContent: "center",
                                width: "30px",
                                height: "30px",
                                backgroundColor: "var(--boost-primary, #2563eb)",
                                color: "#ffffff",
                                borderRadius: "9px",
                                boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)"
                              },
                              children: /* @__PURE__ */ jsx("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) })
                            }
                          ),
                          brandName
                        ]
                      }
                    )
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "nav",
                {
                  className: "boost-desktop-nav",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "16px"
                  },
                  children: navLinks.map((link) => {
                    const hasChildren = link.children && link.children.length > 0;
                    const isOpen = openDropdown === link.label;
                    return /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: { position: "relative" },
                        onMouseEnter: () => hasChildren && setOpenDropdown(link.label),
                        onMouseLeave: () => hasChildren && setOpenDropdown(null),
                        children: [
                          /* @__PURE__ */ jsxs(
                            "a",
                            {
                              href: link.href,
                              onClick: (e) => {
                                if (hasChildren && !onLinkClick) {
                                  e.preventDefault();
                                  setOpenDropdown(isOpen ? null : link.label);
                                } else {
                                  handleNavigation(link.href, e);
                                }
                              },
                              style: {
                                textDecoration: "none",
                                fontSize: "14px",
                                fontWeight: 600,
                                color: link.isHighlight ? "#ef4444" : "var(--boost-text, #0f172a)",
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "5px",
                                padding: "6px 10px",
                                borderRadius: "8px",
                                transition: "color 0.15s ease, background-color 0.15s ease"
                              },
                              children: [
                                /* @__PURE__ */ jsx("span", { children: link.label }),
                                link.badge && /* @__PURE__ */ jsx(
                                  "span",
                                  {
                                    style: {
                                      fontSize: "10px",
                                      fontWeight: 700,
                                      backgroundColor: "rgba(239, 68, 68, 0.12)",
                                      color: "#ef4444",
                                      padding: "1px 6px",
                                      borderRadius: "9999px",
                                      textTransform: "uppercase",
                                      letterSpacing: "0.04em"
                                    },
                                    children: link.badge
                                  }
                                ),
                                hasChildren && /* @__PURE__ */ jsx(
                                  "svg",
                                  {
                                    width: "12",
                                    height: "12",
                                    viewBox: "0 0 24 24",
                                    fill: "none",
                                    stroke: "currentColor",
                                    strokeWidth: "2.5",
                                    strokeLinecap: "round",
                                    style: {
                                      transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                      transition: "transform 0.2s ease"
                                    },
                                    children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                                  }
                                )
                              ]
                            }
                          ),
                          hasChildren && isOpen && /* @__PURE__ */ jsx(
                            "div",
                            {
                              style: {
                                position: "absolute",
                                top: "100%",
                                left: 0,
                                minWidth: "200px",
                                backgroundColor: "var(--boost-surface, #ffffff)",
                                border: "1px solid var(--boost-border, #e2e8f0)",
                                borderRadius: "var(--boost-radius, 12px)",
                                boxShadow: "var(--boost-shadow-lg, 0 10px 25px -5px rgba(0, 0, 0, 0.1))",
                                padding: "6px",
                                display: "flex",
                                flexDirection: "column",
                                gap: "2px",
                                zIndex: 50,
                                animation: "boost-fadeIn 0.15s ease"
                              },
                              children: link.children.map((child) => /* @__PURE__ */ jsxs(
                                "a",
                                {
                                  href: child.href,
                                  onClick: (e) => {
                                    handleNavigation(child.href, e);
                                    setOpenDropdown(null);
                                  },
                                  style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    padding: "8px 12px",
                                    borderRadius: "8px",
                                    textDecoration: "none",
                                    fontSize: "13px",
                                    fontWeight: 500,
                                    color: "var(--boost-text, #0f172a)",
                                    transition: "background-color 0.15s ease, color 0.15s ease"
                                  },
                                  onMouseEnter: (e) => {
                                    e.currentTarget.style.backgroundColor = "var(--boost-bg, #f1f5f9)";
                                  },
                                  onMouseLeave: (e) => {
                                    e.currentTarget.style.backgroundColor = "transparent";
                                  },
                                  children: [
                                    /* @__PURE__ */ jsx("span", { children: child.label }),
                                    child.badge && /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "9999px", backgroundColor: "var(--boost-primary, #2563eb)", color: "#ffffff" }, children: child.badge })
                                  ]
                                },
                                child.href
                              ))
                            }
                          )
                        ]
                      },
                      link.href
                    );
                  })
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "boost-navbar-search boost-navbar-search-desktop",
                  style: {
                    flex: 1,
                    maxWidth: "340px",
                    position: "relative"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          left: "12px",
                          top: "50%",
                          transform: "translateY(-50%)",
                          color: "var(--boost-text-muted, #64748b)",
                          display: "flex",
                          alignItems: "center",
                          pointerEvents: "none"
                        },
                        children: /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                          /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "text",
                        value: localSearch,
                        onChange: handleSearchChange,
                        onKeyDown: handleSearchKeyDown,
                        placeholder: searchPlaceholder,
                        style: {
                          width: "100%",
                          padding: "8px 14px 8px 36px",
                          fontSize: "13px",
                          borderRadius: "9999px",
                          border: "1px solid var(--boost-border, #e2e8f0)",
                          backgroundColor: "var(--boost-surface, #f8fafc)",
                          color: "var(--boost-text, #0f172a)",
                          outline: "none",
                          boxSizing: "border-box",
                          transition: "all 0.15s ease"
                        }
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "clamp(6px, 1.5vw, 14px)" }, children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    onClick: () => setMobileSearchOpen(!mobileSearchOpen),
                    "aria-label": "Toggle search",
                    className: "boost-mobile-search-btn",
                    style: {
                      display: "none",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "var(--boost-text, #0f172a)",
                      borderRadius: "8px"
                    },
                    children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                      /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                      /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onWishlistClick,
                    "aria-label": "Wishlist",
                    style: {
                      position: "relative",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "var(--boost-text, #0f172a)",
                      display: "flex",
                      alignItems: "center",
                      borderRadius: "8px",
                      transition: "transform 0.15s ease"
                    },
                    children: [
                      /* @__PURE__ */ jsx("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" }) }),
                      wishlistCount > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            position: "absolute",
                            top: "2px",
                            right: "2px",
                            backgroundColor: "#ef4444",
                            color: "#ffffff",
                            fontSize: "10px",
                            fontWeight: 700,
                            borderRadius: "9999px",
                            minWidth: "16px",
                            height: "16px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            padding: "0 4px",
                            boxShadow: "0 1px 4px rgba(239, 68, 68, 0.4)"
                          },
                          children: wishlistCount
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onAccountClick,
                    "aria-label": "Account",
                    style: {
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      padding: "8px",
                      color: "var(--boost-text, #0f172a)",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      borderRadius: "8px"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("svg", { width: "21", height: "21", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [
                        /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
                      ] }),
                      isLoggedIn && userName && /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #0f172a)" }, children: userName })
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: onCartClick,
                    "aria-label": "Shopping Cart",
                    style: {
                      position: "relative",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      backgroundColor: "var(--boost-primary, #2563eb)",
                      color: "#ffffff",
                      border: "none",
                      borderRadius: "9999px",
                      padding: "8px 16px",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: "13px",
                      boxShadow: "var(--boost-shadow-glow, 0 2px 10px rgba(37, 99, 235, 0.25))",
                      transition: "transform 0.15s ease, box-shadow 0.15s ease"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", children: [
                        /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                        /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                        /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                      ] }),
                      /* @__PURE__ */ jsx("span", { className: "boost-cart-btn-text", children: "Cart" }),
                      cartCount > 0 && /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            backgroundColor: "#ffffff",
                            color: "var(--boost-primary, #2563eb)",
                            borderRadius: "9999px",
                            padding: "1px 6px",
                            fontSize: "11px",
                            fontWeight: 800
                          },
                          children: cartCount
                        }
                      )
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        mobileSearchOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: "boost-mobile-search-bar",
            style: {
              padding: "8px 16px 12px 16px",
              borderTop: "1px solid var(--boost-border, #e2e8f0)",
              backgroundColor: "var(--boost-surface, #f8fafc)",
              animation: "boost-fadeIn 0.2s ease"
            },
            children: /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: "100%" }, children: [
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "var(--boost-text-muted, #64748b)",
                    display: "flex",
                    alignItems: "center",
                    pointerEvents: "none"
                  },
                  children: /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                    /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                  ] })
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  autoFocus: true,
                  value: localSearch,
                  onChange: handleSearchChange,
                  onKeyDown: handleSearchKeyDown,
                  placeholder: searchPlaceholder,
                  style: {
                    width: "100%",
                    padding: "9px 12px 9px 36px",
                    fontSize: "13px",
                    borderRadius: "9999px",
                    border: "1px solid var(--boost-border, #e2e8f0)",
                    backgroundColor: "var(--boost-bg, #ffffff)",
                    color: "var(--boost-text, #0f172a)",
                    outline: "none",
                    boxSizing: "border-box"
                  }
                }
              )
            ] })
          }
        ),
        mobileMenuOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              borderTop: "1px solid var(--boost-border, #e2e8f0)",
              backgroundColor: "var(--boost-bg, #ffffff)",
              padding: "16px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              animation: "boost-fadeIn 0.2s ease"
            },
            children: navLinks.map((link) => {
              const hasChildren = link.children && link.children.length > 0;
              const isExpanded = expandedMobileItem === link.label;
              return /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 12px",
                      borderRadius: "8px",
                      backgroundColor: isExpanded ? "var(--boost-surface, #f8fafc)" : "transparent"
                    },
                    children: [
                      /* @__PURE__ */ jsxs(
                        "a",
                        {
                          href: link.href,
                          onClick: (e) => {
                            if (hasChildren) {
                              e.preventDefault();
                              setExpandedMobileItem(isExpanded ? null : link.label);
                            } else {
                              handleNavigation(link.href, e);
                            }
                          },
                          style: {
                            textDecoration: "none",
                            fontSize: "15px",
                            fontWeight: 600,
                            color: link.isHighlight ? "#ef4444" : "var(--boost-text, #0f172a)",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            flex: 1
                          },
                          children: [
                            /* @__PURE__ */ jsx("span", { children: link.label }),
                            link.badge && /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "11px",
                                  fontWeight: 700,
                                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                                  color: "#ef4444",
                                  padding: "2px 8px",
                                  borderRadius: "9999px"
                                },
                                children: link.badge
                              }
                            )
                          ]
                        }
                      ),
                      hasChildren && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: () => setExpandedMobileItem(isExpanded ? null : link.label),
                          style: {
                            background: "none",
                            border: "none",
                            color: "var(--boost-text-muted, #64748b)",
                            cursor: "pointer",
                            padding: "4px",
                            display: "flex"
                          },
                          children: /* @__PURE__ */ jsx(
                            "svg",
                            {
                              width: "16",
                              height: "16",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2",
                              strokeLinecap: "round",
                              style: {
                                transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              },
                              children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                            }
                          )
                        }
                      )
                    ]
                  }
                ),
                hasChildren && isExpanded && /* @__PURE__ */ jsx("div", { style: { paddingLeft: "20px", display: "flex", flexDirection: "column", gap: "4px", marginTop: "4px" }, children: link.children.map((child) => /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: child.href,
                    onClick: (e) => handleNavigation(child.href, e),
                    style: {
                      textDecoration: "none",
                      fontSize: "14px",
                      fontWeight: 500,
                      color: "var(--boost-text-muted, #64748b)",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between"
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { children: child.label }),
                      child.badge && /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 600, padding: "1px 6px", borderRadius: "9999px", backgroundColor: "var(--boost-primary, #2563eb)", color: "#ffffff" }, children: child.badge })
                    ]
                  },
                  child.href
                )) })
              ] }, link.href);
            })
          }
        )
      ]
    }
  );
};
Navbar.displayName = "Navbar";
var Sidebar = ({
  groups,
  activeId,
  onSelect,
  collapsed = false,
  header,
  footer,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "aside",
    {
      className: `boost-sidebar ${className}`,
      style: {
        width: collapsed ? "68px" : "260px",
        height: "100%",
        backgroundColor: "var(--boost-surface, #ffffff)",
        borderRight: "1px solid var(--boost-border, #e2e8f0)",
        display: "flex",
        flexDirection: "column",
        fontFamily: "inherit",
        transition: "width 0.2s ease",
        boxSizing: "border-box"
      },
      children: [
        header && /* @__PURE__ */ jsx("div", { style: { padding: "16px", borderBottom: "1px solid var(--boost-border, #f1f5f9)" }, children: header }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", padding: "12px 8px", display: "flex", flexDirection: "column", gap: "16px" }, children: groups.map((grp, gIdx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
          grp.title && !collapsed && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 600, color: "var(--boost-text-muted, #94a3b8)", textTransform: "uppercase", padding: "4px 12px", letterSpacing: "0.05em" }, children: grp.title }),
          grp.items.map((item) => {
            const isActive = item.id === activeId;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => {
                  if (item.onClick) item.onClick();
                  if (onSelect) onSelect(item.id);
                },
                title: collapsed ? item.label : void 0,
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "12px",
                  padding: collapsed ? "10px" : "10px 12px",
                  justifyContent: collapsed ? "center" : "flex-start",
                  borderRadius: "8px",
                  backgroundColor: isActive ? "rgba(37, 99, 235, 0.12)" : "transparent",
                  color: isActive ? "var(--boost-primary, #3b82f6)" : "var(--boost-text, #475569)",
                  fontWeight: isActive ? 600 : 500,
                  fontSize: "14px",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: [
                  item.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", color: isActive ? "var(--boost-primary, #3b82f6)" : "var(--boost-text-muted, #64748b)" }, children: item.icon }),
                  !collapsed && /* @__PURE__ */ jsx("span", { style: { flex: 1, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: item.label }),
                  !collapsed && item.badge && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 600, padding: "2px 7px", borderRadius: "9999px", backgroundColor: isActive ? "var(--boost-primary, #3b82f6)" : "var(--boost-border, #e2e8f0)", color: isActive ? "#ffffff" : "var(--boost-text, #64748b)" }, children: item.badge })
                ]
              },
              item.id
            );
          })
        ] }, gIdx)) }),
        footer && /* @__PURE__ */ jsx("div", { style: { padding: "16px", borderTop: "1px solid var(--boost-border, #f1f5f9)" }, children: footer })
      ]
    }
  );
};
Sidebar.displayName = "Sidebar";
var Footer = ({
  brandName = "BoostStore",
  description = "India\u2019s modern direct-to-consumer store delivering premium quality essentials straight to your doorstep.",
  columns = [
    {
      title: "Shop",
      links: [
        { label: "All Products", href: "/products" },
        { label: "Best Sellers", href: "/collections/bestsellers" },
        { label: "New Arrivals", href: "/collections/new" },
        { label: "Special Offers", href: "/collections/sale" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Track Your Order", href: "/track-order" },
        { label: "Shipping & Delivery", href: "/shipping-policy" },
        { label: "Returns & Exchange", href: "/returns" },
        { label: "Contact Us", href: "/contact" }
      ]
    },
    {
      title: "Company",
      links: [
        { label: "Our Story", href: "/about" },
        { label: "Sustainability", href: "/sustainability" },
        { label: "Privacy Policy", href: "/privacy" },
        { label: "Terms of Service", href: "/terms" }
      ]
    }
  ],
  onNewsletterSubmit,
  showPaymentBadges = true,
  copyrightYear = (/* @__PURE__ */ new Date()).getFullYear(),
  variant = "dark",
  className = ""
}) => {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailError, setEmailError] = React.useState(null);
  const handleSubmit = (e) => {
    e.preventDefault();
    const trimmed = email.trim();
    if (!trimmed) {
      setEmailError("Please enter your email address");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
      setEmailError("Please enter a valid email address");
      return;
    }
    setEmailError(null);
    if (onNewsletterSubmit) onNewsletterSubmit(trimmed);
    setSubscribed(true);
  };
  const isLight = variant === "light";
  const isSurface = variant === "surface";
  const footerBg = isLight ? "#f8fafc" : isSurface ? "var(--boost-surface, #ffffff)" : "#090d16";
  const footerText = isLight ? "#475569" : isSurface ? "var(--boost-text-muted, #64748b)" : "#94a3b8";
  const headingColor = isLight ? "#0f172a" : isSurface ? "var(--boost-text, #0f172a)" : "#ffffff";
  const borderColor = isLight ? "var(--boost-border, #e2e8f0)" : isSurface ? "var(--boost-border, #e2e8f0)" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight || isSurface ? "var(--boost-bg, #ffffff)" : "rgba(255, 255, 255, 0.05)";
  const inputColor = isLight || isSurface ? "var(--boost-text, #0f172a)" : "#ffffff";
  const inputBorder = isLight || isSurface ? "var(--boost-border, #cbd5e1)" : "rgba(255, 255, 255, 0.12)";
  return /* @__PURE__ */ jsxs(
    "footer",
    {
      className: `boost-footer ${className}`,
      style: {
        backgroundColor: footerBg,
        color: footerText,
        padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px) 28px",
        borderTop: `1px solid ${borderColor}`,
        fontSize: "14px",
        boxSizing: "border-box",
        width: "100%",
        transition: "background-color 0.2s ease, color 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "0 auto",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 220px), 1fr))",
              gap: "clamp(28px, 4vw, 48px)",
              paddingBottom: "clamp(28px, 4vw, 40px)",
              borderBottom: `1px solid ${borderColor}`
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      fontSize: "clamp(20px, 2.5vw, 24px)",
                      fontWeight: 800,
                      letterSpacing: "-0.02em",
                      color: headingColor,
                      display: "flex",
                      alignItems: "center",
                      gap: "10px"
                    },
                    children: [
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            width: "32px",
                            height: "32px",
                            borderRadius: "8px",
                            backgroundColor: "var(--boost-primary, #2563eb)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ffffff",
                            fontSize: "16px",
                            fontWeight: 900
                          },
                          children: "\u26A1"
                        }
                      ),
                      brandName
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("p", { style: { lineHeight: 1.6, margin: 0, fontSize: "13px", color: footerText }, children: description }),
                /* @__PURE__ */ jsxs("div", { style: { marginTop: "8px" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: headingColor, display: "block", marginBottom: "8px" }, children: "Subscribe for exclusive drops & offers" }),
                  subscribed ? /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        color: "#10b981",
                        backgroundColor: "rgba(16, 185, 129, 0.1)",
                        border: "1px solid rgba(16, 185, 129, 0.25)",
                        padding: "10px 14px",
                        borderRadius: "10px",
                        fontSize: "13px",
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      },
                      children: [
                        /* @__PURE__ */ jsx("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
                        /* @__PURE__ */ jsx("span", { children: "You're on the VIP list! Check your inbox soon." })
                      ]
                    }
                  ) : /* @__PURE__ */ jsxs("div", { children: [
                    /* @__PURE__ */ jsxs("form", { noValidate: true, onSubmit: handleSubmit, style: { display: "flex", gap: "8px", flexWrap: "wrap" }, children: [
                      /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "email",
                          value: email,
                          onChange: (e) => {
                            setEmail(e.target.value);
                            if (emailError) setEmailError(null);
                          },
                          placeholder: "Enter your email",
                          style: {
                            flex: "1 1 180px",
                            padding: "10px 14px",
                            borderRadius: "10px",
                            backgroundColor: inputBg,
                            border: `1px solid ${emailError ? "#ef4444" : inputBorder}`,
                            color: inputColor,
                            fontSize: "13px",
                            outline: "none",
                            transition: "border-color 0.15s ease"
                          }
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "submit",
                          style: {
                            padding: "10px 20px",
                            borderRadius: "10px",
                            backgroundColor: "var(--boost-primary, #2563eb)",
                            color: "#ffffff",
                            fontWeight: 700,
                            fontSize: "13px",
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "0 2px 8px rgba(37, 99, 235, 0.3)",
                            transition: "opacity 0.15s ease"
                          },
                          children: "Join"
                        }
                      )
                    ] }),
                    emailError && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#ef4444", marginTop: "6px", fontWeight: 500 }, children: [
                      /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                        /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                        /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                      ] }),
                      emailError
                    ] })
                  ] })
                ] })
              ] }),
              columns.map((col, idx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
                /* @__PURE__ */ jsx(
                  "h4",
                  {
                    style: {
                      fontSize: "13px",
                      fontWeight: 700,
                      color: headingColor,
                      textTransform: "uppercase",
                      letterSpacing: "0.06em",
                      margin: 0
                    },
                    children: col.title
                  }
                ),
                /* @__PURE__ */ jsx("ul", { style: { listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "10px" }, children: col.links.map((link, lIdx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: link.href,
                    style: {
                      color: footerText,
                      textDecoration: "none",
                      fontSize: "13px",
                      transition: "color 0.15s ease"
                    },
                    onMouseEnter: (e) => e.target.style.color = headingColor,
                    onMouseLeave: (e) => e.target.style.color = footerText,
                    children: link.label
                  }
                ) }, lIdx)) })
              ] }, idx))
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: "1280px",
              margin: "24px auto 0",
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              fontSize: "12px",
              color: footerText
            },
            children: [
              /* @__PURE__ */ jsxs("span", { children: [
                "\xA9 ",
                copyrightYear,
                " ",
                brandName,
                ". All rights reserved. Powered by BoostEngine."
              ] }),
              showPaymentBadges && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }, children: ["UPI", "RuPay", "VISA", "Mastercard", "NetBanking", "COD Available"].map((method) => /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    backgroundColor: isLight || isSurface ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.06)",
                    border: `1px solid ${borderColor}`,
                    color: headingColor,
                    padding: "3px 9px",
                    borderRadius: "6px",
                    fontSize: "11px",
                    fontWeight: 600,
                    letterSpacing: "0.02em"
                  },
                  children: method
                },
                method
              )) })
            ]
          }
        )
      ]
    }
  );
};
Footer.displayName = "Footer";
var MobileBottomBar = ({
  activeTab = "home",
  cartCount = 0,
  wishlistCount = 0,
  items,
  onTabChange,
  className = ""
}) => {
  const defaultItems = [
    { id: "home", label: "Home", icon: "home", href: "/" },
    { id: "search", label: "Search", icon: "search", href: "/search" },
    { id: "wishlist", label: "Wishlist", icon: "wishlist", badge: wishlistCount > 0 ? wishlistCount : void 0, href: "/wishlist" },
    { id: "cart", label: "Bag", icon: "cart", badge: cartCount > 0 ? cartCount : void 0, href: "/cart" },
    { id: "account", label: "Profile", icon: "account", href: "/account" }
  ];
  const barItems = items || defaultItems;
  const renderIcon = (type, isActive) => {
    const stroke = isActive ? "var(--boost-primary, #0f172a)" : "var(--boost-muted, #64748b)";
    const strokeWidth = isActive ? "2.3" : "1.8";
    switch (type) {
      case "home":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" }),
          /* @__PURE__ */ jsx("polyline", { points: "9 22 9 12 15 12 15 22" })
        ] });
      case "search":
      case "categories":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
          /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
        ] });
      case "wishlist":
        return /* @__PURE__ */ jsx(
          "svg",
          {
            width: "22",
            height: "22",
            viewBox: "0 0 24 24",
            fill: isActive ? "#ef4444" : "none",
            stroke: isActive ? "#ef4444" : stroke,
            strokeWidth,
            children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
          }
        );
      case "cart":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
          /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
        ] });
      case "account":
        return /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke, strokeWidth, children: [
          /* @__PURE__ */ jsx("path", { d: "M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" }),
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "7", r: "4" })
        ] });
      default:
        return null;
    }
  };
  return /* @__PURE__ */ jsx(
    "nav",
    {
      className: `boost-mobile-bottom-bar ${className}`,
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        backgroundColor: "var(--boost-glass-bg, rgba(255, 255, 255, 0.9))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.7))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        padding: "6px 4px calc(6px + env(safe-area-inset-bottom, 8px))",
        boxShadow: "var(--boost-shadow-md, 0 -4px 20px rgba(0, 0, 0, 0.05))"
      },
      children: barItems.map((item) => {
        const isActive = activeTab === item.id;
        const badgeValue = item.id === "cart" ? cartCount || item.badge : item.id === "wishlist" ? wishlistCount || item.badge : item.badge;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => onTabChange && onTabChange(item.id, item.href),
            "aria-label": item.label,
            style: {
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "4px",
              padding: "4px 12px",
              flex: 1,
              maxWidth: "80px",
              color: isActive ? "#111827" : "#6b7280",
              transition: "color 0.15s ease, transform 0.1s ease"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
                renderIcon(item.icon, isActive),
                Boolean(badgeValue) && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      position: "absolute",
                      top: "-4px",
                      right: "-8px",
                      backgroundColor: item.id === "cart" ? "#111827" : "#ef4444",
                      color: "#ffffff",
                      fontSize: "10px",
                      fontWeight: 700,
                      borderRadius: "9999px",
                      minWidth: "16px",
                      height: "16px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "0 3px",
                      lineHeight: 1
                    },
                    children: badgeValue
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "11px",
                    fontWeight: isActive ? 700 : 500,
                    letterSpacing: "-0.01em"
                  },
                  children: item.label
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
};
MobileBottomBar.displayName = "MobileBottomBar";
var MobileBottomNav = ({
  items,
  activeId,
  onChange,
  style
}) => {
  return /* @__PURE__ */ jsx(
    "nav",
    {
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        minHeight: "60px",
        backgroundColor: "var(--boost-glass-bg, rgba(255, 255, 255, 0.85))",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderTop: "1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.7))",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-around",
        zIndex: 999,
        paddingBottom: "env(safe-area-inset-bottom, 8px)",
        paddingTop: "6px",
        boxShadow: "var(--boost-shadow-md, 0 -4px 20px rgba(0, 0, 0, 0.05))",
        fontFamily: "inherit",
        boxSizing: "border-box",
        ...style
      },
      children: items.map((item) => {
        const isActive = item.id === activeId;
        return /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => onChange?.(item.id, item.href),
            style: {
              flex: 1,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              background: "none",
              border: "none",
              cursor: "pointer",
              position: "relative",
              padding: "6px 0",
              color: isActive ? "var(--boost-primary, #0f172a)" : "var(--boost-muted, #64748b)",
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "relative",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px 14px",
                    borderRadius: "999px",
                    backgroundColor: isActive ? "rgba(59, 130, 246, 0.08)" : "transparent",
                    transition: "background-color 0.2s ease"
                  },
                  children: [
                    item.icon || /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: isActive ? 2.3 : 1.8, children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }) }),
                    item.badge !== void 0 && /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          position: "absolute",
                          top: "-2px",
                          right: "-4px",
                          minWidth: "16px",
                          height: "16px",
                          borderRadius: "8px",
                          backgroundColor: "#ef4444",
                          color: "#ffffff",
                          fontSize: "10px",
                          fontWeight: 700,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          padding: "0 4px",
                          boxShadow: "0 2px 5px rgba(239, 68, 68, 0.4)"
                        },
                        children: item.badge
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "11px",
                    fontWeight: isActive ? 600 : 500,
                    marginTop: "3px",
                    letterSpacing: "-0.01em"
                  },
                  children: item.label
                }
              )
            ]
          },
          item.id
        );
      })
    }
  );
};
MobileBottomNav.displayName = "MobileBottomNav";
var Breadcrumb = ({
  items,
  separator,
  onItemClick,
  className = "",
  style
}) => {
  const defaultSeparator = /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: 0.4, margin: "0 4px", flexShrink: 0 }, children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) });
  return /* @__PURE__ */ jsx(
    "nav",
    {
      "aria-label": "Breadcrumb",
      className: `boost-breadcrumb ${className}`,
      style: {
        display: "flex",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "4px",
        fontSize: "13px",
        fontFamily: "inherit",
        color: "var(--boost-text-muted, #64748b)",
        ...style
      },
      children: items.map((item, index) => {
        const isLast = index === items.length - 1;
        return /* @__PURE__ */ jsxs(React.Fragment, { children: [
          /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", alignItems: "center", gap: "6px" }, children: item.href && !isLast ? /* @__PURE__ */ jsxs(
            "a",
            {
              href: item.href,
              onClick: (e) => {
                if (onItemClick) {
                  e.preventDefault();
                  onItemClick(item.href, item);
                }
              },
              style: {
                color: "var(--boost-text-muted, #64748b)",
                textDecoration: "none",
                display: "inline-flex",
                alignItems: "center",
                gap: "4px",
                fontWeight: 500,
                transition: "color 0.15s ease"
              },
              onMouseEnter: (e) => {
                e.currentTarget.style.color = "var(--boost-primary, #2563eb)";
              },
              onMouseLeave: (e) => {
                e.currentTarget.style.color = "var(--boost-text-muted, #64748b)";
              },
              children: [
                item.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: item.icon }),
                /* @__PURE__ */ jsx("span", { children: item.label })
              ]
            }
          ) : /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                color: isLast ? "var(--boost-text, #0f172a)" : "var(--boost-text-muted, #64748b)",
                fontWeight: isLast ? 600 : 500,
                display: "inline-flex",
                alignItems: "center",
                gap: "4px"
              },
              "aria-current": isLast ? "page" : void 0,
              children: [
                item.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: item.icon }),
                /* @__PURE__ */ jsx("span", { children: item.label })
              ]
            }
          ) }),
          !isLast && /* @__PURE__ */ jsx("span", { "aria-hidden": "true", style: { display: "inline-flex", alignItems: "center" }, children: separator || defaultSeparator })
        ] }, index);
      })
    }
  );
};
Breadcrumb.displayName = "Breadcrumb";
var Container = ({
  maxWidth = "lg",
  className = "",
  style,
  children,
  ...props
}) => {
  const getMaxWidth = () => {
    switch (maxWidth) {
      case "sm":
        return "640px";
      case "md":
        return "768px";
      case "lg":
        return "1024px";
      case "xl":
        return "1280px";
      case "2xl":
        return "1536px";
      case "full":
        return "100%";
    }
  };
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-container ${className}`,
      style: {
        width: "100%",
        maxWidth: getMaxWidth(),
        marginLeft: "auto",
        marginRight: "auto",
        paddingLeft: "clamp(16px, 3.5vw, 32px)",
        paddingRight: "clamp(16px, 3.5vw, 32px)",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children
    }
  );
};
Container.displayName = "Container";
var PageWrapper = ({
  children,
  header,
  footer,
  sidebar,
  className = "",
  style
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-page-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        backgroundColor: "#f8fafc",
        fontFamily: "inherit",
        ...style
      },
      children: [
        header,
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flex: 1 }, children: [
          sidebar,
          /* @__PURE__ */ jsx("main", { style: { flex: 1, minWidth: 0 }, children })
        ] }),
        footer
      ]
    }
  );
};
PageWrapper.displayName = "PageWrapper";
var NavLink = ({
  href,
  children,
  isActive,
  active,
  leftIcon,
  rightIcon,
  badge,
  className = "",
  style,
  ...props
}) => {
  const activeState = active ?? isActive ?? false;
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      className: `boost-nav-link ${activeState ? "active" : ""} ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 12px",
        borderRadius: "6px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "#2563eb" : "#475569",
        backgroundColor: isActive ? "#eff6ff" : "transparent",
        transition: "all 0.15s ease",
        ...style
      },
      ...props,
      children: [
        leftIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: leftIcon }),
        /* @__PURE__ */ jsx("span", { children }),
        badge !== void 0 && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "9999px",
              backgroundColor: isActive ? "#dbeafe" : "#f1f5f9",
              color: isActive ? "#1d4ed8" : "#64748b"
            },
            children: badge
          }
        ),
        rightIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: rightIcon })
      ]
    }
  );
};
NavLink.displayName = "NavLink";
var DropdownMenu = ({
  trigger,
  items,
  align = "left",
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `boost-dropdown ${className}`,
      style: { position: "relative", display: "inline-flex" },
      children: [
        /* @__PURE__ */ jsx("div", { onClick: () => setIsOpen((prev) => !prev), children: trigger }),
        isOpen && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: "calc(100% + 4px)",
              [align === "right" ? "right" : "left"]: 0,
              zIndex: 500,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "8px",
              boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
              minWidth: "180px",
              padding: "4px",
              fontFamily: "inherit"
            },
            children: items.map((item) => /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => {
                  if (item.disabled) return;
                  setIsOpen(false);
                  if (item.onClick) item.onClick();
                },
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "8px 12px",
                  fontSize: "13px",
                  borderRadius: "4px",
                  cursor: item.disabled ? "not-allowed" : "pointer",
                  opacity: item.disabled ? 0.5 : 1,
                  color: item.destructive ? "#dc2626" : "#1e293b",
                  transition: "background-color 0.15s ease"
                },
                children: [
                  item.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: item.icon }),
                  /* @__PURE__ */ jsx("span", { children: item.label })
                ]
              },
              item.id
            ))
          }
        )
      ]
    }
  );
};
DropdownMenu.displayName = "DropdownMenu";
var MegaMenu = ({
  trigger,
  sections,
  categories,
  featured,
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState(categories?.[0]?.id || "");
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  const effectiveSections = React.useMemo(() => {
    if (sections && sections.length > 0) return sections;
    if (categories && categories.length > 0) {
      const active = categories.find((c) => c.id === activeCategory) || categories[0];
      return active?.columns || active?.sections || [];
    }
    return [];
  }, [sections, categories, activeCategory]);
  const defaultTrigger = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: "8px 14px",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        fontSize: "13px",
        fontWeight: 600,
        color: "#0f172a",
        cursor: "pointer"
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: "Browse Categories" }),
        /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: menuRef,
      className: `boost-megamenu-wrapper ${className}`,
      onMouseEnter: () => setIsOpen(true),
      onMouseLeave: () => setIsOpen(false),
      style: { position: "relative", display: "inline-flex", fontFamily: "inherit" },
      children: [
        /* @__PURE__ */ jsx("div", { children: trigger || defaultTrigger }),
        isOpen && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "absolute",
              top: "100%",
              left: 0,
              zIndex: 500,
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "12px",
              boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
              padding: "20px 24px",
              display: "flex",
              gap: "28px",
              minWidth: "580px",
              fontFamily: "inherit"
            },
            children: [
              categories && categories.length > 1 && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "4px", borderRight: "1px solid #f1f5f9", paddingRight: "16px", minWidth: "120px" }, children: categories.map((cat) => /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setActiveCategory(cat.id),
                  style: {
                    textAlign: "left",
                    padding: "8px 12px",
                    borderRadius: "6px",
                    border: "none",
                    fontSize: "13px",
                    fontWeight: activeCategory === cat.id ? 700 : 500,
                    color: activeCategory === cat.id ? "#2563eb" : "#475569",
                    backgroundColor: activeCategory === cat.id ? "#eff6ff" : "transparent",
                    cursor: "pointer"
                  },
                  children: cat.label
                },
                cat.id
              )) }),
              /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "32px", flex: 1 }, children: effectiveSections.map((section, idx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px", minWidth: "140px" }, children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 700, color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.04em" }, children: section.title }),
                /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: section.links.map((link, lIdx) => /* @__PURE__ */ jsxs(
                  "a",
                  {
                    href: link.href,
                    style: {
                      textDecoration: "none",
                      display: "flex",
                      flexDirection: "column"
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500, color: "#334155" }, children: link.label }),
                      link.description && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "#94a3b8" }, children: link.description })
                    ]
                  },
                  lIdx
                )) })
              ] }, idx)) }),
              featured && /* @__PURE__ */ jsx("div", { style: { borderLeft: "1px solid #f1f5f9", paddingLeft: "24px", minWidth: "180px" }, children: featured })
            ]
          }
        )
      ]
    }
  );
};
MegaMenu.displayName = "MegaMenu";
var Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = ""
}) => {
  const getPages = () => {
    const pages = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("...");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }
    return pages;
  };
  return /* @__PURE__ */ jsxs(
    "nav",
    {
      "aria-label": "Pagination",
      className: `boost-pagination ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: currentPage === 1,
            onClick: () => onPageChange(currentPage - 1),
            "aria-label": "Previous page",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              color: "#334155",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.4 : 1
            },
            children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) })
          }
        ),
        getPages().map((page, idx) => {
          if (typeof page === "string") {
            return /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  width: "32px",
                  height: "32px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#94a3b8",
                  fontSize: "13px"
                },
                children: "..."
              },
              idx
            );
          }
          const isCurrent = page === currentPage;
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: () => onPageChange(page),
              "aria-current": isCurrent ? "page" : void 0,
              style: {
                width: "32px",
                height: "32px",
                border: isCurrent ? "1px solid #2563eb" : "1px solid #cbd5e1",
                borderRadius: "6px",
                backgroundColor: isCurrent ? "#2563eb" : "#ffffff",
                color: isCurrent ? "#ffffff" : "#334155",
                fontSize: "13px",
                fontWeight: isCurrent ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s ease"
              },
              children: page
            },
            idx
          );
        }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: currentPage === totalPages,
            onClick: () => onPageChange(currentPage + 1),
            "aria-label": "Next page",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "32px",
              height: "32px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              backgroundColor: "#ffffff",
              color: "#334155",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.4 : 1
            },
            children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) })
          }
        )
      ]
    }
  );
};
Pagination.displayName = "Pagination";
var Tabs = ({
  tabs,
  items,
  defaultTab,
  activeTab: controlledTab,
  activeId: controlledId,
  onChange,
  className = ""
}) => {
  const tabList = items || tabs || [];
  const currentActive = controlledId !== void 0 ? controlledId : controlledTab;
  const [internalTab, setInternalTab] = React.useState(
    currentActive || defaultTab || (tabList[0] ? tabList[0].id : "")
  );
  const active = currentActive !== void 0 ? currentActive : internalTab;
  const handleTabClick = (id) => {
    if (currentActive === void 0) {
      setInternalTab(id);
    }
    if (onChange) onChange(id);
  };
  const currentTab = tabList.find((t) => t.id === active) || tabList[0];
  return /* @__PURE__ */ jsxs("div", { className: `boost-tabs ${className}`, style: { fontFamily: "inherit", width: "100%" }, children: [
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "tablist",
        style: {
          display: "flex",
          borderBottom: "1px solid #e2e8f0",
          gap: "8px",
          overflowX: "auto"
        },
        children: tabList.map((tab) => {
          const isActive = tab.id === active;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              role: "tab",
              "aria-selected": isActive,
              disabled: tab.disabled,
              onClick: () => handleTabClick(tab.id),
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "#2563eb" : "#64748b",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid #2563eb" : "2px solid transparent",
                cursor: tab.disabled ? "not-allowed" : "pointer",
                opacity: tab.disabled ? 0.5 : 1,
                whiteSpace: "nowrap",
                transition: "all 0.15s ease"
              },
              children: [
                tab.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: tab.icon }),
                /* @__PURE__ */ jsx("span", { children: tab.label }),
                tab.badge !== void 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "9999px",
                      backgroundColor: isActive ? "#dbeafe" : "#f1f5f9",
                      color: isActive ? "#1d4ed8" : "#64748b"
                    },
                    children: tab.badge
                  }
                )
              ]
            },
            tab.id
          );
        })
      }
    ),
    /* @__PURE__ */ jsx("div", { role: "tabpanel", style: { padding: "16px 0" }, children: currentTab ? currentTab.content : null })
  ] });
};
Tabs.displayName = "Tabs";
var Stepper = ({
  steps,
  activeStep,
  currentStep,
  onStepClick,
  className = ""
}) => {
  const activeIdx = currentStep !== void 0 ? currentStep - 1 : activeStep ?? 0;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-stepper ${className}`,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        fontFamily: "inherit",
        position: "relative"
      },
      children: steps.map((step, idx) => {
        const isCompleted = idx < activeIdx;
        const isCurrent = idx === activeIdx;
        const isClickable = onStepClick && idx <= activeIdx;
        const displayLabel = step.label || step.title || "";
        return /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => isClickable && onStepClick(idx),
            style: {
              display: "flex",
              alignItems: "center",
              flex: idx === steps.length - 1 ? "none" : 1,
              cursor: isClickable ? "pointer" : "default"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: "32px",
                      height: "32px",
                      borderRadius: "50%",
                      backgroundColor: isCompleted ? "#16a34a" : isCurrent ? "#2563eb" : "#f1f5f9",
                      color: isCompleted || isCurrent ? "#ffffff" : "#64748b",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: "13px",
                      fontWeight: 700,
                      border: `2px solid ${isCompleted ? "#16a34a" : isCurrent ? "#2563eb" : "#cbd5e1"}`,
                      transition: "all 0.2s ease",
                      flexShrink: 0
                    },
                    children: isCompleted ? /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) : idx + 1
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
                  /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        fontSize: "13px",
                        fontWeight: isCurrent ? 700 : 500,
                        color: isCurrent ? "#0f172a" : "#64748b",
                        whiteSpace: "nowrap"
                      },
                      children: displayLabel
                    }
                  ),
                  step.description && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "#94a3b8" }, children: step.description })
                ] })
              ] }),
              idx < steps.length - 1 && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    flex: 1,
                    height: "2px",
                    backgroundColor: idx < activeIdx ? "#16a34a" : "#e2e8f0",
                    margin: "0 12px",
                    minWidth: "24px",
                    transition: "background-color 0.2s ease"
                  }
                }
              )
            ]
          },
          step.id
        );
      })
    }
  );
};
Stepper.displayName = "Stepper";
var BackButton = ({
  label = "Back",
  onBack,
  className = "",
  style,
  ...props
}) => {
  const handleClick = () => {
    if (onBack) {
      onBack();
    } else if (typeof window !== "undefined" && window.history) {
      window.history.back();
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleClick,
      className: `boost-back-btn ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        background: "none",
        border: "none",
        color: "#475569",
        fontSize: "14px",
        fontWeight: 500,
        cursor: "pointer",
        padding: "6px 8px",
        borderRadius: "6px",
        fontFamily: "inherit",
        transition: "color 0.15s ease, background-color 0.15s ease",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) }),
        /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
};
BackButton.displayName = "BackButton";
function Table({
  columns,
  data,
  striped = false,
  bordered = true,
  hoverable = true,
  className = "",
  keyExtractor = (_, idx) => idx
}) {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-table-wrapper ${className}`,
      style: {
        width: "100%",
        overflowX: "auto",
        border: bordered ? "1px solid #e2e8f0" : "none",
        borderRadius: "8px",
        fontFamily: "inherit"
      },
      children: /* @__PURE__ */ jsxs(
        "table",
        {
          style: {
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "13px",
            textAlign: "left",
            color: "#334155"
          },
          children: [
            /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0" }, children: columns.map((col, idx) => /* @__PURE__ */ jsx(
              "th",
              {
                style: {
                  padding: "12px 16px",
                  fontWeight: 600,
                  color: "#0f172a",
                  textAlign: col.align || "left",
                  width: col.width,
                  whiteSpace: "nowrap"
                },
                children: col.header
              },
              idx
            )) }) }),
            /* @__PURE__ */ jsx("tbody", { children: data.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx(
              "td",
              {
                colSpan: columns.length,
                style: {
                  padding: "32px",
                  textAlign: "center",
                  color: "#94a3b8"
                },
                children: "No data available"
              }
            ) }) : data.map((row, rIdx) => {
              const isEven = rIdx % 2 === 0;
              return /* @__PURE__ */ jsx(
                "tr",
                {
                  style: {
                    backgroundColor: striped && !isEven ? "#f8fafc" : "#ffffff",
                    borderBottom: rIdx === data.length - 1 ? "none" : "1px solid #f1f5f9",
                    transition: hoverable ? "background-color 0.15s ease" : "none"
                  },
                  children: columns.map((col, cIdx) => {
                    const colKey = col.accessor || col.key;
                    const content = typeof col.accessor === "function" ? col.accessor(row) : colKey ? row[colKey] : null;
                    return /* @__PURE__ */ jsx(
                      "td",
                      {
                        style: {
                          padding: "12px 16px",
                          textAlign: col.align || "left",
                          verticalAlign: "middle"
                        },
                        children: content
                      },
                      cIdx
                    );
                  })
                },
                keyExtractor(row, rIdx)
              );
            }) })
          ]
        }
      )
    }
  );
}
Table.displayName = "Table";
function DataTable({
  columns,
  data,
  pageSize = 5,
  searchable = false,
  searchPlaceholder = "Search records...",
  searchFilter,
  className = ""
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [currentPage, setCurrentPage] = React.useState(1);
  const filteredData = React.useMemo(() => {
    if (!searchable || !searchQuery) return data;
    if (searchFilter) {
      return data.filter((item) => searchFilter(item, searchQuery));
    }
    const q = searchQuery.toLowerCase();
    return data.filter(
      (item) => Object.values(item).some(
        (val) => val && String(val).toLowerCase().includes(q)
      )
    );
  }, [data, searchQuery, searchFilter, searchable]);
  const totalPages = Math.ceil(filteredData.length / pageSize) || 1;
  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );
  return /* @__PURE__ */ jsxs("div", { className: `boost-data-table ${className}`, style: { fontFamily: "inherit", display: "flex", flexDirection: "column", gap: "16px" }, children: [
    searchable && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { maxWidth: "300px", width: "100%" }, children: /* @__PURE__ */ jsx(
        SearchInput,
        {
          value: searchQuery,
          onChange: (e) => {
            setSearchQuery(e.target.value);
            setCurrentPage(1);
          },
          onClear: () => setSearchQuery(""),
          placeholder: searchPlaceholder
        }
      ) }),
      /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", color: "#64748b" }, children: [
        "Showing ",
        paginatedData.length,
        " of ",
        filteredData.length,
        " records"
      ] })
    ] }),
    /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          width: "100%",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch",
          border: "1px solid var(--boost-border, #e2e8f0)",
          borderRadius: "var(--boost-radius, 12px)",
          backgroundColor: "var(--boost-surface, #ffffff)",
          boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))"
        },
        children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left", color: "var(--boost-text, #334155)", minWidth: "480px" }, children: [
          /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { backgroundColor: "var(--boost-bg, #f8fafc)", borderBottom: "1px solid var(--boost-border, #e2e8f0)" }, children: columns.map((col, idx) => /* @__PURE__ */ jsx("th", { style: { padding: "13px 16px", fontWeight: 700, color: "var(--boost-text, #0f172a)", textAlign: col.align || "left", width: col.width, whiteSpace: "nowrap" }, children: col.header }, idx)) }) }),
          /* @__PURE__ */ jsx("tbody", { children: paginatedData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length, style: { padding: "36px", textAlign: "center", color: "var(--boost-text-muted, #94a3b8)" }, children: "No records matching your search" }) }) : paginatedData.map((row, rIdx) => /* @__PURE__ */ jsx("tr", { style: { borderBottom: rIdx === paginatedData.length - 1 ? "none" : "1px solid var(--boost-border, #f1f5f9)", transition: "background-color 0.1s ease" }, children: columns.map((col, cIdx) => {
            const accessor = col.accessor;
            const content = typeof accessor === "function" ? accessor(row) : accessor !== void 0 ? row[accessor] : "";
            return /* @__PURE__ */ jsx("td", { style: { padding: "13px 16px", textAlign: col.align || "left" }, children: content }, cIdx);
          }) }, rIdx)) })
        ] })
      }
    ),
    totalPages > 1 && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "4px" }, children: /* @__PURE__ */ jsx(
      Pagination,
      {
        currentPage,
        totalPages,
        onPageChange: setCurrentPage
      }
    ) })
  ] });
}
DataTable.displayName = "DataTable";
var StatsCard = ({
  title,
  value,
  change,
  isPositive = true,
  period = "vs last month",
  icon,
  className = ""
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-stats-card ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "clamp(16px, 2.5vw, 22px)",
        fontFamily: "inherit",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        width: "100%",
        boxSizing: "border-box",
        transition: "transform 0.2s ease, box-shadow 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text-muted, #64748b)" }, children: title }),
          icon && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "38px",
                height: "38px",
                borderRadius: "10px",
                backgroundColor: "var(--boost-bg, #f1f5f9)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--boost-primary, #2563eb)"
              },
              children: icon
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { fontSize: "clamp(22px, 2.5vw, 28px)", fontWeight: 800, color: "var(--boost-text, #0f172a)", marginBottom: "8px", letterSpacing: "-0.02em" }, children: value }),
        change !== void 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }, children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                fontWeight: 700,
                color: isPositive ? "#16a34a" : "#dc2626",
                backgroundColor: isPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(220, 38, 38, 0.1)",
                padding: "2px 8px",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px"
              },
              children: [
                isPositive ? /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "18 15 12 9 6 15" }) }) : /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) }),
                change
              ]
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-text-muted, #94a3b8)" }, children: period })
        ] })
      ]
    }
  );
};
StatsCard.displayName = "StatsCard";
var KPIWidget = ({
  title,
  value,
  change,
  changePeriod = "vs last month",
  icon,
  subtitle,
  sparkline,
  className = "",
  style,
  ...props
}) => {
  const numericChange = typeof change === "string" ? parseFloat(change.replace("%", "").replace("+", "")) : change;
  const isPositive = numericChange !== void 0 && !isNaN(numericChange) ? numericChange >= 0 : void 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-kpi-widget ${className}`,
      style: {
        padding: "clamp(16px, 3.5vw, 24px)",
        borderRadius: "var(--boost-radius, 16px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        boxShadow: "var(--boost-shadow-sm, 0 4px 12px rgba(0, 0, 0, 0.04))",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              marginBottom: "14px"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "13px",
                    fontWeight: 600,
                    color: "var(--boost-muted, #64748b)",
                    letterSpacing: "-0.01em"
                  },
                  children: title
                }
              ),
              icon && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    width: "36px",
                    height: "36px",
                    borderRadius: "10px",
                    backgroundColor: "rgba(59, 130, 246, 0.08)",
                    color: "var(--boost-primary, #2563eb)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: "18px",
                    flexShrink: 0
                  },
                  children: icon
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { marginBottom: "12px" }, children: /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              fontSize: "clamp(24px, 4vw, 32px)",
              fontWeight: 800,
              color: "var(--boost-text, #0f172a)",
              lineHeight: 1.15,
              letterSpacing: "-0.02em"
            },
            children: value
          }
        ) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px"
            },
            children: [
              numericChange !== void 0 && !isNaN(numericChange) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "3px",
                      fontSize: "12px",
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: "999px",
                      backgroundColor: isPositive ? "rgba(34, 197, 94, 0.12)" : "rgba(239, 68, 68, 0.12)",
                      color: isPositive ? "#16a34a" : "#dc2626"
                    },
                    children: [
                      isPositive ? "\u25B2 +" : "\u25BC ",
                      Math.abs(numericChange),
                      "%"
                    ]
                  }
                ),
                changePeriod && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "12px",
                      color: "var(--boost-text-muted, #94a3b8)"
                    },
                    children: changePeriod
                  }
                )
              ] }),
              subtitle && !change && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "12px",
                    color: "var(--boost-text-muted, #94a3b8)"
                  },
                  children: subtitle
                }
              ),
              sparkline && /* @__PURE__ */ jsx("div", { children: sparkline })
            ]
          }
        )
      ]
    }
  );
};
KPIWidget.displayName = "KPIWidget";
var AreaChart = ({
  data = [],
  title,
  subtitle,
  height = 240,
  color = "#3b82f6",
  secondaryColor = "#94a3b8",
  primaryLabel = "Current",
  secondaryLabel = "Previous",
  valuePrefix = "",
  valueSuffix = "",
  showGrid = true,
  showDots = true,
  className = "",
  style
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--boost-text-muted, #94a3b8)",
          fontSize: "13px",
          fontFamily: "inherit"
        },
        children: "No chart data available"
      }
    );
  }
  const allValues = data.flatMap((d) => [d.value, d.secondaryValue !== void 0 ? d.secondaryValue : d.value]);
  const rawMin = Math.min(...allValues);
  const rawMax = Math.max(...allValues);
  const min = rawMin > 0 ? 0 : rawMin;
  const max = rawMax === min ? min + 10 : rawMax * 1.1;
  const range = max - min || 1;
  const width = 600;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 20;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const getX = (idx) => paddingLeft + idx / (data.length - 1 || 1) * chartWidth;
  const getY = (val) => paddingTop + chartHeight - (val - min) / range * chartHeight;
  const primaryPoints = data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.value).toFixed(1)}`);
  const primaryPathD = `M ${primaryPoints.join(" L ")}`;
  const primaryAreaD = `M ${getX(0)},${paddingTop + chartHeight} L ${primaryPoints.join(" L ")} L ${getX(data.length - 1)},${paddingTop + chartHeight} Z`;
  const hasSecondary = data.some((d) => d.secondaryValue !== void 0);
  const secondaryPoints = hasSecondary ? data.map((d, i) => `${getX(i).toFixed(1)},${getY(d.secondaryValue || 0).toFixed(1)}`) : [];
  const secondaryPathD = hasSecondary ? `M ${secondaryPoints.join(" L ")}` : "";
  const rawId = React.useId();
  const gradientId = `boost-area-${rawId.replace(/:/g, "")}`;
  const gridSteps = [0, 0.33, 0.66, 1];
  const formatNumber2 = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
    return Math.round(num).toString();
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-area-chart ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "20px",
        fontFamily: "inherit",
        boxSizing: "border-box",
        width: "100%",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        ...style
      },
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            title && /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.01em" }, children: title }),
            subtitle && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "13px", color: "var(--boost-text-muted, #64748b)" }, children: subtitle })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "14px", fontSize: "12px", fontWeight: 600 }, children: [
            /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--boost-text, #0f172a)" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: color } }),
              primaryLabel
            ] }),
            hasSecondary && /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--boost-text-muted, #64748b)" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: "10px", height: "10px", borderRadius: "50%", backgroundColor: secondaryColor } }),
              secondaryLabel
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: "100%" }, children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              viewBox: `0 0 ${width} ${height}`,
              style: { width: "100%", height: "auto", overflow: "visible" },
              onMouseLeave: () => setHoverIndex(null),
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: color, stopOpacity: "0.25" }),
                  /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: color, stopOpacity: "0.0" })
                ] }) }),
                showGrid && gridSteps.map((step, idx) => {
                  const yVal = min + (1 - step) * range;
                  const yPos = paddingTop + step * chartHeight;
                  return /* @__PURE__ */ jsxs("g", { children: [
                    /* @__PURE__ */ jsx(
                      "line",
                      {
                        x1: paddingLeft,
                        y1: yPos,
                        x2: width - paddingRight,
                        y2: yPos,
                        stroke: "var(--boost-border, #e2e8f0)",
                        strokeDasharray: step === 1 ? "none" : "3 3",
                        strokeWidth: "1"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "text",
                      {
                        x: paddingLeft - 8,
                        y: yPos + 4,
                        textAnchor: "end",
                        fill: "var(--boost-text-muted, #94a3b8)",
                        fontSize: "10",
                        fontWeight: "500",
                        children: [
                          valuePrefix,
                          formatNumber2(yVal)
                        ]
                      }
                    )
                  ] }, idx);
                }),
                /* @__PURE__ */ jsx("path", { d: primaryAreaD, fill: `url(#${gradientId})` }),
                hasSecondary && /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: secondaryPathD,
                    fill: "none",
                    stroke: secondaryColor,
                    strokeWidth: "2",
                    strokeDasharray: "4 4",
                    strokeLinecap: "round"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "path",
                  {
                    d: primaryPathD,
                    fill: "none",
                    stroke: color,
                    strokeWidth: "2.5",
                    strokeLinecap: "round",
                    strokeLinejoin: "round"
                  }
                ),
                hoverIndex !== null && /* @__PURE__ */ jsx(
                  "line",
                  {
                    x1: getX(hoverIndex),
                    y1: paddingTop,
                    x2: getX(hoverIndex),
                    y2: paddingTop + chartHeight,
                    stroke: "var(--boost-text-muted, #94a3b8)",
                    strokeWidth: "1.5",
                    strokeDasharray: "3 3"
                  }
                ),
                data.map((d, i) => {
                  const x = getX(i);
                  const y = getY(d.value);
                  const isHovered = hoverIndex === i;
                  return /* @__PURE__ */ jsxs("g", { children: [
                    showDots && /* @__PURE__ */ jsx(
                      "circle",
                      {
                        cx: x,
                        cy: y,
                        r: isHovered ? 5 : 3.5,
                        fill: "var(--boost-surface, #ffffff)",
                        stroke: color,
                        strokeWidth: isHovered ? 3 : 2,
                        style: { transition: "all 0.15s ease" }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "text",
                      {
                        x,
                        y: height - 8,
                        textAnchor: "middle",
                        fill: isHovered ? "var(--boost-primary, #3b82f6)" : "var(--boost-text-muted, #64748b)",
                        fontSize: "11",
                        fontWeight: isHovered ? "700" : "500",
                        children: d.label
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: x - chartWidth / (data.length * 2),
                        y: 0,
                        width: chartWidth / data.length,
                        height,
                        fill: "transparent",
                        style: { cursor: "pointer" },
                        onMouseEnter: () => setHoverIndex(i)
                      }
                    )
                  ] }, i);
                })
              ]
            }
          ),
          hoverIndex !== null && /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                position: "absolute",
                top: `${getY(data[hoverIndex].value) - 45}px`,
                left: `${getX(hoverIndex) / width * 100}%`,
                transform: "translate(-50%, -100%)",
                backgroundColor: "var(--boost-text, #0f172a)",
                color: "var(--boost-surface, #ffffff)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                boxShadow: "var(--boost-shadow-md, 0 4px 12px rgba(0,0,0,0.15))",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                animation: "boost-fadeIn 0.15s ease"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }, children: data[hoverIndex].label }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 700, color: "#60a5fa" }, children: [
                  valuePrefix,
                  data[hoverIndex].value.toLocaleString(),
                  valueSuffix
                ] }),
                data[hoverIndex].secondaryValue !== void 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", opacity: 0.7 }, children: [
                  "Prev: ",
                  valuePrefix,
                  data[hoverIndex].secondaryValue?.toLocaleString(),
                  valueSuffix
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
};
AreaChart.displayName = "AreaChart";
var BarChart = ({
  data = [],
  title,
  subtitle,
  height = 240,
  color = "#3b82f6",
  secondaryColor = "#94a3b8",
  primaryLabel = "Current",
  secondaryLabel = "Previous",
  valuePrefix = "",
  valueSuffix = "",
  showGrid = true,
  className = "",
  style
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          height: `${height}px`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "var(--boost-text-muted, #94a3b8)",
          fontSize: "13px",
          fontFamily: "inherit"
        },
        children: "No chart data available"
      }
    );
  }
  const hasSecondary = data.some((d) => d.secondaryValue !== void 0);
  const allValues = data.flatMap((d) => [d.value, d.secondaryValue || 0]);
  const rawMax = Math.max(...allValues);
  const max = rawMax === 0 ? 10 : rawMax * 1.15;
  const width = 600;
  const paddingTop = 20;
  const paddingBottom = 30;
  const paddingLeft = 40;
  const paddingRight = 20;
  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;
  const barGroupWidth = chartWidth / data.length;
  const barWidth = hasSecondary ? Math.min(22, barGroupWidth * 0.35) : Math.min(36, barGroupWidth * 0.55);
  const getY = (val) => paddingTop + chartHeight - val / max * chartHeight;
  const getBarHeight = (val) => val / max * chartHeight;
  const formatNumber2 = (num) => {
    if (num >= 1e6) return `${(num / 1e6).toFixed(1)}M`;
    if (num >= 1e3) return `${(num / 1e3).toFixed(1)}k`;
    return Math.round(num).toString();
  };
  const gridSteps = [0, 0.33, 0.66, 1];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-bar-chart ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "20px",
        fontFamily: "inherit",
        boxSizing: "border-box",
        width: "100%",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        ...style
      },
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "12px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            title && /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.01em" }, children: title }),
            subtitle && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "13px", color: "var(--boost-text-muted, #64748b)" }, children: subtitle })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "14px", fontSize: "12px", fontWeight: 600 }, children: [
            /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--boost-text, #0f172a)" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: "10px", height: "10px", borderRadius: "3px", backgroundColor: color } }),
              primaryLabel
            ] }),
            hasSecondary && /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px", color: "var(--boost-text-muted, #64748b)" }, children: [
              /* @__PURE__ */ jsx("span", { style: { width: "10px", height: "10px", borderRadius: "3px", backgroundColor: secondaryColor } }),
              secondaryLabel
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: "100%" }, children: [
          /* @__PURE__ */ jsxs(
            "svg",
            {
              viewBox: `0 0 ${width} ${height}`,
              style: { width: "100%", height: "auto", overflow: "visible" },
              onMouseLeave: () => setHoverIndex(null),
              children: [
                showGrid && gridSteps.map((step, idx) => {
                  const yVal = (1 - step) * max;
                  const yPos = paddingTop + step * chartHeight;
                  return /* @__PURE__ */ jsxs("g", { children: [
                    /* @__PURE__ */ jsx(
                      "line",
                      {
                        x1: paddingLeft,
                        y1: yPos,
                        x2: width - paddingRight,
                        y2: yPos,
                        stroke: "var(--boost-border, #e2e8f0)",
                        strokeDasharray: step === 1 ? "none" : "3 3",
                        strokeWidth: "1"
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "text",
                      {
                        x: paddingLeft - 8,
                        y: yPos + 4,
                        textAnchor: "end",
                        fill: "var(--boost-text-muted, #94a3b8)",
                        fontSize: "10",
                        fontWeight: "500",
                        children: [
                          valuePrefix,
                          formatNumber2(yVal)
                        ]
                      }
                    )
                  ] }, idx);
                }),
                data.map((d, i) => {
                  const groupX = paddingLeft + i * barGroupWidth;
                  const centerX = groupX + barGroupWidth / 2;
                  const isHovered = hoverIndex === i;
                  const primaryHeight = getBarHeight(d.value);
                  const primaryY = getY(d.value);
                  const primaryX = hasSecondary ? centerX - barWidth - 2 : centerX - barWidth / 2;
                  const secondaryX = centerX + 2;
                  return /* @__PURE__ */ jsxs("g", { children: [
                    /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: primaryX,
                        y: primaryY,
                        width: barWidth,
                        height: primaryHeight,
                        rx: "4",
                        ry: "4",
                        fill: color,
                        opacity: isHovered ? 1 : 0.85,
                        style: { transition: "all 0.15s ease" }
                      }
                    ),
                    hasSecondary && d.secondaryValue !== void 0 && /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: secondaryX,
                        y: getY(d.secondaryValue),
                        width: barWidth,
                        height: getBarHeight(d.secondaryValue),
                        rx: "4",
                        ry: "4",
                        fill: secondaryColor,
                        opacity: isHovered ? 0.9 : 0.65,
                        style: { transition: "all 0.15s ease" }
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "text",
                      {
                        x: centerX,
                        y: height - 8,
                        textAnchor: "middle",
                        fill: isHovered ? "var(--boost-primary, #3b82f6)" : "var(--boost-text-muted, #64748b)",
                        fontSize: "11",
                        fontWeight: isHovered ? "700" : "500",
                        children: d.label
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "rect",
                      {
                        x: groupX,
                        y: 0,
                        width: barGroupWidth,
                        height,
                        fill: "transparent",
                        style: { cursor: "pointer" },
                        onMouseEnter: () => setHoverIndex(i)
                      }
                    )
                  ] }, i);
                })
              ]
            }
          ),
          hoverIndex !== null && /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                position: "absolute",
                top: `${getY(data[hoverIndex].value) - 45}px`,
                left: `${(paddingLeft + hoverIndex * barGroupWidth + barGroupWidth / 2) / width * 100}%`,
                transform: "translate(-50%, -100%)",
                backgroundColor: "var(--boost-text, #0f172a)",
                color: "var(--boost-surface, #ffffff)",
                padding: "6px 12px",
                borderRadius: "8px",
                fontSize: "12px",
                fontWeight: 600,
                pointerEvents: "none",
                whiteSpace: "nowrap",
                boxShadow: "var(--boost-shadow-md, 0 4px 12px rgba(0,0,0,0.15))",
                zIndex: 10,
                display: "flex",
                flexDirection: "column",
                gap: "2px",
                animation: "boost-fadeIn 0.15s ease"
              },
              children: [
                /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", opacity: 0.8, textTransform: "uppercase" }, children: data[hoverIndex].label }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", fontWeight: 700, color: "#60a5fa" }, children: [
                  primaryLabel,
                  ": ",
                  valuePrefix,
                  data[hoverIndex].value.toLocaleString(),
                  valueSuffix
                ] }),
                hasSecondary && data[hoverIndex].secondaryValue !== void 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", opacity: 0.8 }, children: [
                  secondaryLabel,
                  ": ",
                  valuePrefix,
                  data[hoverIndex].secondaryValue?.toLocaleString(),
                  valueSuffix
                ] })
              ]
            }
          )
        ] })
      ]
    }
  );
};
BarChart.displayName = "BarChart";
var DEFAULT_PALETTE = [
  "#3b82f6",
  // blue
  "#10b981",
  // emerald
  "#f59e0b",
  // amber
  "#8b5cf6",
  // purple
  "#ec4899",
  // pink
  "#06b6d4",
  // cyan
  "#f97316"
  // orange
];
var DonutChart = ({
  data = [],
  title,
  subtitle,
  size = 220,
  innerRadiusRatio = 0.65,
  centerLabel,
  centerValue,
  valuePrefix = "",
  valueSuffix = "",
  showLegend = true,
  className = "",
  style
}) => {
  const [hoverIndex, setHoverIndex] = React.useState(null);
  if (!data || data.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          padding: "24px",
          textAlign: "center",
          color: "var(--boost-text-muted, #94a3b8)",
          fontSize: "13px",
          fontFamily: "inherit"
        },
        children: "No chart data available"
      }
    );
  }
  const total = data.reduce((acc, d) => acc + d.value, 0) || 1;
  const center = size / 2;
  const radius = size / 2 * 0.85;
  const innerRadius = radius * innerRadiusRatio;
  let cumulativeAngle = -Math.PI / 2;
  const slices = data.map((d, index) => {
    const sliceAngle = d.value / total * 2 * Math.PI;
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + sliceAngle;
    cumulativeAngle = endAngle;
    const sliceColor = d.color || DEFAULT_PALETTE[index % DEFAULT_PALETTE.length];
    const isHovered = hoverIndex === index;
    const x1 = center + radius * Math.cos(startAngle);
    const y1 = center + radius * Math.sin(startAngle);
    const x2 = center + radius * Math.cos(endAngle);
    const y2 = center + radius * Math.sin(endAngle);
    const x3 = center + innerRadius * Math.cos(endAngle);
    const y3 = center + innerRadius * Math.sin(endAngle);
    const x4 = center + innerRadius * Math.cos(startAngle);
    const y4 = center + innerRadius * Math.sin(startAngle);
    const largeArcFlag = sliceAngle > Math.PI ? 1 : 0;
    const pathD = `
      M ${x1} ${y1}
      A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}
      L ${x3} ${y3}
      A ${innerRadius} ${innerRadius} 0 ${largeArcFlag} 0 ${x4} ${y4}
      Z
    `;
    const percentage = (d.value / total * 100).toFixed(1);
    return {
      ...d,
      pathD,
      color: sliceColor,
      percentage,
      isHovered
    };
  });
  const activeSlice = hoverIndex !== null ? slices[hoverIndex] : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-donut-chart ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "20px",
        fontFamily: "inherit",
        boxSizing: "border-box",
        width: "100%",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        ...style
      },
      children: [
        (title || subtitle) && /* @__PURE__ */ jsxs("div", { style: { marginBottom: "16px" }, children: [
          title && /* @__PURE__ */ jsx("h4", { style: { margin: "0 0 4px", fontSize: "16px", fontWeight: 700, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.01em" }, children: title }),
          subtitle && /* @__PURE__ */ jsx("p", { style: { margin: 0, fontSize: "13px", color: "var(--boost-text-muted, #64748b)" }, children: subtitle })
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexWrap: "wrap",
              gap: "24px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { position: "relative", width: `${size}px`, height: `${size}px`, flexShrink: 0 }, children: [
                /* @__PURE__ */ jsx(
                  "svg",
                  {
                    viewBox: `0 0 ${size} ${size}`,
                    style: { width: "100%", height: "100%", overflow: "visible" },
                    onMouseLeave: () => setHoverIndex(null),
                    children: slices.map((slice, i) => /* @__PURE__ */ jsx(
                      "path",
                      {
                        d: slice.pathD,
                        fill: slice.color,
                        opacity: hoverIndex === null || hoverIndex === i ? 1 : 0.45,
                        transform: slice.isHovered ? `scale(1.04) translate(-${center * 0.04}, -${center * 0.04})` : void 0,
                        style: {
                          cursor: "pointer",
                          transition: "transform 0.2s ease, opacity 0.2s ease"
                        },
                        onMouseEnter: () => setHoverIndex(i)
                      },
                      i
                    ))
                  }
                ),
                innerRadiusRatio > 0 && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      position: "absolute",
                      top: "50%",
                      left: "50%",
                      transform: "translate(-50%, -50%)",
                      textAlign: "center",
                      pointerEvents: "none",
                      maxWidth: `${innerRadius * 1.6}px`
                    },
                    children: [
                      /* @__PURE__ */ jsx("div", { style: { fontSize: "11px", fontWeight: 600, color: "var(--boost-text-muted, #94a3b8)", textTransform: "uppercase" }, children: activeSlice ? activeSlice.label : centerLabel || "Total" }),
                      /* @__PURE__ */ jsx("div", { style: { fontSize: "18px", fontWeight: 800, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.02em", marginTop: "2px" }, children: activeSlice ? `${valuePrefix}${activeSlice.value.toLocaleString()}${valueSuffix}` : centerValue || `${valuePrefix}${total.toLocaleString()}${valueSuffix}` }),
                      activeSlice && /* @__PURE__ */ jsxs("div", { style: { fontSize: "11px", fontWeight: 700, color: activeSlice.color }, children: [
                        activeSlice.percentage,
                        "%"
                      ] })
                    ]
                  }
                )
              ] }),
              showLegend && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px", minWidth: "150px" }, children: slices.map((slice, i) => {
                const isHovered = hoverIndex === i;
                return /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onMouseEnter: () => setHoverIndex(i),
                    onMouseLeave: () => setHoverIndex(null),
                    style: {
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "12px",
                      padding: "4px 8px",
                      borderRadius: "6px",
                      backgroundColor: isHovered ? "var(--boost-bg, #f1f5f9)" : "transparent",
                      cursor: "pointer",
                      transition: "background-color 0.15s ease"
                    },
                    children: [
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              width: "10px",
                              height: "10px",
                              borderRadius: "3px",
                              backgroundColor: slice.color,
                              flexShrink: 0
                            }
                          }
                        ),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 500, color: "var(--boost-text, #0f172a)" }, children: slice.label })
                      ] }),
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }, children: [
                        /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, color: "var(--boost-text, #0f172a)" }, children: [
                          valuePrefix,
                          slice.value.toLocaleString(),
                          valueSuffix
                        ] }),
                        /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-text-muted, #94a3b8)", fontSize: "11px" }, children: [
                          "(",
                          slice.percentage,
                          "%)"
                        ] })
                      ] })
                    ]
                  },
                  i
                );
              }) })
            ]
          }
        )
      ]
    }
  );
};
DonutChart.displayName = "DonutChart";
var Sparkline = ({
  data = [],
  width = "100%",
  height = 36,
  color,
  strokeWidth = 2,
  showFill = true,
  autoColor = true,
  className = "",
  style
}) => {
  if (!data || data.length < 2) {
    return null;
  }
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const padding = 2;
  const svgWidth = 120;
  const svgHeight = height;
  const points = data.map((val, idx) => {
    const x = padding + idx / (data.length - 1) * (svgWidth - padding * 2);
    const y = svgHeight - padding - (val - min) / range * (svgHeight - padding * 2);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  });
  const pathD = `M ${points.join(" L ")}`;
  const firstPoint = points[0].split(",");
  const lastPoint = points[points.length - 1].split(",");
  const areaD = `M ${firstPoint[0]},${svgHeight} L ${points.join(" L ")} L ${lastPoint[0]},${svgHeight} Z`;
  const isUp = data[data.length - 1] >= data[0];
  const chartColor = color || (autoColor ? isUp ? "#10b981" : "#ef4444" : "#3b82f6");
  const rawId = React.useId();
  const gradientId = `boost-spark-${rawId.replace(/:/g, "")}`;
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-sparkline ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        width: typeof width === "number" ? `${width}px` : width,
        height: `${height}px`,
        overflow: "visible",
        ...style
      },
      children: /* @__PURE__ */ jsxs(
        "svg",
        {
          viewBox: `0 0 ${svgWidth} ${svgHeight}`,
          preserveAspectRatio: "none",
          style: {
            width: "100%",
            height: "100%",
            overflow: "visible"
          },
          children: [
            /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, x1: "0", y1: "0", x2: "0", y2: "1", children: [
              /* @__PURE__ */ jsx("stop", { offset: "0%", stopColor: chartColor, stopOpacity: "0.3" }),
              /* @__PURE__ */ jsx("stop", { offset: "100%", stopColor: chartColor, stopOpacity: "0.0" })
            ] }) }),
            showFill && /* @__PURE__ */ jsx("path", { d: areaD, fill: `url(#${gradientId})` }),
            /* @__PURE__ */ jsx(
              "path",
              {
                d: pathD,
                fill: "none",
                stroke: chartColor,
                strokeWidth,
                strokeLinecap: "round",
                strokeLinejoin: "round"
              }
            ),
            /* @__PURE__ */ jsx(
              "circle",
              {
                cx: lastPoint[0],
                cy: lastPoint[1],
                r: 2.5,
                fill: chartColor
              }
            )
          ]
        }
      )
    }
  );
};
Sparkline.displayName = "Sparkline";
var ActivityFeed = ({
  items,
  title,
  emptyText = "No recent activities found.",
  className = "",
  style,
  ...props
}) => {
  const getBadgeColors = (variant = "info") => {
    switch (variant) {
      case "success":
        return { bg: "rgba(34, 197, 94, 0.12)", color: "#16a34a" };
      case "warning":
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#d97706" };
      case "error":
        return { bg: "rgba(239, 68, 68, 0.12)", color: "#dc2626" };
      default:
        return { bg: "rgba(37, 99, 235, 0.12)", color: "#2563eb" };
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-activity-feed ${className}`,
      style: {
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: [
        title && /* @__PURE__ */ jsx(
          "h3",
          {
            style: {
              fontSize: "16px",
              fontWeight: 700,
              margin: "0 0 20px 0",
              color: "var(--boost-text, #0f172a)"
            },
            children: title
          }
        ),
        items.length === 0 ? /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              padding: "24px",
              textAlign: "center",
              color: "var(--boost-text-muted, #64748b)",
              fontSize: "14px"
            },
            children: emptyText
          }
        ) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "16px" }, children: items.map((item, idx) => {
          const badgeStyle = item.statusBadge ? getBadgeColors(item.statusBadge.variant) : null;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: "14px",
                padding: "12px 14px",
                borderRadius: "var(--boost-radius, 8px)",
                backgroundColor: "var(--boost-surface, #f8fafc)",
                border: "1px solid var(--boost-border, #e2e8f0)",
                transition: "background-color 0.15s ease"
              },
              children: [
                item.user.avatar ? /* @__PURE__ */ jsx(
                  "img",
                  {
                    src: item.user.avatar,
                    alt: item.user.name,
                    style: {
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      objectFit: "cover",
                      border: "1px solid var(--boost-border, #cbd5e1)"
                    }
                  }
                ) : /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: "36px",
                      height: "36px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      color: "var(--boost-primary, #2563eb)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontWeight: 700,
                      fontSize: "14px",
                      flexShrink: 0
                    },
                    children: item.user.name.charAt(0).toUpperCase()
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        fontSize: "14px",
                        color: "var(--boost-text, #0f172a)",
                        lineHeight: 1.4,
                        marginBottom: "4px"
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: item.user.name }),
                        " ",
                        /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-text-muted, #64748b)" }, children: item.action }),
                        " ",
                        item.target && /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: "var(--boost-text, #0f172a)" }, children: item.target })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        display: "flex",
                        alignItems: "center",
                        gap: "10px"
                      },
                      children: [
                        /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "12px",
                              color: "var(--boost-text-muted, #94a3b8)"
                            },
                            children: item.timestamp
                          }
                        ),
                        item.statusBadge && badgeStyle && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "11px",
                              fontWeight: 700,
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              backgroundColor: badgeStyle.bg,
                              color: badgeStyle.color
                            },
                            children: item.statusBadge.label
                          }
                        )
                      ]
                    }
                  )
                ] })
              ]
            },
            item.id || idx
          );
        }) })
      ]
    }
  );
};
ActivityFeed.displayName = "ActivityFeed";
var NotificationCenter = ({
  notifications,
  onMarkAllAsRead,
  onItemClick,
  onClearAll,
  title = "Notifications",
  emptyText = "You have no new notifications.",
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `boost-notification-center ${className}`,
      style: { position: "relative", display: "inline-block" },
      children: [
        /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setIsOpen((prev) => !prev),
            "aria-label": "Open notifications",
            style: {
              position: "relative",
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: "8px",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "inherit",
              transition: "background-color 0.15s ease"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  children: [
                    /* @__PURE__ */ jsx("path", { d: "M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" }),
                    /* @__PURE__ */ jsx("path", { d: "M10.3 21a1.94 1.94 0 0 0 3.4 0" })
                  ]
                }
              ),
              unreadCount > 0 && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    position: "absolute",
                    top: "4px",
                    right: "4px",
                    backgroundColor: "#dc2626",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    minWidth: "16px",
                    height: "16px",
                    borderRadius: "8px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0 4px",
                    lineHeight: 1
                  },
                  children: unreadCount > 99 ? "99+" : unreadCount
                }
              )
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "absolute",
              top: "calc(100% + 8px)",
              right: 0,
              width: "360px",
              maxWidth: "90vw",
              backgroundColor: "var(--boost-bg, #ffffff)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "var(--boost-radius, 12px)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)",
              zIndex: 9999,
              overflow: "hidden"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 18px",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { fontWeight: 700, fontSize: "15px", color: "var(--boost-text, #0f172a)" }, children: title }),
                      unreadCount > 0 && /* @__PURE__ */ jsxs(
                        "span",
                        {
                          style: {
                            backgroundColor: "rgba(37, 99, 235, 0.1)",
                            color: "var(--boost-primary, #2563eb)",
                            fontSize: "11px",
                            fontWeight: 700,
                            padding: "2px 6px",
                            borderRadius: "9999px"
                          },
                          children: [
                            unreadCount,
                            " new"
                          ]
                        }
                      )
                    ] }),
                    onMarkAllAsRead && unreadCount > 0 && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onMarkAllAsRead,
                        style: {
                          background: "none",
                          border: "none",
                          color: "var(--boost-primary, #2563eb)",
                          fontSize: "12px",
                          fontWeight: 600,
                          cursor: "pointer",
                          padding: 0
                        },
                        children: "Mark all as read"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { maxHeight: "340px", overflowY: "auto" }, children: notifications.length === 0 ? /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    padding: "36px 20px",
                    textAlign: "center",
                    color: "var(--boost-text-muted, #64748b)",
                    fontSize: "13px"
                  },
                  children: emptyText
                }
              ) : notifications.map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => onItemClick && onItemClick(item),
                  style: {
                    display: "flex",
                    alignItems: "flex-start",
                    gap: "12px",
                    padding: "12px 18px",
                    borderBottom: "1px solid var(--boost-border, #f1f5f9)",
                    backgroundColor: item.read ? "transparent" : "rgba(37, 99, 235, 0.03)",
                    cursor: onItemClick ? "pointer" : "default",
                    transition: "background-color 0.15s ease"
                  },
                  children: [
                    item.avatar ? /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: item.avatar,
                        alt: "",
                        style: {
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          objectFit: "cover",
                          flexShrink: 0
                        }
                      }
                    ) : item.icon ? /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: "36px",
                          height: "36px",
                          borderRadius: "50%",
                          backgroundColor: "rgba(37, 99, 235, 0.1)",
                          color: "var(--boost-primary, #2563eb)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0
                        },
                        children: item.icon
                      }
                    ) : /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: "8px",
                          height: "8px",
                          borderRadius: "50%",
                          backgroundColor: item.read ? "transparent" : "#2563eb",
                          marginTop: "6px",
                          flexShrink: 0
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            fontSize: "13px",
                            fontWeight: item.read ? 500 : 700,
                            color: "var(--boost-text, #0f172a)",
                            marginBottom: "2px",
                            lineHeight: 1.4
                          },
                          children: item.title
                        }
                      ),
                      item.description && /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            fontSize: "12px",
                            color: "var(--boost-text-muted, #64748b)",
                            lineHeight: 1.4,
                            marginBottom: "4px"
                          },
                          children: item.description
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            fontSize: "11px",
                            color: "var(--boost-text-muted, #94a3b8)"
                          },
                          children: item.timestamp
                        }
                      )
                    ] })
                  ]
                },
                item.id
              )) }),
              onClearAll && notifications.length > 0 && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    padding: "10px",
                    textAlign: "center",
                    borderTop: "1px solid var(--boost-border, #e2e8f0)",
                    backgroundColor: "var(--boost-surface, #f8fafc)"
                  },
                  children: /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: onClearAll,
                      style: {
                        background: "none",
                        border: "none",
                        color: "var(--boost-text-muted, #64748b)",
                        fontSize: "12px",
                        fontWeight: 600,
                        cursor: "pointer"
                      },
                      children: "Clear all notifications"
                    }
                  )
                }
              )
            ]
          }
        )
      ]
    }
  );
};
NotificationCenter.displayName = "NotificationCenter";
var DateRangePicker = ({
  startDate: propStart,
  endDate: propEnd,
  onRangeChange,
  value,
  onChange,
  label,
  className = ""
}) => {
  const currentStart = value?.startDate !== void 0 ? value.startDate : propStart || "";
  const currentEnd = value?.endDate !== void 0 ? value.endDate : propEnd || "";
  const handleStartChange = (newStart) => {
    if (onRangeChange) onRangeChange(newStart, currentEnd);
    if (onChange) onChange({ startDate: newStart, endDate: currentEnd });
  };
  const handleEndChange = (newEnd) => {
    if (onRangeChange) onRangeChange(currentStart, newEnd);
    if (onChange) onChange({ startDate: currentStart, endDate: newEnd });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-date-range-picker ${className}`,
      style: {
        display: "inline-flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit"
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "#334155" }, children: label }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid #cbd5e1",
              borderRadius: "6px",
              padding: "4px 8px",
              backgroundColor: "#ffffff"
            },
            children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: currentStart,
                  onChange: (e) => handleStartChange(e.target.value),
                  style: {
                    border: "none",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    fontFamily: "inherit"
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { color: "#94a3b8", fontSize: "12px" }, children: "to" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "date",
                  value: currentEnd,
                  min: currentStart,
                  onChange: (e) => handleEndChange(e.target.value),
                  style: {
                    border: "none",
                    fontSize: "13px",
                    color: "#0f172a",
                    outline: "none",
                    fontFamily: "inherit"
                  }
                }
              )
            ]
          }
        )
      ]
    }
  );
};
DateRangePicker.displayName = "DateRangePicker";
var ExportButton = ({
  onExport,
  format = "csv",
  label,
  loading = false,
  style,
  ...props
}) => {
  const displayLabel = label || `Export ${format.toUpperCase()}`;
  const handleClick = (e) => {
    if (loading) return;
    if (onExport) {
      onExport(format);
    }
    if (props.onClick) {
      props.onClick(e);
    }
  };
  return /* @__PURE__ */ jsxs(
    "button",
    {
      onClick: handleClick,
      disabled: loading || props.disabled,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "8px 14px",
        fontSize: "13px",
        fontWeight: 500,
        color: "#334155",
        backgroundColor: "#ffffff",
        border: "1px solid #cbd5e1",
        borderRadius: "6px",
        cursor: loading || props.disabled ? "not-allowed" : "pointer",
        opacity: loading || props.disabled ? 0.6 : 1,
        transition: "all 0.15s ease",
        ...style
      },
      ...props,
      children: [
        loading ? /* @__PURE__ */ jsxs(
          "svg",
          {
            style: { animation: "spin 1s linear infinite", width: "14px", height: "14px" },
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
              /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
            ]
          }
        ) : /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
          /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: displayLabel })
      ]
    }
  );
};
ExportButton.displayName = "ExportButton";
var Filter = ({
  label = "Filter",
  options,
  selectedValues = [],
  onChange,
  multiple = true,
  clearable = true
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggleOption = (val) => {
    let nextValues;
    if (multiple) {
      if (selectedValues.includes(val)) {
        nextValues = selectedValues.filter((v) => v !== val);
      } else {
        nextValues = [...selectedValues, val];
      }
    } else {
      nextValues = selectedValues.includes(val) ? [] : [val];
    }
    onChange?.(nextValues);
  };
  const handleClear = (e) => {
    e.stopPropagation();
    onChange?.([]);
  };
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "inline-block", fontFamily: "system-ui, -apple-system, sans-serif" }, children: [
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 500,
          color: selectedValues.length > 0 ? "#2563eb" : "#334155",
          backgroundColor: selectedValues.length > 0 ? "#eff6ff" : "#ffffff",
          border: `1px solid ${selectedValues.length > 0 ? "#93c5fd" : "#cbd5e1"}`,
          borderRadius: "6px",
          cursor: "pointer"
        },
        children: [
          /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polygon", { points: "22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" }) }),
          /* @__PURE__ */ jsx("span", { children: label }),
          selectedValues.length > 0 && /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#2563eb",
                color: "#ffffff",
                fontSize: "11px",
                fontWeight: 600,
                width: "18px",
                height: "18px",
                borderRadius: "9px"
              },
              children: selectedValues.length
            }
          ),
          /* @__PURE__ */ jsx(
            "svg",
            {
              width: "12",
              height: "12",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2",
              style: { transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s ease" },
              children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 50,
          minWidth: "200px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "8px"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 8px 8px", borderBottom: "1px solid #f1f5f9" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600, color: "#64748b" }, children: "Options" }),
            clearable && selectedValues.length > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleClear,
                style: {
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "11px",
                  fontWeight: 500,
                  cursor: "pointer",
                  padding: 0
                },
                children: "Clear all"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: "200px", overflowY: "auto", marginTop: "6px" }, children: options.map((opt) => {
            const checked = selectedValues.includes(opt.value);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => toggleOption(opt.value),
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "6px 8px",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "#1e293b",
                  backgroundColor: checked ? "#f8fafc" : "transparent"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: multiple ? "checkbox" : "radio",
                      checked,
                      readOnly: true,
                      style: { cursor: "pointer" }
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { style: { flex: 1 }, children: opt.label }),
                  typeof opt.count === "number" && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "#94a3b8" }, children: opt.count })
                ]
              },
              opt.value
            );
          }) })
        ]
      }
    )
  ] });
};
Filter.displayName = "Filter";
var Sort = ({
  options,
  currentValue = options[0]?.value || "",
  currentDirection = "asc",
  onChange,
  label = "Sort by"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const handleSelect = (val) => {
    const nextDir = val === currentValue ? currentDirection === "asc" ? "desc" : "asc" : "asc";
    onChange?.(val, nextDir);
    setIsOpen(false);
  };
  const handleToggleDirection = (e) => {
    e.stopPropagation();
    const nextDir = currentDirection === "asc" ? "desc" : "asc";
    onChange?.(currentValue, nextDir);
  };
  const currentOption = options.find((o) => o.value === currentValue);
  return /* @__PURE__ */ jsxs("div", { style: { position: "relative", display: "inline-flex", alignItems: "center", fontFamily: "system-ui, -apple-system, sans-serif" }, children: [
    /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid #cbd5e1",
          borderRadius: "6px",
          backgroundColor: "#ffffff",
          overflow: "hidden"
        },
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsOpen(!isOpen),
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 500,
                color: "#334155",
                backgroundColor: "transparent",
                border: "none",
                cursor: "pointer"
              },
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("line", { x1: "18", y1: "20", x2: "18", y2: "10" }),
                  /* @__PURE__ */ jsx("polyline", { points: "15 13 18 10 21 13" }),
                  /* @__PURE__ */ jsx("line", { x1: "6", y1: "4", x2: "6", y2: "14" }),
                  /* @__PURE__ */ jsx("polyline", { points: "3 11 6 14 9 11" })
                ] }),
                /* @__PURE__ */ jsxs("span", { style: { color: "#64748b" }, children: [
                  label,
                  ":"
                ] }),
                /* @__PURE__ */ jsx("span", { children: currentOption?.label || currentValue }),
                /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleToggleDirection,
              title: currentDirection === "asc" ? "Ascending" : "Descending",
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                backgroundColor: "#f8fafc",
                borderLeft: "1px solid #e2e8f0",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                cursor: "pointer",
                color: "#475569"
              },
              children: currentDirection === "asc" ? /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "19", x2: "12", y2: "5" }),
                /* @__PURE__ */ jsx("polyline", { points: "5 12 12 5 19 12" })
              ] }) : /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "5", x2: "12", y2: "19" }),
                /* @__PURE__ */ jsx("polyline", { points: "19 12 12 19 5 12" })
              ] })
            }
          )
        ]
      }
    ),
    isOpen && /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 50,
          minWidth: "180px",
          backgroundColor: "#ffffff",
          border: "1px solid #e2e8f0",
          borderRadius: "8px",
          boxShadow: "0 4px 16px rgba(0,0,0,0.1)",
          padding: "4px"
        },
        children: options.map((opt) => /* @__PURE__ */ jsxs(
          "button",
          {
            onClick: () => handleSelect(opt.value),
            style: {
              display: "flex",
              width: "100%",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              fontSize: "13px",
              color: opt.value === currentValue ? "#2563eb" : "#334155",
              fontWeight: opt.value === currentValue ? 600 : 400,
              backgroundColor: opt.value === currentValue ? "#eff6ff" : "transparent",
              border: "none",
              borderRadius: "4px",
              cursor: "pointer",
              textAlign: "left"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: opt.label }),
              opt.value === currentValue && /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
            ]
          },
          opt.value
        ))
      }
    )
  ] });
};
Sort.displayName = "Sort";
var LoginForm = ({
  onSubmit,
  onForgotPassword,
  onRegisterClick,
  loading = false,
  errorMessage,
  title = "Sign In",
  subtitle = "Welcome back! Please enter your details."
}) => {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const errs = {};
    const trimmed = identifier.trim();
    if (!trimmed) {
      errs.identifier = "Email or phone number is required";
    } else if (trimmed.includes("@")) {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) {
        errs.identifier = "Please enter a valid email address";
      }
    } else {
      const cleanPhone = trimmed.replace(/[\s\-\(\)]/g, "");
      if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        errs.identifier = "Please enter a valid phone number or email";
      }
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    return errs;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.({ identifier: identifier.trim(), password, rememberMe });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        maxWidth: "420px",
        width: "100%",
        margin: "0 auto",
        padding: "clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        boxShadow: "var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "28px" }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 8px", letterSpacing: "-0.02em" }, children: title }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "14px", color: "var(--boost-muted, #64748b)", margin: 0, lineHeight: 1.5 }, children: subtitle })
        ] }),
        errorMessage && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "var(--boost-radius, 10px)",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: 500
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { flexShrink: 0 }, children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              /* @__PURE__ */ jsx("span", { style: { lineHeight: 1.4 }, children: errorMessage })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("form", { noValidate: true, onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "18px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "8px" }, children: "Email or Phone" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: identifier,
                onChange: (e) => {
                  setIdentifier(e.target.value);
                  if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: void 0 }));
                },
                placeholder: "you@example.com",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "12px 14px",
                  fontSize: "14px",
                  color: "var(--boost-text, #0f172a)",
                  backgroundColor: "var(--boost-bg, #ffffff)",
                  border: `1px solid ${errors.identifier ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                  borderRadius: "var(--boost-radius, 10px)",
                  outline: "none",
                  transition: "all 0.2s ease"
                }
              }
            ),
            errors.identifier && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.identifier
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)" }, children: "Password" }),
              onForgotPassword && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: onForgotPassword,
                  style: {
                    background: "none",
                    border: "none",
                    color: "var(--boost-primary, #3b82f6)",
                    fontSize: "12px",
                    fontWeight: 600,
                    cursor: "pointer",
                    padding: 0,
                    transition: "opacity 0.15s ease"
                  },
                  children: "Forgot password?"
                }
              )
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: void 0 }));
                  },
                  placeholder: "Enter your password",
                  style: {
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "12px 42px 12px 14px",
                    fontSize: "14px",
                    color: "var(--boost-text, #0f172a)",
                    backgroundColor: "var(--boost-bg, #ffffff)",
                    border: `1px solid ${errors.password ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                    borderRadius: "var(--boost-radius, 10px)",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  "aria-label": showPassword ? "Hide password" : "Show password",
                  style: {
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--boost-muted, #64748b)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "4px"
                  },
                  children: showPassword ? /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
                    /* @__PURE__ */ jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
                  ] }) : /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
                  ] })
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.password
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "login-remember",
                checked: rememberMe,
                onChange: (e) => setRememberMe(e.target.checked),
                style: {
                  width: "16px",
                  height: "16px",
                  accentColor: "var(--boost-primary, #3b82f6)",
                  cursor: "pointer"
                }
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "login-remember", style: { fontSize: "13px", color: "var(--boost-text, #475569)", cursor: "pointer", userSelect: "none" }, children: "Remember for 30 days" })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: loading,
              style: {
                width: "100%",
                padding: "13px 20px",
                backgroundColor: "var(--boost-primary, #0f172a)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "var(--boost-radius, 10px)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.75 : 1,
                boxShadow: "var(--boost-shadow-sm, 0 2px 8px rgba(0,0,0,0.1))",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              children: [
                loading && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    style: { animation: "spin 1s linear infinite", width: "16px", height: "16px" },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: loading ? "Signing in..." : "Sign In" })
              ]
            }
          )
        ] }),
        onRegisterClick && /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--boost-muted, #64748b)" }, children: [
          "Don't have an account?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onRegisterClick,
              style: {
                background: "none",
                border: "none",
                color: "var(--boost-primary, #2563eb)",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                marginLeft: "4px"
              },
              children: "Sign up"
            }
          )
        ] })
      ]
    }
  );
};
LoginForm.displayName = "LoginForm";
var RegisterForm = ({
  onSubmit,
  onLoginClick,
  loading = false,
  errorMessage,
  title = "Create an account",
  subtitle = "Start your experience in just a few clicks."
}) => {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const validate = () => {
    const errs = {};
    if (!fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (fullName.trim().length < 2) {
      errs.fullName = "Name must be at least 2 characters";
    }
    if (!email.trim()) {
      errs.email = "Email address is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      errs.email = "Please enter a valid email address";
    }
    if (phone.trim()) {
      const cleanPhone = phone.replace(/[\s\-\(\)]/g, "");
      if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        errs.phone = "Please enter a valid 10-15 digit phone number";
      }
    }
    if (!password) {
      errs.password = "Password is required";
    } else if (password.length < 6) {
      errs.password = "Password must be at least 6 characters";
    }
    if (!acceptTerms) {
      errs.acceptTerms = "You must agree to the Terms of Service";
    }
    return errs;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.({ fullName: fullName.trim(), email: email.trim(), phone: phone.trim() || void 0, password, acceptTerms });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        maxWidth: "440px",
        width: "100%",
        margin: "0 auto",
        padding: "clamp(24px, 5vw, 40px) clamp(18px, 4vw, 32px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        boxShadow: "var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "28px" }, children: [
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(20px, 3vw, 24px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 8px", letterSpacing: "-0.02em" }, children: title }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "14px", color: "var(--boost-muted, #64748b)", margin: 0, lineHeight: 1.5 }, children: subtitle })
        ] }),
        errorMessage && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "10px",
              padding: "12px 16px",
              marginBottom: "20px",
              backgroundColor: "rgba(239, 68, 68, 0.08)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "var(--boost-radius, 10px)",
              color: "#ef4444",
              fontSize: "13px",
              fontWeight: 500
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", style: { flexShrink: 0 }, children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              /* @__PURE__ */ jsx("span", { style: { lineHeight: 1.4 }, children: errorMessage })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("form", { noValidate: true, onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Full Name" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: fullName,
                onChange: (e) => {
                  setFullName(e.target.value);
                  if (errors.fullName) setErrors((prev) => ({ ...prev, fullName: void 0 }));
                },
                placeholder: "John Doe",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  color: "var(--boost-text, #0f172a)",
                  backgroundColor: "var(--boost-bg, #ffffff)",
                  border: `1px solid ${errors.fullName ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                  borderRadius: "var(--boost-radius, 10px)",
                  outline: "none",
                  transition: "all 0.2s ease"
                }
              }
            ),
            errors.fullName && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.fullName
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Email Address" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                value: email,
                onChange: (e) => {
                  setEmail(e.target.value);
                  if (errors.email) setErrors((prev) => ({ ...prev, email: void 0 }));
                },
                placeholder: "you@example.com",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  color: "var(--boost-text, #0f172a)",
                  backgroundColor: "var(--boost-bg, #ffffff)",
                  border: `1px solid ${errors.email ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                  borderRadius: "var(--boost-radius, 10px)",
                  outline: "none",
                  transition: "all 0.2s ease"
                }
              }
            ),
            errors.email && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.email
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Phone Number (Optional)" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "tel",
                value: phone,
                onChange: (e) => {
                  setPhone(e.target.value);
                  if (errors.phone) setErrors((prev) => ({ ...prev, phone: void 0 }));
                },
                placeholder: "+91 98765 43210",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  color: "var(--boost-text, #0f172a)",
                  backgroundColor: "var(--boost-bg, #ffffff)",
                  border: `1px solid ${errors.phone ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                  borderRadius: "var(--boost-radius, 10px)",
                  outline: "none",
                  transition: "all 0.2s ease"
                }
              }
            ),
            errors.phone && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.phone
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Password" }),
            /* @__PURE__ */ jsxs("div", { style: { position: "relative" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: showPassword ? "text" : "password",
                  value: password,
                  onChange: (e) => {
                    setPassword(e.target.value);
                    if (errors.password) setErrors((prev) => ({ ...prev, password: void 0 }));
                  },
                  placeholder: "Create a strong password",
                  style: {
                    width: "100%",
                    boxSizing: "border-box",
                    padding: "11px 42px 11px 14px",
                    fontSize: "14px",
                    color: "var(--boost-text, #0f172a)",
                    backgroundColor: "var(--boost-bg, #ffffff)",
                    border: `1px solid ${errors.password ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
                    borderRadius: "var(--boost-radius, 10px)",
                    outline: "none",
                    transition: "all 0.2s ease"
                  }
                }
              ),
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setShowPassword(!showPassword),
                  "aria-label": showPassword ? "Hide password" : "Show password",
                  style: {
                    position: "absolute",
                    right: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    background: "none",
                    border: "none",
                    color: "var(--boost-muted, #64748b)",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    borderRadius: "4px"
                  },
                  children: showPassword ? /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("path", { d: "M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" }),
                    /* @__PURE__ */ jsx("line", { x1: "1", y1: "1", x2: "23", y2: "23" })
                  ] }) : /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("path", { d: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" }),
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "3" })
                  ] })
                }
              )
            ] }),
            errors.password && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.password
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "flex-start", gap: "10px", marginTop: "4px" }, children: [
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "checkbox",
                  id: "register-terms",
                  checked: acceptTerms,
                  onChange: (e) => {
                    setAcceptTerms(e.target.checked);
                    if (errors.acceptTerms) setErrors((prev) => ({ ...prev, acceptTerms: void 0 }));
                  },
                  style: {
                    marginTop: "3px",
                    cursor: "pointer",
                    width: "16px",
                    height: "16px",
                    accentColor: "var(--boost-primary, #3b82f6)",
                    flexShrink: 0
                  }
                }
              ),
              /* @__PURE__ */ jsx("label", { htmlFor: "register-terms", style: { fontSize: "13px", color: "var(--boost-text, #475569)", cursor: "pointer", lineHeight: 1.4, userSelect: "none" }, children: "I agree to the Terms of Service and Privacy Policy." })
            ] }),
            errors.acceptTerms && /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "12px", color: "#ef4444", marginTop: "6px", fontWeight: 500, paddingLeft: "26px" }, children: [
              /* @__PURE__ */ jsxs("svg", { width: "13", height: "13", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              errors.acceptTerms
            ] })
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: loading,
              style: {
                width: "100%",
                marginTop: "8px",
                padding: "13px 20px",
                backgroundColor: "var(--boost-primary, #2563eb)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "var(--boost-radius, 10px)",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                boxShadow: "var(--boost-shadow-sm, 0 2px 8px rgba(37,99,235,0.25))",
                transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              children: [
                loading && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    style: { animation: "spin 1s linear infinite", width: "16px", height: "16px" },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: loading ? "Creating account..." : "Create Account" })
              ]
            }
          )
        ] }),
        onLoginClick && /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginTop: "24px", fontSize: "13px", color: "var(--boost-muted, #64748b)" }, children: [
          "Already have an account?",
          " ",
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onLoginClick,
              style: {
                background: "none",
                border: "none",
                color: "var(--boost-primary, #2563eb)",
                fontWeight: 600,
                cursor: "pointer",
                padding: 0,
                marginLeft: "4px"
              },
              children: "Sign in"
            }
          )
        ] })
      ]
    }
  );
};
RegisterForm.displayName = "RegisterForm";
var ForgotPassword = ({
  onSubmit,
  onBackToLogin,
  loading = false,
  successMessage,
  errorMessage
}) => {
  const [email, setEmail] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    onSubmit?.(email);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        maxWidth: "400px",
        width: "100%",
        margin: "0 auto",
        padding: "32px 24px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        fontFamily: "system-ui, -apple-system, sans-serif"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px"
              },
              children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }, children: "Forgot password?" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "#64748b", margin: 0, lineHeight: 1.4 }, children: "No worries, we will send you reset instructions." })
        ] }),
        successMessage ? /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              padding: "16px",
              backgroundColor: "#f0fdf4",
              border: "1px solid #bbf7d0",
              borderRadius: "8px",
              color: "#166534",
              fontSize: "13px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsx("div", { style: { fontWeight: 600, marginBottom: "4px" }, children: "Check your email" }),
              /* @__PURE__ */ jsx("div", { children: successMessage })
            ]
          }
        ) : /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          errorMessage && /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 14px",
                backgroundColor: "#fef2f2",
                border: "1px solid #fecaca",
                borderRadius: "6px",
                color: "#dc2626",
                fontSize: "13px"
              },
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                  /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: errorMessage })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }, children: "Email address" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "you@example.com",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  fontSize: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  outline: "none"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: loading,
              style: {
                width: "100%",
                padding: "11px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              children: [
                loading && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    style: { animation: "spin 1s linear infinite", width: "16px", height: "16px" },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: loading ? "Sending link..." : "Reset Password" })
              ]
            }
          )
        ] }),
        onBackToLogin && /* @__PURE__ */ jsx("div", { style: { textAlign: "center", marginTop: "20px" }, children: /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onBackToLogin,
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              padding: 0
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("line", { x1: "19", y1: "12", x2: "5", y2: "12" }),
                /* @__PURE__ */ jsx("polyline", { points: "12 19 5 12 12 5" })
              ] }),
              /* @__PURE__ */ jsx("span", { children: "Back to sign in" })
            ]
          }
        ) })
      ]
    }
  );
};
ForgotPassword.displayName = "ForgotPassword";
var ResetPassword = ({
  onSubmit,
  onBackToLogin,
  loading = false,
  errorMessage
}) => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [validationError, setValidationError] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!password) {
      setValidationError("Password is required");
      return;
    }
    if (password.length < 8) {
      setValidationError("Password must be at least 8 characters");
      return;
    }
    if (password !== confirmPassword) {
      setValidationError("Passwords do not match");
      return;
    }
    setValidationError("");
    onSubmit?.(password);
  };
  const activeError = validationError || errorMessage;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      style: {
        maxWidth: "400px",
        width: "100%",
        margin: "0 auto",
        padding: "32px 24px",
        backgroundColor: "#ffffff",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
        fontFamily: "system-ui, -apple-system, sans-serif"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "#eff6ff",
                color: "#2563eb",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                marginBottom: "12px"
              },
              children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                /* @__PURE__ */ jsx("path", { d: "M21 2l-2 2m-1-1l2 2" }),
                /* @__PURE__ */ jsx("path", { d: "M15 7l2 2" }),
                /* @__PURE__ */ jsx("path", { d: "M19 11l-9 9-4-1 1-4 9-9" })
              ] })
            }
          ),
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "20px", fontWeight: 700, color: "#0f172a", margin: "0 0 6px" }, children: "Set new password" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "#64748b", margin: 0 }, children: "Must be at least 8 characters long." })
        ] }),
        activeError && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 14px",
              marginBottom: "16px",
              backgroundColor: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: "6px",
              color: "#dc2626",
              fontSize: "13px"
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
                /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
              ] }),
              /* @__PURE__ */ jsx("span", { children: activeError })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("form", { onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "16px" }, children: [
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }, children: "New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Enter new password",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  fontSize: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  outline: "none"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "#334155", marginBottom: "6px" }, children: "Confirm Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                placeholder: "Re-enter new password",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "10px 14px",
                  fontSize: "14px",
                  border: "1px solid #cbd5e1",
                  borderRadius: "6px",
                  outline: "none"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: loading,
              style: {
                width: "100%",
                padding: "11px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px"
              },
              children: [
                loading && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    style: { animation: "spin 1s linear infinite", width: "16px", height: "16px" },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: loading ? "Updating password..." : "Reset Password" })
              ]
            }
          )
        ] }),
        onBackToLogin && /* @__PURE__ */ jsx("div", { style: { textAlign: "center", marginTop: "20px" }, children: /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onBackToLogin,
            style: {
              background: "none",
              border: "none",
              color: "#64748b",
              fontSize: "13px",
              fontWeight: 500,
              cursor: "pointer",
              padding: 0
            },
            children: "Cancel and return to sign in"
          }
        ) })
      ]
    }
  );
};
ResetPassword.displayName = "ResetPassword";
var CartDrawer = ({
  isOpen,
  onClose,
  items,
  subtotal,
  freeShippingThreshold = 999,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  className = "",
  onTabSync
}) => {
  const [isCheckingOut, setIsCheckingOut] = React.useState(false);
  React.useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const handleStorage = (e) => {
      if (e.key === "boost_cart" || e.key === "cart_items") {
        onTabSync?.();
      }
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, [onTabSync]);
  if (!isOpen) return null;
  const amountRemaining = Math.max(0, freeShippingThreshold - subtotal);
  const progressPercent = Math.min(100, Math.round(subtotal / freeShippingThreshold * 100));
  const isFreeShippingUnlocked = amountRemaining === 0;
  const handleCheckoutClick = async () => {
    if (isCheckingOut) return;
    try {
      setIsCheckingOut(true);
      await Promise.resolve(onCheckout());
    } finally {
      setIsCheckingOut(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      "aria-label": "Shopping Cart Drawer",
      className: `boost-cart-drawer-backdrop ${className}`,
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1e3,
        display: "flex",
        justifyContent: "flex-end",
        alignItems: "flex-end",
        fontFamily: "inherit",
        animation: "boost-fadeIn 0.2s ease"
      },
      onClick: onClose,
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 640px) {
          .boost-cart-drawer-panel {
            max-height: 92vh !important;
            border-top-left-radius: 20px !important;
            border-top-right-radius: 20px !important;
            animation: boost-slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
        @media (min-width: 641px) {
          .boost-cart-drawer-panel {
            height: 100% !important;
            animation: boost-slideInRight 0.3s cubic-bezier(0.16, 1, 0.3, 1) !important;
          }
        }
        @keyframes boost-slideInRight {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-cart-drawer-panel",
            style: {
              width: "100%",
              maxWidth: "440px",
              backgroundColor: "var(--boost-bg, #ffffff)",
              display: "flex",
              flexDirection: "column",
              boxShadow: "var(--boost-shadow-lg, -4px 0 32px rgba(0, 0, 0, 0.2))",
              boxSizing: "border-box",
              overflow: "hidden"
            },
            onClick: (e) => e.stopPropagation(),
            children: [
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    backgroundColor: "var(--boost-surface, #f8fafc)"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                      /* @__PURE__ */ jsx("h2", { style: { margin: 0, fontSize: "17px", fontWeight: 700, color: "var(--boost-text, #0f172a)" }, children: "Your Cart" }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            backgroundColor: "rgba(37, 99, 235, 0.1)",
                            color: "var(--boost-primary, #2563eb)",
                            padding: "2px 8px",
                            borderRadius: "9999px",
                            fontSize: "12px",
                            fontWeight: 700
                          },
                          children: items.reduce((s, i) => s + i.quantity, 0)
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        onClick: onClose,
                        "aria-label": "Close Cart Drawer",
                        style: {
                          background: "none",
                          border: "none",
                          width: "32px",
                          height: "32px",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          color: "var(--boost-text-muted, #64748b)",
                          fontSize: "18px",
                          transition: "background-color 0.15s ease"
                        },
                        children: "\u2715"
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "12px 20px",
                    backgroundColor: "var(--boost-surface, #f8fafc)",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)"
                  },
                  children: [
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          fontSize: "12px",
                          fontWeight: 600,
                          color: isFreeShippingUnlocked ? "#16a34a" : "var(--boost-text, #374151)",
                          marginBottom: "8px",
                          display: "flex",
                          alignItems: "center",
                          gap: "6px"
                        },
                        children: isFreeShippingUnlocked ? /* @__PURE__ */ jsxs("span", { children: [
                          "\u{1F389} You unlocked ",
                          /* @__PURE__ */ jsx("strong", { children: "FREE Delivery" }),
                          "!"
                        ] }) : /* @__PURE__ */ jsxs("span", { children: [
                          "Add ",
                          /* @__PURE__ */ jsxs("strong", { children: [
                            "\u20B9",
                            amountRemaining.toFixed(0)
                          ] }),
                          " more for FREE Delivery!"
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: "100%",
                          height: "6px",
                          backgroundColor: "var(--boost-border, #e2e8f0)",
                          borderRadius: "999px",
                          overflow: "hidden"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              width: `${progressPercent}%`,
                              height: "100%",
                              background: isFreeShippingUnlocked ? "linear-gradient(90deg, #16a34a, #22c55e)" : "linear-gradient(90deg, #2563eb, #3b82f6)",
                              borderRadius: "999px",
                              transition: "width 0.4s ease"
                            }
                          }
                        )
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", padding: "16px 20px" }, children: items.length === 0 ? /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", padding: "48px 0", color: "var(--boost-text-muted, #64748b)" }, children: [
                /* @__PURE__ */ jsx("div", { style: { display: "inline-flex", marginBottom: "14px", color: "var(--boost-text-muted, #94a3b8)" }, children: /* @__PURE__ */ jsxs("svg", { width: "52", height: "52", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", children: [
                  /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                  /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                  /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                ] }) }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "16px", fontWeight: 700, margin: "0 0 6px 0", color: "var(--boost-text, #0f172a)" }, children: "Your cart is empty" }),
                /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", margin: "0 0 20px 0" }, children: "Looks like you haven't added anything yet." }),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    onClick: onClose,
                    style: {
                      backgroundColor: "var(--boost-primary, #2563eb)",
                      color: "#fff",
                      border: "none",
                      padding: "10px 22px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: 600,
                      boxShadow: "var(--boost-shadow-glow, 0 4px 12px rgba(37, 99, 235, 0.25))"
                    },
                    children: "Start Shopping"
                  }
                )
              ] }) : /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: items.map((item) => /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    display: "flex",
                    gap: "12px",
                    alignItems: "center",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                    paddingBottom: "14px"
                  },
                  children: [
                    item.image && /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: item.image,
                        alt: item.title,
                        style: {
                          width: "64px",
                          height: "64px",
                          objectFit: "cover",
                          borderRadius: "10px",
                          border: "1px solid var(--boost-border, #e2e8f0)",
                          backgroundColor: "var(--boost-surface, #f8fafc)"
                        }
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            fontSize: "14px",
                            fontWeight: 600,
                            color: "var(--boost-text, #0f172a)",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          },
                          children: item.title
                        }
                      ),
                      item.variantTitle && /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)", marginTop: "2px" }, children: item.variantTitle }),
                      /* @__PURE__ */ jsxs("div", { style: { fontSize: "14px", fontWeight: 800, color: "var(--boost-text, #0f172a)", marginTop: "4px" }, children: [
                        "\u20B9",
                        item.price
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          border: "1px solid var(--boost-border, #e2e8f0)",
                          borderRadius: "8px",
                          overflow: "hidden",
                          backgroundColor: "var(--boost-surface, #f8fafc)"
                        },
                        children: [
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1)),
                              "aria-label": "Decrease Quantity",
                              style: {
                                padding: "6px 10px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "var(--boost-text, #0f172a)"
                              },
                              children: "-"
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                padding: "4px 8px",
                                fontSize: "12px",
                                fontWeight: 700,
                                color: "var(--boost-text, #0f172a)",
                                minWidth: "20px",
                                textAlign: "center"
                              },
                              children: item.quantity
                            }
                          ),
                          /* @__PURE__ */ jsx(
                            "button",
                            {
                              type: "button",
                              onClick: () => onUpdateQuantity(item.id, item.quantity + 1),
                              "aria-label": "Increase Quantity",
                              style: {
                                padding: "6px 10px",
                                border: "none",
                                background: "transparent",
                                cursor: "pointer",
                                fontSize: "13px",
                                fontWeight: 700,
                                color: "var(--boost-text, #0f172a)"
                              },
                              children: "+"
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: () => onRemoveItem(item.id),
                        "aria-label": "Remove item from cart",
                        style: {
                          background: "none",
                          border: "none",
                          color: "var(--boost-text-muted, #94a3b8)",
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          padding: "6px",
                          borderRadius: "6px",
                          transition: "color 0.15s ease"
                        },
                        children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                          /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
                          /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
                        ] })
                      }
                    )
                  ]
                },
                item.id
              )) }) }),
              items.length > 0 && /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    padding: "16px 20px",
                    borderTop: "1px solid var(--boost-border, #e2e8f0)",
                    backgroundColor: "var(--boost-surface, #f8fafc)"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", color: "var(--boost-text-muted, #64748b)" }, children: "Subtotal:" }),
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "20px", fontWeight: 800, color: "var(--boost-text, #0f172a)" }, children: [
                        "\u20B9",
                        subtotal.toFixed(2)
                      ] })
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: handleCheckoutClick,
                        disabled: isCheckingOut,
                        style: {
                          width: "100%",
                          backgroundColor: "var(--boost-primary, #2563eb)",
                          color: "#ffffff",
                          border: "none",
                          borderRadius: "12px",
                          padding: "14px",
                          fontSize: "15px",
                          fontWeight: 700,
                          cursor: isCheckingOut ? "not-allowed" : "pointer",
                          opacity: isCheckingOut ? 0.7 : 1,
                          boxShadow: "var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))",
                          transition: "all 0.15s ease"
                        },
                        children: isCheckingOut ? "Securing Order..." : "Proceed to Checkout \u2192"
                      }
                    )
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
CartDrawer.displayName = "CartDrawer";
var StickyAddToCart = ({
  title,
  price,
  compareAtPrice,
  image,
  onAddToCart,
  onBuyNow,
  inStock = true,
  className = ""
}) => {
  const [quantity, setQuantity] = React.useState(1);
  const [isAdding, setIsAdding] = React.useState(false);
  const [isBuying, setIsBuying] = React.useState(false);
  const [addedFeedback, setAddedFeedback] = React.useState(false);
  const handleAddToCart = async () => {
    if (!inStock || isAdding || isBuying) return;
    try {
      setIsAdding(true);
      await Promise.resolve(onAddToCart(quantity));
      setAddedFeedback(true);
      setTimeout(() => setAddedFeedback(false), 1500);
    } finally {
      setIsAdding(false);
    }
  };
  const handleBuyNow = async () => {
    if (!inStock || isAdding || isBuying || !onBuyNow) return;
    try {
      setIsBuying(true);
      await Promise.resolve(onBuyNow(quantity));
    } finally {
      setIsBuying(false);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-sticky-add-to-cart ${className}`,
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: "#ffffff",
        boxShadow: "0 -4px 20px rgba(0, 0, 0, 0.08)",
        borderTop: "1px solid #e5e7eb",
        padding: "10px 16px",
        zIndex: 999,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }, children: [
          image && /* @__PURE__ */ jsx(
            "img",
            {
              src: image,
              alt: title,
              style: { width: "44px", height: "44px", objectFit: "cover", borderRadius: "6px", border: "1px solid #e5e7eb" }
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { minWidth: 0 }, children: [
            /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", fontWeight: 600, color: "#111827", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "180px" }, children: title }),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", marginTop: "2px" }, children: [
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "14px", fontWeight: 700, color: "#111827" }, children: [
                "\u20B9",
                price
              ] }),
              compareAtPrice && compareAtPrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#9ca3af", textDecoration: "line-through" }, children: [
                "\u20B9",
                compareAtPrice
              ] })
            ] })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", border: "1px solid #d1d5db", borderRadius: "6px", overflow: "hidden" }, children: [
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setQuantity(Math.max(1, quantity - 1)),
                "aria-label": "Decrease quantity",
                disabled: isAdding || isBuying,
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "-"
              }
            ),
            /* @__PURE__ */ jsx("span", { style: { padding: "6px 8px", fontSize: "13px", fontWeight: 600, minWidth: "20px", textAlign: "center" }, children: quantity }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: () => setQuantity(quantity + 1),
                "aria-label": "Increase quantity",
                disabled: isAdding || isBuying,
                style: { padding: "6px 10px", border: "none", background: "#f9fafb", cursor: "pointer", fontSize: "14px", fontWeight: 600 },
                children: "+"
              }
            )
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleAddToCart,
              disabled: !inStock || isAdding || isBuying,
              style: {
                backgroundColor: !inStock ? "#9ca3af" : addedFeedback ? "#16a34a" : "#000000",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: inStock && !isAdding && !isBuying ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s ease"
              },
              children: !inStock ? "Sold Out" : isAdding ? "Adding..." : addedFeedback ? "Added! \u2713" : "Add to Cart"
            }
          ),
          onBuyNow && inStock && /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleBuyNow,
              disabled: isAdding || isBuying,
              style: {
                backgroundColor: isBuying ? "#1d4ed8" : "#2563eb",
                color: "#ffffff",
                border: "none",
                borderRadius: "6px",
                padding: "10px 16px",
                fontSize: "13px",
                fontWeight: 700,
                cursor: !isAdding && !isBuying ? "pointer" : "not-allowed",
                whiteSpace: "nowrap",
                transition: "background-color 0.2s ease"
              },
              children: isBuying ? "Processing..." : "Buy Now"
            }
          )
        ] })
      ]
    }
  );
};
StickyAddToCart.displayName = "StickyAddToCart";
var PincodeChecker = ({
  onCheck,
  defaultPincode = "",
  className = ""
}) => {
  const [pincode, setPincode] = React.useState(defaultPincode);
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState(null);
  const [error, setError] = React.useState(null);
  const activeRequestIdRef = React.useRef(0);
  const isMountedRef = React.useRef(true);
  React.useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  const handleCheck = async () => {
    const clean = pincode.trim();
    if (!/^\d{6}$/.test(clean)) {
      setError("Please enter a valid 6-digit Indian pincode");
      setResult(null);
      return;
    }
    const currentReqId = ++activeRequestIdRef.current;
    setError(null);
    setLoading(true);
    try {
      if (onCheck) {
        const timeoutPromise = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Pincode check timed out. Please try again.")), 1e4)
        );
        const res = await Promise.race([Promise.resolve(onCheck(clean)), timeoutPromise]);
        if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
          setResult(res);
        }
      } else {
        const deliveryDate = /* @__PURE__ */ new Date();
        deliveryDate.setDate(deliveryDate.getDate() + 3);
        const options = { weekday: "short", month: "short", day: "numeric" };
        if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
          setResult({
            isServiceable: true,
            estimatedDeliveryDate: deliveryDate.toLocaleDateString("en-IN", options),
            isCodAvailable: true,
            courier: "Express Courier"
          });
        }
      }
    } catch (err) {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setError(err.message || "Failed to verify pincode");
      }
    } finally {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: { margin: "14px 0", fontFamily: "inherit" }, className: `boost-pincode-checker ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { style: { fontSize: "13px", fontWeight: 600, color: "#374151", marginBottom: "6px", display: "flex", alignItems: "center", gap: "6px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "3", width: "15", height: "13" }),
        /* @__PURE__ */ jsx("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }),
        /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "18.5", r: "2.5" }),
        /* @__PURE__ */ jsx("circle", { cx: "18.5", cy: "18.5", r: "2.5" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Check Delivery & COD Availability:" })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", maxWidth: "320px" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          maxLength: 6,
          placeholder: "Enter 6-digit Pincode",
          value: pincode,
          onChange: (e) => setPincode(e.target.value.replace(/\D/g, "")),
          onKeyDown: (e) => e.key === "Enter" && handleCheck(),
          style: {
            flex: 1,
            padding: "8px 12px",
            borderRadius: "6px",
            border: "1px solid #d1d5db",
            fontSize: "13px",
            outline: "none"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCheck,
          disabled: loading,
          style: {
            backgroundColor: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 16px",
            fontSize: "13px",
            fontWeight: 600,
            cursor: loading ? "not-allowed" : "pointer"
          },
          children: loading ? "Checking..." : "Check"
        }
      )
    ] }),
    error && /* @__PURE__ */ jsx("div", { style: { color: "#dc2626", fontSize: "12px", marginTop: "6px" }, children: error }),
    result && /* @__PURE__ */ jsx("div", { style: { marginTop: "8px", fontSize: "12px", color: "#166534", background: "#f0fdf4", padding: "8px 12px", borderRadius: "6px", border: "1px solid #bbf7d0" }, children: result.isServiceable ? /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
        /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        /* @__PURE__ */ jsxs("strong", { children: [
          "Delivery by ",
          result.estimatedDeliveryDate
        ] })
      ] }),
      result.isCodAvailable && /* @__PURE__ */ jsxs("div", { style: { color: "#854d0e", display: "flex", alignItems: "center", gap: "6px" }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#854d0e", strokeWidth: "2", children: [
          /* @__PURE__ */ jsx("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: "Cash on Delivery (COD) is available" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { style: { color: "#dc2626", display: "flex", alignItems: "center", gap: "6px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#dc2626", strokeWidth: "2", children: [
        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Pincode currently not serviceable for delivery" })
    ] }) })
  ] });
};
PincodeChecker.displayName = "PincodeChecker";
var TrustBadges = ({
  layout = "row",
  showCodBadge = true,
  showReturnsBadge = true,
  showSecureBadge = true,
  showGenuineBadge = true,
  className = ""
}) => {
  const containerStyle = {
    display: "flex",
    flexWrap: "wrap",
    gap: "12px",
    justifyContent: layout === "grid" ? "space-between" : "flex-start",
    alignItems: "center",
    padding: "12px",
    backgroundColor: "#f9fafb",
    borderRadius: "8px",
    border: "1px solid #f3f4f6",
    margin: "12px 0"
  };
  const badgeItemStyle = {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    fontSize: "12px",
    fontWeight: 600,
    color: "#374151"
  };
  return /* @__PURE__ */ jsxs("div", { style: containerStyle, className: `boost-trust-badges ${className}`, children: [
    showGenuineBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }),
      /* @__PURE__ */ jsx("span", { children: "100% Genuine" })
    ] }),
    showReturnsBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
        /* @__PURE__ */ jsx("path", { d: "M21 3v5h-5" }),
        /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
        /* @__PURE__ */ jsx("path", { d: "M8 16H3v5" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "7-Day Easy Returns" })
    ] }),
    showCodBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#d97706", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
        /* @__PURE__ */ jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "COD Available" })
    ] }),
    showSecureBadge && /* @__PURE__ */ jsxs("div", { style: badgeItemStyle, children: [
      /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#4f46e5", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
        /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
        /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "256-Bit SSL Secure" })
    ] })
  ] });
};
TrustBadges.displayName = "TrustBadges";
var STAGES = [
  { id: "placed", label: "Order Placed" },
  { id: "confirmed", label: "Confirmed" },
  { id: "shipped", label: "Shipped" },
  { id: "out_for_delivery", label: "Out for Delivery" },
  { id: "delivered", label: "Delivered" }
];
var OrderTimeline = ({
  currentStage,
  dates = {},
  className = ""
}) => {
  const currentIndex = STAGES.findIndex((s) => s.id === currentStage);
  return /* @__PURE__ */ jsx("div", { className: `boost-order-timeline ${className}`, style: { padding: "16px 0", fontFamily: "inherit" }, children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", position: "relative" }, children: [
    /* @__PURE__ */ jsx("div", { style: { position: "absolute", top: "14px", left: "20px", right: "20px", height: "3px", backgroundColor: "#e5e7eb", zIndex: 0 } }),
    STAGES.map((stage, idx) => {
      const isPassed = idx <= currentIndex;
      const isCurrent = idx === currentIndex;
      return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", alignItems: "center", position: "relative", zIndex: 1, minWidth: "60px" }, children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "28px",
              height: "28px",
              borderRadius: "999px",
              backgroundColor: isPassed ? "#16a34a" : "#ffffff",
              border: `2px solid ${isPassed ? "#16a34a" : "#d1d5db"}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              boxShadow: isCurrent ? "0 0 0 4px rgba(22, 163, 74, 0.2)" : "none"
            },
            children: isPassed ? "\u2713" : idx + 1
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { marginTop: "8px", fontSize: "11px", fontWeight: isCurrent ? 700 : 500, color: isCurrent ? "#111827" : "#6b7280", textAlign: "center" }, children: stage.label }),
        dates[stage.id] && /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", color: "#9ca3af", marginTop: "2px" }, children: dates[stage.id] })
      ] }, stage.id);
    })
  ] }) });
};
OrderTimeline.displayName = "OrderTimeline";
var StarRating = ({
  rating,
  reviewCount,
  size = 16,
  color = "#f59e0b",
  // Amber-500 gold
  showText = true,
  className = ""
}) => {
  const clamped = Math.max(0, Math.min(5, rating));
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-star-rating ${className}`,
      style: { display: "inline-flex", alignItems: "center", gap: "4px", fontFamily: "inherit" },
      children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "2px" }, children: [1, 2, 3, 4, 5].map((star) => {
          const isFilled = clamped >= star;
          const isHalf = !isFilled && clamped >= star - 0.5;
          return /* @__PURE__ */ jsxs(
            "svg",
            {
              width: size,
              height: size,
              viewBox: "0 0 24 24",
              fill: isFilled ? color : isHalf ? "url(#half-star)" : "none",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: "half-star", children: [
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: color }),
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "transparent", stopOpacity: "1" })
                ] }) }),
                /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
              ]
            },
            star
          );
        }) }),
        showText && /* @__PURE__ */ jsxs("span", { style: { fontSize: `${size * 0.85}px`, fontWeight: 600, color: "#374151", marginLeft: "4px" }, children: [
          clamped.toFixed(1),
          reviewCount !== void 0 && /* @__PURE__ */ jsxs("span", { style: { color: "#6b7280", fontWeight: 400, marginLeft: "2px" }, children: [
            "(",
            reviewCount,
            ")"
          ] })
        ] })
      ]
    }
  );
};
StarRating.displayName = "StarRating";
var ProductGallery = ({
  images = [],
  title = "Product Image",
  layout = "thumbnails-bottom",
  aspectRatio = "portrait",
  enableZoom = true,
  className = ""
}) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const [isHovered, setIsHovered] = React.useState(false);
  const [zoomPos, setZoomPos] = React.useState({ x: 0, y: 0 });
  const normalizedImages = React.useMemo(() => {
    if (!images || !Array.isArray(images)) return [];
    return images.map((item) => {
      if (typeof item === "string") return item;
      if (item && typeof item === "object") return item.url || item.src || "";
      return "";
    }).filter(Boolean);
  }, [images]);
  if (normalizedImages.length === 0) {
    return /* @__PURE__ */ jsx(
      "div",
      {
        style: {
          width: "100%",
          aspectRatio: aspectRatio === "portrait" ? "4/5" : aspectRatio === "square" ? "1/1" : "16/9",
          backgroundColor: "#f3f4f6",
          borderRadius: "16px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#9ca3af",
          fontSize: "13px"
        },
        children: "No Images Available"
      }
    );
  }
  const handleMouseMove = (e) => {
    if (!enableZoom) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width * 100;
    const y = (e.clientY - rect.top) / rect.height * 100;
    setZoomPos({ x, y });
  };
  const ratioStyle = {
    aspectRatio: aspectRatio === "portrait" ? "4/5" : aspectRatio === "square" ? "1/1" : "16/9"
  };
  const [isMobile, setIsMobile] = React.useState(false);
  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);
  const isThumbnailsLeft = layout === "thumbnails-left" && !isMobile;
  const handlePrev = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => prev > 0 ? prev - 1 : normalizedImages.length - 1);
  };
  const handleNext = (e) => {
    e.stopPropagation();
    setSelectedIndex((prev) => prev < normalizedImages.length - 1 ? prev + 1 : 0);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-product-gallery ${className}`,
      style: {
        display: "flex",
        flexDirection: isThumbnailsLeft ? "row-reverse" : "column",
        gap: "clamp(8px, 1.5vw, 14px)",
        fontFamily: "inherit",
        width: "100%"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              ...ratioStyle,
              position: "relative",
              width: "100%",
              flex: isThumbnailsLeft ? "1 1 0%" : void 0,
              minWidth: 0,
              boxSizing: "border-box",
              borderRadius: "var(--boost-radius, 16px)",
              overflow: "hidden",
              backgroundColor: "var(--boost-surface, #f8fafc)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              cursor: enableZoom ? "crosshair" : "default"
            },
            onMouseEnter: () => enableZoom && setIsHovered(true),
            onMouseLeave: () => enableZoom && setIsHovered(false),
            onMouseMove: handleMouseMove,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: normalizedImages[selectedIndex],
                  alt: `${title} - view ${selectedIndex + 1}`,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: isHovered ? "none" : "transform 0.3s ease",
                    transformOrigin: `${zoomPos.x}% ${zoomPos.y}%`,
                    transform: isHovered ? "scale(2.2)" : "scale(1)"
                  }
                }
              ),
              normalizedImages.length > 1 && /* @__PURE__ */ jsxs(Fragment, { children: [
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Previous image",
                    onClick: handlePrev,
                    style: {
                      position: "absolute",
                      left: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      zIndex: 3,
                      transition: "background-color 0.15s ease"
                    },
                    children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) })
                  }
                ),
                /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    "aria-label": "Next image",
                    onClick: handleNext,
                    style: {
                      position: "absolute",
                      right: "10px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      width: "32px",
                      height: "32px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(255, 255, 255, 0.85)",
                      backdropFilter: "blur(6px)",
                      border: "1px solid rgba(255, 255, 255, 0.4)",
                      color: "#0f172a",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                      zIndex: 3,
                      transition: "background-color 0.15s ease"
                    },
                    children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) })
                  }
                )
              ] }),
              normalizedImages.length > 1 && /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: "12px",
                    right: "12px",
                    backgroundColor: "rgba(15, 23, 42, 0.75)",
                    color: "#ffffff",
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "3px 9px",
                    borderRadius: "999px",
                    pointerEvents: "none",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    zIndex: 2
                  },
                  children: [
                    selectedIndex + 1,
                    " / ",
                    normalizedImages.length
                  ]
                }
              )
            ]
          }
        ),
        normalizedImages.length > 1 && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: isThumbnailsLeft ? "column" : "row",
              gap: "8px",
              overflowX: isThumbnailsLeft ? "hidden" : "auto",
              overflowY: isThumbnailsLeft ? "auto" : "hidden",
              paddingBottom: isThumbnailsLeft ? "0" : "4px",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch"
            },
            children: normalizedImages.map((img, idx) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => setSelectedIndex(idx),
                style: {
                  width: isThumbnailsLeft ? "64px" : "clamp(58px, 12vw, 74px)",
                  height: isThumbnailsLeft ? "80px" : "clamp(58px, 12vw, 74px)",
                  flexShrink: 0,
                  borderRadius: "10px",
                  overflow: "hidden",
                  border: selectedIndex === idx ? "2px solid var(--boost-primary, #2563eb)" : "2px solid transparent",
                  opacity: selectedIndex === idx ? 1 : 0.6,
                  boxShadow: selectedIndex === idx ? "0 0 0 2px rgba(37, 99, 235, 0.2)" : "none",
                  transition: "all 0.2s ease",
                  cursor: "pointer",
                  padding: 0,
                  backgroundColor: "var(--boost-surface, #f8fafc)"
                },
                children: /* @__PURE__ */ jsx("img", { src: img, alt: `Thumb ${idx + 1}`, style: { width: "100%", height: "100%", objectFit: "cover" } })
              },
              idx
            ))
          }
        )
      ]
    }
  );
};
ProductGallery.displayName = "ProductGallery";
var VariantSelector = ({
  groups,
  selectedValues,
  onChange,
  className = "",
  ...props
}) => {
  const values = selectedValues || props.selectedVariants || {};
  return /* @__PURE__ */ jsx("div", { className: `boost-variant-selector ${className}`, style: { display: "flex", flexDirection: "column", gap: "16px", fontFamily: "inherit" }, children: groups.map((group) => {
    const selected = values[group.name];
    const isColor = group.type === "color";
    return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: [
      /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", fontWeight: 800, textTransform: "uppercase", color: "#111827", letterSpacing: "0.05em" }, children: [
        group.name,
        ": ",
        /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, color: "#4b5563", textTransform: "none" }, children: selected || "None selected" })
      ] }) }),
      /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "8px" }, children: group.options.map((opt) => {
        const optVal = opt.value || opt.label || opt.name || opt.id || "";
        const optDisplay = opt.label || opt.value || opt.name || opt.id;
        const isSelected = selected === optVal || selected === opt.id;
        const isOutOfStock = opt.inStock === false;
        if (isColor && opt.colorHex) {
          return /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              disabled: isOutOfStock,
              onClick: () => onChange && onChange(group.name, optVal, opt),
              title: `${optDisplay}${isOutOfStock ? " (Sold Out)" : ""}`,
              style: {
                width: "34px",
                height: "34px",
                borderRadius: "999px",
                backgroundColor: opt.colorHex,
                border: isSelected ? "3px solid #000000" : "2px solid #e5e7eb",
                outline: isSelected ? "2px solid #ffffff" : "none",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                opacity: isOutOfStock ? 0.35 : 1,
                position: "relative",
                transition: "transform 0.15s ease",
                transform: isSelected ? "scale(1.1)" : "scale(1)",
                padding: 0
              },
              children: isOutOfStock && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    position: "absolute",
                    top: "50%",
                    left: "0",
                    right: "0",
                    height: "2px",
                    backgroundColor: "#ef4444",
                    transform: "rotate(-45deg)"
                  }
                }
              )
            },
            opt.id
          );
        }
        return /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            disabled: isOutOfStock,
            onClick: () => onChange && onChange(group.name, optVal, opt),
            style: {
              padding: "8px 16px",
              borderRadius: "10px",
              fontSize: "13px",
              fontWeight: isSelected ? 800 : 600,
              border: isSelected ? "2px solid #000000" : "1px solid #d1d5db",
              backgroundColor: isSelected ? "#000000" : "#ffffff",
              color: isSelected ? "#ffffff" : isOutOfStock ? "#9ca3af" : "#111827",
              cursor: isOutOfStock ? "not-allowed" : "pointer",
              position: "relative",
              textDecoration: isOutOfStock ? "line-through" : "none",
              opacity: isOutOfStock ? 0.45 : 1,
              transition: "all 0.15s ease"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: optDisplay }),
              opt.priceDelta && opt.priceDelta > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", marginLeft: "4px", opacity: 0.8 }, children: [
                "(+\u20B9",
                opt.priceDelta,
                ")"
              ] })
            ]
          },
          opt.id
        );
      }) })
    ] }, group.name);
  }) });
};
VariantSelector.displayName = "VariantSelector";
var ProductCard = ({
  id,
  title,
  price,
  compareAtPrice,
  originalPrice,
  images = [],
  image,
  imageUrl,
  brand,
  rating,
  reviewCount,
  inStock = true,
  stockUrgencyText,
  isWishlisted = false,
  onAddToCart,
  onToggleWishlist,
  onClick,
  className = ""
}) => {
  const [isHovered, setIsHovered] = React.useState(false);
  const effectiveOriginalPrice = compareAtPrice ?? originalPrice;
  const imageList = images && images.length > 0 ? images : imageUrl ? [imageUrl] : image ? [image] : [];
  const mainImage = imageList[0] || "";
  const secondaryImage = imageList[1] || mainImage;
  const currentImage = isHovered && secondaryImage ? secondaryImage : mainImage;
  const discountPercent = effectiveOriginalPrice && effectiveOriginalPrice > price ? Math.round((effectiveOriginalPrice - price) / effectiveOriginalPrice * 100) : null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-product-card ${className}`,
      onMouseEnter: () => setIsHovered(true),
      onMouseLeave: () => setIsHovered(false),
      style: {
        display: "flex",
        flexDirection: "column",
        backgroundColor: "var(--boost-surface, #ffffff)",
        borderRadius: "var(--boost-radius, 16px)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        overflow: "hidden",
        transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease",
        transform: isHovered ? "translateY(-4px)" : "none",
        boxShadow: isHovered ? "var(--boost-shadow-lg, 0 14px 28px rgba(0, 0, 0, 0.08))" : "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))",
        fontFamily: "inherit",
        position: "relative",
        width: "100%",
        boxSizing: "border-box"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "relative",
              width: "100%",
              aspectRatio: "1 / 1",
              backgroundColor: "var(--boost-bg, #f8fafc)",
              overflow: "hidden",
              cursor: onClick ? "pointer" : "default"
            },
            onClick: onClick ? () => onClick(id) : void 0,
            children: [
              /* @__PURE__ */ jsx(
                "img",
                {
                  src: currentImage,
                  alt: title,
                  style: {
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
                    transform: isHovered ? "scale(1.06)" : "scale(1)"
                  }
                }
              ),
              discountPercent && discountPercent > 0 && /* @__PURE__ */ jsxs(
                "div",
                {
                  style: {
                    position: "absolute",
                    top: "10px",
                    left: "10px",
                    background: "linear-gradient(135deg, #ef4444, #dc2626)",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 800,
                    padding: "3px 8px",
                    borderRadius: "9999px",
                    textTransform: "uppercase",
                    letterSpacing: "0.04em",
                    boxShadow: "0 2px 8px rgba(239, 68, 68, 0.35)",
                    zIndex: 2
                  },
                  children: [
                    discountPercent,
                    "% OFF"
                  ]
                }
              ),
              stockUrgencyText && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    bottom: "10px",
                    left: "10px",
                    backgroundColor: "rgba(220, 38, 38, 0.92)",
                    color: "#ffffff",
                    fontSize: "10px",
                    fontWeight: 700,
                    padding: "3px 8px",
                    borderRadius: "6px",
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                    boxShadow: "0 2px 6px rgba(0, 0, 0, 0.2)",
                    zIndex: 2
                  },
                  children: stockUrgencyText
                }
              ),
              onToggleWishlist && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  "aria-label": "Wishlist",
                  title: isWishlisted ? "Remove from Wishlist" : "Add to Wishlist",
                  onClick: (e) => {
                    e.stopPropagation();
                    onToggleWishlist(id);
                  },
                  style: {
                    position: "absolute",
                    top: "10px",
                    right: "10px",
                    width: "32px",
                    height: "32px",
                    borderRadius: "9999px",
                    backgroundColor: isWishlisted ? "#ffffff" : "rgba(255, 255, 255, 0.85)",
                    backdropFilter: "blur(8px)",
                    WebkitBackdropFilter: "blur(8px)",
                    border: "1px solid rgba(255, 255, 255, 0.6)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
                    cursor: "pointer",
                    padding: 0,
                    transition: "transform 0.15s ease, background-color 0.15s ease",
                    transform: isHovered ? "scale(1.05)" : "scale(1)",
                    zIndex: 2
                  },
                  children: /* @__PURE__ */ jsx(
                    "svg",
                    {
                      width: "15",
                      height: "15",
                      viewBox: "0 0 24 24",
                      fill: isWishlisted ? "#ef4444" : "none",
                      stroke: isWishlisted ? "#ef4444" : "#475569",
                      strokeWidth: "2.2",
                      strokeLinecap: "round",
                      strokeLinejoin: "round",
                      children: /* @__PURE__ */ jsx("path", { d: "M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" })
                    }
                  )
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              padding: "clamp(10px, 2vw, 14px)",
              display: "flex",
              flexDirection: "column",
              gap: "6px",
              flex: 1,
              justifyContent: "space-between"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                brand && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      fontWeight: 700,
                      color: "var(--boost-text-muted, #64748b)",
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                      display: "block",
                      marginBottom: "2px"
                    },
                    children: brand
                  }
                ),
                /* @__PURE__ */ jsx(
                  "h3",
                  {
                    onClick: () => onClick?.(id),
                    style: {
                      fontSize: "clamp(13px, 1.2vw, 14px)",
                      fontWeight: 600,
                      color: "var(--boost-text, #0f172a)",
                      margin: "0 0 4px 0",
                      cursor: onClick ? "pointer" : "default",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      lineHeight: 1.35
                    },
                    children: title
                  }
                ),
                rating !== void 0 && /* @__PURE__ */ jsx("div", { style: { margin: "2px 0" }, children: /* @__PURE__ */ jsx(StarRating, { rating, reviewCount, size: 12 }) })
              ] }),
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "6px", marginTop: "4px", marginBottom: "8px" }, children: [
                  /* @__PURE__ */ jsxs("span", { style: { fontSize: "clamp(15px, 1.4vw, 17px)", fontWeight: 800, color: "var(--boost-text, #0f172a)" }, children: [
                    "\u20B9",
                    price
                  ] }),
                  effectiveOriginalPrice && effectiveOriginalPrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #94a3b8)", textDecoration: "line-through" }, children: [
                    "\u20B9",
                    effectiveOriginalPrice
                  ] })
                ] }),
                onAddToCart && /* @__PURE__ */ jsx(
                  "button",
                  {
                    type: "button",
                    disabled: !inStock,
                    onClick: (e) => {
                      e.stopPropagation();
                      onAddToCart(id);
                    },
                    style: {
                      width: "100%",
                      backgroundColor: inStock ? "var(--boost-primary, #2563eb)" : "var(--boost-border, #cbd5e1)",
                      color: inStock ? "#ffffff" : "var(--boost-text-muted, #64748b)",
                      border: "none",
                      borderRadius: "10px",
                      padding: "8px 12px",
                      fontSize: "12px",
                      fontWeight: 700,
                      cursor: inStock ? "pointer" : "not-allowed",
                      transition: "all 0.15s ease",
                      boxShadow: inStock ? "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.08))" : "none"
                    },
                    children: inStock ? "+ Add to Bag" : "Out of Stock"
                  }
                )
              ] })
            ]
          }
        )
      ]
    }
  );
};
ProductCard.displayName = "ProductCard";
var QuantitySelector = ({
  value,
  onChange,
  min = 1,
  max = 99,
  disabled = false,
  size = "md",
  className = ""
}) => {
  const handleDecrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value > min) {
      onChange(value - 1);
    }
  };
  const handleIncrement = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled && value < max) {
      onChange(value + 1);
    }
  };
  const sizeStyles = {
    sm: {
      padding: "4px 8px",
      fontSize: "13px",
      btnSize: "24px",
      gap: "8px"
    },
    md: {
      padding: "6px 12px",
      fontSize: "15px",
      btnSize: "30px",
      gap: "12px"
    },
    lg: {
      padding: "10px 16px",
      fontSize: "17px",
      btnSize: "36px",
      gap: "16px"
    }
  }[size];
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-quantity-selector ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "space-between",
        backgroundColor: "#f9fafb",
        border: "1px solid #e5e7eb",
        borderRadius: "10px",
        padding: sizeStyles.padding,
        gap: sizeStyles.gap,
        userSelect: "none",
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? "none" : "auto"
      },
      children: [
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleDecrement,
            disabled: disabled || value <= min,
            "aria-label": "Decrease quantity",
            style: {
              width: sizeStyles.btnSize,
              height: sizeStyles.btnSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value <= min ? "transparent" : "#ffffff",
              color: value <= min ? "#9ca3af" : "#111827",
              border: value <= min ? "none" : "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: value <= min ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value <= min ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "2", viewBox: "0 0 12 2", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M1 1H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontWeight: 600,
              fontSize: sizeStyles.fontSize,
              color: "#111827",
              minWidth: "24px",
              textAlign: "center",
              fontVariantNumeric: "tabular-nums"
            },
            children: value
          }
        ),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleIncrement,
            disabled: disabled || value >= max,
            "aria-label": "Increase quantity",
            style: {
              width: sizeStyles.btnSize,
              height: sizeStyles.btnSize,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundColor: value >= max ? "transparent" : "#ffffff",
              color: value >= max ? "#9ca3af" : "#111827",
              border: value >= max ? "none" : "1px solid #e5e7eb",
              borderRadius: "6px",
              cursor: value >= max ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value >= max ? "none" : "0 1px 2px rgba(0,0,0,0.05)",
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 12 12", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M6 1V11M1 6H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
          }
        )
      ]
    }
  );
};
QuantitySelector.displayName = "QuantitySelector";
var ReviewBreakdownBars = ({
  averageRating,
  totalReviews,
  breakdown,
  onFilterByStar,
  selectedStar = null,
  className = ""
}) => {
  const rows = [5, 4, 3, 2, 1].map((star) => {
    let count = 0;
    if (Array.isArray(breakdown)) {
      const item = breakdown.find((b) => b.star === star || b.stars === star);
      count = item ? item.count || item.percentage || 0 : 0;
    } else if (breakdown && typeof breakdown === "object") {
      count = breakdown[star] || 0;
    }
    return { star, count };
  });
  const computedTotal = rows.reduce((sum, r) => sum + r.count, 0);
  const safeTotal = typeof totalReviews === "number" ? totalReviews : computedTotal || 100;
  const safeRating = typeof averageRating === "number" ? averageRating : 4.7;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-review-breakdown ${className}`,
      style: {
        display: "flex",
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: "32px",
        padding: "24px",
        backgroundColor: "#ffffff",
        borderRadius: "16px",
        border: "1px solid #f3f4f6"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minWidth: "140px",
              padding: "12px 16px",
              textAlign: "center"
            },
            children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "48px",
                    fontWeight: 800,
                    color: "#111827",
                    lineHeight: 1,
                    letterSpacing: "-0.02em"
                  },
                  children: safeRating.toFixed(1)
                }
              ),
              /* @__PURE__ */ jsx("div", { style: { marginTop: "8px" }, children: /* @__PURE__ */ jsx(StarRating, { rating: safeRating, size: 20 }) }),
              /* @__PURE__ */ jsxs(
                "span",
                {
                  style: {
                    fontSize: "13px",
                    color: "#6b7280",
                    marginTop: "8px",
                    fontWeight: 500
                  },
                  children: [
                    "Based on ",
                    safeTotal.toLocaleString(),
                    " reviews"
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              flex: 1,
              minWidth: "220px",
              display: "flex",
              flexDirection: "column",
              gap: "10px"
            },
            children: rows.map(({ star, count }) => {
              const percent = safeTotal > 0 ? Math.round(count / safeTotal * 100) : 0;
              const isSelected = selectedStar === star;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  onClick: () => onFilterByStar && onFilterByStar(star),
                  role: onFilterByStar ? "button" : void 0,
                  tabIndex: onFilterByStar ? 0 : void 0,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "12px",
                    cursor: onFilterByStar ? "pointer" : "default",
                    opacity: selectedStar !== null && !isSelected ? 0.45 : 1,
                    transition: "opacity 0.2s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        style: {
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                          minWidth: "42px",
                          fontSize: "13px",
                          fontWeight: 600,
                          color: "#374151"
                        },
                        children: [
                          /* @__PURE__ */ jsx("span", { children: star }),
                          /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 20 20", fill: "#f59e0b", children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) })
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          flex: 1,
                          height: "8px",
                          backgroundColor: "#f3f4f6",
                          borderRadius: "9999px",
                          overflow: "hidden",
                          position: "relative"
                        },
                        children: /* @__PURE__ */ jsx(
                          "div",
                          {
                            style: {
                              height: "100%",
                              width: `${percent}%`,
                              backgroundColor: star >= 4 ? "#10b981" : star === 3 ? "#f59e0b" : "#ef4444",
                              borderRadius: "9999px",
                              transition: "width 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
                            }
                          }
                        )
                      }
                    ),
                    /* @__PURE__ */ jsxs(
                      "span",
                      {
                        style: {
                          minWidth: "38px",
                          textAlign: "right",
                          fontSize: "12px",
                          color: "#6b7280",
                          fontWeight: 500,
                          fontVariantNumeric: "tabular-nums"
                        },
                        children: [
                          percent,
                          "%"
                        ]
                      }
                    )
                  ]
                },
                star
              );
            })
          }
        )
      ]
    }
  );
};
ReviewBreakdownBars.displayName = "ReviewBreakdownBars";
var AnnouncementBar = ({
  messages,
  text,
  couponCode,
  couponBadgeText = "USE CODE",
  linkUrl,
  linkText,
  closable = true,
  backgroundColor = "#111827",
  textColor = "#ffffff",
  accentColor = "#f59e0b",
  onClose,
  className = "",
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);
  const [copied, setCopied] = React.useState(false);
  const [currentIdx, setCurrentIdx] = React.useState(0);
  const raw = messages || text || props.text || ["Welcome to our store! Free shipping on all orders."];
  const messageList = (Array.isArray(raw) ? raw : [raw]).filter(Boolean);
  React.useEffect(() => {
    if (messageList.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % messageList.length);
    }, 4e3);
    return () => clearInterval(timer);
  }, [messageList.length]);
  const handleCopyCode = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!couponCode) return;
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(couponCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2e3);
    }
  };
  const handleClose = (e) => {
    e.preventDefault();
    setIsVisible(false);
    if (onClose) onClose();
  };
  if (!isVisible || messageList.length === 0) return null;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-announcement-bar ${className}`,
      style: {
        backgroundColor,
        color: textColor,
        padding: "8px 16px",
        fontSize: "13px",
        fontWeight: 500,
        position: "relative",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              flexWrap: "wrap",
              justifyContent: "center",
              gap: "10px"
            },
            children: [
              /* @__PURE__ */ jsx("span", { children: messageList[currentIdx] }),
              couponCode && /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleCopyCode,
                  style: {
                    display: "inline-flex",
                    alignItems: "center",
                    gap: "6px",
                    backgroundColor: "rgba(255, 255, 255, 0.15)",
                    border: `1px dashed ${accentColor}`,
                    borderRadius: "6px",
                    padding: "2px 8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: textColor,
                    cursor: "pointer",
                    letterSpacing: "0.04em",
                    transition: "all 0.15s ease"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("span", { style: { color: accentColor }, children: [
                      couponBadgeText,
                      ":"
                    ] }),
                    /* @__PURE__ */ jsx("span", { style: { textDecoration: "underline" }, children: couponCode }),
                    copied ? /* @__PURE__ */ jsx("span", { style: { color: "#10b981", marginLeft: "2px" }, children: "\u2713 Copied" }) : /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                      /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                    ] })
                  ]
                }
              ),
              linkUrl && linkText && /* @__PURE__ */ jsxs(
                "a",
                {
                  href: linkUrl,
                  style: {
                    color: accentColor,
                    textDecoration: "underline",
                    fontWeight: 600,
                    marginLeft: "4px"
                  },
                  children: [
                    linkText,
                    " \u2192"
                  ]
                }
              )
            ]
          }
        ),
        closable && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: handleClose,
            "aria-label": "Dismiss banner",
            style: {
              position: "absolute",
              right: "12px",
              top: "50%",
              transform: "translateY(-50%)",
              background: "none",
              border: "none",
              color: textColor,
              opacity: 0.7,
              cursor: "pointer",
              padding: "4px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
              /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
              /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
            ] })
          }
        )
      ]
    }
  );
};
AnnouncementBar.displayName = "AnnouncementBar";
var LightningDealsBar = ({
  dealTitle = "LIGHTNING DEAL",
  endsAt,
  dealEndsInSeconds,
  percentageClaimed = 78,
  claimedPercent,
  totalQuantity,
  claimedQuantity,
  badgeColor = "#ef4444",
  className = "",
  onExpire,
  hideOnExpire = true,
  ...props
}) => {
  const [timeLeft, setTimeLeft] = React.useState({
    hours: 2,
    minutes: 0,
    seconds: 0,
    isExpired: false
  });
  const effectivePercent = claimedPercent !== void 0 ? claimedPercent : props.claimedPercent !== void 0 ? props.claimedPercent : percentageClaimed;
  const secondsProp = dealEndsInSeconds || props.dealEndsInSeconds;
  React.useEffect(() => {
    let end;
    if (secondsProp) {
      end = Date.now() + Number(secondsProp) * 1e3;
    } else if (endsAt) {
      const parsed = new Date(endsAt).getTime();
      end = isNaN(parsed) ? Date.now() + 7200 * 1e3 : parsed;
    } else {
      end = Date.now() + 7200 * 1e3;
    }
    const update = () => {
      const now = Date.now();
      const diff = Math.max(0, end - now);
      if (diff === 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true });
        if (onExpire) onExpire();
        return;
      }
      const hours = Math.floor(diff / (1e3 * 60 * 60));
      const minutes = Math.floor(diff % (1e3 * 60 * 60) / (1e3 * 60));
      const seconds = Math.floor(diff % (1e3 * 60) / 1e3);
      setTimeLeft({
        hours: isNaN(hours) ? 0 : hours,
        minutes: isNaN(minutes) ? 0 : minutes,
        seconds: isNaN(seconds) ? 0 : seconds,
        isExpired: false
      });
    };
    update();
    const timer = setInterval(update, 1e3);
    return () => clearInterval(timer);
  }, [endsAt, secondsProp]);
  const pad = (n) => String(n).padStart(2, "0");
  let percent = effectivePercent;
  if (totalQuantity && claimedQuantity !== void 0) {
    percent = Math.round(claimedQuantity / totalQuantity * 100);
  }
  percent = Math.min(100, Math.max(0, percent));
  if (timeLeft.isExpired && hideOnExpire) {
    return null;
  }
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-lightning-deals-bar ${className}`,
      style: {
        backgroundColor: "#fffbeb",
        border: "1px solid #fde68a",
        borderRadius: "12px",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        gap: "8px",
        boxShadow: "0 1px 3px rgba(0,0,0,0.05)"
      },
      children: [
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      backgroundColor: badgeColor,
                      color: "#ffffff",
                      fontSize: "11px",
                      fontWeight: 800,
                      letterSpacing: "0.05em",
                      padding: "3px 8px",
                      borderRadius: "4px",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "4px"
                    },
                    children: dealTitle
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 600, color: "#92400e" }, children: "Ends in:" })
              ] }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.hours),
                      "h"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "#92400e" }, children: ":" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#1f2937",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.minutes),
                      "m"
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "#92400e" }, children: ":" }),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      backgroundColor: "#ef4444",
                      color: "#ffffff",
                      fontWeight: 700,
                      fontSize: "12px",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      fontVariantNumeric: "tabular-nums"
                    },
                    children: [
                      pad(timeLeft.seconds),
                      "s"
                    ]
                  }
                )
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                height: "6px",
                backgroundColor: "#e5e7eb",
                borderRadius: "9999px",
                overflow: "hidden"
              },
              children: /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    height: "100%",
                    width: `${percent}%`,
                    backgroundColor: percent > 85 ? "#dc2626" : "#f59e0b",
                    borderRadius: "9999px",
                    transition: "width 0.3s ease"
                  }
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "11px",
                color: "#78350f",
                fontWeight: 600
              },
              children: [
                /* @__PURE__ */ jsxs("span", { children: [
                  percent,
                  "% Claimed"
                ] }),
                /* @__PURE__ */ jsx("span", { children: "Hurry, limited stock!" })
              ]
            }
          )
        ] })
      ]
    }
  );
};
LightningDealsBar.displayName = "LightningDealsBar";
var FrequentlyBoughtTogether = ({
  mainProduct,
  suggestedItems,
  bundleDiscountPercentage = 10,
  currencySymbol = "\u20B9",
  onAddBundleToCart,
  className = ""
}) => {
  const allItems = [mainProduct, ...suggestedItems];
  const [selectedIds, setSelectedIds] = React.useState(
    allItems.map((i) => i.id)
  );
  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const selectedItems = allItems.filter((i) => selectedIds.includes(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const discountAmount = selectedItems.length > 1 ? Math.round(subtotal * bundleDiscountPercentage / 100) : 0;
  const finalPrice = subtotal - discountAmount;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-frequently-bought ${className}`,
      style: {
        backgroundColor: "#ffffff",
        border: "1px solid #e5e7eb",
        borderRadius: "16px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between" }, children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              style: {
                fontSize: "18px",
                fontWeight: 700,
                color: "#111827",
                margin: 0,
                letterSpacing: "-0.01em"
              },
              children: "Frequently Bought Together"
            }
          ),
          selectedItems.length > 1 && /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                backgroundColor: "#ecfdf5",
                color: "#059669",
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "9999px",
                border: "1px solid #a7f3d0"
              },
              children: [
                "Save ",
                bundleDiscountPercentage,
                "% on Combo"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "12px",
              overflowX: "auto",
              paddingBottom: "8px"
            },
            children: allItems.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                index > 0 && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "20px",
                      fontWeight: 700,
                      color: "#9ca3af",
                      flexShrink: 0
                    },
                    children: "+"
                  }
                ),
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => toggleItem(item.id),
                    style: {
                      width: "90px",
                      height: "90px",
                      borderRadius: "12px",
                      border: isSelected ? "2px solid #2563eb" : "1px solid #e5e7eb",
                      backgroundColor: "#f9fafb",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "6px",
                      cursor: "pointer",
                      position: "relative",
                      opacity: isSelected ? 1 : 0.4,
                      transition: "all 0.2s ease",
                      flexShrink: 0
                    },
                    children: /* @__PURE__ */ jsx(
                      "img",
                      {
                        src: item.imageUrl,
                        alt: item.title,
                        style: {
                          maxWidth: "100%",
                          maxHeight: "100%",
                          objectFit: "contain"
                        }
                      }
                    )
                  }
                )
              ] }, item.id);
            })
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: allItems.map((item, idx) => {
          const isSelected = selectedIds.includes(item.id);
          return /* @__PURE__ */ jsxs(
            "label",
            {
              style: {
                display: "flex",
                alignItems: "flex-start",
                gap: "10px",
                fontSize: "13px",
                cursor: "pointer"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: () => toggleItem(item.id),
                    style: {
                      marginTop: "3px",
                      accentColor: "#2563eb",
                      cursor: "pointer"
                    }
                  }
                ),
                /* @__PURE__ */ jsxs("span", { style: { color: isSelected ? "#111827" : "#6b7280", flex: 1 }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: idx === 0 ? "This item: " : "" }),
                  item.title,
                  /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700, marginLeft: "6px", color: "#111827" }, children: [
                    currencySymbol,
                    item.price.toLocaleString("en-IN")
                  ] })
                ] })
              ]
            },
            item.id
          );
        }) }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "16px",
              paddingTop: "16px",
              borderTop: "1px solid #f3f4f6"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "8px" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "#6b7280" }, children: "Total price:" }),
                  /* @__PURE__ */ jsxs("span", { style: { fontSize: "20px", fontWeight: 800, color: "#111827" }, children: [
                    currencySymbol,
                    finalPrice.toLocaleString("en-IN")
                  ] }),
                  discountAmount > 0 && /* @__PURE__ */ jsxs(
                    "span",
                    {
                      style: {
                        fontSize: "14px",
                        color: "#9ca3af",
                        textDecoration: "line-through"
                      },
                      children: [
                        currencySymbol,
                        subtotal.toLocaleString("en-IN")
                      ]
                    }
                  )
                ] }),
                discountAmount > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#059669", fontWeight: 600 }, children: [
                  "You save ",
                  currencySymbol,
                  discountAmount.toLocaleString("en-IN"),
                  " (",
                  bundleDiscountPercentage,
                  "% OFF)"
                ] })
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onAddBundleToCart && onAddBundleToCart(selectedItems),
                  style: {
                    backgroundColor: "#facc15",
                    color: "#111827",
                    fontWeight: 700,
                    fontSize: "13px",
                    padding: "10px 20px",
                    borderRadius: "9999px",
                    border: "1px solid #eab308",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
                  },
                  children: [
                    "Add ",
                    selectedItems.length,
                    " items to Cart"
                  ]
                }
              )
            ]
          }
        )
      ]
    }
  );
};
FrequentlyBoughtTogether.displayName = "FrequentlyBoughtTogether";
var DEFAULT_OFFERS = [
  {
    id: "hdfc-instant",
    type: "instant",
    title: "Bank Offer: 10% Instant Discount",
    description: "Up to \u20B91,500 on HDFC Bank Credit & Debit Card EMI transactions on min purchase \u20B95,000.",
    code: "HDFC10"
  },
  {
    id: "sbi-instant",
    type: "instant",
    title: "Bank Offer: Flat \u20B91,250 Off",
    description: "On SBI Credit Card Non-EMI transactions on orders above \u20B910,000.",
    code: "SBISPECIAL"
  },
  {
    id: "no-cost-emi",
    type: "emi",
    title: "No Cost EMI Available",
    description: "Avail No Cost EMI on select cards for orders above \u20B93,000. Interest savings upfront."
  },
  {
    id: "supercoins-offer",
    type: "cashback",
    title: "SuperCoins / Pay Cashback",
    description: "Get extra 5% cashback or 4 SuperCoins per \u20B9100 for Gold & SuperStar members."
  }
];
var BankOffersAccordion = ({
  offers = DEFAULT_OFFERS,
  className = ""
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const displayedOffers = expanded ? offers : offers.slice(0, 2);
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-bank-offers ${className}`,
      style: {
        backgroundColor: "#f8fafc",
        border: "1px solid #e2e8f0",
        borderRadius: "12px",
        padding: "16px",
        display: "flex",
        flexDirection: "column",
        gap: "12px"
      },
      children: [
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#2563eb", strokeWidth: "2", children: [
            /* @__PURE__ */ jsx("rect", { x: "1", y: "4", width: "22", height: "16", rx: "2", ry: "2" }),
            /* @__PURE__ */ jsx("line", { x1: "1", y1: "10", x2: "23", y2: "10" })
          ] }),
          /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 700, color: "#1e293b" }, children: "Available Offers & Discounts" }),
          /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                backgroundColor: "#dbeafe",
                color: "#1d4ed8",
                fontSize: "11px",
                fontWeight: 700,
                padding: "2px 6px",
                borderRadius: "4px",
                marginLeft: "auto"
              },
              children: [
                offers.length,
                " Offers"
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "8px" }, children: displayedOffers.map((offer) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              backgroundColor: "#ffffff",
              border: "1px solid #edf2f7",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      width: "6px",
                      height: "6px",
                      borderRadius: "9999px",
                      backgroundColor: "#2563eb",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 700, color: "#0f172a" }, children: offer.title }),
                offer.code && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      fontFamily: "monospace",
                      fontWeight: 700,
                      backgroundColor: "#f1f5f9",
                      color: "#475569",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px dashed #cbd5e1",
                      marginLeft: "auto"
                    },
                    children: offer.code
                  }
                )
              ] }),
              /* @__PURE__ */ jsx(
                "p",
                {
                  style: {
                    fontSize: "11px",
                    color: "#64748b",
                    margin: "0 0 0 12px",
                    lineHeight: 1.4
                  },
                  children: offer.description
                }
              )
            ]
          },
          offer.id
        )) }),
        offers.length > 2 && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded(!expanded),
            style: {
              background: "none",
              border: "none",
              color: "#2563eb",
              fontSize: "12px",
              fontWeight: 600,
              padding: "4px 0",
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              alignItems: "center",
              gap: "4px"
            },
            children: [
              expanded ? "Show Less Offers" : `View ${offers.length - 2} More Offers`,
              /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "12",
                  height: "12",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  style: {
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.2s"
                  },
                  children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        )
      ]
    }
  );
};
BankOffersAccordion.displayName = "BankOffersAccordion";
var AssuredBadge = ({
  type = "assured",
  className = ""
}) => {
  if (type === "prime") {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `boost-badge-prime ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#002f34",
          color: "#00a8e1",
          fontSize: "11px",
          fontWeight: 800,
          fontStyle: "italic",
          padding: "2px 8px",
          borderRadius: "4px",
          letterSpacing: "0.05em"
        },
        children: [
          /* @__PURE__ */ jsx("span", { style: { color: "#ffffff" }, children: "BOOST" }),
          /* @__PURE__ */ jsx("span", { style: { color: "#00a8e1" }, children: "prime" }),
          /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "#00a8e1", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
        ]
      }
    );
  }
  if (type === "supercoin") {
    return /* @__PURE__ */ jsxs(
      "span",
      {
        className: `boost-badge-supercoin ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "4px",
          backgroundColor: "#fffbeb",
          color: "#b45309",
          border: "1px solid #fde68a",
          fontSize: "11px",
          fontWeight: 700,
          padding: "2px 8px",
          borderRadius: "9999px"
        },
        children: [
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: "14px",
                height: "14px",
                borderRadius: "9999px",
                backgroundColor: "#f59e0b",
                color: "#ffffff"
              },
              children: /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "9" }) })
            }
          ),
          "SuperCoins Partner"
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `boost-badge-assured ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "4px",
        backgroundColor: "#eef2ff",
        color: "#2874f0",
        border: "1px solid #bfdbfe",
        fontSize: "11px",
        fontWeight: 800,
        fontStyle: "italic",
        padding: "2px 8px",
        borderRadius: "4px"
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: "Boost" }),
        /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              backgroundColor: "#2874f0",
              color: "#ffffff",
              padding: "1px 4px",
              borderRadius: "2px",
              fontSize: "10px",
              fontStyle: "normal",
              fontWeight: 700,
              display: "inline-flex",
              alignItems: "center",
              gap: "2px"
            },
            children: [
              "Assured",
              /* @__PURE__ */ jsx("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", stroke: "#ffffff", strokeWidth: "3", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
            ]
          }
        )
      ]
    }
  );
};
AssuredBadge.displayName = "AssuredBadge";
var DualMobileActionBar = ({
  price,
  compareAtPrice,
  currencySymbol = "\u20B9",
  isWishlisted = false,
  isInCart = false,
  onAddToCart,
  onBuyNow,
  onToggleWishlist,
  position,
  className = "",
  ...props
}) => {
  const isRelative = position === "relative" || props.position === "relative";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isRelative && /* @__PURE__ */ jsx("style", { children: `
          @media (min-width: 768px) {
            .boost-dual-mobile-action-bar {
              display: none !important;
            }
          }
        ` }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: `boost-dual-mobile-action-bar ${isRelative ? "" : "md:hidden"} ${className}`,
        style: {
          position: isRelative ? "relative" : "fixed",
          bottom: isRelative ? void 0 : 0,
          left: isRelative ? void 0 : 0,
          right: isRelative ? void 0 : 0,
          width: "100%",
          backgroundColor: "#0f172a",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          borderRadius: isRelative ? "12px" : 0,
          padding: "12px 16px",
          zIndex: isRelative ? 1 : 50,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxShadow: isRelative ? "0 8px 24px rgba(0, 0, 0, 0.3)" : "0 -4px 16px rgba(0, 0, 0, 0.08)",
          boxSizing: "border-box"
        },
        children: [
          price !== void 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", minWidth: "65px", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxs("span", { style: { color: "#ffffff", fontWeight: 800, fontSize: "15px", lineHeight: 1.1 }, children: [
              currencySymbol,
              Number(price).toLocaleString()
            ] }),
            compareAtPrice && compareAtPrice > price && /* @__PURE__ */ jsxs("span", { style: { color: "#94a3b8", fontSize: "11px", textDecoration: "line-through" }, children: [
              currencySymbol,
              Number(compareAtPrice).toLocaleString()
            ] })
          ] }),
          onToggleWishlist && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleWishlist,
              "aria-label": "Wishlist",
              style: {
                width: "44px",
                height: "44px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                flexShrink: 0
              },
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: isWishlisted ? "#ef4444" : "none",
                  stroke: isWishlisted ? "#ef4444" : "#6b7280",
                  strokeWidth: "2",
                  children: /* @__PURE__ */ jsx("path", { d: "M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" })
                }
              )
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onAddToCart,
              style: {
                flex: 1,
                height: "44px",
                backgroundColor: "#ff9f00",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 4px rgba(255, 159, 0, 0.3)",
                transition: "transform 0.1s active"
              },
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
                ] }),
                isInCart ? "In Cart" : "Add to Cart"
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onBuyNow,
              style: {
                flex: 1,
                height: "44px",
                backgroundColor: "#fb641b",
                color: "#ffffff",
                fontWeight: 700,
                fontSize: "14px",
                borderRadius: "8px",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "6px",
                boxShadow: "0 2px 4px rgba(251, 100, 27, 0.3)",
                transition: "transform 0.1s active"
              },
              children: [
                /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
                "Buy Now"
              ]
            }
          )
        ]
      }
    )
  ] });
};
DualMobileActionBar.displayName = "DualMobileActionBar";
var Price = ({
  amount,
  originalAmount,
  currencySymbol = "\u20B9",
  size = "md",
  showDiscount = true,
  showSavings = false,
  className = "",
  style
}) => {
  const hasDiscount = originalAmount && originalAmount > amount;
  const discountPercent = hasDiscount ? Math.round((originalAmount - amount) / originalAmount * 100) : 0;
  const savingsAmount = hasDiscount ? originalAmount - amount : 0;
  const sizeStyles = {
    sm: { current: "14px", original: "12px", discount: "11px" },
    md: { current: "18px", original: "14px", discount: "12px" },
    lg: { current: "24px", original: "16px", discount: "13px" },
    xl: { current: "30px", original: "18px", discount: "14px" }
  };
  const currentSize = sizeStyles[size] || sizeStyles.md;
  const formatNumber2 = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className,
      style: {
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "baseline",
        gap: "8px",
        fontFamily: "system-ui, -apple-system, sans-serif",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              fontSize: currentSize.current,
              fontWeight: 700,
              color: "#0f172a",
              letterSpacing: "-0.5px"
            },
            children: [
              currencySymbol,
              formatNumber2(amount)
            ]
          }
        ),
        hasDiscount && /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              fontSize: currentSize.original,
              color: "#94a3b8",
              textDecoration: "line-through",
              fontWeight: 400
            },
            children: [
              currencySymbol,
              formatNumber2(originalAmount)
            ]
          }
        ),
        hasDiscount && showDiscount && discountPercent > 0 && /* @__PURE__ */ jsxs(
          "span",
          {
            style: {
              fontSize: currentSize.discount,
              fontWeight: 700,
              color: "#16a34a",
              backgroundColor: "#dcfce7",
              padding: "2px 6px",
              borderRadius: "4px",
              lineHeight: 1.2
            },
            children: [
              discountPercent,
              "% OFF"
            ]
          }
        ),
        hasDiscount && showSavings && /* @__PURE__ */ jsxs("span", { style: { width: "100%", fontSize: "12px", color: "#16a34a", fontWeight: 500 }, children: [
          "You save ",
          currencySymbol,
          formatNumber2(savingsAmount)
        ] })
      ]
    }
  );
};
Price.displayName = "Price";
var AddToCart = ({
  onAdd,
  onQuantityChange,
  initialQuantity = 0,
  maxQuantity = 10,
  loading = false,
  disabled = false,
  showStepperOnAdd = true,
  label = "Add to Cart",
  style
}) => {
  const [quantity, setQuantity] = useState(initialQuantity);
  const handleAdd = () => {
    if (disabled || loading) return;
    const nextQty = 1;
    setQuantity(nextQty);
    onAdd?.(nextQty);
    onQuantityChange?.(nextQty);
  };
  const handleIncrement = () => {
    if (quantity >= maxQuantity) return;
    const nextQty = quantity + 1;
    setQuantity(nextQty);
    onQuantityChange?.(nextQty);
  };
  const handleDecrement = () => {
    const nextQty = quantity - 1;
    setQuantity(nextQty);
    onQuantityChange?.(nextQty);
  };
  if (showStepperOnAdd && quantity > 0) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid #0f172a",
          borderRadius: "6px",
          overflow: "hidden",
          backgroundColor: "#ffffff",
          fontFamily: "system-ui, -apple-system, sans-serif",
          ...style
        },
        children: [
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleDecrement,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "38px",
                backgroundColor: "#ffffff",
                border: "none",
                color: "#0f172a",
                cursor: "pointer",
                fontSize: "16px",
                fontWeight: 600
              },
              children: quantity === 1 ? /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
                /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
              ] }) : /* @__PURE__ */ jsx("span", { children: "-" })
            }
          ),
          /* @__PURE__ */ jsx(
            "span",
            {
              style: {
                minWidth: "36px",
                textAlign: "center",
                fontSize: "14px",
                fontWeight: 700,
                color: "#0f172a"
              },
              children: quantity
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleIncrement,
              disabled: quantity >= maxQuantity,
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                width: "36px",
                height: "38px",
                backgroundColor: "#ffffff",
                border: "none",
                color: quantity >= maxQuantity ? "#cbd5e1" : "#0f172a",
                cursor: quantity >= maxQuantity ? "not-allowed" : "pointer",
                fontSize: "16px",
                fontWeight: 600
              },
              children: "+"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: handleAdd,
      disabled: disabled || loading,
      style: {
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: "10px 20px",
        backgroundColor: "#0f172a",
        color: "#ffffff",
        fontSize: "14px",
        fontWeight: 600,
        borderRadius: "6px",
        border: "none",
        cursor: disabled || loading ? "not-allowed" : "pointer",
        opacity: disabled ? 0.6 : 1,
        fontFamily: "system-ui, -apple-system, sans-serif",
        transition: "background-color 0.15s ease",
        ...style
      },
      children: [
        loading ? /* @__PURE__ */ jsxs(
          "svg",
          {
            style: { animation: "spin 1s linear infinite", width: "16px", height: "16px" },
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2",
            children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
              /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
            ]
          }
        ) : /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
          /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
          /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: label })
      ]
    }
  );
};
AddToCart.displayName = "AddToCart";
var CouponInput = ({
  onApply,
  onRemove,
  appliedCode,
  discountText,
  loading = false,
  error,
  placeholder = "Enter promo code",
  style
}) => {
  const [code, setCode] = useState("");
  const handleApply = (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    onApply?.(code.trim().toUpperCase());
  };
  const handleRemove = () => {
    setCode("");
    onRemove?.();
  };
  if (appliedCode) {
    return /* @__PURE__ */ jsxs(
      "div",
      {
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "10px 14px",
          backgroundColor: "#f0fdf4",
          border: "1px dashed #86efac",
          borderRadius: "8px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          ...style
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
            /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "#16a34a", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", fontWeight: 700, color: "#15803d", letterSpacing: "0.5px" }, children: appliedCode }),
              discountText && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "#166534", marginLeft: "6px" }, children: [
                "(",
                discountText,
                ")"
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleRemove,
              style: {
                background: "none",
                border: "none",
                color: "#ef4444",
                fontSize: "12px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "2px 6px"
              },
              children: "Remove"
            }
          )
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxs("div", { style: { fontFamily: "system-ui, -apple-system, sans-serif", ...style }, children: [
    /* @__PURE__ */ jsxs(
      "form",
      {
        onSubmit: handleApply,
        style: {
          display: "flex",
          gap: "8px"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { position: "relative", flex: 1 }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  position: "absolute",
                  left: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "#94a3b8",
                  display: "flex",
                  alignItems: "center"
                },
                children: /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
                  /* @__PURE__ */ jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: code,
                onChange: (e) => setCode(e.target.value.toUpperCase()),
                placeholder,
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "9px 12px 9px 34px",
                  fontSize: "13px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  border: `1px solid ${error ? "#ef4444" : "#cbd5e1"}`,
                  borderRadius: "6px",
                  outline: "none"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "submit",
              disabled: !code.trim() || loading,
              style: {
                padding: "9px 16px",
                backgroundColor: "#0f172a",
                color: "#ffffff",
                fontSize: "13px",
                fontWeight: 600,
                borderRadius: "6px",
                border: "none",
                cursor: !code.trim() || loading ? "not-allowed" : "pointer",
                opacity: !code.trim() || loading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "6px"
              },
              children: [
                loading && /* @__PURE__ */ jsxs(
                  "svg",
                  {
                    style: { animation: "spin 1s linear infinite", width: "14px", height: "14px" },
                    viewBox: "0 0 24 24",
                    fill: "none",
                    stroke: "currentColor",
                    strokeWidth: "2",
                    children: [
                      /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                      /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                    ]
                  }
                ),
                /* @__PURE__ */ jsx("span", { children: "Apply" })
              ]
            }
          )
        ]
      }
    ),
    error && /* @__PURE__ */ jsxs("div", { style: { fontSize: "12px", color: "#ef4444", marginTop: "6px", display: "flex", alignItems: "center", gap: "4px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] })
  ] });
};
CouponInput.displayName = "CouponInput";
var AddressForm = ({
  onSubmit,
  initialData,
  loading = false,
  onCancel,
  title = "Shipping Address",
  style
}) => {
  const [formData, setFormData] = useState({
    fullName: initialData?.fullName || "",
    phone: initialData?.phone || "",
    pincode: initialData?.pincode || "",
    houseNumber: initialData?.houseNumber || "",
    street: initialData?.street || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    addressType: initialData?.addressType || "home",
    isDefault: initialData?.isDefault ?? true
  });
  const [errors, setErrors] = useState({});
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: void 0 }));
    }
  };
  const validate = () => {
    const errs = {};
    if (!formData.fullName.trim()) {
      errs.fullName = "Full name is required";
    } else if (formData.fullName.trim().length < 2) {
      errs.fullName = "Please enter a valid name";
    }
    const cleanPhone = formData.phone.replace(/[\s\-\(\)]/g, "");
    if (!cleanPhone) {
      errs.phone = "Phone number is required";
    } else if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid 10-digit mobile number";
    }
    const cleanPin = formData.pincode.trim();
    if (!cleanPin) {
      errs.pincode = "Pincode is required";
    } else if (!/^[0-9]{6}$/.test(cleanPin)) {
      errs.pincode = "Please enter a valid 6-digit pincode";
    }
    if (!formData.houseNumber.trim()) {
      errs.houseNumber = "House / Flat number is required";
    }
    if (!formData.street.trim()) {
      errs.street = "Street or area details are required";
    }
    if (!formData.city.trim()) {
      errs.city = "City is required";
    }
    if (!formData.state.trim()) {
      errs.state = "State is required";
    }
    return errs;
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    onSubmit?.(formData);
  };
  const getInputStyle = (hasError) => ({
    width: "100%",
    boxSizing: "border-box",
    padding: "10px 14px",
    fontSize: "13px",
    border: `1px solid ${hasError ? "#ef4444" : "var(--boost-border, #cbd5e1)"}`,
    borderRadius: "var(--boost-radius, 10px)",
    backgroundColor: "var(--boost-bg, #ffffff)",
    color: "var(--boost-text, #0f172a)",
    outline: "none",
    transition: "border-color 0.15s ease"
  });
  const labelStyle = {
    display: "block",
    fontSize: "12px",
    fontWeight: 600,
    color: "var(--boost-text, #334155)",
    marginBottom: "6px"
  };
  const renderError = (msg) => {
    if (!msg) return null;
    return /* @__PURE__ */ jsxs("span", { style: { display: "flex", alignItems: "center", gap: "4px", fontSize: "11px", color: "#ef4444", marginTop: "4px", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
      ] }),
      msg
    ] });
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "boost-address-form",
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "clamp(16px, 3vw, 24px)",
        fontFamily: "inherit",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        boxSizing: "border-box",
        width: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "18px", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 20px" }, children: title }),
        /* @__PURE__ */ jsxs("form", { noValidate: true, onSubmit: handleSubmit, style: { display: "flex", flexDirection: "column", gap: "14px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Full Name *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.fullName,
                  onChange: (e) => handleChange("fullName", e.target.value),
                  placeholder: "e.g. Rahul Sharma",
                  style: getInputStyle(!!errors.fullName)
                }
              ),
              renderError(errors.fullName)
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Phone Number *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "tel",
                  value: formData.phone,
                  onChange: (e) => handleChange("phone", e.target.value),
                  placeholder: "10-digit mobile number",
                  style: getInputStyle(!!errors.phone)
                }
              ),
              renderError(errors.phone)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Pincode *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  maxLength: 6,
                  value: formData.pincode,
                  onChange: (e) => handleChange("pincode", e.target.value),
                  placeholder: "e.g. 110001",
                  style: getInputStyle(!!errors.pincode)
                }
              ),
              renderError(errors.pincode)
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 1" }, children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Flat / House No. / Building *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.houseNumber,
                  onChange: (e) => handleChange("houseNumber", e.target.value),
                  placeholder: "e.g. Flat 402, Lotus Tower",
                  style: getInputStyle(!!errors.houseNumber)
                }
              ),
              renderError(errors.houseNumber)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Area / Street / Sector *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formData.street,
                onChange: (e) => handleChange("street", e.target.value),
                placeholder: "e.g. MG Road, Near Central Park",
                style: getInputStyle(!!errors.street)
              }
            ),
            renderError(errors.street)
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 200px), 1fr))", gap: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "City / Town *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.city,
                  onChange: (e) => handleChange("city", e.target.value),
                  placeholder: "e.g. New Delhi",
                  style: getInputStyle(!!errors.city)
                }
              ),
              renderError(errors.city)
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "State *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.state,
                  onChange: (e) => handleChange("state", e.target.value),
                  placeholder: "e.g. Delhi",
                  style: getInputStyle(!!errors.state)
                }
              ),
              renderError(errors.state)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Address Type" }),
            /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "10px", marginTop: "4px", flexWrap: "wrap" }, children: ["home", "work", "other"].map((type) => /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: () => handleChange("addressType", type),
                style: {
                  padding: "7px 16px",
                  fontSize: "12px",
                  fontWeight: 600,
                  textTransform: "capitalize",
                  borderRadius: "var(--boost-radius, 8px)",
                  border: `1px solid ${formData.addressType === type ? "var(--boost-primary, #2563eb)" : "var(--boost-border, #cbd5e1)"}`,
                  backgroundColor: formData.addressType === type ? "var(--boost-primary, #2563eb)" : "var(--boost-surface, #ffffff)",
                  color: formData.addressType === type ? "#ffffff" : "var(--boost-text-muted, #475569)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: type
              },
              type
            )) })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "4px" }, children: [
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "checkbox",
                id: "default-address-checkbox",
                checked: formData.isDefault,
                onChange: (e) => handleChange("isDefault", e.target.checked),
                style: { cursor: "pointer" }
              }
            ),
            /* @__PURE__ */ jsx("label", { htmlFor: "default-address-checkbox", style: { fontSize: "13px", color: "var(--boost-text-muted, #475569)", cursor: "pointer" }, children: "Make this my default shipping address" })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }, children: [
            /* @__PURE__ */ jsxs(
              "button",
              {
                type: "submit",
                disabled: loading,
                style: {
                  flex: "1 1 200px",
                  padding: "13px",
                  backgroundColor: "var(--boost-primary, #2563eb)",
                  color: "#ffffff",
                  fontSize: "14px",
                  fontWeight: 700,
                  borderRadius: "var(--boost-radius, 12px)",
                  border: "none",
                  cursor: loading ? "not-allowed" : "pointer",
                  opacity: loading ? 0.7 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "8px",
                  boxShadow: "var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))",
                  transition: "all 0.15s ease"
                },
                children: [
                  loading && /* @__PURE__ */ jsxs(
                    "svg",
                    {
                      style: { animation: "boost-spin 1s linear infinite", width: "16px", height: "16px" },
                      viewBox: "0 0 24 24",
                      fill: "none",
                      stroke: "currentColor",
                      strokeWidth: "2",
                      children: [
                        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                        /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("span", { children: "Save & Deliver Here" })
                ]
              }
            ),
            onCancel && /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                onClick: onCancel,
                style: {
                  padding: "13px 20px",
                  backgroundColor: "transparent",
                  color: "var(--boost-text-muted, #475569)",
                  fontSize: "14px",
                  fontWeight: 600,
                  borderRadius: "var(--boost-radius, 12px)",
                  border: "1px solid var(--boost-border, #cbd5e1)",
                  cursor: "pointer",
                  transition: "all 0.15s ease"
                },
                children: "Cancel"
              }
            )
          ] })
        ] })
      ]
    }
  );
};
AddressForm.displayName = "AddressForm";
var OrderSummary = ({
  subtotal,
  discount = 0,
  shippingFee = 0,
  tax = 0,
  currencySymbol = "\u20B9",
  freeShippingThreshold,
  onCheckout,
  loading = false,
  checkoutButtonText = "Proceed to Checkout",
  customRows = [],
  style
}) => {
  const isFreeShipping = shippingFee === 0;
  const total = Math.max(0, subtotal - discount + (isFreeShipping ? 0 : shippingFee) + tax);
  const formatNumber2 = (num) => {
    return new Intl.NumberFormat("en-IN").format(num);
  };
  const remainingForFreeShipping = freeShippingThreshold && subtotal < freeShippingThreshold ? freeShippingThreshold - subtotal : 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "boost-order-summary",
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        padding: "clamp(16px, 3vw, 24px)",
        fontFamily: "inherit",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
        boxSizing: "border-box",
        width: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("h3", { style: { fontSize: "17px", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 16px" }, children: "Order Summary" }),
        freeShippingThreshold && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              padding: "10px 14px",
              backgroundColor: isFreeShipping || remainingForFreeShipping === 0 ? "rgba(34, 197, 94, 0.1)" : "rgba(37, 99, 235, 0.08)",
              borderRadius: "8px",
              marginBottom: "16px",
              fontSize: "12px",
              fontWeight: 600,
              color: isFreeShipping || remainingForFreeShipping === 0 ? "#16a34a" : "var(--boost-primary, #2563eb)",
              display: "flex",
              alignItems: "center",
              gap: "8px"
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                /* @__PURE__ */ jsx("rect", { x: "1", y: "3", width: "15", height: "13" }),
                /* @__PURE__ */ jsx("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }),
                /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "18.5", r: "2.5" }),
                /* @__PURE__ */ jsx("circle", { cx: "18.5", cy: "18.5", r: "2.5" })
              ] }),
              /* @__PURE__ */ jsx("span", { children: isFreeShipping || remainingForFreeShipping === 0 ? "\u{1F389} You have qualified for Free Delivery!" : `Add ${currencySymbol}${formatNumber2(remainingForFreeShipping)} more to get Free Delivery.` })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "11px", fontSize: "13px" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--boost-text-muted, #64748b)" }, children: [
            /* @__PURE__ */ jsx("span", { children: "Subtotal" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, color: "var(--boost-text, #0f172a)" }, children: [
              currencySymbol,
              formatNumber2(subtotal)
            ] })
          ] }),
          discount > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "#16a34a" }, children: [
            /* @__PURE__ */ jsx("span", { children: "Discount" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 700 }, children: [
              "-",
              currencySymbol,
              formatNumber2(discount)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--boost-text-muted, #64748b)" }, children: [
            /* @__PURE__ */ jsx("span", { children: "Delivery Charges" }),
            /* @__PURE__ */ jsx("span", { style: { fontWeight: 600, color: isFreeShipping ? "#16a34a" : "var(--boost-text, #0f172a)" }, children: isFreeShipping ? "FREE" : `${currencySymbol}${formatNumber2(shippingFee)}` })
          ] }),
          tax > 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", color: "var(--boost-text-muted, #64748b)" }, children: [
            /* @__PURE__ */ jsx("span", { children: "Estimated Taxes (GST)" }),
            /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, color: "var(--boost-text, #0f172a)" }, children: [
              currencySymbol,
              formatNumber2(tax)
            ] })
          ] }),
          customRows.map((row, index) => /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                color: row.isDiscount ? "#16a34a" : "var(--boost-text-muted, #64748b)"
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: row.label }),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: row.value })
              ]
            },
            index
          ))
        ] }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              borderTop: "1px solid var(--boost-border, #e2e8f0)",
              marginTop: "16px",
              paddingTop: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline"
            },
            children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "15px", fontWeight: 700, color: "var(--boost-text, #0f172a)" }, children: "Total Amount" }),
              /* @__PURE__ */ jsxs("span", { style: { fontSize: "20px", fontWeight: 800, color: "var(--boost-text, #0f172a)" }, children: [
                currencySymbol,
                formatNumber2(total)
              ] })
            ]
          }
        ),
        onCheckout && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: onCheckout,
            disabled: loading,
            style: {
              width: "100%",
              marginTop: "18px",
              padding: "13px",
              backgroundColor: "var(--boost-primary, #2563eb)",
              color: "#ffffff",
              fontSize: "14px",
              fontWeight: 700,
              borderRadius: "12px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              boxShadow: "var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.35))",
              transition: "all 0.15s ease"
            },
            children: [
              loading && /* @__PURE__ */ jsxs(
                "svg",
                {
                  style: { animation: "boost-spin 1s linear infinite", width: "16px", height: "16px" },
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                    /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx("span", { children: checkoutButtonText })
            ]
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "6px",
              marginTop: "14px",
              fontSize: "11px",
              color: "var(--boost-text-muted, #64748b)"
            },
            children: [
              /* @__PURE__ */ jsxs("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
                /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
              ] }),
              /* @__PURE__ */ jsx("span", { children: "Safe & Secure 256-bit Encrypted Checkout" })
            ]
          }
        )
      ]
    }
  );
};
OrderSummary.displayName = "OrderSummary";
var HeroSection = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  media,
  align = "center",
  showGlow = true,
  glowColor = "rgba(37, 99, 235, 0.15)",
  className = "",
  style,
  ...props
}) => {
  const isCenter = align === "center";
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: `boost-hero-section ${className}`,
      style: {
        position: "relative",
        padding: "clamp(48px, 8vw, 96px) clamp(16px, 4vw, 32px)",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: [
        showGlow && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              top: "5%",
              left: isCenter ? "50%" : "30%",
              transform: "translateX(-50%)",
              width: "clamp(280px, 45vw, 600px)",
              height: "clamp(280px, 45vw, 600px)",
              borderRadius: "50%",
              background: glowColor,
              filter: "blur(clamp(60px, 10vw, 120px))",
              pointerEvents: "none",
              zIndex: 0,
              animation: "boost-pulse 6s ease-in-out infinite alternate"
            }
          }
        ),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: isCenter ? "column" : "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: isCenter ? "center" : "space-between",
              gap: "clamp(32px, 5vw, 56px)",
              textAlign: isCenter ? "center" : "left"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { style: { maxWidth: isCenter ? "820px" : "620px", width: "100%", flex: isCenter ? "none" : "1 1 300px" }, children: [
                badge && /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      backgroundColor: "rgba(37, 99, 235, 0.1)",
                      border: "1px solid rgba(37, 99, 235, 0.22)",
                      color: "var(--boost-primary, #2563eb)",
                      fontSize: "13px",
                      fontWeight: 600,
                      marginBottom: "20px",
                      backdropFilter: "blur(8px)",
                      WebkitBackdropFilter: "blur(8px)"
                    },
                    children: badge
                  }
                ),
                /* @__PURE__ */ jsx(
                  "h1",
                  {
                    style: {
                      fontSize: "clamp(32px, 5.2vw, 60px)",
                      fontWeight: 800,
                      lineHeight: 1.12,
                      letterSpacing: "-0.035em",
                      margin: "0 0 20px 0",
                      color: "var(--boost-text, #0f172a)"
                    },
                    children: title
                  }
                ),
                description && /* @__PURE__ */ jsx(
                  "p",
                  {
                    style: {
                      fontSize: "clamp(15px, 2vw, 19px)",
                      lineHeight: 1.65,
                      color: "var(--boost-text-muted, #64748b)",
                      margin: "0 0 32px 0",
                      maxWidth: isCenter ? "700px" : "100%",
                      marginLeft: isCenter ? "auto" : 0,
                      marginRight: isCenter ? "auto" : 0
                    },
                    children: description
                  }
                ),
                (primaryAction || secondaryAction) && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      justifyContent: isCenter ? "center" : "flex-start",
                      alignItems: "center"
                    },
                    children: [
                      primaryAction && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: primaryAction.onClick,
                          style: {
                            padding: "13px 28px",
                            borderRadius: "var(--boost-radius, 12px)",
                            backgroundColor: "var(--boost-primary, #2563eb)",
                            color: "#ffffff",
                            fontSize: "15px",
                            fontWeight: 600,
                            border: "none",
                            cursor: "pointer",
                            boxShadow: "var(--boost-shadow-glow, 0 4px 16px rgba(37, 99, 235, 0.35))",
                            transition: "all 0.15s ease"
                          },
                          children: primaryAction.label
                        }
                      ),
                      secondaryAction && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: secondaryAction.onClick,
                          style: {
                            padding: "13px 28px",
                            borderRadius: "var(--boost-radius, 12px)",
                            backgroundColor: "var(--boost-surface, transparent)",
                            color: "var(--boost-text, inherit)",
                            fontSize: "15px",
                            fontWeight: 600,
                            border: "1px solid var(--boost-border, #cbd5e1)",
                            cursor: "pointer",
                            transition: "all 0.15s ease"
                          },
                          children: secondaryAction.label
                        }
                      )
                    ]
                  }
                )
              ] }),
              media && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    flex: isCenter ? "none" : "1 1 320px",
                    width: "100%",
                    maxWidth: isCenter ? "900px" : "540px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: "var(--boost-radius, 16px)",
                    overflow: "hidden"
                  },
                  children: media
                }
              )
            ]
          }
        )
      ]
    }
  );
};
HeroSection.displayName = "HeroSection";
var FeatureGrid = ({
  features,
  columns = 3,
  align = "left",
  className = "",
  style,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-feature-grid ${className}`,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, ${columns === 2 ? "320px" : "260px"}), 1fr))`,
        gap: "clamp(16px, 2.5vw, 28px)",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: features.map((feature, idx) => /* @__PURE__ */ jsxs(
        "div",
        {
          className: "boost-feature-card",
          style: {
            boxSizing: "border-box",
            padding: "clamp(20px, 3vw, 28px)",
            borderRadius: "var(--boost-radius, 16px)",
            backgroundColor: "var(--boost-surface, #f8fafc)",
            border: "1px solid var(--boost-border, #e2e8f0)",
            display: "flex",
            flexDirection: "column",
            alignItems: align === "center" ? "center" : "flex-start",
            textAlign: align,
            transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease, box-shadow 0.25s ease"
          },
          children: [
            feature.icon && /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: "52px",
                  height: "52px",
                  borderRadius: "14px",
                  background: "linear-gradient(135deg, rgba(37, 99, 235, 0.12), rgba(59, 130, 246, 0.05))",
                  border: "1px solid rgba(37, 99, 235, 0.18)",
                  color: "var(--boost-primary, #2563eb)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: "18px",
                  fontSize: "22px",
                  boxShadow: "0 2px 8px rgba(37, 99, 235, 0.1)"
                },
                children: feature.icon
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
              /* @__PURE__ */ jsx(
                "h3",
                {
                  style: {
                    margin: 0,
                    fontSize: "18px",
                    fontWeight: 600,
                    color: "var(--boost-text, #0f172a)"
                  },
                  children: feature.title
                }
              ),
              feature.badge && /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontSize: "11px",
                    fontWeight: 700,
                    padding: "2px 8px",
                    borderRadius: "9999px",
                    backgroundColor: "rgba(37, 99, 235, 0.1)",
                    color: "var(--boost-primary, #2563eb)",
                    textTransform: "uppercase"
                  },
                  children: feature.badge
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  margin: "0 0 16px 0",
                  fontSize: "14px",
                  lineHeight: 1.6,
                  color: "var(--boost-text-muted, #64748b)",
                  flex: 1
                },
                children: feature.description
              }
            ),
            feature.actionText && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: feature.onAction,
                style: {
                  background: "none",
                  border: "none",
                  padding: 0,
                  color: "var(--boost-primary, #2563eb)",
                  fontWeight: 600,
                  fontSize: "14px",
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px"
                },
                children: [
                  feature.actionText,
                  " \u2192"
                ]
              }
            )
          ]
        },
        idx
      ))
    }
  );
};
FeatureGrid.displayName = "FeatureGrid";
var PricingTable = ({
  tiers,
  billingCycle = "monthly",
  onBillingCycleChange,
  annualDiscountLabel = "Save 20%",
  showToggle = true,
  className = "",
  style,
  ...props
}) => {
  const [internalCycle, setInternalCycle] = React.useState(billingCycle);
  const activeCycle = onBillingCycleChange ? billingCycle : internalCycle;
  const handleCycleChange = (cycle) => {
    if (onBillingCycleChange) {
      onBillingCycleChange(cycle);
    } else {
      setInternalCycle(cycle);
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-pricing-table ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: [
        showToggle && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "inline-flex",
              alignItems: "center",
              backgroundColor: "var(--boost-surface, #f1f5f9)",
              padding: "4px",
              borderRadius: "9999px",
              border: "1px solid var(--boost-border, #e2e8f0)",
              marginBottom: "40px",
              gap: "4px"
            },
            children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => handleCycleChange("monthly"),
                  style: {
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    border: "none",
                    backgroundColor: activeCycle === "monthly" ? "var(--boost-bg, #ffffff)" : "transparent",
                    color: activeCycle === "monthly" ? "var(--boost-text, #0f172a)" : "var(--boost-text-muted, #64748b)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: activeCycle === "monthly" ? "0 2px 6px rgba(0, 0, 0, 0.08)" : "none",
                    transition: "all 0.15s ease"
                  },
                  children: "Monthly"
                }
              ),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => handleCycleChange("annual"),
                  style: {
                    padding: "8px 20px",
                    borderRadius: "9999px",
                    border: "none",
                    backgroundColor: activeCycle === "annual" ? "var(--boost-bg, #ffffff)" : "transparent",
                    color: activeCycle === "annual" ? "var(--boost-text, #0f172a)" : "var(--boost-text-muted, #64748b)",
                    fontWeight: 600,
                    fontSize: "14px",
                    cursor: "pointer",
                    boxShadow: activeCycle === "annual" ? "0 2px 6px rgba(0, 0, 0, 0.08)" : "none",
                    transition: "all 0.15s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px"
                  },
                  children: [
                    "Annual",
                    annualDiscountLabel && /* @__PURE__ */ jsx(
                      "span",
                      {
                        style: {
                          fontSize: "11px",
                          fontWeight: 700,
                          backgroundColor: "rgba(34, 197, 94, 0.15)",
                          color: "#16a34a",
                          padding: "2px 8px",
                          borderRadius: "9999px"
                        },
                        children: annualDiscountLabel
                      }
                    )
                  ]
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "grid",
              gridTemplateColumns: `repeat(auto-fit, minmax(min(100%, 280px), 1fr))`,
              gap: "28px",
              width: "100%",
              maxWidth: "1200px",
              boxSizing: "border-box"
            },
            children: tiers.map((tier) => {
              const rawPrice = activeCycle === "annual" && tier.priceAnnual !== void 0 ? tier.priceAnnual : tier.priceMonthly;
              const currency = tier.currency || "$";
              const isPop = tier.isPopular;
              return /* @__PURE__ */ jsxs(
                "div",
                {
                  className: `boost-pricing-card ${isPop ? "is-popular" : ""}`,
                  style: {
                    position: "relative",
                    boxSizing: "border-box",
                    padding: "clamp(24px, 4vw, 36px) clamp(20px, 3vw, 30px)",
                    borderRadius: "var(--boost-radius, 16px)",
                    backgroundColor: "var(--boost-surface, #ffffff)",
                    border: isPop ? "2px solid var(--boost-primary, #2563eb)" : "1px solid var(--boost-border, #e2e8f0)",
                    boxShadow: isPop ? "var(--boost-shadow-glow, 0 16px 36px rgba(37, 99, 235, 0.18))" : "var(--boost-shadow-sm, 0 2px 8px rgba(0, 0, 0, 0.04))",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    transition: "transform 0.25s ease, box-shadow 0.25s ease"
                  },
                  children: [
                    isPop && /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          position: "absolute",
                          top: "-13px",
                          left: "50%",
                          transform: "translateX(-50%)",
                          backgroundColor: "var(--boost-primary, #2563eb)",
                          color: "#ffffff",
                          fontSize: "11px",
                          fontWeight: 700,
                          padding: "4px 14px",
                          borderRadius: "9999px",
                          letterSpacing: "0.05em",
                          textTransform: "uppercase",
                          boxShadow: "0 2px 10px rgba(37, 99, 235, 0.4)"
                        },
                        children: tier.popularLabel || "Most Popular"
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { children: [
                      /* @__PURE__ */ jsx(
                        "h3",
                        {
                          style: {
                            fontSize: "20px",
                            fontWeight: 700,
                            margin: "0 0 8px 0",
                            color: "var(--boost-text, #0f172a)"
                          },
                          children: tier.name
                        }
                      ),
                      tier.description && /* @__PURE__ */ jsx(
                        "p",
                        {
                          style: {
                            fontSize: "14px",
                            color: "var(--boost-text-muted, #64748b)",
                            margin: "0 0 24px 0",
                            minHeight: "40px",
                            lineHeight: 1.5
                          },
                          children: tier.description
                        }
                      ),
                      /* @__PURE__ */ jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            alignItems: "baseline",
                            gap: "4px",
                            marginBottom: "28px"
                          },
                          children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "clamp(36px, 4vw, 46px)",
                                  fontWeight: 800,
                                  color: "var(--boost-text, #0f172a)",
                                  lineHeight: 1
                                },
                                children: typeof rawPrice === "number" ? `${currency}${rawPrice}` : rawPrice
                              }
                            ),
                            /* @__PURE__ */ jsxs(
                              "span",
                              {
                                style: {
                                  fontSize: "14px",
                                  fontWeight: 500,
                                  color: "var(--boost-text-muted, #64748b)"
                                },
                                children: [
                                  "/",
                                  activeCycle === "annual" ? "yr" : "mo"
                                ]
                              }
                            )
                          ]
                        }
                      ),
                      /* @__PURE__ */ jsx(
                        "div",
                        {
                          style: {
                            borderTop: "1px solid var(--boost-border, #e2e8f0)",
                            paddingTop: "24px",
                            marginBottom: "32px"
                          },
                          children: /* @__PURE__ */ jsx(
                            "ul",
                            {
                              style: {
                                listStyle: "none",
                                padding: 0,
                                margin: 0,
                                display: "flex",
                                flexDirection: "column",
                                gap: "13px"
                              },
                              children: tier.features.map((feat, fIdx) => {
                                const text = typeof feat === "string" ? feat : feat.text;
                                const included = typeof feat === "string" ? true : feat.included;
                                return /* @__PURE__ */ jsxs(
                                  "li",
                                  {
                                    style: {
                                      display: "flex",
                                      alignItems: "center",
                                      gap: "10px",
                                      fontSize: "14px",
                                      color: included ? "var(--boost-text, #0f172a)" : "var(--boost-text-muted, #94a3b8)",
                                      opacity: included ? 1 : 0.6
                                    },
                                    children: [
                                      /* @__PURE__ */ jsx(
                                        "span",
                                        {
                                          style: {
                                            display: "inline-flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            width: "20px",
                                            height: "20px",
                                            borderRadius: "9999px",
                                            backgroundColor: included ? "rgba(37, 99, 235, 0.1)" : "rgba(148, 163, 184, 0.1)",
                                            flexShrink: 0
                                          },
                                          children: /* @__PURE__ */ jsx(
                                            "svg",
                                            {
                                              width: "12",
                                              height: "12",
                                              viewBox: "0 0 24 24",
                                              fill: "none",
                                              stroke: included ? "var(--boost-primary, #2563eb)" : "#94a3b8",
                                              strokeWidth: "2.5",
                                              strokeLinecap: "round",
                                              strokeLinejoin: "round",
                                              children: included ? /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                                                /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                                                /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                                              ] })
                                            }
                                          )
                                        }
                                      ),
                                      /* @__PURE__ */ jsx("span", { children: text })
                                    ]
                                  },
                                  fIdx
                                );
                              })
                            }
                          )
                        }
                      )
                    ] }),
                    /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: tier.onSelect,
                        disabled: tier.disabled,
                        style: {
                          width: "100%",
                          padding: "13px",
                          borderRadius: "var(--boost-radius, 10px)",
                          backgroundColor: isPop ? "var(--boost-primary, #2563eb)" : "var(--boost-bg, #f8fafc)",
                          color: isPop ? "#ffffff" : "var(--boost-text, #0f172a)",
                          border: isPop ? "none" : "1px solid var(--boost-border, #e2e8f0)",
                          fontWeight: 600,
                          fontSize: "14px",
                          cursor: tier.disabled ? "not-allowed" : "pointer",
                          opacity: tier.disabled ? 0.5 : 1,
                          boxShadow: isPop ? "var(--boost-shadow-glow, 0 4px 14px rgba(37, 99, 235, 0.3))" : "none",
                          transition: "all 0.15s ease"
                        },
                        children: tier.ctaText || (isPop ? "Get Started Now" : "Choose Plan")
                      }
                    )
                  ]
                },
                tier.id
              );
            })
          }
        )
      ]
    }
  );
};
PricingTable.displayName = "PricingTable";
var TestimonialCard = ({
  quote,
  authorName,
  author,
  authorRole,
  role,
  authorCompany,
  company,
  authorAvatar,
  avatar,
  rating = 5,
  verified = true,
  companyLogo,
  className = "",
  style,
  ...props
}) => {
  const finalAuthor = authorName || author || props.author || "Verified Buyer";
  const finalRole = authorRole || role || props.role;
  const finalCompany = authorCompany || company || props.company;
  authorAvatar || avatar || props.avatar;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-testimonial-card ${className}`,
      style: {
        padding: "30px",
        borderRadius: "var(--boost-radius, 14px)",
        backgroundColor: "var(--boost-surface, #f8fafc)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { children: [
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                marginBottom: "16px"
              },
              children: [
                rating > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "3px", color: "#f59e0b" }, children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ jsx(
                  "svg",
                  {
                    width: "16",
                    height: "16",
                    viewBox: "0 0 24 24",
                    fill: i < rating ? "#f59e0b" : "none",
                    stroke: "#f59e0b",
                    strokeWidth: "2",
                    children: /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
                  },
                  i
                )) }),
                companyLogo && /* @__PURE__ */ jsx("div", { children: companyLogo })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "p",
            {
              style: {
                fontSize: "15px",
                lineHeight: 1.6,
                color: "var(--boost-text, #0f172a)",
                fontStyle: "italic",
                margin: "0 0 24px 0"
              },
              children: [
                '"',
                quote,
                '"'
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
          authorAvatar ? /* @__PURE__ */ jsx(
            "img",
            {
              src: authorAvatar,
              alt: finalAuthor,
              style: {
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "1px solid var(--boost-border, #e2e8f0)"
              }
            }
          ) : /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                backgroundColor: "rgba(37, 99, 235, 0.1)",
                color: "var(--boost-primary, #2563eb)",
                fontWeight: 700,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "15px"
              },
              children: finalAuthor.charAt(0).toUpperCase()
            }
          ),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
              /* @__PURE__ */ jsx(
                "span",
                {
                  style: {
                    fontWeight: 600,
                    fontSize: "14px",
                    color: "var(--boost-text, #0f172a)"
                  },
                  children: finalAuthor
                }
              ),
              verified && /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "#2563eb", children: /* @__PURE__ */ jsx("path", { d: "M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" }) })
            ] }),
            (finalRole || finalCompany) && /* @__PURE__ */ jsxs(
              "span",
              {
                style: {
                  fontSize: "12px",
                  color: "var(--boost-text-muted, #64748b)"
                },
                children: [
                  finalRole,
                  finalRole && finalCompany ? " at " : "",
                  authorCompany
                ]
              }
            )
          ] })
        ] })
      ]
    }
  );
};
var TestimonialGrid = ({
  testimonials,
  columns = 3,
  className = "",
  style,
  ...props
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-testimonial-grid ${className}`,
      style: {
        display: "grid",
        gridTemplateColumns: `repeat(auto-fit, minmax(300px, 1fr))`,
        gap: "24px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: testimonials.map((item, idx) => /* @__PURE__ */ jsx(TestimonialCard, { ...item }, idx))
    }
  );
};
TestimonialCard.displayName = "TestimonialCard";
TestimonialGrid.displayName = "TestimonialGrid";
var FAQSection = ({
  items,
  title = "Frequently Asked Questions",
  subtitle = "Everything you need to know about our product and billing.",
  searchable = true,
  searchPlaceholder = "Search questions...",
  className = "",
  style,
  ...props
}) => {
  const [openIds, setOpenIds] = React.useState([]);
  const [searchQuery, setSearchQuery] = React.useState("");
  const toggleItem = (idx) => {
    setOpenIds(
      (prev) => prev.includes(idx) ? prev.filter((id) => id !== idx) : [...prev, idx]
    );
  };
  const filteredItems = items.filter(
    (item) => item.question.toLowerCase().includes(searchQuery.toLowerCase()) || typeof item.answer === "string" && item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-faq-section ${className}`,
      style: {
        maxWidth: "850px",
        margin: "0 auto",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "40px" }, children: [
          /* @__PURE__ */ jsx(
            "h2",
            {
              style: {
                fontSize: "clamp(26px, 4vw, 36px)",
                fontWeight: 800,
                margin: "0 0 12px 0",
                color: "var(--boost-text, #0f172a)"
              },
              children: title
            }
          ),
          subtitle && /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                fontSize: "16px",
                color: "var(--boost-text-muted, #64748b)",
                margin: 0
              },
              children: subtitle
            }
          )
        ] }),
        searchable && /* @__PURE__ */ jsx("div", { style: { marginBottom: "32px" }, children: /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              backgroundColor: "var(--boost-surface, #f8fafc)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "var(--boost-radius, 8px)",
              padding: "10px 16px",
              gap: "10px"
            },
            children: [
              /* @__PURE__ */ jsxs(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "#64748b",
                  strokeWidth: "2",
                  children: [
                    /* @__PURE__ */ jsx("circle", { cx: "11", cy: "11", r: "8" }),
                    /* @__PURE__ */ jsx("line", { x1: "21", y1: "21", x2: "16.65", y2: "16.65" })
                  ]
                }
              ),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: searchQuery,
                  onChange: (e) => setSearchQuery(e.target.value),
                  placeholder: searchPlaceholder,
                  style: {
                    border: "none",
                    outline: "none",
                    background: "transparent",
                    width: "100%",
                    fontSize: "14px",
                    color: "var(--boost-text, #0f172a)"
                  }
                }
              ),
              searchQuery && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: () => setSearchQuery(""),
                  style: {
                    background: "none",
                    border: "none",
                    color: "#94a3b8",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "14px"
                  },
                  children: "\u2715"
                }
              )
            ]
          }
        ) }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "14px" }, children: filteredItems.length === 0 ? /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              textAlign: "center",
              padding: "40px",
              color: "var(--boost-text-muted, #64748b)",
              fontSize: "15px"
            },
            children: "No matching questions found."
          }
        ) : filteredItems.map((item, idx) => {
          const isOpen = openIds.includes(idx);
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                borderRadius: "var(--boost-radius, 14px)",
                border: isOpen ? "1px solid var(--boost-primary, #2563eb)" : "1px solid var(--boost-border, #e2e8f0)",
                backgroundColor: "var(--boost-surface, #f8fafc)",
                overflow: "hidden",
                transition: "border-color 0.2s ease, box-shadow 0.2s ease",
                boxShadow: isOpen ? "0 4px 16px rgba(37, 99, 235, 0.08)" : "none"
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => toggleItem(idx),
                    style: {
                      width: "100%",
                      padding: "clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      gap: "16px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      cursor: "pointer",
                      color: isOpen ? "var(--boost-primary, #2563eb)" : "var(--boost-text, #0f172a)",
                      fontSize: "clamp(14px, 1.6vw, 16px)",
                      fontWeight: 600,
                      transition: "color 0.15s ease"
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { children: item.question }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          style: {
                            display: "inline-flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: "28px",
                            height: "28px",
                            borderRadius: "9999px",
                            backgroundColor: isOpen ? "rgba(37, 99, 235, 0.1)" : "transparent",
                            color: isOpen ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
                            flexShrink: 0,
                            transition: "all 0.2s ease"
                          },
                          children: /* @__PURE__ */ jsx(
                            "svg",
                            {
                              width: "16",
                              height: "16",
                              viewBox: "0 0 24 24",
                              fill: "none",
                              stroke: "currentColor",
                              strokeWidth: "2.2",
                              strokeLinecap: "round",
                              strokeLinejoin: "round",
                              style: {
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                                transition: "transform 0.2s ease"
                              },
                              children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                            }
                          )
                        }
                      )
                    ]
                  }
                ),
                isOpen && /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      padding: "0 clamp(16px, 3vw, 24px) clamp(14px, 2.5vw, 20px) clamp(16px, 3vw, 24px)",
                      color: "var(--boost-text-muted, #64748b)",
                      fontSize: "14px",
                      lineHeight: 1.65,
                      borderTop: "1px solid var(--boost-border, #e2e8f0)",
                      paddingTop: "14px",
                      animation: "boost-fadeIn 0.2s ease"
                    },
                    children: item.answer
                  }
                )
              ]
            },
            idx
          );
        }) })
      ]
    }
  );
};
FAQSection.displayName = "FAQSection";
var LogoCloud = ({
  logos,
  title = "TRUSTED BY 10,000+ MODERN BUSINESSES & D2C BRANDS",
  grayscale = true,
  className = "",
  style,
  ...props
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-logo-cloud ${className}`,
      style: {
        width: "100%",
        padding: "36px 20px",
        textAlign: "center",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: [
        title && /* @__PURE__ */ jsx(
          "p",
          {
            style: {
              fontSize: "12px",
              fontWeight: 700,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              color: "var(--boost-text-muted, #64748b)",
              marginBottom: "28px"
            },
            children: title
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: "center",
              gap: "40px 48px"
            },
            children: logos.map((item, idx) => {
              const content = /* @__PURE__ */ jsx(
                "div",
                {
                  title: item.name,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    filter: grayscale ? "grayscale(100%) opacity(60%)" : "none",
                    transition: "filter 0.2s ease, transform 0.2s ease",
                    cursor: item.href ? "pointer" : "default"
                  },
                  children: item.logo
                },
                idx
              );
              if (item.href) {
                return /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: item.href,
                    target: "_blank",
                    rel: "noopener noreferrer",
                    style: { textDecoration: "none", color: "inherit" },
                    children: content
                  },
                  idx
                );
              }
              return content;
            })
          }
        )
      ]
    }
  );
};
LogoCloud.displayName = "LogoCloud";
var CTASection = ({
  badge,
  title,
  description,
  primaryAction,
  secondaryAction,
  showNewsletter = false,
  newsletterPlaceholder = "Enter your email address...",
  newsletterButtonText = "Get Started",
  onSubscribe,
  variant = "card",
  className = "",
  style,
  ...props
}) => {
  const [email, setEmail] = React.useState("");
  const [submitted, setSubmitted] = React.useState(false);
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    if (onSubscribe) onSubscribe(email);
    setSubmitted(true);
  };
  const isCard = variant === "card";
  const isGradient = variant === "gradient";
  return /* @__PURE__ */ jsx(
    "section",
    {
      className: `boost-cta-section ${className}`,
      style: {
        width: "100%",
        padding: isCard ? "clamp(24px, 4vw, 48px) clamp(14px, 3vw, 24px)" : "clamp(48px, 8vw, 84px) clamp(16px, 4vw, 32px)",
        boxSizing: "border-box",
        ...style
      },
      ...props,
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            maxWidth: isCard ? "1100px" : "100%",
            margin: "0 auto",
            borderRadius: isCard ? "var(--boost-radius, 24px)" : "0px",
            background: isGradient ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)" : "var(--boost-primary, #2563eb)",
            color: "#ffffff",
            padding: "clamp(36px, 6vw, 60px) clamp(20px, 4vw, 48px)",
            textAlign: "center",
            boxShadow: isCard ? "var(--boost-shadow-glow, 0 20px 40px rgba(37, 99, 235, 0.25))" : "none",
            boxSizing: "border-box",
            position: "relative",
            overflow: "hidden"
          },
          children: [
            badge && /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  display: "inline-block",
                  padding: "6px 14px",
                  borderRadius: "9999px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  fontSize: "12px",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em",
                  marginBottom: "16px"
                },
                children: badge
              }
            ),
            /* @__PURE__ */ jsx(
              "h2",
              {
                style: {
                  fontSize: "clamp(28px, 4.5vw, 46px)",
                  fontWeight: 800,
                  lineHeight: 1.2,
                  margin: "0 0 16px 0",
                  color: "#ffffff",
                  letterSpacing: "-0.02em"
                },
                children: title
              }
            ),
            description && /* @__PURE__ */ jsx(
              "p",
              {
                style: {
                  fontSize: "clamp(15px, 1.8vw, 18px)",
                  lineHeight: 1.6,
                  color: "rgba(255, 255, 255, 0.85)",
                  margin: "0 auto 36px auto",
                  maxWidth: "650px"
                },
                children: description
              }
            ),
            showNewsletter ? submitted ? /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "12px 24px",
                  borderRadius: "8px",
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  color: "#ffffff",
                  fontWeight: 600
                },
                children: "\u2713 Thank you! We have sent a confirmation link to your inbox."
              }
            ) : /* @__PURE__ */ jsxs(
              "form",
              {
                onSubmit: handleSubmit,
                style: {
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "10px",
                  maxWidth: "480px",
                  margin: "0 auto"
                },
                children: [
                  /* @__PURE__ */ jsx(
                    "input",
                    {
                      type: "email",
                      required: true,
                      value: email,
                      onChange: (e) => setEmail(e.target.value),
                      placeholder: newsletterPlaceholder,
                      style: {
                        flex: 1,
                        minWidth: "220px",
                        padding: "12px 18px",
                        borderRadius: "var(--boost-radius, 8px)",
                        border: "none",
                        outline: "none",
                        fontSize: "15px",
                        color: "#0f172a"
                      }
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "submit",
                      style: {
                        padding: "12px 24px",
                        borderRadius: "var(--boost-radius, 8px)",
                        border: "none",
                        backgroundColor: "#0f172a",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "background-color 0.15s ease"
                      },
                      children: newsletterButtonText
                    }
                  )
                ]
              }
            ) : (primaryAction || secondaryAction) && /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "center",
                  gap: "14px"
                },
                children: [
                  primaryAction && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: primaryAction.onClick,
                      style: {
                        padding: "14px 30px",
                        borderRadius: "var(--boost-radius, 8px)",
                        backgroundColor: "#ffffff",
                        color: "var(--boost-primary, #2563eb)",
                        fontSize: "15px",
                        fontWeight: 700,
                        border: "none",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(0, 0, 0, 0.15)"
                      },
                      children: primaryAction.label
                    }
                  ),
                  secondaryAction && /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: secondaryAction.onClick,
                      style: {
                        padding: "14px 30px",
                        borderRadius: "var(--boost-radius, 8px)",
                        backgroundColor: "transparent",
                        color: "#ffffff",
                        fontSize: "15px",
                        fontWeight: 600,
                        border: "1px solid rgba(255, 255, 255, 0.4)",
                        cursor: "pointer"
                      },
                      children: secondaryAction.label
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
};
CTASection.displayName = "CTASection";

export { Accordion, ActivityFeed, AddToCart, AddressForm, Alert, AnnouncementBar, AreaChart, AspectRatio, AssuredBadge, Avatar, AvatarGroup, BackButton, Badge, BankOffersAccordion, BarChart, BoostProvider, BottomSheet, Box, Breadcrumb, Button, ButtonGroup, CTASection, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CartDrawer, Checkbox, Chip, CommandPalette, ConfirmationDialog, Container, CopyButton, CouponInput, DataTable, DatePicker, DateRangePicker, Dialog, Divider, DonutChart, Drawer, DropdownMenu, DualMobileActionBar, EmptyState, ErrorState, ExportButton, FAQSection, FeatureGrid, FileDropzone, FileUpload, Filter, Flex, FloatingActionButton, Footer, ForgotPassword, FormField, FrequentlyBoughtTogether, Grid, GridItem, HStack, Header, HeroSection, IconButton, Image, Input, KPIWidget, LightningDealsBar, LinkButton, Loader, LoginForm, LogoCloud, MegaMenu, MobileBottomBar, MobileBottomNav, Modal, Motion, MultiSelect, NavLink, Navbar, NotificationCenter, OTPInput, OrderSummary, OrderTimeline, PageWrapper, Pagination, PincodeChecker, Popover, Portal, Price, PricingTable, ProductCard, ProductGallery, ProgressBar, QuantitySelector, Radio, RadioGroup, RegisterForm, ResetPassword, ReviewBreakdownBars, ScrollArea, SearchInput, Section, Select, Sidebar, Skeleton, Snackbar, Sort, Sparkline, Spinner, Stack, StarRating, StatsCard, Stepper, StickyAddToCart, SuccessMessage, Switch, Table, Tabs, Tag, TestimonialCard, TestimonialGrid, Textarea, ThemeToggle, TimePicker, Toast, ToastProvider, Tooltip, TrustBadges, VStack, VariantSelector, clamp, cn, debounce, deepMerge, formatCurrency, formatDate, formatNumber, formatRelativeTime, generateId, getInitials, groupBy, isValidEmail, isValidIndianMobile, isValidIndianPincode, omit, pick, slugify, truncate, useClickOutside, useCopyToClipboard, useDebounce, useForm, useIntersectionObserver, useIsomorphicLayoutEffect, useLocalStorage, useMediaQuery, usePrevious, useScrollPosition, useTheme, useToast, useToggle, useWindowSize };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map
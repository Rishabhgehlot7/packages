'use client';
import { useFocusTrap } from './chunk-EENZ5DFF.mjs';
export { useAnnounce, useClickOutside, useCopyToClipboard, useDebounce, useFocusTrap, useForm, useIntersectionObserver, useIsomorphicLayoutEffect, useLocalStorage, useMediaQuery, usePrevious, useScrollPosition, useToggle, useWindowSize } from './chunk-EENZ5DFF.mjs';
export { clamp, cn, debounce, deepMerge, formatCurrency, formatDate, formatNumber, formatRelativeTime, generateId, getInitials, groupBy, isValidEmail, isValidIndianMobile, isValidIndianPincode, omit, pick, slugify, truncate } from './chunk-BVLODGZ2.mjs';
import * as React from 'react';
import { useState } from 'react';
import { jsxs, Fragment, jsx } from 'react/jsx-runtime';
import * as ReactDOM from 'react-dom';

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
function injectBoostGlobalStyles() {
  if (typeof document === "undefined") return;
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
  currency = "$",
  locale = "en-US",
  className = ""
}) => {
  React.useEffect(() => {
    injectBoostGlobalStyles();
  }, []);
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
        tokens: currentTokens,
        currency,
        locale
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
      tokens: defaultLightTokens,
      currency: "$",
      locale: "en-US"
    };
  }
  return context;
};
var useCurrency = () => {
  const theme = useTheme();
  return {
    currency: theme.currency || "$",
    locale: theme.locale || "en-US"
  };
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

// src/tokens.json
var tokens_default = {
  $schema: "https://tokens.studio/schemas/token-engine-schema.json",
  name: "@boostengine/ui Design Tokens",
  version: "1.8.2",
  colors: {
    brand: {
      primary: { value: "#2563eb", type: "color", description: "Primary brand action color" },
      primaryHover: { value: "#1d4ed8", type: "color" },
      primaryDark: { value: "#3b82f6", type: "color" },
      primaryDarkHover: { value: "#60a5fa", type: "color" }
    },
    neutral: {
      bgLight: { value: "#ffffff", type: "color" },
      bgDark: { value: "#090d16", type: "color" },
      surfaceLight: { value: "#f8fafc", type: "color" },
      surfaceDark: { value: "#0f172a", type: "color" },
      surfaceSecondaryLight: { value: "#f1f5f9", type: "color" },
      surfaceSecondaryDark: { value: "#1e293b", type: "color" },
      borderLight: { value: "#e2e8f0", type: "color" },
      borderDark: { value: "#1e293b", type: "color" }
    },
    text: {
      light: { value: "#0f172a", type: "color" },
      lightMuted: { value: "#64748b", type: "color" },
      dark: { value: "#f8fafc", type: "color" },
      darkMuted: { value: "#94a3b8", type: "color" }
    },
    feedback: {
      success: { value: "#16a34a", type: "color" },
      successLight: { value: "rgba(22, 163, 74, 0.12)", type: "color" },
      warning: { value: "#f59e0b", type: "color" },
      warningLight: { value: "rgba(245, 158, 11, 0.12)", type: "color" },
      destructive: { value: "#ef4444", type: "color" },
      destructiveLight: { value: "rgba(239, 68, 68, 0.12)", type: "color" },
      info: { value: "#0ea5e9", type: "color" },
      infoLight: { value: "rgba(14, 165, 233, 0.12)", type: "color" }
    }
  },
  spacing: {
    "0": { value: "0px", type: "spacing" },
    "1": { value: "4px", type: "spacing" },
    "2": { value: "8px", type: "spacing" },
    "3": { value: "12px", type: "spacing" },
    "4": { value: "16px", type: "spacing" },
    "5": { value: "20px", type: "spacing" },
    "6": { value: "24px", type: "spacing" },
    "8": { value: "32px", type: "spacing" },
    "10": { value: "40px", type: "spacing" },
    "12": { value: "48px", type: "spacing" },
    "16": { value: "64px", type: "spacing" },
    "20": { value: "80px", type: "spacing" },
    "24": { value: "96px", type: "spacing" }
  },
  radii: {
    none: { value: "0px", type: "borderRadius" },
    sm: { value: "4px", type: "borderRadius" },
    md: { value: "8px", type: "borderRadius" },
    lg: { value: "12px", type: "borderRadius" },
    xl: { value: "16px", type: "borderRadius" },
    "2xl": { value: "20px", type: "borderRadius" },
    "3xl": { value: "24px", type: "borderRadius" },
    full: { value: "9999px", type: "borderRadius" }
  },
  typography: {
    fontFamilies: {
      sans: { value: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", type: "fontFamilies" },
      mono: { value: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", type: "fontFamilies" }
    },
    fontSizes: {
      xs: { value: "12px", type: "fontSizes" },
      sm: { value: "14px", type: "fontSizes" },
      base: { value: "16px", type: "fontSizes" },
      lg: { value: "18px", type: "fontSizes" },
      xl: { value: "20px", type: "fontSizes" },
      "2xl": { value: "24px", type: "fontSizes" },
      "3xl": { value: "30px", type: "fontSizes" },
      "4xl": { value: "36px", type: "fontSizes" },
      "5xl": { value: "48px", type: "fontSizes" }
    },
    fontWeights: {
      normal: { value: 400, type: "fontWeights" },
      medium: { value: 500, type: "fontWeights" },
      semibold: { value: 600, type: "fontWeights" },
      bold: { value: 700, type: "fontWeights" },
      extrabold: { value: 800, type: "fontWeights" }
    }
  },
  shadows: {
    sm: { value: "0 1px 3px rgba(0, 0, 0, 0.05)", type: "boxShadow" },
    md: { value: "0 4px 16px -2px rgba(0, 0, 0, 0.08)", type: "boxShadow" },
    lg: { value: "0 12px 32px -4px rgba(0, 0, 0, 0.12)", type: "boxShadow" },
    glow: { value: "0 0 24px rgba(37, 99, 235, 0.25)", type: "boxShadow" }
  },
  transitions: {
    fast: { value: "0.15s cubic-bezier(0.16, 1, 0.3, 1)", type: "transition" },
    normal: { value: "0.25s cubic-bezier(0.16, 1, 0.3, 1)", type: "transition" },
    slow: { value: "0.35s cubic-bezier(0.16, 1, 0.3, 1)", type: "transition" }
  }
};

// src/tokens.ts
var boostTokens = tokens_default;
function createTailwindPreset() {
  return {
    theme: {
      extend: {
        colors: {
          boost: {
            primary: "var(--boost-primary, #2563eb)",
            "primary-hover": "var(--boost-primary-hover, #1d4ed8)",
            bg: "var(--boost-bg, #ffffff)",
            surface: "var(--boost-surface, #f8fafc)",
            "surface-secondary": "var(--boost-surface-secondary, #f1f5f9)",
            text: "var(--boost-text, #0f172a)",
            "text-muted": "var(--boost-text-muted, #64748b)",
            border: "var(--boost-border, #e2e8f0)"
          }
        },
        borderRadius: {
          boost: "var(--boost-radius, 12px)"
        },
        boxShadow: {
          "boost-sm": "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.05))",
          "boost-md": "var(--boost-shadow-md, 0 4px 16px -2px rgba(0, 0, 0, 0.08))",
          "boost-lg": "var(--boost-shadow-lg, 0 12px 32px -4px rgba(0, 0, 0, 0.12))",
          "boost-glow": "var(--boost-shadow-glow, 0 0 24px rgba(37, 99, 235, 0.22))"
        }
      }
    }
  };
}
var Button = /* @__PURE__ */ React.forwardRef(
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
            backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
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
            backgroundColor: "var(--boost-danger, #dc2626)",
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
    return /* @__PURE__ */ jsxs(Fragment, { children: [
      /* @__PURE__ */ jsx("style", { children: `
            @keyframes boost-spin {
              from { transform: rotate(0deg); }
              to { transform: rotate(360deg); }
            }
            .boost-btn:active:not(:disabled) {
              transform: scale(0.98);
            }
          ` }),
      /* @__PURE__ */ jsxs(
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
            !isBusy && leftIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: leftIcon }),
            /* @__PURE__ */ jsx("span", { children }),
            !isBusy && rightIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: rightIcon })
          ]
        }
      )
    ] });
  }
);
Button.displayName = "Button";
var IconButton = /* @__PURE__ */ React.forwardRef(
  ({
    icon,
    label,
    ariaLabel,
    shape = "rounded",
    variant = "secondary",
    size = "md",
    isLoading = false,
    disabled,
    className = "",
    style,
    children,
    ...props
  }, ref) => {
    const effectiveLabel = ariaLabel || label || props["aria-label"] || "button";
    const effectiveIcon = icon || children;
    const getSize = () => {
      switch (size) {
        case "sm":
          return { width: "30px", height: "30px", padding: "6px" };
        case "lg":
          return { width: "44px", height: "44px", padding: "10px" };
        case "md":
        default:
          return { width: "36px", height: "36px", padding: "8px" };
      }
    };
    const getShapeRadius = () => {
      switch (shape) {
        case "circle":
          return "9999px";
        case "square":
          return "4px";
        case "rounded":
        default:
          return "8px";
      }
    };
    const getBgColor = () => {
      switch (variant) {
        case "primary":
          return { bg: "var(--boost-primary, #2563eb)", color: "#ffffff", border: "none" };
        case "outline":
          return { bg: "transparent", color: "var(--boost-text, #0f172a)", border: "1px solid var(--boost-border, #cbd5e1)" };
        case "ghost":
          return { bg: "transparent", color: "var(--boost-text, #0f172a)", border: "none" };
        case "destructive":
          return { bg: "var(--boost-danger, #dc2626)", color: "#ffffff", border: "none" };
        case "secondary":
        default:
          return { bg: "var(--boost-surface-secondary, #f1f5f9)", color: "var(--boost-text, #0f172a)", border: "1px solid var(--boost-border, #e2e8f0)" };
      }
    };
    const s = getSize();
    const v = getBgColor();
    return /* @__PURE__ */ jsx(
      "button",
      {
        ref,
        "aria-label": effectiveLabel,
        title: effectiveLabel,
        disabled: disabled || isLoading,
        className: `boost-icon-btn boost-icon-btn-${shape} ${className}`,
        style: {
          width: s.width,
          height: s.height,
          padding: s.padding,
          backgroundColor: v.bg,
          color: v.color,
          border: v.border,
          borderRadius: getShapeRadius(),
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          cursor: disabled || isLoading ? "not-allowed" : "pointer",
          opacity: disabled || isLoading ? 0.6 : 1,
          transition: "all 0.15s ease",
          outline: "none",
          boxSizing: "border-box",
          ...style
        },
        ...props,
        children: effectiveIcon
      }
    );
  }
);
IconButton.displayName = "IconButton";
var ButtonGroup = ({
  children,
  orientation = "horizontal",
  fullWidth = false,
  className = "",
  style
}) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      className: `boost-button-group boost-button-group-${orientation} ${className}`,
      style: {
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : "auto",
        flexDirection: orientation === "vertical" ? "column" : "row",
        borderRadius: "var(--boost-radius, 8px)",
        overflow: "hidden",
        border: "1px solid var(--boost-border, #cbd5e1)",
        boxShadow: "var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.04))",
        ...style
      },
      children: React.Children.map(children, (child, idx) => {
        if (!React.isValidElement(child)) return child;
        const total = React.Children.count(children);
        const isLast = idx === total - 1;
        const typedChild = child;
        return React.cloneElement(typedChild, {
          style: {
            ...typedChild.props.style,
            borderRadius: 0,
            border: "none",
            flex: fullWidth ? 1 : void 0,
            borderRight: orientation === "horizontal" && !isLast ? "1px solid var(--boost-border, #cbd5e1)" : "none",
            borderBottom: orientation === "vertical" && !isLast ? "1px solid var(--boost-border, #cbd5e1)" : "none"
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
  children,
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
  const defaultIcon = /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" }) });
  const effectiveIcon = icon || children || defaultIcon;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      className: `boost-fab ${className}`,
      style: {
        position: "fixed",
        zIndex: 999,
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        padding: label ? "12px 20px" : "14px",
        minWidth: label ? "auto" : "48px",
        minHeight: "48px",
        borderRadius: label ? "9999px" : "50%",
        backgroundColor: "var(--boost-primary, #2563eb)",
        color: "#ffffff",
        border: "none",
        boxShadow: "0 10px 25px -5px rgba(37, 99, 235, 0.45)",
        fontWeight: 600,
        fontSize: "14px",
        cursor: "pointer",
        transition: "transform 0.15s ease, box-shadow 0.15s ease",
        ...getPositionStyles(),
        ...style
      },
      ...props,
      children: [
        effectiveIcon,
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
  fullWidth = false,
  className = "",
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case "secondary":
        return {
          backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
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
          border: "none"
        };
      case "destructive":
        return {
          backgroundColor: "var(--boost-danger, #dc2626)",
          color: "#ffffff",
          border: "none"
        };
      case "link":
        return {
          backgroundColor: "transparent",
          color: "var(--boost-primary, #2563eb)",
          border: "none",
          padding: 0,
          textDecoration: "underline"
        };
      case "primary":
      default:
        return {
          backgroundColor: "var(--boost-primary, #2563eb)",
          color: "#ffffff",
          border: "none"
        };
    }
  };
  const getSizeStyles = () => {
    if (variant === "link") return {};
    switch (size) {
      case "sm":
        return { padding: "6px 14px", fontSize: "12px", borderRadius: "var(--boost-radius, 8px)" };
      case "lg":
        return { padding: "13px 26px", fontSize: "15px", borderRadius: "var(--boost-radius, 12px)" };
      case "md":
      default:
        return { padding: "9px 18px", fontSize: "14px", borderRadius: "var(--boost-radius, 10px)" };
    }
  };
  return /* @__PURE__ */ jsxs(
    "a",
    {
      href,
      className: `boost-link-btn boost-btn-${variant} ${className}`,
      style: {
        display: fullWidth ? "flex" : "inline-flex",
        width: fullWidth ? "100%" : "auto",
        alignItems: "center",
        justifyContent: "center",
        gap: "8px",
        textDecoration: "none",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
        boxSizing: "border-box",
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
  iconOnly = false,
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
        padding: iconOnly ? isSmall ? "6px" : "8px" : isSmall ? "4px 8px" : "6px 12px",
        borderRadius: iconOnly ? "var(--boost-radius, 8px)" : "var(--boost-radius, 6px)",
        fontSize: isSmall ? "12px" : "13px",
        fontWeight: 600,
        cursor: "pointer",
        transition: "all 0.15s ease",
        ...getVariantStyles(),
        ...style
      },
      "aria-label": copied ? copiedLabel : label,
      title: copied ? copiedLabel : label,
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
        !iconOnly && /* @__PURE__ */ jsx("span", { children: copied ? copiedLabel : label })
      ]
    }
  );
};
CopyButton.displayName = "CopyButton";
var Input = /* @__PURE__ */ React.forwardRef(
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
                    "aria-invalid": error ? true : void 0,
                    "aria-describedby": error && inputId ? `${inputId}-error` : helperText && inputId ? `${inputId}-helper` : void 0,
                    style: {
                      width: "100%",
                      paddingTop: "10px",
                      paddingBottom: "10px",
                      paddingLeft: leftIcon ? "38px" : "14px",
                      paddingRight: rightIcon ? "38px" : "14px",
                      fontSize: "14px",
                      color: "var(--boost-text, #0f172a)",
                      backgroundColor: disabled ? "rgba(0, 0, 0, 0.04)" : "var(--boost-surface, #ffffff)",
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
          error ? /* @__PURE__ */ jsx(
            "span",
            {
              id: inputId ? `${inputId}-error` : void 0,
              role: "alert",
              style: { fontSize: "12px", color: "#ef4444", fontWeight: 500 },
              children: error
            }
          ) : helperText ? /* @__PURE__ */ jsx(
            "span",
            {
              id: inputId ? `${inputId}-helper` : void 0,
              style: { fontSize: "12px", color: "var(--boost-muted, #64748b)" },
              children: helperText
            }
          ) : null
        ]
      }
    );
  }
);
Input.displayName = "Input";
var Textarea = /* @__PURE__ */ React.forwardRef(
  ({
    label,
    error,
    helperText,
    maxChars,
    maxLength,
    showCount = false,
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
    const limit = maxLength || maxChars;
    const charCount = typeof value === "string" ? value.length : 0;
    const shouldShowCount = showCount || Boolean(maxChars);
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
          /* @__PURE__ */ jsx("style", { children: `
          .boost-textarea {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-textarea {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
            color: #f8fafc !important;
          }
          .boost-textarea:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
        ` }),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: [
            label && /* @__PURE__ */ jsx(
              "label",
              {
                htmlFor: textareaId,
                style: {
                  fontSize: "13px",
                  fontWeight: 600,
                  color: "var(--boost-text, #334155)"
                },
                children: label
              }
            ),
            shouldShowCount && limit && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", color: charCount > limit ? "#ef4444" : "var(--boost-text-muted, #64748b)" }, children: [
              charCount,
              "/",
              limit
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
              maxLength: limit,
              "aria-invalid": error ? true : void 0,
              "aria-describedby": error && textareaId ? `${textareaId}-error` : helperText && textareaId ? `${textareaId}-helper` : void 0,
              className: "boost-textarea",
              style: {
                width: "100%",
                padding: "10px 14px",
                fontSize: "14px",
                borderRadius: "var(--boost-radius, 8px)",
                outline: "none",
                minHeight: "90px",
                resize: "vertical",
                boxSizing: "border-box",
                fontFamily: "inherit",
                lineHeight: 1.5,
                borderColor: error ? "#ef4444" : void 0,
                ...style
              },
              ...props
            }
          ),
          error ? /* @__PURE__ */ jsx(
            "span",
            {
              id: textareaId ? `${textareaId}-error` : void 0,
              role: "alert",
              style: { fontSize: "12px", color: "#ef4444", fontWeight: 500 },
              children: error
            }
          ) : helperText ? /* @__PURE__ */ jsx(
            "span",
            {
              id: textareaId ? `${textareaId}-helper` : void 0,
              style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" },
              children: helperText
            }
          ) : null
        ]
      }
    );
  }
);
Textarea.displayName = "Textarea";
var Select = /* @__PURE__ */ React.forwardRef(
  ({
    label,
    error,
    helperText,
    options = [],
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
          /* @__PURE__ */ jsx("style", { children: `
          .boost-select {
            background-color: var(--boost-surface, #ffffff);
            color: var(--boost-text, #0f172a);
            border: 1px solid var(--boost-border, #cbd5e1);
            transition: border-color 0.15s ease, box-shadow 0.15s ease;
          }
          :root[data-theme="dark"] .boost-select {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-select option {
            background-color: #1e293b !important;
            color: #f8fafc !important;
          }
          .boost-select:focus {
            border-color: var(--boost-primary, #2563eb) !important;
            box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.18) !important;
          }
        ` }),
          label && /* @__PURE__ */ jsx(
            "label",
            {
              htmlFor: selectId,
              style: {
                fontSize: "13px",
                fontWeight: 600,
                color: "var(--boost-text, #334155)"
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
                className: "boost-select",
                style: {
                  width: "100%",
                  paddingTop: "9px",
                  paddingBottom: "9px",
                  paddingLeft: "12px",
                  paddingRight: "36px",
                  fontSize: "14px",
                  borderRadius: "var(--boost-radius, 8px)",
                  outline: "none",
                  appearance: "none",
                  WebkitAppearance: "none",
                  cursor: disabled ? "not-allowed" : "pointer",
                  boxSizing: "border-box",
                  borderColor: error ? "#ef4444" : void 0,
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
                  color: "var(--boost-text-muted, #64748b)",
                  display: "flex"
                },
                children: /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
              }
            )
          ] }),
          error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#ef4444", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: helperText }) : null
        ]
      }
    );
  }
);
Select.displayName = "Select";
var MultiSelect = ({
  label,
  options = [],
  value = [],
  onChange = () => {
  },
  placeholder = "Select options...",
  error,
  className = "",
  disabled = false,
  style
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const containerRef = React.useRef(null);
  const safeValue = Array.isArray(value) ? value : [];
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
    if (safeValue.includes(val)) {
      onChange(safeValue.filter((v) => v !== val));
    } else {
      onChange([...safeValue, val]);
    }
  };
  const removeChip = (e, val) => {
    e.stopPropagation();
    onChange(safeValue.filter((v) => v !== val));
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
        width: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        .boost-multiselect-input {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #cbd5e1);
          color: var(--boost-text, #0f172a);
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }
        :root[data-theme="dark"] .boost-multiselect-input {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        .boost-multiselect-dropdown {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #e2e8f0);
          color: var(--boost-text, #0f172a);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.12);
        }
        :root[data-theme="dark"] .boost-multiselect-dropdown {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: #f8fafc !important;
          box-shadow: 0 14px 30px -5px rgba(0, 0, 0, 0.6) !important;
        }
        .boost-multiselect-option {
          transition: background-color 0.15s ease;
          color: var(--boost-text, #0f172a);
        }
        :root[data-theme="dark"] .boost-multiselect-option {
          color: #f8fafc !important;
        }
        .boost-multiselect-option:hover {
          background-color: var(--boost-surface-secondary, #f1f5f9);
        }
        :root[data-theme="dark"] .boost-multiselect-option:hover {
          background-color: rgba(255, 255, 255, 0.08) !important;
        }
      ` }),
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)" }, children: label }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            onClick: () => !disabled && setIsOpen((prev) => !prev),
            className: "boost-multiselect-input",
            style: {
              display: "flex",
              alignItems: "center",
              flexWrap: "wrap",
              gap: "6px",
              padding: "6px 12px",
              minHeight: "38px",
              borderRadius: "var(--boost-radius, 8px)",
              cursor: disabled ? "not-allowed" : "pointer",
              boxSizing: "border-box",
              borderColor: error ? "#ef4444" : isOpen ? "var(--boost-primary, #2563eb)" : void 0
            },
            children: [
              safeValue.length === 0 ? /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", color: "var(--boost-text-muted, #94a3b8)" }, children: placeholder }) : safeValue.map((val) => {
                const opt = options.find((o) => o.value === val);
                return /* @__PURE__ */ jsxs(
                  "span",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "5px",
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                      color: "#6366f1",
                      border: "1px solid rgba(99, 102, 241, 0.25)",
                      padding: "2px 8px",
                      borderRadius: "6px",
                      fontSize: "12px",
                      fontWeight: 600
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { children: opt ? opt.label : val }),
                      /* @__PURE__ */ jsx(
                        "span",
                        {
                          onClick: (e) => removeChip(e, val),
                          role: "button",
                          "aria-label": `Remove ${opt ? opt.label : val}`,
                          style: {
                            display: "inline-flex",
                            cursor: "pointer",
                            fontSize: "14px",
                            lineHeight: 1,
                            opacity: 0.7
                          },
                          onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
                          onMouseLeave: (e) => e.currentTarget.style.opacity = "0.7",
                          children: "\xD7"
                        }
                      )
                    ]
                  },
                  val
                );
              }),
              /* @__PURE__ */ jsx("span", { style: { marginLeft: "auto", display: "inline-flex", color: "var(--boost-text-muted, #64748b)" }, children: /* @__PURE__ */ jsx(
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
                    transition: "transform 0.2s ease"
                  },
                  children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              ) })
            ]
          }
        ),
        isOpen && /* @__PURE__ */ jsx(
          "div",
          {
            className: "boost-multiselect-dropdown",
            style: {
              position: "absolute",
              top: "calc(100% + 4px)",
              left: 0,
              right: 0,
              borderRadius: "var(--boost-radius, 8px)",
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
                  className: "boost-multiselect-option",
                  style: {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "8px 12px",
                    fontSize: "13.5px",
                    borderRadius: "6px",
                    cursor: "pointer",
                    backgroundColor: isSelected ? "rgba(99, 102, 241, 0.12)" : "transparent"
                  },
                  children: [
                    /* @__PURE__ */ jsx("span", { children: opt.label }),
                    isSelected && /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "var(--boost-primary, #2563eb)", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
                  ]
                },
                opt.value
              );
            })
          }
        ),
        error && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "#ef4444", fontWeight: 500 }, children: error })
      ]
    }
  );
};
MultiSelect.displayName = "MultiSelect";
var Checkbox = /* @__PURE__ */ React.forwardRef(
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
                accentColor: "var(--boost-primary, #2563eb)",
                cursor: disabled ? "not-allowed" : "pointer",
                margin: 0
              },
              ...props
            }
          ) }),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "var(--boost-text, #1e293b)" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: description })
          ] })
        ]
      }
    );
  }
);
Checkbox.displayName = "Checkbox";
var Radio = /* @__PURE__ */ React.forwardRef(
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
                marginTop: "3px",
                accentColor: "var(--boost-primary, #2563eb)",
                cursor: disabled ? "not-allowed" : "pointer"
              },
              ...props
            }
          ),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "var(--boost-text, #0f172a)" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: description })
          ] })
        ]
      }
    );
  }
);
Radio.displayName = "Radio";
var RadioGroup = ({
  name = "radio-group",
  options = [],
  value,
  onChange = () => {
  },
  orientation = "vertical",
  className = "",
  style,
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
        fontFamily: "inherit",
        ...style
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
var Switch = /* @__PURE__ */ React.forwardRef(
  ({
    checked = false,
    onChange = () => {
    },
    label,
    description,
    disabled = false,
    size = "md",
    className = "",
    style
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
          fontFamily: "inherit",
          ...style
        },
        children: [
          /* @__PURE__ */ jsx("style", { children: `
          .boost-switch-btn {
            background-color: #cbd5e1;
          }
          :root[data-theme="dark"] .boost-switch-btn:not([aria-checked="true"]) {
            background-color: #334155 !important;
          }
          .boost-switch-btn[aria-checked="true"] {
            background-color: var(--boost-primary, #2563eb) !important;
          }
        ` }),
          /* @__PURE__ */ jsx(
            "button",
            {
              ref,
              type: "button",
              role: "switch",
              "aria-checked": checked,
              disabled,
              onClick: () => !disabled && onChange(!checked),
              className: "boost-switch-btn",
              style: {
                width: `${s.width}px`,
                height: `${s.height}px`,
                borderRadius: "9999px",
                position: "relative",
                transition: "background-color 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                border: "none",
                padding: 0,
                cursor: disabled ? "not-allowed" : "pointer",
                outline: "none",
                flexShrink: 0
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
                    transition: "transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                    boxShadow: "0 1px 3px rgba(0, 0, 0, 0.25)",
                    display: "block"
                  }
                }
              )
            }
          ),
          (label || description) && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column" }, children: [
            label && /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 500, color: "var(--boost-text, #1e293b)" }, children: label }),
            description && /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: description })
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
  onChange = () => {
  },
  minDate,
  maxDate,
  min,
  max,
  error,
  helperText,
  disabled = false,
  id: explicitId,
  className = "",
  style
}) => {
  const generatedId = React.useId ? React.useId().replace(/:/g, "") : `date-picker-${Math.random().toString(36).substring(2, 7)}`;
  const inputId = explicitId || (label ? `datepicker-${label.toLowerCase().replace(/\s+/g, "-")}` : generatedId);
  const helpId = `${inputId}-desc`;
  const effectiveMin = min || minDate;
  const effectiveMax = max || maxDate;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      role: "group",
      "aria-label": label || "Date picker",
      className: `boost-datepicker-wrapper ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: "6px",
        fontFamily: "inherit",
        width: "100%",
        ...style
      },
      children: [
        label && /* @__PURE__ */ jsx(
          "label",
          {
            htmlFor: inputId,
            style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", letterSpacing: "-0.01em" },
            children: label
          }
        ),
        /* @__PURE__ */ jsx("div", { style: { position: "relative", width: "100%" }, children: /* @__PURE__ */ jsx(
          "input",
          {
            id: inputId,
            type: "date",
            value: value || "",
            onChange: (e) => onChange(e.target.value),
            min: effectiveMin,
            max: effectiveMax,
            disabled,
            "aria-label": label || "Select date",
            "aria-invalid": Boolean(error),
            "aria-describedby": error || helperText ? helpId : void 0,
            style: {
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              color: "var(--boost-text, #0f172a)",
              backgroundColor: disabled ? "rgba(0, 0, 0, 0.04)" : "var(--boost-surface, #ffffff)",
              border: `1px solid ${error ? "var(--boost-danger, #ef4444)" : "var(--boost-border, #cbd5e1)"}`,
              borderRadius: "8px",
              outline: "none",
              boxSizing: "border-box",
              colorScheme: "inherit",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease"
            }
          }
        ) }),
        error ? /* @__PURE__ */ jsx("span", { id: helpId, role: "alert", style: { fontSize: "12px", color: "var(--boost-danger, #ef4444)", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { id: helpId, style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: helperText }) : null
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
  className = "",
  style
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
        width: "100%",
        ...style
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", letterSpacing: "-0.01em" }, children: label }),
        /* @__PURE__ */ jsx(
          "input",
          {
            type: "time",
            value,
            onChange: (e) => onChange(e.target.value),
            disabled,
            style: {
              width: "100%",
              padding: "10px 14px",
              fontSize: "14px",
              color: "var(--boost-text, #0f172a)",
              backgroundColor: disabled ? "rgba(0, 0, 0, 0.04)" : "var(--boost-surface, #ffffff)",
              border: `1px solid ${error ? "var(--boost-danger, #ef4444)" : "var(--boost-border, #cbd5e1)"}`,
              borderRadius: "8px",
              outline: "none",
              boxSizing: "border-box",
              colorScheme: "inherit",
              transition: "border-color 0.15s ease, box-shadow 0.15s ease"
            }
          }
        ),
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-danger, #ef4444)", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: helperText }) : null
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
  className = "",
  style
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
        width: "100%",
        ...style
      },
      children: [
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", letterSpacing: "-0.01em" }, children: label }),
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
              border: `2px dashed ${error ? "var(--boost-danger, #ef4444)" : isDragOver ? "var(--boost-primary, #2563eb)" : "var(--boost-border, #cbd5e1)"}`,
              borderRadius: "10px",
              padding: "28px 20px",
              textAlign: "center",
              backgroundColor: isDragOver ? "rgba(37, 99, 235, 0.08)" : disabled ? "rgba(0, 0, 0, 0.03)" : "var(--boost-surface, #ffffff)",
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
                /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      width: "44px",
                      height: "44px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(100, 116, 139, 0.08)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "var(--boost-text-muted, #64748b)"
                    },
                    children: /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                      /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                      /* @__PURE__ */ jsx("polyline", { points: "17 8 12 3 7 8" }),
                      /* @__PURE__ */ jsx("line", { x1: "12", y1: "3", x2: "12", y2: "15" })
                    ] })
                  }
                ),
                /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 600, color: "var(--boost-text, #1e293b)" }, children: "Click to upload or drag and drop" }),
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: [
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
        fileList.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "6px", marginTop: "6px" }, children: fileList.map((f, i) => /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "8px 12px",
              background: "rgba(100, 116, 139, 0.08)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "6px",
              fontSize: "13px",
              color: "var(--boost-text, #334155)"
            },
            children: [
              /* @__PURE__ */ jsx("span", { style: { fontWeight: 500, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", maxWidth: "75%" }, children: f.name }),
              /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-text-muted, #64748b)", fontSize: "12px" }, children: [
                (f.size / (1024 * 1024)).toFixed(2),
                " MB"
              ] })
            ]
          },
          i
        )) }),
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-danger, #ef4444)", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: helperText }) : null
      ]
    }
  );
};
FileUpload.displayName = "FileUpload";
var SearchInput = /* @__PURE__ */ React.forwardRef(
  ({
    value,
    onChange,
    onClear,
    onSearch,
    onKeyDown,
    fullWidth = true,
    className = "",
    style,
    placeholder = "Search...",
    ...props
  }, ref) => {
    const handleKeyDown = (e) => {
      if (e.key === "Enter" && onSearch) {
        onSearch(String(e.currentTarget.value || ""));
      }
      onKeyDown?.(e);
    };
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
                color: "var(--boost-text-muted, #64748b)",
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
              onKeyDown: handleKeyDown,
              placeholder,
              style: {
                width: "100%",
                paddingTop: "9px",
                paddingBottom: "9px",
                paddingLeft: "36px",
                paddingRight: value && onClear ? "36px" : "14px",
                fontSize: "14px",
                color: "var(--boost-text, #0f172a)",
                backgroundColor: "var(--boost-surface, #ffffff)",
                border: "1px solid var(--boost-border, #cbd5e1)",
                borderRadius: "8px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.15s ease, box-shadow 0.15s ease",
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
                color: "var(--boost-text-muted, #94a3b8)",
                cursor: "pointer",
                padding: "4px",
                borderRadius: "4px"
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
  className = "",
  style
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
        width: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsxs("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", letterSpacing: "-0.01em" }, children: [
          label,
          required && /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-danger, #ef4444)", marginLeft: "4px" }, children: "*" })
        ] }),
        children,
        error ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-danger, #ef4444)", fontWeight: 500 }, children: error }) : helperText ? /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)" }, children: helperText }) : null
      ]
    }
  );
};
FormField.displayName = "FormField";
var OTPInput = /* @__PURE__ */ React.forwardRef(
  ({
    length = 6,
    value = "",
    onChange = () => {
    },
    onComplete,
    disabled = false,
    error,
    className = "",
    style
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
          fontFamily: "inherit",
          maxWidth: "100%",
          ...style
        },
        children: [
          /* @__PURE__ */ jsx("style", { children: `
            .boost-otp-box {
              width: 44px;
              height: 52px;
              font-size: 22px;
              font-weight: 700;
              text-align: center;
              border-radius: 12px;
              outline: none;
              transition: all 0.15s cubic-bezier(0.16, 1, 0.3, 1);
              background-color: var(--boost-surface, #ffffff);
              border: 1.5px solid var(--boost-border, #cbd5e1);
              color: var(--boost-text-primary, #0f172a);
            }
            :root[data-theme="dark"] .boost-otp-box,
            .dark .boost-otp-box {
              background-color: rgba(255, 255, 255, 0.08) !important;
              border-color: rgba(255, 255, 255, 0.2) !important;
              color: #ffffff !important;
            }
            .boost-otp-box:focus {
              border-color: var(--boost-primary, #6366f1) !important;
              box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3) !important;
              background-color: rgba(99, 102, 241, 0.08) !important;
            }
            @media (max-width: 420px) {
              .boost-otp-box {
                width: 38px;
                height: 46px;
                font-size: 18px;
                border-radius: 8px;
              }
            }
          ` }),
          /* @__PURE__ */ jsx("div", { style: { display: "flex", gap: "8px", maxWidth: "100%", flexWrap: "wrap", justifyContent: "center" }, children: Array.from({ length }).map((_, idx) => /* @__PURE__ */ jsx(
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
              className: "boost-otp-box",
              style: {
                borderColor: error ? "#ef4444" : value[idx] ? "var(--boost-primary, #6366f1)" : void 0,
                boxShadow: value[idx] ? "0 0 0 2px rgba(99, 102, 241, 0.2)" : void 0
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
  color = "var(--boost-primary, #2563eb)",
  text,
  className = "",
  style
}) => {
  const getDimension = () => {
    if (typeof size === "number") return size;
    switch (size) {
      case "sm":
        return 18;
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
        fontFamily: "inherit",
        ...style
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
        text && /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontSize: size === "sm" ? "12px" : "13.5px",
              color: "var(--boost-text-muted, #64748b)",
              fontWeight: 500
            },
            children: text
          }
        )
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
  showPercentage,
  showPercent,
  color = "var(--boost-primary, #2563eb)",
  height = 8,
  className = "",
  style
}) => {
  const shouldShowPercent = showPercent !== void 0 ? showPercent : Boolean(showPercentage);
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
        fontFamily: "inherit",
        ...style
      },
      children: [
        (label || shouldShowPercent) && /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              justifyContent: "space-between",
              fontSize: "12.5px",
              fontWeight: 500,
              color: "var(--boost-text, #334155)"
            },
            children: [
              label && /* @__PURE__ */ jsx("span", { children: label }),
              shouldShowPercent && /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-text-muted, #64748b)", fontWeight: 600 }, children: [
                Math.round(clamped),
                "%"
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "100%",
              height: `${height}px`,
              backgroundColor: "var(--boost-surface-secondary, #e2e8f0)",
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
                  transition: "width 0.35s cubic-bezier(0.16, 1, 0.3, 1)"
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
  borderRadius,
  className = "",
  style
}) => {
  const getRadius = () => {
    if (borderRadius !== void 0) {
      return typeof borderRadius === "number" ? `${borderRadius}px` : borderRadius;
    }
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
        .boost-skeleton {
          background: linear-gradient(90deg, #f1f5f9 25%, #e2e8f0 50%, #f1f5f9 75%);
          background-size: 200% 100%;
          animation: boost-shimmer 1.5s infinite;
        }
        :root[data-theme="dark"] .boost-skeleton {
          background: linear-gradient(90deg, rgba(255, 255, 255, 0.05) 25%, rgba(255, 255, 255, 0.12) 50%, rgba(255, 255, 255, 0.05) 75%) !important;
          background-size: 200% 100% !important;
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
  variant,
  type,
  onClose,
  className = "",
  style
}) => {
  const activeVariant = type || variant || "info";
  const getTheme = () => {
    switch (activeVariant) {
      case "success":
        return { bg: "#f0fdf4", border: "#bbf7d0", text: "#166534", icon: "#16a34a" };
      case "warning":
        return { bg: "#fffbeb", border: "#fde68a", text: "#854d0e", icon: "#d97706" };
      case "error":
        return { bg: "#fef2f2", border: "#fecaca", text: "#991b1b", icon: "#dc2626" };
      case "loading":
        return { bg: "#f8fafc", border: "#e2e8f0", text: "#334155", icon: "#2563eb" };
      case "info":
      default:
        return { bg: "#eff6ff", border: "#bfdbfe", text: "#1e40af", icon: "#2563eb" };
    }
  };
  const theme = getTheme();
  const isAssertive = activeVariant === "error";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-toast boost-toast-${activeVariant} ${className}`,
      role: isAssertive ? "alert" : "status",
      "aria-live": isAssertive ? "assertive" : "polite",
      "aria-atomic": "true",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "12px 16px",
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: "10px",
        boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.12)",
        fontFamily: "inherit",
        maxWidth: "380px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        @keyframes boost-toast-spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        :root[data-theme="dark"] .boost-toast {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 14px 30px -5px rgba(0, 0, 0, 0.6) !important;
        }
        :root[data-theme="dark"] .boost-toast-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-toast-msg {
          color: #cbd5e1 !important;
        }
      ` }),
        /* @__PURE__ */ jsxs("div", { style: { marginTop: "2px", display: "flex", color: theme.icon, flexShrink: 0 }, children: [
          activeVariant === "loading" && /* @__PURE__ */ jsxs(
            "svg",
            {
              width: "18",
              height: "18",
              viewBox: "0 0 24 24",
              fill: "none",
              stroke: "currentColor",
              strokeWidth: "2.5",
              style: { animation: "boost-toast-spin 0.8s linear infinite" },
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeOpacity: "0.25" }),
                /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
              ]
            }
          ),
          activeVariant === "success" && /* @__PURE__ */ jsx("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
          activeVariant === "error" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("line", { x1: "15", y1: "9", x2: "9", y2: "15" }),
            /* @__PURE__ */ jsx("line", { x1: "9", y1: "9", x2: "15", y2: "15" })
          ] }),
          activeVariant === "warning" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("path", { d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
          ] }),
          activeVariant === "info" && /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
            /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
            /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
          ] })
        ] }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title && /* @__PURE__ */ jsx("div", { className: "boost-toast-title", style: { fontSize: "14px", fontWeight: 600, color: theme.text, marginBottom: "2px" }, children: title }),
          /* @__PURE__ */ jsx("div", { className: "boost-toast-msg", style: { fontSize: "13px", color: theme.text, lineHeight: 1.4 }, children: message })
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
    fn.loading = (message, title) => addToast({ message, title, variant: "loading", duration: 0 });
    fn.promise = async (promise, options) => {
      const id = addToast({ message: options.loading, variant: "loading", duration: 0 });
      try {
        const data = await promise;
        dismiss(id);
        const successMsg = typeof options.success === "function" ? options.success(data) : options.success;
        addToast({ message: successMsg, variant: "success" });
        return data;
      } catch (err) {
        dismiss(id);
        const errorMsg = typeof options.error === "function" ? options.error(err) : options.error;
        addToast({ message: errorMsg, variant: "error" });
        throw err;
      }
    };
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
          loading: (msg) => {
            if (typeof window !== "undefined") console.info(`[Toast Loading] ${msg}`);
            return "";
          },
          promise: async (p) => await p,
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
  description,
  variant,
  type,
  icon,
  onClose,
  className = "",
  style
}) => {
  const activeVariant = type || variant || "info";
  const content = description || children;
  const getTheme = () => {
    switch (activeVariant) {
      case "success":
        return {
          bg: "rgba(34, 197, 94, 0.1)",
          border: "rgba(34, 197, 94, 0.25)",
          titleColor: "#16a34a",
          textColor: "var(--boost-text-muted, #94a3b8)",
          iconColor: "#16a34a"
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.1)",
          border: "rgba(245, 158, 11, 0.25)",
          titleColor: "#d97706",
          textColor: "var(--boost-text-muted, #94a3b8)",
          iconColor: "#d97706"
        };
      case "destructive":
      case "error":
        return {
          bg: "rgba(239, 68, 68, 0.1)",
          border: "rgba(239, 68, 68, 0.25)",
          titleColor: "#ef4444",
          textColor: "var(--boost-text-muted, #94a3b8)",
          iconColor: "#ef4444"
        };
      case "info":
      default:
        return {
          bg: "rgba(59, 130, 246, 0.1)",
          border: "rgba(59, 130, 246, 0.25)",
          titleColor: "#2563eb",
          textColor: "var(--boost-text-muted, #94a3b8)",
          iconColor: "#2563eb"
        };
    }
  };
  const theme = getTheme();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-alert boost-alert-${activeVariant} ${className}`,
      role: "alert",
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "12px",
        padding: "14px 16px",
        backgroundColor: theme.bg,
        border: `1px solid ${theme.border}`,
        borderRadius: "var(--boost-radius, 10px)",
        fontFamily: "inherit",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("div", { style: { marginTop: "2px", display: "flex", color: theme.iconColor, flexShrink: 0 }, children: icon ? icon : /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", children: [
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
          /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
        ] }) }),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title && /* @__PURE__ */ jsx(
            "h4",
            {
              style: {
                margin: "0 0 3px 0",
                fontSize: "14px",
                fontWeight: 600,
                color: theme.titleColor,
                letterSpacing: "-0.01em"
              },
              children: title
            }
          ),
          content && /* @__PURE__ */ jsx("div", { style: { fontSize: "13px", color: theme.textColor, lineHeight: 1.5 }, children: content })
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
              color: "currentColor",
              opacity: 0.6,
              display: "flex",
              transition: "opacity 0.15s ease"
            },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "0.6",
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
  actionLabel,
  onAction,
  isOpen = true,
  onClose,
  duration = 4e3,
  className = "",
  style
}) => {
  const btnLabel = actionLabel || actionText;
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
        border: "1px solid rgba(255, 255, 255, 0.12)",
        padding: "10px 18px",
        borderRadius: "8px",
        boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.4), 0 8px 10px -6px rgba(0, 0, 0, 0.3)",
        display: "inline-flex",
        alignItems: "center",
        gap: "16px",
        fontSize: "13.5px",
        fontWeight: 500,
        zIndex: 1e3,
        fontFamily: "inherit",
        maxWidth: "calc(100vw - 32px)",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("span", { children: message }),
        btnLabel && onAction && /* @__PURE__ */ jsx(
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
              padding: 0,
              transition: "color 0.15s ease"
            },
            onMouseEnter: (e) => e.currentTarget.style.color = "#93c5fd",
            onMouseLeave: (e) => e.currentTarget.style.color = "#60a5fa",
            children: btnLabel
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
  actionLabel,
  onAction,
  icon,
  className = "",
  style
}) => {
  const btnLabel = actionLabel || actionText;
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
        fontFamily: "inherit",
        backgroundColor: "var(--boost-surface, transparent)",
        borderRadius: "var(--boost-radius, 12px)",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-empty-state-icon {
          background-color: rgba(255, 255, 255, 0.08) !important;
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-empty-state-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-empty-state-desc {
          color: #94a3b8 !important;
        }
      ` }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "boost-empty-state-icon",
            style: {
              width: "64px",
              height: "64px",
              borderRadius: "50%",
              backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
              color: "var(--boost-text-muted, #64748b)",
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
        /* @__PURE__ */ jsx(
          "h3",
          {
            className: "boost-empty-state-title",
            style: {
              margin: "0 0 8px 0",
              fontSize: "18px",
              fontWeight: 700,
              color: "var(--boost-text, #0f172a)",
              letterSpacing: "-0.01em"
            },
            children: title
          }
        ),
        description && /* @__PURE__ */ jsx(
          "p",
          {
            className: "boost-empty-state-desc",
            style: {
              margin: "0 0 20px 0",
              fontSize: "14px",
              color: "var(--boost-text-muted, #64748b)",
              maxWidth: "380px",
              lineHeight: 1.55
            },
            children: description
          }
        ),
        btnLabel && onAction && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onAction,
            style: {
              backgroundColor: "var(--boost-primary, #2563eb)",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--boost-radius, 8px)",
              padding: "9px 20px",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(37, 99, 235, 0.25)",
              transition: "all 0.15s ease"
            },
            children: btnLabel
          }
        )
      ]
    }
  );
};
EmptyState.displayName = "EmptyState";
var ErrorState = ({
  title = "Something went wrong",
  message,
  description,
  onRetry,
  retryText = "Try Again",
  className = "",
  style
}) => {
  const desc = description || message || "An unexpected error occurred while loading this content. Please try again.";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-error-state ${className}`,
      style: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "36px 24px",
        textAlign: "center",
        fontFamily: "inherit",
        backgroundColor: "rgba(239, 68, 68, 0.06)",
        border: "1px solid rgba(239, 68, 68, 0.2)",
        borderRadius: "var(--boost-radius, 12px)",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              backgroundColor: "rgba(239, 68, 68, 0.14)",
              color: "#ef4444",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: "14px"
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
            ] })
          }
        ),
        /* @__PURE__ */ jsx(
          "h4",
          {
            style: {
              margin: "0 0 6px 0",
              fontSize: "16px",
              fontWeight: 700,
              color: "#ef4444",
              letterSpacing: "-0.01em"
            },
            children: title
          }
        ),
        /* @__PURE__ */ jsx(
          "p",
          {
            style: {
              margin: "0 0 18px 0",
              fontSize: "13.5px",
              color: "var(--boost-text-muted, #94a3b8)",
              maxWidth: "380px",
              lineHeight: 1.55
            },
            children: desc
          }
        ),
        onRetry && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRetry,
            style: {
              backgroundColor: "#dc2626",
              color: "#ffffff",
              border: "none",
              borderRadius: "var(--boost-radius, 8px)",
              padding: "8px 18px",
              fontSize: "13.5px",
              fontWeight: 600,
              cursor: "pointer",
              boxShadow: "0 2px 8px rgba(220, 38, 38, 0.3)",
              transition: "all 0.15s ease"
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
  description,
  className = "",
  style
}) => {
  const desc = description || message;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-success-message ${className}`,
      style: {
        display: "flex",
        alignItems: "flex-start",
        gap: "14px",
        padding: "16px 18px",
        backgroundColor: "rgba(34, 197, 94, 0.08)",
        border: "1px solid rgba(34, 197, 94, 0.25)",
        borderRadius: "var(--boost-radius, 12px)",
        fontFamily: "inherit",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              marginTop: "2px",
              display: "flex",
              color: "#16a34a",
              flexShrink: 0
            },
            children: /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("polyline", { points: "9 12 11 14 15 10" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          title && /* @__PURE__ */ jsx(
            "h4",
            {
              style: {
                margin: "0 0 4px 0",
                fontSize: "15px",
                fontWeight: 700,
                color: "#16a34a",
                letterSpacing: "-0.01em"
              },
              children: title
            }
          ),
          desc && /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                fontSize: "13.5px",
                color: "var(--boost-text-muted, #94a3b8)",
                lineHeight: 1.55
              },
              children: desc
            }
          )
        ] })
      ]
    }
  );
};
SuccessMessage.displayName = "SuccessMessage";
var Card = /* @__PURE__ */ React.forwardRef(
  ({ hoverable = false, variant = "elevated", className = "", style, children, ...props }, ref) => {
    const isGlass = variant === "glass";
    const isOutlined = variant === "outlined";
    return /* @__PURE__ */ jsxs(
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
        children: [
          /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-card {
            background-color: #1e293b !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-card-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-card-description {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-card-content {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-card-footer {
            background-color: #141e2e !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-card-hoverable:hover {
            transform: translateY(-4px);
            box-shadow: 0 12px 24px -10px rgba(0, 0, 0, 0.6) !important;
          }
        ` }),
          children
        ]
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
    className: `boost-card-header ${className}`,
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
    className: `boost-card-title ${className}`,
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
    className: `boost-card-description ${className}`,
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
    className: `boost-card-content ${className}`,
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
      backgroundColor: "var(--boost-surface-secondary, #f8fafc)",
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end",
      gap: "10px",
      boxSizing: "border-box",
      ...style
    },
    className: `boost-card-footer ${className}`,
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
  containerStyle,
  loading = "lazy",
  ...props
}) => {
  const [hasError, setHasError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const getAspect = () => {
    if (typeof aspectRatio === "string" && (aspectRatio.includes("/") || aspectRatio.includes(":"))) {
      return aspectRatio.replace(":", "/");
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
        return void 0;
    }
  };
  const imageSrc = hasError && fallbackSrc ? fallbackSrc : src;
  const aspect = getAspect();
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: "boost-image-container",
      style: {
        overflow: "hidden",
        position: "relative",
        aspectRatio: aspect,
        backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
        borderRadius: "var(--boost-radius, 8px)",
        display: "block",
        width: "100%",
        ...containerStyle
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-image-container {
          background-color: #1e293b;
        }
        .boost-image-shimmer {
          background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%);
          animation: boostImageShimmer 1.5s infinite;
        }
        @keyframes boostImageShimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      ` }),
        !isLoaded && !hasError && /* @__PURE__ */ jsx(
          "div",
          {
            className: "boost-image-shimmer",
            style: {
              position: "absolute",
              inset: 0,
              zIndex: 1,
              pointerEvents: "none"
            }
          }
        ),
        /* @__PURE__ */ jsx(
          "img",
          {
            src: imageSrc,
            alt,
            loading,
            onLoad: () => setIsLoaded(true),
            onError: () => {
              setHasError(true);
              setIsLoaded(true);
            },
            className: `boost-image ${className}`,
            style: {
              width: "100%",
              height: "100%",
              objectFit,
              display: "block",
              opacity: isLoaded ? 1 : 0.85,
              transition: "opacity 0.25s ease",
              ...style
            },
            ...props
          }
        )
      ]
    }
  );
};
Image.displayName = "Image";
var Avatar = ({
  src,
  name,
  size = "md",
  status,
  className = "",
  style
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
        background: "linear-gradient(135deg, #6366f1 0%, #3b82f6 100%)",
        color: "#ffffff",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "inherit",
        fontWeight: 600,
        fontSize: `${s.font}px`,
        userSelect: "none",
        flexShrink: 0,
        ...style
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
              border: "2px solid var(--boost-surface, #ffffff)",
              boxSizing: "content-box"
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
              border: "2px solid var(--boost-surface, #ffffff)",
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
              border: "2px solid var(--boost-surface, #ffffff)",
              borderRadius: "50%",
              backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
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
        return { bg: "var(--boost-surface-secondary, #f1f5f9)", color: "var(--boost-text, #334155)", border: "1px solid var(--boost-border, #e2e8f0)" };
      case "outline":
        return { bg: "transparent", color: "var(--boost-text, #0f172a)", border: "1px solid var(--boost-border, #cbd5e1)" };
      case "success":
        return { bg: "rgba(34, 197, 94, 0.12)", color: "#16a34a", border: "1px solid rgba(34, 197, 94, 0.25)" };
      case "destructive":
        return { bg: "rgba(239, 68, 68, 0.12)", color: "#ef4444", border: "1px solid rgba(239, 68, 68, 0.25)" };
      case "warning":
        return { bg: "rgba(245, 158, 11, 0.12)", color: "#d97706", border: "1px solid rgba(245, 158, 11, 0.25)" };
      case "info":
        return { bg: "rgba(14, 165, 233, 0.12)", color: "#0284c7", border: "1px solid rgba(14, 165, 233, 0.25)" };
      case "primary":
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
        padding: "2.5px 8.5px",
        fontSize: "11px",
        fontWeight: 600,
        borderRadius: "9999px",
        backgroundColor: theme.bg,
        color: theme.color,
        border: theme.border,
        letterSpacing: "0.02em",
        fontFamily: "inherit",
        lineHeight: 1.4,
        userSelect: "none",
        ...style
      },
      children
    }
  );
};
Badge.displayName = "Badge";
var Tag = ({
  label,
  children,
  onRemove,
  color,
  variant = "default",
  size = "md",
  className = "",
  style
}) => {
  const content = children !== void 0 ? children : label;
  const getVariantStyles = () => {
    if (color) {
      return { bg: color, color: "#0f172a", border: "transparent" };
    }
    switch (variant) {
      case "primary":
        return {
          bg: "rgba(59, 130, 246, 0.12)",
          color: "#2563eb",
          border: "rgba(59, 130, 246, 0.25)"
        };
      case "success":
        return {
          bg: "rgba(34, 197, 94, 0.12)",
          color: "#16a34a",
          border: "rgba(34, 197, 94, 0.25)"
        };
      case "warning":
        return {
          bg: "rgba(245, 158, 11, 0.12)",
          color: "#d97706",
          border: "rgba(245, 158, 11, 0.25)"
        };
      case "destructive":
        return {
          bg: "rgba(239, 68, 68, 0.12)",
          color: "#ef4444",
          border: "rgba(239, 68, 68, 0.25)"
        };
      case "purple":
        return {
          bg: "rgba(168, 85, 247, 0.12)",
          color: "#9333ea",
          border: "rgba(168, 85, 247, 0.25)"
        };
      case "default":
      default:
        return {
          bg: "var(--boost-surface-secondary, #f1f5f9)",
          color: "var(--boost-text, #334155)",
          border: "var(--boost-border, #e2e8f0)"
        };
    }
  };
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return { padding: "2px 8px", fontSize: "11px" };
      case "lg":
        return { padding: "5px 14px", fontSize: "13px" };
      case "md":
      default:
        return { padding: "3px 10px", fontSize: "12px" };
    }
  };
  const vStyles = getVariantStyles();
  const sStyles = getSizeStyles();
  return /* @__PURE__ */ jsxs(
    "span",
    {
      className: `boost-tag boost-tag-${variant} ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        borderRadius: "6px",
        fontWeight: 500,
        fontFamily: "inherit",
        backgroundColor: vStyles.bg,
        color: vStyles.color,
        border: `1px solid ${vStyles.border}`,
        lineHeight: 1.4,
        userSelect: "none",
        ...sStyles,
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-tag-default {
          background-color: #1e293b !important;
          color: #f1f5f9 !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
      ` }),
        /* @__PURE__ */ jsx("span", { children: content }),
        onRemove && /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            onClick: onRemove,
            "aria-label": "Remove tag",
            style: {
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              color: "currentColor",
              opacity: 0.7,
              display: "inline-flex",
              alignItems: "center",
              transition: "opacity 0.15s ease"
            },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "0.7",
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
  className = "",
  style
}) => {
  const [isVisible, setIsVisible] = React.useState(false);
  const containerRef = React.useRef(null);
  const tooltipId = React.useId ? React.useId().replace(/:/g, "") : `tooltip-${Math.random().toString(36).substring(2, 7)}`;
  React.useEffect(() => {
    if (!isVisible) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        setIsVisible(false);
      }
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isVisible]);
  React.useEffect(() => {
    const handleTouchOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsVisible(false);
      }
    };
    if (isVisible) {
      document.addEventListener("touchstart", handleTouchOutside);
    }
    return () => document.removeEventListener("touchstart", handleTouchOutside);
  }, [isVisible]);
  const getPositionStyles = () => {
    switch (position) {
      case "bottom":
        return {
          top: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)"
        };
      case "left":
        return {
          right: "calc(100% + 8px)",
          top: "50%",
          transform: "translateY(-50%)"
        };
      case "right":
        return {
          left: "calc(100% + 8px)",
          top: "50%",
          transform: "translateY(-50%)"
        };
      case "top":
      default:
        return {
          bottom: "calc(100% + 8px)",
          left: "50%",
          transform: "translateX(-50%)"
        };
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      "aria-describedby": content && isVisible ? tooltipId : void 0,
      className: `boost-tooltip-wrapper ${className}`,
      onMouseEnter: () => setIsVisible(true),
      onMouseLeave: () => setIsVisible(false),
      onFocus: () => setIsVisible(true),
      onBlur: () => setIsVisible(false),
      onClick: () => setIsVisible((prev) => !prev),
      style: {
        position: "relative",
        display: "inline-flex",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        .boost-tooltip-bubble {
          animation: boostTooltipIn 0.15s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.25), 0 4px 6px -4px rgba(0, 0, 0, 0.2);
          max-width: min(280px, calc(100vw - 32px));
          word-break: break-word;
        }
        @keyframes boostTooltipIn {
          from {
            opacity: 0;
            transform: scale(0.92);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
      ` }),
        children,
        isVisible && content && /* @__PURE__ */ jsx(
          "div",
          {
            id: tooltipId,
            role: "tooltip",
            className: "boost-tooltip-bubble",
            style: {
              position: "absolute",
              zIndex: 1e3,
              backgroundColor: "#0f172a",
              color: "#f8fafc",
              border: "1px solid rgba(255, 255, 255, 0.15)",
              padding: "5px 10px",
              borderRadius: "6px",
              fontSize: "12px",
              fontWeight: 500,
              whiteSpace: typeof content === "string" && content.length < 30 ? "nowrap" : "normal",
              pointerEvents: "none",
              fontFamily: "inherit",
              lineHeight: 1.4,
              textAlign: "center",
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
  children,
  selected = false,
  onClick,
  onDelete,
  avatar,
  className = "",
  style
}) => {
  const content = children !== void 0 ? children : label;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-chip ${selected ? "boost-chip-selected" : ""} ${className}`,
      onClick,
      role: onClick ? "button" : void 0,
      tabIndex: onClick ? 0 : void 0,
      onKeyDown: (e) => {
        if (onClick && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onClick();
        }
      },
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        padding: avatar ? "3px 12px 3px 4px" : "5px 14px",
        borderRadius: "9999px",
        backgroundColor: selected ? "var(--boost-primary, #2563eb)" : "var(--boost-surface-secondary, #f1f5f9)",
        color: selected ? "#ffffff" : "var(--boost-text, #1e293b)",
        border: selected ? "1px solid transparent" : "1px solid var(--boost-border, #e2e8f0)",
        fontSize: "13px",
        fontWeight: 500,
        cursor: onClick ? "pointer" : "default",
        userSelect: "none",
        transition: "all 0.18s cubic-bezier(0.16, 1, 0.3, 1)",
        fontFamily: "inherit",
        lineHeight: 1.4,
        boxShadow: selected ? "0 2px 8px rgba(37, 99, 235, 0.25)" : "none",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-chip:not(.boost-chip-selected) {
          background-color: #1e293b;
          color: #f1f5f9;
          border-color: rgba(255, 255, 255, 0.1);
        }
        .boost-chip:hover {
          filter: brightness(0.97);
        }
        :root[data-theme="dark"] .boost-chip:hover {
          filter: brightness(1.1);
        }
      ` }),
        avatar && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex", borderRadius: "50%", overflow: "hidden" }, children: avatar }),
        /* @__PURE__ */ jsx("span", { children: content }),
        onDelete && /* @__PURE__ */ jsx(
          "span",
          {
            onClick: (e) => {
              e.stopPropagation();
              onDelete();
            },
            role: "button",
            "aria-label": "Delete chip",
            style: {
              display: "inline-flex",
              cursor: "pointer",
              opacity: 0.75,
              marginLeft: "2px",
              transition: "opacity 0.15s ease"
            },
            onMouseEnter: (e) => e.currentTarget.style.opacity = "1",
            onMouseLeave: (e) => e.currentTarget.style.opacity = "0.75",
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
  items = [],
  allowMultiple = false,
  defaultExpanded = [],
  variant = "default",
  className = "",
  style
}) => {
  const [expanded, setExpanded] = React.useState(defaultExpanded);
  const toggleItem = (id) => {
    if (expanded.includes(id)) {
      setExpanded(expanded.filter((item) => item !== id));
    } else {
      setExpanded(allowMultiple ? [...expanded, id] : [id]);
    }
  };
  const handleKeyDown = (e) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(e.key)) return;
    if (!(e.target instanceof HTMLButtonElement) || !e.target.classList.contains("boost-accordion-header")) {
      return;
    }
    const focusableItems = items.filter((i) => !i.disabled);
    if (focusableItems.length === 0) return;
    const currentId = e.target.getAttribute("data-id");
    const currentIndex = focusableItems.findIndex((i) => i.id === currentId);
    if (currentIndex === -1) return;
    let nextIndex = currentIndex;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % focusableItems.length;
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + focusableItems.length) % focusableItems.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = focusableItems.length - 1;
    }
    if (nextIndex !== currentIndex) {
      const nextId = focusableItems[nextIndex].id;
      const btn = document.getElementById(`boost-accordion-header-${nextId}`);
      if (btn) btn.focus();
    }
  };
  const isSeparated = variant === "separated";
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-accordion boost-accordion-${variant} ${className}`,
      onKeyDown: handleKeyDown,
      style: {
        display: "flex",
        flexDirection: "column",
        gap: isSeparated ? "10px" : "0px",
        border: isSeparated ? "none" : "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 12px)",
        overflow: "hidden",
        fontFamily: "inherit",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        .boost-accordion-header {
          background-color: var(--boost-surface, #ffffff);
          color: var(--boost-text, #0f172a);
          transition: background-color 0.18s ease, color 0.18s ease;
        }
        .boost-accordion-header[data-expanded="true"] {
          background-color: var(--boost-surface-hover, #f8fafc);
        }
        .boost-accordion-content {
          background-color: var(--boost-surface, #ffffff);
          color: var(--boost-text-muted, #475569);
          border-top: 1px solid var(--boost-border, #f1f5f9);
        }
        :root[data-theme="dark"] .boost-accordion-header {
          background-color: #1e293b;
          color: #f8fafc;
        }
        :root[data-theme="dark"] .boost-accordion-header[data-expanded="true"] {
          background-color: #243247;
        }
        :root[data-theme="dark"] .boost-accordion-content {
          background-color: #1e293b;
          color: #94a3b8;
          border-top-color: rgba(255, 255, 255, 0.08);
        }
        :root[data-theme="dark"] .boost-accordion {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
      ` }),
        items.map((item, idx) => {
          const isOpen = expanded.includes(item.id);
          const isLast = idx === items.length - 1;
          return /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                borderBottom: !isSeparated && !isLast ? "1px solid var(--boost-border, #e2e8f0)" : "none",
                borderRadius: isSeparated ? "10px" : void 0,
                border: isSeparated ? "1px solid var(--boost-border, #e2e8f0)" : void 0,
                overflow: "hidden"
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "button",
                  {
                    type: "button",
                    id: `boost-accordion-header-${item.id}`,
                    "data-id": item.id,
                    disabled: item.disabled,
                    onClick: () => toggleItem(item.id),
                    "aria-expanded": isOpen,
                    "aria-controls": isOpen ? `boost-accordion-content-${item.id}` : void 0,
                    "data-expanded": isOpen,
                    className: "boost-accordion-header",
                    style: {
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "14px 18px",
                      border: "none",
                      textAlign: "left",
                      cursor: item.disabled ? "not-allowed" : "pointer",
                      opacity: item.disabled ? 0.5 : 1,
                      fontFamily: "inherit",
                      fontWeight: 600,
                      fontSize: "14px"
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
                            transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
                            color: "var(--boost-text-muted, #64748b)",
                            flexShrink: 0,
                            marginLeft: "8px"
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
                    id: `boost-accordion-content-${item.id}`,
                    role: "region",
                    "aria-labelledby": `boost-accordion-header-${item.id}`,
                    className: "boost-accordion-content",
                    style: {
                      padding: "14px 18px",
                      fontSize: "13.5px",
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
      ]
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
  style,
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
        userSelect: "none",
        ...style
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
  className = "",
  style,
  closeOnOverlayClick = true,
  showCloseButton = true
}) => {
  const modalRef = React.useRef(null);
  useFocusTrap(modalRef, isOpen);
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
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: modalRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title ? "boost-modal-title" : void 0,
      "aria-describedby": description ? "boost-modal-desc" : void 0,
      className: `boost-modal-backdrop ${className}`,
      onClick: (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.72)",
        backdropFilter: "blur(10px)",
        WebkitBackdropFilter: "blur(10px)",
        zIndex: 1e3,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "clamp(12px, 3vw, 24px)",
        fontFamily: "inherit",
        boxSizing: "border-box",
        animation: "boost-modal-fade 0.2s ease-out"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          @keyframes boost-modal-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-modal-scale {
            from { opacity: 0; transform: scale(0.95) translateY(10px); }
            to { opacity: 1; transform: scale(1) translateY(0); }
          }
          :root[data-theme="dark"] .boost-modal-card {
            background-color: #0f172a !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 25px 60px -15px rgba(0, 0, 0, 0.8) !important;
          }
          :root[data-theme="dark"] .boost-modal-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-modal-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-modal-desc {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-modal-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-modal-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-modal-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.1) !important;
            color: #f8fafc !important;
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-modal-card",
            onClick: (e) => e.stopPropagation(),
            style: {
              width: "100%",
              maxWidth: `min(${getWidth()}, calc(100vw - 24px))`,
              backgroundColor: "var(--boost-surface, #ffffff)",
              borderRadius: "var(--boost-radius, 18px)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              boxShadow: "var(--boost-shadow-lg, 0 25px 50px -12px rgba(0, 0, 0, 0.25))",
              display: "flex",
              flexDirection: "column",
              maxHeight: "min(90vh, 850px)",
              overflow: "hidden",
              animation: "boost-modal-scale 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              ...style
            },
            children: [
              (title || description) && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "boost-modal-header",
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
                      title && /* @__PURE__ */ jsx("h3", { id: "boost-modal-title", className: "boost-modal-title", style: { margin: 0, fontSize: "clamp(17px, 2.5vw, 20px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", letterSpacing: "-0.01em" }, children: title }),
                      description && /* @__PURE__ */ jsx("p", { id: "boost-modal-desc", className: "boost-modal-desc", style: { margin: "4px 0 0 0", fontSize: "13px", color: "var(--boost-muted, #64748b)", lineHeight: 1.4 }, children: description })
                    ] }),
                    showCloseButton && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close modal",
                        className: "boost-modal-close-btn",
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
                        children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
                          /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                          /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                        ] })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "boost-modal-body", style: { padding: "clamp(18px, 3.5vw, 28px)", overflowY: "auto", flex: 1, color: "var(--boost-text, #334155)", fontSize: "14px", lineHeight: 1.6 }, children }),
              footer && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "boost-modal-footer",
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
      ]
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
  placement,
  position,
  size = "380px",
  children,
  footer,
  className = "",
  style,
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  const effectivePlacement = position || placement || "right";
  const drawerRef = React.useRef(null);
  useFocusTrap(drawerRef, isOpen);
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
    switch (effectivePlacement) {
      case "left":
        return {
          top: 0,
          bottom: 0,
          left: 0,
          width: `min(${size}, 100vw)`,
          borderRight: "1px solid var(--boost-border, #e2e8f0)",
          animation: "boost-drawer-slide-left 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        };
      case "top":
        return {
          top: 0,
          left: 0,
          right: 0,
          height: `min(${size}, 100vh)`,
          borderBottom: "1px solid var(--boost-border, #e2e8f0)",
          animation: "boost-drawer-slide-top 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        };
      case "bottom":
        return {
          bottom: 0,
          left: 0,
          right: 0,
          height: `min(${size}, 100vh)`,
          borderTop: "1px solid var(--boost-border, #e2e8f0)",
          animation: "boost-drawer-slide-bottom 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        };
      case "right":
      default:
        return {
          top: 0,
          bottom: 0,
          right: 0,
          width: `min(${size}, 100vw)`,
          borderLeft: "1px solid var(--boost-border, #e2e8f0)",
          animation: "boost-drawer-slide-right 0.28s cubic-bezier(0.16, 1, 0.3, 1)"
        };
    }
  };
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(
    "div",
    {
      ref: drawerRef,
      role: "dialog",
      "aria-modal": "true",
      "aria-labelledby": title ? "boost-drawer-title" : void 0,
      className: `boost-drawer-backdrop ${className}`,
      onClick: (e) => {
        if (e.target === e.currentTarget && closeOnOverlayClick) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1e3,
        fontFamily: "inherit",
        animation: "boost-drawer-fade 0.2s ease-out"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          @keyframes boost-drawer-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-drawer-slide-right {
            from { transform: translateX(100%); }
            to { transform: translateX(0); }
          }
          @keyframes boost-drawer-slide-left {
            from { transform: translateX(-100%); }
            to { transform: translateX(0); }
          }
          @keyframes boost-drawer-slide-top {
            from { transform: translateY(-100%); }
            to { transform: translateY(0); }
          }
          @keyframes boost-drawer-slide-bottom {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          :root[data-theme="dark"] .boost-drawer-panel {
            background-color: #0f172a !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
          }
          :root[data-theme="dark"] .boost-drawer-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-drawer-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-drawer-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-drawer-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-drawer-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-drawer-panel",
            onClick: (e) => e.stopPropagation(),
            style: {
              position: "absolute",
              backgroundColor: "var(--boost-surface, #ffffff)",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxSizing: "border-box",
              ...getPositionStyles(),
              ...style
            },
            children: [
              title && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "boost-drawer-header",
                  style: {
                    padding: "16px 20px",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between"
                  },
                  children: [
                    /* @__PURE__ */ jsx("h3", { id: "boost-drawer-title", className: "boost-drawer-title", style: { margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--boost-text, #0f172a)" }, children: title }),
                    showCloseButton && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close drawer",
                        className: "boost-drawer-close-btn",
                        style: {
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--boost-muted, #64748b)",
                          padding: "6px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease"
                        },
                        children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
                          /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                          /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                        ] })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "boost-drawer-body", style: { padding: "20px", overflowY: "auto", flex: 1, color: "var(--boost-text, #334155)" }, children }),
              footer && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "boost-drawer-footer",
                  style: {
                    padding: "14px 20px",
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
      ]
    }
  ) });
};
Drawer.displayName = "Drawer";
var BottomSheet = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxHeight = "85vh",
  className = "",
  style,
  dragHandle = true,
  showCloseButton = true,
  closeOnOverlayClick = true
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
  return /* @__PURE__ */ jsx(Portal, { children: /* @__PURE__ */ jsxs(
    "div",
    {
      role: "dialog",
      "aria-modal": "true",
      className: `boost-bottom-sheet-backdrop ${className}`,
      onClick: () => {
        if (closeOnOverlayClick) onClose();
      },
      style: {
        position: "fixed",
        inset: 0,
        backgroundColor: "rgba(0, 0, 0, 0.65)",
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        zIndex: 1e3,
        display: "flex",
        alignItems: "flex-end",
        justifyContent: "center",
        fontFamily: "inherit",
        animation: "boost-sheet-fade 0.2s ease-out"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          @keyframes boost-sheet-fade {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes boost-sheet-up {
            from { transform: translateY(100%); }
            to { transform: translateY(0); }
          }
          :root[data-theme="dark"] .boost-bottom-sheet-panel {
            background-color: #0f172a !important;
            border-top-color: rgba(255, 255, 255, 0.1) !important;
            border-left-color: rgba(255, 255, 255, 0.1) !important;
            border-right-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 -10px 40px rgba(0, 0, 0, 0.6) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-handle {
            background-color: #475569 !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-header {
            border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-title {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-body {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-footer {
            background-color: #090d16 !important;
            border-top-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-bottom-sheet-close-btn:hover {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-bottom-sheet-panel",
            onClick: (e) => e.stopPropagation(),
            style: {
              width: "100%",
              maxWidth: "640px",
              maxHeight,
              backgroundColor: "var(--boost-surface, #ffffff)",
              borderRadius: "24px 24px 0 0",
              borderTop: "1px solid var(--boost-border, #e2e8f0)",
              borderLeft: "1px solid var(--boost-border, #e2e8f0)",
              borderRight: "1px solid var(--boost-border, #e2e8f0)",
              boxShadow: "0 -15px 35px rgba(0, 0, 0, 0.2)",
              display: "flex",
              flexDirection: "column",
              overflow: "hidden",
              boxSizing: "border-box",
              animation: "boost-sheet-up 0.28s cubic-bezier(0.16, 1, 0.3, 1)",
              ...style
            },
            children: [
              dragHandle && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", padding: "12px 0 4px", cursor: "grab" }, children: /* @__PURE__ */ jsx("div", { className: "boost-bottom-sheet-handle", style: { width: "40px", height: "4px", backgroundColor: "#cbd5e1", borderRadius: "9999px", transition: "background-color 0.2s ease" } }) }),
              title && /* @__PURE__ */ jsxs(
                "div",
                {
                  className: "boost-bottom-sheet-header",
                  style: {
                    padding: "8px 20px 14px",
                    borderBottom: "1px solid var(--boost-border, #f1f5f9)",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  },
                  children: [
                    /* @__PURE__ */ jsx("h3", { className: "boost-bottom-sheet-title", style: { margin: 0, fontSize: "16px", fontWeight: 700, color: "var(--boost-text, #0f172a)" }, children: title }),
                    showCloseButton && /* @__PURE__ */ jsx(
                      "button",
                      {
                        type: "button",
                        onClick: onClose,
                        "aria-label": "Close sheet",
                        className: "boost-bottom-sheet-close-btn",
                        style: {
                          background: "none",
                          border: "none",
                          color: "var(--boost-muted, #94a3b8)",
                          cursor: "pointer",
                          padding: "6px",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          transition: "all 0.15s ease"
                        },
                        children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", children: [
                          /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                          /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                        ] })
                      }
                    )
                  ]
                }
              ),
              /* @__PURE__ */ jsx("div", { className: "boost-bottom-sheet-body", style: { padding: "20px", overflowY: "auto", flex: 1, color: "var(--boost-text, #334155)" }, children }),
              footer && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "boost-bottom-sheet-footer",
                  style: {
                    padding: "14px 20px",
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
      ]
    }
  ) });
};
BottomSheet.displayName = "BottomSheet";
var Popover = ({
  trigger,
  content,
  placement = "bottom-left",
  isOpen: controlledOpen,
  onOpenChange,
  className = "",
  style,
  contentStyle,
  showArrow = true
}) => {
  const [internalOpen, setInternalOpen] = React.useState(false);
  const popoverRef = React.useRef(null);
  const isControlled = controlledOpen !== void 0;
  const open = isControlled ? controlledOpen : internalOpen;
  const setOpen = (nextOpen) => {
    if (!isControlled) {
      setInternalOpen(nextOpen);
    }
    onOpenChange?.(nextOpen);
  };
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
  React.useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open]);
  const getPositionStyles = () => {
    switch (placement) {
      case "bottom-right":
        return { top: "calc(100% + 8px)", right: 0 };
      case "top-left":
        return { bottom: "calc(100% + 8px)", left: 0 };
      case "top-right":
        return { bottom: "calc(100% + 8px)", right: 0 };
      case "top":
        return { bottom: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" };
      case "bottom":
        return { top: "calc(100% + 8px)", left: "50%", transform: "translateX(-50%)" };
      case "bottom-left":
      default:
        return { top: "calc(100% + 8px)", left: 0 };
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: popoverRef,
      className: `boost-popover-wrapper ${className}`,
      style: { position: "relative", display: "inline-flex", ...style },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        .boost-popover-panel {
          background-color: var(--boost-surface, #ffffff);
          border: 1px solid var(--boost-border, #e2e8f0);
          color: var(--boost-text, #0f172a);
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          border-radius: 12px;
          animation: boostPopoverIn 0.18s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          max-width: min(380px, calc(100vw - 24px));
          box-sizing: border-box;
        }
        :root[data-theme="dark"] .boost-popover-panel {
          background-color: #1e293b;
          border-color: rgba(255, 255, 255, 0.12);
          color: #f8fafc;
          box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.5), 0 8px 10px -6px rgba(0, 0, 0, 0.5);
        }
        @keyframes boostPopoverIn {
          from {
            opacity: 0;
            transform: scale(0.96) translateY(placement?.startsWith('top') ? 4px : -4px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
      ` }),
        /* @__PURE__ */ jsx(
          "div",
          {
            onClick: () => setOpen(!open),
            role: "button",
            tabIndex: 0,
            "aria-haspopup": "dialog",
            "aria-expanded": open,
            onKeyDown: (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                setOpen(!open);
              }
            },
            style: { display: "inline-flex", cursor: "pointer" },
            children: trigger
          }
        ),
        open && /* @__PURE__ */ jsxs(
          "div",
          {
            role: "dialog",
            className: "boost-popover-panel",
            style: {
              position: "absolute",
              zIndex: 1e3,
              padding: "12px 14px",
              minWidth: "220px",
              fontFamily: "inherit",
              ...getPositionStyles(),
              ...contentStyle
            },
            children: [
              showArrow && /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    position: "absolute",
                    width: "8px",
                    height: "8px",
                    transform: "rotate(45deg)",
                    backgroundColor: "inherit",
                    borderLeft: placement.startsWith("bottom") ? "1px solid var(--boost-border, #e2e8f0)" : "none",
                    borderTop: placement.startsWith("bottom") ? "1px solid var(--boost-border, #e2e8f0)" : "none",
                    borderRight: placement.startsWith("top") ? "1px solid var(--boost-border, #e2e8f0)" : "none",
                    borderBottom: placement.startsWith("top") ? "1px solid var(--boost-border, #e2e8f0)" : "none",
                    ...placement === "bottom-left" ? { top: "-5px", left: "16px" } : {},
                    ...placement === "bottom-right" ? { top: "-5px", right: "16px" } : {},
                    ...placement === "bottom" ? { top: "-5px", left: "calc(50% - 4px)" } : {},
                    ...placement === "top-left" ? { bottom: "-5px", left: "16px" } : {},
                    ...placement === "top-right" ? { bottom: "-5px", right: "16px" } : {},
                    ...placement === "top" ? { bottom: "-5px", left: "calc(50% - 4px)" } : {}
                  }
                }
              ),
              content
            ]
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
  confirmVariant,
  isLoading = false,
  className = "",
  style
}) => {
  const activeVariant = confirmVariant || variant;
  const isDestructive = activeVariant === "danger" || activeVariant === "destructive";
  const isWarning = activeVariant === "warning";
  const getButtonVariant = () => {
    if (isDestructive) return "destructive";
    return "primary";
  };
  return /* @__PURE__ */ jsx(
    Modal,
    {
      isOpen,
      onClose,
      title: "",
      size: "sm",
      className,
      style,
      footer: /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "flex-end", gap: "10px", width: "100%" }, children: [
        /* @__PURE__ */ jsx(Button, { variant: "outline", size: "sm", onClick: onClose, disabled: isLoading, children: cancelText }),
        /* @__PURE__ */ jsx(
          Button,
          {
            variant: getButtonVariant(),
            size: "sm",
            onClick: onConfirm,
            isLoading,
            style: isWarning ? { backgroundColor: "#d97706", borderColor: "#d97706", color: "#ffffff" } : void 0,
            children: confirmText
          }
        )
      ] }),
      children: /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "14px", alignItems: "flex-start" }, children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              width: "40px",
              height: "40px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              backgroundColor: isDestructive ? "rgba(239, 68, 68, 0.12)" : isWarning ? "rgba(245, 158, 11, 0.12)" : "rgba(59, 130, 246, 0.12)",
              color: isDestructive ? "#ef4444" : isWarning ? "#d97706" : "#2563eb"
            },
            children: isDestructive ? /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", children: [
              /* @__PURE__ */ jsx("path", { d: "M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "9", x2: "12", y2: "13" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "17", x2: "12.01", y2: "17" })
            ] }) : isWarning ? /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
            ] }) : /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", children: [
              /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12", y2: "12" }),
              /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12.01", y2: "8" })
            ] })
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0 }, children: [
          /* @__PURE__ */ jsx(
            "h3",
            {
              style: {
                margin: "0 0 6px",
                fontSize: "16px",
                fontWeight: 700,
                color: "var(--boost-text, #0f172a)",
                letterSpacing: "-0.01em"
              },
              children: title
            }
          ),
          /* @__PURE__ */ jsx(
            "p",
            {
              style: {
                margin: 0,
                fontSize: "13.5px",
                color: "var(--boost-text-muted, #64748b)",
                lineHeight: 1.55
              },
              children: message
            }
          )
        ] })
      ] })
    }
  );
};
ConfirmationDialog.displayName = "ConfirmationDialog";
var CommandPalette = ({
  isOpen = false,
  onClose = () => {
  },
  items = [],
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
var Box = /* @__PURE__ */ React.forwardRef(
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
var Flex = /* @__PURE__ */ React.forwardRef(
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
var Grid = /* @__PURE__ */ React.forwardRef(
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
var GridItem = /* @__PURE__ */ React.forwardRef(
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
var Section = /* @__PURE__ */ React.forwardRef(
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
var AspectRatio = /* @__PURE__ */ React.forwardRef(
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
var ScrollArea = /* @__PURE__ */ React.forwardRef(
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
var keyframesStyle = `
  @keyframes boost-spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  @keyframes boost-pulse {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.8; transform: scale(0.95); }
  }
  @keyframes boost-bounce {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-8px); }
  }
  @keyframes boost-shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;
var Motion = ({
  animation = "fade-in",
  duration = 500,
  delay = 0,
  ease,
  triggerOnce = true,
  viewportThreshold = 0.1,
  children,
  style,
  className = "",
  ...props
}) => {
  const ref = React.useRef(null);
  const [inView, setInView] = React.useState(false);
  const isContinuous = ["spin", "pulse", "shimmer", "bounce"].includes(animation);
  React.useEffect(() => {
    if (isContinuous) return;
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
  }, [triggerOnce, viewportThreshold, isContinuous]);
  const getMotionStyle = () => {
    if (animation === "spin") {
      return {
        animation: `boost-spin ${duration}ms linear infinite`
      };
    }
    if (animation === "pulse") {
      return {
        animation: `boost-pulse ${duration * 2}ms cubic-bezier(0.4, 0, 0.6, 1) infinite`
      };
    }
    if (animation === "bounce") {
      return {
        animation: `boost-bounce ${duration * 2}ms ease-in-out infinite`
      };
    }
    if (animation === "shimmer") {
      return {
        backgroundImage: "linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.15) 50%, rgba(255,255,255,0) 100%)",
        backgroundSize: "200% 100%",
        animation: `boost-shimmer ${duration * 3}ms infinite`
      };
    }
    const easingMap = {
      spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      smooth: "cubic-bezier(0.16, 1, 0.3, 1)",
      "ease-out": "cubic-bezier(0, 0, 0.2, 1)",
      linear: "linear"
    };
    const chosenEasing = ease && easingMap[ease] ? easingMap[ease] : animation === "spring-pop" ? easingMap.spring : easingMap.smooth;
    const transition = `opacity ${duration}ms ${chosenEasing} ${delay}ms, transform ${duration}ms ${chosenEasing} ${delay}ms`;
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
      case "spring-pop":
        transform = "scale(0.82)";
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: keyframesStyle }),
    /* @__PURE__ */ jsx(
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
    )
  ] });
};
Motion.displayName = "Motion";
var Header = ({
  logo,
  brandName,
  brandBadge,
  navLinks,
  links,
  activeHref,
  onLinkClick,
  actions,
  searchBar,
  sticky = true,
  className = "",
  style,
  renderMobileMenu
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const effectiveLinks = navLinks || links || [];
  const handleLinkClick = (href, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(href);
    }
    setMobileMenuOpen(false);
  };
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-header {
          background-color: rgba(15, 23, 42, 0.9) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4) !important;
        }
        :root[data-theme="dark"] .boost-header .boost-brand-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-header .boost-nav-link {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-header .boost-nav-link:hover,
        :root[data-theme="dark"] .boost-header .boost-nav-link.is-active {
          color: #f8fafc !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
        }
        :root[data-theme="dark"] .boost-header .boost-hamburger-btn {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer {
          background-color: rgba(15, 23, 42, 0.98) !important;
          border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link:hover,
        :root[data-theme="dark"] .boost-header-mobile-drawer .boost-mobile-nav-link.is-active {
          color: #818cf8 !important;
          background-color: rgba(99, 102, 241, 0.12) !important;
        }

        @container (max-width: 768px) {
          .boost-desktop-nav-group {
            display: none !important;
          }
          .boost-hamburger-btn {
            display: inline-flex !important;
          }
        }
        @media (max-width: 768px) {
          .boost-header .boost-desktop-nav-group {
            display: none !important;
          }
          .boost-header .boost-hamburger-btn {
            display: inline-flex !important;
          }
        }
        @media (min-width: 769px) {
          .boost-header .boost-hamburger-btn {
            display: none;
          }
          .boost-header-mobile-drawer {
            display: none;
          }
        }
      ` }),
    /* @__PURE__ */ jsxs(
      "header",
      {
        className: `boost-header ${className}`,
        style: {
          containerType: "inline-size",
          position: sticky ? "sticky" : "relative",
          top: 0,
          zIndex: 40,
          backgroundColor: "var(--boost-glass-bg, rgba(255, 255, 255, 0.92))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderBottom: "1px solid var(--boost-border, rgba(226, 232, 240, 0.8))",
          padding: "0 clamp(16px, 3.5vw, 28px)",
          height: "64px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          fontFamily: "inherit",
          boxSizing: "border-box",
          boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.03))",
          transition: "all 0.2s ease",
          ...style
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            logo ? /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center" }, children: logo }) : /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: "32px",
                  height: "32px",
                  borderRadius: "8px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: 800,
                  fontSize: "16px",
                  boxShadow: "0 2px 8px rgba(79, 70, 229, 0.3)"
                },
                children: "\u26A1"
              }
            ),
            (brandName || !logo && !brandName) && /* @__PURE__ */ jsx(
              "span",
              {
                className: "boost-brand-title",
                style: {
                  fontSize: "18px",
                  fontWeight: 700,
                  color: "var(--boost-text, #0f172a)",
                  letterSpacing: "-0.02em",
                  lineHeight: 1.2
                },
                children: brandName || "Brand"
              }
            ),
            brandBadge && /* @__PURE__ */ jsx(
              "span",
              {
                style: {
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  padding: "2px 8px",
                  borderRadius: "9999px",
                  background: "linear-gradient(135deg, rgba(99, 102, 241, 0.18), rgba(59, 130, 246, 0.18))",
                  color: "var(--boost-primary, #6366f1)",
                  border: "1px solid rgba(99, 102, 241, 0.3)",
                  textTransform: "uppercase"
                },
                children: brandBadge
              }
            )
          ] }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "boost-desktop-nav-group",
              style: {
                display: "flex",
                alignItems: "center",
                gap: "24px",
                flex: 1,
                justifyContent: "center",
                maxWidth: "640px"
              },
              children: [
                searchBar && /* @__PURE__ */ jsx("div", { style: { width: "100%", maxWidth: "280px" }, children: searchBar }),
                effectiveLinks.length > 0 && /* @__PURE__ */ jsx("nav", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: effectiveLinks.map((link, idx) => {
                  const isActive = link.active || (activeHref ? activeHref === link.href : false);
                  return /* @__PURE__ */ jsxs(
                    "a",
                    {
                      href: link.href,
                      onClick: (e) => handleLinkClick(link.href, e),
                      className: `boost-nav-link ${isActive ? "is-active" : ""}`,
                      style: {
                        textDecoration: "none",
                        fontSize: "14px",
                        fontWeight: isActive ? 600 : 500,
                        color: isActive ? "var(--boost-primary, #4f46e5)" : "var(--boost-text-muted, #475569)",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        transition: "all 0.15s ease",
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px"
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { children: link.label }),
                        link.badge !== void 0 && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "10px",
                              fontWeight: 700,
                              backgroundColor: "rgba(99, 102, 241, 0.15)",
                              color: "var(--boost-primary, #4f46e5)",
                              padding: "1px 6px",
                              borderRadius: "9999px"
                            },
                            children: link.badge
                          }
                        )
                      ]
                    },
                    idx
                  );
                }) })
              ]
            }
          ),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "10px" }, children: [
            actions && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: actions }),
            /* @__PURE__ */ jsx(
              "button",
              {
                type: "button",
                "aria-label": "Toggle navigation menu",
                onClick: () => setMobileMenuOpen(!mobileMenuOpen),
                className: "boost-hamburger-btn",
                style: {
                  display: "none",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "8px",
                  borderRadius: "8px",
                  color: "var(--boost-text, #0f172a)",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "background-color 0.15s ease"
                },
                children: mobileMenuOpen ? /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                  /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
                  /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
                ] }) : /* @__PURE__ */ jsxs("svg", { width: "22", height: "22", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
                  /* @__PURE__ */ jsx("line", { x1: "4", y1: "7", x2: "20", y2: "7" }),
                  /* @__PURE__ */ jsx("line", { x1: "4", y1: "12", x2: "20", y2: "12" }),
                  /* @__PURE__ */ jsx("line", { x1: "4", y1: "17", x2: "20", y2: "17" })
                ] })
              }
            )
          ] })
        ]
      }
    ),
    mobileMenuOpen && /* @__PURE__ */ jsx(
      "div",
      {
        className: "boost-header-mobile-drawer",
        style: {
          backgroundColor: "var(--boost-surface, #ffffff)",
          borderBottom: "1px solid var(--boost-border, #e2e8f0)",
          boxShadow: "0 12px 28px rgba(0, 0, 0, 0.12)",
          padding: "16px 20px",
          display: "flex",
          flexDirection: "column",
          gap: "8px",
          animation: "boost-slideDown 0.2s ease",
          position: sticky ? "sticky" : "relative",
          top: sticky ? "64px" : void 0,
          zIndex: 39
        },
        children: renderMobileMenu ? renderMobileMenu({
          isOpen: mobileMenuOpen,
          onClose: () => setMobileMenuOpen(false),
          links: effectiveLinks
        }) : /* @__PURE__ */ jsxs(Fragment, { children: [
          searchBar && /* @__PURE__ */ jsx("div", { style: { marginBottom: "8px" }, children: searchBar }),
          effectiveLinks.map((link, idx) => {
            const isActive = link.active || (activeHref ? activeHref === link.href : false);
            return /* @__PURE__ */ jsxs(
              "a",
              {
                href: link.href,
                onClick: (e) => handleLinkClick(link.href, e),
                className: `boost-mobile-nav-link ${isActive ? "is-active" : ""}`,
                style: {
                  textDecoration: "none",
                  fontSize: "15px",
                  fontWeight: 600,
                  color: isActive ? "var(--boost-primary, #4f46e5)" : "var(--boost-text, #1e293b)",
                  padding: "10px 14px",
                  borderRadius: "8px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  transition: "all 0.15s ease"
                },
                children: [
                  /* @__PURE__ */ jsx("span", { children: link.label }),
                  link.badge !== void 0 && /* @__PURE__ */ jsx(
                    "span",
                    {
                      style: {
                        fontSize: "11px",
                        fontWeight: 700,
                        backgroundColor: "rgba(99, 102, 241, 0.15)",
                        color: "var(--boost-primary, #4f46e5)",
                        padding: "2px 8px",
                        borderRadius: "9999px"
                      },
                      children: link.badge
                    }
                  )
                ]
              },
              idx
            );
          }),
          actions && /* @__PURE__ */ jsx("div", { style: { borderTop: "1px solid var(--boost-border, #e2e8f0)", paddingTop: "14px", marginTop: "6px", display: "flex", gap: "10px", flexWrap: "wrap" }, children: actions })
        ] })
      }
    )
  ] });
};
Header.displayName = "Header";
var Navbar = ({
  brandName = "BoostStore",
  logo,
  logoUrl,
  brandBadge,
  navLinks = [
    { label: "Shop All", href: "/products" },
    { label: "Best Sellers", href: "/collections/bestsellers", badge: "HOT" },
    { label: "New Arrivals", href: "/collections/new" },
    { label: "Sale", href: "/collections/sale", isHighlight: true }
  ],
  activeHref,
  searchPlaceholder = "Search for products, brands...",
  searchValue,
  onSearchChange,
  onSearchSubmit,
  showSearch = true,
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
  actions,
  className = "",
  style
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
        transition: "background-color 0.2s ease, border-color 0.2s ease",
        ...style
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
        :root[data-theme="dark"] .boost-navbar {
          background-color: rgba(15, 23, 42, 0.92) !important;
          border-bottom-color: rgba(255, 255, 255, 0.08) !important;
        }
        :root[data-theme="dark"] .boost-navbar input {
          background-color: rgba(30, 41, 59, 0.8) !important;
          color: #f8fafc !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor:hover,
        :root[data-theme="dark"] .boost-navbar .boost-nav-link-anchor.is-active {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-mobile-search-bar {
          background-color: #0f172a !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        :root[data-theme="dark"] .boost-navbar .boost-navbar-mobile-drawer {
          background-color: rgba(15, 23, 42, 0.98) !important;
          border-top-color: rgba(255, 255, 255, 0.1) !important;
        }
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
                    children: logo ? /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center" }, children: logo }) : logoUrl ? /* @__PURE__ */ jsx("img", { src: logoUrl, alt: brandName, style: { height: "32px", width: "auto" } }) : /* @__PURE__ */ jsxs(
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
                          brandName,
                          brandBadge && /* @__PURE__ */ jsx(
                            "span",
                            {
                              style: {
                                fontSize: "10px",
                                fontWeight: 800,
                                backgroundColor: "rgba(37, 99, 235, 0.12)",
                                color: "var(--boost-primary, #2563eb)",
                                padding: "2px 7px",
                                borderRadius: "6px",
                                letterSpacing: "0.02em"
                              },
                              children: brandBadge
                            }
                          )
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
                ),
                actions && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: actions })
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
  groups = [],
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-sidebar,
          .dark .boost-sidebar {
            background-color: var(--boost-surface, #1e293b) !important;
            border-right-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-sidebar .sidebar-nav-item,
          .dark .boost-sidebar .sidebar-nav-item {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-sidebar .sidebar-nav-item:hover,
          .dark .boost-sidebar .sidebar-nav-item:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
            color: #ffffff !important;
          }
          :root[data-theme="dark"] .boost-sidebar .sidebar-nav-item.active,
          .dark .boost-sidebar .sidebar-nav-item.active {
            background-color: rgba(99, 102, 241, 0.15) !important;
            color: #818cf8 !important;
          }
        ` }),
        header && /* @__PURE__ */ jsx("div", { style: { padding: "16px", borderBottom: "1px solid var(--boost-border, #f1f5f9)" }, children: header }),
        /* @__PURE__ */ jsx("div", { style: { flex: 1, overflowY: "auto", padding: "12px 8px", display: "flex", flexDirection: "column", gap: "16px" }, children: groups.map((grp, gIdx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "4px" }, children: [
          grp.title && !collapsed && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", fontWeight: 600, color: "var(--boost-text-muted, #94a3b8)", textTransform: "uppercase", padding: "4px 12px", letterSpacing: "0.05em" }, children: grp.title }),
          grp.items.map((item) => {
            const isActive = item.id === activeId;
            return /* @__PURE__ */ jsxs(
              "div",
              {
                className: `sidebar-nav-item ${isActive ? "active" : ""}`,
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
var resolveSocialIcon = (nameOrPlatform) => {
  const key = (nameOrPlatform || "").toLowerCase();
  if (key.includes("insta")) {
    return /* @__PURE__ */ jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("rect", { width: "20", height: "20", x: "2", y: "2", rx: "5", ry: "5" }),
      /* @__PURE__ */ jsx("path", { d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" }),
      /* @__PURE__ */ jsx("line", { x1: "17.5", x2: "17.51", y1: "6.5", y2: "6.5" })
    ] });
  }
  if (key.includes("twitter") || key.includes("x")) {
    return /* @__PURE__ */ jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("path", { d: "M4 4l11.733 16h4.267l-11.733 -16z" }),
      /* @__PURE__ */ jsx("path", { d: "M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" })
    ] });
  }
  if (key.includes("youtube")) {
    return /* @__PURE__ */ jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
      /* @__PURE__ */ jsx("path", { d: "M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" }),
      /* @__PURE__ */ jsx("polygon", { points: "9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02" })
    ] });
  }
  if (key.includes("github")) {
    return /* @__PURE__ */ jsx("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" }) });
  }
  return /* @__PURE__ */ jsxs("svg", { width: "17", height: "17", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
    /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
    /* @__PURE__ */ jsx("line", { x1: "2", y1: "12", x2: "22", y2: "12" }),
    /* @__PURE__ */ jsx("path", { d: "M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" })
  ] });
};
var Footer = ({
  logo,
  brandName = "BoostStore",
  brandBadge,
  description = "Modern direct-to-consumer store delivering premium quality essentials straight to your doorstep.",
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
  socialLinks,
  bottomLinks = [
    { label: "Privacy Notice", href: "/privacy" },
    { label: "Terms of Use", href: "/terms" },
    { label: "Security", href: "/security" },
    { label: "Sitemap", href: "/sitemap" }
  ],
  newsletter = true,
  onNewsletterSubmit,
  showPaymentBadges = true,
  paymentMethods = ["VISA", "Mastercard", "AMEX", "Apple Pay", "Google Pay", "PayPal"],
  copyrightYear = (/* @__PURE__ */ new Date()).getFullYear(),
  copyrightText,
  variant = "dark",
  className = "",
  style
}) => {
  const [email, setEmail] = React.useState("");
  const [subscribed, setSubscribed] = React.useState(false);
  const [emailError, setEmailError] = React.useState(null);
  const [openMobileColumns, setOpenMobileColumns] = React.useState({});
  const toggleMobileColumn = (idx) => {
    setOpenMobileColumns((prev) => ({ ...prev, [idx]: !prev[idx] }));
  };
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
  const footerBg = isLight ? "#f8fafc" : isSurface ? "var(--boost-surface, #ffffff)" : "#07090e";
  const footerText = isLight ? "#475569" : isSurface ? "var(--boost-text-muted, #64748b)" : "#94a3b8";
  const headingColor = isLight ? "#0f172a" : isSurface ? "var(--boost-text, #0f172a)" : "#f8fafc";
  const borderColor = isLight ? "var(--boost-border, #e2e8f0)" : isSurface ? "var(--boost-border, #e2e8f0)" : "rgba(255, 255, 255, 0.08)";
  const inputBg = isLight || isSurface ? "var(--boost-bg, #ffffff)" : "rgba(255, 255, 255, 0.06)";
  const inputColor = isLight || isSurface ? "var(--boost-text, #0f172a)" : "#f8fafc";
  const inputBorder = isLight || isSurface ? "var(--boost-border, #cbd5e1)" : "rgba(255, 255, 255, 0.14)";
  const defaultSocials = [
    { name: "Instagram", href: "https://instagram.com" },
    { name: "X / Twitter", href: "https://twitter.com" },
    { name: "YouTube", href: "https://youtube.com" }
  ];
  const socials = socialLinks || defaultSocials;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-footer {
          background-color: #07090e !important;
          border-top-color: rgba(255, 255, 255, 0.08) !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-heading {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-link {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-footer .boost-footer-link:hover {
          color: #60a5fa !important;
        }
        :root[data-theme="dark"] .boost-footer-input {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.14) !important;
          color: #f8fafc !important;
        }

        @container (max-width: 640px) {
          .boost-footer-col-header {
            cursor: pointer !important;
          }
          .boost-footer-col-chevron {
            display: inline-block !important;
          }
        }
        @media (max-width: 640px) {
          .boost-footer-col-header {
            cursor: pointer !important;
          }
          .boost-footer-col-chevron {
            display: inline-block !important;
          }
        }
      ` }),
    /* @__PURE__ */ jsxs(
      "footer",
      {
        className: `boost-footer ${className}`,
        style: {
          containerType: "inline-size",
          backgroundColor: footerBg,
          color: footerText,
          padding: "clamp(40px, 6vw, 64px) clamp(16px, 4vw, 32px) 28px",
          borderTop: `1px solid ${borderColor}`,
          fontSize: "14px",
          boxSizing: "border-box",
          width: "100%",
          transition: "background-color 0.2s ease, color 0.2s ease",
          ...style
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
                      className: "boost-footer-heading",
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
                        logo ? logo : /* @__PURE__ */ jsx(
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
                        brandName,
                        brandBadge && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "10px",
                              fontWeight: 700,
                              letterSpacing: "0.06em",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(59, 130, 246, 0.2))",
                              color: "var(--boost-primary, #6366f1)",
                              border: "1px solid rgba(99, 102, 241, 0.35)",
                              textTransform: "uppercase"
                            },
                            children: brandBadge
                          }
                        )
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx("p", { style: { lineHeight: 1.6, margin: 0, fontSize: "13px", color: footerText }, children: description }),
                  socials.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "10px", marginTop: "4px" }, children: socials.map((s, idx) => /* @__PURE__ */ jsx(
                    "a",
                    {
                      href: s.href,
                      target: "_blank",
                      rel: "noreferrer",
                      "aria-label": s.name || s.platform || "Social Link",
                      style: {
                        width: "34px",
                        height: "34px",
                        borderRadius: "8px",
                        backgroundColor: isLight || isSurface ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.06)",
                        border: `1px solid ${borderColor}`,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: headingColor,
                        textDecoration: "none",
                        transition: "all 0.15s ease"
                      },
                      children: s.icon || resolveSocialIcon(s.platform || s.name)
                    },
                    idx
                  )) }),
                  /* @__PURE__ */ jsxs("div", { style: { marginTop: "10px" }, children: [
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
                            className: "boost-footer-input",
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
                columns.map((col, idx) => {
                  const isOpen = !!openMobileColumns[idx];
                  return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "boost-footer-col-header",
                        onClick: () => toggleMobileColumn(idx),
                        children: [
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
                          /* @__PURE__ */ jsx(
                            "span",
                            {
                              className: "boost-footer-col-chevron",
                              style: {
                                color: footerText,
                                transition: "transform 0.2s ease",
                                transform: isOpen ? "rotate(180deg)" : "rotate(0deg)"
                              },
                              children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
                            }
                          )
                        ]
                      }
                    ),
                    /* @__PURE__ */ jsx(
                      "ul",
                      {
                        className: `boost-footer-column-content ${isOpen ? "is-open" : ""}`,
                        style: {
                          listStyle: "none",
                          padding: 0,
                          margin: 0,
                          flexDirection: "column",
                          gap: "10px"
                        },
                        children: col.links.map((link, lIdx) => /* @__PURE__ */ jsx("li", { children: /* @__PURE__ */ jsx(
                          "a",
                          {
                            href: link.href,
                            className: "boost-footer-link",
                            style: {
                              color: footerText,
                              textDecoration: "none",
                              fontSize: "13px",
                              transition: "color 0.15s ease",
                              display: "inline-block",
                              padding: "2px 0"
                            },
                            children: link.label
                          }
                        ) }, lIdx))
                      }
                    )
                  ] }, idx);
                })
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
                /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx("span", { children: copyrightText || `\xA9 ${copyrightYear} ${brandName}. All rights reserved.` }) }),
                bottomLinks && bottomLinks.length > 0 && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }, children: bottomLinks.map((bl, idx) => /* @__PURE__ */ jsx(
                  "a",
                  {
                    href: bl.href,
                    className: "boost-footer-link",
                    style: { color: footerText, textDecoration: "none", fontSize: "12px" },
                    children: bl.label
                  },
                  idx
                )) }),
                showPaymentBadges && /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }, children: paymentMethods.map((method) => /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      backgroundColor: isLight || isSurface ? "rgba(0, 0, 0, 0.04)" : "rgba(255, 255, 255, 0.06)",
                      border: `1px solid ${borderColor}`,
                      color: headingColor,
                      padding: "3px 8px",
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
    )
  ] });
};
Footer.displayName = "Footer";
var MobileBottomBar = ({
  activeTab,
  defaultActiveTab = "home",
  cartCount = 0,
  wishlistCount = 0,
  items,
  onTabChange,
  showLabels = true,
  activeColor = "#4f46e5",
  variant = "glass",
  className = "",
  style
}) => {
  const [internalActiveTab, setInternalActiveTab] = React.useState(activeTab || defaultActiveTab);
  React.useEffect(() => {
    if (activeTab !== void 0) {
      setInternalActiveTab(activeTab);
    }
  }, [activeTab]);
  const defaultItems = [
    { id: "home", label: "Home", icon: "home", href: "/" },
    { id: "search", label: "Search", icon: "search", href: "/search" },
    { id: "wishlist", label: "Wishlist", icon: "wishlist", badge: wishlistCount > 0 ? wishlistCount : void 0, href: "/wishlist" },
    { id: "cart", label: "Bag", icon: "cart", badge: cartCount > 0 ? cartCount : void 0, href: "/cart" },
    { id: "account", label: "Profile", icon: "account", href: "/account" }
  ];
  const barItems = items || defaultItems;
  const handleItemClick = (id, href) => {
    setInternalActiveTab(id);
    if (onTabChange) {
      onTabChange(id, href);
    }
  };
  const renderIcon = (icon, isActive) => {
    if (typeof icon !== "string") {
      return icon;
    }
    const stroke = "currentColor";
    const strokeWidth = isActive ? "2.3" : "1.8";
    switch (icon) {
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
  const isFloating = variant === "floating";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-mobile-bottom-bar {
          background-color: rgba(15, 23, 42, 0.94) !important;
          border-top-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-mobile-bottom-bar .boost-bottom-btn {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-mobile-bottom-bar .boost-bottom-btn.is-active {
          color: #818cf8 !important;
        }
        :root[data-theme="dark"] .boost-mobile-bottom-bar .boost-badge-cart {
          background-color: #6366f1 !important;
          color: #ffffff !important;
        }
      ` }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: `boost-mobile-bottom-bar ${className}`,
        style: {
          position: "fixed",
          bottom: isFloating ? "12px" : 0,
          left: isFloating ? "16px" : 0,
          right: isFloating ? "16px" : 0,
          margin: isFloating ? "0 auto" : void 0,
          maxWidth: isFloating ? "440px" : void 0,
          borderRadius: isFloating ? "24px" : void 0,
          zIndex: 50,
          backgroundColor: variant === "solid" ? "var(--boost-surface, #ffffff)" : "var(--boost-glass-bg, rgba(255, 255, 255, 0.92))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: isFloating ? "none" : "1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))",
          border: isFloating ? "1px solid var(--boost-border, rgba(226, 232, 240, 0.8))" : void 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: isFloating ? "8px 10px" : "6px 4px calc(6px + env(safe-area-inset-bottom, 8px))",
          boxShadow: isFloating ? "0 12px 30px rgba(0, 0, 0, 0.15)" : "var(--boost-shadow-md, 0 -4px 20px rgba(0, 0, 0, 0.05))",
          fontFamily: "inherit",
          boxSizing: "border-box",
          ...style
        },
        children: barItems.map((item) => {
          const isActive = internalActiveTab === item.id;
          const badgeValue = item.id === "cart" ? cartCount || item.badge : item.id === "wishlist" ? wishlistCount || item.badge : item.badge;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleItemClick(item.id, item.href),
              "aria-label": item.label,
              className: `boost-bottom-btn ${isActive ? "is-active" : ""}`,
              style: {
                position: "relative",
                background: "none",
                border: "none",
                cursor: "pointer",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "3px",
                padding: "4px 8px",
                flex: 1,
                maxWidth: "80px",
                color: isActive ? activeColor : "var(--boost-text-muted, #64748b)",
                transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent"
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
                      padding: "3px 12px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "rgba(99, 102, 241, 0.12)" : "transparent",
                      transition: "background-color 0.2s ease"
                    },
                    children: [
                      renderIcon(item.icon, isActive),
                      Boolean(badgeValue) && /* @__PURE__ */ jsx(
                        "span",
                        {
                          className: item.id === "cart" ? "boost-badge-cart" : "",
                          style: {
                            position: "absolute",
                            top: "-2px",
                            right: "0px",
                            backgroundColor: item.id === "cart" ? "#0f172a" : "#ef4444",
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
                            lineHeight: 1,
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                          },
                          children: badgeValue
                        }
                      )
                    ]
                  }
                ),
                showLabels && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      fontWeight: isActive ? 700 : 500,
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2
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
    )
  ] });
};
MobileBottomBar.displayName = "MobileBottomBar";
var MobileBottomNav = ({
  items = [],
  activeId,
  defaultActiveId,
  onChange,
  showLabels = true,
  activeColor = "#4f46e5",
  variant = "glass",
  className = "",
  style
}) => {
  const [internalActiveId, setInternalActiveId] = React.useState(activeId || defaultActiveId || items[0]?.id);
  React.useEffect(() => {
    if (activeId !== void 0) {
      setInternalActiveId(activeId);
    }
  }, [activeId]);
  const handleItemClick = (id, href) => {
    setInternalActiveId(id);
    if (onChange) {
      onChange(id, href);
    }
  };
  const isFloating = variant === "floating";
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-mobile-bottom-nav {
          background-color: rgba(15, 23, 42, 0.94) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-mobile-nav-btn {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .boost-mobile-nav-btn.is-active {
          color: #818cf8 !important;
        }
        :root[data-theme="dark"] .boost-mobile-nav-btn.is-active .boost-icon-pill {
          background-color: rgba(99, 102, 241, 0.18) !important;
        }
      ` }),
    /* @__PURE__ */ jsx(
      "nav",
      {
        className: `boost-mobile-bottom-nav ${className}`,
        style: {
          position: "fixed",
          bottom: isFloating ? "12px" : 0,
          left: isFloating ? "16px" : 0,
          right: isFloating ? "16px" : 0,
          margin: isFloating ? "0 auto" : void 0,
          maxWidth: isFloating ? "440px" : void 0,
          borderRadius: isFloating ? "24px" : void 0,
          zIndex: 50,
          backgroundColor: variant === "solid" ? "var(--boost-surface, #ffffff)" : "var(--boost-glass-bg, rgba(255, 255, 255, 0.92))",
          backdropFilter: "blur(16px)",
          WebkitBackdropFilter: "blur(16px)",
          borderTop: isFloating ? "none" : "1px solid var(--boost-glass-border, rgba(226, 232, 240, 0.8))",
          border: isFloating ? "1px solid var(--boost-border, rgba(226, 232, 240, 0.8))" : void 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: isFloating ? "8px 10px" : "6px 4px calc(6px + env(safe-area-inset-bottom, 8px))",
          boxShadow: isFloating ? "0 12px 30px rgba(0, 0, 0, 0.15)" : "var(--boost-shadow-md, 0 -4px 20px rgba(0, 0, 0, 0.05))",
          fontFamily: "inherit",
          boxSizing: "border-box",
          ...style
        },
        children: items.map((item) => {
          const isActive = item.id === internalActiveId;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: () => handleItemClick(item.id, item.href),
              className: `boost-mobile-nav-btn ${isActive ? "is-active" : ""}`,
              style: {
                flex: 1,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                background: "none",
                border: "none",
                cursor: "pointer",
                position: "relative",
                padding: "4px 6px",
                color: isActive ? activeColor : "var(--boost-text-muted, #64748b)",
                transition: "all 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
                userSelect: "none",
                WebkitTapHighlightColor: "transparent"
              },
              children: [
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "boost-icon-pill",
                    style: {
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "3px 12px",
                      borderRadius: "999px",
                      backgroundColor: isActive ? "rgba(79, 70, 229, 0.12)" : "transparent",
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
                            right: "0px",
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
                showLabels && /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "10px",
                      fontWeight: isActive ? 700 : 500,
                      marginTop: "2px",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2
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
    )
  ] });
};
MobileBottomNav.displayName = "MobileBottomNav";
var Breadcrumb = ({
  items = [],
  separator,
  onItemClick,
  className = "",
  style
}) => {
  const defaultSeparator = /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", style: { opacity: 0.4, margin: "0 4px", flexShrink: 0 }, children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) });
  return /* @__PURE__ */ jsxs(
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
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-breadcrumb a,
          .dark .boost-breadcrumb a {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-breadcrumb a:hover,
          .dark .boost-breadcrumb a:hover {
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-breadcrumb span[aria-current="page"],
          .dark .boost-breadcrumb span[aria-current="page"] {
            color: #f8fafc !important;
          }
        ` }),
        items.map((item, index) => {
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
      ]
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
        backgroundColor: "var(--boost-bg, #f8fafc)",
        color: "var(--boost-text, #0f172a)",
        fontFamily: "inherit",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-page-wrapper,
          .dark .boost-page-wrapper {
            background-color: var(--boost-bg, #0b0f19) !important;
            color: #f8fafc !important;
          }
        ` }),
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-nav-link,
          .dark .boost-nav-link {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-nav-link:hover,
          .dark .boost-nav-link:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-nav-link.active,
          .dark .boost-nav-link.active {
            color: #818cf8 !important;
            background-color: rgba(99, 102, 241, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-nav-badge,
          .dark .boost-nav-badge {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-nav-badge.active,
          .dark .boost-nav-badge.active {
            background-color: rgba(99, 102, 241, 0.25) !important;
            color: #a5b4fc !important;
          }
        ` }),
    /* @__PURE__ */ jsxs(
      "a",
      {
        href,
        className: `boost-nav-link ${activeState ? "active" : ""} ${className}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          borderRadius: "var(--boost-radius, 8px)",
          textDecoration: "none",
          fontSize: "14px",
          fontWeight: activeState ? 600 : 500,
          color: activeState ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #475569)",
          backgroundColor: activeState ? "rgba(37, 99, 235, 0.08)" : "transparent",
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
              className: `boost-nav-badge ${activeState ? "active" : ""}`,
              style: {
                fontSize: "11px",
                padding: "2px 7px",
                borderRadius: "9999px",
                backgroundColor: activeState ? "rgba(37, 99, 235, 0.12)" : "var(--boost-bg-subtle, #f1f5f9)",
                color: activeState ? "var(--boost-primary, #1d4ed8)" : "var(--boost-text-muted, #64748b)",
                fontWeight: 600
              },
              children: badge
            }
          ),
          rightIcon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: rightIcon })
        ]
      }
    )
  ] });
};
NavLink.displayName = "NavLink";
var DropdownMenu = ({
  trigger,
  items = [],
  align = "left",
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [focusedIndex, setFocusedIndex] = React.useState(-1);
  const containerRef = React.useRef(null);
  const triggerRef = React.useRef(null);
  const itemRefs = React.useRef([]);
  React.useMemo(() => {
    return items.map((item, idx) => ({ ...item, originalIndex: idx })).filter((item) => !item.disabled);
  }, [items]);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);
  React.useEffect(() => {
    if (!isOpen) {
      setFocusedIndex(-1);
    }
  }, [isOpen]);
  React.useEffect(() => {
    if (!isOpen) return;
    const handleGlobalKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    };
    document.addEventListener("keydown", handleGlobalKeyDown);
    return () => document.removeEventListener("keydown", handleGlobalKeyDown);
  }, [isOpen]);
  const handleTriggerKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setIsOpen(true);
      setFocusedIndex(0);
      setTimeout(() => {
        const first = itemRefs.current[0];
        first?.focus();
      }, 20);
    }
  };
  const handleMenuKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = (prev + 1) % (items.length || 1);
        itemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => {
        const next = (prev - 1 + items.length) % (items.length || 1);
        itemRefs.current[next]?.focus();
        return next;
      });
    } else if (e.key === "Home") {
      e.preventDefault();
      setFocusedIndex(0);
      itemRefs.current[0]?.focus();
    } else if (e.key === "End") {
      e.preventDefault();
      const last = items.length - 1;
      setFocusedIndex(last);
      itemRefs.current[last]?.focus();
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: containerRef,
      className: `boost-dropdown ${className}`,
      style: { position: "relative", display: "inline-flex" },
      children: [
        /* @__PURE__ */ jsx(
          "div",
          {
            ref: triggerRef,
            role: "button",
            tabIndex: 0,
            "aria-haspopup": "menu",
            "aria-expanded": isOpen,
            onClick: () => setIsOpen((prev) => !prev),
            onKeyDown: handleTriggerKeyDown,
            style: { cursor: "pointer", outline: "none" },
            children: trigger || /* @__PURE__ */ jsx("button", { type: "button", style: { padding: "6px 12px", borderRadius: "6px", border: "1px solid var(--boost-border, #cbd5e1)", background: "transparent" }, children: "Options" })
          }
        ),
        isOpen && /* @__PURE__ */ jsxs(
          "div",
          {
            role: "menu",
            "aria-orientation": "vertical",
            onKeyDown: handleMenuKeyDown,
            className: "boost-dropdown-menu",
            style: {
              position: "absolute",
              top: "calc(100% + 6px)",
              [align === "right" ? "right" : "left"]: 0,
              zIndex: 500,
              backgroundColor: "var(--boost-surface, #ffffff)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "var(--boost-radius, 10px)",
              boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.15)",
              minWidth: "190px",
              padding: "6px",
              fontFamily: "inherit",
              outline: "none"
            },
            children: [
              /* @__PURE__ */ jsx("style", { children: `
              :root[data-theme="dark"] .boost-dropdown-menu,
              .dark .boost-dropdown-menu {
                background-color: var(--boost-surface, #1e293b) !important;
                border-color: rgba(255, 255, 255, 0.15) !important;
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6) !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item,
              .dark .boost-dropdown-item {
                color: #f8fafc !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item:hover:not(.disabled),
              :root[data-theme="dark"] .boost-dropdown-item:focus:not(.disabled),
              .dark .boost-dropdown-item:hover:not(.disabled),
              .dark .boost-dropdown-item:focus:not(.disabled) {
                background-color: rgba(255, 255, 255, 0.08) !important;
              }
              :root[data-theme="dark"] .boost-dropdown-item.destructive,
              .dark .boost-dropdown-item.destructive {
                color: #f87171 !important;
              }
              .boost-dropdown-item:focus {
                outline: none;
                background-color: var(--boost-surface-secondary, #f1f5f9);
              }
            ` }),
              items.map((item, idx) => /* @__PURE__ */ jsxs(
                "div",
                {
                  ref: (el) => {
                    itemRefs.current[idx] = el;
                  },
                  role: "menuitem",
                  tabIndex: item.disabled ? -1 : 0,
                  "aria-disabled": item.disabled,
                  onClick: () => {
                    if (item.disabled) return;
                    setIsOpen(false);
                    if (item.onClick) item.onClick();
                    triggerRef.current?.focus();
                  },
                  onKeyDown: (e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      if (item.disabled) return;
                      setIsOpen(false);
                      if (item.onClick) item.onClick();
                      triggerRef.current?.focus();
                    }
                  },
                  className: `boost-dropdown-item ${item.disabled ? "disabled" : ""} ${item.destructive ? "destructive" : ""}`,
                  style: {
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    fontSize: "13px",
                    borderRadius: "6px",
                    cursor: item.disabled ? "not-allowed" : "pointer",
                    opacity: item.disabled ? 0.45 : 1,
                    color: item.destructive ? "#dc2626" : "var(--boost-text, #1e293b)",
                    transition: "background-color 0.15s ease"
                  },
                  children: [
                    item.icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: item.icon }),
                    /* @__PURE__ */ jsx("span", { children: item.label })
                  ]
                },
                item.id || idx
              ))
            ]
          }
        )
      ]
    }
  );
};
DropdownMenu.displayName = "DropdownMenu";
var MegaMenu = ({
  trigger,
  triggerLabel = "Explore Categories",
  sections,
  categories,
  featured,
  isOpen: controlledIsOpen,
  onOpenChange,
  onLinkClick,
  className = "",
  style
}) => {
  const [internalIsOpen, setInternalIsOpen] = React.useState(false);
  const isControlled = controlledIsOpen !== void 0;
  const open = isControlled ? controlledIsOpen : internalIsOpen;
  const setOpen = (newOpen) => {
    if (!isControlled) {
      setInternalIsOpen(newOpen);
    }
    if (onOpenChange) {
      onOpenChange(newOpen);
    }
  };
  const [activeCategory, setActiveCategory] = React.useState(categories?.[0]?.id || "");
  const menuRef = React.useRef(null);
  React.useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
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
  const handleLinkSelect = (link, e) => {
    if (onLinkClick) {
      e.preventDefault();
      onLinkClick(link);
    }
    setOpen(false);
  };
  const defaultTrigger = /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      onClick: () => setOpen(!open),
      className: "boost-megamenu-btn",
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "9px 16px",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #cbd5e1)",
        borderRadius: "10px",
        fontSize: "13px",
        fontWeight: 600,
        color: "var(--boost-text, #0f172a)",
        cursor: "pointer",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.05))",
        transition: "all 0.15s ease"
      },
      children: [
        /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "6px" }, children: [
          /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", children: [
            /* @__PURE__ */ jsx("rect", { width: "7", height: "7", x: "3", y: "3", rx: "1" }),
            /* @__PURE__ */ jsx("rect", { width: "7", height: "7", x: "14", y: "3", rx: "1" }),
            /* @__PURE__ */ jsx("rect", { width: "7", height: "7", x: "14", y: "14", rx: "1" }),
            /* @__PURE__ */ jsx("rect", { width: "7", height: "7", x: "3", y: "14", rx: "1" })
          ] }),
          triggerLabel
        ] }),
        /* @__PURE__ */ jsx(
          "svg",
          {
            width: "14",
            height: "14",
            viewBox: "0 0 24 24",
            fill: "none",
            stroke: "currentColor",
            strokeWidth: "2.2",
            strokeLinecap: "round",
            style: {
              transform: open ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s ease"
            },
            children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" })
          }
        )
      ]
    }
  );
  return /* @__PURE__ */ jsxs(
    "div",
    {
      ref: menuRef,
      className: `boost-megamenu-wrapper ${className}`,
      onMouseEnter: () => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
          setOpen(true);
        }
      },
      onMouseLeave: () => {
        if (typeof window !== "undefined" && window.matchMedia("(pointer: fine)").matches) {
          setOpen(false);
        }
      },
      style: { position: "relative", display: "inline-flex", fontFamily: "inherit", ...style },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        :root[data-theme="dark"] .boost-megamenu-btn {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-megamenu-panel {
          background-color: var(--boost-surface, #1e293b) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7) !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn {
          color: #94a3b8 !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn:hover {
          color: #ffffff !important;
          background-color: rgba(255, 255, 255, 0.06) !important;
        }
        :root[data-theme="dark"] .megamenu-category-btn.active {
          color: #818cf8 !important;
          background-color: rgba(99, 102, 241, 0.16) !important;
        }
        :root[data-theme="dark"] .megamenu-section-title {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .megamenu-link-label {
          color: #cbd5e1 !important;
        }
        :root[data-theme="dark"] .megamenu-link-row:hover .megamenu-link-label {
          color: #818cf8 !important;
        }
        :root[data-theme="dark"] .megamenu-divider {
          border-color: rgba(255, 255, 255, 0.1) !important;
        }

        @container (max-width: 650px) {
          .boost-megamenu-panel {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            width: calc(100% - 16px) !important;
            max-width: 350px !important;
            min-width: 0 !important;
            flex-direction: column !important;
            gap: 16px !important;
            padding: 14px !important;
            max-height: 70vh !important;
            overflow-y: auto !important;
          }
          .boost-megamenu-categories-bar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--boost-border, #e2e8f0) !important;
            padding-right: 0 !important;
            padding-bottom: 10px !important;
            width: 100% !important;
          }
        }

        @media (max-width: 768px) {
          .boost-megamenu-panel {
            position: absolute !important;
            top: 100% !important;
            left: 0 !important;
            right: 0 !important;
            width: min(440px, calc(100vw - 32px)) !important;
            min-width: 0 !important;
            flex-direction: column !important;
            gap: 16px !important;
            padding: 16px !important;
            max-height: 75vh !important;
            overflow-y: auto !important;
          }
          .boost-megamenu-categories-bar {
            flex-direction: row !important;
            overflow-x: auto !important;
            border-right: none !important;
            border-bottom: 1px solid var(--boost-border, #e2e8f0) !important;
            padding-right: 0 !important;
            padding-bottom: 12px !important;
            width: 100% !important;
          }
        }
      ` }),
        /* @__PURE__ */ jsx("div", { children: typeof trigger === "function" ? trigger({ isOpen: open }) : trigger || defaultTrigger }),
        open && /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-megamenu-panel",
            style: {
              position: "absolute",
              top: "calc(100% + 8px)",
              left: 0,
              zIndex: 500,
              backgroundColor: "var(--boost-surface, #ffffff)",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "16px",
              boxShadow: "0 20px 40px -10px rgba(0, 0, 0, 0.18)",
              padding: "24px",
              display: "flex",
              gap: "28px",
              minWidth: "640px",
              maxWidth: "calc(100vw - 40px)",
              fontFamily: "inherit",
              boxSizing: "border-box",
              animation: "boost-fadeIn 0.18s ease-out"
            },
            children: [
              categories && categories.length > 1 && /* @__PURE__ */ jsx(
                "div",
                {
                  className: "megamenu-divider boost-megamenu-categories-bar",
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    gap: "4px",
                    borderRight: "1px solid var(--boost-border, #f1f5f9)",
                    paddingRight: "18px",
                    minWidth: "130px"
                  },
                  children: categories.map((cat) => /* @__PURE__ */ jsxs(
                    "button",
                    {
                      type: "button",
                      onClick: () => setActiveCategory(cat.id),
                      className: `megamenu-category-btn ${activeCategory === cat.id ? "active" : ""}`,
                      style: {
                        textAlign: "left",
                        padding: "8px 12px",
                        borderRadius: "8px",
                        border: "none",
                        fontSize: "13px",
                        fontWeight: activeCategory === cat.id ? 700 : 500,
                        color: activeCategory === cat.id ? "var(--boost-primary, #4f46e5)" : "var(--boost-text-muted, #475569)",
                        backgroundColor: activeCategory === cat.id ? "rgba(79, 70, 229, 0.08)" : "transparent",
                        cursor: "pointer",
                        transition: "all 0.15s ease",
                        whiteSpace: "nowrap",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px"
                      },
                      children: [
                        cat.icon,
                        /* @__PURE__ */ jsx("span", { children: cat.label })
                      ]
                    },
                    cat.id
                  ))
                }
              ),
              /* @__PURE__ */ jsx(
                "div",
                {
                  style: {
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                    gap: "24px",
                    flex: 1
                  },
                  children: effectiveSections.map((section, idx) => /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "12px" }, children: [
                    /* @__PURE__ */ jsx(
                      "span",
                      {
                        className: "megamenu-section-title",
                        style: {
                          fontSize: "11px",
                          fontWeight: 800,
                          color: "var(--boost-text, #0f172a)",
                          textTransform: "uppercase",
                          letterSpacing: "0.06em"
                        },
                        children: section.title
                      }
                    ),
                    /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: section.links.map((link, lIdx) => /* @__PURE__ */ jsxs(
                      "a",
                      {
                        href: link.href,
                        onClick: (e) => handleLinkSelect(link, e),
                        className: "megamenu-link-row",
                        style: {
                          textDecoration: "none",
                          display: "flex",
                          flexDirection: "column",
                          padding: "4px 6px",
                          borderRadius: "6px",
                          transition: "background-color 0.15s ease"
                        },
                        children: [
                          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px" }, children: [
                            /* @__PURE__ */ jsx(
                              "span",
                              {
                                className: "megamenu-link-label",
                                style: {
                                  fontSize: "13px",
                                  fontWeight: 500,
                                  color: "var(--boost-text, #334155)",
                                  transition: "color 0.15s ease"
                                },
                                children: link.label
                              }
                            ),
                            link.badge && /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "9px",
                                  fontWeight: 700,
                                  backgroundColor: "rgba(239, 68, 68, 0.12)",
                                  color: "#ef4444",
                                  padding: "1px 5px",
                                  borderRadius: "4px"
                                },
                                children: link.badge
                              }
                            )
                          ] }),
                          link.description && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--boost-text-muted, #94a3b8)", marginTop: "2px" }, children: link.description })
                        ]
                      },
                      lIdx
                    )) })
                  ] }, idx))
                }
              ),
              featured !== void 0 ? /* @__PURE__ */ jsx("div", { className: "megamenu-divider", style: { borderLeft: "1px solid var(--boost-border, #f1f5f9)", paddingLeft: "20px", minWidth: "180px" }, children: featured }) : /* @__PURE__ */ jsx(
                "div",
                {
                  className: "megamenu-divider",
                  style: {
                    borderLeft: "1px solid var(--boost-border, #f1f5f9)",
                    paddingLeft: "20px",
                    minWidth: "170px",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between"
                  },
                  children: /* @__PURE__ */ jsxs(
                    "div",
                    {
                      style: {
                        background: "linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(6, 182, 212, 0.1) 100%)",
                        borderRadius: "12px",
                        padding: "16px",
                        border: "1px solid rgba(79, 70, 229, 0.2)",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px"
                      },
                      children: [
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "10px", fontWeight: 800, color: "var(--boost-primary, #4f46e5)", letterSpacing: "0.04em" }, children: "\u26A1 FESTIVE DROP" }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 700, color: "var(--boost-text, #0f172a)", lineHeight: 1.3 }, children: "Up to 50% Off New Essentials" }),
                        /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--boost-text-muted, #64748b)" }, children: "Use code FESTIVE50 at checkout" })
                      ]
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
        gap: "6px",
        fontFamily: "inherit",
        flexWrap: "wrap"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-pagination-btn,
          .dark .boost-pagination-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-pagination-btn:hover:not(:disabled),
          .dark .boost-pagination-btn:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important;
          }
          :root[data-theme="dark"] .boost-pagination-btn.active,
          .dark .boost-pagination-btn.active {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
            box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4) !important;
          }
          :root[data-theme="dark"] .boost-pagination-ellipsis,
          .dark .boost-pagination-ellipsis {
            color: #64748b !important;
          }
        ` }),
        /* @__PURE__ */ jsx(
          "button",
          {
            type: "button",
            disabled: currentPage === 1,
            onClick: () => onPageChange(currentPage - 1),
            "aria-label": "Previous page",
            className: "boost-pagination-btn",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              border: "1px solid var(--boost-border, #cbd5e1)",
              borderRadius: "var(--boost-radius, 8px)",
              backgroundColor: "var(--boost-surface, #ffffff)",
              color: "var(--boost-text, #334155)",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              opacity: currentPage === 1 ? 0.35 : 1,
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "15 18 9 12 15 6" }) })
          }
        ),
        getPages().map((page, idx) => {
          if (typeof page === "string") {
            return /* @__PURE__ */ jsx(
              "span",
              {
                className: "boost-pagination-ellipsis",
                style: {
                  width: "30px",
                  height: "34px",
                  display: "inline-flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "var(--boost-muted, #94a3b8)",
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
              className: `boost-pagination-btn ${isCurrent ? "active" : ""}`,
              style: {
                width: "34px",
                height: "34px",
                border: isCurrent ? "1px solid var(--boost-primary, #2563eb)" : "1px solid var(--boost-border, #cbd5e1)",
                borderRadius: "var(--boost-radius, 8px)",
                backgroundColor: isCurrent ? "var(--boost-primary, #2563eb)" : "var(--boost-surface, #ffffff)",
                color: isCurrent ? "#ffffff" : "var(--boost-text, #334155)",
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
            className: "boost-pagination-btn",
            style: {
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              width: "34px",
              height: "34px",
              border: "1px solid var(--boost-border, #cbd5e1)",
              borderRadius: "var(--boost-radius, 8px)",
              backgroundColor: "var(--boost-surface, #ffffff)",
              color: "var(--boost-text, #334155)",
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
              opacity: currentPage === totalPages ? 0.35 : 1,
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "9 18 15 12 9 6" }) })
          }
        )
      ]
    }
  );
};
Pagination.displayName = "Pagination";
var TabsContext = React.createContext(null);
var useTabsContext = () => React.useContext(TabsContext);
var Tabs = (({
  tabs,
  items,
  defaultTab,
  activeTab: controlledTab,
  activeId: controlledId,
  value: controlledValue,
  defaultValue,
  onValueChange,
  onChange,
  children,
  className = "",
  style
}) => {
  const tabList = items || tabs || [];
  const currentActive = controlledValue !== void 0 ? controlledValue : controlledId !== void 0 ? controlledId : controlledTab;
  const [internalTab, setInternalTab] = React.useState(
    currentActive || defaultValue || defaultTab || (tabList[0] ? tabList[0].id : "")
  );
  const active = currentActive !== void 0 ? currentActive : internalTab;
  const handleTabClick = (id) => {
    if (currentActive === void 0) {
      setInternalTab(id);
    }
    if (onValueChange) onValueChange(id);
    if (onChange) onChange(id);
  };
  const currentTab = tabList.find((t) => t.id === active) || tabList[0];
  const handleKeyDown = (e) => {
    const focusableTabs = tabList.filter((t) => !t.disabled);
    if (focusableTabs.length === 0) return;
    const currentIndex = focusableTabs.findIndex((t) => t.id === active);
    let nextIndex = currentIndex;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % focusableTabs.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + focusableTabs.length) % focusableTabs.length;
    } else if (e.key === "Home") {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === "End") {
      e.preventDefault();
      nextIndex = focusableTabs.length - 1;
    }
    if (nextIndex !== currentIndex) {
      const nextTabId = focusableTabs[nextIndex].id;
      handleTabClick(nextTabId);
      const btn = document.getElementById(`boost-tab-${nextTabId}`);
      if (btn) btn.focus();
    }
  };
  return /* @__PURE__ */ jsx(TabsContext.Provider, { value: { active, setActive: handleTabClick }, children: /* @__PURE__ */ jsxs("div", { className: `boost-tabs ${className}`, style: { fontFamily: "inherit", width: "100%", ...style }, children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-tabs .boost-tab-header,
          .dark .boost-tabs .boost-tab-header {
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item,
          .dark .boost-tabs .boost-tab-item {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item:hover:not(:disabled),
          .dark .boost-tabs .boost-tab-item:hover:not(:disabled) {
            color: #ffffff !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-item.active,
          .dark .boost-tabs .boost-tab-item.active {
            color: #818cf8 !important;
            border-bottom-color: #6366f1 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-badge,
          .dark .boost-tabs .boost-tab-badge {
            background-color: rgba(255, 255, 255, 0.08) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-badge.active,
          .dark .boost-tabs .boost-tab-badge.active {
            background-color: rgba(99, 102, 241, 0.2) !important;
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-tabs .boost-tab-panel,
          .dark .boost-tabs .boost-tab-panel {
            color: #cbd5e1 !important;
          }
        ` }),
    /* @__PURE__ */ jsx(
      "div",
      {
        role: "tablist",
        "aria-orientation": "horizontal",
        className: "boost-tab-header",
        onKeyDown: handleKeyDown,
        style: {
          display: "flex",
          borderBottom: "1px solid var(--boost-border, #e2e8f0)",
          gap: "8px",
          overflowX: "auto",
          WebkitOverflowScrolling: "touch"
        },
        children: tabList.map((tab) => {
          const isActive = tab.id === active;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              id: `boost-tab-${tab.id}`,
              role: "tab",
              "aria-selected": isActive,
              "aria-controls": `boost-tabpanel-${tab.id}`,
              tabIndex: isActive ? 0 : -1,
              disabled: tab.disabled,
              onClick: () => handleTabClick(tab.id),
              className: `boost-tab-item ${isActive ? "active" : ""}`,
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "8px",
                padding: "10px 16px",
                fontSize: "14px",
                fontWeight: isActive ? 600 : 500,
                color: isActive ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
                backgroundColor: "transparent",
                border: "none",
                borderBottom: isActive ? "2px solid var(--boost-primary, #2563eb)" : "2px solid transparent",
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
                    className: `boost-tab-badge ${isActive ? "active" : ""}`,
                    style: {
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "9999px",
                      backgroundColor: isActive ? "rgba(37, 99, 235, 0.1)" : "var(--boost-bg-subtle, #f1f5f9)",
                      color: isActive ? "var(--boost-primary, #1d4ed8)" : "var(--boost-text-muted, #64748b)",
                      fontWeight: 600
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
    children ? children : /* @__PURE__ */ jsx(Fragment, { children: /* @__PURE__ */ jsx(
      "div",
      {
        role: "tabpanel",
        id: currentTab ? `boost-tabpanel-${currentTab.id}` : void 0,
        "aria-labelledby": currentTab ? `boost-tab-${currentTab.id}` : void 0,
        tabIndex: 0,
        className: "boost-tab-panel",
        style: { padding: "16px 0", color: "var(--boost-text, #334155)", fontSize: "14px", lineHeight: 1.6 },
        children: currentTab ? currentTab.content : null
      }
    ) })
  ] }) });
});
var TabsList = ({ children, className = "", style, ...props }) => {
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "tablist",
      "aria-orientation": "horizontal",
      className: `boost-tab-header ${className}`,
      style: {
        display: "flex",
        borderBottom: "1px solid var(--boost-border, #e2e8f0)",
        gap: "8px",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        ...style
      },
      ...props,
      children
    }
  );
};
var TabsTrigger = ({
  value,
  children,
  icon,
  badge,
  disabled,
  className = "",
  style,
  ...props
}) => {
  const ctx = useTabsContext();
  const isActive = ctx ? ctx.active === value : false;
  return /* @__PURE__ */ jsxs(
    "button",
    {
      type: "button",
      id: `boost-tab-${value}`,
      role: "tab",
      "aria-selected": isActive,
      "aria-controls": `boost-tabpanel-${value}`,
      tabIndex: isActive ? 0 : -1,
      disabled,
      onClick: () => ctx?.setActive(value),
      className: `boost-tab-item ${isActive ? "active" : ""} ${className}`,
      style: {
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "10px 16px",
        fontSize: "14px",
        fontWeight: isActive ? 600 : 500,
        color: isActive ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
        backgroundColor: "transparent",
        border: "none",
        borderBottom: isActive ? "2px solid var(--boost-primary, #2563eb)" : "2px solid transparent",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
        whiteSpace: "nowrap",
        transition: "all 0.15s ease",
        ...style
      },
      ...props,
      children: [
        icon && /* @__PURE__ */ jsx("span", { style: { display: "inline-flex" }, children: icon }),
        /* @__PURE__ */ jsx("span", { children }),
        badge !== void 0 && /* @__PURE__ */ jsx(
          "span",
          {
            className: `boost-tab-badge ${isActive ? "active" : ""}`,
            style: {
              fontSize: "11px",
              padding: "2px 6px",
              borderRadius: "9999px",
              backgroundColor: isActive ? "rgba(37, 99, 235, 0.1)" : "var(--boost-bg-subtle, #f1f5f9)",
              color: isActive ? "var(--boost-primary, #1d4ed8)" : "var(--boost-text-muted, #64748b)",
              fontWeight: 600
            },
            children: badge
          }
        )
      ]
    }
  );
};
var TabsContent = ({
  value,
  children,
  className = "",
  style,
  ...props
}) => {
  const ctx = useTabsContext();
  if (ctx && ctx.active !== value) return null;
  return /* @__PURE__ */ jsx(
    "div",
    {
      role: "tabpanel",
      id: `boost-tabpanel-${value}`,
      "aria-labelledby": `boost-tab-${value}`,
      tabIndex: 0,
      className: `boost-tab-panel ${className}`,
      style: {
        padding: "16px 0",
        color: "var(--boost-text, #334155)",
        fontSize: "14px",
        lineHeight: 1.6,
        ...style
      },
      ...props,
      children
    }
  );
};
Tabs.List = TabsList;
Tabs.Trigger = TabsTrigger;
Tabs.Content = TabsContent;
Tabs.displayName = "Tabs";
var Stepper = ({
  steps = [],
  activeStep,
  currentStep,
  onStepClick,
  className = ""
}) => {
  const activeIdx = currentStep !== void 0 ? currentStep - 1 : activeStep ?? 0;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-stepper ${className}`,
      style: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        width: "100%",
        fontFamily: "inherit",
        position: "relative",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        padding: "4px 0"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-stepper-circle.inactive,
          .dark .boost-stepper-circle.inactive {
            background-color: rgba(255, 255, 255, 0.06) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-stepper-circle.current,
          .dark .boost-stepper-circle.current {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%) !important;
            border-color: #6366f1 !important;
            color: #ffffff !important;
            box-shadow: 0 0 14px rgba(99, 102, 241, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-stepper-label.current,
          .dark .boost-stepper-label.current {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-stepper-label.inactive,
          .dark .boost-stepper-label.inactive {
            color: #94a3b8 !important;
          }
          :root[data-theme="dark"] .boost-stepper-line.inactive,
          .dark .boost-stepper-line.inactive {
            background-color: rgba(255, 255, 255, 0.1) !important;
          }
        ` }),
        steps.map((step, idx) => {
          const isCompleted = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          const isClickable = onStepClick && idx <= activeIdx;
          const displayLabel = step.label || step.title || "";
          const circleState = isCompleted ? "completed" : isCurrent ? "current" : "inactive";
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
                      className: `boost-stepper-circle ${circleState}`,
                      style: {
                        width: "32px",
                        height: "32px",
                        borderRadius: "50%",
                        backgroundColor: isCompleted ? "#10b981" : isCurrent ? "var(--boost-primary, #2563eb)" : "var(--boost-bg-subtle, #f1f5f9)",
                        color: isCompleted || isCurrent ? "#ffffff" : "var(--boost-muted, #64748b)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "13px",
                        fontWeight: 700,
                        border: `2px solid ${isCompleted ? "#10b981" : isCurrent ? "var(--boost-primary, #2563eb)" : "var(--boost-border, #cbd5e1)"}`,
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
                        className: `boost-stepper-label ${isCurrent ? "current" : "inactive"}`,
                        style: {
                          fontSize: "13px",
                          fontWeight: isCurrent ? 700 : 500,
                          color: isCurrent ? "var(--boost-text, #0f172a)" : "var(--boost-muted, #64748b)",
                          whiteSpace: "nowrap"
                        },
                        children: displayLabel
                      }
                    ),
                    step.description && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--boost-muted, #94a3b8)" }, children: step.description })
                  ] })
                ] }),
                idx < steps.length - 1 && /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: `boost-stepper-line ${idx < activeIdx ? "completed" : "inactive"}`,
                    style: {
                      flex: 1,
                      height: "2px",
                      backgroundColor: idx < activeIdx ? "#10b981" : "var(--boost-border, #e2e8f0)",
                      margin: "0 12px",
                      minWidth: "20px",
                      transition: "background-color 0.2s ease"
                    }
                  }
                )
              ]
            },
            step.id
          );
        })
      ]
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-back-btn,
          .dark .boost-back-btn {
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-back-btn:hover,
          .dark .boost-back-btn:hover {
            color: #ffffff !important;
            background-color: rgba(255, 255, 255, 0.06) !important;
          }
        ` }),
    /* @__PURE__ */ jsxs(
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
          color: "var(--boost-text-muted, #475569)",
          fontSize: "14px",
          fontWeight: 500,
          cursor: "pointer",
          padding: "6px 10px",
          borderRadius: "var(--boost-radius, 8px)",
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
    )
  ] });
};
BackButton.displayName = "BackButton";
function Table({
  columns = [],
  data = [],
  striped = false,
  bordered = true,
  hoverable = true,
  className = "",
  keyExtractor = (_, idx) => idx
}) {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-table-wrapper ${className}`,
      style: {
        width: "100%",
        overflowX: "auto",
        WebkitOverflowScrolling: "touch",
        border: bordered ? "1px solid var(--boost-border, #e2e8f0)" : "none",
        borderRadius: "var(--boost-radius, 12px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0,0,0,0.03))",
        fontFamily: "inherit"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-table-wrapper,
          .dark .boost-table-wrapper {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper thead tr,
          .dark .boost-table-wrapper thead tr {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper th,
          .dark .boost-table-wrapper th {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper td,
          .dark .boost-table-wrapper td {
            color: #cbd5e1 !important;
            border-bottom-color: rgba(255, 255, 255, 0.06) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper tr.boost-table-row:hover,
          .dark .boost-table-wrapper tr.boost-table-row:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          :root[data-theme="dark"] .boost-table-wrapper tr.boost-table-striped,
          .dark .boost-table-wrapper tr.boost-table-striped {
            background-color: rgba(255, 255, 255, 0.02) !important;
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "table",
          {
            style: {
              width: "100%",
              minWidth: "480px",
              borderCollapse: "collapse",
              fontSize: "13px",
              textAlign: "left",
              color: "var(--boost-text, #334155)"
            },
            children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsx("tr", { style: { backgroundColor: "var(--boost-bg-subtle, #f8fafc)", borderBottom: "1px solid var(--boost-border, #e2e8f0)" }, children: columns.map((col, idx) => /* @__PURE__ */ jsx(
                "th",
                {
                  style: {
                    padding: "13px 16px",
                    fontWeight: 600,
                    color: "var(--boost-text, #0f172a)",
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
                    padding: "36px",
                    textAlign: "center",
                    color: "var(--boost-muted, #94a3b8)"
                  },
                  children: "No data available"
                }
              ) }) : data.map((row, rIdx) => {
                const isEven = rIdx % 2 === 0;
                const isStriped = striped && !isEven;
                return /* @__PURE__ */ jsx(
                  "tr",
                  {
                    className: `boost-table-row ${isStriped ? "boost-table-striped" : ""}`,
                    style: {
                      backgroundColor: isStriped ? "#f8fafc" : "transparent",
                      borderBottom: rIdx === data.length - 1 ? "none" : "1px solid var(--boost-border, #f1f5f9)",
                      transition: hoverable ? "background-color 0.15s ease" : "none"
                    },
                    children: columns.map((col, cIdx) => {
                      const colKey = col.accessor || col.key;
                      const content = typeof col.accessor === "function" ? col.accessor(row) : colKey ? row[colKey] : null;
                      return /* @__PURE__ */ jsx(
                        "td",
                        {
                          style: {
                            padding: "13px 16px",
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
      ]
    }
  );
}
Table.displayName = "Table";
function DataTable({
  columns = [],
  data = [],
  pageSize = 10,
  searchable = false,
  searchPlaceholder = "Search records...",
  searchFilter,
  selectable = false,
  selectedRows: controlledSelectedRows,
  onSelectionChange,
  stickyHeader = false,
  maxHeight,
  exportable = false,
  exportFilename = "export.csv",
  manualPagination = false,
  totalCount,
  page: controlledPage,
  onPageChange,
  className = "",
  style
}) {
  const [searchQuery, setSearchQuery] = React.useState("");
  const [internalPage, setInternalPage] = React.useState(1);
  const [internalSelectedRows, setInternalSelectedRows] = React.useState([]);
  const [sortColumn, setSortColumn] = React.useState(null);
  const [sortDirection, setSortDirection] = React.useState("asc");
  const currentPage = controlledPage !== void 0 ? controlledPage : internalPage;
  const selectedRows = controlledSelectedRows !== void 0 ? controlledSelectedRows : internalSelectedRows;
  const handlePageChange = (newPage) => {
    if (onPageChange) {
      onPageChange(newPage);
    }
    if (controlledPage === void 0) {
      setInternalPage(newPage);
    }
  };
  const handleSort = (colKey) => {
    if (sortColumn === colKey) {
      setSortDirection((prev) => prev === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(colKey);
      setSortDirection("asc");
    }
  };
  const processedData = React.useMemo(() => {
    let list = [...data || []];
    if (searchable && searchQuery) {
      if (searchFilter) {
        list = list.filter((item) => searchFilter(item, searchQuery));
      } else {
        const q = searchQuery.toLowerCase();
        list = list.filter(
          (item) => Object.values(item).some(
            (val) => val && String(val).toLowerCase().includes(q)
          )
        );
      }
    }
    if (sortColumn) {
      list.sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }
        const aStr = String(aVal).toLowerCase();
        const bStr = String(bVal).toLowerCase();
        return sortDirection === "asc" ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
      });
    }
    return list;
  }, [data, searchQuery, searchFilter, searchable, sortColumn, sortDirection]);
  const totalRecords = manualPagination && totalCount !== void 0 ? totalCount : processedData.length;
  const totalPages = Math.ceil(totalRecords / pageSize) || 1;
  const paginatedData = manualPagination ? processedData : processedData.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const isRowSelected = (row) => selectedRows.includes(row);
  const toggleRow = (row) => {
    let next;
    if (isRowSelected(row)) {
      next = selectedRows.filter((r) => r !== row);
    } else {
      next = [...selectedRows, row];
    }
    setInternalSelectedRows(next);
    onSelectionChange?.(next);
  };
  const toggleAll = () => {
    let next;
    if (selectedRows.length === paginatedData.length && paginatedData.length > 0) {
      next = [];
    } else {
      next = [...paginatedData];
    }
    setInternalSelectedRows(next);
    onSelectionChange?.(next);
  };
  const handleExportCSV = () => {
    if (!processedData.length) return;
    const headerRow = columns.map((c) => {
      const colTitle = c.title || c.header || (typeof c.key === "string" ? c.key : "");
      return `"${String(colTitle).replace(/"/g, '""')}"`;
    }).join(",");
    const rows = processedData.map(
      (row) => columns.map((col) => {
        const colKey = col.key;
        const accessor = col.accessor !== void 0 ? col.accessor : colKey;
        let val = "";
        if (typeof accessor === "function") {
          val = accessor(row);
        } else if (accessor !== void 0 && row[accessor] !== void 0) {
          val = row[accessor];
        } else if (colKey && row[colKey] !== void 0) {
          val = row[colKey];
        }
        if (typeof val === "object" && val !== null && !React.isValidElement(val)) {
          val = JSON.stringify(val);
        } else if (React.isValidElement(val)) {
          val = colKey ? String(row[colKey] ?? "") : "";
        }
        return `"${String(val ?? "").replace(/"/g, '""')}"`;
      }).join(",")
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headerRow, ...rows].join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", exportFilename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  const isAllSelected = paginatedData.length > 0 && selectedRows.length === paginatedData.length;
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-data-table ${className}`,
      style: {
        fontFamily: "inherit",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-data-table .boost-data-table-card,
          .dark .boost-data-table .boost-data-table-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-data-table thead tr,
          .dark .boost-data-table thead tr {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-data-table th,
          .dark .boost-data-table th {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-data-table td,
          .dark .boost-data-table td {
            color: #cbd5e1 !important;
            border-bottom-color: rgba(255, 255, 255, 0.06) !important;
          }
          :root[data-theme="dark"] .boost-data-table tbody tr:hover,
          .dark .boost-data-table tbody tr:hover {
            background-color: rgba(255, 255, 255, 0.03) !important;
          }
          .boost-table-sort-btn {
            background: none;
            border: none;
            padding: 0;
            margin: 0;
            color: inherit;
            font: inherit;
            font-weight: inherit;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "12px" }, children: [
          searchable ? /* @__PURE__ */ jsx("div", { style: { maxWidth: "300px", width: "100%" }, children: /* @__PURE__ */ jsx(
            SearchInput,
            {
              value: searchQuery,
              onChange: (e) => {
                setSearchQuery(e.target.value);
                if (controlledPage === void 0) setInternalPage(1);
              },
              onClear: () => setSearchQuery(""),
              placeholder: searchPlaceholder
            }
          ) }) : /* @__PURE__ */ jsx("div", {}),
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px", fontSize: "13px", color: "var(--boost-muted, #64748b)" }, children: [
            selectable && selectedRows.length > 0 && /* @__PURE__ */ jsxs("span", { style: { fontWeight: 600, color: "var(--boost-primary, #2563eb)" }, children: [
              selectedRows.length,
              " selected"
            ] }),
            /* @__PURE__ */ jsxs("span", { children: [
              "Showing ",
              paginatedData.length,
              " of ",
              totalRecords,
              " records"
            ] }),
            exportable && /* @__PURE__ */ jsxs(
              "button",
              {
                type: "button",
                onClick: handleExportCSV,
                style: {
                  backgroundColor: "var(--boost-surface-secondary, #f1f5f9)",
                  color: "var(--boost-text, #0f172a)",
                  border: "1px solid var(--boost-border, #cbd5e1)",
                  padding: "6px 12px",
                  borderRadius: "8px",
                  fontSize: "12px",
                  fontWeight: 600,
                  cursor: "pointer",
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "6px"
                },
                children: [
                  /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
                    /* @__PURE__ */ jsx("path", { d: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" }),
                    /* @__PURE__ */ jsx("polyline", { points: "7 10 12 15 17 10" }),
                    /* @__PURE__ */ jsx("line", { x1: "12", y1: "15", x2: "12", y2: "3" })
                  ] }),
                  "Export CSV"
                ]
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            className: "boost-data-table-card",
            style: {
              width: "100%",
              overflowX: "auto",
              maxHeight: maxHeight || void 0,
              overflowY: maxHeight ? "auto" : void 0,
              WebkitOverflowScrolling: "touch",
              border: "1px solid var(--boost-border, #e2e8f0)",
              borderRadius: "var(--boost-radius, 12px)",
              backgroundColor: "var(--boost-surface, #ffffff)",
              boxShadow: "var(--boost-shadow-sm, 0 1px 3px rgba(0, 0, 0, 0.04))",
              position: "relative"
            },
            children: /* @__PURE__ */ jsxs("table", { style: { width: "100%", borderCollapse: "collapse", fontSize: "13px", textAlign: "left", color: "var(--boost-text, #334155)", minWidth: "480px" }, children: [
              /* @__PURE__ */ jsx("thead", { children: /* @__PURE__ */ jsxs(
                "tr",
                {
                  style: {
                    backgroundColor: "var(--boost-bg, #f8fafc)",
                    borderBottom: "1px solid var(--boost-border, #e2e8f0)",
                    position: stickyHeader ? "sticky" : void 0,
                    top: stickyHeader ? 0 : void 0,
                    zIndex: stickyHeader ? 2 : void 0
                  },
                  children: [
                    selectable && /* @__PURE__ */ jsx("th", { style: { width: "40px", padding: "13px 16px" }, children: /* @__PURE__ */ jsx(
                      "input",
                      {
                        type: "checkbox",
                        checked: isAllSelected,
                        onChange: toggleAll,
                        "aria-label": "Select all rows",
                        style: { cursor: "pointer", width: "16px", height: "16px", accentColor: "var(--boost-primary, #2563eb)" }
                      }
                    ) }),
                    columns.map((col, idx) => {
                      const colKey = String(col.key || col.accessor || idx);
                      const isSorted = sortColumn === colKey;
                      const colTitle = col.title || col.header || (typeof col.key === "string" ? col.key : "");
                      return /* @__PURE__ */ jsx(
                        "th",
                        {
                          style: {
                            padding: "13px 16px",
                            fontWeight: 700,
                            color: "var(--boost-text, #0f172a)",
                            textAlign: col.align || "left",
                            width: col.width,
                            whiteSpace: "nowrap"
                          },
                          children: col.sortable ? /* @__PURE__ */ jsxs(
                            "button",
                            {
                              type: "button",
                              onClick: () => handleSort(colKey),
                              className: "boost-table-sort-btn",
                              children: [
                                /* @__PURE__ */ jsx("span", { children: colTitle }),
                                /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", opacity: isSorted ? 1 : 0.4 }, children: isSorted ? sortDirection === "asc" ? "\u25B2" : "\u25BC" : "\u2195" })
                              ]
                            }
                          ) : colTitle
                        },
                        idx
                      );
                    })
                  ]
                }
              ) }),
              /* @__PURE__ */ jsx("tbody", { children: paginatedData.length === 0 ? /* @__PURE__ */ jsx("tr", { children: /* @__PURE__ */ jsx("td", { colSpan: columns.length + (selectable ? 1 : 0), style: { padding: "36px", textAlign: "center", color: "var(--boost-text-muted, #94a3b8)" }, children: "No records matching your search" }) }) : paginatedData.map((row, rIdx) => {
                const selected = isRowSelected(row);
                return /* @__PURE__ */ jsxs(
                  "tr",
                  {
                    style: {
                      borderBottom: rIdx === paginatedData.length - 1 ? "none" : "1px solid var(--boost-border, #f1f5f9)",
                      backgroundColor: selected ? "rgba(37, 99, 235, 0.05)" : void 0,
                      transition: "background-color 0.1s ease"
                    },
                    children: [
                      selectable && /* @__PURE__ */ jsx("td", { style: { width: "40px", padding: "13px 16px" }, children: /* @__PURE__ */ jsx(
                        "input",
                        {
                          type: "checkbox",
                          checked: selected,
                          onChange: () => toggleRow(row),
                          "aria-label": `Select row ${rIdx + 1}`,
                          style: { cursor: "pointer", width: "16px", height: "16px", accentColor: "var(--boost-primary, #2563eb)" }
                        }
                      ) }),
                      columns.map((col, cIdx) => {
                        const colKey = col.key;
                        const accessor = col.accessor !== void 0 ? col.accessor : colKey;
                        const rawValue = colKey !== void 0 && row ? row[colKey] : void 0;
                        let content = "";
                        if (typeof col.render === "function") {
                          content = col.render(rawValue, row);
                        } else if (typeof accessor === "function") {
                          content = accessor(row);
                        } else if (accessor !== void 0 && row && row[accessor] !== void 0) {
                          content = row[accessor];
                        } else if (rawValue !== void 0) {
                          content = rawValue;
                        }
                        return /* @__PURE__ */ jsx("td", { style: { padding: "13px 16px", textAlign: col.align || "left" }, children: content }, cIdx);
                      })
                    ]
                  },
                  rIdx
                );
              }) })
            ] })
          }
        ),
        totalPages > 1 && /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "center", flexWrap: "wrap", marginTop: "4px" }, children: /* @__PURE__ */ jsx(
          Pagination,
          {
            currentPage,
            totalPages,
            onPageChange: handlePageChange
          }
        ) })
      ]
    }
  );
}
DataTable.displayName = "DataTable";
var StatsCard = ({
  title,
  value,
  change,
  trend,
  isPositive = true,
  period = "vs last month",
  description,
  icon,
  className = ""
}) => {
  const computedChange = change !== void 0 ? change : typeof trend === "object" && trend !== null ? `${trend.value > 0 && !String(trend.value).includes("+") ? "+" : ""}${trend.value}%` : trend !== void 0 ? trend : void 0;
  const computedIsPositive = typeof trend === "object" && trend !== null && trend.isPositive !== void 0 ? trend.isPositive : isPositive;
  const computedPeriod = description || period;
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-stats-card,
          .dark .boost-stats-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
        computedChange !== void 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "6px", fontSize: "12px" }, children: [
          /* @__PURE__ */ jsxs(
            "span",
            {
              style: {
                fontWeight: 700,
                color: computedIsPositive ? "#16a34a" : "#dc2626",
                backgroundColor: computedIsPositive ? "rgba(34, 197, 94, 0.1)" : "rgba(220, 38, 38, 0.1)",
                padding: "2px 8px",
                borderRadius: "9999px",
                display: "inline-flex",
                alignItems: "center",
                gap: "3px"
              },
              children: [
                computedIsPositive ? /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "18 15 12 9 6 15" }) }) : /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) }),
                computedChange
              ]
            }
          ),
          /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-text-muted, #94a3b8)" }, children: computedPeriod })
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-kpi-widget,
          .dark .boost-kpi-widget {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-area-chart,
          .dark .boost-area-chart {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-bar-chart,
          .dark .boost-bar-chart {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-donut-chart,
          .dark .boost-donut-chart {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
  items = [],
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
  notifications = [],
  onMarkAllAsRead,
  onItemClick,
  onClearAll,
  title = "Notifications",
  emptyText = "You have no new notifications.",
  className = ""
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [filter, setFilter] = React.useState("all");
  const containerRef = React.useRef(null);
  const unreadCount = notifications.filter((n) => !n.read).length;
  const filteredNotifications = React.useMemo(() => {
    if (filter === "unread") {
      return notifications.filter((n) => !n.read);
    }
    return notifications;
  }, [notifications, filter]);
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
        /* @__PURE__ */ jsx("style", { children: `
          @media (max-width: 640px) {
            .boost-notification-popover {
              position: fixed !important;
              top: auto !important;
              bottom: 0 !important;
              left: 0 !important;
              right: 0 !important;
              width: 100% !important;
              max-width: 100% !important;
              border-radius: 20px 20px 0 0 !important;
              max-height: 85vh !important;
              box-shadow: 0 -10px 40px rgba(0,0,0,0.15) !important;
              display: flex;
              flex-direction: column;
              z-index: 999999 !important;
            }
            .boost-notification-list {
              flex: 1;
              overflow-y: auto;
              max-height: calc(85vh - 120px) !important;
            }
          }
        ` }),
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
        isOpen && /* @__PURE__ */ jsxs(Fragment, { children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                position: "fixed",
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                backgroundColor: "rgba(0,0,0,0.3)",
                zIndex: 99998,
                display: "var(--boost-backdrop-display, none)"
                // We can show this on mobile via CSS if needed, or just let handleClickOutside handle it.
              },
              onClick: () => setIsOpen(false),
              className: "boost-notification-backdrop"
            }
          ),
          /* @__PURE__ */ jsx("style", { children: `
              @media (max-width: 640px) {
                .boost-notification-backdrop {
                  display: block !important;
                }
              }
            ` }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              className: "boost-notification-popover",
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
                zIndex: 99999,
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
                          children: "Mark all read"
                        }
                      )
                    ]
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "16px", padding: "0 18px", borderBottom: "1px solid var(--boost-border, #e2e8f0)" }, children: [
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFilter("all"),
                      style: {
                        background: "none",
                        border: "none",
                        borderBottom: filter === "all" ? "2px solid var(--boost-primary, #2563eb)" : "2px solid transparent",
                        color: filter === "all" ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
                        padding: "10px 0",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      },
                      children: "All"
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      type: "button",
                      onClick: () => setFilter("unread"),
                      style: {
                        background: "none",
                        border: "none",
                        borderBottom: filter === "unread" ? "2px solid var(--boost-primary, #2563eb)" : "2px solid transparent",
                        color: filter === "unread" ? "var(--boost-primary, #2563eb)" : "var(--boost-text-muted, #64748b)",
                        padding: "10px 0",
                        fontSize: "13px",
                        fontWeight: 600,
                        cursor: "pointer",
                        transition: "all 0.2s ease"
                      },
                      children: "Unread"
                    }
                  )
                ] }),
                /* @__PURE__ */ jsx("div", { className: "boost-notification-list", style: { maxHeight: "340px", overflowY: "auto" }, children: filteredNotifications.length === 0 ? /* @__PURE__ */ jsx(
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
                ) : filteredNotifications.map((item) => /* @__PURE__ */ jsxs(
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
        ] })
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
        fontFamily: "inherit",
        maxWidth: "100%"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-date-range-box,
          .dark .boost-date-range-box {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-date-range-box input,
          .dark .boost-date-range-box input {
            color: #f8fafc !important;
            color-scheme: dark !important;
          }
          :root[data-theme="dark"] .boost-date-range-picker label,
          .dark .boost-date-range-picker label {
            color: #e2e8f0 !important;
          }
        ` }),
        label && /* @__PURE__ */ jsx("label", { style: { fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)" }, children: label }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            className: "boost-date-range-box",
            style: {
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              border: "1px solid var(--boost-border, #cbd5e1)",
              borderRadius: "var(--boost-radius, 8px)",
              padding: "6px 12px",
              backgroundColor: "var(--boost-surface, #ffffff)",
              flexWrap: "wrap",
              boxShadow: "var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))"
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
                    color: "var(--boost-text, #0f172a)",
                    backgroundColor: "transparent",
                    outline: "none",
                    fontFamily: "inherit"
                  }
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-muted, #94a3b8)", fontSize: "12px", fontWeight: 500 }, children: "to" }),
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
                    color: "var(--boost-text, #0f172a)",
                    backgroundColor: "transparent",
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-export-btn,
          .dark .boost-export-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-export-btn:hover:not(:disabled),
          .dark .boost-export-btn:hover:not(:disabled) {
            background-color: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(255, 255, 255, 0.25) !important;
          }
        ` }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: handleClick,
        disabled: loading || props.disabled,
        className: `boost-export-btn ${props.className || ""}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 500,
          color: "var(--boost-text, #334155)",
          backgroundColor: "var(--boost-surface, #ffffff)",
          border: "1px solid var(--boost-border, #cbd5e1)",
          borderRadius: "var(--boost-radius, 8px)",
          cursor: loading || props.disabled ? "not-allowed" : "pointer",
          opacity: loading || props.disabled ? 0.6 : 1,
          boxShadow: "var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))",
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
    )
  ] });
};
ExportButton.displayName = "ExportButton";
var Filter = ({
  label = "Filter",
  options = [],
  selectedValues = [],
  onChange,
  multiple = true,
  clearable = true,
  className = "",
  style
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
  return /* @__PURE__ */ jsxs("div", { className: `boost-filter-wrapper ${className || ""}`, style: { position: "relative", display: "inline-block", fontFamily: "inherit", ...style }, children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-filter-btn,
          .dark .boost-filter-btn {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-filter-btn.active,
          .dark .boost-filter-btn.active {
            background-color: rgba(99, 102, 241, 0.2) !important;
            border-color: var(--boost-primary, #6366f1) !important;
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-filter-dropdown,
          .dark .boost-filter-dropdown {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-filter-dropdown .filter-header,
          .dark .boost-filter-dropdown .filter-header {
            border-bottom-color: rgba(255, 255, 255, 0.1) !important;
          }
          :root[data-theme="dark"] .boost-filter-opt,
          .dark .boost-filter-opt {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-filter-opt:hover,
          .dark .boost-filter-opt:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-filter-opt.checked,
          .dark .boost-filter-opt.checked {
            background-color: rgba(99, 102, 241, 0.12) !important;
          }
        ` }),
    /* @__PURE__ */ jsxs(
      "button",
      {
        onClick: () => setIsOpen(!isOpen),
        className: `boost-filter-btn ${selectedValues.length > 0 ? "active" : ""}`,
        style: {
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 14px",
          fontSize: "13px",
          fontWeight: 500,
          color: selectedValues.length > 0 ? "var(--boost-primary, #2563eb)" : "var(--boost-text, #334155)",
          backgroundColor: selectedValues.length > 0 ? "rgba(37, 99, 235, 0.08)" : "var(--boost-surface, #ffffff)",
          border: `1px solid ${selectedValues.length > 0 ? "var(--boost-primary, #93c5fd)" : "var(--boost-border, #cbd5e1)"}`,
          borderRadius: "var(--boost-radius, 8px)",
          cursor: "pointer",
          transition: "all 0.15s ease"
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
                backgroundColor: "var(--boost-primary, #2563eb)",
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
        className: "boost-filter-dropdown",
        style: {
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 50,
          minWidth: "220px",
          backgroundColor: "var(--boost-surface, #ffffff)",
          border: "1px solid var(--boost-border, #e2e8f0)",
          borderRadius: "var(--boost-radius, 10px)",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
          padding: "8px"
        },
        children: [
          /* @__PURE__ */ jsxs("div", { className: "filter-header", style: { display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 8px 8px", borderBottom: "1px solid var(--boost-border, #f1f5f9)" }, children: [
            /* @__PURE__ */ jsx("span", { style: { fontSize: "12px", fontWeight: 600, color: "var(--boost-muted, #64748b)" }, children: "Filter Options" }),
            clearable && selectedValues.length > 0 && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleClear,
                style: {
                  background: "none",
                  border: "none",
                  color: "#ef4444",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                  padding: 0
                },
                children: "Clear all"
              }
            )
          ] }),
          /* @__PURE__ */ jsx("div", { style: { maxHeight: "220px", overflowY: "auto", marginTop: "6px" }, children: options.map((opt) => {
            const checked = selectedValues.includes(opt.value);
            return /* @__PURE__ */ jsxs(
              "div",
              {
                onClick: () => toggleOption(opt.value),
                className: `boost-filter-opt ${checked ? "checked" : ""}`,
                style: {
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  padding: "7px 10px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontSize: "13px",
                  color: "var(--boost-text, #1e293b)",
                  backgroundColor: checked ? "rgba(99, 102, 241, 0.08)" : "transparent",
                  transition: "background-color 0.15s ease"
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
                  typeof opt.count === "number" && /* @__PURE__ */ jsx("span", { style: { fontSize: "11px", color: "var(--boost-muted, #94a3b8)", fontWeight: 500 }, children: opt.count })
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
  options = [],
  currentValue = options[0]?.value || "",
  currentDirection = "asc",
  onChange,
  label = "Sort by",
  className = "",
  style
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
  const currentOption = (options || []).find((o) => o.value === currentValue);
  return /* @__PURE__ */ jsxs("div", { className: `boost-sort-wrapper ${className || ""}`, style: { position: "relative", display: "inline-flex", alignItems: "center", fontFamily: "inherit", ...style }, children: [
    /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-sort-box,
          .dark .boost-sort-box {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
          }
          :root[data-theme="dark"] .boost-sort-btn,
          .dark .boost-sort-btn {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-sort-dir-btn,
          .dark .boost-sort-dir-btn {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-left-color: rgba(255, 255, 255, 0.1) !important;
            color: #cbd5e1 !important;
          }
          :root[data-theme="dark"] .boost-sort-dropdown,
          .dark .boost-sort-dropdown {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-sort-opt,
          .dark .boost-sort-opt {
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-sort-opt:hover,
          .dark .boost-sort-opt:hover {
            background-color: rgba(255, 255, 255, 0.05) !important;
          }
          :root[data-theme="dark"] .boost-sort-opt.active,
          .dark .boost-sort-opt.active {
            background-color: rgba(99, 102, 241, 0.12) !important;
            color: #818cf8 !important;
          }
        ` }),
    /* @__PURE__ */ jsxs(
      "div",
      {
        className: "boost-sort-box",
        style: {
          display: "inline-flex",
          alignItems: "center",
          border: "1px solid var(--boost-border, #cbd5e1)",
          borderRadius: "var(--boost-radius, 8px)",
          backgroundColor: "var(--boost-surface, #ffffff)",
          overflow: "hidden",
          boxShadow: "var(--boost-shadow-sm, 0 1px 2px rgba(0,0,0,0.03))"
        },
        children: [
          /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => setIsOpen(!isOpen),
              className: "boost-sort-btn",
              style: {
                display: "inline-flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 12px",
                fontSize: "13px",
                fontWeight: 500,
                color: "var(--boost-text, #334155)",
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
                /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-muted, #64748b)" }, children: [
                  label,
                  ":"
                ] }),
                /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: currentOption?.label || currentValue }),
                /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: /* @__PURE__ */ jsx("polyline", { points: "6 9 12 15 18 9" }) })
              ]
            }
          ),
          /* @__PURE__ */ jsx(
            "button",
            {
              onClick: handleToggleDirection,
              title: currentDirection === "asc" ? "Ascending" : "Descending",
              className: "boost-sort-dir-btn",
              style: {
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 10px",
                backgroundColor: "var(--boost-bg-subtle, #f8fafc)",
                borderLeft: "1px solid var(--boost-border, #e2e8f0)",
                borderTop: "none",
                borderRight: "none",
                borderBottom: "none",
                cursor: "pointer",
                color: "var(--boost-muted, #475569)"
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
        className: "boost-sort-dropdown",
        style: {
          position: "absolute",
          top: "calc(100% + 6px)",
          left: 0,
          zIndex: 50,
          minWidth: "200px",
          backgroundColor: "var(--boost-surface, #ffffff)",
          border: "1px solid var(--boost-border, #e2e8f0)",
          borderRadius: "var(--boost-radius, 8px)",
          boxShadow: "0 10px 25px -5px rgba(0,0,0,0.15)",
          padding: "4px"
        },
        children: options.map((opt) => {
          const isSelected = opt.value === currentValue;
          return /* @__PURE__ */ jsxs(
            "button",
            {
              onClick: () => handleSelect(opt.value),
              className: `boost-sort-opt ${isSelected ? "active" : ""}`,
              style: {
                display: "flex",
                width: "100%",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "8px 12px",
                fontSize: "13px",
                color: isSelected ? "var(--boost-primary, #2563eb)" : "var(--boost-text, #334155)",
                fontWeight: isSelected ? 600 : 400,
                backgroundColor: isSelected ? "rgba(37, 99, 235, 0.08)" : "transparent",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                textAlign: "left",
                transition: "background-color 0.15s ease"
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: opt.label }),
                isSelected && /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
              ]
            },
            opt.value
          );
        })
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
  subtitle = "Welcome back! Please enter your details.",
  className = "",
  style
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
      className: `boost-auth-card ${className || ""}`,
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
        transition: "all 0.2s ease",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-auth-card,
          .dark .boost-auth-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-auth-input,
          .dark .boost-auth-input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-auth-input:focus,
          .dark .boost-auth-input:focus {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
          }
        ` }),
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
                className: "boost-auth-input",
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
                  className: "boost-auth-input",
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
      className: "boost-auth-card",
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-auth-card,
          .dark .boost-auth-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-auth-input,
          .dark .boost-auth-input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-auth-input:focus,
          .dark .boost-auth-input:focus {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
          }
        ` }),
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
      className: "boost-auth-card",
      style: {
        maxWidth: "420px",
        width: "100%",
        margin: "0 auto",
        padding: "clamp(24px, 5vw, 36px) clamp(18px, 4vw, 28px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        boxShadow: "var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-auth-card,
          .dark .boost-auth-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-auth-input,
          .dark .boost-auth-input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-auth-input:focus,
          .dark .boost-auth-input:focus {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "var(--boost-primary, #6366f1)",
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
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(20px, 3vw, 22px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 6px", letterSpacing: "-0.02em" }, children: "Forgot password?" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "var(--boost-muted, #64748b)", margin: 0, lineHeight: 1.5 }, children: "No worries, we will send you reset instructions." })
        ] }),
        successMessage ? /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              padding: "16px",
              backgroundColor: "rgba(16, 185, 129, 0.1)",
              border: "1px solid rgba(16, 185, 129, 0.2)",
              borderRadius: "8px",
              color: "#10b981",
              fontSize: "13px",
              textAlign: "center",
              lineHeight: 1.5
            },
            children: successMessage
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
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                border: "1px solid rgba(239, 68, 68, 0.2)",
                borderRadius: "8px",
                color: "#ef4444",
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
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Email Address" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "email",
                required: true,
                value: email,
                onChange: (e) => setEmail(e.target.value),
                placeholder: "you@example.com",
                className: "boost-auth-input",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  backgroundColor: "var(--boost-surface, #ffffff)",
                  color: "var(--boost-text, #0f172a)",
                  border: "1px solid var(--boost-border, #cbd5e1)",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s"
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
                padding: "12px",
                background: "linear-gradient(135deg, var(--boost-primary, #6366f1) 0%, #4f46e5 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
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
                /* @__PURE__ */ jsx("span", { children: "Send Reset Instructions" })
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
      className: "boost-auth-card",
      style: {
        maxWidth: "420px",
        width: "100%",
        margin: "0 auto",
        padding: "clamp(24px, 5vw, 36px) clamp(18px, 4vw, 28px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        borderRadius: "var(--boost-radius, 16px)",
        boxShadow: "var(--boost-shadow-md, 0 10px 25px -5px rgba(0, 0, 0, 0.05))",
        fontFamily: "inherit",
        boxSizing: "border-box",
        transition: "all 0.2s ease"
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-auth-card,
          .dark .boost-auth-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-auth-input,
          .dark .boost-auth-input {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.15) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-auth-input:focus,
          .dark .boost-auth-input:focus {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.25) !important;
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { style: { textAlign: "center", marginBottom: "24px" }, children: [
          /* @__PURE__ */ jsx(
            "div",
            {
              style: {
                width: "48px",
                height: "48px",
                borderRadius: "24px",
                backgroundColor: "rgba(99, 102, 241, 0.12)",
                color: "var(--boost-primary, #6366f1)",
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
          /* @__PURE__ */ jsx("h2", { style: { fontSize: "clamp(20px, 3vw, 22px)", fontWeight: 700, color: "var(--boost-text, #0f172a)", margin: "0 0 6px", letterSpacing: "-0.02em" }, children: "Set new password" }),
          /* @__PURE__ */ jsx("p", { style: { fontSize: "13px", color: "var(--boost-muted, #64748b)", margin: 0, lineHeight: 1.5 }, children: "Must be at least 8 characters long." })
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
              backgroundColor: "rgba(239, 68, 68, 0.1)",
              border: "1px solid rgba(239, 68, 68, 0.2)",
              borderRadius: "8px",
              color: "#ef4444",
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
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "New Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                value: password,
                onChange: (e) => setPassword(e.target.value),
                placeholder: "Enter new password",
                className: "boost-auth-input",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  backgroundColor: "var(--boost-surface, #ffffff)",
                  color: "var(--boost-text, #0f172a)",
                  border: "1px solid var(--boost-border, #cbd5e1)",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s"
                }
              }
            )
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: { display: "block", fontSize: "13px", fontWeight: 600, color: "var(--boost-text, #334155)", marginBottom: "6px" }, children: "Confirm Password" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "password",
                required: true,
                value: confirmPassword,
                onChange: (e) => setConfirmPassword(e.target.value),
                placeholder: "Re-enter new password",
                className: "boost-auth-input",
                style: {
                  width: "100%",
                  boxSizing: "border-box",
                  padding: "11px 14px",
                  fontSize: "14px",
                  backgroundColor: "var(--boost-surface, #ffffff)",
                  color: "var(--boost-text, #0f172a)",
                  border: "1px solid var(--boost-border, #cbd5e1)",
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s, box-shadow 0.2s"
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
                padding: "12px",
                background: "linear-gradient(135deg, var(--boost-primary, #6366f1) 0%, #4f46e5 100%)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
                opacity: loading ? 0.7 : 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                transition: "transform 0.15s ease, box-shadow 0.15s ease"
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
  isOpen = false,
  onClose = () => {
  },
  items = [],
  subtotal = 0,
  currencySymbol = "$",
  freeShippingThreshold = 50,
  onUpdateQuantity = () => {
  },
  onRemoveItem = () => {
  },
  onCheckout = () => {
  },
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
        :root[data-theme="dark"] .boost-cart-drawer-panel,
        .dark .boost-cart-drawer-panel {
          background-color: var(--boost-bg, #0f172a) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-cart-header,
        .dark .boost-cart-header,
        :root[data-theme="dark"] .boost-shipping-banner,
        .dark .boost-shipping-banner,
        :root[data-theme="dark"] .boost-cart-footer,
        .dark .boost-cart-footer {
          background-color: #1e293b !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
        }
        :root[data-theme="dark"] .boost-cart-qty,
        .dark .boost-cart-qty {
          background-color: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
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
                  className: "boost-cart-header",
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
                  className: "boost-shipping-banner",
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
                            currencySymbol,
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
                    /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          width: "64px",
                          height: "64px",
                          borderRadius: "10px",
                          border: "1px solid var(--boost-border, #e2e8f0)",
                          backgroundColor: "var(--boost-surface, #f8fafc)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          overflow: "hidden"
                        },
                        children: item.image ? /* @__PURE__ */ jsx(
                          "img",
                          {
                            src: item.image,
                            alt: item.title,
                            style: {
                              width: "100%",
                              height: "100%",
                              objectFit: "cover"
                            }
                          }
                        ) : /* @__PURE__ */ jsxs("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.5", strokeLinecap: "round", strokeLinejoin: "round", style: { color: "var(--boost-text-muted, #94a3b8)" }, children: [
                          /* @__PURE__ */ jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                          /* @__PURE__ */ jsx("circle", { cx: "8.5", cy: "8.5", r: "1.5" }),
                          /* @__PURE__ */ jsx("polyline", { points: "21 15 16 10 5 21" })
                        ] })
                      }
                    ),
                    /* @__PURE__ */ jsxs("div", { style: { flex: 1, minWidth: 0, textAlign: "left" }, children: [
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
                      item.variantTitle && /* @__PURE__ */ jsx("div", { style: { fontSize: "12px", color: "var(--boost-text-muted, #64748b)", marginTop: "4px" }, children: item.variantTitle }),
                      /* @__PURE__ */ jsxs("div", { style: { fontSize: "14px", fontWeight: 800, color: "var(--boost-text, #0f172a)", marginTop: "6px" }, children: [
                        currencySymbol,
                        item.price
                      ] })
                    ] }),
                    /* @__PURE__ */ jsxs(
                      "div",
                      {
                        className: "boost-cart-qty",
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
                  className: "boost-cart-footer",
                  style: {
                    padding: "16px 20px",
                    borderTop: "1px solid var(--boost-border, #e2e8f0)",
                    backgroundColor: "var(--boost-surface, #f8fafc)"
                  },
                  children: [
                    /* @__PURE__ */ jsxs("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "14px" }, children: [
                      /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", color: "var(--boost-text-muted, #64748b)" }, children: "Subtotal:" }),
                      /* @__PURE__ */ jsxs("span", { style: { fontSize: "20px", fontWeight: 800, color: "var(--boost-text, #0f172a)" }, children: [
                        currencySymbol,
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
  title = "Product",
  price = 0,
  currencySymbol = "$",
  compareAtPrice,
  originalPrice,
  image,
  onAddToCart = () => {
  },
  onBuyNow,
  inStock = true,
  className = "",
  style
}) => {
  const finalComparePrice = compareAtPrice ?? originalPrice;
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
      className: `boost-sticky-bar ${className}`,
      style: {
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        padding: "12px 20px",
        zIndex: 999,
        fontFamily: "inherit",
        color: "var(--boost-text-primary, #0f172a)",
        transition: "all 0.3s ease",
        containerType: "inline-size",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-sticky-bar {
            background-color: var(--boost-surface, rgba(255, 255, 255, 0.92));
            box-shadow: 0 -10px 40px -10px rgba(0, 0, 0, 0.1);
            border-top: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          }
          :root[data-theme="dark"] .boost-sticky-bar,
          .dark .boost-sticky-bar {
            background-color: var(--boost-surface, rgba(15, 23, 42, 0.95)) !important;
            border-top: 1px solid rgba(255, 255, 255, 0.12) !important;
            box-shadow: 0 -10px 40px -10px rgba(0, 0, 0, 0.7) !important;
            color: #f8fafc !important;
          }
          .boost-sticky-bar-content {
            display: flex;
            align-items: center;
            justify-content: space-between;
            max-width: 1200px;
            margin: 0 auto;
            gap: 16px;
            flex-wrap: wrap;
          }
          .boost-sticky-product {
            display: flex;
            align-items: center;
            gap: 16px;
            flex: 1;
            min-width: 0;
          }
          .boost-sticky-actions {
            display: flex;
            align-items: center;
            gap: 12px;
          }
          .boost-sticky-qty {
            display: flex;
            align-items: center;
            background: var(--boost-bg-muted, rgba(0,0,0,0.04));
            border-radius: 8px;
            border: 1px solid var(--boost-border, rgba(0,0,0,0.08));
          }
          .boost-sticky-btn-primary, .boost-sticky-btn-secondary {
            border: none;
            border-radius: 8px;
            padding: 12px 24px;
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.1s, opacity 0.2s, background-color 0.2s;
            white-space: nowrap;
          }
          .boost-sticky-btn-primary:active, .boost-sticky-btn-secondary:active {
            transform: scale(0.98);
          }
          .boost-sticky-btn-primary {
            background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
            color: #ffffff;
            box-shadow: 0 4px 12px rgba(79, 70, 229, 0.3);
          }
          .boost-sticky-btn-primary:hover {
            box-shadow: 0 6px 16px rgba(79, 70, 229, 0.45);
          }
          .boost-sticky-btn-secondary {
            background-color: var(--boost-surface, rgba(255, 255, 255, 0.08));
            color: var(--boost-text-primary, #0f172a);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.12));
          }
          
          /* Dark mode specific overrides */
          :root[data-theme="dark"] .boost-sticky-btn-secondary,
          .dark .boost-sticky-btn-secondary {
            background-color: rgba(255, 255, 255, 0.08);
            color: #f8fafc;
            border-color: rgba(255, 255, 255, 0.15);
          }
          :root[data-theme="dark"] .boost-sticky-qty,
          .dark .boost-sticky-qty {
            background: rgba(255, 255, 255, 0.06);
            border-color: rgba(255, 255, 255, 0.12);
            color: #f8fafc;
          }

          /* Mobile Optimization using Container Queries for perfect responsiveness anywhere */
          @container (max-width: 600px) {
            .boost-sticky-bar {
              padding: 12px 16px !important;
            }
            .boost-sticky-bar-content {
              flex-direction: column;
              align-items: stretch;
              gap: 12px;
            }
            .boost-sticky-product {
              justify-content: space-between;
              width: 100%;
            }
            .boost-sticky-product-title {
              font-size: 13px !important;
              max-width: 120px;
            }
            .boost-sticky-actions {
              width: 100%;
              justify-content: stretch;
            }
            .boost-sticky-actions > button {
              flex: 1;
              padding: 12px 8px;
            }
            .boost-sticky-qty {
              display: none !important; /* Hide quantity to give buttons more space */
            }
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { className: "boost-sticky-bar-content", children: [
          /* @__PURE__ */ jsxs("div", { className: "boost-sticky-product", children: [
            image && /* @__PURE__ */ jsx(
              "img",
              {
                src: image,
                alt: title,
                style: { width: "48px", height: "48px", objectFit: "cover", borderRadius: "8px", border: "1px solid var(--boost-border, rgba(0,0,0,0.1))" }
              }
            ),
            /* @__PURE__ */ jsxs("div", { style: { minWidth: 0, flex: 1 }, children: [
              /* @__PURE__ */ jsx("div", { className: "boost-sticky-product-title", style: { fontSize: "14px", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }, children: title }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }, children: [
                /* @__PURE__ */ jsxs("span", { style: { fontSize: "16px", fontWeight: 700 }, children: [
                  currencySymbol,
                  price
                ] }),
                finalComparePrice && finalComparePrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "13px", color: "var(--boost-text-muted, #94a3b8)", textDecoration: "line-through" }, children: [
                  currencySymbol,
                  finalComparePrice
                ] })
              ] })
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { className: "boost-sticky-actions", children: [
            /* @__PURE__ */ jsxs("div", { className: "boost-sticky-qty", children: [
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQuantity(Math.max(1, quantity - 1)),
                  "aria-label": "Decrease quantity",
                  disabled: isAdding || isBuying,
                  style: { padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px", fontWeight: 500, color: "inherit" },
                  children: "-"
                }
              ),
              /* @__PURE__ */ jsx("span", { style: { padding: "8px", fontSize: "14px", fontWeight: 600, minWidth: "32px", textAlign: "center" }, children: quantity }),
              /* @__PURE__ */ jsx(
                "button",
                {
                  onClick: () => setQuantity(quantity + 1),
                  "aria-label": "Increase quantity",
                  disabled: isAdding || isBuying,
                  style: { padding: "8px 14px", border: "none", background: "transparent", cursor: "pointer", fontSize: "16px", fontWeight: 500, color: "inherit" },
                  children: "+"
                }
              )
            ] }),
            /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleAddToCart,
                disabled: !inStock || isAdding || isBuying,
                className: "boost-sticky-btn-primary",
                style: {
                  backgroundColor: !inStock ? "var(--boost-bg-muted, #9ca3af)" : addedFeedback ? "#10b981" : void 0,
                  opacity: (!inStock || isAdding || isBuying) && !addedFeedback ? 0.7 : 1,
                  cursor: !inStock || isAdding || isBuying ? "not-allowed" : "pointer"
                },
                children: !inStock ? "Sold Out" : isAdding ? "Adding..." : addedFeedback ? "Added! \u2713" : "Add to Cart"
              }
            ),
            onBuyNow && inStock && /* @__PURE__ */ jsx(
              "button",
              {
                onClick: handleBuyNow,
                disabled: isAdding || isBuying,
                className: "boost-sticky-btn-secondary",
                style: {
                  opacity: isAdding || isBuying ? 0.7 : 1,
                  cursor: isAdding || isBuying ? "not-allowed" : "pointer"
                },
                children: isBuying ? "Processing..." : "Buy Now"
              }
            )
          ] })
        ] })
      ]
    }
  );
};
StickyAddToCart.displayName = "StickyAddToCart";
var PincodeChecker = ({
  onCheck,
  defaultPincode = "",
  label = "Check Delivery & Serviceability",
  placeholder = "Enter Postal / PIN Code",
  buttonText = "Check",
  locale = "en-US",
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
    if (!clean || clean.length < 3) {
      setError("Please enter a valid postal code");
      setResult(null);
      return;
    }
    const currentReqId = ++activeRequestIdRef.current;
    setError(null);
    setLoading(true);
    try {
      if (onCheck) {
        const timeoutPromise = new Promise(
          (_, reject) => setTimeout(() => reject(new Error("Postal code check timed out. Please try again.")), 1e4)
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
            estimatedDeliveryDate: deliveryDate.toLocaleDateString(locale, options),
            isCodAvailable: true,
            courier: "Express Courier"
          });
        }
      }
    } catch (err) {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setError(err.message || "Failed to verify postal code");
      }
    } finally {
      if (isMountedRef.current && currentReqId === activeRequestIdRef.current) {
        setLoading(false);
      }
    }
  };
  return /* @__PURE__ */ jsxs("div", { style: { margin: "14px 0", fontFamily: "inherit" }, className: `boost-pincode-checker ${className}`, children: [
    /* @__PURE__ */ jsxs("div", { style: { fontSize: "14px", fontWeight: 600, color: "var(--boost-text-primary, inherit)", marginBottom: "10px", display: "flex", alignItems: "center", gap: "8px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", opacity: 0.8, children: [
        /* @__PURE__ */ jsx("rect", { x: "1", y: "3", width: "15", height: "13", rx: "1" }),
        /* @__PURE__ */ jsx("polygon", { points: "16 8 20 8 23 11 23 16 16 16 16 8" }),
        /* @__PURE__ */ jsx("circle", { cx: "5.5", cy: "18.5", r: "2.5" }),
        /* @__PURE__ */ jsx("circle", { cx: "18.5", cy: "18.5", r: "2.5" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: label })
    ] }),
    /* @__PURE__ */ jsxs("div", { style: { display: "flex", gap: "8px", maxWidth: "340px" }, children: [
      /* @__PURE__ */ jsx(
        "input",
        {
          type: "text",
          maxLength: 10,
          placeholder,
          value: pincode,
          onChange: (e) => setPincode(e.target.value),
          onKeyDown: (e) => e.key === "Enter" && handleCheck(),
          style: {
            flex: 1,
            padding: "10px 14px",
            borderRadius: "8px",
            border: "1px solid var(--boost-border, #334155)",
            backgroundColor: "transparent",
            color: "var(--boost-text-primary, inherit)",
            fontSize: "14px",
            outline: "none",
            transition: "border-color 0.2s"
          }
        }
      ),
      /* @__PURE__ */ jsx(
        "button",
        {
          onClick: handleCheck,
          disabled: loading || !pincode.trim(),
          style: {
            backgroundColor: "var(--boost-primary, #3b82f6)",
            color: "#ffffff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "14px",
            fontWeight: 600,
            cursor: loading || !pincode.trim() ? "not-allowed" : "pointer",
            opacity: loading || !pincode.trim() ? 0.6 : 1,
            transition: "opacity 0.2s, background-color 0.2s"
          },
          children: loading ? "Checking..." : buttonText
        }
      )
    ] }),
    error && /* @__PURE__ */ jsxs("div", { style: { color: "#ef4444", fontSize: "13px", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
        /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
        /* @__PURE__ */ jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: error })
    ] }),
    result && /* @__PURE__ */ jsx("div", { style: { marginTop: "12px" }, children: result.isServiceable ? /* @__PURE__ */ jsxs("div", { style: { background: "rgba(34, 197, 94, 0.08)", padding: "12px 16px", borderRadius: "8px", border: "1px dashed rgba(34, 197, 94, 0.3)", display: "flex", flexDirection: "column", gap: "6px" }, children: [
      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", color: "#22c55e", fontSize: "14px" }, children: [
        /* @__PURE__ */ jsx("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }),
        /* @__PURE__ */ jsxs("strong", { children: [
          "Delivery by ",
          result.estimatedDeliveryDate
        ] })
      ] }),
      result.isCodAvailable && /* @__PURE__ */ jsxs("div", { style: { color: "var(--boost-text-muted, #94a3b8)", fontSize: "13px", display: "flex", alignItems: "center", gap: "8px", marginLeft: "2px" }, children: [
        /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
          /* @__PURE__ */ jsx("rect", { x: "2", y: "6", width: "20", height: "12", rx: "2" }),
          /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "2" })
        ] }),
        /* @__PURE__ */ jsx("span", { children: "Cash on Delivery (COD) is available" })
      ] })
    ] }) : /* @__PURE__ */ jsxs("div", { style: { background: "rgba(239, 68, 68, 0.08)", padding: "12px 16px", borderRadius: "8px", border: "1px dashed rgba(239, 68, 68, 0.3)", color: "#ef4444", display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", fontWeight: 500 }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", children: [
        /* @__PURE__ */ jsx("line", { x1: "18", y1: "6", x2: "6", y2: "18" }),
        /* @__PURE__ */ jsx("line", { x1: "6", y1: "6", x2: "18", y2: "18" })
      ] }),
      /* @__PURE__ */ jsx("span", { children: "Postal code currently not serviceable for delivery" })
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
  className = "",
  style
}) => {
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-trust-badges boost-layout-${layout} ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #f8fafc)",
        borderRadius: "16px",
        border: "1px solid var(--boost-border, rgba(0,0,0,0.06))",
        padding: "20px",
        margin: "16px 0",
        fontFamily: "inherit",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-trust-badges {
            transition: all 0.2s ease;
          }
          
          /* Grid Layout */
          .boost-trust-badges.boost-layout-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(125px, 1fr));
            gap: 20px;
            align-items: start;
          }

          @media (max-width: 580px) {
            .boost-trust-badges.boost-layout-grid {
              grid-template-columns: repeat(2, 1fr);
              gap: 14px;
              padding: 16px !important;
            }
          }
          
          /* Row Layout */
          .boost-trust-badges.boost-layout-row {
            display: flex;
            flex-wrap: wrap;
            gap: 24px;
            align-items: center;
            justify-content: center;
          }

          .boost-badge-item {
            display: flex;
            align-items: center;
            gap: 10px;
            color: var(--boost-text-primary, #334155);
            font-size: 13px;
            font-weight: 600;
            line-height: 1.3;
            transition: transform 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }
          
          .boost-badge-item:hover {
            transform: translateY(-2px);
          }

          .boost-badge-item:hover .boost-badge-icon-wrapper {
            transform: scale(1.08);
            box-shadow: 0 6px 16px rgba(0,0,0,0.08);
          }
          
          .boost-layout-grid .boost-badge-item {
            flex-direction: column;
            text-align: center;
            justify-content: center;
          }

          .boost-badge-icon-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 42px;
            height: 42px;
            border-radius: 12px;
            background: var(--boost-bg-muted, #ffffff);
            box-shadow: 0 4px 12px rgba(0,0,0,0.04);
            border: 1px solid var(--boost-border, rgba(0,0,0,0.05));
            flex-shrink: 0;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .boost-layout-row .boost-layout-grid-only {
            display: none;
          }

          /* Dark Mode Tweaks */
          :root[data-theme="dark"] .boost-trust-badges,
          .dark .boost-trust-badges {
            background-color: var(--boost-surface, #1e293b);
          }
          :root[data-theme="dark"] .boost-badge-icon-wrapper,
          .dark .boost-badge-icon-wrapper {
            background: rgba(255,255,255,0.04);
            box-shadow: 0 4px 12px rgba(0,0,0,0.25);
            border-color: rgba(255,255,255,0.08);
          }
        ` }),
        showGenuineBadge && /* @__PURE__ */ jsxs("div", { className: "boost-badge-item", children: [
          /* @__PURE__ */ jsx("div", { className: "boost-badge-icon-wrapper", style: { color: "var(--boost-success, #10b981)" }, children: /* @__PURE__ */ jsx("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("path", { d: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" }) }) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "100%",
            /* @__PURE__ */ jsx("br", { className: "boost-layout-grid-only" }),
            " Genuine"
          ] })
        ] }),
        showReturnsBadge && /* @__PURE__ */ jsxs("div", { className: "boost-badge-item", children: [
          /* @__PURE__ */ jsx("div", { className: "boost-badge-icon-wrapper", style: { color: "var(--boost-primary, #3b82f6)" }, children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" }),
            /* @__PURE__ */ jsx("path", { d: "M21 3v5h-5" }),
            /* @__PURE__ */ jsx("path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" }),
            /* @__PURE__ */ jsx("path", { d: "M8 16H3v5" })
          ] }) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "7-Day",
            /* @__PURE__ */ jsx("br", { className: "boost-layout-grid-only" }),
            " Easy Returns"
          ] })
        ] }),
        showCodBadge && /* @__PURE__ */ jsxs("div", { className: "boost-badge-item", children: [
          /* @__PURE__ */ jsx("div", { className: "boost-badge-icon-wrapper", style: { color: "var(--boost-warning, #f59e0b)" }, children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
            /* @__PURE__ */ jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
          ] }) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "COD",
            /* @__PURE__ */ jsx("br", { className: "boost-layout-grid-only" }),
            " Available"
          ] })
        ] }),
        showSecureBadge && /* @__PURE__ */ jsxs("div", { className: "boost-badge-item", children: [
          /* @__PURE__ */ jsx("div", { className: "boost-badge-icon-wrapper", style: { color: "var(--boost-danger, #ef4444)" }, children: /* @__PURE__ */ jsxs("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("rect", { x: "3", y: "11", width: "18", height: "11", rx: "2", ry: "2" }),
            /* @__PURE__ */ jsx("path", { d: "M7 11V7a5 5 0 0 1 10 0v4" })
          ] }) }),
          /* @__PURE__ */ jsxs("span", { children: [
            "256-Bit SSL",
            /* @__PURE__ */ jsx("br", { className: "boost-layout-grid-only" }),
            " Secure"
          ] })
        ] })
      ]
    }
  );
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
  const progressPercent = currentIndex >= 0 ? currentIndex / (STAGES.length - 1) * 100 : 0;
  return /* @__PURE__ */ jsxs("div", { className: `boost-order-timeline ${className}`, style: { padding: "16px 8px", width: "100%", boxSizing: "border-box" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        .boost-timeline-container {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          position: relative;
          width: 100%;
        }
        .boost-timeline-track-bg {
          position: absolute;
          top: 15px;
          left: 18px;
          right: 18px;
          height: 3px;
          background-color: var(--boost-border, #e2e8f0);
          z-index: 0;
          border-radius: 9999px;
        }
        .boost-timeline-track-fill {
          position: absolute;
          top: 15px;
          left: 18px;
          height: 3px;
          background: linear-gradient(90deg, #10b981, #059669);
          z-index: 1;
          border-radius: 9999px;
          transition: width 0.4s ease;
        }
        :root[data-theme="dark"] .boost-timeline-track-bg,
        .dark .boost-timeline-track-bg {
          background-color: rgba(255, 255, 255, 0.1) !important;
        }
        .boost-timeline-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          position: relative;
          z-index: 2;
          flex: 1;
          max-width: 90px;
        }
        .boost-timeline-node {
          width: 32px;
          height: 32px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 13px;
          font-weight: 700;
          transition: all 0.3s ease;
        }
        .boost-timeline-node.passed {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 2px 10px rgba(16, 185, 129, 0.35);
        }
        .boost-timeline-node.current {
          background: #10b981;
          color: #ffffff;
          box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.25), 0 4px 14px rgba(16, 185, 129, 0.4);
          animation: boostPulse 2s infinite;
        }
        .boost-timeline-node.upcoming {
          background: var(--boost-surface, #ffffff);
          border: 2px solid var(--boost-border, #cbd5e1);
          color: var(--boost-text-muted, #94a3b8);
        }
        :root[data-theme="dark"] .boost-timeline-node.upcoming,
        .dark .boost-timeline-node.upcoming {
          background: #111827 !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          color: rgba(255, 255, 255, 0.4) !important;
        }
        .boost-timeline-label {
          margin-top: 8px;
          font-size: 11px;
          text-align: center;
          line-height: 1.25;
          letter-spacing: -0.01em;
        }
        .boost-timeline-label.current {
          font-weight: 700;
          color: var(--boost-text-primary, #0f172a);
        }
        .boost-timeline-label.passed {
          font-weight: 600;
          color: var(--boost-text-primary, #0f172a);
        }
        .boost-timeline-label.upcoming {
          font-weight: 500;
          color: var(--boost-text-muted, #94a3b8);
        }
        :root[data-theme="dark"] .boost-timeline-label.current,
        .dark .boost-timeline-label.current {
          color: #ffffff !important;
        }
        :root[data-theme="dark"] .boost-timeline-label.passed,
        .dark .boost-timeline-label.passed {
          color: #e2e8f0 !important;
        }
        :root[data-theme="dark"] .boost-timeline-label.upcoming,
        .dark .boost-timeline-label.upcoming {
          color: #64748b !important;
        }
        @keyframes boostPulse {
          0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.4); }
          70% { box-shadow: 0 0 0 8px rgba(16, 185, 129, 0); }
          100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
        }
      ` }),
    /* @__PURE__ */ jsxs("div", { className: "boost-timeline-container", children: [
      /* @__PURE__ */ jsx("div", { className: "boost-timeline-track-bg" }),
      /* @__PURE__ */ jsx(
        "div",
        {
          className: "boost-timeline-track-fill",
          style: { width: `calc(${progressPercent}% * 0.88)` }
        }
      ),
      STAGES.map((stage, idx) => {
        const isPassed = idx < currentIndex;
        const isCurrent = idx === currentIndex;
        const status = isCurrent ? "current" : isPassed ? "passed" : "upcoming";
        return /* @__PURE__ */ jsxs("div", { className: "boost-timeline-step", children: [
          /* @__PURE__ */ jsx("div", { className: `boost-timeline-node ${status}`, children: isPassed ? /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) : isCurrent ? /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "4", fill: "currentColor" }) }) : idx + 1 }),
          /* @__PURE__ */ jsx("div", { className: `boost-timeline-label ${status}`, children: stage.label }),
          dates[stage.id] && /* @__PURE__ */ jsx("div", { style: { fontSize: "10px", color: "var(--boost-text-muted, #94a3b8)", marginTop: "3px" }, children: dates[stage.id] })
        ] }, stage.id);
      })
    ] })
  ] });
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
  const gradientId = React.useId ? React.useId().replace(/:/g, "") : `half-star-${Math.random().toString(36).substring(2, 7)}`;
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
              fill: isFilled ? color : isHalf ? `url(#${gradientId})` : "none",
              stroke: color,
              strokeWidth: "2",
              strokeLinecap: "round",
              strokeLinejoin: "round",
              children: [
                /* @__PURE__ */ jsx("defs", { children: /* @__PURE__ */ jsxs("linearGradient", { id: gradientId, children: [
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: color }),
                  /* @__PURE__ */ jsx("stop", { offset: "50%", stopColor: "transparent", stopOpacity: "1" })
                ] }) }),
                /* @__PURE__ */ jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" })
              ]
            },
            star
          );
        }) }),
        showText && /* @__PURE__ */ jsxs("span", { style: { fontSize: `${size * 0.85}px`, fontWeight: 600, color: "var(--boost-text-primary, #374151)", marginLeft: "4px" }, children: [
          clamped.toFixed(1),
          reviewCount !== void 0 && /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-text-muted, #9ca3af)", fontWeight: 400, marginLeft: "4px" }, children: [
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
  groups = [],
  selectedValues,
  currencySymbol = "$",
  onChange,
  className = "",
  ...props
}) => {
  const values = selectedValues || props.selectedVariants || {};
  return /* @__PURE__ */ jsxs("div", { className: `boost-variant-selector ${className}`, style: { display: "flex", flexDirection: "column", gap: "18px", width: "100%" }, children: [
    /* @__PURE__ */ jsx("style", { children: `
        .boost-variant-label {
          font-size: 12px;
          font-weight: 800;
          text-transform: uppercase;
          color: var(--boost-text-primary, #0f172a);
          letter-spacing: 0.05em;
        }
        :root[data-theme="dark"] .boost-variant-label,
        .dark .boost-variant-label {
          color: #f8fafc !important;
        }
        .boost-variant-selected-val {
          font-weight: 600;
          color: var(--boost-primary, #6366f1);
          text-transform: none;
          margin-left: 4px;
        }
        .boost-variant-chip {
          padding: 8px 16px;
          border-radius: 10px;
          font-size: 13px;
          font-weight: 600;
          border: 1px solid var(--boost-border, #e2e8f0);
          background: var(--boost-surface, #ffffff);
          color: var(--boost-text-primary, #0f172a);
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
        .boost-variant-chip:hover:not(:disabled) {
          border-color: var(--boost-primary, #6366f1);
          transform: translateY(-1px);
        }
        .boost-variant-chip.selected {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          border-color: #4f46e5;
          color: #ffffff !important;
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        :root[data-theme="dark"] .boost-variant-chip,
        .dark .boost-variant-chip {
          background: rgba(255, 255, 255, 0.05) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f1f5f9 !important;
        }
        :root[data-theme="dark"] .boost-variant-chip:hover:not(:disabled),
        .dark .boost-variant-chip:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.1) !important;
          border-color: rgba(99, 102, 241, 0.5) !important;
        }
        :root[data-theme="dark"] .boost-variant-chip.selected,
        .dark .boost-variant-chip.selected {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%) !important;
          border-color: #6366f1 !important;
          color: #ffffff !important;
          box-shadow: 0 4px 18px rgba(99, 102, 241, 0.45) !important;
        }
        .boost-color-swatch {
          width: 36px;
          height: 36px;
          border-radius: 999px;
          cursor: pointer;
          position: relative;
          padding: 0;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          border: 2px solid rgba(0, 0, 0, 0.12);
        }
        .boost-color-swatch:hover:not(:disabled) {
          transform: scale(1.1);
        }
        .boost-color-swatch.selected {
          transform: scale(1.15);
          box-shadow: 0 0 0 2px var(--boost-surface, #ffffff), 0 0 0 4px #6366f1;
        }
        :root[data-theme="dark"] .boost-color-swatch,
        .dark .boost-color-swatch {
          border-color: rgba(255, 255, 255, 0.2);
        }
        :root[data-theme="dark"] .boost-color-swatch.selected,
        .dark .boost-color-swatch.selected {
          box-shadow: 0 0 0 2px #0f172a, 0 0 0 4px #818cf8;
        }
      ` }),
    groups.map((group) => {
      const selected = values[group.name];
      const isColor = group.type === "color";
      return /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: [
        /* @__PURE__ */ jsx("div", { style: { display: "flex", justifyContent: "space-between", alignItems: "center" }, children: /* @__PURE__ */ jsxs("span", { className: "boost-variant-label", children: [
          group.name,
          ":",
          /* @__PURE__ */ jsx("span", { className: "boost-variant-selected-val", children: selected || "Select option" })
        ] }) }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }, children: group.options.map((opt) => {
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
                className: `boost-color-swatch ${isSelected ? "selected" : ""}`,
                style: {
                  backgroundColor: opt.colorHex,
                  cursor: isOutOfStock ? "not-allowed" : "pointer",
                  opacity: isOutOfStock ? 0.35 : 1
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
              className: `boost-variant-chip ${isSelected ? "selected" : ""}`,
              style: {
                cursor: isOutOfStock ? "not-allowed" : "pointer",
                textDecoration: isOutOfStock ? "line-through" : "none",
                opacity: isOutOfStock ? 0.45 : 1
              },
              children: [
                /* @__PURE__ */ jsx("span", { children: optDisplay }),
                opt.priceDelta && opt.priceDelta > 0 && /* @__PURE__ */ jsxs("span", { style: { fontSize: "11px", marginLeft: "5px", opacity: 0.85 }, children: [
                  "(+",
                  currencySymbol,
                  opt.priceDelta,
                  ")"
                ] })
              ]
            },
            opt.id
          );
        }) })
      ] }, group.name);
    })
  ] });
};
VariantSelector.displayName = "VariantSelector";
var ProductCard = ({
  id = "",
  title = "Product",
  price = 0,
  currencySymbol = "$",
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
                    currencySymbol,
                    price
                  ] }),
                  effectiveOriginalPrice && effectiveOriginalPrice > price && /* @__PURE__ */ jsxs("span", { style: { fontSize: "12px", color: "var(--boost-text-muted, #94a3b8)", textDecoration: "line-through" }, children: [
                    currencySymbol,
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
        backgroundColor: "var(--boost-bg-subtle, rgba(255, 255, 255, 0.05))",
        border: "1px solid var(--boost-border, rgba(255, 255, 255, 0.12))",
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
              backgroundColor: value <= min ? "transparent" : "var(--boost-surface, rgba(255, 255, 255, 0.1))",
              color: value <= min ? "var(--boost-text-muted, #64748b)" : "var(--boost-text-primary, #0f172a)",
              border: value <= min ? "none" : "1px solid var(--boost-border, rgba(255, 255, 255, 0.12))",
              borderRadius: "7px",
              cursor: value <= min ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value <= min ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
              transition: "all 0.15s ease"
            },
            children: /* @__PURE__ */ jsx("svg", { width: "12", height: "2", viewBox: "0 0 12 2", fill: "none", children: /* @__PURE__ */ jsx("path", { d: "M1 1H11", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round" }) })
          }
        ),
        /* @__PURE__ */ jsx(
          "span",
          {
            style: {
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              color: "var(--boost-text-primary, #0f172a)",
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
              backgroundColor: value >= max ? "transparent" : "var(--boost-surface, rgba(255, 255, 255, 0.1))",
              color: value >= max ? "var(--boost-text-muted, #64748b)" : "var(--boost-text-primary, #0f172a)",
              border: value >= max ? "none" : "1px solid var(--boost-border, rgba(255, 255, 255, 0.12))",
              borderRadius: "7px",
              cursor: value >= max ? "not-allowed" : "pointer",
              fontWeight: 700,
              fontSize: sizeStyles.fontSize,
              boxShadow: value >= max ? "none" : "0 1px 3px rgba(0,0,0,0.08)",
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
  className = "",
  style
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
        flexWrap: "wrap",
        alignItems: "center",
        gap: "40px",
        padding: "32px",
        backgroundColor: "var(--boost-surface, #ffffff)",
        borderRadius: "24px",
        border: "1px solid var(--boost-border, rgba(0,0,0,0.05))",
        boxShadow: "0 20px 40px -20px var(--boost-shadow, rgba(0,0,0,0.05))",
        fontFamily: "inherit",
        width: "100%",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-review-left {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            flex: 1 1 200px; /* Flex grow, shrink, and basis */
            text-align: center;
          }
          .boost-review-score {
            font-size: 56px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            line-height: 1;
            letter-spacing: -0.03em;
            margin-bottom: 12px;
          }
          .boost-review-stars {
            display: flex;
            justify-content: center;
            margin-bottom: 8px;
          }
          .boost-review-total {
            font-size: 13px;
            color: var(--boost-text-muted, #64748b);
            font-weight: 500;
          }
          
          .boost-review-right {
            flex: 2 1 300px; /* Take up more space, wrap if < 300px */
            display: flex;
            flex-direction: column;
            gap: 12px;
          }
          
          .boost-review-row {
            display: flex;
            align-items: center;
            gap: 16px;
            transition: opacity 0.2s ease, transform 0.2s ease;
          }
          .boost-review-row:hover {
            transform: translateX(2px);
          }
          
          .boost-review-star-label {
            display: flex;
            align-items: center;
            gap: 6px;
            min-width: 44px;
            font-size: 14px;
            font-weight: 600;
            color: var(--boost-text-primary, #334155);
          }
          
          .boost-review-track {
            flex: 1;
            height: 10px;
            background-color: var(--boost-bg-muted, #f1f5f9);
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.02);
            min-width: 100px; /* Ensure track never disappears completely */
          }
          
          .boost-review-fill {
            height: 100%;
            border-radius: 9999px;
            transition: width 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
            position: relative;
          }
          .boost-review-fill::after {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(180deg, rgba(255,255,255,0.2) 0%, rgba(255,255,255,0) 100%);
            border-radius: inherit;
          }
          
          .boost-review-percent {
            min-width: 40px;
            text-align: right;
            font-size: 13px;
            color: var(--boost-text-secondary, #475569);
            font-weight: 600;
            font-variant-numeric: tabular-nums;
          }

          /* Dark Mode Tweaks */
          :root[data-theme="dark"] .boost-review-track,
          .dark .boost-review-track {
            background-color: rgba(255, 255, 255, 0.05);
            box-shadow: inset 0 1px 2px rgba(0,0,0,0.2);
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { className: "boost-review-left", children: [
          /* @__PURE__ */ jsx("span", { className: "boost-review-score", children: safeRating.toFixed(1) }),
          /* @__PURE__ */ jsx("div", { className: "boost-review-stars", children: /* @__PURE__ */ jsx(StarRating, { rating: safeRating, size: 24 }) }),
          /* @__PURE__ */ jsxs("span", { className: "boost-review-total", children: [
            "Based on ",
            safeTotal.toLocaleString(),
            " reviews"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { className: "boost-review-right", children: rows.map(({ star, count }) => {
          const percent = safeTotal > 0 ? Math.round(count / safeTotal * 100) : 0;
          const isSelected = selectedStar === star;
          const fillColor = star >= 4 ? "var(--boost-success, #10b981)" : star === 3 ? "var(--boost-warning, #f59e0b)" : "var(--boost-danger, #ef4444)";
          return /* @__PURE__ */ jsxs(
            "div",
            {
              className: "boost-review-row",
              onClick: () => onFilterByStar && onFilterByStar(star),
              role: onFilterByStar ? "button" : void 0,
              tabIndex: onFilterByStar ? 0 : void 0,
              style: {
                cursor: onFilterByStar ? "pointer" : "default",
                opacity: selectedStar !== null && !isSelected ? 0.35 : 1
              },
              children: [
                /* @__PURE__ */ jsxs("div", { className: "boost-review-star-label", children: [
                  /* @__PURE__ */ jsx("span", { children: star }),
                  /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 20 20", fill: "var(--boost-warning, #f59e0b)", style: { filter: "drop-shadow(0 1px 2px rgba(245, 158, 11, 0.2))" }, children: /* @__PURE__ */ jsx("path", { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" }) })
                ] }),
                /* @__PURE__ */ jsx("div", { className: "boost-review-track", children: /* @__PURE__ */ jsx(
                  "div",
                  {
                    className: "boost-review-fill",
                    style: {
                      width: `${percent}%`,
                      backgroundColor: fillColor
                    }
                  }
                ) }),
                /* @__PURE__ */ jsxs("span", { className: "boost-review-percent", children: [
                  percent,
                  "%"
                ] })
              ]
            },
            star
          );
        }) })
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
  backgroundColor = "linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #9333ea 100%)",
  textColor = "#ffffff",
  accentColor = "#fbbf24",
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
        background: backgroundColor,
        color: textColor,
        padding: "10px 18px",
        fontSize: "13px",
        fontWeight: 600,
        position: "relative",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        borderRadius: "12px",
        boxShadow: "0 4px 15px rgba(79, 70, 229, 0.25)",
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
  style,
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
        borderRadius: "16px",
        padding: "16px 20px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-lightning-deals-bar {
            background: linear-gradient(135deg, rgba(254, 243, 199, 0.45) 0%, rgba(254, 226, 226, 0.25) 100%), var(--boost-surface, #ffffff);
            border: 1px solid var(--boost-border, rgba(245, 158, 11, 0.25));
            box-shadow: 0 10px 25px -5px rgba(245, 158, 11, 0.1), 0 2px 6px rgba(0, 0, 0, 0.03);
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-lightning-deals-bar,
          .dark .boost-lightning-deals-bar {
            background: linear-gradient(135deg, rgba(245, 158, 11, 0.08) 0%, rgba(239, 68, 68, 0.06) 100%), var(--boost-surface, #0f172a);
            border-color: rgba(245, 158, 11, 0.3);
            box-shadow: 0 10px 30px -8px rgba(0, 0, 0, 0.4);
          }

          .boost-deal-badge {
            display: inline-flex;
            align-items: center;
            gap: 6px;
            padding: 4px 10px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 800;
            letter-spacing: 0.05em;
            color: #ffffff;
            background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.35);
            text-transform: uppercase;
          }

          .boost-deal-badge-icon {
            animation: boost-pulse 1.8s infinite;
          }

          @keyframes boost-pulse {
            0%, 100% { transform: scale(1); opacity: 1; }
            50% { transform: scale(1.2); opacity: 0.85; }
          }

          .boost-timer-box {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-width: 32px;
            height: 28px;
            padding: 0 6px;
            border-radius: 6px;
            background: var(--boost-text-primary, #0f172a);
            color: #ffffff;
            font-size: 12px;
            font-weight: 700;
            font-variant-numeric: tabular-nums;
            box-shadow: 0 2px 4px rgba(0,0,0,0.15);
          }

          :root[data-theme="dark"] .boost-timer-box,
          .dark .boost-timer-box {
            background: rgba(255, 255, 255, 0.12);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #f8fafc;
          }

          .boost-timer-box.seconds {
            background: #ef4444;
            box-shadow: 0 2px 8px rgba(239, 68, 68, 0.4);
          }

          .boost-deal-track {
            height: 8px;
            background-color: var(--boost-bg-muted, rgba(0, 0, 0, 0.06));
            border-radius: 9999px;
            overflow: hidden;
            position: relative;
          }

          :root[data-theme="dark"] .boost-deal-track,
          .dark .boost-deal-track {
            background-color: rgba(255, 255, 255, 0.08);
          }

          .boost-deal-fill {
            height: 100%;
            border-radius: 9999px;
            background: linear-gradient(90deg, #f59e0b 0%, #ef4444 100%);
            transition: width 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            box-shadow: 0 0 12px rgba(239, 68, 68, 0.4);
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "12px"
            },
            children: [
              /* @__PURE__ */ jsx("div", { style: { display: "flex", alignItems: "center" }, children: /* @__PURE__ */ jsxs("span", { className: "boost-deal-badge", style: { backgroundColor: badgeColor !== "#ef4444" ? badgeColor : void 0 }, children: [
                /* @__PURE__ */ jsx("svg", { className: "boost-deal-badge-icon", width: "13", height: "13", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
                dealTitle
              ] }) }),
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px" }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      fontSize: "12px",
                      fontWeight: 600,
                      color: "var(--boost-text-secondary, #64748b)",
                      display: "inline-flex",
                      alignItems: "center",
                      lineHeight: 1
                    },
                    children: "Ends in:"
                  }
                ),
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "4px" }, children: [
                  /* @__PURE__ */ jsxs("span", { className: "boost-timer-box", children: [
                    pad(timeLeft.hours),
                    "h"
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "var(--boost-text-muted, #94a3b8)", lineHeight: 1 }, children: ":" }),
                  /* @__PURE__ */ jsxs("span", { className: "boost-timer-box", children: [
                    pad(timeLeft.minutes),
                    "m"
                  ] }),
                  /* @__PURE__ */ jsx("span", { style: { fontWeight: 800, color: "var(--boost-text-muted, #94a3b8)", lineHeight: 1 }, children: ":" }),
                  /* @__PURE__ */ jsxs("span", { className: "boost-timer-box seconds", children: [
                    pad(timeLeft.seconds),
                    "s"
                  ] })
                ] })
              ] })
            ]
          }
        ),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", gap: "6px" }, children: [
          /* @__PURE__ */ jsx("div", { className: "boost-deal-track", children: /* @__PURE__ */ jsx(
            "div",
            {
              className: "boost-deal-fill",
              style: { width: `${percent}%` }
            }
          ) }),
          /* @__PURE__ */ jsxs(
            "div",
            {
              style: {
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
                color: "var(--boost-text-primary, #334155)",
                fontWeight: 600
              },
              children: [
                /* @__PURE__ */ jsxs("span", { style: { display: "inline-flex", alignItems: "center", gap: "4px" }, children: [
                  "\u{1F525} ",
                  /* @__PURE__ */ jsxs("strong", { children: [
                    percent,
                    "%"
                  ] }),
                  " Claimed"
                ] }),
                /* @__PURE__ */ jsx("span", { style: { color: percent > 80 ? "#dc2626" : "var(--boost-text-muted, #64748b)", fontWeight: 600 }, children: percent > 85 ? "\u26A1 Only a few left!" : "Hurry, limited stock!" })
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
  suggestedItems = [],
  bundleDiscountPercentage = 10,
  currencySymbol = "$",
  locale = "en-US",
  onAddBundleToCart,
  onAddBundle,
  className = "",
  style
}) => {
  const allItems = React.useMemo(() => {
    const list = [];
    if (mainProduct && typeof mainProduct === "object" && mainProduct.id) list.push(mainProduct);
    if (Array.isArray(suggestedItems)) list.push(...suggestedItems);
    return list;
  }, [mainProduct, suggestedItems]);
  const [selectedIds, setSelectedIds] = React.useState(
    () => allItems.map((i) => i.id)
  );
  React.useEffect(() => {
    setSelectedIds(allItems.map((i) => i.id));
  }, [allItems]);
  const [imageErrors, setImageErrors] = React.useState({});
  const toggleItem = (id) => {
    if (selectedIds.includes(id)) {
      if (selectedIds.length > 1) {
        setSelectedIds(selectedIds.filter((itemId) => itemId !== id));
      }
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };
  const handleImageError = (id) => {
    setImageErrors((prev) => ({ ...prev, [id]: true }));
  };
  const selectedItems = allItems.filter((i) => selectedIds.includes(i.id));
  const subtotal = selectedItems.reduce((acc, item) => acc + item.price, 0);
  const originalSubtotal = selectedItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price),
    0
  );
  const discountAmount = selectedItems.length > 1 ? Math.round(subtotal * bundleDiscountPercentage / 100) : 0;
  const finalPrice = subtotal - discountAmount;
  const totalSavings = originalSubtotal - finalPrice;
  const handleAddToCart = () => {
    if (onAddBundleToCart) {
      onAddBundleToCart(selectedItems);
    }
    if (onAddBundle) {
      onAddBundle(selectedItems.map((i) => i.id));
    }
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-frequently-bought ${className}`,
      style: {
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, rgba(0, 0, 0, 0.08))",
        borderRadius: "20px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        boxShadow: "0 12px 30px -10px var(--boost-shadow, rgba(0, 0, 0, 0.05))",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-frequently-bought {
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-frequently-bought,
          .dark .boost-frequently-bought {
            background-color: var(--boost-surface, #111827) !important;
            border-color: var(--boost-border, rgba(255, 255, 255, 0.1)) !important;
            box-shadow: 0 12px 35px -10px rgba(0, 0, 0, 0.5) !important;
          }

          .boost-fbt-title {
            font-size: 18px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            margin: 0;
            letter-spacing: -0.02em;
          }
          :root[data-theme="dark"] .boost-fbt-title,
          .dark .boost-fbt-title {
            color: #f8fafc !important;
          }

          .boost-fbt-item-text {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-item-text,
          .dark .boost-fbt-item-text {
            color: #f1f5f9 !important;
          }

          .boost-fbt-price {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-price,
          .dark .boost-fbt-price {
            color: #ffffff !important;
          }

          .boost-fbt-total {
            color: var(--boost-text-primary, #0f172a);
          }
          :root[data-theme="dark"] .boost-fbt-total,
          .dark .boost-fbt-total {
            color: #ffffff !important;
          }

          .boost-combo-badge {
            background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(5, 150, 105, 0.18) 100%);
            color: var(--boost-success, #059669);
            border: 1px solid rgba(16, 185, 129, 0.3);
            font-size: 12px;
            font-weight: 700;
            padding: 4px 12px;
            border-radius: 9999px;
            display: inline-flex;
            align-items: center;
            gap: 4px;
          }

          :root[data-theme="dark"] .boost-combo-badge,
          .dark .boost-combo-badge {
            background: rgba(16, 185, 129, 0.15);
            color: #34d399;
            border-color: rgba(52, 211, 153, 0.3);
          }

          .boost-bundle-card {
            width: 96px;
            height: 96px;
            border-radius: 14px;
            background: var(--boost-bg-muted, #f8fafc);
            border: 2px solid var(--boost-border, rgba(0,0,0,0.06));
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 6px;
            cursor: pointer;
            position: relative;
            flex-shrink: 0;
            overflow: visible;
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            box-sizing: border-box;
          }

          .boost-bundle-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 18px rgba(0,0,0,0.12);
          }

          .boost-bundle-card.selected {
            border-color: var(--boost-primary, #6366f1);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.2);
            opacity: 1;
          }

          .boost-bundle-card.unselected {
            opacity: 0.35;
            filter: grayscale(80%);
          }

          :root[data-theme="dark"] .boost-bundle-card,
          .dark .boost-bundle-card {
            background: rgba(255, 255, 255, 0.05);
            border-color: rgba(255, 255, 255, 0.12);
          }

          :root[data-theme="dark"] .boost-bundle-card.selected,
          .dark .boost-bundle-card.selected {
            border-color: #818cf8;
            box-shadow: 0 0 0 3px rgba(129, 140, 248, 0.3);
          }

          .boost-bundle-check-badge {
            position: absolute;
            top: -6px;
            right: -6px;
            width: 22px;
            height: 22px;
            border-radius: 50%;
            background: var(--boost-primary, #6366f1);
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 6px rgba(0,0,0,0.25);
            font-size: 11px;
            font-weight: 800;
            z-index: 5;
            border: 2px solid var(--boost-surface, #ffffff);
          }

          :root[data-theme="dark"] .boost-bundle-check-badge,
          .dark .boost-bundle-check-badge {
            border-color: #111827;
            background: #6366f1;
          }

          .boost-bundle-plus-chip {
            width: 28px;
            height: 28px;
            border-radius: 50%;
            background: var(--boost-bg-muted, #f1f5f9);
            color: var(--boost-text-muted, #64748b);
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            font-weight: 700;
            flex-shrink: 0;
            border: 1px solid var(--boost-border, rgba(0,0,0,0.06));
          }

          :root[data-theme="dark"] .boost-bundle-plus-chip,
          .dark .boost-bundle-plus-chip {
            background: rgba(255, 255, 255, 0.08);
            border-color: rgba(255, 255, 255, 0.1);
            color: #94a3b8;
          }

          .boost-bundle-btn {
            background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
            color: #ffffff;
            font-weight: 700;
            font-size: 14px;
            padding: 12px 24px;
            border-radius: 9999px;
            border: none;
            cursor: pointer;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 4px 14px rgba(15, 23, 42, 0.2);
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
          }

          .boost-bundle-btn:hover {
            transform: translateY(-1px);
            box-shadow: 0 6px 20px rgba(15, 23, 42, 0.3);
          }

          .boost-bundle-btn:active {
            transform: scale(0.98);
          }

          :root[data-theme="dark"] .boost-bundle-btn,
          .dark .boost-bundle-btn {
            background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.35);
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }, children: [
          /* @__PURE__ */ jsx("h3", { className: "boost-fbt-title", children: "Frequently Bought Together" }),
          selectedItems.length > 1 && /* @__PURE__ */ jsxs("span", { className: "boost-combo-badge", children: [
            /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
            "Save ",
            bundleDiscountPercentage,
            "% on Combo"
          ] })
        ] }),
        /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              display: "flex",
              alignItems: "center",
              gap: "14px",
              overflowX: "auto",
              padding: "12px 8px 12px 8px"
            },
            children: allItems.map((item, index) => {
              const isSelected = selectedIds.includes(item.id);
              const hasError = !item.imageUrl || imageErrors[item.id];
              return /* @__PURE__ */ jsxs(React.Fragment, { children: [
                index > 0 && /* @__PURE__ */ jsx("div", { className: "boost-bundle-plus-chip", children: "+" }),
                /* @__PURE__ */ jsxs(
                  "div",
                  {
                    onClick: () => toggleItem(item.id),
                    className: `boost-bundle-card ${isSelected ? "selected" : "unselected"}`,
                    title: item.title,
                    children: [
                      isSelected && /* @__PURE__ */ jsx("div", { className: "boost-bundle-check-badge", children: /* @__PURE__ */ jsx("svg", { width: "12", height: "12", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3.5", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) }) }),
                      !hasError ? /* @__PURE__ */ jsx(
                        "img",
                        {
                          src: item.imageUrl,
                          alt: item.title,
                          onError: () => handleImageError(item.id),
                          style: {
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "8px"
                          }
                        }
                      ) : /* @__PURE__ */ jsxs(
                        "div",
                        {
                          style: {
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "4px",
                            color: "var(--boost-text-muted, #94a3b8)",
                            textAlign: "center"
                          },
                          children: [
                            /* @__PURE__ */ jsxs("svg", { width: "26", height: "26", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "1.75", strokeLinecap: "round", strokeLinejoin: "round", children: [
                              /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                              /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                              /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                            ] }),
                            /* @__PURE__ */ jsx("span", { style: { fontSize: "9px", fontWeight: 600, maxWidth: "80px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }, children: item.title })
                          ]
                        }
                      )
                    ]
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
                alignItems: "center",
                gap: "12px",
                fontSize: "13px",
                cursor: "pointer",
                padding: "4px 0",
                userSelect: "none"
              },
              children: [
                /* @__PURE__ */ jsx(
                  "input",
                  {
                    type: "checkbox",
                    checked: isSelected,
                    onChange: () => toggleItem(item.id),
                    style: {
                      width: "18px",
                      height: "18px",
                      accentColor: "var(--boost-primary, #6366f1)",
                      cursor: "pointer",
                      borderRadius: "4px",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsxs(
                  "span",
                  {
                    className: "boost-fbt-item-text",
                    style: {
                      flex: 1,
                      lineHeight: 1.4,
                      transition: "color 0.2s ease",
                      opacity: isSelected ? 1 : 0.5
                    },
                    children: [
                      /* @__PURE__ */ jsx("span", { style: { fontWeight: 600 }, children: idx === 0 ? "This item: " : "" }),
                      item.title,
                      /* @__PURE__ */ jsxs(
                        "span",
                        {
                          className: "boost-fbt-price",
                          style: {
                            fontWeight: 700,
                            marginLeft: "8px"
                          },
                          children: [
                            currencySymbol,
                            item.price.toLocaleString(locale)
                          ]
                        }
                      ),
                      item.originalPrice && item.originalPrice > item.price && /* @__PURE__ */ jsxs(
                        "span",
                        {
                          style: {
                            fontSize: "12px",
                            color: "var(--boost-text-muted, #94a3b8)",
                            textDecoration: "line-through",
                            marginLeft: "6px"
                          },
                          children: [
                            currencySymbol,
                            item.originalPrice.toLocaleString(locale)
                          ]
                        }
                      )
                    ]
                  }
                )
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
              paddingTop: "18px",
              borderTop: "1px solid var(--boost-border, rgba(0,0,0,0.06))"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { children: [
                /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "baseline", gap: "8px" }, children: [
                  /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "var(--boost-text-secondary, #64748b)", fontWeight: 500 }, children: "Total price:" }),
                  /* @__PURE__ */ jsxs(
                    "span",
                    {
                      className: "boost-fbt-total",
                      style: {
                        fontSize: "22px",
                        fontWeight: 800,
                        letterSpacing: "-0.02em",
                        fontVariantNumeric: "tabular-nums"
                      },
                      children: [
                        currencySymbol,
                        finalPrice.toLocaleString(locale)
                      ]
                    }
                  ),
                  discountAmount > 0 && /* @__PURE__ */ jsxs(
                    "span",
                    {
                      style: {
                        fontSize: "14px",
                        color: "var(--boost-text-muted, #94a3b8)",
                        textDecoration: "line-through"
                      },
                      children: [
                        currencySymbol,
                        subtotal.toLocaleString(locale)
                      ]
                    }
                  )
                ] }),
                discountAmount > 0 && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    style: {
                      fontSize: "12px",
                      color: "var(--boost-success, #10b981)",
                      fontWeight: 700,
                      marginTop: "2px"
                    },
                    children: [
                      "\u{1F389} You save ",
                      currencySymbol,
                      totalSavings > 0 ? totalSavings.toLocaleString(locale) : discountAmount.toLocaleString(locale),
                      " (",
                      bundleDiscountPercentage,
                      "% combo discount)"
                    ]
                  }
                )
              ] }),
              /* @__PURE__ */ jsxs(
                "button",
                {
                  type: "button",
                  onClick: handleAddToCart,
                  className: "boost-bundle-btn",
                  children: [
                    /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
                      /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
                      /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
                    ] }),
                    /* @__PURE__ */ jsxs("span", { children: [
                      "Add ",
                      selectedItems.length,
                      " items to Cart"
                    ] })
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
    id: "card-instant",
    type: "instant",
    title: "10% Instant Discount on Premium Credit Cards",
    description: "Up to $50 on select credit cards on minimum purchase of $150.",
    code: "CARD10"
  },
  {
    id: "special-reward",
    type: "instant",
    title: "Flat $25 Off on Partner Cards",
    description: "Applicable on online checkout for orders above $200.",
    code: "PARTNER25"
  },
  {
    id: "zero-interest-split",
    type: "emi",
    title: "Pay in 4 Interest-Free Installments",
    description: "Split your purchase into 4 flexible payments on orders over $50."
  },
  {
    id: "cashback-reward",
    type: "cashback",
    title: "5% Instant Cashback on Digital Wallets",
    description: "Instant cashback credited directly to your payment account.",
    code: "WALLET5"
  }
];
var BankOffersAccordion = ({
  offers = DEFAULT_OFFERS,
  className = "",
  style
}) => {
  const [expanded, setExpanded] = React.useState(false);
  const [copiedCode, setCopiedCode] = React.useState(null);
  const safeOffers = Array.isArray(offers) ? offers : DEFAULT_OFFERS;
  const displayedOffers = expanded ? safeOffers : safeOffers.slice(0, 2);
  const handleCopy = (code, e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2e3);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-bank-offers ${className}`,
      style: {
        borderRadius: "18px",
        padding: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        boxSizing: "border-box",
        ...style
      },
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-bank-offers {
            background-color: var(--boost-surface, #ffffff);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.04), 0 2px 6px rgba(0, 0, 0, 0.02);
            transition: all 0.3s ease;
          }

          :root[data-theme="dark"] .boost-bank-offers,
          .dark .boost-bank-offers {
            background-color: var(--boost-surface, #111827) !important;
            border-color: var(--boost-border, rgba(255, 255, 255, 0.1)) !important;
            box-shadow: 0 12px 30px -8px rgba(0, 0, 0, 0.5) !important;
          }

          .boost-bank-header-title {
            font-size: 15px;
            font-weight: 800;
            color: var(--boost-text-primary, #0f172a);
            letter-spacing: -0.01em;
          }

          :root[data-theme="dark"] .boost-bank-header-title,
          .dark .boost-bank-header-title {
            color: #f8fafc !important;
          }

          .boost-bank-count-pill {
            background: linear-gradient(135deg, rgba(79, 70, 229, 0.1) 0%, rgba(99, 102, 241, 0.15) 100%);
            color: var(--boost-primary, #4f46e5);
            font-size: 11px;
            font-weight: 700;
            padding: 4px 9px;
            border-radius: 9999px;
            border: 1px solid rgba(99, 102, 241, 0.25);
            white-space: nowrap;
            flex-shrink: 0;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            line-height: 1;
          }

          :root[data-theme="dark"] .boost-bank-count-pill,
          .dark .boost-bank-count-pill {
            background: rgba(99, 102, 241, 0.2);
            color: #a5b4fc;
            border-color: rgba(165, 180, 252, 0.3);
          }

          .boost-offer-row {
            background-color: var(--boost-bg-muted, #f8fafc);
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.05));
            border-radius: 12px;
            padding: 12px 14px;
            display: flex;
            flex-direction: column;
            gap: 6px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          }

          .boost-offer-row:hover {
            transform: translateX(2px);
            border-color: rgba(99, 102, 241, 0.3);
          }

          :root[data-theme="dark"] .boost-offer-row,
          .dark .boost-offer-row {
            background-color: rgba(255, 255, 255, 0.04) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
          }

          .boost-offer-row-title {
            font-size: 13px;
            font-weight: 700;
            color: var(--boost-text-primary, #0f172a);
            line-height: 1.3;
          }

          :root[data-theme="dark"] .boost-offer-row-title,
          .dark .boost-offer-row-title {
            color: #f1f5f9 !important;
          }

          .boost-offer-row-desc {
            font-size: 12px;
            color: var(--boost-text-secondary, #64748b);
            margin: 0;
            line-height: 1.45;
          }

          :root[data-theme="dark"] .boost-offer-row-desc,
          .dark .boost-offer-row-desc {
            color: #94a3b8 !important;
          }

          .boost-copy-chip {
            font-size: 11px;
            font-family: monospace;
            font-weight: 700;
            background: var(--boost-surface, #ffffff);
            color: var(--boost-primary, #4f46e5);
            padding: 3px 8px;
            border-radius: 6px;
            border: 1px dashed rgba(99, 102, 241, 0.4);
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 4px;
            transition: all 0.2s ease;
            flex-shrink: 0;
          }

          .boost-copy-chip:hover {
            background: rgba(99, 102, 241, 0.1);
          }

          :root[data-theme="dark"] .boost-copy-chip,
          .dark .boost-copy-chip {
            background: rgba(99, 102, 241, 0.15);
            color: #c7d2fe;
            border-color: rgba(165, 180, 252, 0.4);
          }

          .boost-expand-btn {
            background: none;
            border: none;
            color: var(--boost-primary, #4f46e5);
            font-size: 13px;
            font-weight: 700;
            padding: 6px 0 2px;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            gap: 6px;
            transition: color 0.2s ease;
          }

          .boost-expand-btn:hover {
            color: #3730a3;
          }

          :root[data-theme="dark"] .boost-expand-btn,
          .dark .boost-expand-btn {
            color: #818cf8 !important;
          }
          :root[data-theme="dark"] .boost-expand-btn:hover,
          .dark .boost-expand-btn:hover {
            color: #a5b4fc !important;
          }
          @media (max-width: 480px) {
            .boost-bank-offers {
              padding: 14px 16px !important;
              gap: 12px !important;
            }
            .boost-bank-header-title {
              font-size: 13.5px !important;
            }
          }
        ` }),
        /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", width: "100%" }, children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", minWidth: 0, flex: 1 }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  width: "28px",
                  height: "28px",
                  borderRadius: "7px",
                  background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                  color: "#ffffff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                  boxShadow: "0 2px 6px rgba(79, 70, 229, 0.3)"
                },
                children: /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("rect", { x: "2", y: "5", width: "20", height: "14", rx: "2" }),
                  /* @__PURE__ */ jsx("line", { x1: "2", y1: "10", x2: "22", y2: "10" })
                ] })
              }
            ),
            /* @__PURE__ */ jsx("span", { className: "boost-bank-header-title", style: { overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", minWidth: 0 }, children: "Bank Offers & Discounts" })
          ] }),
          /* @__PURE__ */ jsxs("span", { className: "boost-bank-count-pill", children: [
            offers.length,
            " Offers"
          ] })
        ] }),
        /* @__PURE__ */ jsx("div", { style: { display: "flex", flexDirection: "column", gap: "10px" }, children: displayedOffers.map((offer) => {
          const offerDesc = offer.description || offer.terms || "";
          return /* @__PURE__ */ jsxs("div", { className: "boost-offer-row", children: [
            /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", justifyContent: "space-between", gap: "8px", flexWrap: "wrap" }, children: [
              /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", flex: "1 1 180px", minWidth: 0 }, children: [
                /* @__PURE__ */ jsx(
                  "span",
                  {
                    style: {
                      width: "7px",
                      height: "7px",
                      borderRadius: "50%",
                      backgroundColor: "var(--boost-primary, #6366f1)",
                      flexShrink: 0
                    }
                  }
                ),
                /* @__PURE__ */ jsx("span", { className: "boost-offer-row-title", style: { wordBreak: "break-word" }, children: offer.title })
              ] }),
              offer.code && /* @__PURE__ */ jsx(
                "button",
                {
                  type: "button",
                  onClick: (e) => handleCopy(offer.code, e),
                  className: "boost-copy-chip",
                  title: "Click to copy coupon code",
                  children: copiedCode === offer.code ? /* @__PURE__ */ jsx("span", { style: { color: "var(--boost-success, #10b981)", fontWeight: 800 }, children: "\u2713 COPIED" }) : /* @__PURE__ */ jsxs(Fragment, { children: [
                    /* @__PURE__ */ jsx("span", { children: offer.code }),
                    /* @__PURE__ */ jsxs("svg", { width: "11", height: "11", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.5", strokeLinecap: "round", strokeLinejoin: "round", children: [
                      /* @__PURE__ */ jsx("rect", { x: "9", y: "9", width: "13", height: "13", rx: "2", ry: "2" }),
                      /* @__PURE__ */ jsx("path", { d: "M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" })
                    ] })
                  ] })
                }
              )
            ] }),
            offerDesc && /* @__PURE__ */ jsx("p", { className: "boost-offer-row-desc", style: { paddingLeft: "15px" }, children: offerDesc })
          ] }, offer.id);
        }) }),
        offers.length > 2 && /* @__PURE__ */ jsxs(
          "button",
          {
            type: "button",
            onClick: () => setExpanded(!expanded),
            className: "boost-expand-btn",
            children: [
              /* @__PURE__ */ jsx("span", { children: expanded ? "Show Less Offers" : `View All ${offers.length} Offers` }),
              /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "14",
                  height: "14",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2.5",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  style: {
                    transform: expanded ? "rotate(180deg)" : "none",
                    transition: "transform 0.25s cubic-bezier(0.4, 0, 0.2, 1)"
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
  originalPrice,
  currencySymbol = "$",
  isWishlisted = false,
  isInCart = false,
  onAddToCart = () => {
  },
  onBuyNow = () => {
  },
  onToggleWishlist,
  position,
  addToCartText = "Add to Cart",
  buyNowText = "Buy Now",
  className = "",
  style,
  ...props
}) => {
  const isRelative = position === "relative" || props.position === "relative";
  const effectiveOriginalPrice = compareAtPrice ?? originalPrice ?? props.originalPrice;
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    !isRelative && /* @__PURE__ */ jsx("style", { children: `
          @media (min-width: 768px) {
            .boost-dual-mobile-action-bar {
              display: none !important;
            }
          }
        ` }),
    /* @__PURE__ */ jsx("style", { children: `
        .boost-dual-mobile-action-bar {
          background: rgba(255, 255, 255, 0.92);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.12), 0 0 1px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
        }

        :root[data-theme="dark"] .boost-dual-mobile-action-bar,
        .dark .boost-dual-mobile-action-bar {
          background: rgba(17, 24, 39, 0.9) !important;
          border-color: rgba(255, 255, 255, 0.1) !important;
          box-shadow: 0 12px 35px -5px rgba(0, 0, 0, 0.6), 0 0 1px rgba(255, 255, 255, 0.1) !important;
        }

        .boost-dual-price-val {
          color: var(--boost-text-primary, #0f172a);
          font-weight: 800;
          font-size: 16px;
          line-height: 1.1;
          letter-spacing: -0.02em;
          font-variant-numeric: tabular-nums;
        }

        :root[data-theme="dark"] .boost-dual-price-val,
        .dark .boost-dual-price-val {
          color: #ffffff !important;
        }

        .boost-dual-btn-cart {
          background: var(--boost-bg-muted, #f1f5f9);
          color: var(--boost-text-primary, #0f172a);
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          font-weight: 700;
          font-size: 13px;
          border-radius: 12px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          flex: 1;
        }

        .boost-dual-btn-cart:hover {
          transform: translateY(-1px);
          background: #e2e8f0;
        }

        :root[data-theme="dark"] .boost-dual-btn-cart,
        .dark .boost-dual-btn-cart {
          background: rgba(255, 255, 255, 0.08) !important;
          border-color: rgba(255, 255, 255, 0.12) !important;
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-dual-btn-cart:hover,
        .dark .boost-dual-btn-cart:hover {
          background: rgba(255, 255, 255, 0.14) !important;
        }

        .boost-dual-btn-buy {
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          border: none;
          font-weight: 700;
          font-size: 13px;
          border-radius: 12px;
          height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.35);
          flex: 1;
        }

        .boost-dual-btn-buy:hover {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
        }

        .boost-dual-btn-buy:active,
        .boost-dual-btn-cart:active {
          transform: scale(0.98);
        }

        .boost-wishlist-btn {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.08));
          background: var(--boost-surface, #ffffff);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s ease;
        }

        :root[data-theme="dark"] .boost-wishlist-btn,
        .dark .boost-wishlist-btn {
          background: rgba(255, 255, 255, 0.06);
          border-color: rgba(255, 255, 255, 0.1);
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
          borderRadius: isRelative ? "18px" : "16px 16px 0 0",
          padding: "12px 16px",
          zIndex: isRelative ? 1 : 50,
          display: "flex",
          alignItems: "center",
          gap: "12px",
          boxSizing: "border-box",
          ...style
        },
        children: [
          price !== void 0 && /* @__PURE__ */ jsxs("div", { style: { display: "flex", flexDirection: "column", flexShrink: 0 }, children: [
            /* @__PURE__ */ jsxs("span", { className: "boost-dual-price-val", children: [
              currencySymbol,
              Number(price).toLocaleString()
            ] }),
            effectiveOriginalPrice && effectiveOriginalPrice > price && /* @__PURE__ */ jsxs("span", { style: { color: "var(--boost-text-muted, #94a3b8)", fontSize: "11px", textDecoration: "line-through", fontWeight: 500 }, children: [
              currencySymbol,
              Number(effectiveOriginalPrice).toLocaleString()
            ] })
          ] }),
          onToggleWishlist && /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: onToggleWishlist,
              "aria-label": "Wishlist",
              className: "boost-wishlist-btn",
              children: /* @__PURE__ */ jsx(
                "svg",
                {
                  width: "18",
                  height: "18",
                  viewBox: "0 0 24 24",
                  fill: isWishlisted ? "#ef4444" : "none",
                  stroke: isWishlisted ? "#ef4444" : "currentColor",
                  strokeWidth: "2.2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  style: { color: isWishlisted ? "#ef4444" : "var(--boost-text-secondary, #64748b)" },
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
              className: "boost-dual-btn-cart",
              children: [
                /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("circle", { cx: "9", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("circle", { cx: "20", cy: "21", r: "1" }),
                  /* @__PURE__ */ jsx("path", { d: "M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6" })
                ] }),
                /* @__PURE__ */ jsx("span", { children: isInCart ? "In Cart" : addToCartText })
              ]
            }
          ),
          /* @__PURE__ */ jsxs(
            "button",
            {
              type: "button",
              onClick: onBuyNow,
              className: "boost-dual-btn-buy",
              children: [
                /* @__PURE__ */ jsx("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "currentColor", children: /* @__PURE__ */ jsx("polygon", { points: "13 2 3 14 12 14 11 22 21 10 12 10 13 2" }) }),
                /* @__PURE__ */ jsx("span", { children: buyNowText })
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
  amount = 0,
  originalAmount,
  currencySymbol = "$",
  locale = "en-US",
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
    return new Intl.NumberFormat(locale).format(num);
  };
  return /* @__PURE__ */ jsxs(
    "div",
    {
      className: `boost-price ${className}`,
      style: {
        display: "inline-flex",
        flexWrap: "wrap",
        alignItems: "center",
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
              color: "var(--boost-text-primary, inherit)",
              letterSpacing: "-0.5px",
              lineHeight: 1
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
              color: "var(--boost-text-muted, #94a3b8)",
              textDecoration: "line-through",
              fontWeight: 400,
              lineHeight: 1
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
              color: "var(--boost-success, #16a34a)",
              backgroundColor: "var(--boost-success-bg, rgba(22, 163, 74, 0.12))",
              border: "1px solid rgba(22, 163, 74, 0.25)",
              padding: "2px 8px",
              borderRadius: "6px",
              lineHeight: 1.2,
              display: "inline-flex",
              alignItems: "center",
              letterSpacing: "0.02em"
            },
            children: [
              discountPercent,
              "% OFF"
            ]
          }
        ),
        hasDiscount && showSavings && /* @__PURE__ */ jsxs("span", { style: { width: "100%", fontSize: "12px", color: "var(--boost-success, #16a34a)", fontWeight: 600, marginTop: "4px", display: "flex", alignItems: "center", gap: "4px" }, children: [
          /* @__PURE__ */ jsx("span", { style: { display: "inline-block", width: "6px", height: "6px", borderRadius: "50%", backgroundColor: "currentColor" } }),
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
  return /* @__PURE__ */ jsxs(Fragment, { children: [
    /* @__PURE__ */ jsx("style", { children: `
        .boost-add-to-cart-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 10px 22px;
          background: linear-gradient(135deg, #4f46e5 0%, #6366f1 100%);
          color: #ffffff;
          font-size: 14px;
          font-weight: 700;
          border-radius: 12px;
          border: none;
          cursor: pointer;
          transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
          box-shadow: 0 4px 14px rgba(79, 70, 229, 0.3);
        }
        .boost-add-to-cart-btn:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 6px 20px rgba(79, 70, 229, 0.45);
        }
        .boost-add-to-cart-btn:active:not(:disabled) {
          transform: scale(0.98);
        }
        .boost-add-to-cart-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.1));
          border-radius: 12px;
          overflow: hidden;
          background: var(--boost-surface, #ffffff);
          box-shadow: 0 4px 15px -3px rgba(0, 0, 0, 0.08);
          transition: all 0.2s ease;
        }
        :root[data-theme="dark"] .boost-add-to-cart-stepper,
        .dark .boost-add-to-cart-stepper {
          background: rgba(255, 255, 255, 0.06) !important;
          border-color: rgba(255, 255, 255, 0.15) !important;
          box-shadow: 0 4px 20px -3px rgba(0, 0, 0, 0.4) !important;
        }
        .boost-stepper-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 38px;
          height: 40px;
          background: transparent;
          border: none;
          color: var(--boost-text-primary, #0f172a);
          cursor: pointer;
          font-size: 16px;
          font-weight: 700;
          transition: background-color 0.15s ease;
        }
        .boost-stepper-btn:hover:not(:disabled) {
          background-color: rgba(99, 102, 241, 0.1);
          color: #6366f1;
        }
        :root[data-theme="dark"] .boost-stepper-btn,
        .dark .boost-stepper-btn {
          color: #f8fafc !important;
        }
        :root[data-theme="dark"] .boost-stepper-btn:hover:not(:disabled),
        .dark .boost-stepper-btn:hover:not(:disabled) {
          background-color: rgba(255, 255, 255, 0.12) !important;
          color: #818cf8 !important;
        }
        .boost-stepper-qty {
          min-width: 38px;
          text-align: center;
          font-size: 14px;
          font-weight: 800;
          color: var(--boost-text-primary, #0f172a);
          font-variant-numeric: tabular-nums;
        }
        :root[data-theme="dark"] .boost-stepper-qty,
        .dark .boost-stepper-qty {
          color: #ffffff !important;
        }
      ` }),
    showStepperOnAdd && quantity > 0 ? /* @__PURE__ */ jsxs("div", { className: "boost-add-to-cart-stepper", style, children: [
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleDecrement,
          className: "boost-stepper-btn",
          "aria-label": "Decrease quantity",
          children: quantity === 1 ? /* @__PURE__ */ jsxs("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("polyline", { points: "3 6 5 6 21 6" }),
            /* @__PURE__ */ jsx("path", { d: "M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" })
          ] }) : /* @__PURE__ */ jsx("span", { children: "\u2212" })
        }
      ),
      /* @__PURE__ */ jsx("span", { className: "boost-stepper-qty", children: quantity }),
      /* @__PURE__ */ jsx(
        "button",
        {
          type: "button",
          onClick: handleIncrement,
          disabled: quantity >= maxQuantity,
          className: "boost-stepper-btn",
          "aria-label": "Increase quantity",
          style: { opacity: quantity >= maxQuantity ? 0.35 : 1, cursor: quantity >= maxQuantity ? "not-allowed" : "pointer" },
          children: "+"
        }
      )
    ] }) : /* @__PURE__ */ jsxs(
      "button",
      {
        type: "button",
        onClick: handleAdd,
        disabled: disabled || loading,
        className: "boost-add-to-cart-btn",
        style: {
          opacity: disabled ? 0.6 : 1,
          cursor: disabled || loading ? "not-allowed" : "pointer",
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
              strokeWidth: "2.5",
              children: [
                /* @__PURE__ */ jsx("circle", { cx: "12", cy: "12", r: "10", strokeDasharray: "32", strokeDashoffset: "10", opacity: "0.3" }),
                /* @__PURE__ */ jsx("path", { d: "M12 2a10 10 0 0 1 10 10" })
              ]
            }
          ) : /* @__PURE__ */ jsxs("svg", { width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2.2", strokeLinecap: "round", strokeLinejoin: "round", children: [
            /* @__PURE__ */ jsx("path", { d: "M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" }),
            /* @__PURE__ */ jsx("line", { x1: "3", y1: "6", x2: "21", y2: "6" }),
            /* @__PURE__ */ jsx("path", { d: "M16 10a4 4 0 0 1-8 0" })
          ] }),
          /* @__PURE__ */ jsx("span", { children: label })
        ]
      }
    )
  ] });
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
        className: "boost-coupon-applied",
        style: {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 16px",
          backgroundColor: "rgba(34, 197, 94, 0.08)",
          border: "1px dashed rgba(34, 197, 94, 0.4)",
          borderRadius: "12px",
          fontFamily: "system-ui, -apple-system, sans-serif",
          ...style
        },
        children: [
          /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "12px" }, children: [
            /* @__PURE__ */ jsx(
              "div",
              {
                style: {
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  width: "26px",
                  height: "26px",
                  borderRadius: "50%",
                  backgroundColor: "rgba(34, 197, 94, 0.15)"
                },
                children: /* @__PURE__ */ jsx("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "#22c55e", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsx("polyline", { points: "20 6 9 17 4 12" }) })
              }
            ),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("span", { style: { fontSize: "14px", fontWeight: 700, color: "#22c55e", letterSpacing: "0.5px" }, children: appliedCode }),
              discountText && /* @__PURE__ */ jsx("span", { style: { fontSize: "13px", color: "var(--boost-text-muted, #94a3b8)", marginLeft: "8px" }, children: discountText })
            ] })
          ] }),
          /* @__PURE__ */ jsx(
            "button",
            {
              type: "button",
              onClick: handleRemove,
              style: {
                background: "transparent",
                border: "none",
                color: "#ef4444",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                padding: "4px 8px"
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
                  left: "12px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  color: "var(--boost-text-muted, #94a3b8)",
                  display: "flex",
                  alignItems: "center"
                },
                children: /* @__PURE__ */ jsxs("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
                  /* @__PURE__ */ jsx("path", { d: "M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z" }),
                  /* @__PURE__ */ jsx("line", { x1: "7", y1: "7", x2: "7.01", y2: "7" })
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
                  padding: "12px 12px 12px 38px",
                  fontSize: "14px",
                  fontWeight: 500,
                  textTransform: "uppercase",
                  color: "var(--boost-text-primary, inherit)",
                  backgroundColor: "transparent",
                  border: `1px solid ${error ? "#ef4444" : "var(--boost-border, #334155)"}`,
                  borderRadius: "8px",
                  outline: "none",
                  transition: "border-color 0.2s"
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
                padding: "0 20px",
                backgroundColor: "var(--boost-primary, #3b82f6)",
                color: "#ffffff",
                fontSize: "14px",
                fontWeight: 600,
                borderRadius: "8px",
                border: "none",
                cursor: !code.trim() || loading ? "not-allowed" : "pointer",
                opacity: !code.trim() || loading ? 0.6 : 1,
                display: "flex",
                alignItems: "center",
                gap: "8px",
                transition: "opacity 0.2s, background-color 0.2s"
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
                /* @__PURE__ */ jsx("span", { children: "Apply" })
              ]
            }
          )
        ]
      }
    ),
    error && /* @__PURE__ */ jsxs("div", { style: { fontSize: "13px", color: "#ef4444", marginTop: "8px", display: "flex", alignItems: "center", gap: "6px" }, children: [
      /* @__PURE__ */ jsxs("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", children: [
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
    } else if (!/^\+?[0-9]{7,15}$/.test(cleanPhone)) {
      errs.phone = "Please enter a valid phone number";
    }
    const cleanPin = formData.pincode.trim();
    if (!cleanPin) {
      errs.pincode = "Postal / ZIP code is required";
    } else if (!/^[\w\d\s-]{3,10}$/i.test(cleanPin)) {
      errs.pincode = "Please enter a valid postal / ZIP code";
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
                  placeholder: "Phone number (e.g. +1 555-0199)",
                  style: getInputStyle(!!errors.phone)
                }
              ),
              renderError(errors.phone)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { style: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 180px), 1fr))", gap: "12px" }, children: [
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Postal / ZIP Code *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  maxLength: 10,
                  value: formData.pincode,
                  onChange: (e) => handleChange("pincode", e.target.value),
                  placeholder: "e.g. 90210 or 110001",
                  style: getInputStyle(!!errors.pincode)
                }
              ),
              renderError(errors.pincode)
            ] }),
            /* @__PURE__ */ jsxs("div", { style: { gridColumn: "span 1" }, children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Apt / Suite / House No. *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.houseNumber,
                  onChange: (e) => handleChange("houseNumber", e.target.value),
                  placeholder: "e.g. Apt 4B or Suite 200",
                  style: getInputStyle(!!errors.houseNumber)
                }
              ),
              renderError(errors.houseNumber)
            ] })
          ] }),
          /* @__PURE__ */ jsxs("div", { children: [
            /* @__PURE__ */ jsx("label", { style: labelStyle, children: "Street Address *" }),
            /* @__PURE__ */ jsx(
              "input",
              {
                type: "text",
                value: formData.street,
                onChange: (e) => handleChange("street", e.target.value),
                placeholder: "e.g. 123 Main Street or Broadway",
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
                  placeholder: "e.g. New York or London",
                  style: getInputStyle(!!errors.city)
                }
              ),
              renderError(errors.city)
            ] }),
            /* @__PURE__ */ jsxs("div", { children: [
              /* @__PURE__ */ jsx("label", { style: labelStyle, children: "State / Province / Region *" }),
              /* @__PURE__ */ jsx(
                "input",
                {
                  type: "text",
                  value: formData.state,
                  onChange: (e) => handleChange("state", e.target.value),
                  placeholder: "e.g. California or Ontario",
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
  subtotal = 0,
  discount = 0,
  shippingFee = 0,
  tax = 0,
  currencySymbol = "$",
  locale = "en-US",
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
    return new Intl.NumberFormat(locale).format(num);
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
  backgroundImage,
  overlayOpacity = 0.5,
  align = "center",
  showGlow = true,
  glowColor = "rgba(37, 99, 235, 0.15)",
  className = "",
  style,
  ...props
}) => {
  const isCenter = align === "center";
  const isRight = align === "right";
  const hasBg = !!backgroundImage;
  return /* @__PURE__ */ jsxs(
    "section",
    {
      className: `boost-hero-section ${className}`,
      style: {
        position: "relative",
        padding: "clamp(64px, 10vw, 120px) clamp(16px, 4vw, 32px)",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box",
        backgroundImage: hasBg ? `url(${backgroundImage})` : void 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx("style", { children: `
        @media (max-width: 640px) {
          .boost-hero-section {
            padding: 48px 20px !important;
          }
          .boost-hero-title {
            font-size: 32px !important;
            line-height: 1.2 !important;
          }
          .boost-hero-desc {
            font-size: 16px !important;
            margin-bottom: 24px !important;
          }
          .boost-hero-buttons {
            flex-direction: column !important;
            align-items: stretch !important;
            width: 100% !important;
          }
          .boost-hero-buttons button {
            width: 100% !important;
          }
          .boost-hero-content {
            text-align: center !important;
          }
          .boost-hero-content p {
            margin-left: auto !important;
            margin-right: auto !important;
          }
        }
      ` }),
        hasBg && /* @__PURE__ */ jsx(
          "div",
          {
            style: {
              position: "absolute",
              inset: 0,
              backgroundColor: "#000",
              opacity: overlayOpacity,
              zIndex: 0
            }
          }
        ),
        !hasBg && showGlow && /* @__PURE__ */ jsx(
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
            className: "boost-hero-layout",
            style: {
              position: "relative",
              zIndex: 1,
              maxWidth: "1200px",
              margin: "0 auto",
              display: "flex",
              flexDirection: isCenter ? "column" : isRight ? "row-reverse" : "row",
              flexWrap: "wrap",
              alignItems: "center",
              justifyContent: isCenter ? "center" : "space-between",
              gap: "clamp(32px, 5vw, 56px)",
              textAlign: isCenter ? "center" : isRight ? "right" : "left"
            },
            children: [
              /* @__PURE__ */ jsxs("div", { className: "boost-hero-content", style: { maxWidth: isCenter ? "820px" : "620px", width: "100%", flex: isCenter ? "none" : "1 1 300px" }, children: [
                badge && /* @__PURE__ */ jsx(
                  "div",
                  {
                    style: {
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      padding: "6px 14px",
                      borderRadius: "9999px",
                      backgroundColor: hasBg ? "rgba(255, 255, 255, 0.15)" : "rgba(37, 99, 235, 0.1)",
                      border: hasBg ? "1px solid rgba(255, 255, 255, 0.3)" : "1px solid rgba(37, 99, 235, 0.22)",
                      color: hasBg ? "#ffffff" : "var(--boost-primary, #2563eb)",
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
                    className: "boost-hero-title",
                    style: {
                      fontSize: "clamp(36px, 5.2vw, 64px)",
                      fontWeight: 800,
                      lineHeight: 1.12,
                      letterSpacing: "-0.035em",
                      margin: "0 0 20px 0",
                      color: hasBg ? "#ffffff" : "var(--boost-text, #0f172a)"
                    },
                    children: title
                  }
                ),
                description && /* @__PURE__ */ jsx(
                  "p",
                  {
                    className: "boost-hero-desc",
                    style: {
                      fontSize: "clamp(16px, 2vw, 20px)",
                      lineHeight: 1.65,
                      color: hasBg ? "rgba(255, 255, 255, 0.85)" : "var(--boost-text-muted, #64748b)",
                      margin: "0 0 32px 0",
                      maxWidth: isCenter ? "700px" : "100%",
                      marginLeft: isCenter ? "auto" : isRight ? "auto" : 0,
                      marginRight: isCenter ? "auto" : isRight ? 0 : "auto"
                    },
                    children: description
                  }
                ),
                (primaryAction || secondaryAction) && /* @__PURE__ */ jsxs(
                  "div",
                  {
                    className: "boost-hero-buttons",
                    style: {
                      display: "flex",
                      flexWrap: "wrap",
                      gap: "12px",
                      justifyContent: isCenter ? "center" : isRight ? "flex-end" : "flex-start",
                      alignItems: "center"
                    },
                    children: [
                      primaryAction && /* @__PURE__ */ jsx(
                        "button",
                        {
                          type: "button",
                          onClick: primaryAction.onClick,
                          style: {
                            padding: "14px 32px",
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
                            padding: "14px 32px",
                            borderRadius: "var(--boost-radius, 12px)",
                            backgroundColor: hasBg ? "rgba(255, 255, 255, 0.1)" : "var(--boost-surface, transparent)",
                            color: hasBg ? "#ffffff" : "var(--boost-text, inherit)",
                            fontSize: "15px",
                            fontWeight: 600,
                            border: hasBg ? "1px solid rgba(255, 255, 255, 0.4)" : "1px solid var(--boost-border, #cbd5e1)",
                            backdropFilter: hasBg ? "blur(8px)" : "none",
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
  features = [],
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
  tiers = [],
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
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-pricing-card,
          .dark .boost-pricing-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
          }
          :root[data-theme="dark"] .boost-pricing-card.is-popular,
          .dark .boost-pricing-card.is-popular {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 12px 35px rgba(99, 102, 241, 0.25) !important;
          }
        ` }),
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
              const rawOriginalPrice = activeCycle === "annual" && tier.originalPriceAnnual !== void 0 ? tier.originalPriceAnnual : tier.originalPriceMonthly;
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
                      /* @__PURE__ */ jsxs("div", { style: { display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }, children: [
                        /* @__PURE__ */ jsx(
                          "h3",
                          {
                            style: {
                              fontSize: "20px",
                              fontWeight: 700,
                              margin: 0,
                              color: "var(--boost-text, #0f172a)"
                            },
                            children: tier.name
                          }
                        ),
                        tier.badge && /* @__PURE__ */ jsx(
                          "span",
                          {
                            style: {
                              fontSize: "11px",
                              fontWeight: 700,
                              backgroundColor: "rgba(34, 197, 94, 0.1)",
                              color: "#16a34a",
                              padding: "2px 8px",
                              borderRadius: "9999px",
                              border: "1px solid rgba(34, 197, 94, 0.2)"
                            },
                            children: tier.badge
                          }
                        )
                      ] }),
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
                            marginBottom: "28px",
                            flexWrap: "wrap"
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
                            ),
                            rawOriginalPrice && /* @__PURE__ */ jsx("div", { style: { width: "100%", marginTop: "2px" }, children: /* @__PURE__ */ jsx(
                              "span",
                              {
                                style: {
                                  fontSize: "15px",
                                  color: "var(--boost-text-muted, #94a3b8)",
                                  textDecoration: "line-through",
                                  fontWeight: 500
                                },
                                children: typeof rawOriginalPrice === "number" ? `${currency}${rawOriginalPrice}` : rawOriginalPrice
                              }
                            ) })
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
  quote = "",
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
        padding: "24px",
        borderRadius: "var(--boost-radius, 16px)",
        backgroundColor: "var(--boost-surface, #ffffff)",
        border: "1px solid var(--boost-border, #e2e8f0)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        boxSizing: "border-box",
        position: "relative",
        boxShadow: "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
        ...style
      },
      ...props,
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          :root[data-theme="dark"] .boost-testimonial-card,
          .dark .boost-testimonial-card {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
            box-shadow: 0 10px 30px -5px rgba(0, 0, 0, 0.5) !important;
          }
        ` }),
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
                  finalCompany
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
  testimonials = [],
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
  items = [],
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
        /* @__PURE__ */ jsx("style", { children: `
          .boost-faq-item {
            background-color: var(--boost-surface, #ffffff);
            border: 1px solid var(--boost-border, #e2e8f0);
            border-radius: var(--boost-radius, 14px);
            overflow: hidden;
            transition: all 0.2s ease;
          }
          :root[data-theme="dark"] .boost-faq-item,
          .dark .boost-faq-item {
            background-color: var(--boost-surface, #1e293b) !important;
            border-color: rgba(255, 255, 255, 0.1) !important;
          }
          .boost-faq-item.is-open {
            border-color: var(--boost-primary, #6366f1) !important;
            box-shadow: 0 4px 20px rgba(99, 102, 241, 0.15) !important;
          }
          .boost-faq-search-box {
            display: flex;
            align-items: center;
            background-color: var(--boost-surface, #ffffff);
            border: 1px solid var(--boost-border, #e2e8f0);
            border-radius: var(--boost-radius, 10px);
            padding: 10px 16px;
            gap: 10px;
          }
          :root[data-theme="dark"] .boost-faq-search-box,
          .dark .boost-faq-search-box {
            background-color: rgba(255, 255, 255, 0.05) !important;
            border-color: rgba(255, 255, 255, 0.12) !important;
          }
        ` }),
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
        searchable && /* @__PURE__ */ jsx("div", { style: { marginBottom: "32px" }, children: /* @__PURE__ */ jsxs("div", { className: "boost-faq-search-box", children: [
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
        ] }) }),
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
              className: `boost-faq-item ${isOpen ? "is-open" : ""}`,
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
  logos = [],
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
        /* @__PURE__ */ jsx("style", { children: `
          .boost-logo-grid {
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            justify-content: center;
            gap: 20px 24px;
          }
          .boost-logo-item {
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 10px 20px;
            border-radius: 12px;
            background: var(--boost-surface, rgba(255, 255, 255, 0.8));
            border: 1px solid var(--boost-border, rgba(0, 0, 0, 0.07));
            transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
            color: var(--boost-text-primary, #0f172a);
          }
          .boost-logo-item:hover {
            filter: none !important;
            opacity: 1 !important;
            transform: translateY(-2px);
            border-color: rgba(99, 102, 241, 0.4);
            box-shadow: 0 8px 24px -6px rgba(99, 102, 241, 0.15);
          }
          @media (max-width: 640px) {
            .boost-logo-grid {
              gap: 12px 14px;
            }
            .boost-logo-item {
              padding: 8px 14px;
            }
            .boost-logo-item img {
              max-height: 24px !important;
              max-width: 90px !important;
            }
          }
          :root[data-theme="dark"] .boost-logo-item,
          .dark .boost-logo-item {
            background: rgba(255, 255, 255, 0.04) !important;
            border-color: rgba(255, 255, 255, 0.08) !important;
            color: #f8fafc !important;
          }
          :root[data-theme="dark"] .boost-logo-item:hover,
          .dark .boost-logo-item:hover {
            background: rgba(255, 255, 255, 0.08) !important;
            border-color: rgba(99, 102, 241, 0.5) !important;
            box-shadow: 0 8px 25px -6px rgba(99, 102, 241, 0.3) !important;
          }
          :root[data-theme="dark"] .boost-logo-item img,
          .dark .boost-logo-item img {
            filter: invert(1) brightness(1.8) contrast(1.1);
          }
        ` }),
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
        /* @__PURE__ */ jsx("div", { className: "boost-logo-grid", children: logos.map((item, idx) => {
          const content = /* @__PURE__ */ jsx(
            "div",
            {
              title: item.name,
              className: "boost-logo-item",
              style: {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                filter: grayscale ? "grayscale(100%) opacity(60%)" : "none",
                transition: "filter 0.2s ease, transform 0.2s ease",
                cursor: item.href ? "pointer" : "default"
              },
              children: item.imageUrl ? /* @__PURE__ */ jsx(
                "img",
                {
                  src: item.imageUrl,
                  alt: item.name,
                  style: { maxHeight: "36px", maxWidth: "160px", objectFit: "contain" }
                }
              ) : item.logo
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
        }) })
      ]
    }
  );
};
LogoCloud.displayName = "LogoCloud";
var CTASection = ({
  badge,
  title,
  description,
  backgroundImage,
  overlayOpacity,
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
  const hasBgImage = !!backgroundImage;
  const overlayAlpha = overlayOpacity ?? 0.6;
  const backgroundStyle = hasBgImage ? `linear-gradient(rgba(0, 0, 0, ${overlayAlpha}), rgba(0, 0, 0, ${overlayAlpha})), url(${backgroundImage}) center/cover no-repeat` : isGradient ? "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)" : "var(--boost-primary, #2563eb)";
  return /* @__PURE__ */ jsxs(
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
      children: [
        /* @__PURE__ */ jsx("style", { children: `
          .boost-cta-buttons {
            display: flex;
            flex-wrap: wrap;
            justify-content: center;
            gap: 14px;
          }
          @media (max-width: 640px) {
            .boost-cta-buttons {
              flex-direction: column;
              width: 100%;
            }
            .boost-cta-buttons button {
              width: 100%;
            }
          }
        ` }),
        /* @__PURE__ */ jsxs(
          "div",
          {
            style: {
              maxWidth: isCard ? "1100px" : "100%",
              margin: "0 auto",
              borderRadius: isCard ? "var(--boost-radius, 24px)" : "0px",
              background: backgroundStyle,
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
              ) : (primaryAction || secondaryAction) && /* @__PURE__ */ jsxs("div", { className: "boost-cta-buttons", children: [
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
              ] })
            ]
          }
        )
      ]
    }
  );
};
CTASection.displayName = "CTASection";

export { Accordion, ActivityFeed, AddToCart, AddressForm, Alert, AnnouncementBar, AreaChart, AspectRatio, AssuredBadge, Avatar, AvatarGroup, BackButton, Badge, BankOffersAccordion, BarChart, BoostProvider, BottomSheet, Box, Breadcrumb, Button, ButtonGroup, CTASection, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, Carousel, CartDrawer, Checkbox, Chip, CommandPalette, ConfirmationDialog, Container, CopyButton, CouponInput, DataTable, DatePicker, DateRangePicker, Dialog, Divider, DonutChart, Drawer, DropdownMenu, DualMobileActionBar, EmptyState, ErrorState, ExportButton, FAQSection, FeatureGrid, FileDropzone, FileUpload, Filter, Flex, FloatingActionButton, Footer, ForgotPassword, FormField, FrequentlyBoughtTogether, Grid, GridItem, HStack, Header, HeroSection, IconButton, Image, Input, KPIWidget, LightningDealsBar, LinkButton, Loader, LoginForm, LogoCloud, MegaMenu, MobileBottomBar, MobileBottomNav, Modal, Motion, MultiSelect, NavLink, Navbar, NotificationCenter, OTPInput, OrderSummary, OrderTimeline, PageWrapper, Pagination, PincodeChecker, Popover, Portal, Price, PricingTable, ProductCard, ProductGallery, ProgressBar, QuantitySelector, Radio, RadioGroup, RegisterForm, ResetPassword, ReviewBreakdownBars, ScrollArea, SearchInput, Section, Select, Sidebar, Skeleton, Snackbar, Sort, Sparkline, Spinner, Stack, StarRating, StatsCard, Stepper, StickyAddToCart, SuccessMessage, Switch, Table, Tabs, TabsContent, TabsList, TabsTrigger, Tag, TestimonialCard, TestimonialGrid, Textarea, ThemeToggle, TimePicker, Toast, ToastProvider, Tooltip, TrustBadges, VStack, VariantSelector, boostTokens, createTailwindPreset, injectBoostGlobalStyles, useCurrency, useTheme, useToast };

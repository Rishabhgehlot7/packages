# Accessibility (a11y) Audit & Conformance Guide

`@boostengine/ui` is architected from the ground up to follow **WAI-ARIA 1.2** patterns and **WCAG 2.1 AA / AAA** compliance guidelines.

---

## 1. Compliance Matrix

| Component | ARIA Role | Keyboard Support | Focus Trapping | Live Region |
|---|---|---|---|---|
| `Modal` / `Dialog` | `role="dialog"` | `Escape` to close, `Tab` cycling | Yes (Trapped) | N/A |
| `Drawer` / `Sheet` | `role="dialog"` | `Escape` to close | Yes (Trapped) | N/A |
| `Tabs` | `role="tablist"` | `ArrowLeft`, `ArrowRight`, `Home`, `End` | No | N/A |
| `Accordion` | `role="region"` | `Enter`, `Space` to toggle | No | N/A |
| `DropdownMenu` | `role="menu"` | `ArrowDown`, `ArrowUp`, `Enter`, `Escape` | Yes (Menu scope) | N/A |
| `Toast` | `role="status" / "alert"` | Dismiss button focusable | No | Yes (`aria-live="polite" / "assertive"`) |
| `DataTable` | `role="table"` | Checkboxes & Sort headers navigable via `Tab` & `Enter` | No | Yes (Sort & Page announcements) |
| `Tooltip` | `role="tooltip"` | Appears on focus, dismisses on `Escape` | No | N/A |

---

## 2. Keyboard Navigation Specifications

### Modal & Dialog
- `Escape`: Closes the modal and returns focus to the trigger element that opened it.
- `Tab` / `Shift + Tab`: Cycles focus only through focusable interactive elements within the modal. Prevents focus from escaping to background content.

### Tabs
- `ArrowRight`: Moves focus and selection to the next tab (wraps around to the first).
- `ArrowLeft`: Moves focus and selection to the previous tab (wraps around to the last).
- `Home`: Moves focus to the first tab.
- `End`: Moves focus to the last tab.

### DropdownMenu
- `ArrowDown`: Moves highlight to the next menu item.
- `ArrowUp`: Moves highlight to the previous menu item.
- `Enter` / `Space`: Activates the selected menu item and closes menu.
- `Escape`: Closes menu and returns focus to the menu trigger.

### Accordion
- `Enter` / `Space`: Expands or collapses the focused accordion panel trigger.

---

## 3. Focus Management & Visible Focus Rings

All interactive components in `@boostengine/ui` implement high-visibility keyboard focus rings using the `--boost-ring` variable:

```css
:focus-visible {
  outline: 2px solid var(--boost-ring);
  outline-offset: 2px;
}
```

Components never suppress focus outlines for keyboard users. Mouse clicks suppress ring visuals cleanly via `:focus-visible` CSS semantics.

---

## 4. Color Contrast Ratios (WCAG 2.1 AA)

All default color pairings have been mathematically verified against WCAG AA standards (minimum 4.5:1 for body text, 3:1 for large text and UI components):

| Element Pairing | Light Mode Ratio | Dark Mode Ratio | WCAG AA Status |
|---|---|---|---|
| Primary Button Text on Primary Background | 4.86:1 | 6.12:1 | Passed (AA) |
| Body Text on App Background | 16.2:1 | 15.8:1 | Passed (AAA) |
| Muted Text on Card Background | 4.95:1 | 5.20:1 | Passed (AA) |
| Destructive Text on Card Background | 5.10:1 | 6.45:1 | Passed (AA) |
| Input Border on Background | 3.25:1 | 3.40:1 | Passed (AA UI) |

---

## 5. Screen Reader Announcements (`aria-live`)

- **Toast System**: Operates in an `aria-live="polite"` container so screen readers announce incoming notifications without interrupting the user's current reading flow. Critical error toasts switch to `role="alert"` / `aria-live="assertive"`.
- **Loading Spinners & Skeletons**: Marked with `aria-busy="true"` and `aria-label="Loading..."` to prevent confusing partial screen reader reads during data fetches.
- **DataTable Status**: Total item counts, selected rows count, and active sorting directions are announced clearly via aria attributes on table headers and pagination controls.

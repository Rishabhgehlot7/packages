import * as React from 'react';
import React__default from 'react';

/**
 * useMediaQuery — Reactive CSS media query hook.
 * SSR-safe (returns false on server during hydration).
 *
 * @example
 * const isMobile = useMediaQuery('(max-width: 768px)');
 */
declare function useMediaQuery(query: string): boolean;
/**
 * useClickOutside — Fires callback when user clicks outside the provided ref.
 *
 * @example
 * const ref = useClickOutside<HTMLDivElement>(() => setOpen(false));
 * return <div ref={ref}>...</div>;
 */
declare function useClickOutside<T extends HTMLElement = HTMLElement>(handler: () => void): React.RefObject<T>;
/**
 * useDebounce — Delays updating a value until after a specified delay.
 *
 * @example
 * const [search, setSearch] = useState('');
 * const debouncedSearch = useDebounce(search, 400);
 */
declare function useDebounce<T>(value: T, delayMs?: number): T;
/**
 * useLocalStorage — Persistent state backed by localStorage with JSON serialization.
 * SSR-safe.
 *
 * @example
 * const [cart, setCart] = useLocalStorage<CartItem[]>('cart', []);
 */
declare function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void, () => void];
/**
 * useWindowSize — Reactive window width and height.
 * Returns { width: 0, height: 0 } on SSR.
 *
 * @example
 * const { width, height } = useWindowSize();
 */
declare function useWindowSize(): {
    width: number;
    height: number;
};
/**
 * useScrollPosition — Reactive scroll Y and X position of the window.
 *
 * @example
 * const { scrollY } = useScrollPosition();
 * const isScrolled = scrollY > 60;
 */
declare function useScrollPosition(): {
    scrollX: number;
    scrollY: number;
};
/**
 * usePrevious — Returns the previous value of a state or prop.
 *
 * @example
 * const prevCount = usePrevious(count);
 */
declare function usePrevious<T>(value: T): T | undefined;
/**
 * useCopyToClipboard — Copies text to clipboard and provides a `copied` state.
 * `copied` auto-resets after `resetMs` milliseconds.
 *
 * @example
 * const { copy, copied } = useCopyToClipboard();
 * <button onClick={() => copy('some text')}>{copied ? 'Copied!' : 'Copy'}</button>
 */
declare function useCopyToClipboard(resetMs?: number): {
    copy: (text: string) => Promise<boolean>;
    copied: boolean;
};
/**
 * useToggle — Simple boolean toggle with optional initial value.
 *
 * @example
 * const [isOpen, toggle, setIsOpen] = useToggle(false);
 */
declare function useToggle(initial?: boolean): [boolean, () => void, React.Dispatch<React.SetStateAction<boolean>>];
/**
 * useIntersectionObserver — Tracks whether an element is visible in the viewport.
 *
 * @example
 * const [ref, isVisible] = useIntersectionObserver({ threshold: 0.1 });
 * return <div ref={ref} style={{ opacity: isVisible ? 1 : 0 }}>Fade in</div>;
 */
declare function useIntersectionObserver<T extends HTMLElement = HTMLDivElement>(options?: IntersectionObserverInit): [React.RefObject<T>, boolean];
/**
 * useIsomorphicLayoutEffect — useLayoutEffect on client, useEffect on server (SSR-safe).
 * Use this instead of useLayoutEffect in library code.
 */
declare const useIsomorphicLayoutEffect: typeof React.useEffect;
/**
 * UseFormOptions — Options for useForm hook.
 */
interface UseFormOptions<T extends Record<string, any>> {
    initialValues: T;
    validate?: (values: T) => Partial<Record<keyof T, string>>;
    onSubmit?: (values: T) => void | Promise<void>;
}
/**
 * useForm — Lightweight, zero-dependency form state management hook with validation and submission tracking.
 *
 * @example
 * const { values, errors, handleChange, handleSubmit, isSubmitting } = useForm({
 *   initialValues: { email: '', password: '' },
 *   validate: (v) => (!v.email.includes('@') ? { email: 'Invalid email' } : {}),
 *   onSubmit: async (v) => await login(v),
 * });
 */
declare function useForm<T extends Record<string, any>>({ initialValues, validate, onSubmit, }: UseFormOptions<T>): {
    values: T;
    errors: Partial<Record<keyof T, string>>;
    touched: Partial<Record<keyof T, boolean>>;
    isSubmitting: boolean;
    handleChange: (field: keyof T, value: any) => void;
    handleBlur: (field: keyof T) => void;
    setValues: React.Dispatch<React.SetStateAction<T>>;
    setErrors: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, string>>>>;
    setTouched: React.Dispatch<React.SetStateAction<Partial<Record<keyof T, boolean>>>>;
    reset: () => void;
    handleSubmit: (e?: React.FormEvent) => Promise<void>;
};

/**
 * cn — Merges class names, filtering out falsy values.
 * Lightweight alternative to clsx/classnames with no dependencies.
 *
 * @example
 * cn('base-class', isActive && 'active', undefined, 'another')
 * // => 'base-class active another'
 */
declare function cn(...classes: (string | undefined | null | false | 0)[]): string;
/**
 * formatCurrency — Formats a number as a locale-aware currency string.
 * Defaults to Indian Rupees (INR).
 *
 * @example
 * formatCurrency(1499)           // => '₹1,499'
 * formatCurrency(49.99, 'USD')   // => '$49.99'
 * formatCurrency(1200, 'EUR', 'de-DE') // => '1.200 €'
 */
declare function formatCurrency(amount: number, currency?: string, locale?: string): string;
/**
 * formatNumber — Formats a number with locale-aware separators.
 *
 * @example
 * formatNumber(1482900)  // => '14,82,900' (Indian system)
 * formatNumber(1482900, 'en-US') // => '1,482,900'
 */
declare function formatNumber(value: number, locale?: string, options?: Intl.NumberFormatOptions): string;
/**
 * formatDate — Formats a Date object or ISO string in a human-readable form.
 *
 * @example
 * formatDate(new Date())  // => '18 Sep 2026'
 * formatDate('2026-09-18', 'en-US', { year: 'numeric', month: 'long' }) // => 'September 2026'
 */
declare function formatDate(date: Date | string | number, locale?: string, options?: Intl.DateTimeFormatOptions): string;
/**
 * formatRelativeTime — Returns a human-friendly relative time string.
 *
 * @example
 * formatRelativeTime(new Date(Date.now() - 60000))  // => '1 minute ago'
 * formatRelativeTime(new Date(Date.now() + 3600000)) // => 'in 1 hour'
 */
declare function formatRelativeTime(date: Date | string | number): string;
/**
 * truncate — Truncates a string to a max length, appending an ellipsis.
 *
 * @example
 * truncate('Hello World', 8) // => 'Hello...'
 */
declare function truncate(text: string, maxLength: number, ellipsis?: string): string;
/**
 * slugify — Converts a string to a URL-friendly slug.
 *
 * @example
 * slugify('Hello World! 2026') // => 'hello-world-2026'
 */
declare function slugify(text: string): string;
/**
 * generateId — Generates a random short alphanumeric ID.
 * Not cryptographically secure — for UI key generation only.
 *
 * @example
 * generateId()     // => 'a3f9k2'
 * generateId(12)   // => 'p9z1x4j2m8r3'
 */
declare function generateId(length?: number): string;
/**
 * clamp — Clamps a number between a min and max value.
 *
 * @example
 * clamp(150, 0, 100) // => 100
 * clamp(-5, 0, 100)  // => 0
 */
declare function clamp(value: number, min: number, max: number): number;
/**
 * groupBy — Groups an array of objects by a key.
 *
 * @example
 * groupBy([{type:'A', v:1}, {type:'B', v:2}, {type:'A', v:3}], 'type')
 * // => { A: [...], B: [...] }
 */
declare function groupBy<T extends Record<string, unknown>>(array: T[], key: keyof T): Record<string, T[]>;
/**
 * deepMerge — Recursively merges two plain objects (useful for config merging).
 *
 * @example
 * deepMerge({ a: 1, b: { c: 2 } }, { b: { d: 3 } })
 * // => { a: 1, b: { c: 2, d: 3 } }
 */
declare function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T;
/**
 * omit — Creates a new object without the specified keys.
 *
 * @example
 * omit({ a: 1, b: 2, c: 3 }, ['b', 'c']) // => { a: 1 }
 */
declare function omit<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Omit<T, K>;
/**
 * pick — Creates a new object with only the specified keys.
 *
 * @example
 * pick({ a: 1, b: 2, c: 3 }, ['a', 'c']) // => { a: 1, c: 3 }
 */
declare function pick<T extends Record<string, unknown>, K extends keyof T>(obj: T, keys: K[]): Pick<T, K>;
/**
 * debounce — Returns a debounced version of a function.
 *
 * @example
 * const debouncedSearch = debounce((q: string) => search(q), 400);
 */
declare function debounce<T extends (...args: Parameters<T>) => ReturnType<T>>(fn: T, delayMs: number): (...args: Parameters<T>) => void;
/**
 * getInitials — Extracts initials from a full name (up to 2 characters).
 *
 * @example
 * getInitials('Aarav Sharma')  // => 'AS'
 * getInitials('Priya')         // => 'P'
 */
declare function getInitials(name: string, maxChars?: number): string;
/**
 * isValidEmail — Basic email format validation.
 *
 * @example
 * isValidEmail('user@example.com') // => true
 * isValidEmail('invalid')           // => false
 */
declare function isValidEmail(email: string): boolean;
/**
 * isValidIndianPincode — Validates a 6-digit Indian postal (pin) code.
 *
 * @example
 * isValidIndianPincode('110001') // => true
 * isValidIndianPincode('1234')   // => false
 */
declare function isValidIndianPincode(pincode: string): boolean;
/**
 * isValidIndianMobile — Validates a 10-digit Indian mobile number.
 *
 * @example
 * isValidIndianMobile('9876543210') // => true
 */
declare function isValidIndianMobile(mobile: string): boolean;

type ThemeMode = 'light' | 'dark' | 'system';
interface ThemeTokens {
    primary?: string;
    primaryHover?: string;
    background?: string;
    surface?: string;
    text?: string;
    textMuted?: string;
    border?: string;
    radius?: string;
    fontFamily?: string;
}
interface BoostThemeConfig {
    mode?: ThemeMode;
    tokens?: ThemeTokens;
    darkTokens?: ThemeTokens;
}
interface BoostThemeContextType {
    mode: ThemeMode;
    resolvedMode: 'light' | 'dark';
    setMode: (mode: ThemeMode) => void;
    toggleMode: () => void;
    tokens: ThemeTokens;
}
interface BoostProviderProps {
    children: React.ReactNode;
    mode?: ThemeMode;
    defaultMode?: ThemeMode;
    storageKey?: string;
    syncDocumentClass?: boolean;
    tokens?: ThemeTokens;
    darkTokens?: ThemeTokens;
    className?: string;
}
declare const BoostProvider: React.FC<BoostProviderProps>;
declare const useTheme: () => BoostThemeContextType;

interface ThemeToggleProps {
    /**
     * Visual style variant
     * - 'icon': Minimalist circular or rounded icon button (default)
     * - 'button': Icon with descriptive text label
     * - 'segmented': Modern 3-option pill control (Light, Dark, System)
     * - 'switch': Compact toggle switch with sun/moon symbols
     */
    variant?: 'icon' | 'button' | 'segmented' | 'switch';
    /** Size of the control */
    size?: 'sm' | 'md' | 'lg';
    /** Show custom labels in 'button' variant */
    showLabel?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const ThemeToggle: React.FC<ThemeToggleProps>;

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link';
type ButtonSize = 'sm' | 'md' | 'lg';
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
    loading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}
declare const Button: React.ForwardRefExoticComponent<ButtonProps & React.RefAttributes<HTMLButtonElement>>;

type IconButtonShape = 'square' | 'rounded' | 'circle';
interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    label?: string;
    ariaLabel?: string;
    shape?: IconButtonShape;
    variant?: ButtonVariant;
    size?: ButtonSize;
    isLoading?: boolean;
}
declare const IconButton: React.ForwardRefExoticComponent<IconButtonProps & React.RefAttributes<HTMLButtonElement>>;

interface ButtonGroupProps {
    children: React.ReactNode;
    orientation?: 'horizontal' | 'vertical';
    fullWidth?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const ButtonGroup: React.FC<ButtonGroupProps>;

interface FloatingActionButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    icon?: React.ReactNode;
    label?: string;
    position?: 'bottom-right' | 'bottom-left' | 'top-right' | 'top-left';
}
declare const FloatingActionButton: React.FC<FloatingActionButtonProps>;

interface LinkButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    variant?: ButtonVariant;
    size?: ButtonSize;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}
declare const LinkButton: React.FC<LinkButtonProps>;

interface CopyButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    text: string;
    label?: string;
    copiedLabel?: string;
    timeout?: number;
    variant?: 'outline' | 'ghost' | 'solid';
    size?: 'sm' | 'md';
    iconOnly?: boolean;
    className?: string;
}
declare const CopyButton: React.FC<CopyButtonProps>;

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    helperText?: string;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    fullWidth?: boolean;
}
declare const Input: React.ForwardRefExoticComponent<InputProps & React.RefAttributes<HTMLInputElement>>;

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    helperText?: string;
    maxChars?: number;
    showCount?: boolean;
    fullWidth?: boolean;
}
declare const Textarea: React.ForwardRefExoticComponent<TextareaProps & React.RefAttributes<HTMLTextAreaElement>>;

interface SelectOption {
    label: string;
    value: string | number;
    disabled?: boolean;
}
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    helperText?: string;
    options: SelectOption[];
    placeholder?: string;
    fullWidth?: boolean;
}
declare const Select: React.ForwardRefExoticComponent<SelectProps & React.RefAttributes<HTMLSelectElement>>;

interface MultiSelectOption {
    label: string;
    value: string;
}
interface MultiSelectProps {
    label?: string;
    options: MultiSelectOption[];
    value: string[];
    onChange: (selected: string[]) => void;
    placeholder?: string;
    error?: string;
    className?: string;
    disabled?: boolean;
    style?: React.CSSProperties;
}
declare const MultiSelect: React.FC<MultiSelectProps>;

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    label?: string;
    description?: string;
    indeterminate?: boolean;
}
declare const Checkbox: React.ForwardRefExoticComponent<CheckboxProps & React.RefAttributes<HTMLInputElement>>;

interface RadioProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: React.ReactNode;
    description?: React.ReactNode;
}
declare const Radio: React.ForwardRefExoticComponent<RadioProps & React.RefAttributes<HTMLInputElement>>;
interface RadioOption {
    label: string;
    value: string | number;
    description?: string;
    disabled?: boolean;
}
interface RadioGroupProps {
    name: string;
    options: RadioOption[];
    value: string | number;
    onChange: (value: string | number) => void;
    orientation?: 'vertical' | 'horizontal';
    className?: string;
    style?: React.CSSProperties;
    disabled?: boolean;
}
declare const RadioGroup: React.FC<RadioGroupProps>;

interface SwitchProps {
    checked: boolean;
    onChange: (checked: boolean) => void;
    label?: string;
    description?: string;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}
declare const Switch: React.ForwardRefExoticComponent<SwitchProps & React.RefAttributes<HTMLButtonElement>>;

interface DatePickerProps {
    label?: string;
    value?: string;
    onChange: (date: string) => void;
    minDate?: string;
    maxDate?: string;
    min?: string;
    max?: string;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const DatePicker: React.FC<DatePickerProps>;

interface TimePickerProps {
    label?: string;
    value?: string;
    onChange: (time: string) => void;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const TimePicker: React.FC<TimePickerProps>;

interface FileUploadProps {
    label?: string;
    accept?: string;
    maxFiles?: number;
    maxSizeMB?: number;
    onFilesSelected: (files: File[]) => void;
    error?: string;
    helperText?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const FileUpload: React.FC<FileUploadProps>;

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
    onClear?: () => void;
    onSearch?: (query: string) => void;
    fullWidth?: boolean;
}
declare const SearchInput: React.ForwardRefExoticComponent<SearchInputProps & React.RefAttributes<HTMLInputElement>>;

interface FormFieldProps {
    label: string;
    required?: boolean;
    error?: string;
    helperText?: string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const FormField: React.FC<FormFieldProps>;

interface OTPInputProps {
    length?: number;
    value: string;
    onChange: (otp: string) => void;
    onComplete?: (otp: string) => void;
    disabled?: boolean;
    error?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const OTPInput: React.ForwardRefExoticComponent<OTPInputProps & React.RefAttributes<HTMLInputElement>>;

interface FileDropzoneProps {
    onFilesSelected: (files: File[]) => void;
    accept?: string;
    multiple?: boolean;
    maxSizeMB?: number;
    title?: string;
    subtitle?: string;
    disabled?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const FileDropzone: React.FC<FileDropzoneProps>;

interface LoaderProps {
    size?: 'sm' | 'md' | 'lg' | number;
    color?: string;
    text?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const Loader: React.FC<LoaderProps>;

interface SpinnerProps extends React__default.SVGAttributes<SVGSVGElement> {
    size?: 'sm' | 'md' | 'lg' | number;
    color?: string;
    strokeWidth?: number;
}
declare const Spinner: React__default.FC<SpinnerProps>;

interface ProgressBarProps {
    value: number;
    label?: string;
    showPercentage?: boolean;
    showPercent?: boolean;
    color?: string;
    height?: number;
    className?: string;
    style?: React.CSSProperties;
}
declare const ProgressBar: React.FC<ProgressBarProps>;

interface SkeletonProps {
    variant?: 'text' | 'circular' | 'rectangular';
    width?: string | number;
    height?: string | number;
    borderRadius?: string | number;
    className?: string;
    style?: React.CSSProperties;
}
declare const Skeleton: React.FC<SkeletonProps>;

type ToastVariant = 'info' | 'success' | 'warning' | 'error';
type ToastPosition = 'top-right' | 'top-left' | 'top-center' | 'bottom-right' | 'bottom-left' | 'bottom-center';
interface ToastProps {
    id?: string;
    title?: string;
    message: string;
    variant?: ToastVariant;
    type?: ToastVariant;
    onClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
}
declare const Toast: React.FC<ToastProps>;
interface ToastOptions {
    id?: string;
    title?: string;
    message: string;
    variant?: ToastVariant;
    duration?: number;
}
interface ToastContextType {
    toast: {
        (options: ToastOptions): string;
        success: (message: string, title?: string) => string;
        error: (message: string, title?: string) => string;
        warning: (message: string, title?: string) => string;
        info: (message: string, title?: string) => string;
        dismiss: (id: string) => void;
    };
}
interface ToastProviderProps {
    children: React.ReactNode;
    position?: ToastPosition;
    defaultDuration?: number;
}
declare const ToastProvider: React.FC<ToastProviderProps>;
declare const useToast: () => ToastContextType;

type AlertVariant = 'info' | 'success' | 'warning' | 'destructive' | 'error';
interface AlertProps {
    title?: string;
    children?: React.ReactNode;
    description?: React.ReactNode;
    variant?: AlertVariant;
    type?: AlertVariant;
    icon?: React.ReactNode;
    onClose?: () => void;
    className?: string;
    style?: React.CSSProperties;
}
declare const Alert: React.FC<AlertProps>;

interface SnackbarProps {
    message: string;
    actionText?: string;
    actionLabel?: string;
    onAction?: () => void;
    isOpen?: boolean;
    onClose?: () => void;
    duration?: number;
    className?: string;
    style?: React.CSSProperties;
}
declare const Snackbar: React.FC<SnackbarProps>;

interface EmptyStateProps {
    title: string;
    description?: string;
    actionText?: string;
    actionLabel?: string;
    onAction?: () => void;
    icon?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const EmptyState: React.FC<EmptyStateProps>;

interface ErrorStateProps {
    title?: string;
    message?: string;
    description?: string;
    onRetry?: () => void;
    retryText?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const ErrorState: React.FC<ErrorStateProps>;

interface SuccessMessageProps {
    title?: string;
    message?: string;
    description?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const SuccessMessage: React.FC<SuccessMessageProps>;

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    hoverable?: boolean;
    variant?: 'elevated' | 'outlined' | 'glass';
}
type CardHeaderProps = React.HTMLAttributes<HTMLDivElement>;
type CardTitleProps = React.HTMLAttributes<HTMLHeadingElement>;
type CardDescriptionProps = React.HTMLAttributes<HTMLParagraphElement>;
type CardContentProps = React.HTMLAttributes<HTMLDivElement>;
type CardFooterProps = React.HTMLAttributes<HTMLDivElement>;
declare const Card: React.ForwardRefExoticComponent<CardProps & React.RefAttributes<HTMLDivElement>>;
declare const CardHeader: React.FC<CardHeaderProps>;
declare const CardTitle: React.FC<CardTitleProps>;
declare const CardDescription: React.FC<CardDescriptionProps>;
declare const CardContent: React.FC<CardContentProps>;
declare const CardFooter: React.FC<CardFooterProps>;

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    fallbackSrc?: string;
    aspectRatio?: 'square' | 'video' | 'portrait' | 'auto' | string;
    objectFit?: 'cover' | 'contain' | 'fill';
    containerStyle?: React.CSSProperties;
}
declare const Image: React.FC<ImageProps>;

interface AvatarProps {
    src?: string;
    name?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    status?: 'online' | 'offline' | 'busy' | 'away';
    className?: string;
    style?: React.CSSProperties;
}
declare const Avatar: React.FC<AvatarProps>;
interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    max?: number;
    spacing?: number;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    style?: React.CSSProperties;
}
declare const AvatarGroup: React.FC<AvatarGroupProps>;

type BadgeVariant = 'default' | 'primary' | 'secondary' | 'outline' | 'success' | 'destructive' | 'warning' | 'info';
interface BadgeProps {
    children: React.ReactNode;
    variant?: BadgeVariant;
    className?: string;
    style?: React.CSSProperties;
}
declare const Badge: React.FC<BadgeProps>;

interface TagProps {
    label?: string;
    children?: React.ReactNode;
    onRemove?: () => void;
    color?: string;
    variant?: 'default' | 'primary' | 'success' | 'warning' | 'destructive' | 'purple';
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    style?: React.CSSProperties;
}
declare const Tag: React.FC<TagProps>;

interface TooltipProps {
    content: React.ReactNode;
    children: React.ReactNode;
    position?: 'top' | 'bottom' | 'left' | 'right';
    className?: string;
    style?: React.CSSProperties;
}
declare const Tooltip: React.FC<TooltipProps>;

interface ChipProps {
    label?: string;
    children?: React.ReactNode;
    selected?: boolean;
    onClick?: () => void;
    onDelete?: () => void;
    avatar?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const Chip: React.FC<ChipProps>;

interface DividerProps extends React.HTMLAttributes<HTMLDivElement> {
    orientation?: 'horizontal' | 'vertical';
    label?: React.ReactNode;
    labelPosition?: 'left' | 'center' | 'right';
    className?: string;
    style?: React.CSSProperties;
}
declare const Divider: React.FC<DividerProps>;

interface AccordionItem {
    id: string;
    title: string;
    content: React.ReactNode;
    disabled?: boolean;
}
interface AccordionProps {
    items: AccordionItem[];
    allowMultiple?: boolean;
    defaultExpanded?: string[];
    variant?: 'default' | 'bordered' | 'separated';
    className?: string;
    style?: React.CSSProperties;
}
declare const Accordion: React.FC<AccordionProps>;

type CarouselSlide = React.ReactNode;
interface CarouselProps {
    items: CarouselSlide[];
    autoPlay?: boolean;
    interval?: number;
    showIndicators?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const Carousel: React.FC<CarouselProps>;

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    description?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    className?: string;
    style?: React.CSSProperties;
    closeOnOverlayClick?: boolean;
    showCloseButton?: boolean;
}
declare const Modal: React.FC<ModalProps>;
declare const Dialog: React.FC<ModalProps>;
type DialogProps = ModalProps;

interface DrawerProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    placement?: 'left' | 'right' | 'top' | 'bottom';
    position?: 'left' | 'right' | 'top' | 'bottom';
    size?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
}
declare const Drawer: React.FC<DrawerProps>;

interface BottomSheetProps {
    isOpen: boolean;
    onClose: () => void;
    title?: string;
    children: React.ReactNode;
    footer?: React.ReactNode;
    maxHeight?: string;
    className?: string;
    style?: React.CSSProperties;
    dragHandle?: boolean;
    showCloseButton?: boolean;
    closeOnOverlayClick?: boolean;
}
declare const BottomSheet: React.FC<BottomSheetProps>;

interface PopoverProps {
    trigger: React.ReactNode;
    content: React.ReactNode;
    placement?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' | 'bottom' | 'top';
    isOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
    className?: string;
    style?: React.CSSProperties;
    contentStyle?: React.CSSProperties;
    showArrow?: boolean;
}
declare const Popover: React.FC<PopoverProps>;

interface ConfirmationDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'danger' | 'primary' | 'warning' | 'destructive';
    confirmVariant?: 'danger' | 'primary' | 'warning' | 'destructive';
    isLoading?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const ConfirmationDialog: React.FC<ConfirmationDialogProps>;

interface CommandItem {
    id: string;
    label: string;
    description?: string;
    icon?: React.ReactNode;
    shortcut?: string[];
    group?: string;
    onSelect: () => void;
}
interface CommandPaletteProps {
    isOpen: boolean;
    onClose: () => void;
    items: CommandItem[];
    placeholder?: string;
    emptyText?: string;
    className?: string;
}
declare const CommandPalette: React.FC<CommandPaletteProps>;

interface PortalProps {
    children: React.ReactNode;
    container?: HTMLElement | null;
}
/**
 * Portal — Renders children into a DOM node outside the current DOM hierarchy (typically document.body).
 * Fully SSR-safe and hydration safe.
 *
 * @example
 * <Portal>
 *   <div className="custom-overlay">Floating content</div>
 * </Portal>
 */
declare const Portal: React.FC<PortalProps>;

type BoxAsTag = 'div' | 'span' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'nav';
interface BoxProps extends React.HTMLAttributes<HTMLElement> {
    as?: BoxAsTag;
    children?: React.ReactNode;
    p?: string | number;
    px?: string | number;
    py?: string | number;
    pt?: string | number;
    pb?: string | number;
    pl?: string | number;
    pr?: string | number;
    m?: string | number;
    mx?: string | number;
    my?: string | number;
    mt?: string | number;
    mb?: string | number;
    ml?: string | number;
    mr?: string | number;
    bg?: string;
    color?: string;
    border?: string;
    borderRadius?: string | number;
    width?: string | number;
    height?: string | number;
    maxWidth?: string | number;
    minHeight?: string | number;
    display?: React.CSSProperties['display'];
    position?: React.CSSProperties['position'];
    className?: string;
    style?: React.CSSProperties;
}
declare const Box: React.ForwardRefExoticComponent<BoxProps & React.RefAttributes<HTMLElement>>;

interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    direction?: React.CSSProperties['flexDirection'];
    justify?: React.CSSProperties['justifyContent'];
    align?: React.CSSProperties['alignItems'];
    wrap?: React.CSSProperties['flexWrap'];
    gap?: string | number;
    inline?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const Flex: React.ForwardRefExoticComponent<FlexProps & React.RefAttributes<HTMLDivElement>>;

interface StackProps extends React.HTMLAttributes<HTMLDivElement> {
    direction?: 'row' | 'column';
    gap?: number | string;
    align?: 'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline';
    justify?: 'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around' | 'space-evenly';
    wrap?: boolean | 'wrap' | 'nowrap' | 'wrap-reverse';
    fullWidth?: boolean;
}
type HStackProps = Omit<StackProps, 'direction'>;
type VStackProps = Omit<StackProps, 'direction'>;
declare const Stack: React.FC<StackProps>;
declare const HStack: React.FC<HStackProps>;
declare const VStack: React.FC<VStackProps>;

interface ResponsiveBreakpoints<T> {
    base?: T;
    sm?: T;
    md?: T;
    lg?: T;
    xl?: T;
}
interface GridProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    cols?: number | string | ResponsiveBreakpoints<number | string>;
    gap?: string | number | ResponsiveBreakpoints<string | number>;
    rowGap?: string | number;
    columnGap?: string | number;
    align?: React.CSSProperties['alignItems'];
    justify?: React.CSSProperties['justifyContent'];
    autoResponsive?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const Grid: React.ForwardRefExoticComponent<GridProps & React.RefAttributes<HTMLDivElement>>;
interface GridItemProps extends React.HTMLAttributes<HTMLDivElement> {
    children?: React.ReactNode;
    colSpan?: number | 'full';
    rowSpan?: number;
    colStart?: number;
    rowStart?: number;
    className?: string;
    style?: React.CSSProperties;
}
declare const GridItem: React.ForwardRefExoticComponent<GridItemProps & React.RefAttributes<HTMLDivElement>>;

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
    children?: React.ReactNode;
    maxWidth?: string | number;
    py?: string | number;
    px?: string | number;
    bg?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const Section: React.ForwardRefExoticComponent<SectionProps & React.RefAttributes<HTMLElement>>;

interface AspectRatioProps extends React.HTMLAttributes<HTMLDivElement> {
    ratio?: number | string;
    children: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const AspectRatio: React.ForwardRefExoticComponent<AspectRatioProps & React.RefAttributes<HTMLDivElement>>;

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    maxHeight?: string | number;
    maxWidth?: string | number;
    direction?: 'vertical' | 'horizontal' | 'both';
    className?: string;
    style?: React.CSSProperties;
}
declare const ScrollArea: React.ForwardRefExoticComponent<ScrollAreaProps & React.RefAttributes<HTMLDivElement>>;

interface MotionProps extends React.HTMLAttributes<HTMLDivElement> {
    animation?: 'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'slide-in-right' | 'slide-in-left' | 'spin' | 'pulse' | 'shimmer';
    duration?: number;
    delay?: number;
    triggerOnce?: boolean;
    viewportThreshold?: number;
    children: React.ReactNode;
}
/**
 * Motion — Zero-dependency scroll and entrance animation wrapper.
 * Uses native IntersectionObserver to animate content into view smoothly,
 * and also supports continuous animations like spin, pulse, and shimmer.
 */
declare const Motion: React.FC<MotionProps>;

interface HeaderNavLink {
    label: string;
    href: string;
    badge?: string | number;
    active?: boolean;
}
interface HeaderProps {
    logo?: React.ReactNode;
    brandName?: string;
    brandBadge?: string;
    navLinks?: HeaderNavLink[];
    links?: HeaderNavLink[];
    activeHref?: string;
    onLinkClick?: (href: string) => void;
    actions?: React.ReactNode;
    searchBar?: React.ReactNode;
    sticky?: boolean;
    className?: string;
    style?: React.CSSProperties;
    renderMobileMenu?: (props: {
        isOpen: boolean;
        onClose: () => void;
        links: HeaderNavLink[];
    }) => React.ReactNode;
}
declare const Header: React.FC<HeaderProps>;

interface NavLinkItem {
    label: string;
    href: string;
    badge?: string;
    isHighlight?: boolean;
    children?: NavLinkItem[];
}
interface NavbarProps {
    brandName?: string;
    logo?: React.ReactNode;
    logoUrl?: string;
    brandBadge?: string;
    navLinks?: NavLinkItem[];
    activeHref?: string;
    searchPlaceholder?: string;
    searchValue?: string;
    onSearchChange?: (val: string) => void;
    onSearchSubmit?: (val: string) => void;
    showSearch?: boolean;
    cartCount?: number;
    wishlistCount?: number;
    onCartClick?: () => void;
    onWishlistClick?: () => void;
    onAccountClick?: () => void;
    onLinkClick?: (href: string) => void;
    isLoggedIn?: boolean;
    userName?: string;
    sticky?: boolean;
    announcementText?: string;
    announcementLink?: string;
    onAnnouncementClose?: () => void;
    actions?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const Navbar: React.FC<NavbarProps>;

interface SidebarItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: string | number;
    href?: string;
    onClick?: () => void;
}
interface SidebarGroup {
    title?: string;
    items: SidebarItem[];
}
interface SidebarProps {
    groups: SidebarGroup[];
    activeId?: string;
    onSelect?: (id: string) => void;
    collapsed?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    className?: string;
}
declare const Sidebar: React.FC<SidebarProps>;

interface FooterColumn {
    title: string;
    links: Array<{
        label: string;
        href: string;
    }>;
}
interface FooterSocialLink {
    name?: string;
    platform?: string;
    href: string;
    icon?: React.ReactNode;
}
interface FooterProps {
    logo?: React.ReactNode;
    brandName?: string;
    brandBadge?: string;
    description?: string;
    columns?: FooterColumn[];
    socialLinks?: FooterSocialLink[];
    bottomLinks?: Array<{
        label: string;
        href: string;
    }>;
    newsletter?: boolean;
    onNewsletterSubmit?: (email: string) => void;
    showPaymentBadges?: boolean;
    copyrightYear?: number;
    copyrightText?: string;
    variant?: 'dark' | 'light' | 'surface';
    className?: string;
    style?: React.CSSProperties;
}
declare const Footer: React.FC<FooterProps>;

interface MobileBottomBarItem {
    id: string;
    label: string;
    icon: 'home' | 'search' | 'categories' | 'wishlist' | 'cart' | 'account' | React.ReactNode;
    badge?: number | string;
    href?: string;
}
interface MobileBottomBarProps {
    activeTab?: string;
    defaultActiveTab?: string;
    cartCount?: number;
    wishlistCount?: number;
    items?: MobileBottomBarItem[];
    onTabChange?: (tabId: string, href?: string) => void;
    showLabels?: boolean;
    activeColor?: string;
    variant?: 'glass' | 'solid' | 'floating';
    className?: string;
    style?: React.CSSProperties;
}
declare const MobileBottomBar: React.FC<MobileBottomBarProps>;

interface MobileBottomNavItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    badge?: number | string;
    href?: string;
}
interface MobileBottomNavProps {
    items: MobileBottomNavItem[];
    activeId?: string;
    defaultActiveId?: string;
    onChange?: (id: string, href?: string) => void;
    showLabels?: boolean;
    activeColor?: string;
    variant?: 'glass' | 'floating' | 'solid';
    className?: string;
    style?: React.CSSProperties;
}
declare const MobileBottomNav: React.FC<MobileBottomNavProps>;

interface BreadcrumbItem {
    label: string;
    href?: string;
    icon?: React.ReactNode;
}
interface BreadcrumbProps {
    items: BreadcrumbItem[];
    separator?: React.ReactNode;
    onItemClick?: (href: string, item: BreadcrumbItem) => void;
    className?: string;
    style?: React.CSSProperties;
}
declare const Breadcrumb: React.FC<BreadcrumbProps>;

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
    maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
}
declare const Container: React.FC<ContainerProps>;

interface PageWrapperProps {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    sidebar?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const PageWrapper: React.FC<PageWrapperProps>;

interface NavLinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    isActive?: boolean;
    active?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
    badge?: string | number;
}
declare const NavLink: React.FC<NavLinkProps>;

interface DropdownMenuItem {
    id?: string;
    label: string;
    icon?: React.ReactNode;
    disabled?: boolean;
    destructive?: boolean;
    onClick?: () => void;
}
interface DropdownMenuProps {
    trigger: React.ReactNode;
    items: DropdownMenuItem[];
    align?: 'left' | 'right';
    className?: string;
}
declare const DropdownMenu: React.FC<DropdownMenuProps>;

interface MegaMenuLink {
    label: string;
    href: string;
    description?: string;
    badge?: string;
}
interface MegaMenuSection {
    title: string;
    links: MegaMenuLink[];
}
interface MegaMenuColumn {
    title: string;
    links: MegaMenuLink[];
}
interface MegaMenuCategory {
    id: string;
    label: string;
    icon?: React.ReactNode;
    columns?: MegaMenuColumn[];
    sections?: MegaMenuSection[];
}
interface MegaMenuProps {
    trigger?: React.ReactNode | ((props: {
        isOpen: boolean;
    }) => React.ReactNode);
    triggerLabel?: string;
    sections?: MegaMenuSection[];
    categories?: MegaMenuCategory[];
    featured?: React.ReactNode;
    isOpen?: boolean;
    onOpenChange?: (isOpen: boolean) => void;
    onLinkClick?: (link: MegaMenuLink) => void;
    className?: string;
    style?: React.CSSProperties;
}
declare const MegaMenu: React.FC<MegaMenuProps>;

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
    className?: string;
}
declare const Pagination: React.FC<PaginationProps>;

interface TabItem {
    id: string;
    label: string;
    icon?: React.ReactNode;
    content: React.ReactNode;
    badge?: string | number;
    disabled?: boolean;
}
interface TabsProps {
    tabs?: TabItem[];
    items?: TabItem[];
    defaultTab?: string;
    activeTab?: string;
    activeId?: string;
    onChange?: (tabId: string) => void;
    className?: string;
}
declare const Tabs: React.FC<TabsProps>;

interface StepItem {
    id: string | number;
    title?: string;
    label?: string;
    description?: string;
}
interface StepperProps {
    steps: StepItem[];
    activeStep?: number;
    currentStep?: number;
    onStepClick?: (stepIndex: number) => void;
    className?: string;
}
declare const Stepper: React.FC<StepperProps>;

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label?: string;
    onBack?: () => void;
}
declare const BackButton: React.FC<BackButtonProps>;

interface TableColumn<T = any> {
    header: string;
    key?: string;
    accessor?: keyof T | ((row: T) => React.ReactNode);
    align?: 'left' | 'center' | 'right';
    width?: string;
    sortable?: boolean;
}
interface TableProps<T = any> {
    columns: TableColumn<T>[];
    data: T[];
    striped?: boolean;
    bordered?: boolean;
    hoverable?: boolean;
    className?: string;
    keyExtractor?: (row: T, index: number) => string | number;
}
declare function Table<T extends Record<string, any>>({ columns, data, striped, bordered, hoverable, className, keyExtractor, }: TableProps<T>): React.JSX.Element;
declare namespace Table {
    var displayName: string;
}

type DataTableColumn<T = any> = TableColumn<T>;
interface DataTableProps<T = any> {
    columns: DataTableColumn<T>[];
    data: T[];
    pageSize?: number;
    searchable?: boolean;
    searchPlaceholder?: string;
    searchFilter?: (item: T, query: string) => boolean;
    className?: string;
}
declare function DataTable<T extends Record<string, any>>({ columns, data, pageSize, searchable, searchPlaceholder, searchFilter, className, }: DataTableProps<T>): React.JSX.Element;
declare namespace DataTable {
    var displayName: string;
}

interface StatsCardProps {
    title: string;
    value: string | number;
    change?: string | number;
    trend?: {
        value: number | string;
        isPositive?: boolean;
    } | string | number;
    isPositive?: boolean;
    period?: string;
    description?: string;
    icon?: React.ReactNode;
    className?: string;
}
declare const StatsCard: React.FC<StatsCardProps>;

interface KPIWidgetProps extends React.HTMLAttributes<HTMLDivElement> {
    title: string;
    value: string | number;
    change?: number | string;
    changePeriod?: string;
    icon?: React.ReactNode;
    subtitle?: string;
    sparkline?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const KPIWidget: React.FC<KPIWidgetProps>;

interface ChartDataPoint {
    label: string;
    value: number;
    secondaryValue?: number;
}
interface AreaChartProps {
    data: ChartDataPoint[];
    title?: string;
    subtitle?: string;
    height?: number;
    color?: string;
    secondaryColor?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    valuePrefix?: string;
    valueSuffix?: string;
    showGrid?: boolean;
    showDots?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const AreaChart: React.FC<AreaChartProps>;

interface BarChartDataPoint {
    label: string;
    value: number;
    secondaryValue?: number;
}
interface BarChartProps {
    data: BarChartDataPoint[];
    title?: string;
    subtitle?: string;
    height?: number;
    color?: string;
    secondaryColor?: string;
    primaryLabel?: string;
    secondaryLabel?: string;
    valuePrefix?: string;
    valueSuffix?: string;
    showGrid?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const BarChart: React.FC<BarChartProps>;

interface DonutDataPoint {
    label: string;
    value: number;
    color?: string;
}
interface DonutChartProps {
    data: DonutDataPoint[];
    title?: string;
    subtitle?: string;
    size?: number;
    innerRadiusRatio?: number;
    centerLabel?: string;
    centerValue?: string;
    valuePrefix?: string;
    valueSuffix?: string;
    showLegend?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const DonutChart: React.FC<DonutChartProps>;

interface SparklineProps {
    data: number[];
    width?: number | string;
    height?: number;
    color?: string;
    strokeWidth?: number;
    showFill?: boolean;
    autoColor?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const Sparkline: React.FC<SparklineProps>;

interface ActivityUser {
    name: string;
    avatar?: string;
    role?: string;
}
interface ActivityItem {
    id: string;
    user: ActivityUser;
    action: string;
    target?: string;
    timestamp: string;
    statusBadge?: {
        label: string;
        variant?: 'success' | 'warning' | 'info' | 'error';
    };
    icon?: React.ReactNode;
}
interface ActivityFeedProps extends React.HTMLAttributes<HTMLDivElement> {
    items: ActivityItem[];
    title?: string;
    emptyText?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const ActivityFeed: React.FC<ActivityFeedProps>;

interface NotificationItem {
    id: string;
    title: string;
    description?: string;
    timestamp: string;
    read?: boolean;
    avatar?: string;
    actionUrl?: string;
    icon?: React.ReactNode;
}
interface NotificationCenterProps {
    notifications: NotificationItem[];
    onMarkAllAsRead?: () => void;
    onItemClick?: (item: NotificationItem) => void;
    onClearAll?: () => void;
    title?: string;
    emptyText?: string;
    className?: string;
}
declare const NotificationCenter: React.FC<NotificationCenterProps>;

interface DateRange {
    startDate: string;
    endDate: string;
}
interface DateRangePickerProps {
    startDate?: string;
    endDate?: string;
    onRangeChange?: (start: string, end: string) => void;
    value?: DateRange;
    onChange?: (range: DateRange) => void;
    label?: string;
    className?: string;
}
declare const DateRangePicker: React.FC<DateRangePickerProps>;

interface ExportButtonProps extends React__default.ButtonHTMLAttributes<HTMLButtonElement> {
    onExport?: (format: 'csv' | 'xlsx' | 'pdf' | 'json') => void;
    format?: 'csv' | 'xlsx' | 'pdf' | 'json';
    label?: string;
    loading?: boolean;
}
declare const ExportButton: React__default.FC<ExportButtonProps>;

interface FilterOption {
    label: string;
    value: string;
    count?: number;
}
interface FilterProps {
    label?: string;
    options: FilterOption[];
    selectedValues?: string[];
    onChange?: (values: string[]) => void;
    multiple?: boolean;
    clearable?: boolean;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const Filter: React__default.FC<FilterProps>;

interface SortOption {
    label: string;
    value: string;
}
type SortDirection = 'asc' | 'desc';
interface SortProps {
    options: SortOption[];
    currentValue?: string;
    currentDirection?: SortDirection;
    onChange?: (value: string, direction: SortDirection) => void;
    label?: string;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const Sort: React__default.FC<SortProps>;

interface LoginFormProps {
    onSubmit?: (data: {
        identifier: string;
        password: string;
        rememberMe: boolean;
    }) => void;
    onForgotPassword?: () => void;
    onRegisterClick?: () => void;
    loading?: boolean;
    errorMessage?: string;
    title?: string;
    subtitle?: string;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const LoginForm: React__default.FC<LoginFormProps>;

interface RegisterFormData {
    fullName: string;
    email: string;
    phone?: string;
    password: string;
    acceptTerms: boolean;
}
interface RegisterFormProps {
    onSubmit?: (data: RegisterFormData) => void;
    onLoginClick?: () => void;
    loading?: boolean;
    errorMessage?: string;
    title?: string;
    subtitle?: string;
}
declare const RegisterForm: React__default.FC<RegisterFormProps>;

interface ForgotPasswordProps {
    onSubmit?: (email: string) => void;
    onBackToLogin?: () => void;
    loading?: boolean;
    successMessage?: string;
    errorMessage?: string;
}
declare const ForgotPassword: React__default.FC<ForgotPasswordProps>;

interface ResetPasswordProps {
    onSubmit?: (newPassword: string) => void;
    onBackToLogin?: () => void;
    loading?: boolean;
    errorMessage?: string;
}
declare const ResetPassword: React__default.FC<ResetPasswordProps>;

interface CartDrawerItem {
    id: string;
    title: string;
    variantTitle?: string;
    price: number;
    quantity: number;
    image?: string;
}
interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items: CartDrawerItem[];
    subtotal: number;
    freeShippingThreshold?: number;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemoveItem: (id: string) => void;
    onCheckout: () => Promise<void> | void;
    className?: string;
    onTabSync?: () => void;
}
declare const CartDrawer: React.FC<CartDrawerProps>;

interface StickyAddToCartProps {
    title: string;
    price: number;
    compareAtPrice?: number;
    originalPrice?: number;
    image?: string;
    onAddToCart: (quantity: number) => Promise<void> | void;
    onBuyNow?: (quantity: number) => Promise<void> | void;
    inStock?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const StickyAddToCart: React.FC<StickyAddToCartProps>;

interface PincodeCheckResult {
    isServiceable: boolean;
    estimatedDeliveryDate?: string;
    isCodAvailable?: boolean;
    courier?: string;
}
interface PincodeCheckerProps {
    onCheck?: (pincode: string) => Promise<PincodeCheckResult> | PincodeCheckResult;
    defaultPincode?: string;
    className?: string;
}
declare const PincodeChecker: React.FC<PincodeCheckerProps>;

interface TrustBadgesProps {
    layout?: 'row' | 'grid';
    showCodBadge?: boolean;
    showReturnsBadge?: boolean;
    showSecureBadge?: boolean;
    showGenuineBadge?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const TrustBadges: React.FC<TrustBadgesProps>;

type OrderStage = 'placed' | 'confirmed' | 'shipped' | 'out_for_delivery' | 'delivered';
interface OrderTimelineProps {
    currentStage: OrderStage;
    dates?: {
        placed?: string;
        confirmed?: string;
        shipped?: string;
        out_for_delivery?: string;
        delivered?: string;
    };
    className?: string;
}
declare const OrderTimeline: React.FC<OrderTimelineProps>;

interface StarRatingProps {
    rating: number;
    reviewCount?: number;
    size?: number;
    color?: string;
    showText?: boolean;
    className?: string;
}
declare const StarRating: React.FC<StarRatingProps>;

type ProductGalleryImageItem = string | {
    id?: string;
    url?: string;
    src?: string;
    alt?: string;
};
interface ProductGalleryProps {
    images?: ProductGalleryImageItem[];
    title?: string;
    layout?: 'stacked' | 'thumbnails-bottom' | 'thumbnails-left';
    aspectRatio?: 'square' | 'portrait' | 'wide';
    enableZoom?: boolean;
    className?: string;
}
declare const ProductGallery: React.FC<ProductGalleryProps>;

interface VariantOption {
    id: string;
    name?: string;
    value?: string;
    label?: string;
    colorHex?: string;
    priceDelta?: number;
    inStock?: boolean;
}
interface VariantGroup {
    name: string;
    type?: 'color' | 'chip' | 'dropdown';
    options: VariantOption[];
}
type SelectedVariants = Record<string, string>;
interface VariantSelectorProps {
    groups: VariantGroup[];
    selectedValues?: SelectedVariants;
    selectedVariants?: SelectedVariants;
    onChange?: (groupName: string, optionValue: string, option?: VariantOption) => void;
    className?: string;
}
declare const VariantSelector: React.FC<VariantSelectorProps>;

interface ProductCardProps {
    id: string;
    title: string;
    price: number;
    compareAtPrice?: number;
    originalPrice?: number;
    images?: string[];
    image?: string;
    imageUrl?: string;
    brand?: string;
    rating?: number;
    reviewCount?: number;
    inStock?: boolean;
    stockUrgencyText?: string;
    isWishlisted?: boolean;
    onAddToCart?: (id?: string) => void;
    onToggleWishlist?: (id?: string) => void;
    onClick?: (id?: string) => void;
    className?: string;
}
declare const ProductCard: React.FC<ProductCardProps>;

interface QuantitySelectorProps {
    value: number;
    onChange: (quantity: number) => void;
    min?: number;
    max?: number;
    disabled?: boolean;
    size?: 'sm' | 'md' | 'lg';
    className?: string;
}
declare const QuantitySelector: React.FC<QuantitySelectorProps>;

interface ReviewBreakdownItem {
    star: number;
    count: number;
}
interface ReviewBreakdownBarsProps {
    averageRating?: number;
    totalReviews?: number;
    breakdown: Record<number, number> | ReviewBreakdownItem[] | any[];
    onFilterByStar?: (star: number) => void;
    selectedStar?: number | null;
    className?: string;
    style?: React.CSSProperties;
}
declare const ReviewBreakdownBars: React.FC<ReviewBreakdownBarsProps>;

interface AnnouncementBarProps {
    messages?: string[] | string;
    text?: string;
    couponCode?: string;
    couponBadgeText?: string;
    linkUrl?: string;
    linkText?: string;
    closable?: boolean;
    backgroundColor?: string;
    textColor?: string;
    accentColor?: string;
    onClose?: () => void;
    className?: string;
}
declare const AnnouncementBar: React.FC<AnnouncementBarProps>;

interface LightningDealsBarProps {
    dealTitle?: string;
    endsAt?: Date | string | number;
    dealEndsInSeconds?: number;
    percentageClaimed?: number;
    claimedPercent?: number;
    totalQuantity?: number;
    claimedQuantity?: number;
    badgeColor?: string;
    className?: string;
    style?: React.CSSProperties;
    onExpire?: () => void;
    hideOnExpire?: boolean;
}
declare const LightningDealsBar: React.FC<LightningDealsBarProps>;

interface BundleItem {
    id: string;
    title: string;
    price: number;
    imageUrl?: string;
    originalPrice?: number;
}
interface FrequentlyBoughtTogetherProps {
    mainProduct: BundleItem;
    suggestedItems: BundleItem[];
    bundleDiscountPercentage?: number;
    currencySymbol?: string;
    onAddBundleToCart?: (selectedItems: BundleItem[]) => void;
    onAddBundle?: (selectedItems: BundleItem[] | string[]) => void;
    className?: string;
    style?: React.CSSProperties;
}
declare const FrequentlyBoughtTogether: React.FC<FrequentlyBoughtTogetherProps>;

interface BankOffer {
    id: string;
    type?: 'instant' | 'emi' | 'cashback' | 'partner' | string;
    title: string;
    description?: string;
    terms?: string;
    code?: string;
    termsUrl?: string;
}
interface BankOffersAccordionProps {
    offers?: BankOffer[];
    className?: string;
    style?: React.CSSProperties;
}
declare const BankOffersAccordion: React.FC<BankOffersAccordionProps>;

interface AssuredBadgeProps {
    type?: 'assured' | 'prime' | 'supercoin';
    className?: string;
}
declare const AssuredBadge: React.FC<AssuredBadgeProps>;

interface DualMobileActionBarProps {
    price?: number;
    compareAtPrice?: number;
    originalPrice?: number;
    currencySymbol?: string;
    isWishlisted?: boolean;
    isInCart?: boolean;
    onAddToCart: () => void;
    onBuyNow: () => void;
    onToggleWishlist?: () => void;
    position?: 'fixed' | 'relative';
    addToCartText?: string;
    buyNowText?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const DualMobileActionBar: React.FC<DualMobileActionBarProps>;

interface PriceProps {
    amount: number;
    originalAmount?: number;
    currencySymbol?: string;
    size?: 'sm' | 'md' | 'lg' | 'xl';
    showDiscount?: boolean;
    showSavings?: boolean;
    className?: string;
    style?: React__default.CSSProperties;
}
declare const Price: React__default.FC<PriceProps>;

interface AddToCartProps {
    onAdd?: (quantity: number) => void;
    onQuantityChange?: (quantity: number) => void;
    initialQuantity?: number;
    maxQuantity?: number;
    loading?: boolean;
    disabled?: boolean;
    showStepperOnAdd?: boolean;
    label?: string;
    style?: React__default.CSSProperties;
}
declare const AddToCart: React__default.FC<AddToCartProps>;

interface CouponInputProps {
    onApply?: (code: string) => void;
    onRemove?: () => void;
    appliedCode?: string;
    discountText?: string;
    loading?: boolean;
    error?: string;
    placeholder?: string;
    style?: React__default.CSSProperties;
}
declare const CouponInput: React__default.FC<CouponInputProps>;

interface AddressData {
    fullName: string;
    phone: string;
    pincode: string;
    houseNumber: string;
    street: string;
    city: string;
    state: string;
    addressType: 'home' | 'work' | 'other';
    isDefault: boolean;
}
interface AddressFormProps {
    onSubmit?: (data: AddressData) => void;
    initialData?: Partial<AddressData>;
    loading?: boolean;
    onCancel?: () => void;
    title?: string;
    style?: React__default.CSSProperties;
}
declare const AddressForm: React__default.FC<AddressFormProps>;

interface OrderSummaryItem {
    label: string;
    value: number | string;
    isDiscount?: boolean;
    helpText?: string;
}
interface OrderSummaryProps {
    subtotal: number;
    discount?: number;
    shippingFee?: number;
    tax?: number;
    currencySymbol?: string;
    freeShippingThreshold?: number;
    onCheckout?: () => void;
    loading?: boolean;
    checkoutButtonText?: string;
    customRows?: OrderSummaryItem[];
    style?: React__default.CSSProperties;
}
declare const OrderSummary: React__default.FC<OrderSummaryProps>;

interface HeroAction {
    label: string;
    onClick?: () => void;
    href?: string;
    variant?: 'primary' | 'secondary' | 'outline';
}
interface HeroSectionProps {
    badge?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    primaryAction?: HeroAction;
    secondaryAction?: HeroAction;
    media?: React.ReactNode;
    backgroundImage?: string;
    overlayOpacity?: number;
    align?: 'center' | 'left' | 'right';
    showGlow?: boolean;
    glowColor?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const HeroSection: React.FC<HeroSectionProps>;

interface FeatureItem {
    icon?: React.ReactNode;
    title: string;
    description: string;
    badge?: string;
    actionText?: string;
    onAction?: () => void;
}
interface FeatureGridProps extends React.HTMLAttributes<HTMLDivElement> {
    features: FeatureItem[];
    columns?: 2 | 3 | 4;
    align?: 'left' | 'center';
    className?: string;
    style?: React.CSSProperties;
}
declare const FeatureGrid: React.FC<FeatureGridProps>;

interface PricingFeature {
    text: string;
    included: boolean;
}
interface PricingTier {
    id: string;
    name: string;
    description?: string;
    priceMonthly: number | string;
    priceAnnual?: number | string;
    originalPriceMonthly?: number | string;
    originalPriceAnnual?: number | string;
    badge?: string;
    currency?: string;
    features: (string | PricingFeature)[];
    isPopular?: boolean;
    popularLabel?: string;
    ctaText?: string;
    onSelect?: () => void;
    disabled?: boolean;
}
interface PricingTableProps extends React.HTMLAttributes<HTMLDivElement> {
    tiers: PricingTier[];
    billingCycle?: 'monthly' | 'annual';
    onBillingCycleChange?: (cycle: 'monthly' | 'annual') => void;
    annualDiscountLabel?: string;
    showToggle?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const PricingTable: React.FC<PricingTableProps>;

interface TestimonialProps extends React.HTMLAttributes<HTMLDivElement> {
    quote: string;
    authorName?: string;
    author?: string;
    authorRole?: string;
    role?: string;
    authorCompany?: string;
    company?: string;
    authorAvatar?: string;
    avatar?: string;
    rating?: number;
    verified?: boolean;
    companyLogo?: React.ReactNode;
    className?: string;
    style?: React.CSSProperties;
}
declare const TestimonialCard: React.FC<TestimonialProps>;
interface TestimonialGridProps extends React.HTMLAttributes<HTMLDivElement> {
    testimonials: TestimonialProps[];
    columns?: 2 | 3;
    className?: string;
    style?: React.CSSProperties;
}
declare const TestimonialGrid: React.FC<TestimonialGridProps>;

interface FAQItem {
    id?: string;
    question: string;
    answer: React.ReactNode;
}
interface FAQSectionProps {
    items: FAQItem[];
    title?: React.ReactNode;
    subtitle?: React.ReactNode;
    searchable?: boolean;
    searchPlaceholder?: string;
    className?: string;
    style?: React.CSSProperties;
}
declare const FAQSection: React.FC<FAQSectionProps>;

interface LogoItem {
    name: string;
    logo?: React.ReactNode;
    imageUrl?: string;
    href?: string;
}
interface LogoCloudProps extends React.HTMLAttributes<HTMLDivElement> {
    logos: LogoItem[];
    title?: string;
    grayscale?: boolean;
    className?: string;
    style?: React.CSSProperties;
}
declare const LogoCloud: React.FC<LogoCloudProps>;

interface CTASectionProps {
    badge?: React.ReactNode;
    title: React.ReactNode;
    description?: React.ReactNode;
    backgroundImage?: string;
    overlayOpacity?: number;
    primaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    secondaryAction?: {
        label: string;
        onClick?: () => void;
        href?: string;
    };
    showNewsletter?: boolean;
    newsletterPlaceholder?: string;
    newsletterButtonText?: string;
    onSubscribe?: (email: string) => void;
    variant?: 'card' | 'full' | 'gradient';
    className?: string;
    style?: React.CSSProperties;
}
declare const CTASection: React.FC<CTASectionProps>;

export { Accordion, type AccordionItem, type AccordionProps, ActivityFeed, type ActivityFeedProps, type ActivityItem, type ActivityUser, AddToCart, type AddToCartProps, type AddressData, AddressForm, type AddressFormProps, Alert, type AlertProps, AnnouncementBar, type AnnouncementBarProps, AreaChart, type AreaChartProps, AspectRatio, type AspectRatioProps, AssuredBadge, type AssuredBadgeProps, Avatar, AvatarGroup, type AvatarGroupProps, type AvatarProps, BackButton, type BackButtonProps, Badge, type BadgeProps, type BankOffer, BankOffersAccordion, type BankOffersAccordionProps, BarChart, type BarChartDataPoint, type BarChartProps, BoostProvider, type BoostProviderProps, type BoostThemeConfig, BottomSheet, type BottomSheetProps, Box, type BoxAsTag, type BoxProps, Breadcrumb, type BreadcrumbItem, type BreadcrumbProps, type BundleItem, Button, ButtonGroup, type ButtonGroupProps, type ButtonProps, CTASection, type CTASectionProps, Card, CardContent, type CardContentProps, CardDescription, type CardDescriptionProps, CardFooter, type CardFooterProps, CardHeader, type CardHeaderProps, type CardProps, CardTitle, type CardTitleProps, Carousel, type CarouselProps, type CarouselSlide, CartDrawer, type CartDrawerItem, type CartDrawerProps, type ChartDataPoint, Checkbox, type CheckboxProps, Chip, type ChipProps, type CommandItem, CommandPalette, type CommandPaletteProps, ConfirmationDialog, type ConfirmationDialogProps, Container, type ContainerProps, CopyButton, type CopyButtonProps, CouponInput, type CouponInputProps, DataTable, type DataTableColumn, type DataTableProps, DatePicker, type DatePickerProps, type DateRange, DateRangePicker, type DateRangePickerProps, Dialog, type DialogProps, Divider, type DividerProps, DonutChart, type DonutChartProps, type DonutDataPoint, Drawer, type DrawerProps, DropdownMenu, type DropdownMenuItem, type DropdownMenuProps, DualMobileActionBar, type DualMobileActionBarProps, EmptyState, type EmptyStateProps, ErrorState, type ErrorStateProps, ExportButton, type ExportButtonProps, type FAQItem, FAQSection, type FAQSectionProps, FeatureGrid, type FeatureGridProps, type FeatureItem, FileDropzone, type FileDropzoneProps, FileUpload, type FileUploadProps, Filter, type FilterOption, type FilterProps, Flex, type FlexProps, FloatingActionButton, type FloatingActionButtonProps, Footer, type FooterColumn, type FooterProps, ForgotPassword, type ForgotPasswordProps, FormField, type FormFieldProps, FrequentlyBoughtTogether, type FrequentlyBoughtTogetherProps, Grid, GridItem, type GridItemProps, type GridProps, HStack, type HStackProps, Header, type HeaderProps, type HeroAction, HeroSection, type HeroSectionProps, IconButton, type IconButtonProps, Image, type ImageProps, Input, type InputProps, KPIWidget, type KPIWidgetProps, LightningDealsBar, type LightningDealsBarProps, LinkButton, type LinkButtonProps, Loader, type LoaderProps, LoginForm, type LoginFormProps, LogoCloud, type LogoCloudProps, type LogoItem, MegaMenu, type MegaMenuCategory, type MegaMenuColumn, type MegaMenuProps, MobileBottomBar, type MobileBottomBarItem, type MobileBottomBarProps, MobileBottomNav, type MobileBottomNavItem, type MobileBottomNavProps, Modal, type ModalProps, Motion, type MotionProps, MultiSelect, type MultiSelectOption, type MultiSelectProps, NavLink, type NavLinkItem, type NavLinkProps, Navbar, type NavbarProps, NotificationCenter, type NotificationCenterProps, type NotificationItem, OTPInput, type OTPInputProps, type OrderStage, OrderSummary, type OrderSummaryItem, type OrderSummaryProps, OrderTimeline, type OrderTimelineProps, PageWrapper, type PageWrapperProps, Pagination, type PaginationProps, type PincodeCheckResult, PincodeChecker, type PincodeCheckerProps, Popover, type PopoverProps, Portal, type PortalProps, Price, type PriceProps, type PricingFeature, PricingTable, type PricingTableProps, type PricingTier, ProductCard, type ProductCardProps, ProductGallery, type ProductGalleryImageItem, type ProductGalleryProps, ProgressBar, type ProgressBarProps, QuantitySelector, type QuantitySelectorProps, Radio, RadioGroup, type RadioGroupProps, type RadioOption, type RadioProps, RegisterForm, type RegisterFormData, type RegisterFormProps, ResetPassword, type ResetPasswordProps, type ResponsiveBreakpoints, ReviewBreakdownBars, type ReviewBreakdownBarsProps, type ReviewBreakdownItem, ScrollArea, type ScrollAreaProps, SearchInput, type SearchInputProps, Section, type SectionProps, Select, type SelectOption, type SelectProps, type SelectedVariants, Sidebar, type SidebarGroup, type SidebarItem, type SidebarProps, Skeleton, type SkeletonProps, Snackbar, type SnackbarProps, Sort, type SortDirection, type SortOption, type SortProps, Sparkline, type SparklineProps, Spinner, type SpinnerProps, Stack, type StackProps, StarRating, type StarRatingProps, StatsCard, type StatsCardProps, type StepItem, Stepper, type StepperProps, StickyAddToCart, type StickyAddToCartProps, SuccessMessage, type SuccessMessageProps, Switch, type SwitchProps, type TabItem, Table, type TableColumn, type TableProps, Tabs, type TabsProps, Tag, type TagProps, TestimonialCard, TestimonialGrid, type TestimonialGridProps, type TestimonialProps, Textarea, type TextareaProps, type ThemeMode, ThemeToggle, type ThemeToggleProps, type ThemeTokens, TimePicker, type TimePickerProps, Toast, type ToastContextType, type ToastOptions, type ToastPosition, type ToastProps, ToastProvider, type ToastProviderProps, type ToastVariant, Tooltip, type TooltipProps, TrustBadges, type TrustBadgesProps, type UseFormOptions, VStack, type VStackProps, type VariantGroup, type VariantOption, VariantSelector, type VariantSelectorProps, clamp, cn, debounce, deepMerge, formatCurrency, formatDate, formatNumber, formatRelativeTime, generateId, getInitials, groupBy, isValidEmail, isValidIndianMobile, isValidIndianPincode, omit, pick, slugify, truncate, useClickOutside, useCopyToClipboard, useDebounce, useForm, useIntersectionObserver, useIsomorphicLayoutEffect, useLocalStorage, useMediaQuery, usePrevious, useScrollPosition, useTheme, useToast, useToggle, useWindowSize };

# Components & Hooks API Reference

Comprehensive reference for core components and utilities in `@boostengine/ui`.

---

## 1. DataTable (Enterprise Ready)

The `DataTable` component offers enterprise data grid capabilities with zero external dependencies.

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `data` | `T[]` | required | Array of row data items |
| `columns` | `DataTableColumn<T>[]` | required | Column definitions with keys, titles, render functions |
| `sortable` | `boolean` | `true` | Enables interactive column sorting |
| `searchable` | `boolean` | `true` | Enables real-time keyword search bar |
| `selectable` | `boolean` | `false` | Enables multi-row selection checkboxes |
| `selectedRows` | `T[]` | `undefined` | Controlled array of currently selected rows |
| `onSelectionChange` | `(rows: T[]) => void` | `undefined` | Callback fired on selection change |
| `stickyHeader` | `boolean` | `false` | Fixes table header to top during vertical scrolling |
| `maxHeight` | `string \| number` | `undefined` | Sets max scrollable container height (e.g. `'480px'`) |
| `exportable` | `boolean` | `false` | Displays a built-in "Export CSV" action button |
| `exportFilename` | `string` | `'data-export.csv'` | Download filename for exported CSV |
| `pagination` | `boolean` | `true` | Enables pagination controls |
| `pageSize` | `number` | `10` | Rows displayed per page |
| `manualPagination` | `boolean` | `false` | Disables client pagination for server-side slicing |
| `totalCount` | `number` | `undefined` | Total record count for server-side pagination |
| `page` | `number` | `undefined` | Controlled active page index (1-based) |
| `onPageChange` | `(page: number) => void`| `undefined` | Callback fired when page number changes |
| `loading` | `boolean` | `false` | Displays loading spinner overlay |
| `emptyText` | `string` | `'No data found'` | Message when data is empty |

### Example

```tsx
import { DataTable, DataTableColumn } from '@boostengine/ui';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
}

const columns: DataTableColumn<User>[] = [
  { key: 'name', title: 'Full Name', sortable: true },
  { key: 'email', title: 'Email Address' },
  { key: 'role', title: 'Role', sortable: true },
  {
    key: 'status',
    title: 'Status',
    render: (value, row) => (
      <span className={row.status === 'active' ? 'text-green-500' : 'text-red-500'}>
        {row.status}
      </span>
    ),
  },
];

export function UserManagementGrid({ users }: { users: User[] }) {
  return (
    <DataTable
      data={users}
      columns={columns}
      selectable
      onSelectionChange={(selected) => console.log('Selected count:', selected.length)}
      stickyHeader
      maxHeight="500px"
      exportable
      exportFilename="users-report.csv"
      searchable
      sortable
    />
  );
}
```

---

## 2. Toast & `toast.promise`

The `useToast` hook and `toast` utility trigger transient floating alerts, including asynchronous promise lifecycle tracking.

### Methods

- `toast(message, options?)`
- `toast.success(message, options?)`
- `toast.error(message, options?)`
- `toast.warning(message, options?)`
- `toast.info(message, options?)`
- `toast.promise<T>(promise, { loading, success, error }, options?)`
- `toast.dismiss(id)`

### `toast.promise` Example

```tsx
import { useToast } from '@boostengine/ui';

export function SaveUserButton() {
  const { toast } = useToast();

  const handleSave = async () => {
    const savePromise = fetch('/api/user', { method: 'POST' }).then((res) => {
      if (!res.ok) throw new Error('Failed to save profile');
      return res.json();
    });

    await toast.promise(savePromise, {
      loading: 'Saving profile changes...',
      success: (data) => `Profile updated for ${data.name}!`,
      error: (err) => `Could not save: ${err.message}`,
    });
  };

  return <button onClick={handleSave}>Save Profile</button>;
}
```

---

## 3. Polymorphic `Box`

The `Box` component provides a strictly-typed layout primitive supporting any HTML element or custom React component via the `as` prop, with full ref-forwarding:

```tsx
import { Box } from '@boostengine/ui';

// Renders as a semantic `<header>` with flex styles
<Box as="header" display="flex" alignItems="center" padding={4}>
  <h1>Title</h1>
</Box>

// Renders as an `<a>` tag with typed href prop
<Box as="a" href="https://example.com" target="_blank" rel="noopener noreferrer">
  External Link
</Box>

// Renders as an unordered list
<Box as="ul" className="list-disc pl-4">
  <li>Item 1</li>
  <li>Item 2</li>
</Box>
```

---

## 4. `useForm` Hook

Lightweight form state management with sync/async validation and summary reporting:

```tsx
import { useForm } from '@boostengine/ui';

interface LoginForm {
  email: string;
  password: string;
}

export function LoginForm() {
  const form = useForm<LoginForm>({
    initialValues: { email: '', password: '' },
    validate: (values) => {
      const errors: Partial<Record<keyof LoginForm, string>> = {};
      if (!values.email.includes('@')) errors.email = 'Valid email is required';
      if (values.password.length < 6) errors.password = 'Password must be >= 6 chars';
      return errors;
    },
    onSubmit: async (values) => {
      console.log('Submitting:', values);
    },
  });

  return (
    <form onSubmit={form.handleSubmit}>
      {form.validationSummary.length > 0 && (
        <div className="alert-box">
          {form.validationSummary.map((err) => (
            <p key={err}>{err}</p>
          ))}
        </div>
      )}

      <input
        value={form.values.email}
        onChange={(e) => form.handleChange('email', e.target.value)}
        onBlur={() => form.handleBlur('email')}
      />
      {form.getFieldError('email') && <span>{form.getFieldError('email')}</span>}

      <input
        type="password"
        value={form.values.password}
        onChange={(e) => form.handleChange('password', e.target.value)}
        onBlur={() => form.handleBlur('password')}
      />
      {form.getFieldError('password') && <span>{form.getFieldError('password')}</span>}

      <button type="submit" disabled={form.isSubmitting || !form.isValid}>
        {form.isSubmitting ? 'Submitting...' : 'Log In'}
      </button>
    </form>
  );
}
```

---

## 5. Overlay & Feedback Components

- **Modal & Dialog**: Accessible dialogs with focus trapping, `Escape` key dismissal, and `role="dialog"`.
- **Drawer / Sheet**: Slide-out panels supporting `left`, `right`, `top`, and `bottom` positions.
- **DropdownMenu**: Keyboard-navigable menus with `ArrowDown`/`ArrowUp`, `Enter`, and auto-close on selection.
- **Tooltip**: Hover and focus triggered micro-tooltips with collision awareness.
- **Accordion**: Accessible collapsible sections supporting single or multiple open panels.
- **Tabs**: WAI-ARIA compliant tab list with `ArrowLeft`/`ArrowRight` selection.

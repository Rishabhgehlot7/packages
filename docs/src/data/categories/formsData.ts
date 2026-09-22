import { UIComponentItem } from '../../types';

export const formsData: UIComponentItem[] = [
  {
    id: 'Input',
    name: 'Input',
    category: 'forms',
    description: 'Form input field with integrated label, error message, helper text, and SVG icon slots.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add input',
    codeSnippet: `import { Input } from '@boostengine/ui';
import { useState } from 'react';

export function EmailField() {
  const [value, setValue] = useState('');
  return (
    <Input
      label="Email Address"
      placeholder="you@company.com"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      helperText="We will never share your email."
    />
  );
}`,
    props: [
      { name: 'label', type: 'string', default: 'undefined', description: 'Top label text' },
      { name: 'error', type: 'string', default: 'undefined', description: 'Error message that highlights field red' },
      { name: 'helperText', type: 'string', default: 'undefined', description: 'Subtext instructions' }
    ]
  },
  {
    id: 'Textarea',
    name: 'Textarea',
    category: 'forms',
    description: 'Multi-line textarea with auto-resizing, character count limiter, label, and error states.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add textarea',
    codeSnippet: `import { Textarea } from '@boostengine/ui';

export function FeedbackBox() {
  return (
    <Textarea
      label="Order Instructions"
      placeholder="Leave any specific instructions for delivery..."
      rows={4}
      maxLength={250}
      showCount
    />
  );
}`,
    props: [
      { name: 'rows', type: 'number', default: '4', description: 'Initial visible rows' },
      { name: 'showCount', type: 'boolean', default: 'false', description: 'Displays remaining characters badge' }
    ]
  },
  {
    id: 'Select',
    name: 'Select',
    category: 'forms',
    description: 'Custom select dropdown with clean SVG arrow, option grouping, and accessible keyboard states.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add select',
    codeSnippet: `import { Select } from '@boostengine/ui';
import { useState } from 'react';

export function CountrySelector() {
  const [val, setVal] = useState('IN');
  return (
    <Select
      label="Country"
      value={val}
      onChange={setVal}
      options={[
        { label: 'India', value: 'IN' },
        { label: 'United States', value: 'US' },
        { label: 'United Kingdom', value: 'GB' }
      ]}
    />
  );
}`,
    props: [
      { name: 'options', type: 'SelectOption[]', default: '[]', description: 'Array of label and value items' },
      { name: 'value', type: 'string', default: "''", description: 'Currently selected option value' }
    ]
  },
  {
    id: 'MultiSelect',
    name: 'MultiSelect',
    category: 'forms',
    description: 'Multi-value picker with removable tag chips, search filter, and select-all actions.',
    badge: 'Advanced',
    cliCommand: 'npx boost-ui add multi-select',
    codeSnippet: `import { MultiSelect } from '@boostengine/ui';
import { useState } from 'react';

export function TagPicker() {
  const [selected, setSelected] = useState(['electronics', 'accessories']);
  return (
    <MultiSelect
      label="Categories"
      options={[
        { label: 'Electronics', value: 'electronics' },
        { label: 'Accessories', value: 'accessories' },
        { label: 'Footwear', value: 'footwear' },
        { label: 'Clothing', value: 'clothing' }
      ]}
      value={selected}
      onChange={setSelected}
    />
  );
}`,
    props: [
      { name: 'options', type: 'MultiSelectOption[]', default: '[]', description: 'List of selectable items' },
      { name: 'value', type: 'string[]', default: '[]', description: 'Array of currently chosen values' }
    ]
  },
  {
    id: 'Checkbox',
    name: 'Checkbox',
    category: 'forms',
    description: 'Accessible checkbox with SVG checkmark, indeterminate state, label, and description subtext.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add checkbox',
    codeSnippet: `import { Checkbox } from '@boostengine/ui';
import { useState } from 'react';

export function TermsCheck() {
  const [checked, setChecked] = useState(false);
  return (
    <Checkbox
      checked={checked}
      onChange={setChecked}
      label="I accept the Terms and Conditions"
      description="You agree to receive shipping notifications."
    />
  );
}`,
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Checked state' },
      { name: 'indeterminate', type: 'boolean', default: 'false', description: 'Partial selection state' }
    ]
  },
  {
    id: 'Radio',
    name: 'Radio',
    category: 'forms',
    description: 'Radio and RadioGroup components for single-selection form choices with custom dot styling.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add radio',
    codeSnippet: `import { RadioGroup } from '@boostengine/ui';
import { useState } from 'react';

export function PaymentMethod() {
  const [method, setMethod] = useState('card');
  return (
    <RadioGroup
      name="payment"
      value={method}
      onChange={setMethod}
      options={[
        { label: 'Credit / Debit Card', value: 'card' },
        { label: 'UPI / NetBanking', value: 'upi' },
        { label: 'Cash on Delivery', value: 'cod' }
      ]}
    />
  );
}`,
    props: [
      { name: 'options', type: 'RadioOption[]', default: '[]', description: 'Radio options array' },
      { name: 'value', type: 'string', default: "''", description: 'Active selection value' }
    ]
  },
  {
    id: 'Switch',
    name: 'Switch',
    category: 'forms',
    description: 'Interactive toggle switch with smooth slide animation, accessible ARIA roles, and label support.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add switch',
    codeSnippet: `import { Switch } from '@boostengine/ui';
import { useState } from 'react';

export function NotificationToggle() {
  const [enabled, setEnabled] = useState(true);
  return (
    <Switch
      checked={enabled}
      onChange={setEnabled}
      label="SMS Order Updates"
      description="Get instant tracking updates on your phone"
    />
  );
}`,
    props: [
      { name: 'checked', type: 'boolean', default: 'false', description: 'Active state' },
      { name: 'onChange', type: '(checked: boolean) => void', default: 'undefined', description: 'State change callback' }
    ]
  },
  {
    id: 'DatePicker',
    name: 'DatePicker',
    category: 'forms',
    description: 'Clean calendar date input with native picker integration and min/max date validation.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add date-picker',
    codeSnippet: `import { DatePicker } from '@boostengine/ui';
import { useState } from 'react';

export function ScheduleDelivery() {
  const [date, setDate] = useState('2026-10-01');
  return (
    <DatePicker
      label="Preferred Delivery Date"
      value={date}
      onChange={setDate}
      min="2026-09-20"
    />
  );
}`,
    props: [
      { name: 'value', type: 'string', default: "''", description: 'Selected date string (YYYY-MM-DD)' },
      { name: 'min', type: 'string', default: 'undefined', description: 'Earliest allowed date' }
    ]
  },
  {
    id: 'TimePicker',
    name: 'TimePicker',
    category: 'forms',
    description: 'Time selector input with clean typography and time slot configuration.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add time-picker',
    codeSnippet: `import { TimePicker } from '@boostengine/ui';
import { useState } from 'react';

export function SlotSelect() {
  const [time, setTime] = useState('14:30');
  return (
    <TimePicker
      label="Delivery Window"
      value={time}
      onChange={setTime}
    />
  );
}`,
    props: [
      { name: 'value', type: 'string', default: "''", description: 'Selected 24hr time (HH:MM)' }
    ]
  },
  {
    id: 'FileUpload',
    name: 'FileUpload',
    category: 'forms',
    description: 'Drag & drop file upload zone with SVG upload illustration, file size validation, and file item list.',
    badge: 'Advanced',
    cliCommand: 'npx boost-ui add file-upload',
    codeSnippet: `import { FileUpload } from '@boostengine/ui';

export function DocumentUpload() {
  return (
    <FileUpload
      label="Upload Invoices or Prescriptions"
      maxSizeMB={5}
      accept=".pdf,.png,.jpg"
      onFilesSelected={(files) => console.log(files)}
    />
  );
}`,
    props: [
      { name: 'maxSizeMB', type: 'number', default: '10', description: 'Maximum allowed file size in MB' },
      { name: 'accept', type: 'string', default: "'*'", description: 'File type restrictions' }
    ]
  },
  {
    id: 'SearchInput',
    name: 'SearchInput',
    category: 'forms',
    description: 'Search box with built-in SVG magnifying glass, quick clear button, and debounce support.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add search-input',
    codeSnippet: `import { SearchInput } from '@boostengine/ui';
import { useState } from 'react';

export function CatalogSearch() {
  const [query, setQuery] = useState('');
  return (
    <SearchInput
      value={query}
      onChange={setQuery}
      placeholder="Search 10,000+ products..."
      onSearch={(q) => console.log('Searching:', q)}
    />
  );
}`,
    props: [
      { name: 'value', type: 'string', default: "''", description: 'Search term text' },
      { name: 'onSearch', type: '(query: string) => void', default: 'undefined', description: 'Fired on Enter key press' }
    ]
  },
  {
    id: 'FormField',
    name: 'FormField',
    category: 'forms',
    description: 'Wrapper component that provides consistent label, required asterisk, description, and error layout.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add form-field',
    codeSnippet: `import { FormField } from '@boostengine/ui';

export function CustomField() {
  return (
    <FormField label="Username" required error="Username already taken">
      <input type="text" style={{ padding: '8px', width: '100%' }} />
    </FormField>
  );
}`,
    props: [
      { name: 'label', type: 'string', default: "''", description: 'Label text' },
      { name: 'required', type: 'boolean', default: 'false', description: 'Displays red asterisk' }
    ]
  },
  {
    id: 'OTPInput',
    name: 'OTPInput',
    category: 'forms',
    description: 'Auto-focusing numeric OTP / PIN verification boxes with backspace management and paste support.',
    badge: 'Essential',
    cliCommand: 'npx boost-ui add otp-input',
    codeSnippet: `import { OTPInput } from '@boostengine/ui';
import { useState } from 'react';

export function VerifyPhone() {
  const [code, setCode] = useState('');
  return (
    <OTPInput
      length={6}
      value={code}
      onChange={setCode}
      onComplete={(otp) => console.log('OTP Entered:', otp)}
    />
  );
}`,
    props: [
      { name: 'length', type: 'number', default: '6', description: 'Number of PIN digits' },
      { name: 'onComplete', type: '(code: string) => void', default: 'undefined', description: 'Triggered when all inputs are filled' }
    ]
  }
];

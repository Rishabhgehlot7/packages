import { UIComponentItem } from '../../types';

export const buttonsData: UIComponentItem[] = [
  {
    id: 'Button',
    name: 'Button',
    category: 'buttons',
    description: 'Versatile button with primary, secondary, outline, ghost, destructive, and link variants plus loading spinner state.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add button',
    codeSnippet: `import { Button } from '@boostengine/ui';

export function ActionDemo() {
  return (
    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
      <Button variant="primary">Primary Action</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="destructive">Delete Item</Button>
      <Button variant="primary" loading>Saving...</Button>
    </div>
  );
}`,
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'primary'", description: 'Visual visual style and intent' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Height, padding, and font size' },
      { name: 'loading', type: 'boolean', default: 'false', description: 'Shows animated SVG spinner and disables interaction' },
      { name: 'fullWidth', type: 'boolean', default: 'false', description: 'Expands button to fill parent container width' }
    ],
    tips: [
      'Accessible keyboard focus with visible focus-visible outline.',
      'SVG loading spinner matches button text color automatically.'
    ]
  },
  {
    id: 'IconButton',
    name: 'IconButton',
    category: 'buttons',
    description: 'Compact accessible icon button with rounded or circular framing, ideal for toolbars and actions.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add icon-button',
    codeSnippet: `import { IconButton } from '@boostengine/ui';

export function Toolbar() {
  return (
    <IconButton
      ariaLabel="Settings"
      variant="outline"
      shape="circle"
      onClick={() => console.log('Open settings')}
    >
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    </IconButton>
  );
}`,
    props: [
      { name: 'ariaLabel', type: 'string', default: 'Required', description: 'Accessible screen reader label' },
      { name: 'shape', type: "'square' | 'rounded' | 'circle'", default: "'rounded'", description: 'Border radius shape' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Dimensions of the square button container' }
    ]
  },
  {
    id: 'ButtonGroup',
    name: 'ButtonGroup',
    category: 'buttons',
    description: 'Groups multiple buttons together with unified borders, rounded edge capping, and consistent styling.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add button-group',
    codeSnippet: `import { ButtonGroup, Button } from '@boostengine/ui';

export function ViewToggle() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="outline">Day</Button>
      <Button variant="outline">Week</Button>
      <Button variant="outline">Month</Button>
    </ButtonGroup>
  );
}`,
    props: [
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Alignment of child buttons' }
    ]
  },
  {
    id: 'FloatingActionButton',
    name: 'FloatingActionButton',
    category: 'buttons',
    description: 'Fixed-position circular or pill FAB for high-priority user actions such as quick create or live chat.',
    badge: 'Mobile',
    cliCommand: 'npx boost-ui add fab',
    codeSnippet: `import { FloatingActionButton } from '@boostengine/ui';

export function QuickChat() {
  return (
    <FloatingActionButton
      position="bottom-right"
      label="Support"
      onClick={() => console.log('Open chat')}
    />
  );
}`,
    props: [
      { name: 'position', type: "'bottom-right' | 'bottom-left' | 'top-right' | 'top-left'", default: "'bottom-right'", description: 'Screen anchor position' },
      { name: 'label', type: 'string', default: 'undefined', description: 'Optional extended text label' }
    ]
  },
  {
    id: 'LinkButton',
    name: 'LinkButton',
    category: 'buttons',
    description: 'Anchor link styled identically to buttons, ensuring semantic HTML navigation with button design.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add link-button',
    codeSnippet: `import { LinkButton } from '@boostengine/ui';

export function NavigationLink() {
  return (
    <LinkButton href="/shop" variant="primary" size="md">
      Shop Collection
    </LinkButton>
  );
}`,
    props: [
      { name: 'href', type: 'string', default: "''", description: 'Target destination URL' },
      { name: 'variant', type: "'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive' | 'link'", default: "'primary'", description: 'Button style styling' }
    ]
  }
];

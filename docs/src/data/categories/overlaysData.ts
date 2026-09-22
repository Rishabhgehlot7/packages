import { UIComponentItem } from '../../types';

export const overlaysData: UIComponentItem[] = [
  {
    id: 'Modal',
    name: 'Modal',
    category: 'overlays',
    description: 'Accessible modal dialog with frosted backdrop, Escape key listener, and focus trapping.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add modal',
    codeSnippet: `import { Modal, Button } from '@boostengine/ui';
import { useState } from 'react';

export function ModalDemo() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Dialog</Button>
      <Modal isOpen={open} onClose={() => setOpen(false)} title="Important Update">
        <p>Your delivery preferences have been updated.</p>
      </Modal>
    </>
  );
}`,
    props: [
      { name: 'isOpen', type: 'boolean', default: 'false', description: 'Controls modal visibility' },
      { name: 'onClose', type: '() => void', default: 'undefined', description: 'Backdrop or close button click handler' }
    ]
  },
  {
    id: 'Drawer',
    name: 'Drawer',
    category: 'overlays',
    description: 'Slide-out overlay drawer anchored to right, left, top, or bottom edges.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add drawer',
    codeSnippet: `import { Drawer, Button } from '@boostengine/ui';
import { useState } from 'react';

export function SidebarDrawer() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Open Filter Drawer</Button>
      <Drawer isOpen={open} onClose={() => setOpen(false)} position="right" title="Filter Products">
        <div>Filter options here</div>
      </Drawer>
    </>
  );
}`,
    props: [
      { name: 'position', type: "'left' | 'right' | 'top' | 'bottom'", default: "'right'", description: 'Slide-in edge position' }
    ]
  },
  {
    id: 'BottomSheet',
    name: 'BottomSheet',
    category: 'overlays',
    description: 'Mobile-friendly bottom sheet dialog with swipe handle and smooth slide-up physics.',
    badge: 'Mobile',
    cliCommand: 'npx boost-ui add bottom-sheet',
    codeSnippet: `import { BottomSheet, Button } from '@boostengine/ui';
import { useState } from 'react';

export function MobileOptions() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button onClick={() => setOpen(true)}>Choose Size</Button>
      <BottomSheet isOpen={open} onClose={() => setOpen(false)} title="Select Size">
        <div style={{ padding: '16px' }}>Size options</div>
      </BottomSheet>
    </>
  );
}`,
    props: [
      { name: 'isOpen', type: 'boolean', default: 'false', description: 'Visibility toggle' }
    ]
  },
  {
    id: 'Popover',
    name: 'Popover',
    category: 'overlays',
    description: 'Contextual floating popover attached to trigger element with click-outside listener.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add popover',
    codeSnippet: `import { Popover, Button } from '@boostengine/ui';

export function InfoPopover() {
  return (
    <Popover
      trigger={<Button variant="outline">Info</Button>}
      content={<div style={{ padding: '12px' }}>Detailed information popover</div>}
    />
  );
}`,
    props: [
      { name: 'trigger', type: 'ReactNode', default: 'undefined', description: 'Trigger button or element' },
      { name: 'content', type: 'ReactNode', default: 'undefined', description: 'Flyout content' }
    ]
  },
  {
    id: 'ConfirmationDialog',
    name: 'ConfirmationDialog',
    category: 'overlays',
    description: 'Pre-styled modal for destructive or critical confirmations with Confirm and Cancel buttons.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add confirmation-dialog',
    codeSnippet: `import { ConfirmationDialog, Button } from '@boostengine/ui';
import { useState } from 'react';

export function DeletePrompt() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <Button variant="destructive" onClick={() => setOpen(true)}>Delete Account</Button>
      <ConfirmationDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={() => console.log('Confirmed')}
        title="Delete Account?"
        message="This action is permanent and cannot be reversed."
        confirmText="Yes, Delete"
        confirmVariant="destructive"
      />
    </>
  );
}`,
    props: [
      { name: 'onConfirm', type: '() => void', default: 'undefined', description: 'Primary confirmation callback' }
    ]
  }
];

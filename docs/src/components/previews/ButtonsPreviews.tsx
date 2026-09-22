import React from 'react';
import {
  Button,
  IconButton,
  ButtonGroup,
  FloatingActionButton,
  LinkButton,
} from '@boostengine/ui';

interface ButtonsPreviewsProps {
  componentId: string;
  onShowToast: (msg: string) => void;
}

export const ButtonsPreviews: React.FC<ButtonsPreviewsProps> = ({ componentId, onShowToast }) => {
  switch (componentId) {
    case 'Button':
      return (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
          <Button variant="primary">Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructive</Button>
          <Button variant="link">Link Style</Button>
          <Button variant="primary" loading>Loading</Button>
        </div>
      );

    case 'IconButton':
      return (
        <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
          <IconButton ariaLabel="Search" variant="primary" shape="circle">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </IconButton>
          <IconButton ariaLabel="Settings" variant="outline" shape="rounded">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="3" />
              <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 1 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 1 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 1 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 1 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
            </svg>
          </IconButton>
          <IconButton ariaLabel="Delete" variant="destructive" shape="square">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="3 6 5 6 21 6" />
              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
            </svg>
          </IconButton>
        </div>
      );

    case 'ButtonGroup':
      return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <ButtonGroup orientation="horizontal">
            <Button variant="outline">Day</Button>
            <Button variant="primary">Week</Button>
            <Button variant="outline">Month</Button>
          </ButtonGroup>
        </div>
      );

    case 'FloatingActionButton':
      return (
        <div style={{
          position: 'relative',
          height: '140px',
          width: '100%',
          maxWidth: '360px',
          border: '1px dashed var(--boost-border, #cbd5e1)',
          borderRadius: '12px',
          padding: '16px',
          background: 'var(--boost-surface, rgba(255,255,255,0.02))'
        }}>
          <span style={{ fontSize: '13px', color: 'var(--boost-text-muted, #64748b)' }}>FAB container preview</span>
          <FloatingActionButton
            position="bottom-right"
            label="Support"
            onClick={() => onShowToast('FAB clicked')}
            style={{ position: 'absolute' }}
          />
        </div>
      );

    case 'LinkButton':
      return (
        <div style={{ display: 'flex', gap: '12px' }}>
          <LinkButton href="#preview" variant="primary">Visit Collection</LinkButton>
          <LinkButton href="#preview" variant="outline">Documentation</LinkButton>
        </div>
      );

    default:
      return null;
  }
};

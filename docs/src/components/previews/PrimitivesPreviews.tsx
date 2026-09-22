import React from 'react';
import {
  Box,
  Flex,
  HStack,
  VStack,
  Grid,
  GridItem,
  Section,
  AspectRatio,
  ScrollArea,
  Motion,
  BoostProvider,
  ThemeToggle,
  PresetSwitcher,
  Button,
  Badge,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const BoxPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%' }}>
    <Box
      as="div"
      p="24px"
      bg="var(--card-bg)"
      borderRadius="12px"
      border="1px solid var(--border)"
    >
      <h4 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>Polymorphic Box Container</h4>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '14px' }}>
        Renders semantic HTML (div, section, article, aside) with direct styling props.
      </p>
    </Box>
  </div>
);

export const FlexPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%' }}>
    <Flex align="center" justify="space-between" gap="16px" wrap="wrap">
      <span style={{ fontWeight: 600, color: 'var(--text)' }}>Shopping Cart Summary (3 items)</span>
      <Flex gap="8px">
        <Button size="sm" variant="outline" onClick={() => onShowToast('Cart saved')}>
          Save for Later
        </Button>
        <Button size="sm" variant="primary" onClick={() => onShowToast('Checkout initiated')}>
          Checkout Now
        </Button>
      </Flex>
    </Flex>
  </div>
);

export const StackPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ width: '100%', maxWidth: '400px' }}>
    <VStack gap="14px">
      <HStack gap="10px" align="center">
        <span style={{ fontWeight: 700, color: 'var(--text)' }}>Order #8921</span>
        <Badge variant="success">PAID</Badge>
      </HStack>
      <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '13px' }}>
        Delivering to: HSR Layout, Sector 2, Bengaluru, 560102
      </p>
      <HStack gap="8px">
        <Button size="sm" variant="outline" onClick={() => onShowToast('Invoice downloaded')}>
          Download Invoice
        </Button>
        <Button size="sm" variant="primary" onClick={() => onShowToast('Tracking Shiprocket...')}>
          Track Package
        </Button>
      </HStack>
    </VStack>
  </div>
);

export const GridPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%' }}>
    <Grid cols={3} gap="16px">
      <GridItem>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>Grid Item 1</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-responsive cell</div>
        </div>
      </GridItem>
      <GridItem>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>Grid Item 2</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-responsive cell</div>
        </div>
      </GridItem>
      <GridItem>
        <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontWeight: 600, color: 'var(--text)' }}>Grid Item 3</div>
          <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Auto-responsive cell</div>
        </div>
      </GridItem>
    </Grid>
  </div>
);

export const SectionPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%' }}>
    <Section py="24px" px="20px">
      <div style={{ padding: '24px', background: 'var(--card-bg)', borderRadius: '8px', border: '1px solid var(--border)' }}>
        <h3 style={{ margin: '0 0 8px 0', color: 'var(--text)' }}>Semantic Page Section</h3>
        <p style={{ margin: 0, color: 'var(--text-muted)' }}>
          Enforces consistent max-width, horizontal gutters, and responsive vertical padding.
        </p>
      </div>
    </Section>
  </div>
);

export const AspectRatioPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '420px' }}>
    <AspectRatio ratio={16 / 9}>
      <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 600 }}>
        16:9 Aspect Ratio Box
      </div>
    </AspectRatio>
  </div>
);

export const ScrollAreaPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '100%', maxWidth: '380px', border: '1px solid var(--border)', borderRadius: '8px' }}>
    <ScrollArea maxHeight="180px">
      <div style={{ padding: '12px' }}>
        {Array.from({ length: 15 }).map((_, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)', fontSize: '13px', color: 'var(--text)' }}>
            📦 Tracking Event #{i + 1}: Package scanned at hub
          </div>
        ))}
      </div>
    </ScrollArea>
  </div>
);

export const MotionPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
    <Motion animation="slide-up" duration={500}>
      <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
        Slide Up Animation
      </div>
    </Motion>
    <Motion animation="scale-in" duration={500} delay={100}>
      <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
        Scale In Animation
      </div>
    </Motion>
    <Motion animation="pulse" duration={1500}>
      <div style={{ padding: '16px', background: 'var(--card-bg)', border: '1px solid var(--border)', borderRadius: '8px', color: 'var(--text)' }}>
        Pulse Animation
      </div>
    </Motion>
  </div>
);

export const BoostProviderPreview: React.FC<PreviewProps> = () => (
  <Box p="20px" bg="var(--card-bg)" border="1px solid var(--border)" borderRadius="8px">
    <h4 style={{ margin: '0 0 8px 0' }}>BoostProvider Root Context</h4>
    <p style={{ margin: '0 0 12px 0', color: 'var(--text-muted)', fontSize: '14px' }}>
      Currently wrapping this entire documentation site with <code>defaultMode="dark"</code> and design tokens.
    </p>
    <HStack gap="8px">
      <Badge variant="primary">Active Theme: Dark</Badge>
      <Badge variant="success">ToastProvider: Connected</Badge>
    </HStack>
  </Box>
);

export const ThemeTogglePreview: React.FC<PreviewProps> = () => (
  <VStack gap="24px" align="flex-start">
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Icon Only (Default)
      </span>
      <HStack gap="14px">
        <ThemeToggle size="sm" />
        <ThemeToggle size="md" />
        <ThemeToggle size="lg" />
      </HStack>
    </div>
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Segmented Pill Switch (Light / Dark / System)
      </span>
      <ThemeToggle variant="segmented" />
    </div>
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Compact Toggle Switch
      </span>
      <HStack gap="14px">
        <ThemeToggle variant="switch" size="sm" />
        <ThemeToggle variant="switch" size="md" />
        <ThemeToggle variant="switch" size="lg" />
      </HStack>
    </div>
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Button with Label
      </span>
      <ThemeToggle variant="button" />
    </div>
  </VStack>
);

export const PresetSwitcherPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <VStack gap="20px">
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Dropdown Mode (Floating / Navbar ready)
      </span>
      <PresetSwitcher
        mode="dropdown"
        onChange={(preset) => onShowToast(`Switched active preset to: ${preset}`)}
      />
    </div>
    <div>
      <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--text-muted)', display: 'block', marginBottom: '10px' }}>
        Inline Pills Mode (All 7 Design Presets)
      </span>
      <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '8px' }}>
        <PresetSwitcher
          mode="pills"
          onChange={(preset) => onShowToast(`Switched active preset to: ${preset}`)}
        />
      </div>
    </div>
  </VStack>
);

export const PrimitivesPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Box': return <BoxPreview onShowToast={onShowToast} />;
    case 'Flex': return <FlexPreview onShowToast={onShowToast} />;
    case 'Stack':
    case 'VStack':
    case 'HStack': return <StackPreview onShowToast={onShowToast} />;
    case 'Grid': return <GridPreview onShowToast={onShowToast} />;
    case 'Section': return <SectionPreview onShowToast={onShowToast} />;
    case 'AspectRatio': return <AspectRatioPreview onShowToast={onShowToast} />;
    case 'ScrollArea': return <ScrollAreaPreview onShowToast={onShowToast} />;
    case 'Motion': return <MotionPreview onShowToast={onShowToast} />;
    case 'BoostProvider': return <BoostProviderPreview onShowToast={onShowToast} />;
    case 'ThemeToggle': return <ThemeTogglePreview onShowToast={onShowToast} />;
    case 'PresetSwitcher': return <PresetSwitcherPreview onShowToast={onShowToast} />;
    default: return null;
  }
};

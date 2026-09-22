import { UIComponentItem } from '../../types';

export const primitivesData: UIComponentItem[] = [
  {
    id: 'Box',
    name: 'Box',
    category: 'primitives',
    description: 'Foundational strict polymorphic layout wrapper supporting any HTML tag (div, section, article, a, button, p, ul, form, etc.), responsive padding, borders, and theme tokens.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add box',
    codeSnippet: `import { Box, Button } from '@boostengine/ui';

export function LayoutDemo() {
  return (
    <Box
      as="section"
      p="24px"
      background="var(--card-bg)"
      borderRadius="12px"
      border="1px solid var(--border)"
    >
      <h3>Strict Polymorphic Box Container</h3>
      <p>Clean layout container without external CSS classes. Typesafe 'as' prop forwarding!</p>
      <Box as="button" p="8px 16px" borderRadius="8px" background="var(--primary)" style={{ color: '#fff' }}>
        Rendered as HTML Button
      </Box>
    </Box>
  );
}`,
    props: [
      { name: 'as', type: "'div' | 'section' | 'article' | 'main' | 'aside' | 'header' | 'footer' | 'span' | 'p' | 'a' | 'button' | 'ul' | 'form'", default: "'div'", description: 'HTML element to render with full typesafe prop forwarding' },
      { name: 'p', type: 'string | number', default: 'undefined', description: 'CSS padding shorthand' },
      { name: 'm', type: 'string | number', default: 'undefined', description: 'CSS margin shorthand' },
      { name: 'background', type: 'string', default: 'undefined', description: 'CSS background color' },
      { name: 'borderRadius', type: 'string', default: 'undefined', description: 'Border radius in pixels or rem' }
    ]
  },
  {
    id: 'Flex',
    name: 'Flex',
    category: 'primitives',
    description: 'Flexbox layout primitive with ergonomic props for direction, alignment, justification, and gap.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add flex',
    codeSnippet: `import { Flex, Button } from '@boostengine/ui';

export function FlexBar() {
  return (
    <Flex align="center" justify="space-between" gap="16px">
      <div>Left Content</div>
      <Flex gap="8px">
        <Button variant="outline">Cancel</Button>
        <Button variant="primary">Confirm</Button>
      </Flex>
    </Flex>
  );
}`,
    props: [
      { name: 'direction', type: "'row' | 'column' | 'row-reverse' | 'column-reverse'", default: "'row'", description: 'Flex flow direction' },
      { name: 'align', type: "'flex-start' | 'center' | 'flex-end' | 'stretch' | 'baseline'", default: "'flex-start'", description: 'Cross-axis align-items' },
      { name: 'justify', type: "'flex-start' | 'center' | 'flex-end' | 'space-between' | 'space-around'", default: "'flex-start'", description: 'Main-axis justify-content' },
      { name: 'gap', type: 'string | number', default: "'0'", description: 'Spacing between flex children' },
      { name: 'wrap', type: "'nowrap' | 'wrap' | 'wrap-reverse'", default: "'nowrap'", description: 'Flex-wrap behavior' }
    ]
  },
  {
    id: 'Stack',
    name: 'Stack',
    category: 'primitives',
    description: 'Vertical and horizontal content stacks (Stack, VStack, HStack) enforcing consistent spacing rules.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add stack',
    codeSnippet: `import { VStack, HStack, Button, Badge } from '@boostengine/ui';

export function StackDemo() {
  return (
    <VStack gap="16px">
      <HStack gap="12px" align="center">
        <h4>Order #1092</h4>
        <Badge variant="success">Paid</Badge>
      </HStack>
      <p>Customer verified via OTP.</p>
      <HStack gap="8px">
        <Button size="sm" variant="primary">Fulfill Order</Button>
        <Button size="sm" variant="outline">Print Invoice</Button>
      </HStack>
    </VStack>
  );
}`,
    props: [
      { name: 'direction', type: "'vertical' | 'horizontal'", default: "'vertical'", description: 'Stack orientation' },
      { name: 'gap', type: 'string | number', default: "'16px'", description: 'Gap between stacked items' },
      { name: 'align', type: 'string', default: "'stretch'", description: 'Alignment along opposite axis' }
    ]
  },
  {
    id: 'Grid',
    name: 'Grid',
    category: 'primitives',
    description: 'CSS Grid container and GridItem primitive for building modern dashboards and responsive product catalogs.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add grid',
    codeSnippet: `import { Grid, GridItem, Card } from '@boostengine/ui';

export function GridDemo() {
  return (
    <Grid cols={3} gap="16px">
      <GridItem><Card style={{ padding: '16px' }}>Block 1</Card></GridItem>
      <GridItem><Card style={{ padding: '16px' }}>Block 2</Card></GridItem>
      <GridItem><Card style={{ padding: '16px' }}>Block 3</Card></GridItem>
    </Grid>
  );
}`,
    props: [
      { name: 'cols', type: 'number | string', default: '1', description: 'Number of columns or custom grid template' },
      { name: 'gap', type: 'string | number', default: "'16px'", description: 'Gap between grid cells' }
    ]
  },
  {
    id: 'Section',
    name: 'Section',
    category: 'primitives',
    description: 'Semantic page section container with built-in responsive max-width, gutters, and vertical rhythm.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add section',
    codeSnippet: `import { Section } from '@boostengine/ui';

export function PageSection() {
  return (
    <Section py="lg" container>
      <h2>Customer Reviews</h2>
      <p>Browse honest feedback from our real verified buyers.</p>
    </Section>
  );
}`,
    props: [
      { name: 'py', type: "'sm' | 'md' | 'lg' | 'xl'", default: "'md'", description: 'Vertical padding scale' },
      { name: 'container', type: 'boolean', default: 'true', description: 'Wraps content in centered max-width container' }
    ]
  },
  {
    id: 'AspectRatio',
    name: 'AspectRatio',
    category: 'primitives',
    description: 'Maintains consistent width-to-height aspect ratios (16:9, 4:3, 1:1) to prevent Cumulative Layout Shifts (CLS).',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add aspect-ratio',
    codeSnippet: `import { AspectRatio } from '@boostengine/ui';

export function ProductHero() {
  return (
    <AspectRatio ratio={16 / 9}>
      <img
        src="https://images.unsplash.com/photo-1542291026-7eec264c27ff"
        alt="Sneakers"
        style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }}
      />
    </AspectRatio>
  );
}`,
    props: [
      { name: 'ratio', type: 'number', default: '1', description: 'Width divided by height (e.g. 16/9, 4/3, 1)' }
    ]
  },
  {
    id: 'ScrollArea',
    name: 'ScrollArea',
    category: 'primitives',
    description: 'Cross-browser scroll container with customized thin scrollbars and optional hide-on-idle mode.',
    badge: 'Primitive',
    cliCommand: 'npx boost-ui add scroll-area',
    codeSnippet: `import { ScrollArea } from '@boostengine/ui';

export function LongList() {
  return (
    <ScrollArea maxHeight="250px">
      <div style={{ padding: '12px' }}>
        {Array.from({ length: 20 }).map((_, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            Log Entry #{i + 1}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}`,
    props: [
      { name: 'maxHeight', type: 'string', default: "'100%'", description: 'Max height before scroll kicks in' },
      { name: 'scrollbars', type: "'auto' | 'always' | 'hover'", default: "'auto'", description: 'Scrollbar visibility behavior' }
    ]
  },
  {
    id: 'Motion',
    name: 'Motion',
    category: 'primitives',
    description: 'Lightweight CSS animation wrapper supporting fade-in, slide-up, scale-in, shimmer, spin, and pulse.',
    badge: 'Animation',
    cliCommand: 'npx boost-ui add motion',
    codeSnippet: `import { Motion, Card } from '@boostengine/ui';

export function AnimatedCard() {
  return (
    <Motion animation="slide-up" duration={0.4} delay={0.1}>
      <Card style={{ padding: '20px' }}>
        <h3>Smooth Entry Animation</h3>
        <p>Zero external animation libraries required.</p>
      </Card>
    </Motion>
  );
}`,
    props: [
      { name: 'animation', type: "'fade-in' | 'slide-up' | 'slide-down' | 'scale-in' | 'slide-in-right' | 'slide-in-left' | 'spin' | 'pulse' | 'shimmer'", default: "'fade-in'", description: 'Animation type' },
      { name: 'duration', type: 'number', default: '0.3', description: 'Animation duration in seconds' },
      { name: 'delay', type: 'number', default: '0', description: 'Animation delay in seconds' }
    ]
  },
  {
    id: 'Portal',
    name: 'Portal',
    category: 'overlays',
    description: 'React Portal wrapper rendering overlay elements at document.body level to avoid z-index and overflow clipping.',
    badge: 'Overlay',
    cliCommand: 'npx boost-ui add portal',
    codeSnippet: `import { Portal } from '@boostengine/ui';

export function FloatingElement() {
  return (
    <Portal>
      <div style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999 }}>
        Floating Assistant
      </div>
    </Portal>
  );
}`,
    props: [
      { name: 'container', type: 'HTMLElement', default: 'document.body', description: 'DOM node to attach portal children into' }
    ]
  },
  {
    id: 'BoostProvider',
    name: 'BoostProvider',
    category: 'primitives',
    description: 'Root design system context injecting CSS variables, global animation keyframes, 7 universal multi-theme style presets, currency context, and dark/light switching.',
    badge: 'Core Provider • v2.0.0',
    cliCommand: 'npx boost-ui add boost-provider',
    codeSnippet: `import { BoostProvider, ToastProvider, PresetSwitcher } from '@boostengine/ui';

export function App() {
  return (
    <BoostProvider
      defaultMode="dark"
      defaultStylePreset="glassmorphism"
      currency="$"
      locale="en-US"
      syncDocumentPreset
    >
      <ToastProvider position="bottom-right">
        <PresetSwitcher mode="dropdown" />
        <MainContent />
      </ToastProvider>
    </BoostProvider>
  );
}`,
    props: [
      { name: 'defaultStylePreset', type: "'minimal' | 'glassmorphism' | 'neumorphism' | 'neo-brutalism' | 'dark-first' | 'gradient-glow' | 'material-you'", default: "'minimal'", description: 'Active design aesthetic preset across all 121+ components' },
      { name: 'defaultMode', type: "'light' | 'dark' | 'system'", default: "'system'", description: 'Initial color scheme' },
      { name: 'storageKey', type: 'string', default: "'boost-theme'", description: 'LocalStorage key for persisting user choice' },
      { name: 'currency', type: 'string', default: "'$'", description: 'Universal eCommerce currency symbol ($ / ₹ / € / £)' },
      { name: 'locale', type: 'string', default: "'en-US'", description: 'BCP 47 language/locale code for date & currency formatting' },
      { name: 'syncDocumentClass', type: 'boolean', default: 'true', description: 'Syncs data-theme attribute and .dark class on html document' },
      { name: 'syncDocumentPreset', type: 'boolean', default: 'true', description: 'Syncs data-preset attribute on html document' },
      { name: 'tokens', type: 'ThemeTokens', default: '{}', description: 'Custom design tokens for light mode' },
      { name: 'darkTokens', type: 'ThemeTokens', default: '{}', description: 'Custom design tokens for dark mode' }
    ]
  },
  {
    id: 'ThemeToggle',
    name: 'ThemeToggle',
    category: 'primitives',
    description: 'Plug-and-play Dark/Light theme toggle switch with icon, button, segmented pill, and toggle switch variants.',
    badge: 'Theming',
    cliCommand: 'npx boost-ui add theme-toggle',
    codeSnippet: `import { ThemeToggle } from '@boostengine/ui';

export function Header() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
      {/* Icon only (default) */}
      <ThemeToggle />

      {/* Segmented Pill (Light / Dark / System) */}
      <ThemeToggle variant="segmented" />

      {/* Modern Switch */}
      <ThemeToggle variant="switch" size="md" />

      {/* Button with label */}
      <ThemeToggle variant="button" />
    </div>
  );
}`,
    props: [
      { name: 'variant', type: "'icon' | 'button' | 'segmented' | 'switch'", default: "'icon'", description: 'Visual style of the toggle control' },
      { name: 'size', type: "'sm' | 'md' | 'lg'", default: "'md'", description: 'Size of the toggle' },
      { name: 'showLabel', type: 'boolean', default: 'true', description: 'Show text labels in button/segmented variants' },
      { name: 'className', type: 'string', default: "''", description: 'Optional CSS class name' },
      { name: 'style', type: 'React.CSSProperties', default: 'undefined', description: 'Inline style overrides' }
    ]
  },
  {
    id: 'PresetSwitcher',
    name: 'PresetSwitcher',
    category: 'primitives',
    description: 'Interactive control widget allowing users or admins to switch between all 7 design presets (Minimal, Glassmorphism, Neumorphism, Neo-Brutalism, Dark First, Gradient Glow, Material You) live at runtime.',
    badge: 'New in v2.0.0',
    cliCommand: 'npx boost-ui add preset-switcher',
    codeSnippet: `import { PresetSwitcher, useBoostPreset } from '@boostengine/ui';

export function ThemeToolbar() {
  const { stylePreset, setStylePreset } = useBoostPreset();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      {/* Dropdown mode with preview icons */}
      <PresetSwitcher mode="dropdown" />

      {/* Inline selectable pills mode */}
      <PresetSwitcher mode="pills" />
    </div>
  );
}`,
    props: [
      { name: 'mode', type: "'dropdown' | 'pills'", default: "'dropdown'", description: 'Display mode — compact dropdown with icons or inline pill selector' },
      { name: 'value', type: "'minimal' | 'glassmorphism' | 'neumorphism' | 'neo-brutalism' | 'dark-first' | 'gradient-glow' | 'material-you'", default: 'undefined', description: 'Optional external controlled preset value' },
      { name: 'onChange', type: '(preset: UIStylePreset) => void', default: 'undefined', description: 'Callback invoked when a new design preset is selected' },
      { name: 'className', type: 'string', default: "''", description: 'Custom CSS class name' },
      { name: 'style', type: 'React.CSSProperties', default: 'undefined', description: 'Inline styles overrides' }
    ]
  }
];

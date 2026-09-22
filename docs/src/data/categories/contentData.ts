import { UIComponentItem } from '../../types';

export const contentData: UIComponentItem[] = [
  {
    id: 'Card',
    name: 'Card',
    category: 'content',
    description: 'Compound card container with CardHeader, CardTitle, CardDescription, CardContent, and CardFooter.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add card',
    codeSnippet: `import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Button } from '@boostengine/ui';

export function FeatureCard() {
  return (
    <Card style={{ maxWidth: '350px' }}>
      <CardHeader>
        <CardTitle>Express Shipping</CardTitle>
        <CardDescription>Get items within 24 hours</CardDescription>
      </CardHeader>
      <CardContent>
        Orders placed before 3:00 PM qualify for same-day dispatch across tier-1 cities.
      </CardContent>
      <CardFooter>
        <Button variant="outline" size="sm">Learn More</Button>
      </CardFooter>
    </Card>
  );
}`,
    props: [
      { name: 'children', type: 'ReactNode', default: 'undefined', description: 'Card content elements' }
    ]
  },
  {
    id: 'Image',
    name: 'Image',
    category: 'content',
    description: 'Progressive image component with smooth fallback image handling, aspect ratio locking, and lazy loading.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add image',
    codeSnippet: `import { Image } from '@boostengine/ui';

export function Banner() {
  return (
    <Image
      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
      alt="Watch"
      aspectRatio="16/9"
    />
  );
}`,
    props: [
      { name: 'aspectRatio', type: 'string', default: 'undefined', description: 'CSS aspect-ratio e.g. 1/1, 16/9' },
      { name: 'fallbackSrc', type: 'string', default: 'undefined', description: 'Fallback image if source fails to load' }
    ]
  },
  {
    id: 'Avatar',
    name: 'Avatar',
    category: 'content',
    description: 'User profile avatar with image source, fallback initials generator, and presence status dot.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add avatar',
    codeSnippet: `import { Avatar } from '@boostengine/ui';

export function ProfileBadge() {
  return (
    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
      <Avatar name="Rahul Sharma" size="md" status="online" />
      <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80" name="Aditi Rao" size="md" />
    </div>
  );
}`,
    props: [
      { name: 'name', type: 'string', default: "''", description: 'User name for fallback initials calculation' },
      { name: 'status', type: "'online' | 'offline' | 'busy'", default: 'undefined', description: 'Status badge indicator dot' }
    ]
  },
  {
    id: 'Badge',
    name: 'Badge',
    category: 'content',
    description: 'Pill status badge with solid, outline, and soft pastel color variants.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add badge',
    codeSnippet: `import { Badge } from '@boostengine/ui';

export function StatusTags() {
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Badge variant="success">In Stock</Badge>
      <Badge variant="warning">Low Inventory</Badge>
      <Badge variant="destructive">Sold Out</Badge>
    </div>
  );
}`,
    props: [
      { name: 'variant', type: "'primary' | 'secondary' | 'success' | 'warning' | 'destructive' | 'outline'", default: "'primary'", description: 'Color theme variant' }
    ]
  },
  {
    id: 'Tag',
    name: 'Tag',
    category: 'content',
    description: 'Categorical tag chip with optional dismiss button for active filters.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add tag',
    codeSnippet: `import { Tag } from '@boostengine/ui';

export function FilterTags() {
  return (
    <Tag onRemove={() => console.log('Removed tag')}>Cotton Fabric</Tag>
  );
}`,
    props: [
      { name: 'onRemove', type: '() => void', default: 'undefined', description: 'Renders X icon and handles dismissal' }
    ]
  },
  {
    id: 'Tooltip',
    name: 'Tooltip',
    category: 'content',
    description: 'Hover tooltip with 4-way direction positioning (top, bottom, left, right) and smooth fade animation.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add tooltip',
    codeSnippet: `import { Tooltip, Button } from '@boostengine/ui';

export function HelpButton() {
  return (
    <Tooltip content="We offer a 7-day unconditional money back guarantee." position="top">
      <Button variant="outline" size="sm">Warranty Info</Button>
    </Tooltip>
  );
}`,
    props: [
      { name: 'content', type: 'string', default: "''", description: 'Tooltip text' },
      { name: 'position', type: "'top' | 'bottom' | 'left' | 'right'", default: "'top'", description: 'Flyout direction' }
    ]
  },
  {
    id: 'Chip',
    name: 'Chip',
    category: 'content',
    description: 'Compact interactive pill with selection state, avatar slot, and delete callback.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add chip',
    codeSnippet: `import { Chip } from '@boostengine/ui';
import { useState } from 'react';

export function FilterPills() {
  const [selected, setSelected] = useState(false);
  return (
    <Chip selected={selected} onClick={() => setSelected(!selected)}>
      Free Delivery
    </Chip>
  );
}`,
    props: [
      { name: 'selected', type: 'boolean', default: 'false', description: 'Active selection highlight' }
    ]
  },
  {
    id: 'Divider',
    name: 'Divider',
    category: 'content',
    description: 'Horizontal or vertical line separator with optional center text label.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add divider',
    codeSnippet: `import { Divider } from '@boostengine/ui';

export function AuthDivider() {
  return <Divider label="OR" />;
}`,
    props: [
      { name: 'label', type: 'string', default: 'undefined', description: 'Center text label' },
      { name: 'orientation', type: "'horizontal' | 'vertical'", default: "'horizontal'", description: 'Divider axis' }
    ]
  },
  {
    id: 'Accordion',
    name: 'Accordion',
    category: 'content',
    description: 'Collapsible accordion panels with smooth height transitions, multi-open support, and SVG chevrons.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add accordion',
    codeSnippet: `import { Accordion } from '@boostengine/ui';

export function FAQ() {
  return (
    <Accordion
      items={[
        { id: '1', title: 'What is your return policy?', content: 'We offer hassle-free returns within 7 days of delivery.' },
        { id: '2', title: 'Do you ship internationally?', content: 'Currently we ship to all pin codes across India.' }
      ]}
    />
  );
}`,
    props: [
      { name: 'items', type: 'AccordionItem[]', default: '[]', description: 'Array of accordion panels' },
      { name: 'allowMultiple', type: 'boolean', default: 'false', description: 'Allow multiple panels to expand simultaneously' }
    ]
  },
  {
    id: 'Carousel',
    name: 'Carousel',
    category: 'content',
    description: 'Smooth banner slider with autoplay, navigation arrow buttons, and dot indicators.',
    badge: 'Core',
    cliCommand: 'npx boost-ui add carousel',
    codeSnippet: `import { Carousel } from '@boostengine/ui';

export function HeroBanner() {
  return (
    <Carousel
      autoPlay
      interval={4000}
      slides={[
        { id: '1', content: <div style={{ height: '200px', backgroundColor: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 1</div> },
        { id: '2', content: <div style={{ height: '200px', backgroundColor: '#cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Slide 2</div> }
      ]}
    />
  );
}`,
    props: [
      { name: 'autoPlay', type: 'boolean', default: 'false', description: 'Auto slide advance' },
      { name: 'interval', type: 'number', default: '3000', description: 'Autoplay duration in ms' }
    ]
  }
];

import React, { useState } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Image,
  Avatar,
  Badge,
  Tag,
  Tooltip,
  Chip,
  Divider,
  Accordion,
  Carousel,
  Button,
} from '@boostengine/ui';

interface PreviewProps {
  onShowToast: (msg: string) => void;
}

export const CardPreview: React.FC<PreviewProps> = () => (
  <Card style={{ maxWidth: '340px' }}>
    <CardHeader>
      <CardTitle>Member Privileges</CardTitle>
      <CardDescription>Gold Tier Membership</CardDescription>
    </CardHeader>
    <CardContent>
      Enjoy complimentary expedited delivery on all orders above 499 Rupees, plus 24-hour early access to sales.
    </CardContent>
    <CardFooter>
      <Button size="sm" variant="outline">View Benefits</Button>
    </CardFooter>
  </Card>
);

export const ImagePreview: React.FC<PreviewProps> = () => (
  <div style={{ maxWidth: '360px', width: '100%' }}>
    <Image
      src="https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&q=80"
      alt="Analog Wristwatch"
      aspectRatio="video"
      style={{ borderRadius: '8px' }}
    />
  </div>
);

export const AvatarPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
    <Avatar name="Rahul Sharma" size="lg" status="online" />
    <Avatar src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&q=80" name="Aditi Rao" size="lg" status="online" />
    <Avatar name="Kunal Verma" size="md" />
  </div>
);

export const BadgePreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
    <Badge variant="primary">New Arrival</Badge>
    <Badge variant="success">In Stock</Badge>
    <Badge variant="warning">Limited Stock</Badge>
    <Badge variant="destructive">Sold Sold</Badge>
    <Badge variant="outline">Pre-order</Badge>
  </div>
);

export const TagPreview: React.FC<PreviewProps> = ({ onShowToast }) => (
  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
    <Tag onRemove={() => onShowToast('Removed 100% Cotton')}>100% Cotton</Tag>
    <Tag onRemove={() => onShowToast('Removed Slim Fit')}>Slim Fit</Tag>
    <Tag>Water Repellent</Tag>
  </div>
);

export const TooltipPreview: React.FC<PreviewProps> = () => (
  <div style={{ display: 'flex', gap: '16px', padding: '24px 0' }}>
    <Tooltip content="Dispatched via air courier" position="top">
      <Button variant="outline" size="sm">Hover for Shipping Info</Button>
    </Tooltip>
  </div>
);

export const ChipPreview: React.FC<PreviewProps> = () => {
  const [sampleChip, setSampleChip] = useState(true);
  return (
    <div style={{ display: 'flex', gap: '8px' }}>
      <Chip selected={sampleChip} onClick={() => setSampleChip(!sampleChip)}>
        Under ₹999
      </Chip>
      <Chip selected={!sampleChip} onClick={() => setSampleChip(!sampleChip)}>
        Free Delivery
      </Chip>
    </div>
  );
};

export const DividerPreview: React.FC<PreviewProps> = () => (
  <div style={{ width: '320px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
    <Divider />
    <Divider label="OR" />
    <Divider label="CONTINUE WITH" />
  </div>
);

export const AccordionPreview: React.FC<PreviewProps> = () => (
  <div style={{ maxWidth: '480px' }}>
    <Accordion
      items={[
        { id: '1', title: 'What is the return and exchange window?', content: 'We offer a 7-day hassle-free doorstep return and exchange service across all serviceable pin codes.' },
        { id: '2', title: 'Are all products authentic?', content: 'Yes, 100% of products are sourced directly from authorized brand distributors and audited for quality.' }
      ]}
    />
  </div>
);

export const CarouselPreview: React.FC<PreviewProps> = () => (
  <div style={{ maxWidth: '500px', width: '100%' }}>
    <Carousel
      items={[
        <div key="1" style={{ height: '180px', backgroundColor: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#f8fafc', borderRadius: '12px' }}>Promotional Banner 1</div>,
        <div key="2" style={{ height: '180px', backgroundColor: '#334155', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, color: '#f8fafc', borderRadius: '12px' }}>Promotional Banner 2</div>
      ]}
    />
  </div>
);

export const ContentPreviews: React.FC<{ componentId: string; onShowToast: (msg: string) => void }> = ({
  componentId,
  onShowToast,
}) => {
  switch (componentId) {
    case 'Card': return <CardPreview onShowToast={onShowToast} />;
    case 'Image': return <ImagePreview onShowToast={onShowToast} />;
    case 'Avatar': return <AvatarPreview onShowToast={onShowToast} />;
    case 'Badge': return <BadgePreview onShowToast={onShowToast} />;
    case 'Tag': return <TagPreview onShowToast={onShowToast} />;
    case 'Tooltip': return <TooltipPreview onShowToast={onShowToast} />;
    case 'Chip': return <ChipPreview onShowToast={onShowToast} />;
    case 'Divider': return <DividerPreview onShowToast={onShowToast} />;
    case 'Accordion': return <AccordionPreview onShowToast={onShowToast} />;
    case 'Carousel': return <CarouselPreview onShowToast={onShowToast} />;
    default: return null;
  }
};

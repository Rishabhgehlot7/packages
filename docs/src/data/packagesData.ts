import { Category, PackageDoc } from '../types';
import { gettingStartedPackages } from './packages/gettingStartedPackages';
import { corePackages } from './packages/corePackages';
import { checkoutPackages } from './packages/checkoutPackages';
import { authMessagingPackages } from './packages/authMessagingPackages';
import { logisticsPackages } from './packages/logisticsPackages';
import { discoveryPackages } from './packages/discoveryPackages';
import { growthPackages } from './packages/growthPackages';
import { uiToolsPackages } from './packages/uiToolsPackages';

export const CATEGORIES: Category[] = [
  { id: 'getting-started', name: 'Getting Started', icon: 'Rocket', badge: 'v1.1.0' },
  { id: 'core', name: 'Core & Server Engine', icon: 'Cpu', badge: 'v1.1.0' },
  { id: 'checkout', name: 'Checkout & Revenue', icon: 'CreditCard', badge: 'v1.1.0' },
  { id: 'auth-messaging', name: 'Auth & Communication', icon: 'ShieldCheck', badge: 'v1.1.0' },
  { id: 'logistics', name: 'Logistics & Fulfillment', icon: 'Truck', badge: 'v1.1.0' },
  { id: 'discovery', name: 'Discovery & SEO', icon: 'Search', badge: 'v1.1.0' },
  { id: 'growth', name: 'Growth & Engagement', icon: 'TrendingUp', badge: 'v1.1.0' },
  { id: 'ui-tools', name: 'UI & Tooling Suite', icon: 'Wrench', badge: 'v2.1.1' }
];

export const PACKAGES_DATA: PackageDoc[] = [
  ...gettingStartedPackages,
  ...corePackages,
  ...checkoutPackages,
  ...authMessagingPackages,
  ...logisticsPackages,
  ...discoveryPackages,
  ...growthPackages,
  ...uiToolsPackages
];

export const getPackageById = (id: string): PackageDoc | undefined =>
  PACKAGES_DATA.find(pkg => pkg.id === id);
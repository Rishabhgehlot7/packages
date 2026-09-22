import { UIComponentItem, ComponentProp, UICategoryId } from '../types';
import { buttonsData } from './categories/buttonsData';
import { formsData } from './categories/formsData';
import { feedbackData } from './categories/feedbackData';
import { contentData } from './categories/contentData';
import { overlaysData } from './categories/overlaysData';
import { navigationData } from './categories/navigationData';
import { dataData } from './categories/dataData';
import { authData } from './categories/authData';
import { ecommerceData } from './categories/ecommerceData';
import { marketingData } from './categories/marketingData';
import { saasData } from './categories/saasData';
import { primitivesData } from './categories/primitivesData';

export type { UIComponentItem, ComponentProp, UICategoryId };

export const UI_CATEGORIES = [
  { id: 'buttons', name: 'Buttons & Actions' },
  { id: 'forms', name: 'Forms & Inputs' },
  { id: 'ecommerce', name: 'E-Commerce & Store' },
  { id: 'data', name: 'Data & Analytics' },
  { id: 'feedback', name: 'Feedback & Status' },
  { id: 'content', name: 'Content & Display' },
  { id: 'overlays', name: 'Overlays & Dialogs' },
  { id: 'navigation', name: 'Layout & Navigation' },
  { id: 'primitives', name: 'Layout Primitives' },
  { id: 'marketing', name: 'Marketing & Landing' },
  { id: 'saas', name: 'SaaS & Enterprise' },
  { id: 'auth', name: 'Authentication' },
];

export const UI_COMPONENTS_DATA: UIComponentItem[] = [
  ...buttonsData,
  ...formsData,
  ...feedbackData,
  ...contentData,
  ...overlaysData,
  ...navigationData,
  ...dataData,
  ...authData,
  ...ecommerceData,
  ...marketingData,
  ...saasData,
  ...primitivesData,
];

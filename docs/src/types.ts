export type CategoryId = 
  | 'getting-started' 
  | 'core' 
  | 'checkout' 
  | 'logistics' 
  | 'growth' 
  | 'auth-messaging' 
  | 'discovery' 
  | 'ui-tools';

export interface Category {
  id: CategoryId;
  name: string;
  icon: string;
  badge?: string;
}

export interface ApiParam {
  name: string;
  type: string;
  description: string;
  required: boolean;
}

export interface ApiMethod {
  name: string;
  signature: string;
  description: string;
  params: ApiParam[];
  returns: string;
}

export interface CodeSnippet {
  title: string;
  description?: string;
  language: string;
  code: string;
}

export interface PackageDoc {
  id: string;
  name: string;
  categoryId: CategoryId;
  version: string;
  description: string;
  badge?: string;
  npmInstall: string;
  bundleSize: string;
  useCase: string;
  features: string[];
  apiMethods: ApiMethod[];
  examples: CodeSnippet[];
  recipes?: CodeSnippet[];
  notes?: string[];
}

export type PackageManager = 'npm' | 'pnpm' | 'yarn' | 'bun';

export interface ComponentProp {
  name: string;
  type: string;
  default: string;
  description: string;
}

export type UICategoryId = 
  | 'buttons' 
  | 'forms' 
  | 'feedback' 
  | 'content' 
  | 'overlays' 
  | 'primitives' 
  | 'navigation' 
  | 'data' 
  | 'auth' 
  | 'ecommerce' 
  | 'marketing' 
  | 'saas';

export interface UIComponentItem {
  id: string;
  name: string;
  category: UICategoryId;
  description: string;
  badge?: string;
  cliCommand: string;
  codeSnippet: string;
  props: ComponentProp[];
  tips?: string[];
}

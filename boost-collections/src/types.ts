export interface PostmanInfo {
  _postman_id: string;
  name: string;
  description: string;
  schema: string;
}

export interface PostmanAuth {
  type: string;
  basic?: { key: string; value: string; type: string }[];
  bearer?: { key: string; value: string; type: string }[];
  [key: string]: any;
}

export interface PostmanRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  header: { key: string; value: string; description?: string }[];
  body?: {
    mode: 'raw' | 'urlencoded' | 'formdata';
    raw?: string;
    [key: string]: any;
  };
  url: {
    raw: string;
    host?: string[];
    path?: string[];
    query?: { key: string; value: string; description?: string }[];
  };
  description?: string;
}

export interface PostmanItem {
  name: string;
  description?: string;
  request?: PostmanRequest;
  item?: PostmanItem[];
}

export interface PostmanCollection {
  info: PostmanInfo;
  auth?: PostmanAuth;
  item: PostmanItem[];
  [key: string]: any;
}

export interface PostmanEnvironmentVariable {
  key: string;
  value: string;
  type: 'default' | 'secret';
  enabled: boolean;
}

export interface PostmanEnvironment {
  id: string;
  name: string;
  values: PostmanEnvironmentVariable[];
  _postman_variable_scope: string;
}

export type CollectionName =
  | 'razorpay'
  | 'cashfree'
  | 'phonepe'
  | 'paytm'
  | 'stripe'
  | 'easyecom'
  | 'shiprocket'
  | 'delhivery'
  | 'shopify';

export interface CollectionSummary {
  id: string;
  name: string;
  provider: string;
  requestCount: number;
  folders: string[];
  docsUrl: string;
}

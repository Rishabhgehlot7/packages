// ============================================================================
// Postman Collection Schema v2.1.0 Type Definitions
// ============================================================================

export interface PostmanInfo {
  _postman_id?: string;
  name: string;
  description?: string;
  schema: string;
  version?: string;
  [key: string]: any;
}

export interface PostmanAuthElement {
  key: string;
  value: string;
  type: string;
}

export interface PostmanAuth {
  type: string;
  basic?: PostmanAuthElement[];
  bearer?: PostmanAuthElement[];
  apikey?: PostmanAuthElement[];
  [key: string]: any;
}

export interface PostmanHeader {
  key: string;
  value: string;
  description?: string;
  disabled?: boolean;
  type?: string;
}

export interface PostmanQueryParam {
  key: string;
  value: string;
  description?: string;
  disabled?: boolean;
}

export interface PostmanUrlEncodedParam {
  key: string;
  value: string;
  description?: string;
  type?: string;
  disabled?: boolean;
}

export interface PostmanBody {
  mode?: 'raw' | 'urlencoded' | 'formdata' | 'file' | 'graphql' | string;
  raw?: string;
  urlencoded?: PostmanUrlEncodedParam[];
  formdata?: PostmanUrlEncodedParam[];
  options?: Record<string, any>;
  graphql?: Record<string, any>;
  [key: string]: any;
}

export interface PostmanUrl {
  raw?: string;
  protocol?: string;
  host?: string[] | string;
  path?: string[];
  query?: PostmanQueryParam[];
  variable?: PostmanHeader[];
}

export interface PostmanRequest {
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' | 'HEAD' | 'OPTIONS' | string;
  header: PostmanHeader[];
  body?: PostmanBody;
  url: PostmanUrl;
  description?: string;
  auth?: PostmanAuth;
}

export interface PostmanEventScript {
  exec?: string[] | string;
  type?: string;
  src?: any;
  [key: string]: any;
}

export interface PostmanEvent {
  listen: string;
  script?: PostmanEventScript;
  [key: string]: any;
}

export interface PostmanItem {
  name: string;
  description?: string;
  request?: PostmanRequest;
  item?: PostmanItem[];
  event?: PostmanEvent[];
  auth?: PostmanAuth;
  [key: string]: any;
}

export interface PostmanCollection {
  info: PostmanInfo;
  auth?: PostmanAuth;
  item: PostmanItem[];
  event?: PostmanEvent[];
  variable?: PostmanHeader[];
  [key: string]: any;
}

export interface PostmanEnvironmentVariable {
  key: string;
  value: string;
  type: 'default' | 'secret' | string;
  enabled: boolean;
}

export interface PostmanEnvironment {
  id: string;
  name: string;
  values: PostmanEnvironmentVariable[];
  _postman_variable_scope: string;
  [key: string]: any;
}

// ============================================================================
// Core Engine Types
// ============================================================================

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

export type CollectionCategory = 'payments' | 'logistics' | 'wms' | 'platform';

/** A flattened, query-friendly representation of a single API endpoint. */
export interface APIEndpoint {
  /** Stable unique id: `<provider>:<folder-slug>:<endpoint-slug>`. */
  id: string;
  name: string;
  method: string;
  /** Joined URL path, e.g. `/v1/orders/{{order_id}}`. */
  path: string;
  /** Raw, uninterpolated URL. */
  rawUrl: string;
  description: string;
  provider: CollectionName;
  providerName: string;
  /** Folder (tag) the endpoint belongs to. */
  folder: string;
  tag: string;
  headers: PostmanHeader[];
  body?: PostmanBody;
  query: PostmanQueryParam[];
  auth?: PostmanAuth;
  /** Auth scheme detected at the collection level: basic | bearer | hmac | token | none. */
  authScheme: string;
}

export type CodeSnippetTarget = 'fetch' | 'axios' | 'node-https';

export type ExportFormat = 'postman' | 'openapi' | 'bruno';

// ============================================================================
// OpenAPI & Bruno Export Types
// ============================================================================

export interface OpenAPIInfo {
  title: string;
  version: string;
  description?: string;
  [key: string]: any;
}

export interface OpenAPISpec {
  openapi: string;
  info: OpenAPIInfo;
  servers: { url: string; description?: string }[];
  tags: { name: string; description?: string }[];
  paths: Record<string, any>;
  components: {
    schemas: Record<string, any>;
    securitySchemes: Record<string, any>;
    [key: string]: any;
  };
  security?: { [key: string]: string[] }[];
  [key: string]: any;
}

export interface BrunoRequestFile {
  /** Logical name of the request. */
  name: string;
  /** Relative file name, e.g. `1. Orders API/Create Order.bru`. */
  file: string;
  /** Full `.bru` file content. */
  content: string;
}

export interface BrunoCollection {
  /** The `bruno.json` collection manifest. */
  brunoJson: Record<string, any>;
  /** Individual request `.bru` files. */
  requests: BrunoRequestFile[];
}

// ============================================================================
// Runner Types
// ============================================================================

export interface RunCollectionOptions {
  /** Extra/overridden variables (e.g. API keys). */
  env?: Record<string, string>;
  /** Override the base URL for all requests. */
  baseUrl?: string;
  /** Progress callback invoked before each endpoint is processed. */
  onProgress?: (info: { index: number; total: number; endpoint: APIEndpoint }) => void;
  /** When true, validates & returns the plan without simulating execution. */
  dryRun?: boolean;
}

export interface RunCollectionResult {
  provider: CollectionName;
  endpoint: APIEndpoint;
  method: string;
  url: string;
  status: number;
  mockResponse: any;
  dryRun: boolean;
}

export interface CurlOptions {
  /** Include collection-level auth (basic/bearer) in the generated command. */
  includeAuth?: boolean;
}

// ============================================================================
// AI Toolkit Types
// ============================================================================

export interface AIToolSchema {
  type: 'function';
  function: {
    name: string;
    description: string;
    parameters: Record<string, any>;
  };
}

export interface MCPToolDefinition {
  name: string;
  description: string;
  inputSchema: Record<string, any>;
}


export interface FindEndpointsQuery {
  provider?: CollectionName | string;
  method?: string;
  path?: string;
  tag?: string;
}

export interface CollectionSummary {
  id: string;
  name: string;
  provider: string;
  requestCount: number;
  folders: string[];
  categories: CollectionCategory[];
  authScheme: string;
  docsUrl: string;
}

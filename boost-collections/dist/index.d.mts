import { P as PostmanEnvironment, a as PostmanRequest, b as CodeSnippetTarget, c as PostmanAuth, d as PostmanBody, e as PostmanCollection, O as OpenAPISpec, B as BrunoCollection, C as CollectionName, f as CollectionCategory, E as ExportFormat, F as FindEndpointsQuery, g as APIEndpoint, h as CollectionSummary, R as RunCollectionOptions, i as RunCollectionResult } from './types-ofKBXxTF.mjs';
export { A as AIToolSchema, j as BrunoRequestFile, k as CurlOptions, M as MCPToolDefinition, l as OpenAPIInfo, m as PostmanAuthElement, n as PostmanEnvironmentVariable, o as PostmanEvent, p as PostmanEventScript, q as PostmanHeader, r as PostmanInfo, s as PostmanItem, t as PostmanQueryParam, u as PostmanUrl, v as PostmanUrlEncodedParam } from './types-ofKBXxTF.mjs';

/** Replace `{{variable}}` placeholders using a variable map. */
declare function resolveVariables(input: string, variables: Record<string, string>): string;
/** Convert a Postman environment into a flat `key -> value` map. */
declare function environmentToVariables(environment?: PostmanEnvironment): Record<string, string>;
/** Replace all `{{var}}` placeholders in a request using the environment. */
declare function interpolateVariables(request: PostmanRequest, environment?: PostmanEnvironment): PostmanRequest;
/** Parse a raw body into a JSON value when possible, otherwise keep the raw string. */
declare function parseRawBody(body?: PostmanBody): {
    json: any;
    raw: string | null;
};
declare function generateCurl(request: PostmanRequest, environment?: PostmanEnvironment, auth?: PostmanAuth, options?: {
    includeAuth?: boolean;
}): string;
/** Generate a ready-to-use TypeScript/JavaScript request snippet. */
declare function generateCodeSnippet(request: PostmanRequest, environment?: PostmanEnvironment, target?: CodeSnippetTarget, auth?: PostmanAuth): string;

declare function convertToOpenAPI(collection: PostmanCollection, options?: {
    environment?: PostmanEnvironment;
    baseUrl?: string;
    version?: string;
    openapiVersion?: string;
}): OpenAPISpec;

declare function convertToBruno(collection: PostmanCollection, options?: {
    baseUrl?: string;
}): BrunoCollection;

declare const razorpayCollection: PostmanCollection;
declare const cashfreeCollection: PostmanCollection;
declare const phonepeCollection: PostmanCollection;
declare const paytmCollection: PostmanCollection;
declare const stripeCollection: PostmanCollection;
declare const easyecomCollection: PostmanCollection;
declare const shiprocketCollection: PostmanCollection;
declare const delhiveryCollection: PostmanCollection;
declare const shopifyCollection: PostmanCollection;
declare const razorpayEnvironment: PostmanEnvironment;
declare const cashfreeEnvironment: PostmanEnvironment;
declare const phonepeEnvironment: PostmanEnvironment;
declare const paytmEnvironment: PostmanEnvironment;
declare const stripeEnvironment: PostmanEnvironment;
declare const easyecomEnvironment: PostmanEnvironment;
declare const shiprocketEnvironment: PostmanEnvironment;
declare const delhiveryEnvironment: PostmanEnvironment;
declare const shopifyEnvironment: PostmanEnvironment;
declare const COLLECTION_NAMES: CollectionName[];
interface ProviderEntry {
    collection: PostmanCollection;
    environment: PostmanEnvironment;
    provider: string;
    docsUrl: string;
    categories: CollectionCategory[];
    authScheme: string;
}
declare function getRegistryEntry(name: CollectionName): ProviderEntry;
declare function getAuthScheme(name: CollectionName): string;
declare function getCollectionAuth(name: CollectionName): PostmanAuth | undefined;
/** List all available collections with endpoint counts, folders and categories. */
declare function listCollections(): CollectionSummary[];
/** Get a specific Postman Collection by name. */
declare function getCollection(name: CollectionName): PostmanCollection;
/** Get a specific Postman Environment by name. */
declare function getEnvironment(name: CollectionName): PostmanEnvironment;
/** Flatten every endpoint from every collection into a single list. */
declare function getAllEndpoints(): APIEndpoint[];
/** Filter endpoints across all collections by provider, method, path or tag. */
declare function findEndpoints(query?: FindEndpointsQuery): APIEndpoint[];
/** Generate a plausible mock response for an endpoint & status code. */
declare function generateMockResponse(endpoint: APIEndpoint, statusCode?: number): Record<string, any>;
/** Convert a Postman collection into a valid OpenAPI 3.0 JSON spec. */
declare function exportToOpenAPI(name: CollectionName, options?: {
    version?: string;
    openapiVersion?: string;
}): OpenAPISpec;
/** Convert a Postman collection into the Bruno collection format. */
declare function exportToBruno(name: CollectionName): BrunoCollection;
/** Export collections to disk in Postman, OpenAPI or Bruno format. */
declare function exportToDirectory(name: CollectionName | 'all', targetDir?: string, format?: ExportFormat): string[];
/** Simulate running every endpoint in a collection (schema validation & mocks). */
declare function runCollection(name: CollectionName, options?: RunCollectionOptions): Promise<RunCollectionResult[]>;

export { APIEndpoint, BrunoCollection, COLLECTION_NAMES, CodeSnippetTarget, CollectionCategory, CollectionName, CollectionSummary, ExportFormat, FindEndpointsQuery, OpenAPISpec, PostmanAuth, PostmanBody, PostmanCollection, PostmanEnvironment, PostmanRequest, type ProviderEntry, RunCollectionOptions, RunCollectionResult, cashfreeCollection, cashfreeEnvironment, convertToBruno, convertToOpenAPI, delhiveryCollection, delhiveryEnvironment, easyecomCollection, easyecomEnvironment, environmentToVariables, exportToBruno, exportToDirectory, exportToOpenAPI, findEndpoints, generateCodeSnippet, generateCurl, generateMockResponse, getAllEndpoints, getAuthScheme, getCollection, getCollectionAuth, getEnvironment, getRegistryEntry, interpolateVariables, listCollections, parseRawBody, paytmCollection, paytmEnvironment, phonepeCollection, phonepeEnvironment, razorpayCollection, razorpayEnvironment, resolveVariables, runCollection, shiprocketCollection, shiprocketEnvironment, shopifyCollection, shopifyEnvironment, stripeCollection, stripeEnvironment };

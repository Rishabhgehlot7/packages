interface PostmanInfo {
    _postman_id: string;
    name: string;
    description: string;
    schema: string;
}
interface PostmanAuth {
    type: string;
    basic?: {
        key: string;
        value: string;
        type: string;
    }[];
    bearer?: {
        key: string;
        value: string;
        type: string;
    }[];
    [key: string]: any;
}
interface PostmanRequest {
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
    header: {
        key: string;
        value: string;
        description?: string;
    }[];
    body?: {
        mode: 'raw' | 'urlencoded' | 'formdata';
        raw?: string;
        [key: string]: any;
    };
    url: {
        raw: string;
        host?: string[];
        path?: string[];
        query?: {
            key: string;
            value: string;
            description?: string;
        }[];
    };
    description?: string;
}
interface PostmanItem {
    name: string;
    description?: string;
    request?: PostmanRequest;
    item?: PostmanItem[];
}
interface PostmanCollection {
    info: PostmanInfo;
    auth?: PostmanAuth;
    item: PostmanItem[];
    [key: string]: any;
}
interface PostmanEnvironmentVariable {
    key: string;
    value: string;
    type: 'default' | 'secret';
    enabled: boolean;
}
interface PostmanEnvironment {
    id: string;
    name: string;
    values: PostmanEnvironmentVariable[];
    _postman_variable_scope: string;
}
type CollectionName = 'razorpay' | 'cashfree' | 'phonepe' | 'paytm' | 'stripe' | 'easyecom' | 'shiprocket' | 'delhivery' | 'shopify';
interface CollectionSummary {
    id: string;
    name: string;
    provider: string;
    requestCount: number;
    folders: string[];
    docsUrl: string;
}

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
/**
 * List all available collections with endpoint counts and folders.
 */
declare function listCollections(): CollectionSummary[];
/**
 * Get a specific Postman Collection by name.
 */
declare function getCollection(name: CollectionName): PostmanCollection;
/**
 * Get a specific Postman Environment by name.
 */
declare function getEnvironment(name: CollectionName): PostmanEnvironment;
/**
 * Export collection and environment files to a specified directory.
 */
declare function exportToDirectory(name: CollectionName | 'all', targetDir?: string): string[];

export { type CollectionName, type CollectionSummary, type PostmanAuth, type PostmanCollection, type PostmanEnvironment, type PostmanEnvironmentVariable, type PostmanInfo, type PostmanItem, type PostmanRequest, cashfreeCollection, cashfreeEnvironment, delhiveryCollection, delhiveryEnvironment, easyecomCollection, easyecomEnvironment, exportToDirectory, getCollection, getEnvironment, listCollections, paytmCollection, paytmEnvironment, phonepeCollection, phonepeEnvironment, razorpayCollection, razorpayEnvironment, shiprocketCollection, shiprocketEnvironment, shopifyCollection, shopifyEnvironment, stripeCollection, stripeEnvironment };

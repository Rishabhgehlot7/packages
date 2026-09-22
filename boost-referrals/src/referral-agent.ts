export const referralsAgentTools = [
  { name: 'create_referral_link', description: 'Create a unique referral link/code for a customer. Returns the code and share links.', parameters: { type: 'object', properties: { referrerId: { type: 'string' } }, required: ['referrerId'] } },
  { name: 'record_referral_conversion', description: 'Record when a new customer signs up and places an order using a referral code.', parameters: { type: 'object', properties: { referralCode: { type: 'string' }, newCustomerId: { type: 'string' }, orderTotal: { type: 'number' }, orderId: { type: 'string' }, customerIp: { type: 'string' } }, required: ['referralCode', 'newCustomerId', 'orderTotal'] } },
  { name: 'get_referral_stats', description: 'Get referral stats for a customer: clicks, conversions, revenue generated, rewards earned, conversion rate.', parameters: { type: 'object', properties: { referrerId: { type: 'string' } }, required: ['referrerId'] } },
  { name: 'get_referral_leaderboard', description: 'Get the top N referrers ranked by number of conversions.', parameters: { type: 'object', properties: { topN: { type: 'number' } } } },
  { name: 'get_share_links', description: 'Get WhatsApp, Twitter, and copy-link share URLs for a referral code.', parameters: { type: 'object', properties: { referralCode: { type: 'string' }, baseUrl: { type: 'string' } }, required: ['referralCode'] } },
];
export type ReferralsAgentToolName = typeof referralsAgentTools[number]['name'];

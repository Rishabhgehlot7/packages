// AI Agent Toolkit for @boostengine/loyalty
// Compatible with OpenAI function calling, Google Gemini, LangChain, Vercel AI SDK

export const loyaltyAgentTools = [
  {
    name: 'get_customer_loyalty_profile',
    description: 'Get the full loyalty profile for a customer including balance, tier, perks, transactions, and active challenges.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Unique customer identifier' },
      },
      required: ['customerId'],
    },
  },
  {
    name: 'earn_coins_for_order',
    description: 'Award loyalty coins to a customer for a completed order. Automatically handles tier upgrades and challenge progress.',
    parameters: {
      type: 'object',
      properties: {
        customerId:  { type: 'string', description: 'Unique customer identifier' },
        orderTotal:  { type: 'number', description: 'Order total in INR' },
        orderId:     { type: 'string', description: 'Optional order ID for tracking' },
      },
      required: ['customerId', 'orderTotal'],
    },
  },
  {
    name: 'get_redemption_quote',
    description: 'Calculate how many coins a customer can redeem at checkout and the resulting discount. Returns the full quote.',
    parameters: {
      type: 'object',
      properties: {
        customerId:      { type: 'string', description: 'Unique customer identifier' },
        orderTotal:      { type: 'number', description: 'Current cart total in INR' },
        requestedCoins:  { type: 'number', description: 'Optional: specific coins customer wants to use' },
      },
      required: ['customerId', 'orderTotal'],
    },
  },
  {
    name: 'get_loyalty_leaderboard',
    description: 'Get the top N customers ranked by lifetime coins earned. Useful for display on loyalty dashboard.',
    parameters: {
      type: 'object',
      properties: {
        topN: { type: 'number', description: 'Number of top customers to return (default: 10)' },
      },
    },
  },
  {
    name: 'get_active_challenges',
    description: 'Get all active gamification challenges for a customer with their current progress and bonus coins on completion.',
    parameters: {
      type: 'object',
      properties: {
        customerId: { type: 'string', description: 'Unique customer identifier' },
      },
      required: ['customerId'],
    },
  },
];

export type LoyaltyAgentToolName = typeof loyaltyAgentTools[number]['name'];

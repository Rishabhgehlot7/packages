import { PackageDoc } from '../../types';

export const growthPackages: PackageDoc[] = [
  {
    id: 'boost-loyalty',
    name: '@boostengine/loyalty',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'Flipkart SuperCoins & Amazon Pay style loyalty reward engine with VIP tiers (Bronze, Silver, Gold, SuperStar), point earn rules, and checkout coin redemption.',
    badge: 'SuperCoins Rewards',
    npmInstall: 'npm i @boostengine/loyalty',
    bundleSize: '6.4 KB',
    useCase: 'Turns one-time shoppers into repeat brand advocates by rewarding coins on every purchase.',
    features: [
      'Tier ladder: Bronze (1x), Silver (1.5x), Gold (2x), SuperStar (3x coins)',
      'Configurable redemption rate (e.g. 100 Coins = â‚¹100 discount at checkout)',
      'Bonus coin rewards for product reviews and social sharing',
      'Coin expiration policy and automated balance reminder alerts'
    ],
    apiMethods: [
      {
        name: 'calculateEarnedCoins',
        signature: 'calculateEarnedCoins(orderTotal: number, customerTier: string): number',
        description: 'Computes coins rewarded for an order based on customer VIP tier multiplier.',
        params: [
          { name: 'orderTotal', type: 'number', description: 'Net order value', required: true },
          { name: 'customerTier', type: 'string', description: 'BRONZE | SILVER | GOLD | SUPERSTAR', required: true }
        ],
        returns: 'number - Earned reward coins'
      },
      {
        name: 'redeemCoins',
        signature: 'redeemCoins(coins: number, cartTotal: number): LoyaltyRedemptionResult',
        description: 'Calculates maximum allowed coin redemption value for current cart.',
        params: [
          { name: 'coins', type: 'number', description: 'Customer coin balance to redeem', required: true },
          { name: 'cartTotal', type: 'number', description: 'Cart subtotal', required: true }
        ],
        returns: 'LoyaltyRedemptionResult with coinsUsed, discountRupees, and remainingBalance'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { calculateEarnedCoins, redeemCoins } from '@boostengine/loyalty';
import { BoostLoyaltyProvider, useLoyalty, useLoyaltyProfile, useRedemptionQuote } from '@boostengine/loyalty/react';

// Server: coin accounting
const redemption = redeemCoins(250, 1999);

// Client: coin balance + redemption quote in the wallet UI
const { coins, tier } = useLoyaltyProfile();
const { discount, remaining } = useRedemptionQuote(coins, 1999);`
      },
      {
        title: 'Redeem Coins at Checkout',
        language: 'typescript',
        code: `import { redeemCoins, calculateEarnedCoins } from '@boostengine/loyalty';

// Customer has 250 SuperCoins
const redemption = redeemCoins(250, 1999);
console.log(\`Coins Applied: \${redemption.coinsUsed}, Discount: â‚¹\${redemption.discountRupees}\`);
// Coins Applied: 250, Discount: â‚¹250. Final Pay: â‚¹1749

// After order completed -> Award tier coins
const coinsEarned = calculateEarnedCoins(1749, 'GOLD');
console.log('Customer earned:', coinsEarned, 'coins!');`
      }
    ]
  },
  {
    id: 'boost-referrals',
    name: '@boostengine/referrals',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'Double-sided viral referral engine ("Give â‚¹200, Get â‚¹200") with anti-fraud device fingerprinting and 1-click WhatsApp shareable deep links.',
    badge: 'Viral Engine',
    npmInstall: 'npm i @boostengine/referrals',
    bundleSize: '5.2 KB',
    useCase: 'Drives low-CAC viral customer acquisition through word-of-mouth incentives on WhatsApp.',
    features: [
      'Double-sided incentives ("Friend gets 20% off, You get â‚¹200 wallet cash")',
      '1-Click WhatsApp pre-filled message generator with tracking links',
      'Anti-fraud shield: blocks self-referral, IP cloaking & device matching',
      'Conversion attribution tracking from link click to checkout completion'
    ],
    apiMethods: [
      {
        name: 'generateReferralLink',
        signature: 'generateReferralLink(userId: string, campaignId: string): ReferralLinkInfo',
        description: 'Generates unique referral code, vanity link, and pre-formatted WhatsApp text.',
        params: [
          { name: 'userId', type: 'string', description: 'Customer ID', required: true },
          { name: 'campaignId', type: 'string', description: 'Active referral campaign', required: true }
        ],
        returns: 'ReferralLinkInfo with code, url, and whatsAppShareUrl'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { generateReferralLink, trackReferralConversion } from '@boostengine/referrals';
import { BoostReferralsProvider, useReferrals, useReferralLink, useReferralStats } from '@boostengine/referrals/react';

// Server: attribution-safe referral links
const ref = generateReferralLink('user_882', 'SPRING_2026');

// Client: share buttons with live conversion stats
const { url, code } = useReferralLink();
const { clicks, conversions, rewardEarned } = useReferralStats();`
      },
      {
        title: 'Generate WhatsApp Viral Share Link',
        language: 'typescript',
        code: `import { generateReferralLink } from '@boostengine/referrals';

const ref = generateReferralLink('user_882', 'SPRING_2026');

console.log(ref.whatsAppShareUrl);
// https://wa.me/?text=Hey!%20Get%20%E2%82%B9200%20OFF%20your%20first%20order%20using%20my%20link:%20https://mybrand.com/r/RAHUL200`
      }
    ]
  },
  {
    id: 'boost-deals',
    name: '@boostengine/deals',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'Amazon-style Lightning Deals engine with countdown timers, claimed percentage progress bars, deal scheduling, and urgency badges.',
    badge: 'Lightning Deals',
    npmInstall: 'npm i @boostengine/deals',
    bundleSize: '4.8 KB',
    useCase: 'Creates high urgency for product drops and flash sales with live claim meters.',
    features: [
      'Amazon Lightning Deal style claim meter ("78% Claimed")',
      'Sync countdown timer (HH:MM:SS) resilient to client device clock tampering',
      'Strict limit of 1 claim per customer account',
      'Automatic deal closure when stock pool reaches 100% claim'
    ],
    apiMethods: [
      {
        name: 'getDealStatus',
        signature: 'getDealStatus(dealId: string): DealStatus',
        description: 'Returns real-time remaining stock, claimed percentage, and milliseconds remaining.',
        params: [
          { name: 'dealId', type: 'string', description: 'Deal identifier', required: true }
        ],
        returns: 'DealStatus with isActive, percentClaimed, msRemaining, and dealPrice'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { getDealStatus, activateDeal, claimDeal } from '@boostengine/deals';
import { DealsProvider, useCountdownTimer, useLightningDeal } from '@boostengine/deals/react';

// Server: deal scheduling & claim pool
const deal = getDealStatus('FLASH_MIDNIGHT_DROPS');

// Client: tamper-proof countdown UI
export function LightningDealBanner() {
  const { isActive, msRemaining } = useLightningDeal('FLASH_MIDNIGHT_DROPS');
  const { hours, minutes, seconds } = useCountdownTimer(msRemaining);
  return <span>Ends in {hours}:{minutes}:{seconds}</span>;
}`
      },
      {
        title: 'Flash Sale Component Status',
        language: 'typescript',
        code: `import { getDealStatus } from '@boostengine/deals';

const deal = getDealStatus('FLASH_MIDNIGHT_DROPS');
// {
//   isActive: true,
//   dealPrice: 899,
//   originalPrice: 1999,
//   percentClaimed: 84,
//   msRemaining: 1845000 // 30m 45s left
// }`
      }
    ]
  },
  {
    id: 'boost-recommendations',
    name: '@boostengine/recommendations',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'Frequently Bought Together (FBT combo bundles), cross-sell, and cart upsell algorithms designed to maximize Average Order Value (AOV).',
    badge: 'AOV Booster',
    npmInstall: 'npm i @boostengine/recommendations',
    bundleSize: '5.4 KB',
    useCase: 'Drives 15-25% higher AOV by showing 1-click bundle add-ons on the product page and checkout drawer.',
    features: [
      'Frequently Bought Together (FBT) algorithm based on co-occurrence matrix',
      '1-Click "Add All 3 to Cart" bundle discount combo calculator',
      'Cart slide-out drawer intelligent cross-sell recommendation',
      'Zero external ML infrastructure needed â€” lightweight client/server graph'
    ],
    apiMethods: [
      {
        name: 'getFrequentlyBoughtTogether',
        signature: 'getFrequentlyBoughtTogether(productId: string, catalog: Product[]): FbtBundle',
        description: 'Calculates top 2 companion products and bundled discount price.',
        params: [
          { name: 'productId', type: 'string', description: 'Target product ID', required: true },
          { name: 'catalog', type: 'Product[]', description: 'Catalog items with purchase history tags', required: true }
        ],
        returns: 'FbtBundle with mainProduct, companionProducts, comboPrice, and totalDiscount'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { getFrequentlyBoughtTogether, getCartCrossSells } from '@boostengine/recommendations';
import { RecommendationsProvider, useFrequentlyBoughtTogether, useCartCrossSells } from '@boostengine/recommendations/react';

// Server: FBT bundle computation
const bundle = getFrequentlyBoughtTogether('SHAMPOO_500ML', catalog);

// Client: dynamic PDP bundle widget
export function BundleSection() {
  const { bundle, addBundleToCart } = useFrequentlyBoughtTogether('SHAMPOO_500ML');
  return <button onClick={addBundleToCart}>Add Bundle (Save {bundle.savings}₹)</button>;
}`
      },
      {
        title: 'Frequently Bought Together Bundle',
        language: 'typescript',
        code: `import { getFrequentlyBoughtTogether } from '@boostengine/recommendations';

const bundle = getFrequentlyBoughtTogether('SHAMPOO_500ML', [] as any);
console.log(\`Bundle: \${bundle.mainProduct?.name} + \${bundle.companionProducts?.map((p: any) => p.name).join(' + ')}\`);
console.log(\`Combo Price: â‚¹\${bundle.comboPrice} (Save â‚¹\${bundle.savings})\`);`
      }
    ]
  },
  {
    id: 'boost-reviews',
    name: '@boostengine/reviews',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'Social proof engine with star rating distributions, verified buyer badges, customer photo uploads, helpfulness upvoting, and Schema.org SEO rich snippets.',
    badge: 'Social Proof',
    npmInstall: 'npm i @boostengine/reviews',
    bundleSize: '6.2 KB',
    useCase: 'Builds customer trust and boosts organic SEO rankings with rich review stars on Google Search.',
    features: [
      'Calculates 1-5 star distributions and average rating aggregates',
      'Automatic "Verified Buyer" badge verification against order database',
      'Customer photo/video review moderation queue',
      'Automatic Schema.org AggregateRating JSON-LD generation'
    ],
    apiMethods: [
      {
        name: 'aggregateReviews',
        signature: 'aggregateReviews(reviews: Review[]): ReviewAggregate',
        description: 'Computes rating average, star percentages, and verified count.',
        params: [
          { name: 'reviews', type: 'Review[]', description: 'Product reviews list', required: true }
        ],
        returns: 'ReviewAggregate with averageRating, totalCount, distribution, and schemaJsonLd'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { aggregateReviews, submitReview } from '@boostengine/reviews';
import { useProductReviews, useReviewBreakdown, useSubmitReview } from '@boostengine/reviews/react';

// Server: verified aggregation + Schema.org snippet
const summary = aggregateReviews(reviews);

// Client: review form + ~star breakdown bars
const { reviews, loading } = useProductReviews('PROD-100');
const { submit, status } = useSubmitReview('PROD-100');`
      },
      {
        title: 'Review Aggregation & Google Schema.org',
        language: 'typescript',
        code: `import { aggregateReviews } from '@boostengine/reviews';

const summary = aggregateReviews([] as any);
console.log('Average Rating:', summary.averageRating);
console.log('5 Star %:', summary.distribution?.['5']);

// Insert directly into Next.js <script type="application/ld+json">
const jsonLd = summary.schemaJsonLd;`
      }
    ]
  },
  {
    id: 'boost-wishlist',
    name: '@boostengine/wishlist',
    categoryId: 'growth',
    version: '1.1.0',
    description: 'High-speed Save-for-Later Wishlist engine with guest device sync, price drop notifications, and 1-click transfer to cart.',
    badge: 'Wishlist Engine',
    npmInstall: 'npm i @boostengine/wishlist',
    bundleSize: '4.7 KB',
    useCase: 'Enables shoppers to bookmark products before payday and alerts them when prices drop.',
    features: [
      'Local storage sync for guest users with seamless post-login merge',
      'Price drop detector alerting users when bookmarked items go on sale',
      '1-Click "Move to Cart" button with variant preservation',
      'Wishlist item stock availability tracking'
    ],
    apiMethods: [
      {
        name: 'addToWishlist',
        signature: 'addToWishlist(item: WishlistItem): WishlistState',
        description: 'Adds item to customer wishlist and emits update event.',
        params: [
          { name: 'item', type: 'WishlistItem', description: 'Product id, variant, addedPrice', required: true }
        ],
        returns: 'WishlistState'
      }
    ],
examples: [
      {
        title: 'Multi-Entry Imports: Root Engine + ./react',
        language: 'typescript',
        code: `import { toggleWishlist, moveToCart, watchPriceDrop } from '@boostengine/wishlist';
import { WishlistProvider, useWishlist, useWishlistButton, usePriceDropAlerts } from '@boostengine/wishlist/react';

// Server: wishlist state + price-drop watchers
toggleWishlist({ id: 'P_902', name: 'Silk Saree', price: 3499 });

// Client: heart button with variant-preserving move-to-cart
export function HeartButton({ product }) {
  const { isWishlisted, toggle } = useWishlistButton(product.id);
  const { alerts } = usePriceDropAlerts();
  return <button onClick={toggle}>{isWishlisted ? '♥' : '♡'}</button>;
}`
      },
      {
        title: 'Toggle Wishlist & Move to Cart',
        language: 'typescript',
        code: `import { toggleWishlist, moveToCart } from '@boostengine/wishlist';

// Toggle bookmark on heart click
toggleWishlist({ id: 'P_902', name: 'Silk Saree', price: 3499 });

// Transfer directly into cart
moveToCart('P_902');`
      }
    ]
  }
];


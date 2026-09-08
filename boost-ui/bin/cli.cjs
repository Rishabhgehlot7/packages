#!/usr/bin/env node
console.log('\n🎨 @boostengine/ui - Pre-Built High-Converting eCommerce UI Components');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'list') {
  console.log('Available React / Next.js Components:');
  console.log('  1. CartDrawer        - Slide-out cart with Free Shipping progress bar');
  console.log('  2. StickyAddToCart   - Mobile bottom bar with title, price, qty & Buy Now');
  console.log('  3. PincodeChecker    - Pincode delivery estimator with COD badge');
  console.log('  4. TrustBadges       - 100% Genuine, 7-Day Return, SSL & COD icons');
  console.log('  5. OrderTimeline     - Step-by-step Placed -> Shipped -> Delivered tracker');
  console.log('  6. StarRating        - Gold star display with review count\n');
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/ui list   List all pre-built eCommerce components');
  console.log('  npx @boostengine/ui help   Show help information\n');
}

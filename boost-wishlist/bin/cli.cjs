#!/usr/bin/env node

console.log('\x1b[35m%s\x1b[0m', '💖 @boostengine/wishlist CLI (v1.1.0)');
console.log('\x1b[90m%s\x1b[0m', 'Enterprise Wishlist, Multi-Boards, Price Drops & Cart Transitions\n');

const args = process.argv.slice(2);
const command = args[0] || 'demo';

if (command === 'help' || command === '--help' || command === '-h') {
  console.log('Usage: boost-wishlist <command>\n');
  console.log('Commands:');
  console.log('  demo     Run interactive simulation of Multi-Boards, Price Drops & Move-to-Cart');
  console.log('  help     Show this help message\n');
  process.exit(0);
}

let createBoostWishlist, wishlist;
try {
  const pkg = require('../dist/index.cjs');
  createBoostWishlist = pkg.createBoostWishlist;
  wishlist = pkg.wishlist;
} catch (e) {
  console.log('\x1b[31m%s\x1b[0m', 'Error: dist not found. Please run "npm run build" first.');
  process.exit(1);
}

if (command === 'demo') {
  console.log('\x1b[32m%s\x1b[0m', '🚀 Initializing Multi-Board Wishlist Engine...\n');

  const wl = createBoostWishlist();

  // 1. Create custom boards
  const holidayBoard = wl.createBoard('Holiday Wishlist', { description: 'Gifts for family' });
  console.log(`Created Board: "${holidayBoard.name}" (ID: ${holidayBoard.id})`);

  // 2. Add items to different boards
  wl.addItem({
    productId: 'prod_jacket',
    title: 'Cyberpunk Waterproof Jacket',
    price: 3999,
    inStock: true,
  });

  wl.addItem({
    productId: 'prod_sneakers',
    title: 'Retro High Top Sneakers',
    price: 4999,
    inStock: false, // Out of stock initially
    boardId: holidayBoard.id,
  });

  console.log('\x1b[33m%s\x1b[0m', '\nWishlist Summary:');
  const summary = wl.getSummary();
  console.log(`  Total Items: ${summary.totalCount} across ${summary.boardCount} board(s)`);
  console.log(`  Total Wishlist Value: ₹${summary.totalValue}`);

  // 3. Price drop & restock scan
  console.log('\x1b[33m%s\x1b[0m', '\nSimulating Catalog Updates (Price Drop + Restock):');
  const catalog = [
    { id: 'prod_jacket', price: 2999, inStock: true }, // Dropped ₹1000!
    { id: 'prod_sneakers', price: 4999, inStock: true }, // Back in stock!
  ];

  const priceDrops = wl.checkPriceDrops(catalog);
  priceDrops.forEach((p) => {
    console.log(`  🏷️ PRICE DROP: "${p.item.title}" dropped from ₹${p.originalPrice} to ₹${p.currentPrice} (Saved ₹${p.savedAmount} - ${p.discountPercentage}% OFF!)`);
  });

  const restocks = wl.checkRestockAlerts(catalog);
  restocks.forEach((r) => {
    console.log(`  🔔 RESTOCKED: "${r.item.title}" is now back in stock!`);
  });

  // 4. Move to Cart
  console.log('\x1b[33m%s\x1b[0m', '\nMoving Wishlisted Item to Checkout Cart:');
  const cartResult = wl.moveToCart('prod_jacket', undefined, { autoRemove: true, quantity: 1 });
  if (cartResult) {
    console.log(`  🛒 Moved "${cartResult.cartItem.title}" to cart @ ₹${cartResult.cartItem.price}`);
    console.log(`  Remaining items in wishlist: ${cartResult.remainingWishlistCount}`);
  }

  console.log('\n\x1b[35m%s\x1b[0m', '✨ Demo complete! BoostWishlist is ready for high-converting ecommerce.');
}

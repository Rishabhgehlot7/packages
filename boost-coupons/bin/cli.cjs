#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('🎟️ @boostengine/coupons - Promotions & Discount CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Discount Models:\n');
    console.table([
      { type: 'FLAT', description: 'Fixed discount (e.g. ₹200 off)', example: 'FLAT200' },
      { type: 'PERCENTAGE', description: 'Percentage off with max cap', example: 'SAVE20 (Max ₹300)' },
      { type: 'FREE_SHIPPING', description: 'Waive delivery fee over threshold', example: 'FREESHIP' },
      { type: 'TIERED', description: 'Spend more, save more ladder', example: 'Spend 1999 get 300, Spend 2999 get 500' },
      { type: 'BOGO', description: 'Buy X Get Y Free/Discounted', example: 'Buy 2 Get 1 Free' },
    ]);
    break;
  }

  default: {
    console.log('Usage:');
    console.log('  npx @boostengine/coupons list  - View supported discount rules');
    console.log('\nDocumentation: https://github.com/boostengine/coupons\n');
    break;
  }
}

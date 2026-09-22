#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('🎟️ @boostengine/coupons - Promotions & Discount CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Promotional Discount Models:\n');
    console.table([
      { type: 'FLAT', description: 'Fixed discount amount', example: 'FLAT200 (₹200 off)' },
      { type: 'PERCENTAGE', description: 'Percentage off with max cap', example: 'SAVE20 (20% off up to ₹500)' },
      { type: 'FREE_SHIPPING', description: 'Waive delivery fee over threshold', example: 'FREESHIP' },
      { type: 'TIERED', description: 'Spend more save more ladder', example: 'Spend 1999 get 300, 2999 get 500' },
      { type: 'BOGO', description: 'Buy X Get Y Free/Discounted', example: 'Buy 2 Get 1 Free' },
      { type: 'CASHBACK', description: 'Wallet credit for repeat purchases', example: 'CASHBACK100' },
      { type: 'REFERRAL', description: 'Influencer code with commission', example: 'RAHUL20 (Affiliate tracked)' },
    ]);
    break;
  }

  case 'test': {
    const code = (args[1] || 'SAVE20').toUpperCase();
    const subtotal = parseFloat(args[2] || '1500');

    console.log(`Evaluating promo code '${code}' on cart subtotal ₹${subtotal}...\n`);

    if (code === 'SAVE20') {
      const discount = Math.min((subtotal * 20) / 100, 500);
      console.log(`✅ Status: VALID`);
      console.log(`💰 Discount Applied: ₹${discount}`);
      console.log(`🛒 Final Payable: ₹${subtotal - discount}`);
    } else if (code === 'FLAT100') {
      console.log(`✅ Status: VALID`);
      console.log(`💰 Discount Applied: ₹100`);
      console.log(`🛒 Final Payable: ₹${Math.max(0, subtotal - 100)}`);
    } else {
      console.log(`ℹ️ Simulation: Code '${code}' tested successfully.`);
    }
    break;
  }

  default: {
    console.log('Usage:');
    console.log('  npx @boostengine/coupons list                      - View all 7 supported discount types');
    console.log('  npx @boostengine/coupons test <CODE> <subtotal>    - Test coupon calculation instantly');
    console.log('\nDocumentation: https://github.com/boostengine/boostengine/tree/main/packages/boost-coupons\n');
    break;
  }
}

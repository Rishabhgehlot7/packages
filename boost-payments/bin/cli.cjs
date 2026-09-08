#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('⚡ @boostengine/payments - Multi-Gateway CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Payment Gateways:\n');
    const gateways = [
      { name: 'Razorpay', key: 'razorpay', type: 'Cards, UPI, Netbanking, Smart Collect', region: 'India' },
      { name: 'Cashfree', key: 'cashfree', type: 'Drop-in, Seamless UPI/Cards, Verification, Payouts', region: 'India' },
      { name: 'PhonePe', key: 'phonepe', type: 'Standard Hosted Pay, Mobile App Intent, UPI Collect', region: 'India' },
      { name: 'Paytm', key: 'paytm', type: 'All-In-One Checkout SDK, txnToken, Status', region: 'India' },
      { name: 'Stripe', key: 'stripe', type: 'Checkout Sessions, PaymentIntents, Global Cards', region: 'Global' },
      { name: 'COD', key: 'cod', type: 'Cash On Delivery with fee rules & limit thresholds', region: 'Local' },
    ];
    console.table(gateways);
    break;
  }

  case 'init-env': {
    const envContent = `# Boost Engine Payments - Multi-Gateway Environment Variables

# Default Gateway (razorpay | cashfree | phonepe | paytm | stripe | cod)
DEFAULT_PAYMENT_GATEWAY=cashfree

# Razorpay
RAZORPAY_KEY_ID=rzp_test_your_key_id
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_razorpay_webhook_secret

# Cashfree
CASHFREE_APP_ID=your_cashfree_app_id
CASHFREE_SECRET_KEY=your_cashfree_secret_key
CASHFREE_ENV=SANDBOX

# PhonePe
PHONEPE_MERCHANT_ID=PGTESTPAYUAT
PHONEPE_SALT_KEY=099eb0cd-02cf-4e2a-8aca-3e6c6aff0399
PHONEPE_SALT_INDEX=1
PHONEPE_ENV=UAT

# Paytm
PAYTM_MID=YOUR_PAYTM_MID
PAYTM_MERCHANT_KEY=YOUR_PAYTM_MERCHANT_KEY
PAYTM_ENV=STAGE

# Stripe
STRIPE_SECRET_KEY=sk_test_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# Cash On Delivery (COD) Rules
COD_MIN_ORDER=200
COD_MAX_ORDER=10000
COD_EXTRA_FEE=49
`;
    const targetFile = path.join(process.cwd(), '.env.payments.example');
    fs.writeFileSync(targetFile, envContent, 'utf8');
    console.log(`✅ Created environment template: ${targetFile}`);
    console.log('Copy desired variables into your project .env file.\n');
    break;
  }

  case 'hash': {
    const text = args[1];
    if (!text) {
      console.log('Usage: npx @boostengine/payments hash "<text>"');
      break;
    }
    const hash = crypto.createHash('sha256').update(text).digest('hex');
    console.log(`Input:  ${text}`);
    console.log(`SHA256: ${hash}\n`);
    break;
  }

  default: {
    console.log('Usage:');
    console.log('  npx @boostengine/payments list        - List all 6 supported gateways');
    console.log('  npx @boostengine/payments init-env    - Generate .env.payments.example template');
    console.log('  npx @boostengine/payments hash <text> - Calculate SHA256 checksum');
    console.log('\nDocumentation: https://github.com/boostengine/payments\n');
    break;
  }
}

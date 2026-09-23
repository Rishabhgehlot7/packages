#!/usr/bin/env node

/**
 * @boostengine/subscriptions CLI
 */

const { SubscriptionEngine } = require('../dist/index.js');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
@boostengine/subscriptions CLI v1.0.0
Enterprise Subscribe & Save, Recurring Billing & Customer Portal Engine

Usage:
  boost-subscriptions <command> [options]

Commands:
  demo                       Run interactive demo simulation with subscriptions & MRR
  metrics                    Display MRR, ARR, churn and subscriber statistics
  simulate-billing           Simulate a billing cycle and invoice generation
  help                       Show this help message

Options:
  --frequency <freq>         Subscription frequency (daily, weekly, monthly, etc.)
  --discount <percent>       Discount percentage (default: 15)
  --cycles <num>             Number of recurring cycles to simulate (default: 3)
`);
}

async function runDemo() {
  console.log('🚀 Initializing @boostengine/subscriptions demo engine...\n');
  const engine = new SubscriptionEngine();

  const plan = {
    id: 'plan_monthly_save15',
    name: 'Deliver Every 30 Days (Save 15%)',
    frequency: 'monthly',
    discount: {
      type: 'percentage',
      value: 15,
      tierDiscounts: [
        { orderThreshold: 3, discountPercentage: 20 }
      ]
    },
    freeShipping: true
  };

  console.log('📦 Creating sample subscription for Customer "Rishabh"...');
  const sub = engine.createSubscription({
    customerId: 'cust_rishabh_01',
    customerEmail: 'rishabh@example.com',
    customerName: 'Rishabh Gehlot',
    plan,
    items: [
      {
        productId: 'prod_whey_protein',
        title: 'Pure Whey Isolate 1kg - Double Chocolate',
        unitPrice: 2499,
        discountedPrice: 2124.15,
        quantity: 1
      },
      {
        productId: 'prod_creatine',
        title: 'Creapure Micronized Creatine 300g',
        unitPrice: 999,
        discountedPrice: 849.15,
        quantity: 2
      }
    ],
    shippingAddress: {
      fullName: 'Rishabh Gehlot',
      addressLine1: 'Suite 404, Tech Park',
      city: 'Bangalore',
      state: 'Karnataka',
      postalCode: '560001',
      country: 'IN',
      phone: '+919876543210'
    },
    paymentMethod: {
      gateway: 'razorpay',
      customerId: 'cust_rzp_01',
      paymentMethodToken: 'token_mandate_rzp_9999',
      last4: '4321',
      brand: 'Visa'
    },
    currency: 'INR'
  });

  console.log(`✅ Subscription Created! ID: ${sub.id}`);
  console.log(`   - Original Subtotal: ₹${sub.subtotal}`);
  console.log(`   - Discount Saved: ₹${sub.discountTotal} (15% Subscribe & Save)`);
  console.log(`   - Billed Total: ₹${sub.totalAmount}`);
  console.log(`   - Next Delivery: ${sub.nextDeliveryDate}\n`);

  console.log('💳 Simulating Billing Cycle 1...');
  const cycle1 = engine.processBillingCycle(sub.id, true);
  console.log(`   ✅ Billed Order ID: ${cycle1.orderId} | Cycle #${cycle1.subscription.cycleCount}`);
  console.log(`   📅 Next Billing Scheduled: ${cycle1.subscription.nextBillingDate}\n`);

  console.log('💳 Simulating Billing Cycle 2...');
  const cycle2 = engine.processBillingCycle(sub.id, true);
  console.log(`   ✅ Billed Order ID: ${cycle2.orderId} | Cycle #${cycle2.subscription.cycleCount}\n`);

  console.log('💳 Simulating Billing Cycle 3 (Loyalty Tier Upgrade: 20% off!)...');
  const cycle3 = engine.processBillingCycle(sub.id, true);
  console.log(`   ✅ Billed Order ID: ${cycle3.orderId} | Cycle #${cycle3.subscription.cycleCount}\n`);

  const metrics = engine.getMetrics();
  console.log('📊 Active Subscription Metrics:');
  console.log(`   - Active Subscribers: ${metrics.activeSubscriberCount}`);
  console.log(`   - Monthly Recurring Revenue (MRR): ₹${metrics.monthlyRecurringRevenue}`);
  console.log(`   - Annual Recurring Revenue (ARR): ₹${metrics.annualRecurringRevenue}`);
  console.log(`   - Average Order Value (AOV): ₹${metrics.averageOrderValue}`);
  console.log(`   - Churn Rate: ${metrics.churnRatePercentage}%\n`);

  console.log('✨ Demo completed successfully!');
}

async function main() {
  if (!command || command === 'help' || command === '--help') {
    printHelp();
    return;
  }

  if (command === 'demo' || command === 'simulate-billing' || command === 'metrics') {
    await runDemo();
  } else {
    console.error(`Unknown command: ${command}`);
    printHelp();
    process.exit(1);
  }
}

main().catch(err => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});

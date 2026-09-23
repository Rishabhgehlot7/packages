/**
 * @boostengine/subscriptions Test Suite
 */

const assert = require('assert');
const { SubscriptionEngine, createSubscriptionAgentTools } = require('./dist/index.js');

console.log('🧪 Starting @boostengine/subscriptions Test Suite...\n');

let passedTests = 0;
let totalTests = 0;

function test(name, fn) {
  totalTests++;
  try {
    fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

async function asyncTest(name, fn) {
  totalTests++;
  try {
    await fn();
    console.log(`  ✅ PASS: ${name}`);
    passedTests++;
  } catch (err) {
    console.error(`  ❌ FAIL: ${name}`);
    console.error(err);
  }
}

async function runAllTests() {
  const engine = new SubscriptionEngine();

  const plan = {
    id: 'plan_monthly',
    name: 'Deliver Every Month (15% Off)',
    frequency: 'monthly',
    discount: {
      type: 'percentage',
      value: 15,
      tierDiscounts: [
        { orderThreshold: 3, discountPercentage: 25 }
      ]
    },
    freeShipping: true
  };

  test('1. Interval Days & Date Calculation', () => {
    assert.strictEqual(engine.getIntervalDays('daily'), 1);
    assert.strictEqual(engine.getIntervalDays('weekly'), 7);
    assert.strictEqual(engine.getIntervalDays('monthly'), 30);
    assert.strictEqual(engine.getIntervalDays('custom_days', 45), 45);

    const base = new Date('2026-01-01T00:00:00.000Z');
    const nextMonthly = new Date(engine.calculateNextDate(base, 'monthly'));
    assert.strictEqual(nextMonthly.getUTCDate(), 31);
  });

  test('2. Calculate Discount Pricing with Loyalty Tiers', () => {
    // Cycle 1: 15% off 1000 => 850
    const d1 = engine.calculateDiscountedPrice(1000, plan, 1);
    assert.strictEqual(d1.discountedPrice, 850);
    assert.strictEqual(d1.discountAmount, 150);

    // Cycle 3: 25% off 1000 => 750
    const d3 = engine.calculateDiscountedPrice(1000, plan, 3);
    assert.strictEqual(d3.discountedPrice, 750);
    assert.strictEqual(d3.discountAmount, 250);
  });

  let createdSub;
  test('3. Create Subscription Record', () => {
    createdSub = engine.createSubscription({
      customerId: 'cust_test_101',
      customerEmail: 'test@boostengine.dev',
      customerName: 'Aman Sharma',
      plan,
      items: [
        {
          productId: 'prod_coffee_beans',
          title: 'Arabica Dark Roast 500g',
          unitPrice: 800,
          discountedPrice: 680,
          quantity: 2
        }
      ],
      shippingAddress: {
        fullName: 'Aman Sharma',
        addressLine1: '123 Tech Park',
        city: 'Bengaluru',
        state: 'Karnataka',
        postalCode: '560100',
        country: 'IN',
        phone: '+919988776655'
      },
      paymentMethod: {
        gateway: 'stripe',
        customerId: 'cus_stripe_123',
        paymentMethodToken: 'pm_card_visa',
        last4: '4242'
      },
      currency: 'INR'
    });

    assert.ok(createdSub.id.startsWith('sub_'));
    assert.strictEqual(createdSub.status, 'active');
    assert.strictEqual(createdSub.subtotal, 1600);
    assert.strictEqual(createdSub.discountTotal, 240); // 15% of 1600 = 240
    assert.strictEqual(createdSub.totalAmount, 1360);
  });

  test('4. Pause, Skip, and Resume Subscription', () => {
    // Pause
    const paused = engine.pauseSubscription(createdSub.id);
    assert.strictEqual(paused.status, 'paused');

    // Resume
    const resumed = engine.resumeSubscription(createdSub.id);
    assert.strictEqual(resumed.status, 'active');

    // Skip
    const skipped = engine.skipNextDelivery(createdSub.id);
    assert.strictEqual(skipped.status, 'skipped');
  });

  test('5. Billing Cycle Processing & History', () => {
    // Process Cycle 1
    const res1 = engine.processBillingCycle(createdSub.id, true);
    assert.strictEqual(res1.success, true);
    assert.strictEqual(res1.subscription.cycleCount, 1);
    assert.strictEqual(res1.subscription.orderHistory.length, 1);
    assert.strictEqual(res1.subscription.orderHistory[0].status, 'paid');

    // Process Cycle 2
    const res2 = engine.processBillingCycle(createdSub.id, true);
    assert.strictEqual(res2.subscription.cycleCount, 2);
    assert.strictEqual(res2.subscription.orderHistory.length, 2);
  });

  test('6. Quantity, Frequency & Product Modifications', () => {
    // Update Quantity
    engine.updateItemQuantity(createdSub.id, 'prod_coffee_beans', 3);
    assert.strictEqual(createdSub.items[0].quantity, 3);
    assert.strictEqual(createdSub.subtotal, 2400);
    assert.strictEqual(createdSub.totalAmount, 2040); // 2400 - 360 = 2040

    // Update Frequency
    engine.updateFrequency(createdSub.id, 'biweekly');
    assert.strictEqual(createdSub.frequency, 'biweekly');
  });

  test('7. Business Metrics Calculation (MRR, ARR, Churn)', () => {
    const metrics = engine.getMetrics();
    assert.strictEqual(metrics.totalActiveSubscriptions, 1);
    assert.ok(metrics.monthlyRecurringRevenue > 0);
    assert.strictEqual(metrics.annualRecurringRevenue, metrics.monthlyRecurringRevenue * 12);
    assert.strictEqual(metrics.totalCancelledSubscriptions, 0);
  });

  await asyncTest('8. AI Agent Subscription Tools Integration', async () => {
    const tools = createSubscriptionAgentTools({ engine });
    assert.strictEqual(tools.length, 7);

    // Test get_customer_subscriptions
    const getTool = tools.find(t => t.name === 'get_customer_subscriptions');
    const getRes = await getTool.handler({ customerId: 'cust_test_101' });
    assert.strictEqual(getRes.success, true);
    assert.strictEqual(getRes.count, 1);

    // Test metrics tool
    const metricTool = tools.find(t => t.name === 'get_subscription_business_metrics');
    const metricRes = await metricTool.handler();
    assert.strictEqual(metricRes.success, true);
    assert.ok(metricRes.metrics.monthlyRecurringRevenue > 0);
  });

  console.log(`\n🎉 Test Suite Completed: ${passedTests}/${totalTests} Passed!`);
  if (passedTests !== totalTests) {
    process.exit(1);
  }
}

runAllTests().catch(err => {
  console.error('Fatal Test Suite Error:', err);
  process.exit(1);
});

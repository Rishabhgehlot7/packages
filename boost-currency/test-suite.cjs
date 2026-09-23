/**
 * @boostengine/currency Test Suite
 */

const assert = require('assert');
const { CurrencyEngine, createCurrencyAgentTools, DEFAULT_CURRENCIES } = require('./dist/index.js');

console.log('🧪 Starting @boostengine/currency Test Suite...\n');

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
  const engine = new CurrencyEngine({
    baseCurrency: 'INR',
    customRates: {
      INR: 1.0,
      USD: 0.012,
      EUR: 0.011,
      GBP: 0.0095,
      AED: 0.044,
      JPY: 1.85
    }
  });

  test('1. Currency Metadata & Dictionary', () => {
    const inrMeta = engine.getCurrencyMetadata('INR');
    assert.strictEqual(inrMeta.symbol, '₹');
    assert.strictEqual(inrMeta.symbolPosition, 'prefix');

    const eurMeta = engine.getCurrencyMetadata('EUR');
    assert.strictEqual(eurMeta.symbol, '€');
    assert.strictEqual(eurMeta.decimalSeparator, ',');
  });

  test('2. Country to Currency Geo-IP Detection', () => {
    assert.strictEqual(engine.detectCurrencyFromCountry('US'), 'USD');
    assert.strictEqual(engine.detectCurrencyFromCountry('IN'), 'INR');
    assert.strictEqual(engine.detectCurrencyFromCountry('GB'), 'GBP');
    assert.strictEqual(engine.detectCurrencyFromCountry('AE'), 'AED');
    assert.strictEqual(engine.detectCurrencyFromCountry('DE'), 'EUR');
    assert.strictEqual(engine.detectCurrencyFromCountry('JP'), 'JPY');
  });

  test('3. Raw & Rounded Price Formatting', () => {
    const fmtUSD = engine.formatPrice(49.99, 'USD');
    assert.strictEqual(fmtUSD, '$49.99');

    const fmtINR = engine.formatPrice(2499, 'INR');
    assert.strictEqual(fmtINR, '₹2,499.00');

    const fmtEUR = engine.formatPrice(35.50, 'EUR');
    assert.strictEqual(fmtEUR, '€ 35,50');
  });

  test('4. Psychological Price Rounding Strategies', () => {
    // 19.34 with round_up_99 => 19.99
    assert.strictEqual(engine.applyRounding(19.34, 'round_up_99'), 19.99);

    // 19.34 with round_up_95 => 19.95
    assert.strictEqual(engine.applyRounding(19.34, 'round_up_95'), 19.95);

    // 19.34 with round_up_49 => 19.49
    assert.strictEqual(engine.applyRounding(19.34, 'round_up_49'), 19.49);

    // 1430 with round_nearest_99 => 1499
    assert.strictEqual(engine.applyRounding(1430, 'round_nearest_99'), 1499);
  });

  test('5. Multi-Currency Conversion with Rates', () => {
    // 1000 INR to USD at rate 0.012 = 12 USD
    const resUSD = engine.convert(1000, 'INR', 'USD', { rounding: 'none' });
    assert.strictEqual(resUSD.convertedAmount, 12);
    assert.strictEqual(resUSD.targetCurrency, 'USD');
    assert.strictEqual(resUSD.formatted, '$12.00');

    // 1000 INR to USD with charm rounding (.99) => 12.99
    const resCharm = engine.convert(1000, 'INR', 'USD', { rounding: 'round_up_99' });
    assert.strictEqual(resCharm.convertedAmount, 12.99);
    assert.strictEqual(resCharm.formatted, '$12.99');
  });

  await asyncTest('6. AI Agent Currency Tools Integration', async () => {
    const tools = createCurrencyAgentTools({ engine });
    assert.strictEqual(tools.length, 4);

    // Test convert_currency_price
    const convertTool = tools.find(t => t.name === 'convert_currency_price');
    const convRes = await convertTool.handler({
      amount: 2500,
      fromCurrency: 'INR',
      toCurrency: 'USD',
      rounding: 'round_up_99'
    });
    assert.strictEqual(convRes.success, true);
    assert.strictEqual(convRes.conversion.targetCurrency, 'USD');

    // Test detect_currency_from_country
    const detectTool = tools.find(t => t.name === 'detect_currency_from_country');
    const detRes = await detectTool.handler({ countryCode: 'AE' });
    assert.strictEqual(detRes.success, true);
    assert.strictEqual(detRes.currencyCode, 'AED');
    assert.strictEqual(detRes.symbol, 'AED');
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

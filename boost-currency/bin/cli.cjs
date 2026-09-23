#!/usr/bin/env node

/**
 * @boostengine/currency CLI
 */

const { CurrencyEngine } = require('../dist/index.js');

const args = process.argv.slice(2);
const command = args[0];

function printHelp() {
  console.log(`
@boostengine/currency CLI v1.0.0
Multi-Currency Switching, FX Rates, Geo-IP Detection & Price Rounding

Usage:
  boost-currency <command> [options]

Commands:
  convert <amount>           Convert price between currencies
  detect <countryCode>       Detect currency and symbol for country
  rates                      Display configured exchange rates table
  demo                       Run interactive conversion & rounding demo
  help                       Show this help message

Options:
  --from <currency>          Source currency (default: INR)
  --to <currency>            Target currency (default: USD)
  --rounding <strategy>      none, round_up_99, round_up_95, round_integer, round_nearest_99
`);
}

async function runDemo() {
  console.log('🌍 Initializing @boostengine/currency demo engine...\n');
  const engine = new CurrencyEngine({
    baseCurrency: 'INR',
    defaultRounding: 'round_up_99'
  });

  const basePriceINR = 2499;
  console.log(`🏷️ Base Product Price: ₹${basePriceINR} INR\n`);

  const targets = ['USD', 'EUR', 'GBP', 'AED', 'CAD', 'AUD', 'SGD', 'JPY'];

  console.log('💱 Real-Time Global Market Conversions (.99 Charm Rounding):');
  console.log('-------------------------------------------------------------');
  for (const target of targets) {
    const res = engine.convert(basePriceINR, 'INR', target, { rounding: 'round_up_99' });
    console.log(`  ${target.padEnd(5)}: ${res.formatted.padEnd(14)} (Rate: 1 INR = ${res.exchangeRate} ${target})`);
  }

  console.log('\n🗺️ Geo-IP Country Detection Test:');
  const countries = ['US', 'IN', 'GB', 'AE', 'DE', 'JP', 'SG', 'AU'];
  for (const c of countries) {
    const curr = engine.detectCurrencyFromCountry(c);
    const meta = engine.getCurrencyMetadata(curr);
    console.log(`  Country: ${c}  ==> Currency: ${curr} (${meta.symbol}) - ${meta.name}`);
  }

  console.log('\n✨ Demo completed successfully!');
}

async function main() {
  if (!command || command === 'help' || command === '--help') {
    printHelp();
    return;
  }

  const engine = new CurrencyEngine({ baseCurrency: 'INR' });

  if (command === 'demo') {
    await runDemo();
  } else if (command === 'rates') {
    console.log('📊 Active Exchange Rates (Base: INR):');
    console.table(engine.exportRates());
  } else if (command === 'detect') {
    const country = args[1] || 'US';
    const curr = engine.detectCurrencyFromCountry(country);
    const meta = engine.getCurrencyMetadata(curr);
    console.log(`Country: ${country.toUpperCase()} => Currency: ${curr} (${meta.symbol}) ${meta.name}`);
  } else if (command === 'convert') {
    const amount = parseFloat(args[1]) || 1000;
    const from = (args.find((a, i) => args[i - 1] === '--from') || 'INR').toUpperCase();
    const to = (args.find((a, i) => args[i - 1] === '--to') || 'USD').toUpperCase();
    const res = engine.convert(amount, from, to, { rounding: 'round_up_99' });
    console.log(`\n💱 Conversion Result:`);
    console.log(`   ${amount} ${from} = ${res.formatted} (${res.targetCurrency})`);
    console.log(`   Exchange Rate: 1 ${from} = ${res.exchangeRate} ${to}\n`);
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

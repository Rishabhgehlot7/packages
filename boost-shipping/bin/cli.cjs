#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('🚚 @boostengine/shipping - Multi-Carrier Logistics CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Logistics Carriers:\n');
    console.table([
      { name: 'Shiprocket', key: 'shiprocket', type: 'Aggregator (Delhivery, Bluedart, Shadowfax)', feature: 'Rate compare, AWB, Pickup, NDR' },
      { name: 'Delhivery', key: 'delhivery', type: 'Direct Express Network', feature: 'Surface & Express CMU, Bulk waybills' },
      { name: 'Shadowfax', key: 'shadowfax', type: 'Hyperlocal & D2C Surface', feature: 'Fast delivery & COD reconciliation' },
      { name: 'BlueDart', key: 'bluedart', type: 'Air Express Priority', feature: 'High-value security, fastest 1-day transit' },
      { name: 'Xpressbees', key: 'xpressbees', type: 'Direct B2C & Surface', feature: 'Large eCommerce scale (FirstCry, Meesho)' },
      { name: 'Ecom Express', key: 'ecomexpress', type: 'Pan-India 27k+ Pincodes', feature: 'Deep Tier 2/3/4 reach & COD' },
    ]);
    break;
  }

  case 'pincode': {
    const pin = args[1] || '560001';
    console.log(`Checking Indian Pincode Intelligence for: ${pin}...\n`);
    const isValid = /^[1-9][0-9]{5}$/.test(pin);
    if (!isValid) {
      console.log(`❌ Invalid Indian Pincode (${pin}). Must be 6 digits and cannot start with 0.`);
      break;
    }

    const prefix = pin.substring(0, 2);
    const metroPrefixes = ['11', '40', '56', '60', '50', '70', '38'];
    const tier = metroPrefixes.includes(prefix) ? 'METRO' : 'TIER_1 / TIER_2';
    console.log(`✅ Status: Deliverable`);
    console.log(`📍 Delivery Tier: ${tier}`);
    console.log(`🚚 Estimated Transit: ${tier === 'METRO' ? '1-2 days' : '2-4 days'}`);
    console.log(`💵 Cash on Delivery (COD): Supported`);
    break;
  }

  case 'box': {
    const weight = parseFloat(args[1] || '0.5');
    console.log(`Suggesting optimal packaging box for ${weight} kg parcel...\n`);
    if (weight <= 0.5) {
      console.log('📦 Recommended: Standard Poly Flyer S (T-Shirt / Mobile Acc)');
      console.log('⚡ Dimensions: 25 x 18 x 3 cm (Volumetric: 0.27 kg)');
      console.log('💰 Savings: Billed on Dead Weight. Zero volumetric penalty!');
    } else if (weight <= 1.5) {
      console.log('📦 Recommended: Corrugated Box Small (Cosmetics / Electronics)');
      console.log('⚡ Dimensions: 20 x 15 x 12 cm (Volumetric: 0.72 kg)');
    } else {
      console.log('📦 Recommended: Corrugated Box Medium (Shoe Box / Multi-items)');
      console.log('⚡ Dimensions: 32 x 22 x 14 cm (Volumetric: 1.97 kg)');
    }
    break;
  }

  case 'init-env': {
    const fs = require('fs');
    const path = require('path');
    const content = `# Boost Engine Shipping - Environment Template

DEFAULT_CARRIER=shiprocket

# Shiprocket
SHIPROCKET_EMAIL=your_email@example.com
SHIPROCKET_PASSWORD=your_password
SHIPROCKET_TOKEN=optional_pregenerated_jwt
SHIPROCKET_DEFAULT_PICKUP_PINCODE=110001
SHIPROCKET_PICKUP_LOCATION_NAME=Primary Warehouse

# Delhivery
DELHIVERY_API_TOKEN=your_delhivery_api_token
DELHIVERY_DEFAULT_PICKUP_PINCODE=110001

# Shadowfax
SHADOWFAX_API_KEY=your_shadowfax_api_key
`;
    const target = path.join(process.cwd(), '.env.shipping.example');
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✅ Created environment template: ${target}`);
    console.log('Copy desired variables into your project .env file.\n');
    break;
  }

  default: {
    console.log('Usage:');
    console.log('  npx @boostengine/shipping list               - List supported carriers');
    console.log('  npx @boostengine/shipping pincode <pin>      - Test Indian pincode heuristics');
    console.log('  npx @boostengine/shipping box <weightKg>     - Suggest optimal packing box');
    console.log('  npx @boostengine/shipping init-env           - Create .env.shipping.example template');
    console.log('\nDocumentation: https://github.com/boostengine/boostengine/tree/main/packages/boost-shipping\n');
    break;
  }
}

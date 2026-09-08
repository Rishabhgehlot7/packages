#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('🚚 @boostengine/shipping - Multi-Carrier CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Logistics Carriers:\n');
    console.table([
      { name: 'Shiprocket', key: 'shiprocket', type: 'Aggregator (Delhivery, Bluedart, Shadowfax)', feature: 'Rate compare, AWB, Pickup, NDR' },
      { name: 'Delhivery', key: 'delhivery', type: 'Direct Express Network', feature: 'Surface & Express CMU, Bulk waybills' },
      { name: 'Shadowfax', key: 'shadowfax', type: 'Hyperlocal & D2C Surface', feature: 'Fast delivery & COD reconciliation' },
    ]);
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
    console.log('  npx @boostengine/shipping list      - List supported carriers');
    console.log('  npx @boostengine/shipping init-env  - Create .env.shipping.example template');
    console.log('\nDocumentation: https://github.com/boostengine/shipping\n');
    break;
  }
}

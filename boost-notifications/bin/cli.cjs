#!/usr/bin/env node

const args = process.argv.slice(2);
const command = args[0] || 'help';

console.log('\n=======================================================');
console.log('📲 @boostengine/notifications - Multi-Channel Messaging CLI');
console.log('=======================================================\n');

switch (command) {
  case 'list': {
    console.log('Supported Notification Channels & Providers:\n');
    console.table([
      { channel: 'WhatsApp', providers: 'Interakt, Wati, Gupshup, Meta Cloud API', templates: 'Order Confirmed, Tracking, Cart Recovery, OTP' },
      { channel: 'SMS', providers: 'Msg91, Fast2SMS, Twilio', templates: 'DLT SMS, Transactional OTP' },
      { channel: 'Email', providers: 'Resend, SendGrid, AWS SES', templates: 'HTML Invoices, Order Updates' },
    ]);
    break;
  }

  case 'init-env': {
    const fs = require('fs');
    const path = require('path');
    const content = `# Boost Engine Notifications - Environment Template

DEFAULT_NOTIFICATION_CHANNEL=whatsapp

# WhatsApp (Interakt / Wati / Gupshup)
INTERAKT_API_KEY=your_interakt_api_key

# SMS (Fast2SMS / Msg91)
FAST2SMS_API_KEY=your_fast2sms_key
FAST2SMS_SENDER_ID=TXTIND
FAST2SMS_DLT_TEMPLATE_ID=your_dlt_template_id

# Email (Resend)
RESEND_API_KEY=re_your_api_key
EMAIL_FROM="Boost Store <orders@yourstore.com>"
`;
    const target = path.join(process.cwd(), '.env.notifications.example');
    fs.writeFileSync(target, content, 'utf8');
    console.log(`✅ Created environment template: ${target}`);
    console.log('Copy desired variables into your project .env file.\n');
    break;
  }

  default: {
    console.log('Usage:');
    console.log('  npx @boostengine/notifications list      - List channels & providers');
    console.log('  npx @boostengine/notifications init-env  - Create .env.notifications.example');
    console.log('\nDocumentation: https://github.com/boostengine/notifications\n');
    break;
  }
}

#!/usr/bin/env node

/**
 * @boostengine/communications CLI Tool
 *
 * Test credentials, send test SMS/WhatsApp/OTP, and inspect active channels.
 */

const { comms, OmnichannelEngine } = require('../dist/index.cjs');

const args = process.argv.slice(2);
const command = args[0] || '--help';

function parseFlags(argv) {
  const flags = {};
  for (let i = 0; i < argv.length; i++) {
    const item = argv[i];
    if (item.startsWith('--')) {
      const key = item.slice(2);
      const next = argv[i + 1];
      if (next && !next.startsWith('--')) {
        flags[key] = next;
        i++;
      } else {
        flags[key] = true;
      }
    }
  }
  return flags;
}

const flags = parseFlags(args.slice(1));

async function main() {
  console.log('\n📡 @boostengine/communications CLI v1.1.0\n');

  switch (command) {
    case 'status': {
      console.log('🔍 Inspecting Active Communication Providers & Environment:');
      const env = process.env;
      const detected = [];

      if (env.D360_API_KEY) detected.push('WhatsApp (360Dialog)');
      if (env.INTERAKT_API_KEY) detected.push('WhatsApp (Interakt)');
      if (env.AISENSY_API_KEY) detected.push('WhatsApp (AiSensy)');
      if (env.WATI_API_KEY) detected.push('WhatsApp (Wati)');
      if (env.META_WA_TOKEN) detected.push('WhatsApp (Meta Cloud)');
      if (env.GUPSHUP_API_KEY) detected.push('WhatsApp/RCS (Gupshup)');

      if (env.MSG91_AUTH_KEY) detected.push('SMS/Voice (MSG91)');
      if (env.FAST2SMS_API_KEY) detected.push('SMS (Fast2SMS)');
      if (env.TWOFACTOR_API_KEY) detected.push('SMS/Voice (2Factor)');
      if (env.TWILIO_AUTH_TOKEN) detected.push('SMS/WhatsApp/Voice (Twilio)');
      if (env.EXOTEL_API_KEY) detected.push('Voice/Telephony (Exotel)');
      if (env.MCUBE_API_KEY) detected.push('Telephony (MCUBE)');
      if (env.BOLNA_API_KEY) detected.push('AI Voice Agent (Bolna AI)');

      if (env.RESEND_API_KEY) detected.push('Email (Resend)');
      if (env.SENDGRID_API_KEY) detected.push('Email (SendGrid)');

      if (detected.length === 0) {
        console.log('  ⚠️  No provider API keys detected in environment variables.');
        console.log('  💡 Tip: Set environment keys like MSG91_AUTH_KEY, INTERAKT_API_KEY, RESEND_API_KEY, etc.\n');
      } else {
        console.log('  ✅ Configured Channels:');
        detected.forEach((d) => console.log(`     • ${d}`));
        console.log('');
      }
      break;
    }

    case 'send-sms': {
      if (!flags.to || !flags.msg) {
        console.error('❌ Error: Missing required flags. Usage: npx boost-comms send-sms --to +919876543210 --msg "Hello World"');
        process.exit(1);
      }
      console.log(`📤 Sending SMS to ${flags.to}...`);
      try {
        const res = await comms.quickSMS(flags.to, flags.msg);
        console.log('Result:', JSON.stringify(res, null, 2));
      } catch (err) {
        console.error('❌ Failed:', err.message);
      }
      break;
    }

    case 'send-wa': {
      if (!flags.to || (!flags.template && !flags.msg)) {
        console.error('❌ Error: Missing required flags. Usage: npx boost-comms send-wa --to +919876543210 --template order_confirmed');
        process.exit(1);
      }
      console.log(`📤 Sending WhatsApp to ${flags.to}...`);
      try {
        const res = await comms.quickWhatsApp(flags.to, flags.template || flags.msg);
        console.log('Result:', JSON.stringify(res, null, 2));
      } catch (err) {
        console.error('❌ Failed:', err.message);
      }
      break;
    }

    case 'send-otp': {
      if (!flags.to) {
        console.error('❌ Error: Missing --to. Usage: npx boost-comms send-otp --to +919876543210');
        process.exit(1);
      }
      console.log(`🔐 Dispatching Smart OTP to ${flags.to}...`);
      try {
        const res = await comms.otp.sendSmartOTP({
          phone: flags.to,
          length: Number(flags.len) || 6,
          customerName: flags.name || 'User',
        });
        console.log('Result:', JSON.stringify(res, null, 2));
      } catch (err) {
        console.error('❌ Failed:', err.message);
      }
      break;
    }

    case 'verify-otp': {
      if (!flags.to || !flags.otp || !flags.token) {
        console.error('❌ Error: Missing flags. Usage: npx boost-comms verify-otp --to +919876543210 --otp 123456 --token <token>');
        process.exit(1);
      }
      console.log(`🔍 Verifying OTP for ${flags.to}...`);
      try {
        const res = comms.otp.verifyOTP({
          phone: flags.to,
          otp: flags.otp,
          token: flags.token,
        });
        console.log('Result:', JSON.stringify(res, null, 2));
      } catch (err) {
        console.error('❌ Failed:', err.message);
      }
      break;
    }

    case 'send-order': {
      if (!flags.to || !flags.order || !flags.amount) {
        console.error('❌ Error: Missing flags. Usage: npx boost-comms send-order --to +919876543210 --order ORD1001 --amount 1499 --name Rahul');
        process.exit(1);
      }
      console.log(`📦 Sending Order Confirmation to ${flags.to}...`);
      try {
        const res = await comms.sendOrderConfirmation({
          phone: flags.to,
          customerName: flags.name || 'Customer',
          orderId: flags.order,
          amount: Number(flags.amount),
          trackingUrl: flags.tracking,
        });
        console.log('Result:', JSON.stringify(res, null, 2));
      } catch (err) {
        console.error('❌ Failed:', err.message);
      }
      break;
    }

    case '--help':
    default: {
      console.log('Available Commands:');
      console.log('  status                                      Inspect active providers and detected environment variables');
      console.log('  send-sms    --to <phone> --msg <text>       Send test SMS');
      console.log('  send-wa     --to <phone> --template <name>  Send WhatsApp template or text');
      console.log('  send-otp    --to <phone> [--len 6]          Dispatch smart OTP with automatic multi-tier fallback');
      console.log('  verify-otp  --to <phone> --otp <c> --token  Cryptographically verify OTP token');
      console.log('  send-order  --to <phone> --order <id>       Send order confirmation notification');
      console.log('              --amount <amt> --name <name>\n');
      break;
    }
  }
}

main().catch((err) => {
  console.error('Fatal CLI Error:', err);
  process.exit(1);
});

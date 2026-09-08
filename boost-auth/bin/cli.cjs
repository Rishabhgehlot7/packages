#!/usr/bin/env node
const crypto = require('crypto');

console.log('\n🚀 @boostengine/auth - 1-Click Identity & Phone OTP Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'generate-secret') {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('🔑 Generated Secure Auth Secret (Add this to your .env file):');
  console.log(`\n  BOOST_AUTH_SECRET=${secret}\n`);
} else if (command === 'demo') {
  const { BoostAuth } = require('../dist/index.cjs');
  const secret = 'demo-super-secret-key-32-chars-long';
  const auth = new BoostAuth({ secret });

  console.log('📱 1. Simulating OTP Request for +919876543210:');
  const otpRes = auth.generateOTP({ phone: '+919876543210' });
  console.log(`   Generated OTP: ${otpRes.otp}`);
  console.log(`   Stateless Token: ${otpRes.verificationToken.slice(0, 32)}...`);

  console.log('\n🔒 2. Verifying OTP:');
  const verifyRes = auth.verifyOTP({
    phone: '+919876543210',
    otp: otpRes.otp,
    verificationToken: otpRes.verificationToken,
  });
  console.log(`   Verification result: ${verifyRes.success ? 'SUCCESS ✅' : 'FAILED ❌'}`);

  console.log('\n🍪 3. Creating Authenticated Session Cookie:');
  const session = auth.createSession({
    id: 'usr_demo_101',
    phone: '+919876543210',
    role: 'customer',
  });
  console.log(`   JWT Token: ${session.token.slice(0, 40)}...`);
  console.log(`   Set-Cookie: ${session.cookie.headerString}\n`);
} else {
  console.log('Usage:');
  console.log('  npx @boostengine/auth generate-secret  Generate high-entropy random secret for .env');
  console.log('  npx @boostengine/auth demo             Run interactive stateless auth & session simulation');
  console.log('  npx @boostengine/auth help             Show help information\n');
}

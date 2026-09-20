#!/usr/bin/env node
const crypto = require('crypto');

console.log('\n🚀 @boostengine/auth - Universal Multi-Platform Identity Engine');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

const args = process.argv.slice(2);
const command = args[0] || 'help';

if (command === 'generate-secret') {
  const secret = crypto.randomBytes(32).toString('hex');
  console.log('🔑 Generated Secure Auth Secret (Add this to your .env file):');
  console.log(`\n  BOOST_AUTH_SECRET=${secret}\n`);
} else if (command === 'schema') {
  const target = args[1] || 'prisma';
  if (target === 'prisma') {
    console.log('📄 Prisma Schema for @boostengine/auth (schema.prisma):\n');
    console.log(`
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  phone         String?   @unique
  image         String?
  role          String    @default("customer")
  emailVerified DateTime?
  phoneVerified DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  provider          String
  providerAccountId String
  refreshToken      String?
  accessToken       String?
  expiresAt         Int?
  tokenType         String?
  scope             String?
  idToken           String?
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id        String   @id @default(cuid())
  userId    String
  token     String   @unique
  expiresAt DateTime
  ipAddress String?
  userAgent String?
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}
`);
  } else if (target === 'drizzle') {
    console.log('📄 Drizzle Schema for @boostengine/auth (schema.ts):\n');
    console.log(`
import { pgTable, text, timestamp, integer } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: text('id').primaryKey(),
  name: text('name'),
  email: text('email').unique(),
  phone: text('phone').unique(),
  image: text('image'),
  role: text('role').default('customer'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const accounts = pgTable('accounts', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  provider: text('provider').notNull(),
  providerAccountId: text('provider_account_id').notNull(),
  refreshToken: text('refresh_token'),
  accessToken: text('access_token'),
  expiresAt: integer('expires_at'),
  tokenType: text('token_type'),
  scope: text('scope'),
  idToken: text('id_token'),
});

export const sessions = pgTable('sessions', {
  id: text('id').primaryKey(),
  userId: text('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  token: text('token').notNull().unique(),
  expiresAt: timestamp('expires_at').notNull(),
  ipAddress: text('ip_address'),
  userAgent: text('user_agent'),
});
`);
  }
} else if (command === 'demo') {
  let BoostAuth;
  try {
    const pkg = require('../dist/index.cjs');
    BoostAuth = pkg.BoostAuth;
  } catch {
    console.log('⚠️ Build first with: npm run build');
    process.exit(1);
  }

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
  console.log('  npx @boostengine/auth generate-secret     Generate high-entropy random secret for .env');
  console.log('  npx @boostengine/auth schema [prisma|drizzle] Print starter DB schemas for adapters');
  console.log('  npx @boostengine/auth demo                Run interactive stateless auth & session simulation');
  console.log('  npx @boostengine/auth help                Show help information\n');
}

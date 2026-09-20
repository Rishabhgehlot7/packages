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
} else if (command === 'init') {
  const readline = require('readline');
  const fs = require('fs');
  const path = require('path');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const question = (query) => new Promise((resolve) => rl.question(query, resolve));

  async function runInit() {
    console.log('✨ Welcome to the @boostengine/auth Project Setup Wizard!\n');

    const framework = (await question('1. Select Framework (nextjs / express) [nextjs]: ')).trim().toLowerCase() || 'nextjs';
    const db = (await question('2. Select Database (stateless / prisma / mongodb / drizzle) [stateless]: ')).trim().toLowerCase() || 'stateless';
    const useComms = (await question('3. Use @boostengine/communications for Multi-tier WhatsApp/SMS OTP? (yes / no) [yes]: ')).trim().toLowerCase() !== 'no';

    const secret = crypto.randomBytes(32).toString('hex');

    // 1. Write or append to .env
    const envPath = path.join(process.cwd(), '.env');
    let envContent = '';
    if (fs.existsSync(envPath)) {
      envContent = fs.readFileSync(envPath, 'utf-8');
    }
    if (!envContent.includes('BOOST_AUTH_SECRET=')) {
      fs.appendFileSync(envPath, `\n# @boostengine/auth Secret\nBOOST_AUTH_SECRET=${secret}\n`);
      console.log('  ✅ Appended BOOST_AUTH_SECRET to .env');
    }

    // 2. Generate lib/auth.ts
    const libDir = path.join(process.cwd(), 'lib');
    if (!fs.existsSync(libDir)) {
      fs.mkdirSync(libDir, { recursive: true });
    }

    let adapterImport = '';
    let adapterConfig = '';
    if (db === 'prisma') {
      adapterImport = "import { prismaAdapter } from '@boostengine/auth/adapters';\nimport { prisma } from './prisma';\n";
      adapterConfig = "  adapter: prismaAdapter(prisma),\n";
    } else if (db === 'mongodb') {
      adapterImport = "import { mongodbAdapter } from '@boostengine/auth/adapters';\n";
      adapterConfig = "  // adapter: mongodbAdapter(db),\n";
    } else if (db === 'drizzle') {
      adapterImport = "import { drizzleAdapter } from '@boostengine/auth/adapters';\n";
      adapterConfig = "  // adapter: drizzleAdapter(db, schema, { eq, and }),\n";
    }

    let commsImport = useComms ? "  BoostCommunicationsProvider,\n" : "";
    let commsProvider = useComms ? "    BoostCommunicationsProvider(), // Auto fallback: WhatsApp -> SMS -> Voice\n" : "    PhoneOtpProvider(),\n";

    const authFileContent = `import {
  createBoostAuth,
  GoogleProvider,
  GitHubProvider,
${commsImport}} from '@boostengine/auth';
${adapterImport}
export const auth = createBoostAuth({
  secret: process.env.BOOST_AUTH_SECRET!,
${adapterConfig}  providers: [
${commsProvider}    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
});
`;

    const authFilePath = path.join(libDir, 'auth.ts');
    fs.writeFileSync(authFilePath, authFileContent, 'utf-8');
    console.log('  ✅ Created lib/auth.ts');

    // 3. If Next.js, create App Router handler
    if (framework === 'nextjs') {
      const routeDir = path.join(process.cwd(), 'app', 'api', 'auth', '[...boost]');
      fs.mkdirSync(routeDir, { recursive: true });
      const routeContent = `import { toNextJsHandler } from '@boostengine/auth';
import { auth } from '@/lib/auth';

export const { GET, POST } = toNextJsHandler(auth);
`;
      fs.writeFileSync(path.join(routeDir, 'route.ts'), routeContent, 'utf-8');
      console.log('  ✅ Created app/api/auth/[...boost]/route.ts');
    }

    console.log('\n🎉 Setup Complete! You are ready to authenticate users with @boostengine/auth.');
    console.log('\nNext steps:');
    if (useComms) {
      console.log('  1. npm install @boostengine/communications (for omnichannel OTPs)');
    }
    console.log('  2. Start your development server: npm run dev\n');

    rl.close();
  }

  runInit();
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
  console.log('  npx @boostengine/auth init                Interactive 30-second project setup wizard');
  console.log('  npx @boostengine/auth generate-secret     Generate high-entropy random secret for .env');
  console.log('  npx @boostengine/auth schema [prisma|drizzle] Print starter DB schemas for adapters');
  console.log('  npx @boostengine/auth demo                Run interactive stateless auth & session simulation');
  console.log('  npx @boostengine/auth help                Show help information\n');
}

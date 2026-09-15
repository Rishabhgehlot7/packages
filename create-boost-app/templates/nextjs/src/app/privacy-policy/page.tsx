import Link from 'next/link';
import Setting from '@/models/Setting';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function PrivacyPolicyPage() {
  let policy = '';
  try {
    await dbConnect();
    const settings = await Setting.findOne().lean();
    policy = (settings as any)?.privacyPolicy || '';
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-8">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-3">
          Privacy Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {policy || (
          <div className="space-y-4 text-gray-600">
            <p>
              We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, disclose, and safeguard your information when you visit our website or make a purchase.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">1. Information We Collect</h3>
            <p>
              We collect information that you provide directly to us when creating an account, making a purchase, subscribing to marketing communications, or contacting customer support. This includes your name, shipping address, billing address, phone number, and email.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">2. How We Use Your Information</h3>
            <p>
              We use personal information to fulfill orders, process payments via secure gateways, provide shipping tracking, prevent fraudulent transactions, and send order updates.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">3. Security</h3>
            <p>
              All payment transactions are encrypted using industry-standard SSL technology. We do not store full credit/debit card numbers on our servers.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

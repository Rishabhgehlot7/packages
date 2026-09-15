import Link from 'next/link';
import Setting from '@/models/Setting';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function TermsConditionsPage() {
  let terms = '';
  try {
    await dbConnect();
    const settings = await Setting.findOne().lean();
    terms = (settings as any)?.termsAndConditions || '';
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-8">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-3">
          Terms & Conditions
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {terms || (
          <div className="space-y-4 text-gray-600">
            <p>
              Welcome to our online store. By browsing and placing an order on our platform, you agree to comply with and be bound by the following terms and conditions of use.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">1. General Conditions</h3>
            <p>
              We reserve the right to refuse service to anyone for any legitimate reason at any time. Prices for our products are subject to change without notice.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">2. Accuracy of Billing and Account Information</h3>
            <p>
              You agree to provide current, complete, and accurate purchase and account information for all purchases made at our store. You agree to promptly update your account and other information, including your email address and phone number.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">3. Governing Law</h3>
            <p>
              These Terms of Service and any separate agreements shall be governed by and construed in accordance with the laws of India.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

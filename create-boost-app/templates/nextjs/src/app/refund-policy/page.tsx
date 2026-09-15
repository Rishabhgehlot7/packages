import Link from 'next/link';
import Setting from '@/models/Setting';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function RefundPolicyPage() {
  let refundPolicy = '';
  try {
    await dbConnect();
    const settings = await Setting.findOne().lean();
    refundPolicy = (settings as any)?.refundPolicy || '';
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-8">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-3">
          Cancellation & Refund Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {refundPolicy || (
          <div className="space-y-4 text-gray-600">
            <p>
              We strive to ensure complete customer satisfaction. If you are not entirely satisfied with your purchase, we're here to help.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">1. Return Window</h3>
            <p>
              You have 7 calendar days to initiate a return or exchange for an item from the date you received it. To be eligible for a return, your item must be unused, unwashed, and in the same condition that you received it with original tags intact.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">2. Refunds Process</h3>
            <p>
              Once we receive your returned item, our inspection team will inspect it and notify you of the status of your refund. If your return is approved, we will initiate a refund to your original method of payment within 5-7 business days.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">3. Damaged or Defective Goods</h3>
            <p>
              If your item arrived damaged or defective, you may raise a warranty claim or contact us directly via WhatsApp / Email with photos within 48 hours of delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

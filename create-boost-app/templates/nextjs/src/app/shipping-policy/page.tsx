import Link from 'next/link';
import Setting from '@/models/Setting';
import { dbConnect } from '@/lib/db';

export const dynamic = 'force-dynamic';

export default async function ShippingPolicyPage() {
  let shippingPolicy = '';
  try {
    await dbConnect();
    const settings = await Setting.findOne().lean();
    shippingPolicy = (settings as any)?.shippingPolicy || '';
  } catch (e) {}

  return (
    <div className="max-w-4xl mx-auto px-4 py-12 min-h-[70vh]">
      <div className="mb-8">
        <Link href="/" className="text-xs font-semibold text-gray-500 hover:text-black uppercase tracking-wider">
          ← Back to Home
        </Link>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-950 mt-3">
          Shipping & Delivery Policy
        </h1>
        <p className="text-xs text-gray-400 mt-1">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose max-w-none text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">
        {shippingPolicy || (
          <div className="space-y-4 text-gray-600">
            <p>
              We are dedicated to delivering your orders as quickly and reliably as possible across India.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">1. Order Processing Time</h3>
            <p>
              All orders are processed within 24 to 48 hours of confirmation (excluding Sundays and national holidays). You will receive an SMS and Email notification with live tracking once your package is dispatched.
            </p>
            <h3 className="text-base font-bold text-gray-900 mt-4">2. Estimated Delivery Time</h3>
            <ul className="list-disc pl-5 space-y-1">
              <li>Metro Cities (Delhi NCR, Mumbai, Bengaluru, Hyderabad, Chennai, Kolkata): 2-4 business days.</li>
              <li>Rest of India: 4-7 business days.</li>
              <li>North-East & Remote Locations: 6-9 business days.</li>
            </ul>
            <h3 className="text-base font-bold text-gray-900 mt-4">3. Shipping Charges</h3>
            <p>
              We offer Free Shipping on prepaid orders above ₹999 across all serviceable pincodes. Standard shipping of ₹99 applies on smaller orders.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

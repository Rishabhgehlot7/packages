import nodemailer, { type Transporter } from 'nodemailer';

const user = process.env.EMAIL_USER;
const pass = process.env.EMAIL_PASS;

let transporter: Transporter | null = null;

if (user && pass) {
  transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user,
      pass,
    },
  });
}

export async function sendOrderConfirmationEmail(order: {
  orderNumber: string;
  customer: { name: string; email: string };
  items: Array<{ title: string; price: number; quantity: number; image?: string }>;
  total: number;
  paymentMethod: string;
  shippingAddress: { line1: string; city: string; state: string; pincode: string };
}) {
  if (!transporter || !user) {
    console.warn('⚠️ EMAIL_USER or EMAIL_PASS not configured. Skipping email delivery.');
    return false;
  }

  const itemsHtml = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
          ${item.image ? `<img src="${item.image}" alt="${item.title}" style="width: 48px; height: 48px; object-fit: cover; border-radius: 6px;" />` : ''}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; font-weight: 600; color: #111827;">
          ${item.title}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; color: #4b5563;">
          ${item.quantity}
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 700; color: #111827;">
          ₹${(item.price * item.quantity).toLocaleString('en-IN')}
        </td>
      </tr>`
    )
    .join('');

  const html = `
    <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
      <div style="background: #0f172a; padding: 24px; text-align: center;">
        <h1 style="color: #fbbf24; margin: 0; font-size: 22px; text-transform: uppercase; letter-spacing: 1.5px;">Order Confirmed</h1>
        <p style="color: #94a3b8; margin: 6px 0 0 0; font-size: 13px;">Order #${order.orderNumber}</p>
      </div>

      <div style="padding: 24px;">
        <p style="font-size: 15px; color: #1e293b;">Hi <strong>${order.customer.name}</strong>,</p>
        <p style="font-size: 14px; color: #475569; line-height: 1.5;">
          Thank you for choosing Boost Store! We have received your order and our fulfillment warehouse has begun packing it.
        </p>

        <table style="width: 100%; border-collapse: collapse; margin-top: 18px;">
          <thead>
            <tr style="background: #f8fafc; text-align: left; font-size: 11px; text-transform: uppercase; color: #64748b;">
              <th style="padding: 10px;">Item</th>
              <th style="padding: 10px;">Description</th>
              <th style="padding: 10px; text-align: center;">Qty</th>
              <th style="padding: 10px; text-align: right;">Amount</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>

        <div style="margin-top: 20px; padding: 16px; background: #f8fafc; border-radius: 8px;">
          <div style="display: flex; justify-content: space-between; font-size: 16px; font-weight: 800; color: #0f172a;">
            <span>Total Payable:</span>
            <span style="color: #2563eb;">₹${order.total.toLocaleString('en-IN')}</span>
          </div>
          <p style="margin: 8px 0 0 0; font-size: 12px; color: #64748b;">
            Payment Method: <strong style="text-transform: uppercase;">${order.paymentMethod}</strong>
          </p>
        </div>

        <div style="margin-top: 20px; font-size: 13px; color: #475569;">
          <strong>Shipping To:</strong><br />
          ${order.shippingAddress.line1}, ${order.shippingAddress.city}, ${order.shippingAddress.state} - ${order.shippingAddress.pincode}
        </div>
      </div>

      <div style="background: #f1f5f9; padding: 16px; text-align: center; font-size: 12px; color: #94a3b8;">
        &copy; ${new Date().getFullYear()} Boost D2C Store. All rights reserved.
      </div>
    </div>
  `;

  try {
    await transporter.sendMail({
      from: `"Boost Store" <${user}>`,
      to: order.customer.email,
      subject: `Order Confirmed: #${order.orderNumber}`,
      html,
    });
    console.log(`✉️ Confirmation email sent to ${order.customer.email}`);
    return true;
  } catch (error) {
    console.error('Error sending confirmation email:', error);
    return false;
  }
}

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Order from '@/models/Order';
import { db } from '@/data/db';
import { InvoiceGenerator, InvoiceData } from '@boostengine/invoicing';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    let orderData: any = null;

    // Check MongoDB first
    try {
      const conn = await dbConnect();
      if (conn && Order) {
        orderData = await Order.findOne({
          $or: [{ id }, { orderNumber: id }],
        }).lean();
      }
    } catch (e) {
      // Fallback
    }

    if (!orderData) {
      orderData = db.getOrderById(id);
    }

    if (!orderData) {
      return new Response('<h3>Order not found</h3>', {
        status: 404,
        headers: { 'Content-Type': 'text/html' },
      });
    }

    const sellerName = process.env.BUSINESS_NAME || 'Urban D2C Brand India Pvt Ltd';
    const sellerGstin = process.env.GST_NUMBER || '07AAAAA0000A1Z5';

    const invoicePayload: InvoiceData = {
      invoiceNumber: `INV-${orderData.orderNumber || orderData.id.slice(-6).toUpperCase()}`,
      invoiceDate: new Date(orderData.createdAt || Date.now()).toISOString().split('T')[0],
      orderId: orderData.orderNumber || orderData.id,
      orderDate: new Date(orderData.createdAt || Date.now()).toISOString().split('T')[0],
      paymentMethod: orderData.paymentMethod?.toLowerCase() === 'cod' ? 'COD' : 'PREPAID',
      paymentTxnId: orderData.paymentMethod !== 'cod' ? `TXN-${orderData.id.slice(0, 8)}` : undefined,
      seller: {
        name: sellerName,
        tradeName: sellerName,
        gstin: sellerGstin,
        address: 'Plot 42, Okhla Industrial Area Phase III',
        city: 'New Delhi',
        state: 'Delhi',
        pincode: '110020',
        phone: '+91 98765 43210',
        email: 'billing@boostengine.dev',
      },
      buyer: {
        name: orderData.customer?.name || 'Valued Customer',
        address: orderData.customer?.address?.line1 || 'Main Street, Flat 101',
        city: orderData.customer?.address?.city || 'Bengaluru',
        state: orderData.customer?.address?.state || 'Karnataka',
        pincode: orderData.customer?.address?.pincode || '560001',
        phone: orderData.customer?.phone || '+91 98765 00000',
        email: orderData.customer?.email,
      },
      items: (orderData.items || []).map((item: any) => ({
        name: item.title,
        sku: item.sku || 'SKU-GEN',
        hsn: '6109',
        quantity: item.quantity || 1,
        unitPrice: item.price || 999,
        discount: 0,
        taxRate: 18,
      })),
      shippingFee: orderData.shipping || 0,
      termsAndConditions: [
        'All disputes are subject to local jurisdiction only.',
        'Items can be returned within 7 days in original condition.',
        'This is a computer-generated tax invoice and requires no physical signature.',
      ],
    };

    let html = InvoiceGenerator.generateTaxInvoiceHtml(invoicePayload);

    // Auto-trigger browser print dialog on load
    html += `\n<script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
        }, 300);
      };
    </script>`;

    return new Response(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
      },
    });
  } catch (err: any) {
    console.error('Invoice generation error:', err);
    return new Response(`<h3>Failed to generate invoice: ${err.message}</h3>`, {
      status: 500,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

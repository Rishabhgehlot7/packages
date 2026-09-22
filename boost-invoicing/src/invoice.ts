import {
  BillOfSupplyData,
  BoostCartLike,
  BusinessEntity,
  CreditNoteData,
  CustomerEntity,
  InvoiceData,
  NonGstInvoiceData,
  ProformaInvoiceData,
  ShippingLabelData,
  ThermalReceiptData,
} from './types';
import { numberToIndianWords, generateBarcodeSvg } from './utils';
import { determineTaxType, resolveStateCode } from './gst';
import { calculateGstBreakdown } from './tax';
import { renderHtmlToPdfBuffer, downloadPdfInBrowser, PdfRendererOptions } from './pdf';

export class InvoiceGenerator {
  /**
   * Generates a fully compliant, print-ready Indian GST Tax Invoice HTML (A4)
   */
  static generateTaxInvoiceHtml(data: InvoiceData): string {
    const sellerGstin = data.seller.gstin || '';
    const buyerGstin = data.buyer.gstin || '';
    const taxResolution = determineTaxType(
      sellerGstin || data.seller.state,
      buyerGstin || data.buyer.state
    );
    const isIntraState = taxResolution.isIntraState;

    const shippingFee = data.shippingFee || 0;
    const taxCalc = calculateGstBreakdown(data.items, shippingFee, {
      taxMode: data.taxMode || 'INCLUSIVE',
      isIntraState,
    });

    const grandTotal = taxCalc.grandTotal;
    const amountInWords = numberToIndianWords(grandTotal);

    const lineItemsHtml = taxCalc.items
      .map(
        (item, index) => `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong>
          ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ''}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.taxableAmount.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${isIntraState ? `₹${(item.cgst + item.sgst).toFixed(2)} (${item.taxRate}%)` : `₹${item.igst.toFixed(2)} (${item.taxRate}%)`}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${item.lineTotal.toFixed(2)}</td>
      </tr>`
      )
      .join('\n');

    const hsnRowsHtml = Object.values(taxCalc.hsnSummary)
      .map(
        (h) => `<tr>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: center;">${h.hsn}</td>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">₹${h.taxableAmount.toFixed(2)}</td>
        ${
          isIntraState
            ? `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">₹${h.cgst.toFixed(2)} (${h.rate / 2}%)</td>
               <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">₹${h.sgst.toFixed(2)} (${h.rate / 2}%)</td>`
            : `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;" colspan="2">₹${h.igst.toFixed(2)} (${h.rate}%)</td>`
        }
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right; font-weight: 600;">₹${h.totalTax.toFixed(2)}</td>
      </tr>`
      )
      .join('\n');

    const shippingAddr = data.shippingAddress || data.buyer;
    const sellerStateCode = taxResolution.sellerStateCode || resolveStateCode(data.seller.state) || '';
    const buyerStateCode = taxResolution.buyerStateCode || resolveStateCode(shippingAddr.state) || '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Tax Invoice - ${data.invoiceNumber}</title>
  <style>
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 0; padding: 24px; background: #fff; line-height: 1.4; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    .btn-print { background: #2563eb; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>

  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        ${data.seller.logoUrl ? `<img src="${data.seller.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 8px;" />` : ''}
        <h1 style="margin: 0 0 4px 0; font-size: 22px; color: #1e3a8a;">${data.seller.tradeName || data.seller.name}</h1>
        <div style="color: #4b5563; font-size: 12px;">${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${sellerGstin ? `<div style="font-weight: 600; margin-top: 4px;">GSTIN: <span style="font-family: monospace;">${sellerGstin}</span> ${sellerStateCode ? `(State Code: ${sellerStateCode})` : ''}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0 0 6px 0; font-size: 18px; color: #2563eb; text-transform: uppercase;">TAX INVOICE</h2>
        <div style="font-weight: 600;">Invoice No: ${data.invoiceNumber}</div>
        <div>Date: ${data.invoiceDate}</div>
        <div>Order ID: #${data.orderId}</div>
        <div style="display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${data.paymentMethod === 'PREPAID' ? '#dcfce7; color: #166534;' : '#fef3c7; color: #92400e;'}">
          ${data.paymentMethod}
        </div>
      </div>
    </div>

    <!-- Bill To / Ship To -->
    <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px;">
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Billed To:</div>
        <div style="font-weight: 600;">${data.buyer.name}</div>
        <div>${data.buyer.address}</div>
        <div>${data.buyer.city}, ${data.buyer.state} - ${data.buyer.pincode}</div>
        <div>Phone: ${data.buyer.phone}</div>
        ${data.buyer.gstin ? `<div style="margin-top: 4px; font-weight: 600; color: #1e40af;">Buyer GSTIN: ${data.buyer.gstin}</div>` : ''}
      </div>
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Shipped To:</div>
        <div style="font-weight: 600;">${shippingAddr.name}</div>
        <div>${shippingAddr.address}</div>
        <div>${shippingAddr.city}, ${shippingAddr.state} - ${shippingAddr.pincode}</div>
        <div>Phone: ${shippingAddr.phone}</div>
        <div>Place of Supply: <strong>${shippingAddr.state}</strong> ${buyerStateCode ? `(Code: ${buyerStateCode})` : ''} [${isIntraState ? 'Intra-State: CGST+SGST' : 'Inter-State: IGST'}]</div>
      </div>
    </div>

    <!-- Items Table -->
    <table style="margin-bottom: 20px;">
      <thead>
        <tr style="background: #f3f4f6; font-size: 12px; color: #374151;">
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center; width: 30px;">#</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: left;">Item Description</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center;">HSN</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center;">Qty</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Rate</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Taxable</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Tax</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Total</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml}
      </tbody>
    </table>

    <!-- Totals Breakdown & Words -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div style="flex: 1; padding-right: 24px;">
        <div style="font-size: 11px; color: #4b5563; font-weight: 600; text-transform: uppercase;">Amount in Words:</div>
        <div style="font-weight: 600; color: #1e3a8a; margin-top: 2px;">${amountInWords}</div>
        ${
          data.seller.bankDetails
            ? `<div style="margin-top: 12px; font-size: 11px; background: #eff6ff; padding: 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
            <strong>Bank Transfer Details:</strong><br />
            Bank: ${data.seller.bankDetails.bankName} | A/C: ${data.seller.bankDetails.accountNumber} | IFSC: ${data.seller.bankDetails.ifsc}
            ${data.seller.bankDetails.upiId ? `<br />UPI ID: <strong>${data.seller.bankDetails.upiId}</strong>` : ''}
          </div>`
            : ''
        }
      </div>
      <div style="width: 280px; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Taxable Subtotal:</span>
          <span>₹${taxCalc.subtotalTaxable.toFixed(2)}</span>
        </div>
        ${
          isIntraState
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>CGST:</span>
              <span>₹${taxCalc.cgstTotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>SGST:</span>
              <span>₹${taxCalc.sgstTotal.toFixed(2)}</span>
            </div>`
            : `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>IGST:</span>
              <span>₹${taxCalc.igstTotal.toFixed(2)}</span>
            </div>`
        }
        ${
          shippingFee > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Shipping Fee:</span>
          <span>₹${shippingFee.toFixed(2)}</span>
        </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #d1d5db; font-size: 15px; font-weight: 700; color: #1e3a8a;">
          <span>Grand Total:</span>
          <span>₹${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <!-- HSN Tax Summary Table -->
    <div style="margin-bottom: 24px;">
      <div style="font-size: 11px; font-weight: 600; color: #4b5563; text-transform: uppercase; margin-bottom: 6px;">HSN / Tax Summary:</div>
      <table style="font-size: 12px;">
        <thead>
          <tr style="background: #f3f4f6;">
            <th style="padding: 6px; border: 1px solid #d1d5db;">HSN Code</th>
            <th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">Taxable Amount</th>
            ${
              isIntraState
                ? `<th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">CGST</th>
                   <th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">SGST</th>`
                : `<th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;" colspan="2">IGST</th>`
            }
            <th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">Total Tax</th>
          </tr>
        </thead>
        <tbody>
          ${hsnRowsHtml}
        </tbody>
      </table>
    </div>

    <!-- Signatory & Terms -->
    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 11px; color: #6b7280; max-width: 450px;">
        <strong>Terms & Conditions:</strong>
        <ul style="margin: 4px 0 0 0; padding-left: 16px;">
          ${(data.termsAndConditions || [
            `All disputes are subject to ${data.seller.city} jurisdiction.`,
            'Goods once sold can be returned/exchanged as per store return policy.',
          ])
            .map((t) => `<li>${t}</li>`)
            .join('')}
        </ul>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600; margin-bottom: 20px;">For ${data.seller.tradeName || data.seller.name}</div>
        ${data.seller.signatureUrl ? `<img src="${data.seller.signatureUrl}" alt="Signature" style="max-height: 40px; margin-bottom: 4px;" /><br/>` : ''}
        <div style="border-top: 1px dashed #9ca3af; padding-top: 4px; font-size: 11px; color: #4b5563;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generates a legal Bill of Supply HTML (Rule 49 of CGST Rules) for Composition Dealers or Exempt items
   */
  static generateBillOfSupplyHtml(data: BillOfSupplyData): string {
    let subtotal = 0;
    let totalDiscount = 0;

    const lineItemsHtml = data.items
      .map((item, index) => {
        const itemDiscount = item.discount || 0;
        const lineTotal = Math.round((item.quantity * item.unitPrice - itemDiscount) * 100) / 100;
        subtotal += lineTotal;
        totalDiscount += itemDiscount;

        return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong>
            ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ''}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn || 'N/A'}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${lineTotal.toFixed(2)}</td>
        </tr>`;
      })
      .join('\n');

    const shippingFee = data.shippingFee || 0;
    const grandTotal = Math.round((subtotal + shippingFee) * 100) / 100;
    const amountInWords = numberToIndianWords(grandTotal);
    const declaration =
      data.compositionSchemeDeclaration ||
      'Composition taxable person, not eligible to collect tax on supplies.';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Bill of Supply - ${data.invoiceNumber}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 0; padding: 24px; background: #fff; line-height: 1.4; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    .btn-print { background: #059669; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Print Bill of Supply</button>
  </div>
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        <h1 style="margin: 0; color: #065f46; font-size: 22px;">${data.seller.tradeName || data.seller.name}</h1>
        <div>${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.gstin ? `<div><strong>GSTIN:</strong> ${data.seller.gstin}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #059669; text-transform: uppercase;">BILL OF SUPPLY</h2>
        <div><strong>Bill No:</strong> ${data.invoiceNumber}</div>
        <div><strong>Date:</strong> ${data.invoiceDate}</div>
        <div>Order #: ${data.orderId}</div>
      </div>
    </div>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; font-weight: 600; color: #065f46;">
      ⚖️ Declaration: ${declaration}
    </div>
    <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px;">
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px;">
        <strong>Billed To:</strong><br/>
        ${data.buyer.name}<br/>
        ${data.buyer.address}, ${data.buyer.city}, ${data.buyer.state} - ${data.buyer.pincode}<br/>
        Phone: ${data.buyer.phone}
      </div>
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px;">
        <strong>Shipped To:</strong><br/>
        ${(data.shippingAddress || data.buyer).name}<br/>
        ${(data.shippingAddress || data.buyer).address}, ${(data.shippingAddress || data.buyer).city} - ${(data.shippingAddress || data.buyer).pincode}
      </div>
    </div>
    <table style="margin-bottom: 20px;">
      <thead>
        <tr style="background: #f3f4f6;">
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; width: 30px;">#</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: left;">Item Description</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center;">HSN</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center;">Qty</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Unit Price</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml}
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px;">
      <div>
        <strong>Amount in Words:</strong><br/>
        <span style="color: #065f46; font-weight: 600;">${amountInWords}</span>
      </div>
      <div style="width: 250px; background: #f9fafb; padding: 12px; border-radius: 6px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Subtotal:</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        ${shippingFee > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Shipping:</span><span>₹${shippingFee.toFixed(2)}</span></div>` : ''}
        <div style="display: flex; justify-content: space-between; border-top: 2px solid #d1d5db; padding-top: 6px; font-weight: bold; font-size: 15px; color: #065f46;">
          <span>Net Payable:</span>
          <span>₹${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generates a Non-GST / Retail Invoice / Cash Memo HTML for unregistered sellers or non-GST transactions
   */
  static generateNonGstInvoiceHtml(data: NonGstInvoiceData): string {
    let subtotal = 0;
    let totalDiscount = data.discountAmount || 0;

    const lineItemsHtml = data.items
      .map((item, index) => {
        const itemDiscount = item.discount || 0;
        const lineTotal = Math.round((item.quantity * item.unitPrice - itemDiscount) * 100) / 100;
        subtotal += lineTotal;
        totalDiscount += itemDiscount;

        return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong>
            ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ''}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">₹${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">₹${lineTotal.toFixed(2)}</td>
        </tr>`;
      })
      .join('\n');

    const shippingFee = data.shippingFee || 0;
    const grandTotal = Math.round((subtotal + shippingFee - (data.discountAmount || 0)) * 100) / 100;
    const amountInWords = numberToIndianWords(grandTotal);
    const invoiceTitle = data.invoiceTitle || 'RETAIL INVOICE';
    const shippingAddr = data.shippingAddress || data.buyer;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${invoiceTitle} - ${data.invoiceNumber}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 0; padding: 24px; background: #fff; line-height: 1.4; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    .btn-print { background: #4f46e5; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Print / Save as PDF</button>
  </div>
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        ${data.seller.logoUrl ? `<img src="${data.seller.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 8px;" />` : ''}
        <h1 style="margin: 0 0 4px 0; font-size: 22px; color: #312e81;">${data.seller.tradeName || data.seller.name}</h1>
        <div style="color: #4b5563; font-size: 12px;">${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.phone ? `<div style="font-size: 12px;">Phone: ${data.seller.phone}</div>` : ''}
        ${data.seller.pan ? `<div style="font-size: 11px; font-weight: 600; margin-top: 2px;">PAN: ${data.seller.pan}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0 0 6px 0; font-size: 18px; color: #4f46e5; text-transform: uppercase;">${invoiceTitle}</h2>
        <div style="font-weight: 600;">Invoice No: ${data.invoiceNumber}</div>
        <div>Date: ${data.invoiceDate}</div>
        <div>Order ID: #${data.orderId}</div>
        <div style="display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${data.paymentMethod === 'PREPAID' ? '#dcfce7; color: #166534;' : '#fef3c7; color: #92400e;'}">
          ${data.paymentMethod}
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; gap: 20px; margin-bottom: 20px;">
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Customer / Billed To:</div>
        <div style="font-weight: 600;">${data.buyer.name}</div>
        <div>${data.buyer.address}</div>
        <div>${data.buyer.city}, ${data.buyer.state} - ${data.buyer.pincode}</div>
        <div>Phone: ${data.buyer.phone}</div>
      </div>
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Delivered / Shipped To:</div>
        <div style="font-weight: 600;">${shippingAddr.name}</div>
        <div>${shippingAddr.address}</div>
        <div>${shippingAddr.city}, ${shippingAddr.state} - ${shippingAddr.pincode}</div>
        <div>Phone: ${shippingAddr.phone}</div>
      </div>
    </div>

    <table style="margin-bottom: 20px;">
      <thead>
        <tr style="background: #f3f4f6; font-size: 12px; color: #374151;">
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center; width: 30px;">#</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: left;">Item Description</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: center;">Qty</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Unit Price</th>
          <th style="padding: 8px; border-bottom: 2px solid #d1d5db; text-align: right;">Amount</th>
        </tr>
      </thead>
      <tbody>
        ${lineItemsHtml}
      </tbody>
    </table>

    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 24px;">
      <div style="flex: 1; padding-right: 24px;">
        <div style="font-size: 11px; color: #4b5563; font-weight: 600; text-transform: uppercase;">Amount in Words:</div>
        <div style="font-weight: 600; color: #312e81; margin-top: 2px;">${amountInWords}</div>
        ${
          data.seller.bankDetails
            ? `<div style="margin-top: 12px; font-size: 11px; background: #eff6ff; padding: 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
            <strong>Bank Transfer / Payment Info:</strong><br />
            Bank: ${data.seller.bankDetails.bankName} | A/C: ${data.seller.bankDetails.accountNumber} | IFSC: ${data.seller.bankDetails.ifsc}
            ${data.seller.bankDetails.upiId ? `<br />UPI ID: <strong>${data.seller.bankDetails.upiId}</strong>` : ''}
          </div>`
            : ''
        }
      </div>
      <div style="width: 280px; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Subtotal:</span>
          <span>₹${subtotal.toFixed(2)}</span>
        </div>
        ${
          shippingFee > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Delivery / Shipping:</span>
          <span>₹${shippingFee.toFixed(2)}</span>
        </div>`
            : ''
        }
        ${
          data.discountAmount && data.discountAmount > 0
            ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #059669;">
          <span>Discount:</span>
          <span>-₹${data.discountAmount.toFixed(2)}</span>
        </div>`
            : ''
        }
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #d1d5db; font-size: 15px; font-weight: 700; color: #312e81;">
          <span>Net Payable:</span>
          <span>₹${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 11px; color: #6b7280; max-width: 450px;">
        <strong>Terms & Conditions:</strong>
        <ul style="margin: 4px 0 0 0; padding-left: 16px;">
          ${(data.termsAndConditions || [
            `All disputes are subject to ${data.seller.city} jurisdiction.`,
            'Goods once sold can be returned/exchanged as per store return policy.',
          ])
            .map((t) => `<li>${t}</li>`)
            .join('')}
        </ul>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600; margin-bottom: 20px;">For ${data.seller.tradeName || data.seller.name}</div>
        ${data.seller.signatureUrl ? `<img src="${data.seller.signatureUrl}" alt="Signature" style="max-height: 40px; margin-bottom: 4px;" /><br/>` : ''}
        <div style="border-top: 1px dashed #9ca3af; padding-top: 4px; font-size: 11px; color: #4b5563;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Alias for generateNonGstInvoiceHtml
   */
  static generateRetailInvoiceHtml(data: NonGstInvoiceData): string {
    return this.generateNonGstInvoiceHtml(data);
  }

  /**
   * Generates a Proforma Invoice (Quotation / Estimate) HTML before order confirmation
   */
  static generateProformaInvoiceHtml(data: ProformaInvoiceData): string {
    const rawHtml = this.generateTaxInvoiceHtml(data);
    // Replace title and header with Proforma Invoice
    let proformaHtml = rawHtml
      .replace(/<title>Tax Invoice/gi, '<title>Proforma Invoice')
      .replace(/<h2[^>]*>TAX INVOICE<\/h2>/gi, '<h2 style="margin: 0 0 6px 0; font-size: 18px; color: #d97706; text-transform: uppercase;">PROFORMA INVOICE</h2>');

    if (data.validUntil) {
      proformaHtml = proformaHtml.replace(
        /<\/div>\s*<\/div>\s*<!-- Bill To/i,
        `<div style="font-size: 11px; color: #b45309; font-weight: 600; margin-top: 4px;">Quote Valid Until: ${data.validUntil}</div></div></div><!-- Bill To`
      );
    }
    return proformaHtml;
  }
  static generateCreditNoteHtml(data: CreditNoteData): string {
    const taxResolution = determineTaxType(
      data.seller.gstin || data.seller.state,
      data.buyer.gstin || data.buyer.state
    );
    const isIntraState = taxResolution.isIntraState;
    const taxCalc = calculateGstBreakdown(data.items, data.refundShippingFee || 0, {
      taxMode: 'INCLUSIVE',
      isIntraState,
    });
    const refundAmount = data.totalRefundAmount !== undefined ? data.totalRefundAmount : taxCalc.grandTotal;
    const amountInWords = numberToIndianWords(refundAmount);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Credit Note - ${data.creditNoteNumber}</title>
  <style>
    @media print { body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .no-print { display: none; } }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; color: #1f2937; margin: 0; padding: 24px; background: #fff; line-height: 1.4; font-size: 13px; }
    table { width: 100%; border-collapse: collapse; }
    .btn-print { background: #dc2626; color: #fff; padding: 8px 16px; border: none; border-radius: 6px; cursor: pointer; font-weight: 600; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="no-print" style="text-align: right;">
    <button class="btn-print" onclick="window.print()">🖨️ Print Credit Note</button>
  </div>
  <div style="border: 2px solid #dc2626; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px;">
      <div>
        <h1 style="margin: 0; color: #991b1b; font-size: 22px;">${data.seller.tradeName || data.seller.name}</h1>
        <div>${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.gstin ? `<div><strong>GSTIN:</strong> ${data.seller.gstin}</div>` : ''}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #dc2626;">CREDIT NOTE</h2>
        <div><strong>CN No:</strong> ${data.creditNoteNumber}</div>
        <div><strong>CN Date:</strong> ${data.creditNoteDate}</div>
        <div style="margin-top: 4px; background: #fee2e2; padding: 2px 6px; border-radius: 4px; font-size: 11px;">Against Inv: #${data.originalInvoiceNumber} (${data.originalInvoiceDate})</div>
      </div>
    </div>
    <div style="margin-bottom: 16px; background: #fef2f2; padding: 8px 12px; border-radius: 6px; border-left: 4px solid #dc2626;">
      <strong>Reason for Credit Note:</strong> ${data.reasonForReturn}
    </div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 16px;">
      <div>
        <strong>Issued To:</strong><br/>
        ${data.buyer.name}<br/>
        ${data.buyer.address}, ${data.buyer.city}, ${data.buyer.state} - ${data.buyer.pincode}<br/>
        Phone: ${data.buyer.phone}
      </div>
    </div>
    <table style="margin-bottom: 16px;">
      <thead>
        <tr style="background: #fee2e2;">
          <th style="padding: 6px; border: 1px solid #fca5a5;">Item</th>
          <th style="padding: 6px; border: 1px solid #fca5a5; text-align: center;">Qty</th>
          <th style="padding: 6px; border: 1px solid #fca5a5; text-align: right;">Unit Rate</th>
          <th style="padding: 6px; border: 1px solid #fca5a5; text-align: right;">Refund Taxable</th>
          <th style="padding: 6px; border: 1px solid #fca5a5; text-align: right;">Refund GST</th>
          <th style="padding: 6px; border: 1px solid #fca5a5; text-align: right;">Total Credit</th>
        </tr>
      </thead>
      <tbody>
        ${taxCalc.items
          .map(
            (i) => `<tr>
          <td style="padding: 6px; border: 1px solid #e5e7eb;">${i.name}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center;">${i.quantity}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">₹${i.unitPrice.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">₹${i.taxableAmount.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">₹${i.totalTax.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #991b1b;">-₹${i.lineTotal.toFixed(2)}</td>
        </tr>`
          )
          .join('')}
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #dc2626; padding-top: 8px;">
      <div>
        <strong>Total Amount Credited in Words:</strong><br/>
        <span style="color: #991b1b; font-weight: 600;">${amountInWords}</span>
      </div>
      <div style="font-size: 16px; font-weight: bold; color: #991b1b;">
        Total Refund: ₹${refundAmount.toFixed(2)}
      </div>
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Generates a 4x6 inch thermal shipping label HTML with barcode and COD alert
   */
  static generateShippingLabelHtml(data: ShippingLabelData): string {
    const barcodeSvg = generateBarcodeSvg(data.awb, 45);

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Shipping Label - ${data.awb}</title>
  <style>
    @page { size: 4in 6in; margin: 0; }
    @media print {
      body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
      .no-print { display: none; }
    }
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace, sans-serif; margin: 0; padding: 12px; width: 3.8in; height: 5.8in; box-sizing: border-box; font-size: 12px; color: #000; background: #fff; }
    .box { border: 2px solid #000; padding: 8px; margin-bottom: 6px; }
  </style>
</head>
<body>
  <div style="text-align: center; border-bottom: 2px solid #000; padding-bottom: 6px; margin-bottom: 6px;">
    <div style="display: flex; justify-content: space-between; align-items: center;">
      <strong style="font-size: 16px;">${data.courierName.toUpperCase()}</strong>
      <strong style="font-size: 18px; border: 2px solid #000; padding: 2px 8px;">${data.routingCode || 'STD'}</strong>
    </div>
    <div style="margin: 6px 0;">
      ${barcodeSvg}
    </div>
    <div style="font-size: 12px; font-weight: 700;">AWB: ${data.awb}</div>
  </div>

  <!-- COD / Prepaid Alert Box -->
  <div style="border: 3px solid #000; text-align: center; padding: 6px; margin-bottom: 8px; background: ${data.paymentMethod === 'COD' ? '#000; color: #fff;' : '#fff; color: #000;'}">
    <div style="font-size: 18px; font-weight: 900; text-transform: uppercase;">
      ${data.paymentMethod === 'COD' ? `C.O.D. COLLECT ₹${data.collectibleAmount.toFixed(0)}` : 'PREPAID ORDER'}
    </div>
  </div>

  <!-- Destination Address -->
  <div class="box">
    <div style="font-size: 10px; font-weight: 700; text-transform: uppercase;">Ship To / Deliver To:</div>
    <div style="font-size: 14px; font-weight: 800; margin-top: 2px;">${data.buyer.name}</div>
    <div style="font-size: 12px; margin-top: 2px;">${data.buyer.address}</div>
    <div style="font-size: 13px; font-weight: 800; margin-top: 2px;">${data.buyer.city}, ${data.buyer.state} - ${data.buyer.pincode}</div>
    <div style="font-size: 12px; font-weight: 700; margin-top: 4px;">Phone: ${data.buyer.phone}</div>
  </div>

  <!-- Order & Package Details -->
  <div style="display: flex; justify-content: space-between; font-size: 11px; margin-bottom: 6px; padding: 0 4px;">
    <div><strong>Order #:</strong> ${data.orderId}</div>
    <div><strong>Weight:</strong> ${data.weightKg} KG</div>
  </div>

  <!-- Return / Seller Info -->
  <div class="box" style="font-size: 10px; line-height: 1.3;">
    <div style="font-weight: 700;">If Undelivered, Return To:</div>
    <div><strong>${data.seller.tradeName || data.seller.name}</strong></div>
    <div>${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
    <div>Phone: ${data.seller.phone || 'N/A'}</div>
  </div>
</body>
</html>`;
  }

  /**
   * Generates a 3-inch (80mm) or 2-inch (58mm) Thermal POS / Delivery Receipt
   */
  static generateThermalReceiptHtml(data: ThermalReceiptData, widthMm: 80 | 58 = 80): string {
    const widthStyle = widthMm === 58 ? 'width: 48mm;' : 'width: 72mm;';
    const grandTotal = data.total;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Receipt - ${data.receiptNumber}</title>
  <style>
    @media print { body { margin: 0; padding: 0; } .no-print { display: none; } }
    body { font-family: monospace; font-size: 11px; color: #000; margin: 0; padding: 6px; }
    .receipt { ${widthStyle} margin: 0 auto; line-height: 1.2; }
    .center { text-align: center; }
    .right { text-align: right; }
    .bold { font-weight: bold; }
    .divider { border-top: 1px dashed #000; margin: 4px 0; }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="center bold" style="font-size: 13px;">${data.storeName.toUpperCase()}</div>
    ${data.storeAddress ? `<div class="center">${data.storeAddress}</div>` : ''}
    ${data.storePhone ? `<div class="center">Ph: ${data.storePhone}</div>` : ''}
    ${data.gstin ? `<div class="center">GSTIN: ${data.gstin}</div>` : ''}
    <div class="divider"></div>
    <div>Rcpt #: ${data.receiptNumber}</div>
    <div>Order #: ${data.orderId}</div>
    <div>Date: ${data.date}</div>
    ${data.customerName ? `<div>Customer: ${data.customerName}</div>` : ''}
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between;" class="bold">
      <span>ITEM</span>
      <span>QTY x RATE = TOTAL</span>
    </div>
    <div class="divider"></div>
    ${data.items
      .map(
        (item) => `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
      <span>${item.name.slice(0, 16)}</span>
      <span>${item.quantity} x ₹${item.price} = ₹${(item.quantity * item.price).toFixed(2)}</span>
    </div>`
      )
      .join('')}
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between;">
      <span>Subtotal:</span>
      <span>₹${data.subtotal.toFixed(2)}</span>
    </div>
    ${
      data.discount && data.discount > 0
        ? `<div style="display: flex; justify-content: space-between;">
      <span>Discount:</span>
      <span>-₹${data.discount.toFixed(2)}</span>
    </div>`
        : ''
    }
    ${
      data.shippingFee && data.shippingFee > 0
        ? `<div style="display: flex; justify-content: space-between;">
      <span>Delivery:</span>
      <span>₹${data.shippingFee.toFixed(2)}</span>
    </div>`
        : ''
    }
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between; font-size: 13px;" class="bold">
      <span>NET PAYABLE:</span>
      <span>₹${grandTotal.toFixed(2)}</span>
    </div>
    <div>Payment: ${data.paymentMethod}</div>
    <div class="divider"></div>
    <div class="center" style="font-size: 10px; margin-top: 4px;">
      ${data.footerMessage || 'Thank you for shopping with us!'}
    </div>
  </div>
</body>
</html>`;
  }

  /**
   * Directly constructs InvoiceData from a @boostengine/cart instance
   */
  static fromCart(
    cart: BoostCartLike,
    context: {
      invoiceNumber: string;
      invoiceDate: string;
      orderId: string;
      seller: BusinessEntity;
      buyer: CustomerEntity;
      paymentMethod: 'PREPAID' | 'COD' | string;
      shippingFee?: number;
      taxMode?: 'INCLUSIVE' | 'EXCLUSIVE';
    }
  ): InvoiceData {
    const items = cart.items.map((item) => ({
      name: item.name || item.title || 'Cart Item',
      sku: item.sku,
      hsn: item.hsn || '6109',
      quantity: item.quantity,
      unitPrice: item.price,
      discount: item.discount || 0,
      taxRate: item.taxRate !== undefined ? item.taxRate : 18,
    }));

    return {
      invoiceNumber: context.invoiceNumber,
      invoiceDate: context.invoiceDate,
      orderId: context.orderId,
      seller: context.seller,
      buyer: context.buyer,
      paymentMethod: context.paymentMethod,
      shippingFee: context.shippingFee !== undefined ? context.shippingFee : cart.shippingFee || 0,
      taxMode: context.taxMode || 'INCLUSIVE',
      items,
    };
  }

  /**
   * Generates a binary PDF Buffer on the server (Node.js/Next.js Route Handlers)
   */
  static async toPdfBuffer(
    html: string,
    options?: PdfRendererOptions
  ): Promise<Buffer | Uint8Array> {
    return renderHtmlToPdfBuffer(html, options);
  }

  /**
   * Programmatically triggers instant PDF download in client/browser environments
   */
  static downloadPdfInBrowser(html: string, filename: string = 'Invoice.pdf'): void {
    downloadPdfInBrowser(html, filename);
  }
}

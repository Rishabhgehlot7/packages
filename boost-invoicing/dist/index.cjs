'use strict';

// src/utils.ts
function numberToIndianWords(amount) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen"
  ];
  const tens = ["", "", "Twenty", "Thirty", "Forty", "Fifty", "Sixty", "Seventy", "Eighty", "Ninety"];
  function convertTwoDigits(n) {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit ? "-" + ones[unit] : "");
  }
  function convertThreeDigits(n) {
    const hundred = Math.floor(n / 100);
    const remainder2 = n % 100;
    let str = "";
    if (hundred) str += ones[hundred] + " Hundred";
    if (remainder2) str += (str ? " " : "") + convertTwoDigits(remainder2);
    return str;
  }
  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);
  if (rupees === 0 && paise === 0) return "Zero Rupees Only";
  const crore = Math.floor(rupees / 1e7);
  const lakh = Math.floor(rupees % 1e7 / 1e5);
  const thousand = Math.floor(rupees % 1e5 / 1e3);
  const remainder = rupees % 1e3;
  const parts = [];
  if (crore) parts.push(convertThreeDigits(crore) + " Crore");
  if (lakh) parts.push(convertTwoDigits(lakh) + " Lakh");
  if (thousand) parts.push(convertTwoDigits(thousand) + " Thousand");
  if (remainder) parts.push(convertThreeDigits(remainder));
  let words = parts.join(" ") + " Rupees";
  if (paise > 0) {
    words += " and " + convertTwoDigits(paise) + " Paise";
  }
  return words + " Only";
}
function generateBarcodeSvg(text, height = 45) {
  const chars = text.replace(/[^A-Za-z0-9]/g, "");
  const barWidth = 2;
  const bars = [];
  let currentX = 10;
  for (let i = 0; i < chars.length; i++) {
    const code = chars.charCodeAt(i);
    for (let b = 0; b < 6; b++) {
      const isBlack = (code >> b & 1) === 1;
      const w = (b % 2 === 0 ? 1 : 2) * barWidth;
      if (isBlack) {
        bars.push(`<rect x="${currentX}" y="0" width="${w}" height="${height}" fill="#000" />`);
      }
      currentX += w + 1;
    }
    currentX += barWidth;
  }
  const totalWidth = currentX + 10;
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalWidth} ${height + 15}" width="${totalWidth}" height="${height + 15}">
    ${bars.join("")}
    <text x="${totalWidth / 2}" y="${height + 12}" font-family="monospace" font-size="11" text-anchor="middle" fill="#000">${text}</text>
  </svg>`;
}

// src/invoice.ts
var InvoiceGenerator = class {
  /**
   * Generates a fully compliant, print-ready Indian GST Tax Invoice HTML
   */
  static generateTaxInvoiceHtml(data) {
    const isIntraState = data.seller.state.trim().toLowerCase() === data.buyer.state.trim().toLowerCase();
    let subtotal = 0;
    let totalTax = 0;
    const hsnMap = {};
    const lineItemsHtml = data.items.map((item, index) => {
      const itemDiscount = item.discount || 0;
      const lineTotal = item.quantity * item.unitPrice - itemDiscount;
      const taxable = Math.round(lineTotal / (1 + item.taxRate / 100) * 100) / 100;
      const tax = Math.round((lineTotal - taxable) * 100) / 100;
      subtotal += taxable;
      totalTax += tax;
      let cgst = 0;
      let sgst = 0;
      let igst = 0;
      if (isIntraState) {
        cgst = Math.round(tax / 2 * 100) / 100;
        sgst = Math.round((tax - cgst) * 100) / 100;
      } else {
        igst = tax;
      }
      if (!hsnMap[item.hsn]) {
        hsnMap[item.hsn] = { hsn: item.hsn, taxable: 0, rate: item.taxRate, cgst: 0, sgst: 0, igst: 0 };
      }
      hsnMap[item.hsn].taxable = Math.round((hsnMap[item.hsn].taxable + taxable) * 100) / 100;
      hsnMap[item.hsn].cgst = Math.round((hsnMap[item.hsn].cgst + cgst) * 100) / 100;
      hsnMap[item.hsn].sgst = Math.round((hsnMap[item.hsn].sgst + sgst) * 100) / 100;
      hsnMap[item.hsn].igst = Math.round((hsnMap[item.hsn].igst + igst) * 100) / 100;
      return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong>
            ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ""}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${taxable.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
            ${isIntraState ? `\u20B9${(cgst + sgst).toFixed(2)} (${item.taxRate}%)` : `\u20B9${igst.toFixed(2)} (${item.taxRate}%)`}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">\u20B9${lineTotal.toFixed(2)}</td>
        </tr>`;
    }).join("\n");
    const shippingFee = data.shippingFee || 0;
    const grandTotal = Math.round((subtotal + totalTax + shippingFee) * 100) / 100;
    const amountInWords = numberToIndianWords(grandTotal);
    const hsnRowsHtml = Object.values(hsnMap).map(
      (h) => `<tr>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: center;">${h.hsn}</td>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.taxable.toFixed(2)}</td>
        ${isIntraState ? `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.cgst.toFixed(2)} (${h.rate / 2}%)</td>
               <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.sgst.toFixed(2)} (${h.rate / 2}%)</td>` : `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;" colspan="2">\u20B9${h.igst.toFixed(2)} (${h.rate}%)</td>`}
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right; font-weight: 600;">\u20B9${(h.cgst + h.sgst + h.igst).toFixed(2)}</td>
      </tr>`
    ).join("\n");
    const shippingAddr = data.shippingAddress || data.buyer;
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
    <button class="btn-print" onclick="window.print()">\u{1F5A8}\uFE0F Print / Save as PDF</button>
  </div>

  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <!-- Header -->
    <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #2563eb; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        <h1 style="margin: 0 0 4px 0; font-size: 22px; color: #1e3a8a;">${data.seller.tradeName || data.seller.name}</h1>
        <div style="color: #4b5563; font-size: 12px;">${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.gstin ? `<div style="font-weight: 600; margin-top: 4px;">GSTIN: <span style="font-family: monospace;">${data.seller.gstin}</span></div>` : ""}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0 0 6px 0; font-size: 18px; color: #2563eb; text-transform: uppercase;">TAX INVOICE</h2>
        <div style="font-weight: 600;">Invoice No: ${data.invoiceNumber}</div>
        <div>Date: ${data.invoiceDate}</div>
        <div>Order ID: #${data.orderId}</div>
        <div style="display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${data.paymentMethod === "PREPAID" ? "#dcfce7; color: #166534;" : "#fef3c7; color: #92400e;"}">
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
        ${data.buyer.gstin ? `<div style="margin-top: 4px; font-weight: 600;">Buyer GSTIN: ${data.buyer.gstin}</div>` : ""}
      </div>
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Shipped To:</div>
        <div style="font-weight: 600;">${shippingAddr.name}</div>
        <div>${shippingAddr.address}</div>
        <div>${shippingAddr.city}, ${shippingAddr.state} - ${shippingAddr.pincode}</div>
        <div>Phone: ${shippingAddr.phone}</div>
        <div>Place of Supply: ${shippingAddr.state} (${isIntraState ? "Intra-State" : "Inter-State"})</div>
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
      </div>
      <div style="width: 280px; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Taxable Subtotal:</span>
          <span>\u20B9${subtotal.toFixed(2)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Total GST Tax:</span>
          <span>\u20B9${totalTax.toFixed(2)}</span>
        </div>
        ${shippingFee > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Shipping Fee:</span>
          <span>\u20B9${shippingFee.toFixed(2)}</span>
        </div>` : ""}
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #d1d5db; font-size: 15px; font-weight: 700; color: #1e3a8a;">
          <span>Grand Total:</span>
          <span>\u20B9${grandTotal.toFixed(2)}</span>
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
            ${isIntraState ? `<th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">CGST</th>
                   <th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">SGST</th>` : `<th style="padding: 6px; border: 1px solid #d1d5db; text-align: right;" colspan="2">IGST</th>`}
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
          <li>All disputes are subject to ${data.seller.city} jurisdiction.</li>
          <li>Goods once sold can be returned/exchanged as per store return policy.</li>
        </ul>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600; margin-bottom: 40px;">For ${data.seller.tradeName || data.seller.name}</div>
        <div style="border-top: 1px dashed #9ca3af; padding-top: 4px; font-size: 11px; color: #4b5563;">Authorized Signatory</div>
      </div>
    </div>
  </div>
</body>
</html>`;
  }
  /**
   * Generates a 4x6 inch thermal shipping label HTML with barcode and COD alert
   */
  static generateShippingLabelHtml(data) {
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
      <strong style="font-size: 18px; border: 2px solid #000; padding: 2px 8px;">${data.routingCode || "STD"}</strong>
    </div>
    <div style="margin: 6px 0;">
      ${barcodeSvg}
    </div>
    <div style="font-size: 12px; font-weight: 700;">AWB: ${data.awb}</div>
  </div>

  <!-- COD / Prepaid Alert Box -->
  <div style="border: 3px solid #000; text-align: center; padding: 6px; margin-bottom: 8px; background: ${data.paymentMethod === "COD" ? "#000; color: #fff;" : "#fff; color: #000;"}">
    <div style="font-size: 18px; font-weight: 900; text-transform: uppercase;">
      ${data.paymentMethod === "COD" ? `C.O.D. COLLECT \u20B9${data.collectibleAmount.toFixed(0)}` : "PREPAID ORDER"}
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
    <div>Phone: ${data.seller.phone || "N/A"}</div>
  </div>
</body>
</html>`;
  }
};

exports.InvoiceGenerator = InvoiceGenerator;
exports.generateBarcodeSvg = generateBarcodeSvg;
exports.numberToIndianWords = numberToIndianWords;
//# sourceMappingURL=index.cjs.map
//# sourceMappingURL=index.cjs.map
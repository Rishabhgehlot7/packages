var __require = /* @__PURE__ */ ((x) => typeof require !== "undefined" ? require : typeof Proxy !== "undefined" ? new Proxy(x, {
  get: (a, b) => (typeof require !== "undefined" ? require : a)[b]
}) : x)(function(x) {
  if (typeof require !== "undefined") return require.apply(this, arguments);
  throw Error('Dynamic require of "' + x + '" is not supported');
});

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

// src/gst.ts
var GST_STATE_CODES = {
  "01": "Jammu & Kashmir",
  "02": "Himachal Pradesh",
  "03": "Punjab",
  "04": "Chandigarh",
  "05": "Uttarakhand",
  "06": "Haryana",
  "07": "Delhi",
  "08": "Rajasthan",
  "09": "Uttar Pradesh",
  "10": "Bihar",
  "11": "Sikkim",
  "12": "Arunachal Pradesh",
  "13": "Nagaland",
  "14": "Manipur",
  "15": "Mizoram",
  "16": "Tripura",
  "17": "Meghalaya",
  "18": "Assam",
  "19": "West Bengal",
  "20": "Jharkhand",
  "21": "Odisha",
  "22": "Chhattisgarh",
  "23": "Madhya Pradesh",
  "24": "Gujarat",
  "26": "Dadra & Nagar Haveli and Daman & Diu",
  "27": "Maharashtra",
  "29": "Karnataka",
  "30": "Goa",
  "31": "Lakshadweep",
  "32": "Kerala",
  "33": "Tamil Nadu",
  "34": "Puducherry",
  "35": "Andaman & Nicobar Islands",
  "36": "Telangana",
  "37": "Andhra Pradesh",
  "38": "Ladakh",
  "97": "Other Territory",
  "99": "Centre Jurisdiction"
};
var STATE_TO_CODE_MAP = {};
for (const [code, name] of Object.entries(GST_STATE_CODES)) {
  STATE_TO_CODE_MAP[name.toLowerCase().replace(/[^a-z0-9]/g, "")] = code;
}
STATE_TO_CODE_MAP["jk"] = "01";
STATE_TO_CODE_MAP["jammukashmir"] = "01";
STATE_TO_CODE_MAP["jammuandkashmir"] = "01";
STATE_TO_CODE_MAP["up"] = "09";
STATE_TO_CODE_MAP["uttarpradesh"] = "09";
STATE_TO_CODE_MAP["mp"] = "23";
STATE_TO_CODE_MAP["madhyapradesh"] = "23";
STATE_TO_CODE_MAP["mh"] = "27";
STATE_TO_CODE_MAP["maharashtra"] = "27";
STATE_TO_CODE_MAP["ka"] = "29";
STATE_TO_CODE_MAP["karnataka"] = "29";
STATE_TO_CODE_MAP["tn"] = "33";
STATE_TO_CODE_MAP["tamilnadu"] = "33";
STATE_TO_CODE_MAP["dl"] = "07";
STATE_TO_CODE_MAP["delhi"] = "07";
STATE_TO_CODE_MAP["ncr"] = "07";
STATE_TO_CODE_MAP["newdelhi"] = "07";
STATE_TO_CODE_MAP["wb"] = "19";
STATE_TO_CODE_MAP["westbengal"] = "19";
STATE_TO_CODE_MAP["ts"] = "36";
STATE_TO_CODE_MAP["telangana"] = "36";
STATE_TO_CODE_MAP["ap"] = "37";
STATE_TO_CODE_MAP["andhrapradesh"] = "37";
STATE_TO_CODE_MAP["gj"] = "24";
STATE_TO_CODE_MAP["gujarat"] = "24";
STATE_TO_CODE_MAP["kl"] = "32";
STATE_TO_CODE_MAP["kerala"] = "32";
STATE_TO_CODE_MAP["hr"] = "06";
STATE_TO_CODE_MAP["haryana"] = "06";
STATE_TO_CODE_MAP["rj"] = "08";
STATE_TO_CODE_MAP["rajasthan"] = "08";
STATE_TO_CODE_MAP["pb"] = "03";
STATE_TO_CODE_MAP["punjab"] = "03";
var PAN_ENTITY_TYPES = {
  C: "Company",
  P: "Individual / Proprietorship",
  H: "Hindu Undivided Family (HUF)",
  F: "Partnership Firm / LLP",
  A: "Association of Persons (AOP)",
  T: "Trust",
  B: "Body of Individuals (BOI)",
  L: "Local Authority",
  J: "Artificial Juridical Person",
  G: "Government Entity"
};
function validateGSTIN(rawGstin) {
  if (!rawGstin || typeof rawGstin !== "string") {
    return { isValid: false, error: "GSTIN must be a non-empty string" };
  }
  const cleaned = rawGstin.trim().toUpperCase();
  const gstinRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
  if (!gstinRegex.test(cleaned)) {
    return {
      isValid: false,
      error: "Invalid GSTIN format. Must be 15 alphanumeric characters matching Indian GST standard."
    };
  }
  const stateCode = cleaned.slice(0, 2);
  const stateName = GST_STATE_CODES[stateCode];
  if (!stateName) {
    return {
      isValid: false,
      error: `Invalid GST state code "${stateCode}".`
    };
  }
  const pan = cleaned.slice(2, 12);
  const entityChar = pan[3];
  const entityType = PAN_ENTITY_TYPES[entityChar] || "Registered Entity";
  return {
    isValid: true,
    gstin: cleaned,
    stateCode,
    stateName,
    pan,
    entityType
  };
}
function resolveStateCode(stateNameOrCode) {
  if (!stateNameOrCode) return null;
  const trimmed = stateNameOrCode.trim();
  if (/^\d{2}$/.test(trimmed) && GST_STATE_CODES[trimmed]) {
    return trimmed;
  }
  const normalized = trimmed.toLowerCase().replace(/[^a-z0-9]/g, "");
  return STATE_TO_CODE_MAP[normalized] || null;
}
function determineTaxType(sellerStateOrGstin, buyerStateOrGstin) {
  let sellerCode = /^[0-9]{2}[A-Z]/.test(sellerStateOrGstin.trim()) ? sellerStateOrGstin.trim().slice(0, 2) : resolveStateCode(sellerStateOrGstin);
  let buyerCode = /^[0-9]{2}[A-Z]/.test(buyerStateOrGstin.trim()) ? buyerStateOrGstin.trim().slice(0, 2) : resolveStateCode(buyerStateOrGstin);
  const isIntraState = Boolean(sellerCode && buyerCode) && sellerCode === buyerCode || sellerStateOrGstin.trim().toLowerCase() === buyerStateOrGstin.trim().toLowerCase();
  return {
    isIntraState,
    sellerStateCode: sellerCode,
    buyerStateCode: buyerCode
  };
}

// src/tax.ts
var COMMON_HSN_DIRECTORY = {
  // Apparel & Textiles
  "6109": { code: "6109", category: "Apparel", description: "T-Shirts, Singlets and Other Vests (Knitted or Crocheted)", standardGstRate: 12 },
  "6203": { code: "6203", category: "Apparel", description: "Men's Suits, Jackets, Blazers, Trousers, Shorts", standardGstRate: 12 },
  "6204": { code: "6204", category: "Apparel", description: "Women's Suits, Ensembles, Jackets, Dresses, Skirts", standardGstRate: 12 },
  "6403": { code: "6403", category: "Footwear", description: "Footwear with outer soles of rubber, plastics, leather", standardGstRate: 18 },
  // Electronics & Mobile Accessories
  "8517": { code: "8517", category: "Electronics", description: "Mobile Phones, Smart Watches & Network Equipment", standardGstRate: 18 },
  "8518": { code: "8518", category: "Electronics", description: "Microphones, Headphones, Earphones & Speakers", standardGstRate: 18 },
  "8504": { code: "8504", category: "Electronics", description: "Power Adapters, Chargers & Inverters", standardGstRate: 18 },
  "8507": { code: "8507", category: "Electronics", description: "Electric Storage Batteries & Power Banks", standardGstRate: 18 },
  // Beauty, Personal Care & Cosmetics
  "3304": { code: "3304", category: "Cosmetics", description: "Beauty / Make-up preparations, Skincare, Sunscreen", standardGstRate: 18 },
  "3305": { code: "3305", category: "Personal Care", description: "Hair care preparations (Shampoo, Oil, Conditioners)", standardGstRate: 18 },
  "3307": { code: "3307", category: "Personal Care", description: "Perfumes, Deodorants, Shaving preparations", standardGstRate: 18 },
  // Jewelry & Watches
  "7117": { code: "7117", category: "Fashion Accessories", description: "Imitation Jewelry", standardGstRate: 3 },
  "9102": { code: "9102", category: "Watches", description: "Wrist Watches, Pocket Watches", standardGstRate: 18 },
  // Home, Kitchen & Decor
  "9403": { code: "9403", category: "Furniture", description: "Other Furniture and Parts thereof", standardGstRate: 18 },
  "6912": { code: "6912", category: "Kitchenware", description: "Ceramic Tableware, Kitchenware", standardGstRate: 12 },
  // Books & Stationery
  "4901": { code: "4901", category: "Books", description: "Printed Books, Brochures, Leaflets", standardGstRate: 0 },
  "4820": { code: "4820", category: "Stationery", description: "Notebooks, Registers, Diaries, Letter Pads", standardGstRate: 18 },
  // Logistics & Services (SAC)
  "9968": { code: "9968", category: "Logistics", description: "Courier, Express Cargo & Postal Services", standardGstRate: 18 },
  "9983": { code: "9983", category: "Services", description: "Other professional, technical and business services", standardGstRate: 18 }
};
function calculateGstBreakdown(rawItems, shippingFee = 0, options) {
  const isInclusive = options.taxMode !== "EXCLUSIVE";
  const isIntraState = options.isIntraState;
  let subtotalTaxable = 0;
  let totalTax = 0;
  let totalDiscount = 0;
  let cgstTotal = 0;
  let sgstTotal = 0;
  let igstTotal = 0;
  const hsnMap = {};
  const calculatedItems = rawItems.map((item) => {
    const qty = Math.max(1, item.quantity || 1);
    const rate = item.unitPrice || 0;
    const discount = item.discount || 0;
    const taxRate = item.taxRate !== void 0 ? item.taxRate : 18;
    const hsn = item.hsn || "9983";
    let taxable = 0;
    let tax = 0;
    let lineTotal = 0;
    if (isInclusive) {
      lineTotal = Math.round((qty * rate - discount) * 100) / 100;
      taxable = Math.round(lineTotal / (1 + taxRate / 100) * 100) / 100;
      tax = Math.round((lineTotal - taxable) * 100) / 100;
    } else {
      const baseTotal = qty * rate - discount;
      taxable = Math.round(baseTotal * 100) / 100;
      tax = Math.round(taxable * taxRate / 100 * 100) / 100;
      lineTotal = Math.round((taxable + tax) * 100) / 100;
    }
    let cgst = 0;
    let sgst = 0;
    let igst = 0;
    if (isIntraState) {
      cgst = Math.round(tax / 2 * 100) / 100;
      sgst = Math.round((tax - cgst) * 100) / 100;
    } else {
      igst = tax;
    }
    subtotalTaxable = Math.round((subtotalTaxable + taxable) * 100) / 100;
    totalTax = Math.round((totalTax + tax) * 100) / 100;
    totalDiscount = Math.round((totalDiscount + discount) * 100) / 100;
    cgstTotal = Math.round((cgstTotal + cgst) * 100) / 100;
    sgstTotal = Math.round((sgstTotal + sgst) * 100) / 100;
    igstTotal = Math.round((igstTotal + igst) * 100) / 100;
    if (!hsnMap[hsn]) {
      hsnMap[hsn] = {
        hsn,
        taxableAmount: 0,
        rate: taxRate,
        cgst: 0,
        sgst: 0,
        igst: 0,
        totalTax: 0
      };
    }
    hsnMap[hsn].taxableAmount = Math.round((hsnMap[hsn].taxableAmount + taxable) * 100) / 100;
    hsnMap[hsn].cgst = Math.round((hsnMap[hsn].cgst + cgst) * 100) / 100;
    hsnMap[hsn].sgst = Math.round((hsnMap[hsn].sgst + sgst) * 100) / 100;
    hsnMap[hsn].igst = Math.round((hsnMap[hsn].igst + igst) * 100) / 100;
    hsnMap[hsn].totalTax = Math.round((hsnMap[hsn].totalTax + tax) * 100) / 100;
    return {
      name: item.name,
      sku: item.sku,
      hsn,
      quantity: qty,
      unitPrice: rate,
      discount,
      lineTotal,
      taxableAmount: taxable,
      taxRate,
      totalTax: tax,
      cgst,
      sgst,
      igst
    };
  });
  let shippingTaxable = 0;
  let shippingTax = 0;
  if (shippingFee > 0) {
    if (isInclusive) {
      shippingTaxable = Math.round(shippingFee / 1.18 * 100) / 100;
      shippingTax = Math.round((shippingFee - shippingTaxable) * 100) / 100;
    } else {
      shippingTaxable = shippingFee;
      shippingTax = Math.round(shippingFee * 0.18 * 100) / 100;
    }
  }
  const grandTotal = Math.round((subtotalTaxable + totalTax + shippingFee) * 100) / 100;
  return {
    items: calculatedItems,
    subtotalTaxable,
    totalTax,
    totalDiscount,
    cgstTotal,
    sgstTotal,
    igstTotal,
    shippingTaxable,
    shippingTax,
    grandTotal,
    hsnSummary: hsnMap
  };
}

// src/pdf.ts
async function renderHtmlToPdfBuffer(html, options = {}) {
  if (options.adapter) {
    return options.adapter(html, options);
  }
  if (typeof window !== "undefined") {
    throw new Error(
      "@boostengine/invoicing: renderHtmlToPdfBuffer is a server-side method. In browser/client environments, use window.print() or useInvoice().printInvoice() to save as PDF."
    );
  }
  try {
    let puppeteerModule;
    if (typeof __require !== "undefined") {
      try {
        puppeteerModule = __require("puppeteer");
      } catch (_) {
      }
    }
    if (!puppeteerModule) {
      puppeteerModule = await import('puppeteer');
    }
    const launcher = puppeteerModule?.default || puppeteerModule;
    if (!launcher || typeof launcher.launch !== "function") {
      throw new Error("Puppeteer module was found but 'launch' function is not available.");
    }
    const browser = await launcher.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    let pdfOptions = {
      format: options.format === "Thermal4x6" ? void 0 : options.format || "A4",
      printBackground: options.printBackground !== void 0 ? options.printBackground : true,
      landscape: Boolean(options.landscape),
      margin: options.margin || {
        top: "10mm",
        bottom: "10mm",
        left: "10mm",
        right: "10mm"
      }
    };
    if (options.format === "Thermal4x6") {
      pdfOptions = {
        width: "4in",
        height: "6in",
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
        printBackground: true
      };
    } else if (options.format === "Thermal80mm") {
      pdfOptions = {
        width: "80mm",
        margin: { top: "0", bottom: "0", left: "0", right: "0" },
        printBackground: true
      };
    }
    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();
    return pdfBuffer;
  } catch (err) {
    if (err.code === "MODULE_NOT_FOUND" || err.code === "ERR_MODULE_NOT_FOUND" || err.message?.includes("Cannot find module") || err.message?.includes("Failed to resolve module")) {
      throw new Error(
        `@boostengine/invoicing: Server-side PDF generation requires 'puppeteer' or a custom adapter.
Please install Puppeteer:
  npm install puppeteer

Or pass a custom adapter:
  InvoiceGenerator.toPdfBuffer(html, { adapter: myCustomPdfFunction })`
      );
    }
    throw err;
  }
}
function downloadPdfInBrowser(html, filename = "Invoice.pdf") {
  if (typeof window === "undefined") return;
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.top = "-9999px";
  iframe.style.left = "-9999px";
  iframe.style.width = "0px";
  iframe.style.height = "0px";
  iframe.style.border = "none";
  document.body.appendChild(iframe);
  const doc = iframe.contentWindow?.document;
  if (!doc) return;
  doc.open();
  doc.write(html);
  doc.close();
  iframe.contentWindow?.focus();
  setTimeout(() => {
    iframe.contentWindow?.print();
    setTimeout(() => {
      document.body.removeChild(iframe);
    }, 1e3);
  }, 300);
}

// src/invoice.ts
var InvoiceGenerator = class {
  /**
   * Generates a fully compliant, print-ready Indian GST Tax Invoice HTML (A4)
   */
  static generateTaxInvoiceHtml(data) {
    const sellerGstin = data.seller.gstin || "";
    const buyerGstin = data.buyer.gstin || "";
    const taxResolution = determineTaxType(
      sellerGstin || data.seller.state,
      buyerGstin || data.buyer.state
    );
    const isIntraState = taxResolution.isIntraState;
    const shippingFee = data.shippingFee || 0;
    const taxCalc = calculateGstBreakdown(data.items, shippingFee, {
      taxMode: data.taxMode || "INCLUSIVE",
      isIntraState
    });
    const grandTotal = taxCalc.grandTotal;
    const amountInWords = numberToIndianWords(grandTotal);
    const lineItemsHtml = taxCalc.items.map(
      (item, index) => `<tr>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
          <strong>${item.name}</strong>
          ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ""}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${item.unitPrice.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${item.taxableAmount.toFixed(2)}</td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">
          ${isIntraState ? `\u20B9${(item.cgst + item.sgst).toFixed(2)} (${item.taxRate}%)` : `\u20B9${item.igst.toFixed(2)} (${item.taxRate}%)`}
        </td>
        <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">\u20B9${item.lineTotal.toFixed(2)}</td>
      </tr>`
    ).join("\n");
    const hsnRowsHtml = Object.values(taxCalc.hsnSummary).map(
      (h) => `<tr>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: center;">${h.hsn}</td>
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.taxableAmount.toFixed(2)}</td>
        ${isIntraState ? `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.cgst.toFixed(2)} (${h.rate / 2}%)</td>
               <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;">\u20B9${h.sgst.toFixed(2)} (${h.rate / 2}%)</td>` : `<td style="padding: 6px; border: 1px solid #d1d5db; text-align: right;" colspan="2">\u20B9${h.igst.toFixed(2)} (${h.rate}%)</td>`}
        <td style="padding: 6px; border: 1px solid #d1d5db; text-align: right; font-weight: 600;">\u20B9${h.totalTax.toFixed(2)}</td>
      </tr>`
    ).join("\n");
    const shippingAddr = data.shippingAddress || data.buyer;
    const sellerStateCode = taxResolution.sellerStateCode || resolveStateCode(data.seller.state) || "";
    const buyerStateCode = taxResolution.buyerStateCode || resolveStateCode(shippingAddr.state) || "";
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
        ${data.seller.logoUrl ? `<img src="${data.seller.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 8px;" />` : ""}
        <h1 style="margin: 0 0 4px 0; font-size: 22px; color: #1e3a8a;">${data.seller.tradeName || data.seller.name}</h1>
        <div style="color: #4b5563; font-size: 12px;">${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${sellerGstin ? `<div style="font-weight: 600; margin-top: 4px;">GSTIN: <span style="font-family: monospace;">${sellerGstin}</span> ${sellerStateCode ? `(State Code: ${sellerStateCode})` : ""}</div>` : ""}
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
        ${data.buyer.gstin ? `<div style="margin-top: 4px; font-weight: 600; color: #1e40af;">Buyer GSTIN: ${data.buyer.gstin}</div>` : ""}
      </div>
      <div style="flex: 1; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #f3f4f6;">
        <div style="font-weight: 600; color: #4b5563; font-size: 11px; text-transform: uppercase; margin-bottom: 4px;">Shipped To:</div>
        <div style="font-weight: 600;">${shippingAddr.name}</div>
        <div>${shippingAddr.address}</div>
        <div>${shippingAddr.city}, ${shippingAddr.state} - ${shippingAddr.pincode}</div>
        <div>Phone: ${shippingAddr.phone}</div>
        <div>Place of Supply: <strong>${shippingAddr.state}</strong> ${buyerStateCode ? `(Code: ${buyerStateCode})` : ""} [${isIntraState ? "Intra-State: CGST+SGST" : "Inter-State: IGST"}]</div>
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
        ${data.seller.bankDetails ? `<div style="margin-top: 12px; font-size: 11px; background: #eff6ff; padding: 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
            <strong>Bank Transfer Details:</strong><br />
            Bank: ${data.seller.bankDetails.bankName} | A/C: ${data.seller.bankDetails.accountNumber} | IFSC: ${data.seller.bankDetails.ifsc}
            ${data.seller.bankDetails.upiId ? `<br />UPI ID: <strong>${data.seller.bankDetails.upiId}</strong>` : ""}
          </div>` : ""}
      </div>
      <div style="width: 280px; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Taxable Subtotal:</span>
          <span>\u20B9${taxCalc.subtotalTaxable.toFixed(2)}</span>
        </div>
        ${isIntraState ? `<div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
              <span>CGST:</span>
              <span>\u20B9${taxCalc.cgstTotal.toFixed(2)}</span>
            </div>
            <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>SGST:</span>
              <span>\u20B9${taxCalc.sgstTotal.toFixed(2)}</span>
            </div>` : `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
              <span>IGST:</span>
              <span>\u20B9${taxCalc.igstTotal.toFixed(2)}</span>
            </div>`}
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
          ${(data.termsAndConditions || [
      `All disputes are subject to ${data.seller.city} jurisdiction.`,
      "Goods once sold can be returned/exchanged as per store return policy."
    ]).map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600; margin-bottom: 20px;">For ${data.seller.tradeName || data.seller.name}</div>
        ${data.seller.signatureUrl ? `<img src="${data.seller.signatureUrl}" alt="Signature" style="max-height: 40px; margin-bottom: 4px;" /><br/>` : ""}
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
  static generateBillOfSupplyHtml(data) {
    let subtotal = 0;
    const lineItemsHtml = data.items.map((item, index) => {
      const itemDiscount = item.discount || 0;
      const lineTotal = Math.round((item.quantity * item.unitPrice - itemDiscount) * 100) / 100;
      subtotal += lineTotal;
      return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong>
            ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ""}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.hsn || "N/A"}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">\u20B9${lineTotal.toFixed(2)}</td>
        </tr>`;
    }).join("\n");
    const shippingFee = data.shippingFee || 0;
    const grandTotal = Math.round((subtotal + shippingFee) * 100) / 100;
    const amountInWords = numberToIndianWords(grandTotal);
    const declaration = data.compositionSchemeDeclaration || "Composition taxable person, not eligible to collect tax on supplies.";
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
    <button class="btn-print" onclick="window.print()">\u{1F5A8}\uFE0F Print Bill of Supply</button>
  </div>
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #059669; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        <h1 style="margin: 0; color: #065f46; font-size: 22px;">${data.seller.tradeName || data.seller.name}</h1>
        <div>${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.gstin ? `<div><strong>GSTIN:</strong> ${data.seller.gstin}</div>` : ""}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0; color: #059669; text-transform: uppercase;">BILL OF SUPPLY</h2>
        <div><strong>Bill No:</strong> ${data.invoiceNumber}</div>
        <div><strong>Date:</strong> ${data.invoiceDate}</div>
        <div>Order #: ${data.orderId}</div>
      </div>
    </div>
    <div style="background: #ecfdf5; border-left: 4px solid #059669; padding: 8px 12px; margin-bottom: 16px; font-size: 11px; font-weight: 600; color: #065f46;">
      \u2696\uFE0F Declaration: ${declaration}
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
          <span>\u20B9${subtotal.toFixed(2)}</span>
        </div>
        ${shippingFee > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;"><span>Shipping:</span><span>\u20B9${shippingFee.toFixed(2)}</span></div>` : ""}
        <div style="display: flex; justify-content: space-between; border-top: 2px solid #d1d5db; padding-top: 6px; font-weight: bold; font-size: 15px; color: #065f46;">
          <span>Net Payable:</span>
          <span>\u20B9${grandTotal.toFixed(2)}</span>
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
  static generateNonGstInvoiceHtml(data) {
    let subtotal = 0;
    data.discountAmount || 0;
    const lineItemsHtml = data.items.map((item, index) => {
      const itemDiscount = item.discount || 0;
      const lineTotal = Math.round((item.quantity * item.unitPrice - itemDiscount) * 100) / 100;
      subtotal += lineTotal;
      return `<tr>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${index + 1}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb;">
            <strong>${item.name}</strong>
            ${item.sku ? `<div style="font-size: 11px; color: #6b7280;">SKU: ${item.sku}</div>` : ""}
          </td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right;">\u20B9${item.unitPrice.toFixed(2)}</td>
          <td style="padding: 8px; border-bottom: 1px solid #e5e7eb; text-align: right; font-weight: 600;">\u20B9${lineTotal.toFixed(2)}</td>
        </tr>`;
    }).join("\n");
    const shippingFee = data.shippingFee || 0;
    const grandTotal = Math.round((subtotal + shippingFee - (data.discountAmount || 0)) * 100) / 100;
    const amountInWords = numberToIndianWords(grandTotal);
    const invoiceTitle = data.invoiceTitle || "RETAIL INVOICE";
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
    <button class="btn-print" onclick="window.print()">\u{1F5A8}\uFE0F Print / Save as PDF</button>
  </div>
  <div style="border: 1px solid #e5e7eb; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #4f46e5; padding-bottom: 16px; margin-bottom: 20px;">
      <div>
        ${data.seller.logoUrl ? `<img src="${data.seller.logoUrl}" alt="Logo" style="max-height: 50px; margin-bottom: 8px;" />` : ""}
        <h1 style="margin: 0 0 4px 0; font-size: 22px; color: #312e81;">${data.seller.tradeName || data.seller.name}</h1>
        <div style="color: #4b5563; font-size: 12px;">${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.phone ? `<div style="font-size: 12px;">Phone: ${data.seller.phone}</div>` : ""}
        ${data.seller.pan ? `<div style="font-size: 11px; font-weight: 600; margin-top: 2px;">PAN: ${data.seller.pan}</div>` : ""}
      </div>
      <div style="text-align: right;">
        <h2 style="margin: 0 0 6px 0; font-size: 18px; color: #4f46e5; text-transform: uppercase;">${invoiceTitle}</h2>
        <div style="font-weight: 600;">Invoice No: ${data.invoiceNumber}</div>
        <div>Date: ${data.invoiceDate}</div>
        <div>Order ID: #${data.orderId}</div>
        <div style="display: inline-block; margin-top: 4px; padding: 2px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; background: ${data.paymentMethod === "PREPAID" ? "#dcfce7; color: #166534;" : "#fef3c7; color: #92400e;"}">
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
        ${data.seller.bankDetails ? `<div style="margin-top: 12px; font-size: 11px; background: #eff6ff; padding: 8px; border-radius: 4px; border: 1px solid #bfdbfe;">
            <strong>Bank Transfer / Payment Info:</strong><br />
            Bank: ${data.seller.bankDetails.bankName} | A/C: ${data.seller.bankDetails.accountNumber} | IFSC: ${data.seller.bankDetails.ifsc}
            ${data.seller.bankDetails.upiId ? `<br />UPI ID: <strong>${data.seller.bankDetails.upiId}</strong>` : ""}
          </div>` : ""}
      </div>
      <div style="width: 280px; background: #f9fafb; padding: 12px; border-radius: 6px; border: 1px solid #e5e7eb;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Subtotal:</span>
          <span>\u20B9${subtotal.toFixed(2)}</span>
        </div>
        ${shippingFee > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px;">
          <span>Delivery / Shipping:</span>
          <span>\u20B9${shippingFee.toFixed(2)}</span>
        </div>` : ""}
        ${data.discountAmount && data.discountAmount > 0 ? `<div style="display: flex; justify-content: space-between; margin-bottom: 6px; color: #059669;">
          <span>Discount:</span>
          <span>-\u20B9${data.discountAmount.toFixed(2)}</span>
        </div>` : ""}
        <div style="display: flex; justify-content: space-between; padding-top: 8px; border-top: 2px solid #d1d5db; font-size: 15px; font-weight: 700; color: #312e81;">
          <span>Net Payable:</span>
          <span>\u20B9${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>

    <div style="display: flex; justify-content: space-between; align-items: flex-end; padding-top: 16px; border-top: 1px solid #e5e7eb;">
      <div style="font-size: 11px; color: #6b7280; max-width: 450px;">
        <strong>Terms & Conditions:</strong>
        <ul style="margin: 4px 0 0 0; padding-left: 16px;">
          ${(data.termsAndConditions || [
      `All disputes are subject to ${data.seller.city} jurisdiction.`,
      "Goods once sold can be returned/exchanged as per store return policy."
    ]).map((t) => `<li>${t}</li>`).join("")}
        </ul>
      </div>
      <div style="text-align: center;">
        <div style="font-weight: 600; margin-bottom: 20px;">For ${data.seller.tradeName || data.seller.name}</div>
        ${data.seller.signatureUrl ? `<img src="${data.seller.signatureUrl}" alt="Signature" style="max-height: 40px; margin-bottom: 4px;" /><br/>` : ""}
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
  static generateRetailInvoiceHtml(data) {
    return this.generateNonGstInvoiceHtml(data);
  }
  /**
   * Generates a Proforma Invoice (Quotation / Estimate) HTML before order confirmation
   */
  static generateProformaInvoiceHtml(data) {
    const rawHtml = this.generateTaxInvoiceHtml(data);
    let proformaHtml = rawHtml.replace(/<title>Tax Invoice/gi, "<title>Proforma Invoice").replace(/<h2[^>]*>TAX INVOICE<\/h2>/gi, '<h2 style="margin: 0 0 6px 0; font-size: 18px; color: #d97706; text-transform: uppercase;">PROFORMA INVOICE</h2>');
    if (data.validUntil) {
      proformaHtml = proformaHtml.replace(
        /<\/div>\s*<\/div>\s*<!-- Bill To/i,
        `<div style="font-size: 11px; color: #b45309; font-weight: 600; margin-top: 4px;">Quote Valid Until: ${data.validUntil}</div></div></div><!-- Bill To`
      );
    }
    return proformaHtml;
  }
  static generateCreditNoteHtml(data) {
    const taxResolution = determineTaxType(
      data.seller.gstin || data.seller.state,
      data.buyer.gstin || data.buyer.state
    );
    const isIntraState = taxResolution.isIntraState;
    const taxCalc = calculateGstBreakdown(data.items, data.refundShippingFee || 0, {
      taxMode: "INCLUSIVE",
      isIntraState
    });
    const refundAmount = data.totalRefundAmount !== void 0 ? data.totalRefundAmount : taxCalc.grandTotal;
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
    <button class="btn-print" onclick="window.print()">\u{1F5A8}\uFE0F Print Credit Note</button>
  </div>
  <div style="border: 2px solid #dc2626; border-radius: 8px; padding: 24px; max-width: 800px; margin: 0 auto;">
    <div style="display: flex; justify-content: space-between; border-bottom: 2px solid #dc2626; padding-bottom: 12px; margin-bottom: 16px;">
      <div>
        <h1 style="margin: 0; color: #991b1b; font-size: 22px;">${data.seller.tradeName || data.seller.name}</h1>
        <div>${data.seller.address}, ${data.seller.city}, ${data.seller.state} - ${data.seller.pincode}</div>
        ${data.seller.gstin ? `<div><strong>GSTIN:</strong> ${data.seller.gstin}</div>` : ""}
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
        ${taxCalc.items.map(
      (i) => `<tr>
          <td style="padding: 6px; border: 1px solid #e5e7eb;">${i.name}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: center;">${i.quantity}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">\u20B9${i.unitPrice.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">\u20B9${i.taxableAmount.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right;">\u20B9${i.totalTax.toFixed(2)}</td>
          <td style="padding: 6px; border: 1px solid #e5e7eb; text-align: right; font-weight: bold; color: #991b1b;">-\u20B9${i.lineTotal.toFixed(2)}</td>
        </tr>`
    ).join("")}
      </tbody>
    </table>
    <div style="display: flex; justify-content: space-between; align-items: center; border-top: 2px solid #dc2626; padding-top: 8px;">
      <div>
        <strong>Total Amount Credited in Words:</strong><br/>
        <span style="color: #991b1b; font-weight: 600;">${amountInWords}</span>
      </div>
      <div style="font-size: 16px; font-weight: bold; color: #991b1b;">
        Total Refund: \u20B9${refundAmount.toFixed(2)}
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
  /**
   * Generates a 3-inch (80mm) or 2-inch (58mm) Thermal POS / Delivery Receipt
   */
  static generateThermalReceiptHtml(data, widthMm = 80) {
    const widthStyle = widthMm === 58 ? "width: 48mm;" : "width: 72mm;";
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
    ${data.storeAddress ? `<div class="center">${data.storeAddress}</div>` : ""}
    ${data.storePhone ? `<div class="center">Ph: ${data.storePhone}</div>` : ""}
    ${data.gstin ? `<div class="center">GSTIN: ${data.gstin}</div>` : ""}
    <div class="divider"></div>
    <div>Rcpt #: ${data.receiptNumber}</div>
    <div>Order #: ${data.orderId}</div>
    <div>Date: ${data.date}</div>
    ${data.customerName ? `<div>Customer: ${data.customerName}</div>` : ""}
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between;" class="bold">
      <span>ITEM</span>
      <span>QTY x RATE = TOTAL</span>
    </div>
    <div class="divider"></div>
    ${data.items.map(
      (item) => `<div style="display: flex; justify-content: space-between; margin-bottom: 2px;">
      <span>${item.name.slice(0, 16)}</span>
      <span>${item.quantity} x \u20B9${item.price} = \u20B9${(item.quantity * item.price).toFixed(2)}</span>
    </div>`
    ).join("")}
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between;">
      <span>Subtotal:</span>
      <span>\u20B9${data.subtotal.toFixed(2)}</span>
    </div>
    ${data.discount && data.discount > 0 ? `<div style="display: flex; justify-content: space-between;">
      <span>Discount:</span>
      <span>-\u20B9${data.discount.toFixed(2)}</span>
    </div>` : ""}
    ${data.shippingFee && data.shippingFee > 0 ? `<div style="display: flex; justify-content: space-between;">
      <span>Delivery:</span>
      <span>\u20B9${data.shippingFee.toFixed(2)}</span>
    </div>` : ""}
    <div class="divider"></div>
    <div style="display: flex; justify-content: space-between; font-size: 13px;" class="bold">
      <span>NET PAYABLE:</span>
      <span>\u20B9${grandTotal.toFixed(2)}</span>
    </div>
    <div>Payment: ${data.paymentMethod}</div>
    <div class="divider"></div>
    <div class="center" style="font-size: 10px; margin-top: 4px;">
      ${data.footerMessage || "Thank you for shopping with us!"}
    </div>
  </div>
</body>
</html>`;
  }
  /**
   * Directly constructs InvoiceData from a @boostengine/cart instance
   */
  static fromCart(cart, context) {
    const items = cart.items.map((item) => ({
      name: item.name || item.title || "Cart Item",
      sku: item.sku,
      hsn: item.hsn || "6109",
      quantity: item.quantity,
      unitPrice: item.price,
      discount: item.discount || 0,
      taxRate: item.taxRate !== void 0 ? item.taxRate : 18
    }));
    return {
      invoiceNumber: context.invoiceNumber,
      invoiceDate: context.invoiceDate,
      orderId: context.orderId,
      seller: context.seller,
      buyer: context.buyer,
      paymentMethod: context.paymentMethod,
      shippingFee: context.shippingFee !== void 0 ? context.shippingFee : cart.shippingFee || 0,
      taxMode: context.taxMode || "INCLUSIVE",
      items
    };
  }
  /**
   * Generates a binary PDF Buffer on the server (Node.js/Next.js Route Handlers)
   */
  static async toPdfBuffer(html, options) {
    return renderHtmlToPdfBuffer(html, options);
  }
  /**
   * Programmatically triggers instant PDF download in client/browser environments
   */
  static downloadPdfInBrowser(html, filename = "Invoice.pdf") {
    downloadPdfInBrowser(html, filename);
  }
};

// src/agent.ts
var InvoicingAgentToolkit = class {
  /**
   * Generates JSON Schema definitions compatible with OpenAI, Claude, Gemini, LangChain, Vercel AI SDK
   */
  getFunctionSchemas() {
    return [
      {
        type: "function",
        function: {
          name: "validateGstin",
          description: "Validates an Indian 15-character GSTIN number, returning entity type, PAN, and state jurisdiction.",
          parameters: {
            type: "object",
            properties: {
              gstin: { type: "string", description: "The 15-digit GSTIN number (e.g. 27AAAAA0000A1Z5)" }
            },
            required: ["gstin"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "calculateTaxBreakdown",
          description: "Calculates Indian GST (CGST, SGST, IGST) breakdown and HSN summary based on seller and buyer locations.",
          parameters: {
            type: "object",
            properties: {
              sellerState: { type: "string", description: "Seller state or GSTIN (e.g. Maharashtra or 27AAAAA0000A1Z5)" },
              buyerState: { type: "string", description: "Buyer state or GSTIN (e.g. Karnataka or 29BBBBB1111B2Z6)" },
              shippingFee: { type: "number", description: "Shipping charge in Rupees" },
              taxMode: { type: "string", enum: ["INCLUSIVE", "EXCLUSIVE"], description: "Default is INCLUSIVE for D2C" },
              items: {
                type: "array",
                items: {
                  type: "object",
                  properties: {
                    name: { type: "string" },
                    hsn: { type: "string" },
                    quantity: { type: "number" },
                    unitPrice: { type: "number" },
                    taxRate: { type: "number" }
                  },
                  required: ["name", "quantity", "unitPrice"]
                }
              }
            },
            required: ["sellerState", "buyerState", "items"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "lookupHsnCode",
          description: "Looks up standard GST tax rate and product description for an Indian HSN code (e.g. 6109 for T-Shirts).",
          parameters: {
            type: "object",
            properties: {
              hsn: { type: "string", description: "HSN code to query (e.g. 6109, 8517, 3304)" }
            },
            required: ["hsn"]
          }
        }
      },
      {
        type: "function",
        function: {
          name: "generateInvoiceHtml",
          description: "Generates a print-ready, legally compliant Indian GST Tax Invoice HTML for customer orders.",
          parameters: {
            type: "object",
            properties: {
              invoiceNumber: { type: "string" },
              invoiceDate: { type: "string" },
              orderId: { type: "string" },
              paymentMethod: { type: "string" },
              seller: { type: "object" },
              buyer: { type: "object" },
              items: { type: "array" }
            },
            required: ["invoiceNumber", "invoiceDate", "orderId", "seller", "buyer", "items"]
          }
        }
      }
    ];
  }
  /**
   * Validates a GSTIN number
   */
  validateGstin(args) {
    return validateGSTIN(args.gstin);
  }
  /**
   * Looks up an HSN code
   */
  lookupHsn(args) {
    const entry = COMMON_HSN_DIRECTORY[args.hsn.trim()];
    if (entry) {
      return { found: true, ...entry };
    }
    return {
      found: false,
      hsn: args.hsn,
      standardGstRate: 18,
      description: "General Merchandise / Services"
    };
  }
  /**
   * Calculates GST breakdown
   */
  calculateTaxBreakdown(args) {
    const taxResolution = determineTaxType(args.sellerState, args.buyerState);
    return calculateGstBreakdown(args.items, args.shippingFee || 0, {
      taxMode: args.taxMode || "INCLUSIVE",
      isIntraState: taxResolution.isIntraState
    });
  }
  /**
   * Generates invoice HTML
   */
  generateInvoiceHtml(data) {
    return InvoiceGenerator.generateTaxInvoiceHtml(data);
  }
  /**
   * Generates credit note HTML
   */
  generateCreditNoteHtml(data) {
    return InvoiceGenerator.generateCreditNoteHtml(data);
  }
  /**
   * Generates bill of supply HTML for composition or exempt supplies
   */
  generateBillOfSupplyHtml(data) {
    return InvoiceGenerator.generateBillOfSupplyHtml(data);
  }
  /**
   * Generates non-GST / retail invoice / cash memo HTML for unregistered sellers
   */
  generateNonGstInvoiceHtml(data) {
    return InvoiceGenerator.generateNonGstInvoiceHtml(data);
  }
  /**
   * Generates proforma invoice (estimate / quotation) HTML
   */
  generateProformaInvoiceHtml(data) {
    return InvoiceGenerator.generateProformaInvoiceHtml(data);
  }
  /**
   * Generates thermal receipt HTML
   */
  generateThermalReceiptHtml(data, widthMm = 80) {
    return InvoiceGenerator.generateThermalReceiptHtml(data, widthMm);
  }
};

export { COMMON_HSN_DIRECTORY, GST_STATE_CODES, InvoiceGenerator, InvoicingAgentToolkit, calculateGstBreakdown, determineTaxType, downloadPdfInBrowser, generateBarcodeSvg, numberToIndianWords, renderHtmlToPdfBuffer, resolveStateCode, validateGSTIN };
//# sourceMappingURL=index.mjs.map
//# sourceMappingURL=index.mjs.map
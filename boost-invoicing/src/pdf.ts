/// <reference path="./pdf-shims.d.ts" />
/**
 * PDF Rendering Options & Universal Adapter Interface
 */
export interface PdfRendererOptions {
  format?: 'A4' | 'Letter' | 'Thermal4x6' | 'Thermal80mm' | string;
  margin?: {
    top?: string;
    bottom?: string;
    left?: string;
    right?: string;
  };
  printBackground?: boolean;
  landscape?: boolean;
  adapter?: (html: string, options?: PdfRendererOptions) => Promise<Buffer | Uint8Array>;
}

/**
 * Universal Server-Side PDF Generator
 * Renders HTML invoices into binary PDF Buffers.
 * Supports Puppeteer, Playwright, or custom cloud PDF endpoints.
 */
export async function renderHtmlToPdfBuffer(
  html: string,
  options: PdfRendererOptions = {}
): Promise<Buffer | Uint8Array> {
  // 1. If custom adapter is provided
  if (options.adapter) {
    return options.adapter(html, options);
  }

  // 2. Check for Node.js environment
  if (typeof window !== 'undefined') {
    throw new Error(
      '@boostengine/invoicing: renderHtmlToPdfBuffer is a server-side method. In browser/client environments, use window.print() or useInvoice().printInvoice() to save as PDF.'
    );
  }

  // 3. Auto-detect Puppeteer in Node runtime (supports both CommonJS and native ESM)
  try {
    let puppeteerModule: any;
    if (typeof require !== 'undefined') {
      try {
        puppeteerModule = require('puppeteer');
      } catch (_) {
        // Fallback to dynamic import if require fails
      }
    }

    if (!puppeteerModule) {
      puppeteerModule = await import('puppeteer');
    }

    const launcher = puppeteerModule?.default || puppeteerModule;
    if (!launcher || typeof launcher.launch !== 'function') {
      throw new Error("Puppeteer module was found but 'launch' function is not available.");
    }

    const browser = await launcher.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
    });

    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: 'networkidle0' });

    let pdfOptions: any = {
      format: options.format === 'Thermal4x6' ? undefined : (options.format || 'A4'),
      printBackground: options.printBackground !== undefined ? options.printBackground : true,
      landscape: Boolean(options.landscape),
      margin: options.margin || {
        top: '10mm',
        bottom: '10mm',
        left: '10mm',
        right: '10mm',
      },
    };

    if (options.format === 'Thermal4x6') {
      pdfOptions = {
        width: '4in',
        height: '6in',
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
        printBackground: true,
      };
    } else if (options.format === 'Thermal80mm') {
      pdfOptions = {
        width: '80mm',
        margin: { top: '0', bottom: '0', left: '0', right: '0' },
        printBackground: true,
      };
    }

    const pdfBuffer = await page.pdf(pdfOptions);
    await browser.close();
    return pdfBuffer;
  } catch (err: any) {
    if (
      err.code === 'MODULE_NOT_FOUND' ||
      err.code === 'ERR_MODULE_NOT_FOUND' ||
      err.message?.includes('Cannot find module') ||
      err.message?.includes('Failed to resolve module')
    ) {
      throw new Error(
        `@boostengine/invoicing: Server-side PDF generation requires 'puppeteer' or a custom adapter.\n` +
          `Please install Puppeteer:\n  npm install puppeteer\n\n` +
          `Or pass a custom adapter:\n  InvoiceGenerator.toPdfBuffer(html, { adapter: myCustomPdfFunction })`
      );
    }
    throw err;
  }
}

/**
 * Client-Side Instant PDF Download Helper (Triggers Browser Print / Save-to-PDF seamlessly)
 */
export function downloadPdfInBrowser(html: string, filename: string = 'Invoice.pdf'): void {
  if (typeof window === 'undefined') return;

  const iframe = document.createElement('iframe');
  iframe.style.position = 'fixed';
  iframe.style.top = '-9999px';
  iframe.style.left = '-9999px';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';

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
    }, 1000);
  }, 300);
}

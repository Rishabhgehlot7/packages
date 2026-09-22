/// <reference path="./shims.d.ts" />
'use client';

import { useMemo, useCallback } from 'react';
import { InvoiceGenerator } from '../invoice';
import {
  InvoiceData,
  NonGstInvoiceData,
  ProformaInvoiceData,
  ShippingLabelData,
  ThermalReceiptData,
  CreditNoteData,
  BillOfSupplyData,
} from '../types';
import { calculateGstBreakdown } from '../tax';
import { determineTaxType } from '../gst';
import { numberToIndianWords } from '../utils';

export interface UseInvoiceOptions {
  invoiceData?: InvoiceData;
  nonGstInvoiceData?: NonGstInvoiceData;
  proformaInvoiceData?: ProformaInvoiceData;
  billOfSupplyData?: BillOfSupplyData;
  creditNoteData?: CreditNoteData;
  shippingLabelData?: ShippingLabelData;
  thermalReceiptData?: ThermalReceiptData;
}

export function useInvoice(options: UseInvoiceOptions = {}) {
  const {
    invoiceData,
    nonGstInvoiceData,
    proformaInvoiceData,
    billOfSupplyData,
    creditNoteData,
    shippingLabelData,
    thermalReceiptData,
  } = options;

  // Real-time calculated tax breakdown
  const taxBreakdown = useMemo(() => {
    const data = invoiceData || proformaInvoiceData;
    if (!data) return null;
    const taxResolution = determineTaxType(
      data.seller.gstin || data.seller.state,
      data.buyer.gstin || data.buyer.state
    );
    return calculateGstBreakdown(data.items, data.shippingFee || 0, {
      taxMode: data.taxMode || 'INCLUSIVE',
      isIntraState: taxResolution.isIntraState,
    });
  }, [invoiceData, proformaInvoiceData]);

  // Amount in Indian words
  const amountInWords = useMemo(() => {
    if (taxBreakdown) {
      return numberToIndianWords(taxBreakdown.grandTotal);
    }
    if (nonGstInvoiceData) {
      const sub = nonGstInvoiceData.items.reduce((acc, i) => acc + i.quantity * i.unitPrice - (i.discount || 0), 0);
      return numberToIndianWords(Math.max(0, sub + (nonGstInvoiceData.shippingFee || 0) - (nonGstInvoiceData.discountAmount || 0)));
    }
    if (billOfSupplyData) {
      const subtotal = billOfSupplyData.items.reduce((acc, i) => acc + i.quantity * i.unitPrice - (i.discount || 0), 0);
      return numberToIndianWords(subtotal + (billOfSupplyData.shippingFee || 0));
    }
    if (creditNoteData) {
      const totalRefund = creditNoteData.totalRefundAmount !== undefined
        ? creditNoteData.totalRefundAmount
        : creditNoteData.items.reduce((acc, i) => acc + i.quantity * i.unitPrice - (i.discount || 0), 0);
      return numberToIndianWords(totalRefund);
    }
    return '';
  }, [taxBreakdown, nonGstInvoiceData, billOfSupplyData, creditNoteData]);

  // HTML strings
  const invoiceHtml = useMemo(() => {
    if (!invoiceData) return '';
    return InvoiceGenerator.generateTaxInvoiceHtml(invoiceData);
  }, [invoiceData]);

  const nonGstInvoiceHtml = useMemo(() => {
    if (!nonGstInvoiceData) return '';
    return InvoiceGenerator.generateNonGstInvoiceHtml(nonGstInvoiceData);
  }, [nonGstInvoiceData]);

  const proformaInvoiceHtml = useMemo(() => {
    if (!proformaInvoiceData) return '';
    return InvoiceGenerator.generateProformaInvoiceHtml(proformaInvoiceData);
  }, [proformaInvoiceData]);

  const billOfSupplyHtml = useMemo(() => {
    if (!billOfSupplyData) return '';
    return InvoiceGenerator.generateBillOfSupplyHtml(billOfSupplyData);
  }, [billOfSupplyData]);

  const creditNoteHtml = useMemo(() => {
    if (!creditNoteData) return '';
    return InvoiceGenerator.generateCreditNoteHtml(creditNoteData);
  }, [creditNoteData]);

  const shippingLabelHtml = useMemo(() => {
    if (!shippingLabelData) return '';
    return InvoiceGenerator.generateShippingLabelHtml(shippingLabelData);
  }, [shippingLabelData]);

  const thermalReceiptHtml = useMemo(() => {
    if (!thermalReceiptData) return '';
    return InvoiceGenerator.generateThermalReceiptHtml(thermalReceiptData, 80);
  }, [thermalReceiptData]);

  // Browser print helpers
  const printHtml = useCallback((htmlContent: string) => {
    if (typeof window === 'undefined' || !htmlContent) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    }
  }, []);

  const printInvoice = useCallback(() => printHtml(invoiceHtml), [printHtml, invoiceHtml]);
  const printNonGstInvoice = useCallback(() => printHtml(nonGstInvoiceHtml), [printHtml, nonGstInvoiceHtml]);
  const printProformaInvoice = useCallback(() => printHtml(proformaInvoiceHtml), [printHtml, proformaInvoiceHtml]);
  const printBillOfSupply = useCallback(() => printHtml(billOfSupplyHtml), [printHtml, billOfSupplyHtml]);
  const printCreditNote = useCallback(() => printHtml(creditNoteHtml), [printHtml, creditNoteHtml]);
  const printShippingLabel = useCallback(() => printHtml(shippingLabelHtml), [printHtml, shippingLabelHtml]);
  const printThermalReceipt = useCallback(() => printHtml(thermalReceiptHtml), [printHtml, thermalReceiptHtml]);

  return {
    taxBreakdown,
    amountInWords,
    grandTotal: taxBreakdown?.grandTotal || 0,
    invoiceHtml,
    nonGstInvoiceHtml,
    proformaInvoiceHtml,
    billOfSupplyHtml,
    creditNoteHtml,
    shippingLabelHtml,
    thermalReceiptHtml,
    printInvoice,
    printNonGstInvoice,
    printProformaInvoice,
    printBillOfSupply,
    printCreditNote,
    printShippingLabel,
    printThermalReceipt,
  };
}

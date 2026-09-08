/**
 * Converts a number into Indian Currency Words (e.g. 1499.50 -> "One Thousand Four Hundred Ninety-Nine Rupees and Fifty Paise Only")
 */
export function numberToIndianWords(amount: number): string {
  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen',
  ];
  const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  function convertTwoDigits(n: number): string {
    if (n < 20) return ones[n];
    const unit = n % 10;
    return tens[Math.floor(n / 10)] + (unit ? '-' + ones[unit] : '');
  }

  function convertThreeDigits(n: number): string {
    const hundred = Math.floor(n / 100);
    const remainder = n % 100;
    let str = '';
    if (hundred) str += ones[hundred] + ' Hundred';
    if (remainder) str += (str ? ' ' : '') + convertTwoDigits(remainder);
    return str;
  }

  const rounded = Math.round(amount * 100) / 100;
  const rupees = Math.floor(rounded);
  const paise = Math.round((rounded - rupees) * 100);

  if (rupees === 0 && paise === 0) return 'Zero Rupees Only';

  const crore = Math.floor(rupees / 10000000);
  const lakh = Math.floor((rupees % 10000000) / 100000);
  const thousand = Math.floor((rupees % 100000) / 1000);
  const remainder = rupees % 1000;

  const parts: string[] = [];
  if (crore) parts.push(convertThreeDigits(crore) + ' Crore');
  if (lakh) parts.push(convertTwoDigits(lakh) + ' Lakh');
  if (thousand) parts.push(convertTwoDigits(thousand) + ' Thousand');
  if (remainder) parts.push(convertThreeDigits(remainder));

  let words = parts.join(' ') + ' Rupees';
  if (paise > 0) {
    words += ' and ' + convertTwoDigits(paise) + ' Paise';
  }
  return words + ' Only';
}

/**
 * Generates an SVG pseudo-Code128 barcode representation for shipping labels
 */
export function generateBarcodeSvg(text: string, height = 45): string {
  const chars = text.replace(/[^A-Za-z0-9]/g, '');
  const barWidth = 2;
  const bars: string[] = [];
  let currentX = 10;

  for (let i = 0; i < chars.length; i++) {
    const code = chars.charCodeAt(i);
    // Deterministic pseudo-pattern based on char code bits
    for (let b = 0; b < 6; b++) {
      const isBlack = ((code >> b) & 1) === 1;
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
    ${bars.join('')}
    <text x="${totalWidth / 2}" y="${height + 12}" font-family="monospace" font-size="11" text-anchor="middle" fill="#000">${text}</text>
  </svg>`;
}

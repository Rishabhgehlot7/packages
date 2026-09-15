export function cn(...inputs: (string | boolean | undefined | null | { [key: string]: boolean })[]): string {
  const classes: string[] = [];
  for (const input of inputs) {
    if (!input) continue;
    if (typeof input === 'string') {
      classes.push(input);
    } else if (typeof input === 'object') {
      for (const key in input) {
        if (input[key]) classes.push(key);
      }
    }
  }
  return classes.join(' ');
}

export function hexToHsl(hex: string): { hsl: string; luminance: number } {
  if (!hex || typeof hex !== 'string') {
    return { hsl: '221 83% 53%', luminance: 0.5 };
  }
  
  hex = hex.replace(/^#/, '');

  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  const r_val = parseInt(hex.substring(0, 2), 16);
  const g_val = parseInt(hex.substring(2, 4), 16);
  const b_val = parseInt(hex.substring(4, 6), 16);

  const r = r_val / 255;
  const g = g_val / 255;
  const b = b_val / 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  h = Math.round(h * 360);
  s = Math.round(s * 100);
  l = Math.round(l * 100);
  
  const luminance = (0.299 * r_val + 0.587 * g_val + 0.114 * b_val) / 255;

  return { hsl: `${h} ${s}% ${l}%`, luminance };
}

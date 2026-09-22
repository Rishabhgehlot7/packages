/**
 * Classic Levenshtein Distance
 */
export function levenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const matrix: number[][] = [];
  for (let i = 0; i <= al; i++) {
    matrix[i] = [i];
  }
  for (let j = 0; j <= bl; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      matrix[i][j] = Math.min(
        matrix[i - 1][j] + 1,
        matrix[i][j - 1] + 1,
        matrix[i - 1][j - 1] + cost
      );
    }
  }

  return matrix[al][bl];
}

/**
 * Damerau-Levenshtein Distance: includes character transpositions (adjacent character swaps)
 * Highly effective for mobile keyboard slip-ups (e.g. "hooid" -> "hoodie")
 */
export function damerauLevenshtein(a: string, b: string): number {
  const al = a.length;
  const bl = b.length;
  if (al === 0) return bl;
  if (bl === 0) return al;

  const d: number[][] = [];
  for (let i = 0; i <= al; i++) {
    d[i] = [];
    d[i][0] = i;
  }
  for (let j = 0; j <= bl; j++) {
    d[0][j] = j;
  }

  for (let i = 1; i <= al; i++) {
    for (let j = 1; j <= bl; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      d[i][j] = Math.min(
        d[i - 1][j] + 1, // deletion
        d[i][j - 1] + 1, // insertion
        d[i - 1][j - 1] + cost // substitution
      );

      // Transposition
      if (i > 1 && j > 1 && a[i - 1] === b[j - 2] && a[i - 2] === b[j - 1]) {
        d[i][j] = Math.min(d[i][j], d[i - 2][j - 2] + 1);
      }
    }
  }

  return d[al][bl];
}

/**
 * Simplified Soundex Phonetic Code for eCommerce spelling variations
 */
export function soundex(str: string): string {
  const clean = str.toUpperCase().replace(/[^A-Z]/g, '');
  if (!clean) return '';

  const firstLetter = clean[0];
  const mappings: Record<string, string> = {
    B: '1', F: '1', P: '1', V: '1',
    C: '2', G: '2', J: '2', K: '2', Q: '2', S: '2', X: '2', Z: '2',
    D: '3', T: '3',
    L: '4',
    M: '5', N: '5',
    R: '6',
  };

  let code = firstLetter;
  let prev = mappings[firstLetter] || '0';

  for (let i = 1; i < clean.length && code.length < 4; i++) {
    const char = clean[i];
    const mapping = mappings[char] || '0';

    if (mapping !== '0' && mapping !== prev) {
      code += mapping;
    }
    prev = mapping;
  }

  return (code + '000').slice(0, 4);
}

/**
 * Robust token matcher combining exact, prefix, substring, Damerau-Levenshtein, and Soundex
 */
export function matchesToken(target: string, token: string): { matches: boolean; score: number } {
  const cleanTarget = target.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();

  if (!cleanTarget || !cleanToken) return { matches: false, score: 0 };

  // 1. Exact match
  if (cleanTarget === cleanToken) {
    return { matches: true, score: 10 };
  }

  // 2. Prefix match (critical for live autocomplete)
  if (cleanTarget.startsWith(cleanToken)) {
    const ratio = cleanToken.length / cleanTarget.length;
    return { matches: true, score: 7 + ratio * 2 };
  }

  // 3. Substring match
  if (cleanTarget.includes(cleanToken)) {
    return { matches: true, score: 5 };
  }

  // 4. Typo tolerance via Damerau-Levenshtein
  // For short tokens (<=3 chars), require exact prefix.
  // For 4-6 chars, allow 1 edit/transposition.
  // For >6 chars, allow 2 edits/transpositions.
  const maxDistance = cleanToken.length > 6 ? 2 : cleanToken.length > 3 ? 1 : 0;
  if (maxDistance > 0) {
    const dist = damerauLevenshtein(cleanTarget, cleanToken);
    if (dist <= maxDistance) {
      return { matches: true, score: Math.max(1, 4.5 - dist) };
    }
  }

  // 5. Phonetic match for tokens >= 4 chars
  if (cleanToken.length >= 4 && cleanTarget.length >= 4) {
    if (soundex(cleanTarget) === soundex(cleanToken)) {
      return { matches: true, score: 3.5 };
    }
  }

  return { matches: false, score: 0 };
}

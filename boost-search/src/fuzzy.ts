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

export function matchesToken(target: string, token: string): { matches: boolean; score: number } {
  const cleanTarget = target.toLowerCase().trim();
  const cleanToken = token.toLowerCase().trim();

  if (!cleanTarget || !cleanToken) return { matches: false, score: 0 };

  // Exact match
  if (cleanTarget === cleanToken) {
    return { matches: true, score: 10 };
  }

  // Prefix match
  if (cleanTarget.startsWith(cleanToken)) {
    return { matches: true, score: 7 };
  }

  // Substring match
  if (cleanTarget.includes(cleanToken)) {
    return { matches: true, score: 5 };
  }

  // Typo tolerance: if token length > 3, allow 1 typo; if > 6, allow 2 typos
  const maxDistance = cleanToken.length > 6 ? 2 : cleanToken.length > 3 ? 1 : 0;
  if (maxDistance > 0) {
    const dist = levenshtein(cleanTarget, cleanToken);
    if (dist <= maxDistance) {
      return { matches: true, score: Math.max(1, 4 - dist) };
    }
  }

  return { matches: false, score: 0 };
}

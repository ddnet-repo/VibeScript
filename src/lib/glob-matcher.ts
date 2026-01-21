import { minimatch } from 'minimatch';

export function matchesGlob(filePath: string, pattern: string): boolean {
  // Normalize path separators
  const normalizedPath = filePath.replace(/\\/g, '/');
  const normalizedPattern = pattern.replace(/\\/g, '/');

  return minimatch(normalizedPath, normalizedPattern, {
    dot: true,
    matchBase: true,
  });
}

export function matchesAnyGlob(filePath: string, patterns: string[]): boolean {
  return patterns.some(pattern => matchesGlob(filePath, pattern));
}

export function findMatchingGlob(filePath: string, patterns: string[]): string | null {
  for (const pattern of patterns) {
    if (matchesGlob(filePath, pattern)) {
      return pattern;
    }
  }
  return null;
}

export function filterByGlobs(files: string[], patterns: string[]): string[] {
  return files.filter(file => matchesAnyGlob(file, patterns));
}

export function parseGlobList(globString: string): string[] {
  return globString
    .split(',')
    .map(g => g.trim())
    .filter(Boolean);
}

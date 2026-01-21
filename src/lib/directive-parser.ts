import * as fs from 'node:fs';

export interface VibeDirectives {
  goal?: string;
  touch?: string;
  inputs?: string;
  outputs?: string;
  constraints?: string;
  tests?: string;
  risk?: string;
  rollback?: string;
  allowHumanEdits?: boolean;
  [key: string]: string | boolean | undefined;
}

export const REQUIRED_DIRECTIVES = [
  'goal',
  'touch',
  'inputs',
  'outputs',
  'constraints',
  'tests',
  'risk',
  'rollback',
] as const;

export function parseDirectives(filePath: string): VibeDirectives {
  const content = fs.readFileSync(filePath, 'utf-8');
  return parseDirectivesFromContent(content);
}

export function parseDirectivesFromContent(content: string): VibeDirectives {
  const directives: VibeDirectives = {};

  // Match // @vibe:key value pattern
  // Supports multi-word values until end of line
  const directiveRegex = /\/\/\s*@vibe:(\w+)\s+(.+?)$/gm;

  let match;
  while ((match = directiveRegex.exec(content)) !== null) {
    const key = match[1];
    const value = match[2].trim();

    if (key === 'allowHumanEdits') {
      directives[key] = value.toLowerCase() === 'true' || value === '1' || value === 'yes';
    } else {
      directives[key] = value;
    }
  }

  return directives;
}

export function getMissingDirectives(directives: VibeDirectives): string[] {
  const missing: string[] = [];

  for (const required of REQUIRED_DIRECTIVES) {
    if (!directives[required]) {
      missing.push(required);
    }
  }

  return missing;
}

export function validateDirectives(filePath: string): {
  valid: boolean;
  directives: VibeDirectives;
  missing: string[];
  errors: string[];
} {
  const directives = parseDirectives(filePath);
  const missing = getMissingDirectives(directives);
  const errors: string[] = [];

  if (missing.length > 0) {
    errors.push(`Missing required directives: ${missing.join(', ')}`);
  }

  // Validate risk level
  if (directives.risk && !['low', 'medium', 'high'].includes(directives.risk.toLowerCase())) {
    errors.push(`Invalid risk level: ${directives.risk}. Must be low, medium, or high.`);
  }

  // Validate touch is not empty
  if (directives.touch && directives.touch.trim() === '') {
    errors.push('Touch directive cannot be empty');
  }

  return {
    valid: errors.length === 0,
    directives,
    missing,
    errors,
  };
}

export function getTouchGlobs(directives: VibeDirectives): string[] {
  if (!directives.touch) {
    return [];
  }

  return directives.touch
    .split(',')
    .map(g => g.trim())
    .filter(Boolean);
}

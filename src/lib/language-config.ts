/**
 * Language configuration for VibeScript
 * Defines comment styles and file extensions for supported languages
 */

export interface LanguageConfig {
  name: string;
  commentStyle: 'line' | 'block';
  lineCommentPrefix: string;
  blockCommentStart?: string;
  blockCommentEnd?: string;
  vibeExtension: string;
  humanExtension: string;
  lockExtension: string;
  testPatterns: string[];
}

export const SUPPORTED_LANGUAGES: Record<string, LanguageConfig> = {
  typescript: {
    name: 'TypeScript',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.ts',
    humanExtension: '.human.ts',
    lockExtension: '.lock.ts',
    testPatterns: ['.test.ts', '.spec.ts', '__tests__/'],
  },
  javascript: {
    name: 'JavaScript',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.js',
    humanExtension: '.human.js',
    lockExtension: '.lock.js',
    testPatterns: ['.test.js', '.spec.js', '__tests__/'],
  },
  python: {
    name: 'Python',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.py',
    humanExtension: '.human.py',
    lockExtension: '.lock.py',
    testPatterns: ['test_', '_test.py', 'tests/'],
  },
  ruby: {
    name: 'Ruby',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.rb',
    humanExtension: '.human.rb',
    lockExtension: '.lock.rb',
    testPatterns: ['_test.rb', '_spec.rb', 'test/', 'spec/'],
  },
  go: {
    name: 'Go',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.go',
    humanExtension: '.human.go',
    lockExtension: '.lock.go',
    testPatterns: ['_test.go'],
  },
  rust: {
    name: 'Rust',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.rs',
    humanExtension: '.human.rs',
    lockExtension: '.lock.rs',
    testPatterns: ['_test.rs', 'tests/'],
  },
  php: {
    name: 'PHP',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.php',
    humanExtension: '.human.php',
    lockExtension: '.lock.php',
    testPatterns: ['Test.php', '_test.php', 'tests/'],
  },
  java: {
    name: 'Java',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.java',
    humanExtension: '.human.java',
    lockExtension: '.lock.java',
    testPatterns: ['Test.java', 'test/'],
  },
  csharp: {
    name: 'C#',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.cs',
    humanExtension: '.human.cs',
    lockExtension: '.lock.cs',
    testPatterns: ['Tests.cs', 'Test.cs', 'test/'],
  },
  swift: {
    name: 'Swift',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.swift',
    humanExtension: '.human.swift',
    lockExtension: '.lock.swift',
    testPatterns: ['Tests.swift', 'Test.swift'],
  },
  kotlin: {
    name: 'Kotlin',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.kt',
    humanExtension: '.human.kt',
    lockExtension: '.lock.kt',
    testPatterns: ['Test.kt', 'test/'],
  },
  scala: {
    name: 'Scala',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.scala',
    humanExtension: '.human.scala',
    lockExtension: '.lock.scala',
    testPatterns: ['Spec.scala', 'Test.scala'],
  },
  elixir: {
    name: 'Elixir',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.ex',
    humanExtension: '.human.ex',
    lockExtension: '.lock.ex',
    testPatterns: ['_test.exs', 'test/'],
  },
  dart: {
    name: 'Dart',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.dart',
    humanExtension: '.human.dart',
    lockExtension: '.lock.dart',
    testPatterns: ['_test.dart', 'test/'],
  },
  lua: {
    name: 'Lua',
    commentStyle: 'line',
    lineCommentPrefix: '--',
    vibeExtension: '.vibe.lua',
    humanExtension: '.human.lua',
    lockExtension: '.lock.lua',
    testPatterns: ['_test.lua', '_spec.lua', 'test/', 'spec/'],
  },
  shell: {
    name: 'Shell',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.sh',
    humanExtension: '.human.sh',
    lockExtension: '.lock.sh',
    testPatterns: ['_test.sh', 'test/'],
  },
  clojure: {
    name: 'Clojure',
    commentStyle: 'line',
    lineCommentPrefix: ';',
    vibeExtension: '.vibe.clj',
    humanExtension: '.human.clj',
    lockExtension: '.lock.clj',
    testPatterns: ['_test.clj', 'test/'],
  },
  haskell: {
    name: 'Haskell',
    commentStyle: 'line',
    lineCommentPrefix: '--',
    vibeExtension: '.vibe.hs',
    humanExtension: '.human.hs',
    lockExtension: '.lock.hs',
    testPatterns: ['Spec.hs', 'Test.hs', 'test/'],
  },
  crystal: {
    name: 'Crystal',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.cr',
    humanExtension: '.human.cr',
    lockExtension: '.lock.cr',
    testPatterns: ['_spec.cr', 'spec/'],
  },
  r: {
    name: 'R',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.R',
    humanExtension: '.human.R',
    lockExtension: '.lock.R',
    testPatterns: ['test_', 'test-', 'tests/'],
  },
  julia: {
    name: 'Julia',
    commentStyle: 'line',
    lineCommentPrefix: '#',
    vibeExtension: '.vibe.jl',
    humanExtension: '.human.jl',
    lockExtension: '.lock.jl',
    testPatterns: ['_test.jl', 'test/'],
  },
  zig: {
    name: 'Zig',
    commentStyle: 'line',
    lineCommentPrefix: '//',
    vibeExtension: '.vibe.zig',
    humanExtension: '.human.zig',
    lockExtension: '.lock.zig',
    testPatterns: ['_test.zig', 'test/'],
  },
};

/**
 * Detects the language configuration from a file path
 */
export function detectLanguage(filePath: string): LanguageConfig | null {
  for (const [, config] of Object.entries(SUPPORTED_LANGUAGES)) {
    if (
      filePath.endsWith(config.vibeExtension) ||
      filePath.endsWith(config.humanExtension) ||
      filePath.endsWith(config.lockExtension)
    ) {
      return config;
    }
  }
  return null;
}

/**
 * Gets all vibe extensions across all languages
 */
export function getAllVibeExtensions(): string[] {
  return Object.values(SUPPORTED_LANGUAGES).map(config => config.vibeExtension);
}

/**
 * Gets all human extensions across all languages
 */
export function getAllHumanExtensions(): string[] {
  return Object.values(SUPPORTED_LANGUAGES).map(config => config.humanExtension);
}

/**
 * Gets all lock extensions across all languages
 */
export function getAllLockExtensions(): string[] {
  return Object.values(SUPPORTED_LANGUAGES).map(config => config.lockExtension);
}

/**
 * Checks if a file is a vibe file in any supported language
 */
export function isVibeFile(filePath: string): boolean {
  return getAllVibeExtensions().some(ext => filePath.endsWith(ext));
}

/**
 * Checks if a file is a human file in any supported language
 */
export function isHumanFile(filePath: string): boolean {
  return getAllHumanExtensions().some(ext => filePath.endsWith(ext));
}

/**
 * Checks if a file is a lock file in any supported language
 */
export function isLockFile(filePath: string): boolean {
  return getAllLockExtensions().some(ext => filePath.endsWith(ext));
}

/**
 * Checks if a file is a test file based on language-specific patterns
 */
export function isTestFile(filePath: string): boolean {
  const config = detectLanguage(filePath);
  
  // If we can detect the language, use its patterns
  if (config) {
    return config.testPatterns.some(pattern => 
      filePath.includes(pattern) || filePath.endsWith(pattern)
    );
  }
  
  // Fallback: check all patterns
  const allPatterns = Object.values(SUPPORTED_LANGUAGES).flatMap(c => c.testPatterns);
  return allPatterns.some(pattern => 
    filePath.includes(pattern) || filePath.endsWith(pattern)
  );
}

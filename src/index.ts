// Main exports for vibescript package

export { runVibeChecker } from './lib/vibe-checker.js';
export { runVibeGuard, type OwnershipConfig } from './lib/vibe-guard.js';
export { runVibeManifest, listManifests, getLatestManifest, validateManifest, type ManifestMetadata } from './lib/vibe-manifest.js';

export {
  parseDirectives,
  parseDirectivesFromContent,
  validateDirectives,
  getMissingDirectives,
  getTouchGlobs,
  REQUIRED_DIRECTIVES,
  type VibeDirectives,
} from './lib/directive-parser.js';

export {
  matchesGlob,
  matchesAnyGlob,
  findMatchingGlob,
  filterByGlobs,
  parseGlobList,
} from './lib/glob-matcher.js';

export {
  getBaseRef,
  getChangedFiles,
  getStagedFiles,
  isGitRepo,
  getCurrentBranch,
  getRepoRoot,
} from './lib/git-utils.js';

export {
  createReport,
  formatReport,
  writeReport,
  printReport,
  type Report,
  type Violation,
} from './lib/report.js';

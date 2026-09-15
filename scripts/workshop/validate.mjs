import { spawnSync } from 'node:child_process';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readResults, verifyResults } from './results.mjs';

const root = fileURLToPath(new URL('../../', import.meta.url));
const mode = process.argv[2];
if (!['baseline', 'local', 'complete'].includes(mode) || process.argv.length !== 3) {
  console.error('Usage: node scripts/workshop/validate.mjs baseline|local|complete');
  process.exit(2);
}
const requirements = JSON.parse(readFileSync(new URL('./requirements.json', import.meta.url), 'utf8'));
const git = (...args) => {
  const result = spawnSync('git', args, { cwd: root, encoding: 'utf8' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(result.stderr);
  return result.stdout.trim();
};

const revision = git('rev-parse', 'HEAD');
const dirty = git('status', '--porcelain').length > 0;
const outputRoot = resolve(root, 'TestResults', 'workshop');
mkdirSync(outputRoot, { recursive: true });
// A fresh directory prevents an old successful TRX from masking a failed run.
const resultsDirectory = mkdtempSync(join(outputRoot, `${mode}-`));
const args = [
  'test', 'net-users-api.tests/net-users-api.tests.csproj',
  '--configuration', 'Release',
  '--logger', 'trx;LogFileName=results.trx', '--results-directory', resultsDirectory,
];
if (mode === 'baseline') args.push('--filter', requirements.baselineFilter);
if (mode === 'local') args.push('--filter', requirements.localFilter);
console.log(`Revision: ${revision}${dirty ? ' + working-tree changes (not an immutable tested SHA)' : ' (clean)'}`);
console.log(`Command: dotnet ${args.join(' ')}`);
const run = spawnSync('dotnet', args, { cwd: root, stdio: 'inherit' });
if (run.error) throw run.error;
if (run.status !== 0) process.exit(run.status ?? 1);

try {
  const results = readResults(readFileSync(join(resultsDirectory, 'results.trx'), 'utf8'));
  const required = [
    ...requirements.baseline,
    ...(mode === 'baseline' ? [] : requirements.local),
    ...(mode === 'complete' ? requirements.cloud : []),
  ];
  const count = verifyResults(results, required);
  if (revision !== git('rev-parse', 'HEAD')) throw new Error('HEAD changed during validation; rerun at a stable checkpoint.');
  const summary = {
    mode, revision, dirty, command: ['dotnet', ...args], passed: count,
    required, results, recordedAt: new Date().toISOString(),
  };
  writeFileSync(join(resultsDirectory, 'evidence.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(`PASS: ${count} executed tests; mode=${mode}. Evidence: ${join(resultsDirectory, 'evidence.json')}`);
  if (mode === 'baseline') console.log('Baseline only: DELETE remains an exercise. This is not feature-completion evidence.');
} catch (error) {
  console.error(`VALIDATION FAILED: ${error.message}`);
  process.exit(1);
}

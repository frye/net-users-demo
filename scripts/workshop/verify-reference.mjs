import { spawnSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const source = fileURLToPath(new URL('../../', import.meta.url));
const revision = process.argv[2];
if (!/^[0-9a-f]{40}$/.test(revision ?? '') || process.argv.length !== 3) {
  console.error('Usage: node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA>');
  console.error('Uses only that committed snapshot, not uncommitted files. Never applies the answer to your checkout.');
  process.exit(2);
}
function run(command, args, cwd, capture = false) {
  const result = spawnSync(command, args, { cwd, encoding: 'utf8', stdio: capture ? 'pipe' : 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) throw new Error(`${command} ${args.join(' ')} failed (${result.status})${capture ? `: ${result.stderr}` : ''}`);
  return result.stdout?.trim();
}

let temporary;
let checkout;
let evidenceDirectory;
try {
  run('git', ['cat-file', '-e', `${revision}^{commit}`], source);
  const evidenceRoot = join(source, 'TestResults', 'reference');
  mkdirSync(evidenceRoot, { recursive: true });
  evidenceDirectory = mkdtempSync(join(evidenceRoot, `${revision.slice(0, 12)}-`));
  temporary = mkdtempSync(join(tmpdir(), 'net-users-reference-'));
  checkout = join(temporary, 'checkout');
  run('git', ['clone', '--quiet', '--no-hardlinks', '--no-checkout', source, checkout], source);
  run('git', ['checkout', '--quiet', '--detach', revision], checkout);
  const controller = readFileSync(join(checkout, 'net-users-api/Controllers/UsersController.cs'), 'utf8');
  if (!controller.includes('throw new NotImplementedException("DeleteUser functionality not yet implemented")')) {
    throw new Error('Selected revision is not the workshop starter: DELETE stub is missing.');
  }
  run('dotnet', ['restore', 'net-users-demo.sln'], checkout);
  run('dotnet', ['build', 'net-users-demo.sln', '--configuration', 'Release', '--no-restore'], checkout);
  run('node', ['scripts/workshop/validate.mjs', 'baseline'], checkout);

  const patchPath = 'workshop/reference/delete.patch';
  const patchSha256 = createHash('sha256').update(readFileSync(join(checkout, patchPath))).digest('hex');
  run('git', ['apply', '--check', patchPath], checkout);
  const localPaths = [
    'net-users-api/Controllers/UsersController.cs',
    'net-users-api.tests/Controllers/DeleteUserTests.cs',
  ];
  run('git', ['apply', ...localPaths.map(path => `--include=${path}`), patchPath], checkout);
  run('node', ['scripts/workshop/validate.mjs', 'local'], checkout);
  run('git', ['apply', ...localPaths.map(path => `--exclude=${path}`), patchPath], checkout);
  run('git', ['add', '--', 'net-users-api/Controllers/UsersController.cs', 'net-users-api/net-users-api.http', 'net-users-api.tests'], checkout);
  const solutionTree = run('git', ['write-tree'], checkout, true);
  run('node', ['scripts/workshop/validate.mjs', 'complete'], checkout);
  run('node', ['scripts/workshop/validate.mjs', 'complete'], checkout);
  const summary = { starterCommit: revision, patchSha256, solutionTree, baseline: 'passed', localRecovery: 'passed', completedSolutionRuns: 2 };
  writeFileSync(join(evidenceDirectory, 'reference.json'), `${JSON.stringify(summary, null, 2)}\n`);
  console.log(JSON.stringify(summary, null, 2));
  console.log('Verified in a disposable clone. No solution branch, tag, or PR was created; original source unchanged.');
} catch (error) {
  console.error(`REFERENCE VERIFICATION FAILED: ${error.message}`);
  process.exitCode = 1;
} finally {
  try {
    if (checkout && existsSync(join(checkout, 'TestResults'))) {
      cpSync(join(checkout, 'TestResults'), join(evidenceDirectory, 'tests'), { recursive: true });
      console.log(`Retained reference test evidence: ${evidenceDirectory}`);
    }
  } finally {
    if (temporary) rmSync(temporary, { recursive: true, force: true });
  }
}

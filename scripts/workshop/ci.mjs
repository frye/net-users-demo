import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
function run(args) {
  const result = spawnSync(process.execPath, args, { cwd: root, stdio: 'inherit' });
  if (result.error) throw result.error;
  if (result.status !== 0) process.exit(result.status ?? 1);
}
run(['scripts/workshop/validate.mjs', 'baseline']);
const controller = readFileSync(new URL('../../net-users-api/Controllers/UsersController.cs', import.meta.url), 'utf8');
if (controller.includes('throw new NotImplementedException("DeleteUser functionality not yet implemented")')) {
  console.log('STARTER checks only in this checkout. Verifying the separate reference, not claiming the exercise is complete.');
  const revision = spawnSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' });
  if (revision.error) throw revision.error;
  if (revision.status !== 0) throw new Error(revision.stderr);
  run(['scripts/workshop/verify-reference.mjs', revision.stdout.trim()]);
} else {
  console.log('DELETE changed: full local and HTTP exercise evidence is required; missing/skipped tests are failures.');
  run(['scripts/workshop/validate.mjs', 'complete']);
}

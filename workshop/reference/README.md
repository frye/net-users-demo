# Facilitator reference and recovery

The normal API is the **starter**, not a completed DELETE solution. The answer is
kept in `delete.patch`, outside compiled source. Do not apply it to a participant's
working tree or use it instead of the local TDD exercise.

The sanitized [verification record](verification.json) names an actually executed
starter commit: 21 baseline tests and 28 completed-solution tests on each of two
runs, with no failures or skips. It is historical evidence for that exact snapshot,
not a claim that later commits or client/cloud sessions have been rehearsed.

## Reproducible verification

Use the exact SDK in `global.json`, Git, and Node.js 22 or newer. From a committed
starter checkout:

```sh
git status --short
git rev-parse HEAD
node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA>
```

Replace the placeholder with the 40-character commit printed above. The verifier
uses only that committed snapshot, not uncommitted changes. It creates a
disposable local clone, checks the starter stub, restores/builds the solution,
runs the actual baseline, checks/applies the patch, and runs the complete
controller/HTTP exercise checks twice. It prints the starter commit, patch SHA-256,
and resulting Git tree ID. These together reproduce the prepared answer; a
moving branch name alone is not a checkpoint.

The temporary clone is removed on success or failure. The original checkout,
branch, remote, running API process, and participant data are not changed. The
verifier creates no branch, tag, remote task, or PR. CI runs this verification
for the starter. Once DELETE changes, CI instead requires complete exercise
evidence from that implementation. CI success on the starter does **not** mean
that its DELETE endpoint works.

For retained local evidence:

```sh
node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA> > reference-verification.log 2>&1
```

Check the command's exit status and read the full log. The `*.log` file is ignored
by Git; do not publish private machine paths from logs. A facilitator can retain
sanitized counts and the input/output IDs with the workshop record. Normal
validation retains TRX and JSON evidence under ignored `TestResults/workshop/`.
The reference verifier also copies baseline/completed TRX and JSON results to
ignored `TestResults/reference/` before removing its temporary clone; CI retains
these with the other test artifacts. Source files remain unchanged.

## Recovery without overwriting work

- Stop the previous writer. Record the actual branch, HEAD, dirty state, and
  incomplete criteria in the guide's checkpoint template. Never reset/clean
  a participant checkout to make it match a demonstration.
- If local implementation is incomplete at C2, keep it intact. In a *different,
  explicitly prepared checkout*, demonstrate the verified reference as a
  **prepared result**, not a successful live participant run.
- If cloud access/setup/approval fails, inspect the logs and record the blocker.
  Continue the bounded HTTP regression locally if authorized, or observe the
  prepared result. Do not claim a local test run proves cloud or Mobile execution.
- If the cloud timebox ends while work is running, record the actual session/PR
  and next writer. Do not start another task/PR or extend the 60-minute workshop.
- If Mobile is unavailable, review the same task in a browser and label that
  fallback as browser participation, not a Mobile rehearsal.
- On cloud-to-local return, stop the cloud writer, fetch and inspect its branch,
  verify the recorded PR head, and enter a clean checkout. In-memory runtime users
  do not transfer with source commits.

## Publication and rehearsal gates

No workshop starter/solution tags are created by these tools. The repository owner
coordinates named reference publication and Pages deployment. Do not distribute
an unverified solution ref or label the target Pages URL live from a build alone.

The required live route still needs rehearsal with the installed client versions
and authorized accounts: VS Code plan -> CLI implementation -> Copilot app
verification -> cloud follow-up -> Mobile review. Product documentation checks,
HTML browser tests, and API tests are not a substitute. Record version, repository,
base/pushed SHA, setup output, actual commands/results, PR head, and any approval
gates separately. Use only synthetic public data; keep local paths/account details
out of public PR evidence.

The guide includes the portable handoff record, complete task criteria, client
prework, access alternatives, and fixed agenda. Existing issue 7 and PRs 8/13 are
historical references only; do not mutate them for a repeated workshop run.

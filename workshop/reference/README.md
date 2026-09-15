# Facilitator reference and recovery

The normal API is the **starter**, not a completed DELETE solution. The answer is
kept in `delete.patch`, outside compiled source. Use it only if you want a working
recovery example or a comparison. Never apply it over unfinished participant work.
If everything is working, ignore C0-C4 and continue: they are optional recovery
labels, not handoff requirements, required commits, or forms to submit.

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
runs the actual baseline, applies/verifies the local C2/C3 recovery subset, then
applies the remaining patch and runs the complete C4 checks twice. It prints the starter commit, patch SHA-256,
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

## Optional recovery copies

There are three runnable states, not five required saves:

| Label | Working state | Where to resume |
| --- | --- | --- |
| C0 / C1 | Starter; DELETE still unfinished | Setup or the reusable planning prompt |
| C2 / C3 | Local DELETE handler and tests | Review or the HTTP follow-up |
| C4 | Completed handler, local tests, and HTTP regression | Final comparison/review |

If you get stuck, stop the agent that is editing and **keep your current folder**.
Use a new folder for the recovery copy. Replace the directory and full starter
SHA below with the facilitator's prepared version; do not use a completed
solution SHA. The source push URL is deliberately disabled to keep the shared
repository read-only.

```sh
git clone https://github.com/frye/net-users-demo.git <new-recovery-directory>
cd <new-recovery-directory>
git remote set-url --push origin https://example.invalid/no-workshop-push
git switch --detach <full-starter-commit-SHA>
node scripts/workshop/validate.mjs baseline
```

That is the **C0/C1 starter**. If you only lost the plan, use the guide's task
prompt in this copy; there is no separate C1 code snapshot.

For **C2/C3**, apply only the local handler/tests in that fresh starter:

```sh
git apply --check --include=net-users-api/Controllers/UsersController.cs --include=net-users-api.tests/Controllers/DeleteUserTests.cs workshop/reference/delete.patch
git apply --include=net-users-api/Controllers/UsersController.cs --include=net-users-api.tests/Controllers/DeleteUserTests.cs workshop/reference/delete.patch
node scripts/workshop/validate.mjs local
```

Continue the HTTP regression in this same local copy. C3 is not a publishing gate.
To use **C4 instead**, start from another fresh starter and apply the entire patch:

```sh
git apply --check workshop/reference/delete.patch
git apply workshop/reference/delete.patch
node scripts/workshop/validate.mjs complete
```

Choose one recipe per fresh copy; do not reapply the full patch over C2/C3 edits.
These commands leave changes local and do not create a branch, commit, PR, or task.
You can use the resulting folder in any local client without a checkpoint commit.
Prepared code is a legitimate recovery aid, but not evidence that you generated
the result live.

All lab work stays local by default. An upstream is optional and must be private,
user-owned, and allowed by policy. Never push or submit work to the shared sample,
comment on its practice issues/PRs, or use it for participant cloud tasks. Keep
the shared source's push URL disabled even if you add a separate personal remote.

If cloud or Mobile is unavailable, finish locally or observe. A local API result
does not prove cloud/Mobile execution. In-memory users also do not transfer with
source files or session history.

## Publication and rehearsal gates

No workshop starter/solution tags are created by these tools. The repository owner
coordinates named reference publication and Pages deployment. Do not distribute
an unverified solution ref or label the target Pages URL live from a build alone.

Rehearse the chosen client route with approved accounts. The default exercise uses
local planning, implementation, and HTTP checks; cloud/Mobile can be read-only
orientation or approved local remote control. An explicitly chosen private
user-owned upstream can support optional cloud/Mobile work without submitting
anything to the shared sample. Documentation, browser tests, and API tests are
not substitutes for those client interactions. Describe only what actually ran.

The guide includes reusable prompts, an optional recovery note, task criteria,
client prework, and the fixed agenda. Existing issue 7 and PRs 8/13 are historical
references only; do not mutate them for a repeated workshop run.

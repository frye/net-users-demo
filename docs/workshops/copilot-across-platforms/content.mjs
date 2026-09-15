// Edit this source, then run node scripts/build-workshop-guide.mjs.
export const meta = {
  title: 'Copilot Across Platforms',
  subtitle: 'One DELETE exercise. Five clients. Evidence at every handoff.',
  repo: 'https://github.com/frye/net-users-demo',
  verified: '2026-09-14',
  deployment: 'https://frye.github.io/net-users-demo/',
  status: 'Public documentation verified; installed-client and live cloud rehearsal remain separate gates. The deployment URL is a target, not a claim that this site is live.',
};

export const clients = [
  { id: 'vscode', name: 'VS Code', description: 'Local planning and editing; optional Cloud target' },
  { id: 'cli', name: 'Copilot CLI', description: 'Standalone copilot; local tools or explicit cloud delegation' },
  { id: 'app', name: 'Copilot app', description: 'Local repository sessions; not GitHub Desktop' },
  { id: 'cloud', name: 'Cloud agent / GitHub.com', description: 'Published Git state in an ephemeral cloud environment' },
  { id: 'mobile', name: 'GitHub Mobile', description: 'Cloud task control and PR review; not a local .NET runtime' },
];

export const commands = {
  clone: {
    title: 'Optional public sample setup — only if local cloning is permitted',
    language: 'sh',
    text: 'git clone https://github.com/frye/net-users-demo.git\ncd net-users-demo\ngit switch -c workshop/delete-practice',
  },
  identity: {
    title: 'Record local identity — keep the checkout path private',
    language: 'sh',
    text: 'git remote -v\ngit rev-parse --show-toplevel\ngit branch --show-current\ngit rev-parse HEAD\ngit status --short',
  },
  baseline: {
    title: 'C0 preparation and existing-route baseline — not DELETE success',
    language: 'sh',
    text: 'node --version\nnode -p "JSON.parse(require(\'node:fs\').readFileSync(\'global.json\', \'utf8\')).sdk.version"\ndotnet --version\ndotnet restore net-users-demo.sln\ndotnet build net-users-demo.sln --no-restore\ndotnet test net-users-api.tests/net-users-api.tests.csproj\nnode scripts/workshop/validate.mjs baseline',
  },
  local: {
    title: 'C2 local DELETE validation',
    language: 'sh',
    text: 'dotnet build net-users-demo.sln --no-restore\ndotnet test net-users-api.tests/net-users-api.tests.csproj\nnode scripts/workshop/validate.mjs local\ngit diff --check\ngit diff',
  },
  complete: {
    title: 'Final validation — includes the HTTP repeated-delete regression',
    language: 'sh',
    text: 'dotnet restore net-users-demo.sln\ndotnet build net-users-demo.sln --no-restore\ndotnet test net-users-api.tests/net-users-api.tests.csproj\nnode scripts/workshop/validate.mjs complete\ngit rev-parse HEAD\ngit status --short',
  },
  cliStart: {
    title: 'Start the standalone CLI from the approved checkout',
    language: 'sh',
    text: 'copilot',
  },
  cliContext: {
    title: 'Inside an interactive CLI session — not shell commands',
    language: 'text',
    text: '/help\n/cwd\n!git status --short\n!git branch --show-current\n!git rev-parse HEAD',
  },
  cliResume: {
    title: 'Choose a previous CLI session from the shell',
    language: 'sh',
    text: 'copilot --resume',
  },
  published: {
    title: 'Verify the published branch — replace the placeholder before running',
    language: 'sh',
    text: 'git rev-parse HEAD\ngit ls-remote origin refs/heads/<working-branch>',
  },
  returnLocal: {
    title: 'Cloud → local inspection — stop the cloud writer first; fill placeholders',
    language: 'sh',
    text: 'git status --short\ngit fetch origin\ngit show --stat <PR-head-SHA>\ngit diff <published-C3-SHA>...<PR-head-SHA>',
  },
  reference: {
    title: 'Instructor recovery verification — replace with the full immutable starter commit',
    language: 'sh',
    text: 'node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA>',
  },
};

export const acceptance = [
  'DELETE /api/v1/users/{id}: an existing ID returns 204 with an empty response body and removes that user.',
  'A missing ID and a repeated deletion return 404 with exactly the error contract {"error":"User not found"}.',
  'Unrelated users remain unchanged. Preserve all existing GET, POST, PUT, and HTML behavior.',
  'Use the injected structured logger and include the requested ID. Do not interpolate away the structured ID field.',
  'Write meaningful local DELETE tests using the exact names in scripts/workshop/requirements.json and [Trait("Workshop", "Delete")]. Derive test classes from NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh per-case state, and preserve globally serialized tests.',
  'The bounded follow-up adds an HTTP repeated-delete regression using the prepared UsersApiFactory (WebApplicationFactory) and request examples. One task and one PR, not a second implementation.',
];

export const templates = {
  task: {
    file: 'task-template.md',
    title: 'Bounded local task prompt',
    text: `Task: implement only DELETE /api/v1/users/{id} in the prepared public sample.
Repository: https://github.com/frye/net-users-demo
Base branch: <base-branch>; working branch: <working-branch>; starting SHA: <C0-SHA>.
Read the repository instructions, controller, prepared tests and scripts/workshop/requirements.json first.
Plan before editing. Name the exact files and tests, explain risks, and wait for my approval.
Acceptance criteria:
${acceptance.map((item, i) => `${i + 1}. ${item}`).join('\n')}
Implement local tests and the handler first; reserve the HTTP follow-up for the next writer.
Do not redesign storage, add a reset endpoint, relax tests, alter unrelated routes, or change CI.
Use the prepared NetUsersApi.Tests.Infrastructure.UserStoreTest base class for fresh per-case state;
do not add parallel mutation of static users.
Validate with the C2 commands and report command, result, test count, and tested SHA/dirty state.
Do not commit, push, start cloud work, or create a PR without a separate explicit authorization.
If blocked, report the blocker and next action. Do not claim baseline-only checks prove DELETE works.`,
  },
  handoff: {
    file: 'handoff-template.md',
    title: 'Checkpoint and handoff record — fill locally',
    text: `Checkpoint: <C0 | C1 | C2 | C3 | C4>
Task: <same DELETE exercise and bounded remaining work>
Repository URL: <approved-repository-URL>
Private checkout/worktree path: <fill locally only; redact before sharing publicly or with cloud>
Base branch: <base-branch>
Working branch: <working-branch>
HEAD: <full-immutable-SHA>
State: <clean/dirty; local-only/pushed; published-SHA-or-not-pushed>
Approved plan: <bounded-plan-text-or-link>
Approval: <who-approved-what-and-when; publishing/usage-approval-separately>
Completed criteria: <criteria-with-evidence>
Remaining criteria: <criteria-not-yet-met>
Exact commands and results: <commands, exit-codes, executed-test-counts, failures>
Tested SHA and worktree state: <SHA; clean-or-described-uncommitted-diff>
PR link and PR head: <URL-and-SHA-or-none>
Session link: <URL-or-local-session-identifier-or-none>
Previous writer stopped: <yes/no; how verified>
Receiving worktree base verified: <path-locally-only, branch, HEAD; match/mismatch>
Next writer/action: <one owner and one bounded action>
Outcome: <completed | running | blocked | observation-only; do-not-infer-success>`,
  },
  cloud: {
    file: 'cloud-followup-template.md',
    title: 'Bounded cloud follow-up — use once, only after C3',
    text: `Continue the same DELETE exercise, not a new implementation.
Repository: <approved-repository-URL>
Base branch selected in the client: <published-working-branch>
Required published base SHA: <C3-SHA>
Verify this SHA is available and is the expected starting point; report mismatch and stop.
Read global.json and use its exact SDK version with rollForward disabled; do not guess a separate cloud SDK pin.
Local handler and named DELETE tests are already reviewed and passing at C2/C3.
Add ONLY the HTTP repeated-delete regression using the prepared UsersApiFactory (WebApplicationFactory),
NetUsersApi.Tests.Infrastructure.UserStoreTest base class for fresh per-case state,
scripts/workshop/requirements.json names and existing request examples.
Prove first DELETE returns 204 with no body, a second returns 404 with
{"error":"User not found"}, and unrelated users are unchanged.
Preserve existing routes, storage, test serialization and CI. Do not add a reset endpoint.
Run dotnet restore net-users-demo.sln
Run dotnet build net-users-demo.sln --no-restore
Run dotnet test net-users-api.tests/net-users-api.tests.csproj
Run node scripts/workshop/validate.mjs complete
Report exact commands, outcomes, executed test counts, tested SHA and any dirty state.
Open ONE pull request targeting the selected published working branch; preserve its link.
Do not merge. If a PR/task already exists, continue it rather than creating a duplicate.
If setup, policy, permissions, network or tests block you, report the blocker truthfully.`,
  },
};

export const overview = [
  {
    id: 'start',
    title: 'Before the clock starts',
    paragraphs: [
      'This is a self-contained public sample exercise, not an organization migration. You can read this guide without signing in or installing Node. All page assets are local; the page has no analytics, external fonts, login, or network-dependent content.',
      'Choose a participation lane: hands-on in an approved local clone; pair with an authorized driver; or observe and review evidence. You may stay in one client for the entire exercise. Alternate-client panels describe equivalent work or explicitly labeled observation, not five required implementations.',
      'Before the session, obtain device/client installation, authentication, repository access, network/dependency access, and usage approvals. Install Git, the exact .NET SDK selected by global.json, and Node 22 or later for preparation and validation helpers. Local prework, CI and cloud setup must all use that shared SDK pin with rollForward disabled, not separately hardcoded versions. Compare the version read from global.json with dotnet --version in the solution root. Complete CLI/app installation and sign-in using approved accounts. Do not spend live workshop time configuring credentials.',
      'As verified in Microsoft’s release metadata and official support policy on 2026-09-14, .NET 9 is in maintenance support through November 10, 2026. Follow current servicing and organization patch policies; the exact workshop SDK is defined only in global.json. Installation and rehearsal of that pin are separate readiness gates, not implied by this documentation check. If the pin is unavailable or disallowed, use the observation lane and have the maintainer requalify the exercise.',
      'A public repository being readable or cloneable does not grant write access or cloud-task permission. Cloud work requires an eligible paid Copilot entitlement, enabled administrator/repository policy, repository write access, and usage authorization. Managed enterprise accounts may only read this external public sample and cannot contribute to it. Do not switch to a personal identity or copy the sample into an organization as a workaround.',
      'Optional servers in .vscode/mcp.json are not needed for this exercise. Decline or disable those optional servers; do not configure credentials. Respect mandatory enterprise controls rather than bypassing them.',
      'If permitted, create a fresh public clone and local practice branch using the optional commands below. If the directory/branch already exists, inspect it rather than overwriting it. The instructor identifies the prepared starter SHA: DELETE still throws NotImplementedException and baseline tests exercise existing routes. Do not begin from a completed historical implementation.',
    ],
    commands: ['clone', 'identity', 'baseline'],
    sources: ['lifecycle', 'dotnet-releases', 'cli-install', 'app-start', 'access', 'managed'],
  },
  {
    id: 'exercise',
    title: 'The single exercise and its success contract',
    paragraphs: [
      'Implement the intentionally unfinished DELETE endpoint in frye/net-users-demo. The guide supplies the contract and prompts, not an implementation answer. Work first on local tests and the handler, then let exactly one next writer add the bounded HTTP regression.',
      'Baseline runs must execute a nonzero set of existing-route tests tagged Workshop=Baseline. A baseline pass is readiness, not feature success. Local validation additionally requires the named DELETE tests; complete validation additionally requires the HTTP repeated-delete regression. A green command that ran zero relevant tests is not acceptable evidence.',
      'The storage is static and process-local. A running server’s user list does not move with Git commits, a new worktree, cloud execution, or a session transcript. Derive tests from NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh per-case state and use UsersApiFactory (WebApplicationFactory) for HTTP coverage. Preserve globally serialized tests and use a fresh runtime when checking the prepared request examples. Do not add a storage redesign or reset endpoint to make the demo easier.',
    ],
    bullets: acceptance,
    sources: [],
  },
  {
    id: 'run-of-show',
    title: '60-minute run of show',
    paragraphs: [
      'The timed path demonstrates one progression; tabs are alternatives, not extra exercises. Keep a visible clock. The ten-minute cloud segment is a timebox, not a completion promise.',
      'At minute 46, if cloud work is still running or blocked, record its real status and links. Use a clearly labeled prepared result of this same DELETE exercise for review only, with its immutable SHA, evidence, and provenance from workshop/reference/README.md. If no prepared result is available, review the criteria and record the gate as blocked. Never imply prepared output was generated live.',
    ],
    table: {
      headers: ['Time', 'Segment', 'Expected evidence'],
      rows: [
        ['00–03', 'Frame the task', 'One DELETE contract; no answer revealed'],
        ['03–07', 'Orient to the clients', 'Local / cloud / remote / review boundaries'],
        ['07–14', 'VS Code: understand and plan', 'C1 approved bounded plan; C0 already prepared'],
        ['14–29', 'Copilot CLI: implement', 'Local handler and meaningful named DELETE tests'],
        ['29–36', 'Copilot app: verify', 'C2 reviewed commit and test evidence; C3 only if authorized'],
        ['36–46', 'Cloud: bounded follow-up', 'One task/PR; running, blocked, or tested result'],
        ['46–53', 'GitHub Mobile: monitor and review', 'Existing task/PR, not a duplicate task'],
        ['53–57', 'Close the evidence loop', 'C4 PR head/evidence or honest running/blocked status'],
        ['57–60', 'Q&A reserve', 'No new feature scope'],
      ],
    },
    sources: [],
  },
  {
    id: 'checkpoints',
    title: 'Checkpoints are the handoff contract',
    paragraphs: [
      'Stop the previous writer before the next client starts editing. Never run competing local and cloud writers on the same change. Inspect dirty work; preserve it and reconcile deliberately—never overwrite, reset, clean, or force-push to make a checkpoint look clean.',
      'A plan approval authorizes a bounded implementation, not a push or cloud usage. C2 is local-only until an authorized person deliberately publishes the reviewed commit. At C3 verify the remote branch SHA; cloud cannot see unpushed code or a private checkout path. Redact the local path and secrets from every public/cloud handoff.',
      'At a receiving local client, verify repository, branch, worktree path and HEAD against the record before writing. Default new-worktree sessions may start from a different committed base and do not carry uncommitted files. Session visibility and conversation continuity are not proof of Git identity.',
      'For cloud → local, stop the cloud writer, fetch, inspect the PR head and diff, and compare its immutable SHA. Use a clean, deliberately chosen checkout/worktree of that head; do not blindly pull over dirty work. Rerun complete validation there before claiming local verification.',
    ],
    table: {
      headers: ['Checkpoint', 'Required record', 'Gate'],
      rows: [
        ['C0', 'Prepared starter, clean branch/HEAD, nonzero baseline', 'Known starting state; DELETE remains unfinished'],
        ['C1', 'Bounded plan + explicit approval', 'No edits until scope is accepted'],
        ['C2', 'Reviewed local commit + local tests and tested SHA', 'Feature evidence; not yet cloud-visible'],
        ['C3', 'Authorized published branch + verified pushed SHA', 'Repository/write/policy/usage approvals satisfied'],
        ['C4', 'PR head + evidence; or running/blocked + links', 'No success assertion without completed relevant checks'],
      ],
    },
    commands: ['published', 'returnLocal'],
    sources: ['harnesses', 'sessions', 'delegate', 'review'],
  },
];

export const steps = [
  {
    id: 'access', title: 'Access and setup', outcome: 'C0: identify the approved starter and the actual execution environment.',
    panels: {
      vscode: {
        mode: 'LOCAL · hands-on or paired',
        navigation: ['Open VS Code → File → Open Folder and select the prepared clone. Open the integrated terminal and Chat. Confirm the signed-in approved account and that Copilot is available in this window.'],
        actions: ['Use the identity and baseline commands below from the solution root. Inspect global.json and the unfinished DELETE handler. Use the current folder/Local target for this canonical checkout; do not silently start a different worktree.', 'Decline optional .vscode/mcp.json servers. Review the folder trust prompt and grant only the access needed for this public sample.'],
        evidence: ['Record repository URL, branch, HEAD, clean status, SDK version, executed baseline test count and results. Keep the actual folder path only in the local handoff record.'],
        checkpoint: ['C0 is ready only when the starter is correct and the baseline helper passes with nonzero existing-route tests. A Copilot sign-in or a successful build alone is insufficient.'],
        limitations: ['Available session targets depend on version and policy. A visible Cloud target is not approval to publish; the local SDK and running API are not available to cloud agents.'],
        fallback: ['If the client, account, SDK or baseline is blocked, pair with an approved driver or observe the prepared starter. Keep the gate blocked; do not modify identity or enterprise settings.'],
        commands: ['identity', 'baseline'], sources: ['harnesses', 'access'],
      },
      cli: {
        mode: 'LOCAL · terminal session',
        navigation: ['Install the standalone Copilot CLI before the workshop using the approved installation channel. In a terminal at the prepared solution root, launch copilot. Use /login if prompted and review the folder trust request.'],
        actions: ['Use /help to confirm this installed version’s commands; use /cwd (or /cd) to inspect/change the working directory deliberately. Prefix direct shell commands with ! inside the session, such as !git status --short.', 'Run the baseline commands in the shell or ask the CLI to run the exact commands with individual tool approvals. Read global.json and confirm dotnet --version matches its exact SDK pin with rollForward disabled; do not approve broad filesystem access.'],
        evidence: ['Capture the CLI version/help observations, approved repository and branch, HEAD, local folder identity, and baseline output with executed test count.'],
        checkpoint: ['C0: clean prepared starter and passing baseline. Note that this is a local process, even if Copilot’s model service is remote.'],
        limitations: ['CLI installation/authentication, Node when required by installation, and policy are prework. This is standalone copilot, not a historical GitHub CLI extension. Shell commands and slash commands are different inputs.'],
        fallback: ['If CLI is unavailable, use the VS Code terminal or pair with a CLI driver. Reading the guide needs no CLI or Node. Do not improvise credential setup live.'],
        commands: ['cliStart', 'cliContext', 'baseline'], sources: ['cli-install', 'cli-use', 'cli-best'],
      },
      app: {
        mode: 'LOCAL · existing repository session',
        navigation: ['Open the GitHub Copilot app, not GitHub Desktop. Complete approved sign-in. Click + beside Sessions → Add project from → Local folder or repository, and select the prepared clone.'],
        actions: ['Start a session in that project and explicitly select the local repository as the execution location rather than a new working tree or cloud sandbox. Choose Plan or Interactive mode and verify the actual branch and HEAD before any edits.', 'Ask for the exact baseline commands and individually authorize needed execution. Open Changes to confirm no unexpected edits were introduced.'],
        evidence: ['Record local-repository location, branch/HEAD, clean Changes state and baseline results. Match the private path locally to the C0 record.'],
        checkpoint: ['C0 requires the same prepared files and nonzero baseline. A matching project name is not evidence that the session uses the canonical checkout.'],
        limitations: ['The app can create isolated worktrees. Its cloud sandbox is an ephemeral CLI execution environment, not the same product workflow as Copilot cloud agent producing a PR. Do not conflate them.'],
        fallback: ['If the app or its policy is unavailable, run the same baseline locally in CLI/VS Code and label the app segment as observation. Do not install GitHub Desktop as a substitute.'],
        commands: ['identity', 'baseline'], sources: ['app-start', 'app-sessions', 'sandboxes'],
      },
      cloud: {
        mode: 'CLOUD READINESS · no task yet',
        navigation: ['In GitHub.com, open the public sample repository and inspect the selected branch and commit. Find the repository Agents tab or the agents panel, but do not submit a new task yet.'],
        actions: ['Verify paid entitlement, administrator/repository enablement, repository write access and usage authorization independently. Confirm the intended prepared base is published. Check that the prepared setup workflow is available on the default branch before relying on it.', 'Keep local C0 baseline evidence separate from any future cloud execution. The canonical workshop waits until C3 to submit its one bounded follow-up.'],
        evidence: ['Record repository/base/immutable published SHA, authorization status and whether cloud setup readiness has actually been tested. Record missing permissions as a blocker, not a login problem to bypass.'],
        checkpoint: ['C0 cloud readiness does not replace local baseline validation. No cloud task or PR is created at this step.'],
        limitations: ['Read/clone access does not permit cloud writes. Business/Enterprise cloud agent may require administrator enablement; a managed account may not contribute to this public repository.'],
        fallback: ['Stay local, pair with an already authorized driver, or observe public source and prepared evidence. Do not fork/copy into an organization or change accounts to evade restrictions.'],
        commands: [], sources: ['cloud-use', 'access', 'environment', 'managed'],
      },
      mobile: {
        mode: 'REVIEW · account and device readiness',
        navigation: ['Install GitHub Mobile on an approved device beforehand. Long-press Profile to verify the intended account; navigate to frye/net-users-demo and its prepared branch.'],
        actions: ['Browse the controller and prepared tests, and verify the repository and visible commit against the instructor’s C0 record. Locate Home → Agents → Agent Tasks for later; an empty list before delegation is expected.', 'Check device/network and account permissions without creating a new task. Keep the local operator responsible for SDK and baseline execution.'],
        evidence: ['Record the repository/branch/SHA you can see and whether task/PR access is available. Label baseline results as evidence supplied by the local driver, not tests run on the phone.'],
        checkpoint: ['C0 for this lane is an identified starter plus a verified link to the driver’s baseline evidence; no mobile implementation has occurred.'],
        limitations: ['Mobile can browse and review; it does not run local dotnet commands or see an unpushed worktree. The current account may have public read-only access.'],
        fallback: ['Use the browser to observe the same repository if the device or account is unavailable. Label this browser fallback explicitly; it is not a rehearsed Mobile demo.'],
        commands: [], sources: ['mobile', 'mobile-cloud', 'managed'],
      },
    },
  },
  {
    id: 'plan', title: 'Understand and plan', outcome: 'C1: approve a narrow plan before a writer edits.',
    panels: {
      vscode: {
        mode: 'LOCAL · canonical planning segment',
        navigation: ['Open Chat and choose Plan from the agent dropdown, or type /plan followed by the bounded task prompt. Keep the prepared controller, test fixture and requirements file available as context.'],
        actions: ['Ask the agent to map DELETE’s current placeholder and static storage to the acceptance criteria, name the required local tests, and explain the fixture and serialization constraints. Require a separate bounded HTTP follow-up.', 'Review the plan and clarify scope before approving. Start Implementation hands the approved plan to an available implementation agent; for the canonical CLI handoff, stop here instead and save the approved plan in the handoff record.'],
        evidence: ['Preserve the approved plan text, chosen files/tests, reviewer approval and C0 SHA. Check that the plan preserves all other routes and does not redesign storage.'],
        checkpoint: ['C1: explicit approval for local handler and tests only. Do not confuse Start Implementation with approval to publish or start a cloud task.'],
        limitations: ['VS Code’s plan session memory is not a durable cross-client handoff. Handoff controls depend on the installed targets; transcript continuity does not move uncommitted files.'],
        fallback: ['If Plan or /plan is absent, use Chat to request a read-only plan and manually record approval, or plan together without an agent. No editing until the bounded plan is accepted.'],
        template: 'task', commands: [], sources: ['planning', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL · alternate planning path',
        navigation: ['In the trusted copilot session, inspect /help and enter /plan with the task prompt when supported. Plan mode is also available by cycling Shift+Tab until the mode label says Plan.'],
        actions: ['Ask for repository instructions, controller behavior and required test names to be read before proposing changes. Require a test-first sequence, fresh-state handling, structured logging with ID, and unchanged existing routes.', 'Inspect any proposed tool operation. Approve read-only exploration narrowly; do not approve editing, committing or delegation while still deciding the plan. Record the approved text outside ephemeral conversation context.'],
        evidence: ['Retain the plan, exact branch/HEAD from !git commands, and explicit approval. Confirm it separates local tests from the HTTP repeated-delete cloud follow-up.'],
        checkpoint: ['C1 only after the driver accepts the plan. If receiving C1 from VS Code, verify its base and scope instead of creating a conflicting second plan.'],
        limitations: ['A slash command is not a shell command. Available mode commands evolve, so /help and the visible mode label decide the installed navigation.'],
        fallback: ['Use a read-only prompt or write the plan manually if Plan mode is unavailable. Keep the CLI writer stopped until approval rather than escalating to autopilot.'],
        template: 'task', commands: ['cliContext'], sources: ['cli-use', 'cli-best'],
      },
      app: {
        mode: 'LOCAL · alternate planning path',
        navigation: ['Open the existing local-repository session in the app sidebar. Use the mode dropdown below the prompt field and select Plan, not Autopilot.'],
        actions: ['Paste the bounded task prompt and C0 record with locally verified checkout identity. Ask the agent to inspect the prepared fixture and requirements names, then propose the smallest handler/test change.', 'Review the plan and its validation commands before approving it. Keep changes in the chosen repository session; do not launch a second worktree merely to transfer the conversation.'],
        evidence: ['Record the plan, approval, branch/HEAD and remaining HTTP regression. Use Changes to verify that the planning step did not unexpectedly implement the task.'],
        checkpoint: ['C1: approved scope is local handler plus local tests; cloud publishing remains unapproved. If receiving a plan, explicitly accept it after checking the actual base.'],
        limitations: ['Plan and Interactive are session modes, not cloud/local selectors. The app’s default workspace choice may not be your canonical checkout.'],
        fallback: ['If the app cannot open that local checkout, keep planning in CLI/VS Code and show the app navigation only as an unrehearsed alternative. Do not silently use a different code base.'],
        template: 'task', commands: ['identity'], sources: ['app-start', 'app-sessions'],
      },
      cloud: {
        mode: 'REVIEW / CLOUD PLANNING · alternate lane',
        navigation: ['Open the prepared repository files and the acceptance contract in your browser. If using GitHub Copilot Chat for discussion, keep it a planning question; do not submit an agent task at this stage of the canonical path.'],
        actions: ['Compare the local C1 plan against published code and ask which criteria remain for the bounded HTTP follow-up. Require the future task to verify the published base SHA and use existing WebApplicationFactory infrastructure.', 'If choosing a cloud-first alternative instead of the canonical path, obtain C3-equivalent publication/usage authorization first and use one task with an explicit plan-approval boundary; never run it in parallel with a local implementation.'],
        evidence: ['Save the reviewed plan and its base SHA. Distinguish a browser discussion from an executing cloud task and from local test evidence.'],
        checkpoint: ['C1 approves the bounded plan only. The canonical path still has no cloud writer until C3.'],
        limitations: ['Cloud cannot inspect unpushed tests, local runtime users or private paths. A chat response about tests is not test execution.'],
        fallback: ['Read the local driver’s plan and public contract without invoking cloud. Pair/observe if entitlement or write permission is unavailable; do not create a duplicate issue to obtain an agent.'],
        template: 'task', commands: [], sources: ['cloud-use', 'access'],
      },
      mobile: {
        mode: 'REVIEW · plan approval, not local execution',
        navigation: ['In GitHub Mobile, open the repository and prepared source files. Read a sanitized C1 plan shared by the driver through an approved channel; do not publish a private checkout path.'],
        actions: ['Review the DELETE status/body/removal contract, named tests and unchanged-user assertion. Ask the driver how fresh test state and structured ID logging will be checked.', 'Do not tap Copilot → New Session merely to follow along. If you are choosing a new cloud-first task instead, select repository/base and obtain the same publication/usage gates before submitting exactly one task.'],
        evidence: ['Record review questions, plan approval, and the base SHA. Identify who will actually run the .NET tests and which local checks are still pending.'],
        checkpoint: ['C1 may be reviewed on Mobile, but no claim of local implementation or testing follows from that review.'],
        limitations: ['Mobile review cannot inspect unpublished files or a driver’s current runtime state. A task prompt is not a guarantee that an agent waited for the intended approval.'],
        fallback: ['Review the same plan in a browser or pair verbally. Label the browser/observation lane and keep a single agreed next writer.'],
        template: 'task', commands: [], sources: ['mobile', 'mobile-cloud'],
      },
    },
  },
  {
    id: 'implement', title: 'Implement the bounded change', outcome: 'Write meaningful local DELETE tests and the handler; leave the HTTP follow-up bounded.',
    panels: {
      vscode: {
        mode: 'LOCAL · alternate implementation',
        navigation: ['In the approved Plan conversation, choose Start Implementation and an available local implementation agent. Confirm the current folder and manual permissions rather than starting a cloud or unrelated worktree session.'],
        actions: ['Give the agent C1 and ask for named local DELETE tests from requirements.json with [Trait("Workshop", "Delete")]. Run them against the placeholder to observe the intended failure before authorizing the handler change.', 'Review each diff in Source Control. Keep the implementation limited to the contract, structured ID logging and existing fixture/serialization. Leave the HTTP repeated-delete regression for the single next writer.'],
        evidence: ['Keep failing-test evidence tied to the placeholder, then passing local tests and the reviewed diff. Record any dirty state rather than attributing uncommitted edits to HEAD.'],
        checkpoint: ['Prepare C2; it is not complete until local validation and an explicitly authorized reviewed commit. Stop this writer if handing the task to CLI or the app.'],
        limitations: ['Editor diagnostics and an agent’s “done” message are not executed tests. Folder/worktree isolation choices change which files are actually edited.'],
        fallback: ['Use manual edits or a paired local driver if agent tools are blocked. Validate with the same commands; do not switch to cloud to bypass a local approval.'],
        commands: ['local'], sources: ['planning', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL · canonical implementation segment',
        navigation: ['Stop the planning writer. Launch copilot at the verified canonical checkout or select the correct session with /resume. Use /cwd and !git status/branch/HEAD to compare against C1 before editing.'],
        actions: ['Supply the approved plan and ask for the exact local test names in scripts/workshop/requirements.json, each tagged [Trait("Workshop", "Delete")]. Require a failing run against NotImplementedException, then implement only the handler needed for the contract.', 'Approve individual file and shell operations after reviewing them. Do not use blanket allow-all or autopilot for this exercise. If scope drifts, press Esc twice within half a second, inspect the diff, and redirect without deleting work.'],
        evidence: ['Retain the intended red test failure, subsequent passing relevant tests, diff and command output. Verify the tests genuinely assert removal, empty 204, exact 404 error, unaffected users and structured ID logging.'],
        checkpoint: ['Hand the stopped CLI writer’s changes to the app for C2 review/validation. Do not commit/push/delegate unless that separate action has been explicitly authorized.'],
        limitations: ['The CLI runs commands locally. A resumed conversation may refer to another checkout or stale state; saved context never substitutes for Git identity verification.'],
        fallback: ['If CLI authentication or permissions block progress, stop and continue the same checked worktree in VS Code or manually. Record the switch and avoid two writers.'],
        commands: ['cliContext', 'local'], sources: ['cli-use', 'cli-best'],
      },
      app: {
        mode: 'LOCAL · alternate implementation',
        navigation: ['Open the verified local-repository session, select Interactive mode, and provide the C1 approved plan. If receiving from CLI, stop CLI execution before this session writes.'],
        actions: ['Request local named DELETE tests first, then the handler, with the same prepared fixture and globally serialized execution. Ask the app to run the relevant failing tests before implementing and passing local validation afterward.', 'Inspect Changes above the prompt box as edits arrive. Reject storage redesign, reset endpoints, unrelated routes, broad test rewrites or CI changes. Keep the HTTP regression as the next bounded task.'],
        evidence: ['Collect actual test commands/results and Changes diff. Verify repository path/branch/HEAD again if the session was resumed or switched.'],
        checkpoint: ['C2 preparation: reviewed local feature and tests, still local-only. Creating a PR from the app is not part of this step.'],
        limitations: ['An app cloud sandbox is not the canonical local session and will not automatically see uncommitted files. Interactive mode does not itself prove all operations were harmless.'],
        fallback: ['If Changes or execution is unavailable, review with git diff and run validation in the existing terminal. Label that as local fallback, not app execution.'],
        commands: ['local'], sources: ['app-sessions', 'app-start', 'sandboxes'],
      },
      cloud: {
        mode: 'REVIEW · canonical local work; CLOUD only in an alternate lane',
        navigation: ['During the local implementation segment, inspect the acceptance criteria and published starter in GitHub.com. There is deliberately no cloud task to open yet in the canonical path.'],
        actions: ['Observe the local driver’s test-first evidence and identify what is still unpublished. Do not start an agent against the old starter while CLI/app are editing.', 'For an explicitly chosen cloud-first alternative, use the one authorized task from the planning step, verify its base and inspect its file/test actions in the session log. That alternative replaces local implementation; it is not a parallel copy.'],
        evidence: ['Canonical lane: mark implementation evidence as local and cloud visibility as pending. Alternate lane: collect the actual cloud diff, commands, test count and pushed SHA.'],
        checkpoint: ['No C2 claim based only on a cloud narrative. Canonical C2 is the reviewed local commit; cloud-first results need equivalent review and validation before proceeding.'],
        limitations: ['A running cloud task cannot read your uncommitted DELETE handler or inherit static users from the laptop. A draft PR is a proposal, not a passing test result.'],
        fallback: ['Keep the single local writer and observe. If a cloud-first task blocks, stop it, preserve links/commits, then choose a verified local checkout rather than restarting duplicate tasks.'],
        commands: [], sources: ['cloud-use', 'manage'],
      },
      mobile: {
        mode: 'REVIEW / CLOUD OBSERVATION · not local coding',
        navigation: ['Use Mobile to browse the prepared controller and tests while the local driver implements. If a cloud-first alternative task already exists, open Home → Agents → Agent Tasks and select that exact task.'],
        actions: ['Review the driver’s evidence for meaningful DELETE tests, not just green baseline tests. Ask about missing/repeated IDs, unrelated users and structured logger fields.', 'For an existing cloud alternative, inspect its PR files and task status. Avoid editing PR files while an agent is writing; do not create a new Mobile task for the same handler.'],
        evidence: ['Record observations and unresolved criteria. Distinguish locally supplied results from cloud logs and from the files you actually reviewed on Mobile.'],
        checkpoint: ['This step contributes review to C2 but does not independently prove local execution. The same single writer retains ownership.'],
        limitations: ['Mobile supports PR-file edits, but it does not host this local .NET development environment. Phone review does not run dotnet or transfer runtime data.'],
        fallback: ['Observe via browser or pair with the local driver. Keep “Mobile unavailable” truthful; do not turn a browser view into a claim of native Mobile rehearsal.'],
        commands: [], sources: ['mobile', 'mobile-cloud'],
      },
    },
  },
  {
    id: 'validate', title: 'Validate and checkpoint', outcome: 'C2: reviewed local commit and meaningful feature evidence, still local-only.',
    panels: {
      vscode: {
        mode: 'LOCAL · validation and review',
        navigation: ['Open the terminal and Source Control in the same checkout that received the edits. Ensure the implementation writer has stopped before review-driven modifications.'],
        actions: ['Run build, tests and node scripts/workshop/validate.mjs local. Read the executed test names/counts and inspect git diff; baseline-only success cannot satisfy this step.', 'Check every acceptance criterion against code and assertions. After explicit approval to commit, commit only the reviewed handler/test scope; record the resulting SHA and rerun local validation on the clean committed tree.'],
        evidence: ['Capture exact commands/results, nonzero named DELETE tests, diff review, commit SHA and clean status. Mark the HTTP follow-up as remaining rather than failing silently or claiming complete.'],
        checkpoint: ['C2 is the reviewed local commit and tested SHA. No push yet; C3 requires a separate authorization and remote SHA check.'],
        limitations: ['Test Explorer badges may be stale; use current command output tied to the exact worktree. Editing after tests invalidates that evidence until revalidation.'],
        fallback: ['If a check fails, stay local, fix only the bounded issue, and rerun. If blocked by SDK/dependencies, record the blocker and pair/observe; do not weaken test discovery.'],
        commands: ['local', 'identity'], sources: ['harnesses'],
      },
      cli: {
        mode: 'LOCAL · alternate validation',
        navigation: ['In the correct CLI session use !git status --short and !git rev-parse HEAD, or return to the shell for direct validation. Keep the earlier implementation operation stopped.'],
        actions: ['Run the exact local validation commands with individual approvals. Ask for the real output, executed relevant test count, and failures rather than a summary that simply says all tests pass.', 'Review git diff --check and the diff. Obtain explicit commit approval, commit only reviewed scope, then rerun local validation at the new clean SHA. Stop the CLI writer before switching to app review.'],
        evidence: ['Record C2 SHA, passing local helper, actual test names/results and remaining HTTP regression. Preserve failed attempts honestly if they explain a blocker.'],
        checkpoint: ['C2 is local-only. Do not use /delegate as a shortcut to commit or publish unreviewed work.'],
        limitations: ['The baseline helper checks readiness only. A command exit code without the required executed tests is insufficient; the prepared helper enforces this distinction.'],
        fallback: ['Run commands yourself in the same shell if agent tool approvals fail. If validation remains blocked, retain dirty work and record the blocker; no push or feature-success claim.'],
        commands: ['local'], sources: ['cli-use', 'delegate'],
      },
      app: {
        mode: 'LOCAL · canonical verification segment',
        navigation: ['Stop the CLI writer. In the app, add/open the existing clone and explicitly use a local repository session, not the default new worktree. Select Interactive mode and open Changes.'],
        actions: ['Match path, branch and HEAD to the C1/C2 handoff before running anything. Ask the app to run the exact local validation commands, then inspect each changed handler/test file in Changes.', 'Require real output and test counts. After explicit approval, commit the reviewed scope locally, record the new SHA, and rerun local validation on the clean commit. Do not click Create PR at this point in the canonical path.'],
        evidence: ['Record the app’s actual execution results, reviewed diff, clean committed SHA and completed/remaining criteria. Keep the private checkout path local.'],
        checkpoint: ['C2 is ready only when app verification refers to the same code the CLI edited. Publication and cloud usage still need C3 authorization.'],
        limitations: ['A new worktree may omit uncommitted CLI changes. App session continuity and a green historical check do not establish that this exact commit was tested.'],
        fallback: ['If the app cannot execute, use the same checkout’s terminal and label it terminal verification. If it cannot open the right checkout, stay in CLI/VS Code rather than testing unrelated files.'],
        commands: ['identity', 'local'], sources: ['app-start', 'app-sessions'],
      },
      cloud: {
        mode: 'REVIEW · C2 readiness; cloud evidence only when actually run',
        navigation: ['In the browser, inspect the driver’s sanitized C2 record. For a cloud-first alternative already in progress, open that session’s logs and its existing PR Checks and Files changed.'],
        actions: ['Confirm the local handler/tests were executed and reviewed at the recorded SHA. Do not expect to browse C2 on GitHub while it remains local-only.', 'For actual cloud output, inspect setup errors and relevant test counts. Review proposed workflow changes before any authorized Approve and run workflows action; never approve blindly.'],
        evidence: ['Distinguish local tested SHA, published SHA if any, and actual cloud tested SHA. Mark pending workflows or missing feature tests as pending/blocked, not passed.'],
        checkpoint: ['C2 review can happen in a browser, but C3 is still required before the canonical cloud task. Cloud-first results must meet the same relevant-test gate.'],
        limitations: ['Agent text and PR existence are not execution evidence. Setup workflow availability and successful setup execution are different gates.'],
        fallback: ['If you lack workflow approval authority, ask an authorized reviewer through the normal process or keep the gate blocked. Stay with local evidence rather than changing external settings.'],
        commands: [], sources: ['review', 'environment', 'manage'],
      },
      mobile: {
        mode: 'REVIEW · checkpoint evidence',
        navigation: ['Open the driver’s shared, sanitized C2 evidence or the existing task’s PR from Home → Agents → Agent Tasks. Check the repository and head commit before reading files or check status.'],
        actions: ['Review DELETE assertions and unchanged routes. Compare test names/counts and the recorded SHA; ask the driver to resolve missing evidence instead of interpreting baseline-only green checks as feature success.', 'Keep review comments scoped to this same exercise. If changes are required, let the current owner make them and rerun tests before updating C2.'],
        evidence: ['Record what you reviewed, unresolved criteria, the local tested SHA, and whether it is actually published. Label all execution as local/cloud supplied, not phone-run.'],
        checkpoint: ['C2 review is possible on Mobile; C2 execution and commit belong to the local driver in the canonical path. No duplicate task or new PR.'],
        limitations: ['Unpushed local files cannot be inspected in a repository browser. Native Mobile does not run local tests; visible checks can refer to an older head.'],
        fallback: ['Use browser review or an approved paired screen if the evidence is not available on Mobile. Keep the local-only checkpoint and publication boundary explicit.'],
        commands: [], sources: ['mobile', 'mobile-cloud', 'review'],
      },
    },
  },
  {
    id: 'delegate', title: 'Delegate or continue', outcome: 'C3: one authorized published SHA, one next writer, one bounded follow-up.',
    panels: {
      vscode: {
        mode: 'LOCAL → CLOUD · optional supported handoff',
        navigation: ['Stop the local writer and review C2. Obtain explicit push, repository-write and cloud-usage authorization. Publish the reviewed working branch through your approved Git workflow, then verify its remote SHA.'],
        actions: ['If available, choose Cloud from Session Target and select Copilot cloud agent. Verify repository/base selection and use the sanitized cloud follow-up prompt with C3 SHA; if those controls do not establish the base, use GitHub.com instead.', 'For local CLI/app continuation rather than cloud, open the supported external session when available or supply the checkpoint manually. Stop the previous writer and verify the receiving checkout identity before continuing.'],
        evidence: ['Record C3 remote branch SHA, explicit authorization, task/session/PR links and the one next writer. If a task already exists, follow its link instead of submitting another.'],
        checkpoint: ['C3 requires published SHA equality, not just a push-success toast. The new cloud task adds only the HTTP repeated-delete regression.'],
        limitations: ['Only installed/allowed Cloud and external-session targets are usable. Handoff conversation context does not transfer uncommitted files, dependencies or runtime data.'],
        fallback: ['If Cloud is unavailable, continue the bounded HTTP test locally or observe a clearly labeled prepared same-exercise result. Browser handoff is an alternative entry point, not a second task.'],
        commands: ['published'], template: 'cloud', sources: ['harnesses', 'sessions', 'access'],
      },
      cli: {
        mode: 'LOCAL → CLOUD · explicit /delegate',
        navigation: ['After C2, obtain separate publishing/usage approval, publish only reviewed scope, and verify C3 remote branch SHA. In the correct CLI session inspect /help, then use /delegate with the sanitized bounded follow-up prompt.'],
        actions: ['Check any proposed checkpoint commit/new branch before accepting: /delegate can offer to commit unstaged changes. Do not blindly publish dirty or unrelated files. Require the selected repository/base to contain the exact C3 code.', 'Preserve the returned draft PR and agent-session links. /delegate starts cloud work; it is not how to resume an existing cloud task. For local continuation use /resume or copilot --resume and verify identity. copilot --continue selects the most recently closed LOCAL session only.'],
        evidence: ['Record published SHA, approval, delegated scope and returned links. Confirm that the cloud task is the only writer and no older task already owns the follow-up.'],
        checkpoint: ['C3 transitions ownership to one cloud task. If no authorization or published SHA exists, remain local-only; do not delegate.'],
        limitations: ['Optional /remote on exposes an interactive LOCAL session to the same account from web/Mobile when policy permits and the host stays online. It is not /delegate, not cloud execution, and not required here.'],
        fallback: ['Use the GitHub.com task form once if CLI delegation is unavailable, or keep the HTTP follow-up local. Never use --continue assuming it identifies the cloud PR.'],
        commands: ['published', 'cliResume'], template: 'cloud', sources: ['delegate', 'cli-use', 'remote'],
      },
      app: {
        mode: 'LOCAL → BROWSER CLOUD · canonical transfer',
        navigation: ['In the verified local-repository session, finish C2 review and stop the app writer. Obtain separate approval to publish the reviewed branch and consume cloud usage, then verify its published SHA.'],
        actions: ['Open GitHub.com’s Agents task form using the approved repository/base and sanitized cloud follow-up. There is no assumed app /delegate command in this guide. Preserve the single resulting task/PR link in the app handoff record.', 'If continuing locally instead, keep the existing local repository session or explicitly verify a receiving CLI/VS Code checkout. Do not choose an app cloud sandbox thinking it is the same cloud-agent PR workflow.'],
        evidence: ['Record C3 SHA/authorization and the browser-created task/session link. Note that this handoff uses the browser; the app did not execute a cloud-agent command.'],
        checkpoint: ['C3: published reviewed state, stopped local writer, one bounded HTTP regression task. The app’s Create PR control must not create a duplicate PR.'],
        limitations: ['App local sessions, new worktrees and cloud sandboxes have different code/state boundaries. Their availability is policy/version dependent and not evidence of cloud-agent access.'],
        fallback: ['If cloud is blocked, continue the HTTP regression in the same local app session after recording ownership, or use the prepared observation lane. Keep C3 explicitly not authorized/not pushed when applicable.'],
        commands: ['published'], template: 'cloud', sources: ['app-sessions', 'sandboxes', 'cloud-use'],
      },
      cloud: {
        mode: 'CLOUD · canonical bounded follow-up',
        navigation: ['After authorized C3, open the repository Agents tab or GitHub.com agents panel → New agent task. Explicitly select the repository and the published working branch; inspect its commit to verify the C3 SHA.'],
        actions: ['Submit the sanitized cloud-follow-up prompt once. Request a PR explicitly in this web flow and target the published working branch. The handler/local tests are already complete; ask only for the prepared HTTP repeated-delete regression.', 'Issue assignment and CLI /delegate normally create a draft PR. They are alternate entry points, not additional steps. If an open PR already exists, continue that PR with an authorized @copilot comment or steer its existing session; later issue comments are not automatically forwarded.'],
        evidence: ['Retain selected repo/base, published C3 SHA, prompt, authorizing approval and task/session/PR links. Inspect the task’s starting state before trusting its changes.'],
        checkpoint: ['C3 passed; C4 is pending while the agent works. Exactly one task/PR owns the follow-up; do not resubmit because a task is slow.'],
        limitations: ['Cloud has an ephemeral environment and only published code. It cannot inherit a laptop’s static users, dependencies or uncommitted test file. Entitlement and write access remain required.'],
        fallback: ['If setup/policy prevents execution, record the blocker and preserve the task link. At the timebox use prepared same-exercise evidence labeled as such, or stop cloud and continue locally from verified state.'],
        template: 'cloud', commands: [], sources: ['cloud-use', 'delegate', 'access', 'environment'],
      },
      mobile: {
        mode: 'CLOUD CONTROL · alternate new-task entry; canonical path continues existing',
        navigation: ['Canonical path: open Home → Agents → Agent Tasks and select the task/PR already created in the cloud segment. Do not choose New Session for that existing work.'],
        actions: ['Only if Mobile is the chosen first entry point for this not-yet-created task: tap Copilot → New Session, select the approved repository and published base branch, paste the sanitized cloud prompt and explicitly request one PR. Verify C3 SHA before submitting.', 'If the task already exists, continue through its PR/session. Use an authorized @copilot PR comment for a narrow follow-up rather than launching another task or adding an issue comment that may not reach the running agent.'],
        evidence: ['Record whether you continued an existing task or created the one authorized new task, along with repository/base, C3 SHA and its links.'],
        checkpoint: ['C3 applies on the phone too: published state, permission and usage approval, stopped prior writer, and one bounded next action.'],
        limitations: ['Mobile submits cloud work; it does not send a local checkout or run dotnet. Optional CLI remote control is a different mode: same account, allowed policy and an online local host.'],
        fallback: ['If task creation is unavailable, use the browser once or stay in the local/observation lane. Label browser substitution truthfully and preserve the existing task identity.'],
        template: 'cloud', commands: [], sources: ['mobile-cloud', 'mobile', 'remote'],
      },
    },
  },
  {
    id: 'monitor', title: 'Monitor and steer', outcome: 'Know where work runs, whether it is blocked, and which exact task owns it.',
    panels: {
      vscode: {
        mode: 'LOCAL / CLOUD MONITORING · inspect the target',
        navigation: ['Open the sessions list and select the recorded task. For supported CLI/app sessions hidden by default, use the sessions filter → External and the appropriate recent range; verify it is the intended session.'],
        actions: ['Read the target, repository/worktree, status and logs. For cloud work, inspect setup, command output and PR head via the saved links. Do not start a local competing implementation because cloud is slow.', 'If steering is needed, send a bounded correction to the same session after verifying ownership. For cloud → local return, stop cloud, fetch and inspect its head/diff, then choose a clean checkout of that exact SHA.'],
        evidence: ['Record running/blocked/completed status, any approval request, actual test output and links. Identify whether tools ran locally or in cloud rather than inferring from the VS Code window.'],
        checkpoint: ['C4 remains running/blocked until the HTTP regression and complete validation are evidenced. Session discovery is not automatic permission to take over.'],
        limitations: ['External session discovery is version/policy dependent and may show only recent repository-associated sessions. Adopting a session can change who owns subsequent execution.'],
        fallback: ['Use the recorded cloud PR/session in the browser if it is absent from VS Code. At the timebox review prepared same-exercise output with its provenance, not as a live result.'],
        commands: ['returnLocal'], sources: ['sessions', 'manage', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL / CLOUD / REMOTE · keep the distinction explicit',
        navigation: ['For local work, watch the current terminal operation and permission prompts. For delegated work, open the recorded cloud session/PR links; /resume or copilot --resume is for deliberately selecting a session, not polling by creating work.'],
        actions: ['Inspect exact test output and respond to individual local approvals. Stop an unwanted local operation with Esc twice. For cloud, steer the existing session or authorized PR rather than running /delegate again.', 'Optional /remote on allows same-account web/Mobile steering of an interactive local session only when approved policy permits and the host remains online. Coordinate one human responder; both local and remote interfaces can answer prompts.'],
        evidence: ['Record execution location, status, blocker/approval, tested SHA and task links. Do not turn a model summary or an idle terminal into a passing-test claim.'],
        checkpoint: ['C4 may truthfully say running or blocked. If returning to local editing, stop cloud first and verify fetched PR head against the handoff.'],
        limitations: ['--continue resumes the most recent local session; it does not identify your intended cloud task. Remote control stops being available when the host sleeps/offlines; it does not move execution to cloud.'],
        fallback: ['Use browser logs for cloud or keep monitoring locally if remote control is unavailable. Do not enable external settings during the workshop or resubmit duplicate tasks.'],
        commands: ['cliResume', 'returnLocal'], sources: ['cli-use', 'remote', 'manage'],
      },
      app: {
        mode: 'LOCAL SESSION / BROWSER CLOUD MONITORING',
        navigation: ['For local work, select the exact session in the app sidebar and inspect status and Changes. For the canonical browser-created cloud task, open the recorded PR/session link in the browser; app visibility is optional.'],
        actions: ['Review actual tool/test results and input requests, and check whether the active location is local repository, worktree or cloud sandbox. Keep the local app writer stopped while cloud owns the HTTP regression.', 'Send any cloud correction to the same task/authorized PR. To bring changes back to the app, stop cloud, fetch and inspect the PR head, then explicitly open a clean local checkout at that SHA.'],
        evidence: ['Record which surface was used to observe which execution environment, with current status and exact PR head. Preserve blockers instead of hiding them behind an app session summary.'],
        checkpoint: ['C4 stays pending until complete validation is real. A visible session or app cloud-sandbox status does not stand in for the separate cloud-agent task.'],
        limitations: ['The app may not expose every cloud-agent control in the installed version. Local session history and repository Changes are not cloud logs.'],
        fallback: ['Monitor in the browser when the app lacks the task view; label the switch. If time expires, record running/blocked and review the prepared same-exercise result explicitly.'],
        commands: ['returnLocal'], sources: ['app-sessions', 'sandboxes', 'manage'],
      },
      cloud: {
        mode: 'CLOUD · logs, approvals and bounded steering',
        navigation: ['Open the existing task in the repository Agents tab or agents panel. Select the session log/overview and follow its PR link to inspect Files changed and Checks.'],
        actions: ['Check setup first: correct base, exact SDK from global.json with rollForward disabled, dependency access, prepared setup workflow, and actual build/test output. CI and cloud setup must read the same global pin. Then verify the task is adding only the HTTP regression. Steer in the same session if it drifts.', 'Inspect workflow files and proposed changes before an authorized Approve and run workflows action. If blocked or the timebox ends, preserve links and state. Stop session before assigning a local writer; stopped sessions preserve already pushed commits.'],
        evidence: ['Capture running/blocked/completed status, approval/setup failures, executed test names/counts, command results and current PR head. Distinguish pending CI from successful checks.'],
        checkpoint: ['C4 requires complete validation at the current head; otherwise record running/blocked plus next owner/action. A draft PR or agent “finished” message is not enough.'],
        limitations: ['The prepared setup workflow must be available on the default branch to trigger as documented. Network/setup failures can consume the cloud timebox; no live completion is guaranteed.'],
        fallback: ['At minute 46, show a labeled prepared same-exercise result with immutable SHA and evidence, or discuss criteria if none exists. Do not relabel it as the current task’s output.'],
        commands: [], sources: ['manage', 'review', 'environment'],
      },
      mobile: {
        mode: 'CLOUD REVIEW · canonical Mobile segment',
        navigation: ['Open GitHub Mobile → Home → Agents → Agent Tasks. Select the existing DELETE task/PR and use its status filter if needed. Verify the account, repository and PR link before reviewing.'],
        actions: ['Read progress/status and the available PR files/checks. Ask an authorized narrow @copilot follow-up on that same PR when required; do not start a New Session to chase a slow task.', 'If you intentionally enabled CLI remote control beforehand, identify it as REMOTE CONTROL OF LOCAL execution and verify the same account/online host. Respond once to the existing prompt, coordinating with the local operator.'],
        evidence: ['Record visible task state, current PR head, exact check evidence and unresolved questions. Label whether the screen shows cloud work or a remotely controlled local CLI session.'],
        checkpoint: ['C4 can be running or blocked. Mobile observation is valuable evidence of workflow state, not proof that all tests passed on the current head.'],
        limitations: ['Native Mobile cannot run the local .NET suite. Available logs/controls vary; absence from the task list does not justify creating a duplicate or using another identity.'],
        fallback: ['Use the saved session/PR link in a browser if Mobile cannot expose the needed detail. Explicitly label browser fallback, and use prepared output only with its original provenance.'],
        commands: [], sources: ['mobile-cloud', 'mobile', 'remote'],
      },
    },
  },
  {
    id: 'finish', title: 'Review and finish', outcome: 'C4: evidence attached to the actual head, or an honest running/blocked handoff.',
    panels: {
      vscode: {
        mode: 'LOCAL REVIEW · verified cloud → local return',
        navigation: ['Stop the cloud writer and open the PR from its recorded link. In a clean local review checkout, fetch and inspect the exact PR head before switching VS Code to that checkout.'],
        actions: ['Review the HTTP regression diff against C3 and confirm the local handler/tests and unrelated routes remain intact. Run complete validation on this exact head; use the prepared request examples in a fresh runtime if demonstrating HTTP behavior.', 'Record the result and remaining criteria. Request changes on the existing PR when needed. Merge only through normal authorization/reviewer requirements; workshop completion does not require a merge.'],
        evidence: ['Retain full PR-head SHA, command results/test counts, clean/dirty state, review findings and PR/session links. Differentiate local rerun evidence from earlier cloud output.'],
        checkpoint: ['C4 complete only with the current head and full required evidence. Otherwise say running/blocked and name one next writer/action.'],
        limitations: ['Fetching does not automatically select the PR head, and an old passing check is not current evidence. Static data in a previously running API does not reflect a new process or commit.'],
        fallback: ['If local rerun is unavailable, record that specific gate unverified and review cloud evidence without claiming local verification. Prepared output must remain labeled and separate.'],
        commands: ['returnLocal', 'complete'], sources: ['review', 'manage'],
      },
      cli: {
        mode: 'LOCAL REVIEW · explicit checkout identity',
        navigation: ['Stop cloud work, return to a trusted shell, and inspect local dirty state before fetching. Use a deliberately chosen clean PR-head checkout, then start copilot or select the correct session with copilot --resume.'],
        actions: ['Verify repository/branch/HEAD and run complete validation. Ask the CLI for a read-only review of the final diff, checking the repeated HTTP 204→404 contract, unrelated users and absence of scope creep.', 'Do not allow a review prompt to create another task or overwrite local work. If changes are needed, designate one writer, make the bounded fix and rerun the required checks at the resulting head.'],
        evidence: ['Record exact commands, relevant test counts, PR head and tested SHA, plus any dirty diff. Keep review findings distinct from tests.'],
        checkpoint: ['C4 is the current tested head or an explicit blocked/running record. End the writer operation after saving the handoff; no automatic merge.'],
        limitations: ['Resuming a session is not a Git checkout operation. --continue selects the last local session, which may not be the review checkout you intended.'],
        fallback: ['Use direct shell review/testing if CLI is blocked, or inspect existing cloud evidence and mark local rerun unverified. Follow workshop/reference/README.md for recovery without destructive resets.'],
        commands: ['returnLocal', 'identity', 'complete'], sources: ['cli-use', 'review'],
      },
      app: {
        mode: 'LOCAL REVIEW · Changes plus actual checks',
        navigation: ['After stopping cloud, fetch and inspect its PR head using the approved local workflow. Open that verified clean checkout as a local repository session in the app and use Changes/PR views when available.'],
        actions: ['Review the complete diff and request the exact complete validation commands in Interactive mode. Verify output against the currently selected head, not a previous app session or cloud-sandbox run.', 'Keep the same PR for any authorized follow-up. Avoid Create PR if the bounded task already has a PR; use its existing review workflow and preserve links.'],
        evidence: ['Record app/local checkout identity, current tested SHA, complete-helper results, executed tests, review findings and final PR/session links.'],
        checkpoint: ['C4 records completed or running/blocked, with one next action. Do not merge or archive away unpreserved work merely to finish the demonstration.'],
        limitations: ['App sessions can point to a different worktree. A PR view can show cloud checks without the app having executed local tests. Distinguish those evidence sources.'],
        fallback: ['Use CLI/VS Code for the verified rerun if app tools are unavailable. Mark the app segment as review/observation and retain any unverified gate explicitly.'],
        commands: ['returnLocal', 'complete'], sources: ['app-start', 'app-sessions', 'review'],
      },
      cloud: {
        mode: 'CLOUD PR REVIEW · no automatic merge',
        navigation: ['Open the one task’s PR → Files changed and Checks, then compare the head to the latest session log and C3 base. Confirm the PR targets the intended published working branch.'],
        actions: ['Review every required assertion, status/body contract, unchanged users/routes, and structured logger ID. Check complete validation actually ran the HTTP repeated-delete regression at the current head.', 'For a fix, use an authorized @copilot comment on this PR or steer the same session. Inspect workflows before approving runs. Observe normal review rules; the requester’s approval may not satisfy required approval on a Copilot PR.'],
        evidence: ['Record immutable PR head, exact commands/results and executed test counts, reviewed diff, CI state and links. If agent checks happened before an additional code edit, require revalidation.'],
        checkpoint: ['C4 complete only with the current head and evidence. At the time limit, running/blocked with a next owner is a valid honest workshop outcome; do not call it feature success.'],
        limitations: ['A “Verified” commit signature or mergeable PR does not prove the DELETE contract. Cloud logs do not claim that local or all five client workflows were rehearsed.'],
        fallback: ['If checks or approvals are blocked, preserve the open task/PR and document next action. Review a prepared same-exercise result separately, or stop cloud and hand a verified head back locally.'],
        commands: [], sources: ['review', 'manage', 'cloud-use'],
      },
      mobile: {
        mode: 'REVIEW · canonical close-out',
        navigation: ['From Home → Agents → Agent Tasks, open the existing PR and inspect its head, files and check summary. Confirm the signed-in account still has the intended review role.'],
        actions: ['Review the HTTP repeated-delete test and unchanged-user assertion; compare current head to the recorded complete-validation evidence. Leave a focused review or authorized @copilot follow-up on this same PR.', 'Do not edit PR files while cloud is writing. If Mobile file editing is deliberately used after stopping the writer, treat that as a new code change requiring revalidation. No phone-run dotnet claim and no automatic merge.'],
        evidence: ['Record reviewed PR head, checks actually inspected, unresolved criteria and next owner/action. Identify any evidence supplied by the local driver or cloud logs rather than directly executed on Mobile.'],
        checkpoint: ['C4: tested head plus review, or running/blocked. Close the 53–57 minute evidence loop and preserve 57–60 for Q&A rather than creating more work.'],
        limitations: ['Mobile is a native review/control client, not a local test runner. Browser replacement or prepared output does not prove native Mobile or live cloud rehearsal.'],
        fallback: ['Use browser PR review if native controls are unavailable and label it. If the current task is unfinished, use prepared same-exercise evidence with provenance and keep the live task status honest.'],
        commands: [], sources: ['mobile', 'mobile-cloud', 'review'],
      },
    },
  },
];

export const closing = [
  {
    id: 'recovery',
    title: 'Recovery, historical material, and honest gates',
    paragraphs: [
      'If a handoff base is wrong, stop before writing. Preserve existing work, compare the checkpoint to the receiving checkout, and let one owner reconcile it. Do not hard-reset, clean, overwrite, force-push or keep competing writers just to stay on schedule.',
      'Prepared recovery/reference instructions live in workshop/reference/README.md in the repository; use the full repository link below rather than a relative path escaping the deployed guide. The instructor reference patch is workshop/reference/delete.patch. Reference verification takes the full immutable STARTER commit SHA, not a completed result’s SHA, tag or mutable branch. Follow the recovery README before running the command below. The guide does not embed the solution, and no solution tags are published by this guide.',
      'Historical Copilot practice and advanced/TDD materials remain useful as historical learning references; they are not the command authority for this workshop. Historical issue #7, PR #8 and PR #13 are read-only context, not tasks to change, reuse, reopen or treat as the prepared result.',
      'Report gates separately: public documentation verified; generated site structure checked; actual static-page browser behavior tested when available; installed client/version navigation rehearsed; local exercise tested; cloud setup/entitlement authorized; live cloud task run; native Mobile run; Pages deployment verified. A pass in one gate does not imply any other. Pages configured for workflow publishing does not prove that deployment has occurred; the listed URL remains a deployment target until separately verified.',
      'This guide is generated from content.mjs into index.html, guide.md and the task/handoff templates. Maintainers run node scripts/build-workshop-guide.mjs, then node scripts/build-workshop-guide.mjs --check and node scripts/test-workshop-guide.mjs. The optional actual-browser gate is node scripts/test-workshop-guide.mjs --browser; it requires an available browser automation environment and fails rather than silently skipping when unavailable.',
    ],
    commands: ['reference'],
    links: [
      { title: 'Repository recovery and reference instructions', url: 'https://github.com/frye/net-users-demo/blob/main/workshop/reference/README.md' },
      { title: 'Historical Copilot practice instructions', url: 'https://github.com/frye/net-users-demo/blob/main/Copilot_Practice_Instructions.md' },
      { title: 'Historical TDD practice instructions', url: 'https://github.com/frye/net-users-demo/blob/main/Copilot_TDD_Practice_Instructions.md' },
    ],
    sources: [],
  },
];

export const sources = [
  ['planning', 'VS Code: plan work with agents', 'https://code.visualstudio.com/docs/agents/run/planning'],
  ['harnesses', 'VS Code: agent harnesses and handoff', 'https://code.visualstudio.com/docs/agents/run/agent-harnesses'],
  ['sessions', 'VS Code: sessions from other applications', 'https://code.visualstudio.com/docs/agents/run/sessions/manage-sessions#_view-sessions-from-other-applications'],
  ['cli-install', 'Install the standalone Copilot CLI', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/set-up-copilot-cli/install-copilot-cli'],
  ['cli-use', 'Use Copilot CLI, approvals, stop and resume', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/overview'],
  ['cli-best', 'Copilot CLI best practices and /help', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/cli-best-practices'],
  ['delegate', 'CLI delegation and draft PRs', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-cli/use-copilot-cli/delegate-tasks-to-cca'],
  ['app-start', 'Get started with the Copilot app', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/get-started/quickstart-copilot-app'],
  ['app-sessions', 'Copilot app session locations and modes', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/github-copilot-app/agent-sessions'],
  ['sandboxes', 'Cloud and local sandboxes for Copilot', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/about-cloud-and-local-sandboxes'],
  ['cloud-use', 'Use cloud agent on GitHub.com', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-github'],
  ['access', 'Manage access to Copilot cloud agent', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/enterprise/cloud-agent-access'],
  ['environment', 'Configure the cloud-agent development environment', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-on-github/customize-copilot/customize-cloud-agent/customize-the-agent-environment'],
  ['manage', 'Manage, steer and stop agent sessions', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-on-github/use-copilot-agents/manage-and-track-agents'],
  ['review', 'Review Copilot output and workflow approvals', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/copilot-on-github/use-copilot-agents/review-copilot-output'],
  ['mobile', 'GitHub Mobile capabilities and accounts', 'https://docs.github.com/en/enterprise-cloud@latest/get-started/using-github/github-mobile'],
  ['mobile-cloud', 'Use cloud agent on GitHub Mobile', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/how-tos/use-copilot-agents/cloud-agent/use-cloud-agent-on-mobile'],
  ['remote', 'Remote control is still local execution', 'https://docs.github.com/en/enterprise-cloud@latest/copilot/concepts/agents/copilot-cli/about-remote-control'],
  ['managed', 'Managed user account restrictions', 'https://docs.github.com/en/enterprise-cloud@latest/admin/managing-iam/understanding-iam-for-enterprises/abilities-and-restrictions-of-managed-user-accounts'],
  ['lifecycle', '.NET support lifecycle and servicing policy', 'https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core'],
  ['dotnet-releases', '.NET 9 official SDK/runtime release metadata', 'https://builds.dotnet.microsoft.com/dotnet/release-metadata/9.0/releases.json'],
].map(([id, title, url]) => ({ id, title, url, verified: meta.verified }));

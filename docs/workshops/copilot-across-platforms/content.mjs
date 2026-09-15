// Edit this source, then run node scripts/build-workshop-guide.mjs.
export const meta = {
  title: 'Copilot Across Platforms',
  subtitle: 'One DELETE exercise. Your own copy. Switch clients when it helps.',
  repo: 'https://github.com/frye/net-users-demo',
  verified: '2026-09-14',
  deployment: 'https://frye.github.io/net-users-demo/',
  status: 'Keep exercise work in your own local clone. A private, user-owned upstream is optional—never the shared sample or a public repository. The shared sample is read-only. Checkpoints are optional recovery points—not requirements for moving on.',
};

export const clients = [
  { id: 'vscode', name: 'VS Code', description: 'Plan, edit and test your local copy' },
  { id: 'cli', name: 'Copilot CLI', description: 'Standalone copilot with local tools' },
  { id: 'app', name: 'Copilot app', description: 'Local repository sessions; not GitHub Desktop' },
  { id: 'cloud', name: 'Cloud agent / GitHub.com', description: 'Read-only orientation; do the exercise locally' },
  { id: 'mobile', name: 'GitHub Mobile', description: 'Read/review or optionally control an approved local CLI session' },
];

export const commands = {
  clone: {
    title: 'Create your own local copy and disable pushes to the shared source',
    language: 'sh',
    text: 'git clone https://github.com/frye/net-users-demo.git net-users-practice\ncd net-users-practice\ngit remote set-url --push origin https://example.invalid/no-workshop-push\ngit switch -c workshop/delete-practice',
  },
  identity: {
    title: 'Check which local copy is open',
    language: 'sh',
    text: 'git remote -v\ngit branch --show-current\ngit status --short',
  },
  baseline: {
    title: 'Check the starter works — not DELETE success',
    language: 'sh',
    text: 'node --version\nnode -p "JSON.parse(require(\'node:fs\').readFileSync(\'global.json\', \'utf8\')).sdk.version"\ndotnet --version\ndotnet restore net-users-demo.sln\ndotnet build net-users-demo.sln --no-restore\ndotnet test net-users-api.tests/net-users-api.tests.csproj\nnode scripts/workshop/validate.mjs baseline',
  },
  local: {
    title: 'Check your local DELETE implementation',
    language: 'sh',
    text: 'dotnet build net-users-demo.sln --no-restore\nnode scripts/workshop/validate.mjs local\ngit diff --check\ngit diff',
  },
  complete: {
    title: 'Check the completed exercise, including the HTTP regression',
    language: 'sh',
    text: 'dotnet restore net-users-demo.sln\ndotnet build net-users-demo.sln --no-restore\nnode scripts/workshop/validate.mjs complete\ngit diff --check\ngit diff',
  },
  cliStart: { title: 'Start the standalone CLI in your local copy', language: 'sh', text: 'copilot' },
  cliContext: {
    title: 'Inside the CLI — these are not shell commands',
    language: 'text',
    text: '/help\n/cwd\n!git status --short\n!git branch --show-current',
  },
  cliResume: { title: 'Choose a previous local CLI session', language: 'sh', text: 'copilot --resume' },
  recoveryClone: {
    title: 'Optional recovery: use a new folder, never overwrite your practice copy',
    language: 'sh',
    text: 'git clone https://github.com/frye/net-users-demo.git <new-recovery-directory>\ncd <new-recovery-directory>\ngit remote set-url --push origin https://example.invalid/no-workshop-push\ngit switch --detach <full-starter-commit-SHA>\nnode scripts/workshop/validate.mjs baseline',
  },
  reference: {
    title: 'Optional facilitator check of the prepared recovery example',
    language: 'sh',
    text: 'node scripts/workshop/verify-reference.mjs <full-starter-commit-SHA>',
  },
  privatePush: {
    title: 'Optional private upstream — only after verifying privacy, ownership, and policy',
    language: 'sh',
    text: 'git remote -v\ngit remote add personal <your-private-user-owned-repository-url>\ngit push personal HEAD:workshop/delete-practice',
  },
};

export const acceptance = [
  'An existing ID returns 204 with an empty response body and removes that user.',
  'A missing ID and a repeated deletion return 404 with the existing {"error":"User not found"} response.',
  'Unrelated users stay unchanged. Preserve the existing GET, POST, PUT, and HTML behavior.',
  'Use the injected structured logger and include the requested ID as a structured field.',
  'Add meaningful local DELETE tests using scripts/workshop/requirements.json names and [Trait("Workshop", "Delete")]. Use NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh state and keep tests globally serialized.',
  'Then add the HTTP repeated-delete regression using UsersApiFactory (WebApplicationFactory) and update the request examples. This is the next part of the same local exercise, not another implementation or PR.',
];

export const templates = {
  task: {
    file: 'task-template.md',
    title: 'Local task prompt',
    text: `Work only in my current local/personal clone of the public sample.
Do not push, publish files, open a PR or issue, or start a cloud task against any shared repository.
Plan the missing DELETE /api/v1/users/{id} handler and local tests first.
Read the repository instructions, controller, tests, and scripts/workshop/requirements.json.
Explain the proposed files and tests. Let me review the plan before implementation.
Acceptance criteria:
${acceptance.map((item, i) => `${i + 1}. ${item}`).join('\n')}
Start with local tests and the handler; leave the HTTP regression for the follow-up step.
Use NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh per-case state.
Do not redesign storage, add a reset endpoint, weaken tests, or change unrelated routes/CI.
Run node scripts/workshop/validate.mjs local and show the actual result and test count.
No checkpoint record or commit is required to continue or switch local clients.
If I get stuck, explain the problem and offer an optional recovery copy without overwriting my work.`,
  },
  handoff: {
    file: 'handoff-template.md',
    title: 'Optional recovery note',
    text: `Skip this note if everything is working. It is not a handoff requirement.
Where I got stuck: <step and problem>
Work to keep: <my current branch and unfinished edits; keep private paths local>
Last working version, if known: <local commit or prepared example>
Useful result: <command and result, only if it helps>
Where to resume: <plan | local DELETE | HTTP follow-up | review>
Recovery choice, if needed: <C0/C1 starter | C2/C3 local example | C4 completed example>
Next action: <continue here, ask for help, or open a separate recovery copy>
A recovery label does not save, publish, or reset anything. Keep the original work.`,
  },
  cloud: {
    file: 'cloud-followup-template.md',
    title: 'Local HTTP follow-up prompt — no publishing',
    text: `Continue the same DELETE exercise in my current local/personal clone.
This prompt runs in VS Code, Copilot CLI, or a local Copilot app session—not a new cloud task.
Do not push, create a PR/issue, publish code, or send this task to a shared repository.
Keep the local DELETE handler and tests unless a directly related test exposes a defect.
Add the HTTP repeated-delete regression using UsersApiFactory (WebApplicationFactory),
NetUsersApi.Tests.Infrastructure.UserStoreTest, and scripts/workshop/requirements.json names.
Prove first DELETE returns 204 with no body, second DELETE returns 404 with
{"error":"User not found"}, and unrelated users stay unchanged.
Update the local request examples. Keep storage, other routes, serialization, and CI unchanged.
Run dotnet restore net-users-demo.sln
Run dotnet build net-users-demo.sln --no-restore
Run node scripts/workshop/validate.mjs complete
Show the actual commands, test count, and results. Do not describe a local run as cloud execution.
Leave the work in this copy. A local commit is optional, not a requirement.`,
  },
  privateCloud: {
    file: 'private-cloud-followup-template.md',
    title: 'Optional private-cloud prompt — never for the shared sample',
    text: `Use this only because I explicitly chose an approved private, user-owned upstream.
Repository: <my-private-user-owned-repository>
Base branch: <my-published-working-branch>
Starting commit: <my-published-SHA>
Verify that the selected repository is private and owned by me before doing any work.
If privacy, ownership, access, or the base cannot be verified, stop; do not switch repositories or identities.
Never target frye/net-users-demo or another shared/public repository.
Continue the same DELETE exercise: add only the HTTP repeated-delete regression and request examples.
Use UsersApiFactory (WebApplicationFactory), UserStoreTest, and the existing required test names.
Preserve the local handler, storage, other routes, and test serialization.
Run node scripts/workshop/validate.mjs complete and report the actual output.
Keep code, results, and any PR entirely within my private repository.
Continue an existing task/PR there if one exists; otherwise request one private PR explicitly.
Do not merge or share the result elsewhere.`,
  },
};

export const overview = [
  {
    id: 'start', title: 'Before the clock starts',
    paragraphs: [
      'Read this guide without signing in. For hands-on work, use your own local copy or personal clone of the public sample. Do not edit the shared source repository, push exercise changes to it, open PRs/issues there, or assign it to a cloud agent.',
      'The clone commands below keep the source available for reading/fetching but set its push URL to a deliberately non-working .invalid address. This is a local guard against accidental publishing, not an authentication workaround. If the folder or branch already exists, use a new name or inspect it rather than overwriting it.',
      'Install Git, the exact .NET SDK in global.json, and Node 22 or later for the validation helpers before the workshop. Compare global.json with dotnet --version in the solution root. Prepare your chosen Copilot clients with your approved account. Installation, network access, and device/account permissions are prework.',
      'As checked in Microsoft’s official documentation on 2026-09-14, .NET 9 is in maintenance through November 10, 2026. Follow servicing policy and the shared SDK pin with rollForward disabled. Reading documentation alone does not rehearse an installed client or runtime.',
      'Use only synthetic sample data. Managed enterprise accounts may have restrictions on public repositories or personal copies; do not switch identities or create an organization copy to evade them. If a permitted local copy/client is unavailable, pair with an authorized driver or observe.',
      'No servers in .vscode/mcp.json are needed. Decline or disable these optional servers; do not configure MCP credentials for this lab. Respect mandatory enterprise controls.',
      'You can stay in one local client throughout. Switching is a chance to compare interfaces, not a requirement to install five clients or reproduce the same feature five times.',
    ],
    commands: ['clone', 'baseline'],
    sources: ['cli-install', 'app-start', 'managed', 'lifecycle', 'dotnet-releases'],
  },
  {
    id: 'exercise', title: 'One exercise, kept in your own copy',
    paragraphs: [
      'Complete the intentionally unfinished DELETE endpoint, then prove it works. First write local handler tests and implement the handler. Next add the HTTP regression and request examples in the same copy. Keep the resulting code local; no submission to the shared repository is part of this workshop.',
      'Use baseline to check the starter, local to check the DELETE handler/tests, and complete after the HTTP follow-up. A baseline pass does not prove DELETE works. The helpers reject missing or skipped required feature tests rather than treating an empty test run as success.',
      'The sample uses process-local static storage. Switching clients does not copy a running server’s users. Use the prepared fresh-state test fixture and globally serialized tests; do not add a database or production reset endpoint for this exercise.',
      'Cloud agents cannot execute against an unpublished local clone. The default Cloud agent / GitHub.com path is read-only orientation plus a local fallback. If you explicitly choose an approved private, user-owned upstream, cloud/Mobile work may stay within that private repository instead. Neither path creates work in the shared sample.',
    ],
    bullets: acceptance, sources: ['cloud-use', 'remote'],
  },
  {
    id: 'run-of-show', title: '60-minute run of show',
    paragraphs: [
      'Follow the timed path or stay in your preferred local client. Checkpoints are not scheduled deliverables: use them only if you need help catching up. Keep the final three minutes free for questions.',
      'The cloud segment explains the execution boundary and continues the HTTP test locally by default. Optional private-upstream users may do that same step in their own private repository. Label prepared presenter output as an example—not live participant execution. No shared-repository tasks or submissions are needed.',
    ],
    table: {
      headers: ['Time', 'Segment', 'What you do'],
      rows: [
        ['00–03', 'Frame the task', 'One DELETE feature, in your own copy'],
        ['03–07', 'Orient to the clients', 'Choose a client; distinguish local, cloud, and review'],
        ['07–14', 'VS Code: plan', 'Review a small handler-and-tests plan'],
        ['14–29', 'Copilot CLI: implement', 'Write tests and the local handler'],
        ['29–36', 'Copilot app: verify', 'Open the same local edits and run checks'],
        ['36–46', 'Cloud boundary / local follow-up', 'Understand why cloud needs published code; add the HTTP regression locally'],
        ['46–53', 'GitHub Mobile: read/review', 'Compare review controls or approved local remote control'],
        ['53–57', 'Review and finish', 'Inspect the local diff, actual tests, and remaining questions'],
        ['57–60', 'Q&A reserve', 'No new feature scope'],
      ],
    },
    sources: [],
  },
  {
    id: 'private-upstream', title: 'Optional: your own private upstream',
    paragraphs: [
      'Skip this entire section if you want to stay local. Nothing in the lab requires a remote, a push, a PR, or cloud execution. This option is only for a participant who deliberately wants a private upstream or an actual cloud/Mobile task in their own repository.',
      'Before uploading anything, confirm the upstream is PRIVATE, owned by your approved user account, and permitted by your organization. Do not use the shared sample, a public fork, a team/shared repository, or another identity. If you cannot verify privacy/ownership or policy disallows it, keep working locally.',
      'Use a separate remote called personal so the shared source remains read-only. Replace the URL below only with that verified private repository. The source remote’s disabled push URL stays in place. If personal already exists, inspect its URL and ownership instead of replacing it blindly.',
      'The disabled push URL only blocks Git pushes; it does not block GitHub API calls, cloud tasks, or PR creation. Adding a personal remote does not change a client’s default repository target. Do not run CLI /delegate or use the app’s Create PR/default cloud target from the sample-based checkout.',
      'Only committed files are uploaded by Git. If you choose this option, review and commit the intended local exercise files first; leave private local notes and QA artifacts out. This is a condition of choosing to upload, not a checkpoint requirement for everybody else.',
      'For optional cloud work, prefer the browser task form: explicitly select the verified private, user-owned repository and published branch, inspect the actual selected target and starting commit, then use the private-cloud prompt. Do not infer the target from a local remote name. Keep any task, PR, results, and comments inside that same private repository. Reuse an existing task rather than starting a duplicate. Cloud entitlement, policy, write access, and usage authorization still apply.',
      'In Mobile, open the task in your own private repository via Home → Agents → Agent Tasks. Use Copilot → New Session only if you intentionally need a new private task; verify the private repository/base first. Otherwise use read-only observation or an already approved local remote-control session.',
    ],
    commands: ['privatePush'], sources: ['access', 'managed', 'cloud-use', 'mobile-cloud'],
  },
  {
    id: 'checkpoints', title: 'Checkpoints: optional recovery points',
    paragraphs: [
      'If everything is working, ignore the checkpoints and keep going. They are there only if you get stuck and want to resume from a known-good state. You do not have to complete C0–C4, fill in a record, make a checkpoint commit, or pass a checkpoint before switching clients.',
      'C0–C4 are labels for places in the exercise, not automatic saves, Git tags, or a checklist. There are three useful code states: the starter (C0/C1), the local DELETE example (C2/C3), and the completed example (C4). Planning and changing clients do not need their own saved snapshot.',
      'If something breaks: stop the agent that is editing, keep your current work, and open a recovery copy in a separate folder. Choose the closest useful point below, run that copy’s checks, and resume the relevant step. “Reset” here means a fresh working copy—not erasing unfinished edits. Prepared code is a recovery aid, not proof that you generated it live.',
      'Switch between local clients whenever it helps. They can use the same folder and uncommitted edits; no checkpoint commit is needed. Check that the receiving client opened that folder/branch, and stop the previous agent before another one edits. A new worktree is a different copy and may not include those edits.',
    ],
    table: {
      headers: ['Optional point', 'Use it if…', 'Resume from'],
      rows: [
        ['C0 · Starter', 'Setup or edits left the sample broken', 'A fresh starter with passing baseline tests'],
        ['C1 · Planning', 'You lost the plan or do not know what to ask', 'The same starter plus the reusable task prompt; no special commit'],
        ['C2 · Local DELETE', 'Implementation is stuck and you want to catch up', 'The prepared local handler/tests; HTTP follow-up still left to do'],
        ['C3 · HTTP follow-up', 'You changed clients or got stuck adding the HTTP test', 'The same local DELETE example in your own copy; nothing to publish'],
        ['C4 · Review', 'You want to inspect a completed working example', 'The prepared handler, tests, and HTTP regression, all local'],
      ],
    },
    commands: ['recoveryClone'],
    links: [{ title: 'How to open a working recovery copy', url: 'https://github.com/frye/net-users-demo/blob/main/workshop/reference/README.md#optional-recovery-copies' }],
    sources: [],
  },
];

export const steps = [
  {
    id: 'access', title: 'Access and setup', outcome: 'Open your own copy and check that the starter runs.',
    panels: {
      vscode: {
        mode: 'LOCAL · hands-on or paired',
        navigation: ['Open VS Code → File → Open Folder and choose your practice clone. Open the integrated terminal and Chat using your approved account.'],
        actions: ['Run the baseline commands from the solution root. Inspect global.json and the unfinished DELETE handler. Decline optional MCP servers; use the local folder target.'],
        evidence: ['Look for passing existing-route tests and the expected starter files. These tests do not yet prove DELETE works; you will add those tests during the exercise.'],
        recovery: ['Optional C0: if this copy is broken, keep it and open a separate starter copy. Otherwise continue straight to planning without saving a checkpoint.'],
        limitations: ['A Cloud target cannot see unpublished local files. Do not select it to create a task against the shared sample repository.'],
        fallback: ['If the editor or account is unavailable, use another approved local client, pair, or observe. No account changes or shared-repository writes are needed.'],
        commands: ['identity', 'baseline'], sources: ['harnesses', 'managed'],
      },
      cli: {
        mode: 'LOCAL · standalone copilot',
        navigation: ['In a terminal at your practice clone, start copilot. Use /login if prompted and review directory trust. Installation should already be complete.'],
        actions: ['Use /help and /cwd (or /cd) to orient yourself. !git status --short runs a shell command inside the CLI. Run the baseline with individual tool approvals.'],
        evidence: ['Check the current folder/branch and actual baseline output. Your work and any local commits stay in this clone; there is no push step.'],
        recovery: ['Optional C0: use a fresh starter if setup or files are broken. A CLI login or session resume is not a saved code checkpoint.'],
        limitations: ['The standalone CLI is not the old GitHub CLI extension. Do not run /delegate in this local-only lab; it creates remote cloud work.'],
        fallback: ['Use a VS Code terminal or another approved local client if CLI access is blocked. Keep your copy intact and ask for help rather than changing identity.'],
        commands: ['cliStart', 'cliContext', 'baseline'], sources: ['cli-install', 'cli-use'],
      },
      app: {
        mode: 'LOCAL · existing repository session',
        navigation: ['Open the GitHub Copilot app, not GitHub Desktop. Choose + beside Sessions → Add project from → Local folder or repository and select your practice clone.'],
        actions: ['Choose local repository as the execution location instead of a default new worktree or cloud sandbox. Run the baseline and inspect Changes for unexpected edits.'],
        evidence: ['Check that the app opened your actual local folder and branch. Look at the test output rather than relying on a matching project name.'],
        recovery: ['Optional C0: open a separate starter if your current copy is broken. You do not need a checkpoint commit just to open this folder in the app.'],
        limitations: ['App cloud sandboxes are different from cloud-agent PR tasks. Neither is needed to work in your local copy, and neither should publish to the shared sample.'],
        fallback: ['If the app is unavailable, use CLI/VS Code in the same copy and label this segment as local fallback, not app execution.'],
        commands: ['identity', 'baseline'], sources: ['app-start', 'app-sessions', 'sandboxes'],
      },
      cloud: {
        mode: 'READ-ONLY ORIENTATION · no cloud task',
        navigation: ['Open the public sample on GitHub.com and inspect its files. You may locate the Agents interface, but do not submit a task against the shared repository.'],
        actions: ['Compare the published starter to your local copy. Notice that uncommitted local changes are not visible here. Run the baseline in an approved local client instead.'],
        evidence: ['Identify which files are public starter files and which changes exist only locally. Looking at GitHub.com does not mean a cloud test ran.'],
        recovery: ['Optional C0: clone a new local starter if needed. Reading or cloning the shared repository does not require creating a remote task or checkpoint.'],
        limitations: ['Cloud agents need a hosted repository and suitable permissions. Keep the default path local; only the optional, verified private user-owned upstream may be used for actual cloud work.'],
        fallback: ['Use VS Code, CLI, or the app for the actual exercise. Pair or observe if you cannot run it locally; do not publish code to enable cloud.'],
        commands: [], sources: ['cloud-use', 'access'],
      },
      mobile: {
        mode: 'READ / REVIEW · no phone-run .NET',
        navigation: ['Open GitHub Mobile with the intended approved account and browse the public sample repository. Locate Home → Agents → Agent Tasks for orientation only.'],
        actions: ['Read the starter controller and tests. Do not choose Copilot → New Session or create an issue/task against the shared sample. Let a local client run the baseline.'],
        evidence: ['Compare the public starter files with the local driver’s explanation. Keep locally supplied test results distinct from anything the phone actually executed.'],
        recovery: ['Optional C0: ask the local driver to open a fresh starter if needed. Mobile observation does not require a checkpoint record or a published personal change.'],
        limitations: ['Mobile cannot run local dotnet commands or inspect an unpublished clone. Account restrictions still apply even when a repository is publicly readable.'],
        fallback: ['Use a browser to read the public sample or pair with a local driver. Label browser use honestly rather than calling it a native Mobile demonstration.'],
        commands: [], sources: ['mobile', 'mobile-cloud', 'managed'],
      },
    },
  },
  {
    id: 'plan', title: 'Understand and plan', outcome: 'Discuss a small handler-and-tests plan before implementing.',
    panels: {
      vscode: {
        mode: 'LOCAL · planning',
        navigation: ['Open Chat and select Plan from the agent dropdown, or use /plan with the local task prompt. Keep the controller and prepared tests available as context.'],
        actions: ['Ask which files and tests should change. Review the plan, then use Start Implementation if staying in VS Code, or copy the useful plan text into your next local client.'],
        evidence: ['Look for the 204/404 behavior, unchanged users, structured logging, and test-first sequence. A short understood plan is enough; no handoff form is required.'],
        recovery: ['Optional C1: if the plan is lost or confusing, reuse the task prompt on the starter. You can switch clients without a saved checkpoint.'],
        limitations: ['Conversation continuity varies by installed client and target. A new conversation can use a short prompt; it does not need to inherit every earlier message.'],
        fallback: ['Ask for a read-only plan in ordinary Chat or plan with a partner if Plan mode is unavailable. Continue in your own local copy.'],
        template: 'task', commands: [], sources: ['planning', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL · alternate planning',
        navigation: ['In the trusted copilot session, use /help and /plan with the task prompt. Shift+Tab may cycle modes; check the visible mode label for your installed version.'],
        actions: ['Ask the CLI to inspect the controller and test requirements, then propose a small plan. Approve only the needed exploration while you are still deciding the change.'],
        evidence: ['Check that the plan separates the local handler/tests from the later HTTP regression. Reuse a plan from another client instead of starting over unnecessarily.'],
        recovery: ['Optional C1: restart planning from the supplied prompt if needed. No checkpoint commit, saved transcript, or completed form is needed to proceed.'],
        limitations: ['Slash commands and shell commands are different inputs. /help describes the installed CLI; a previous conversation may refer to an older folder or code state.'],
        fallback: ['Use an ordinary read-only prompt or write the plan yourself if Plan mode is unavailable. Keep the task and code local.'],
        template: 'task', commands: ['cliContext'], sources: ['cli-use', 'cli-best'],
      },
      app: {
        mode: 'LOCAL · alternate planning',
        navigation: ['Select your local repository session in the app sidebar. Use the mode dropdown below the prompt field to choose Plan.'],
        actions: ['Paste the local task prompt or the useful part of your existing plan. Review proposed files and tests before asking the app to implement in Interactive mode.'],
        evidence: ['Look for a bounded handler/test change and a clear test command. Changes should not show an unexpected implementation while you are still planning.'],
        recovery: ['Optional C1: reuse the prompt if context was lost. The same local folder can carry your edits between clients without a checkpoint commit.'],
        limitations: ['Plan/Interactive choose how the session works, not where its files live. Explicitly choose the local repository rather than a new worktree.'],
        fallback: ['Plan in CLI/VS Code or with a partner if the app cannot use your local copy. Do not move the work to a shared repository to continue.'],
        template: 'task', commands: [], sources: ['app-start', 'app-sessions'],
      },
      cloud: {
        mode: 'READ-ONLY PLANNING · local implementation',
        navigation: ['Read the public controller and this guide in the browser. Keep the local task prompt open beside the files; do not submit it to the shared repository’s Agents interface.'],
        actions: ['Discuss why cloud needs published code and why this exercise stays local. Review the local driver’s plan or write your own notes without creating an issue or PR.'],
        evidence: ['Identify the planned behavior and tests, and which local client will execute them. A browser discussion is not a cloud implementation.'],
        recovery: ['Optional C1: use the same reusable plan prompt locally if you lose your place. There is no cloud checkpoint to obtain before continuing.'],
        limitations: ['A cloud agent cannot inspect an unpublished personal clone. Do not publish to a shared/public repository; use the optional private-upstream path only if you deliberately choose it.'],
        fallback: ['Use the prompt in a local client, or pair/observe the plan. You can complete the exercise without a cloud task.'],
        template: 'task', commands: [], sources: ['cloud-use', 'access'],
      },
      mobile: {
        mode: 'REVIEW · discuss the plan',
        navigation: ['Browse the public starter in GitHub Mobile and read the local driver’s plan on an approved paired screen or in local notes. No issue or PR needs to be created for it.'],
        actions: ['Check the missing/repeated ID behavior and ask how fresh test data and structured logging will be verified. Leave execution to the local client.'],
        evidence: ['Look for a plan that covers the acceptance criteria. Questions and discussion are useful without uploading a plan or recording a formal approval checkpoint.'],
        recovery: ['Optional C1: ask to revisit the reusable prompt if you lose the thread. Continue reviewing without creating a Mobile agent session.'],
        limitations: ['Mobile cannot see unpublished edits or a local plan through the repository browser. Do not turn that limitation into a reason to publish the work.'],
        fallback: ['Use the browser or pair verbally when native Mobile is unavailable. Keep the actual implementation in the driver’s local copy.'],
        template: 'task', commands: [], sources: ['mobile', 'mobile-cloud'],
      },
    },
  },
  {
    id: 'implement', title: 'Implement the bounded change', outcome: 'Write local DELETE tests and the handler in your own copy.',
    panels: {
      vscode: {
        mode: 'LOCAL · implementation',
        navigation: ['From the reviewed plan, select Start Implementation and a local agent. Confirm the current folder is your practice clone, not a cloud target.'],
        actions: ['Add the named DELETE tests first and run them against the stub. Then implement the handler, inspect Source Control, and run local validation. Keep the HTTP regression for the next part.'],
        evidence: ['Look for an intended failing test followed by passing meaningful tests and a small diff. Uncommitted edits are fine; a checkpoint commit is not needed.'],
        recovery: ['Optional C2: if implementation is stuck, preserve your work and open the prepared local DELETE example in another folder to catch up.'],
        limitations: ['Editor diagnostics and an agent’s “done” message are not executed tests. Avoid scope changes such as storage redesign or CI edits.'],
        fallback: ['Edit manually or pair with a local driver if agent tools are unavailable. Do not create remote work to bypass a local restriction.'],
        commands: ['local'], sources: ['planning', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL · implementation',
        navigation: ['Start copilot in your practice folder, or deliberately select a previous local session with /resume. Check /cwd and !git status before editing.'],
        actions: ['Supply the plan and request the required local test names/traits. Observe the failing tests, implement only the handler, then run local validation with individual approvals.', 'If scope drifts, press Esc twice within half a second, inspect the edits, and redirect. Do not use blanket allow-all permissions or /delegate for this lab.'],
        evidence: ['Read the actual red/green output and diff. Tests should assert removal, 204, exact 404 error, unchanged users, and structured ID logging.'],
        recovery: ['Optional C2: open the prepared local example if you need to catch up. Otherwise keep going or open the same uncommitted work in the app.'],
        limitations: ['A resumed conversation is not a Git checkout operation. --continue resumes the most recent local session, which may not be this exercise.'],
        fallback: ['Stop the CLI writer and continue the same folder in VS Code, the app, or a plain editor if CLI tools are blocked. Preserve all existing edits.'],
        commands: ['cliContext', 'local'], sources: ['cli-use', 'cli-best'],
      },
      app: {
        mode: 'LOCAL · implementation',
        navigation: ['Select the local repository session and Interactive mode. If switching from CLI or VS Code, stop that agent and open the same practice folder.'],
        actions: ['Ask for local tests first, then the handler. Inspect Changes and run the local checks. Keep the existing fixture and serialization; do not create a PR from the app.'],
        evidence: ['Compare the actual test results and changed files to the small plan. The app should be editing your local copy, not a different worktree.'],
        recovery: ['Optional C2: keep the broken copy and use a prepared local example if necessary. No checkpoint commit is required for ordinary client switching.'],
        limitations: ['A default new worktree may omit uncommitted edits. App cloud sandboxes are not needed here and should not be used to publish the exercise.'],
        fallback: ['Use git diff and local terminal checks if Changes or app execution is unavailable. Label that as terminal work rather than app execution.'],
        commands: ['local'], sources: ['app-sessions', 'sandboxes'],
      },
      cloud: {
        mode: 'READ-ONLY COMPARISON · implementation stays local',
        navigation: ['Keep GitHub.com on the public starter while a local client implements. Do not start an agent against the shared source or open a practice issue there.'],
        actions: ['Compare the original stub with the local driver’s explanation and inspect the acceptance criteria. Discuss what published base a cloud task would need in a different workflow.'],
        evidence: ['Notice that your local edits do not appear on GitHub.com. That is expected and intentional, not a missing checkpoint or publishing step.'],
        recovery: ['Optional C2: use the local prepared example if you need working handler code for the next segment. It does not require cloud execution.'],
        limitations: ['Cloud cannot read the unpublished handler or laptop runtime data. Actual cloud work is optional and restricted to your own verified private upstream.'],
        fallback: ['Continue implementation in any approved local client or observe a paired driver. Keep the shared repository untouched.'],
        commands: [], sources: ['cloud-use', 'manage'],
      },
      mobile: {
        mode: 'REVIEW · implementation remains local',
        navigation: ['Read the public starter in Mobile and follow the local driver’s diff on a paired screen. Do not create an Agent Task for the same implementation.'],
        actions: ['Ask whether tests cover missing/repeated IDs, unchanged users, and structured logging. If approved local CLI remote control is already available, identify it explicitly as local execution.'],
        evidence: ['Distinguish the public starter, locally supplied output, and anything you actually observed. The phone has not run a .NET test merely by displaying it.'],
        recovery: ['Optional C2: the local driver can use a prepared copy if stuck. You can keep reviewing without any saved checkpoint or shared PR.'],
        limitations: ['The repository browser does not show unpublished work. Do not upload local edits or create a shared PR to make them visible on Mobile.'],
        fallback: ['Use a local paired screen or browser for read-only review when native controls are unavailable. Keep the exercise code in the personal copy.'],
        commands: [], sources: ['mobile', 'remote'],
      },
    },
  },
  {
    id: 'validate', title: 'Validate and review', outcome: 'Inspect the same local edits and run the feature checks.',
    panels: {
      vscode: {
        mode: 'LOCAL · review and tests',
        navigation: ['Open the terminal and Source Control in the practice copy containing your edits. Stop another agent before making review-driven changes.'],
        actions: ['Run local validation and inspect the actual test names/counts and diff. Fix failures in this copy; do not weaken the test requirements to get a green result.'],
        evidence: ['Look for meaningful passing DELETE tests and no unrelated route changes. Local commits are optional; neither a commit nor a recovery record is needed to switch clients.'],
        recovery: ['Optional C2: if the implementation remains broken, keep it and use the tested local recovery example before trying the HTTP follow-up.'],
        limitations: ['Old Test Explorer badges may be stale. Re-run checks after code changes rather than relying on a result from a different set of edits.'],
        fallback: ['Run the same commands directly in a terminal or pair with a driver if editor tools are unavailable. Do not publish the result to the shared source.'],
        commands: ['local'], sources: ['harnesses'],
      },
      cli: {
        mode: 'LOCAL · review and tests',
        navigation: ['Use !git status --short in the current CLI session, or return to your local shell. Verify that it is the folder where the handler was changed.'],
        actions: ['Run the local validation commands and inspect their output and git diff. Stop the CLI agent before opening the same edits in another local client.'],
        evidence: ['Check executed relevant tests rather than a summary saying “all passed.” A local commit may help you save progress, but the workshop does not require one.'],
        recovery: ['Optional C2: if tests are blocking progress, use the local prepared example in a separate folder. Keep your failed attempt for later learning.'],
        limitations: ['Baseline success alone does not prove the feature. The local helper deliberately fails when required DELETE tests are absent or skipped.'],
        fallback: ['Execute the commands yourself if CLI approval is unavailable. You can switch clients with uncommitted work in the same folder.'],
        commands: ['local'], sources: ['cli-use'],
      },
      app: {
        mode: 'LOCAL · verify in a different interface',
        navigation: ['Stop the CLI writer and open the same practice folder as a local repository session in the app. Select Interactive mode and open Changes.'],
        actions: ['Confirm the app sees the handler/test edits, then run local validation and inspect Changes. No commit, push, Create PR action, or completed checkpoint is needed for this switch.'],
        evidence: ['Look for the same code you just edited and actual passing tests. If the app opened a different worktree, return to the intended local repository.'],
        recovery: ['Optional C2: use a separate prepared local example if the edits are broken. If the current copy works, skip recovery and continue.'],
        limitations: ['A new worktree is not the same folder and may lack uncommitted CLI edits. Session history alone does not prove which files are open.'],
        fallback: ['Use the current folder’s terminal if app tools cannot run checks. This is a valid local fallback, not a failed checkpoint transition.'],
        commands: ['identity', 'local'], sources: ['app-start', 'app-sessions'],
      },
      cloud: {
        mode: 'READ-ONLY REVIEW · no hosted CI required',
        navigation: ['Review the starter and guide on GitHub.com while the local driver shows their current diff and test output. No exercise PR needs to exist.'],
        actions: ['Compare local test assertions with the acceptance criteria. Explain that hosted checks would need published commits, which this local-only lab intentionally does not create.'],
        evidence: ['Use actual local test results as local evidence. Do not treat the shared repository’s CI status as validation of somebody’s unpublished exercise edits.'],
        recovery: ['Optional C2: review the prepared local example if the current attempt is stuck. There is no remote check or C3 gate to unlock.'],
        limitations: ['GitHub.com cannot display unpublished local results through a repository PR. This is an execution boundary, not a reason to upload them.'],
        fallback: ['Review locally or on an approved paired screen. Leave the shared repository’s workflows, issues, PRs, and settings unchanged.'],
        commands: [], sources: ['review', 'environment'],
      },
      mobile: {
        mode: 'REVIEW · no submission needed',
        navigation: ['Use Mobile to read the public source and a paired local screen to inspect the participant’s diff/results. Do not create a PR to transport them to the phone.'],
        actions: ['Check which assertions and test results were actually inspected. If changes are needed, let the current local driver make them and run the checks again.'],
        evidence: ['Separate public baseline checks from the personal clone’s feature tests. Reviewing another screen does not mean those tests ran on Mobile.'],
        recovery: ['Optional C2: continue reviewing a prepared local example if needed. No checkpoint note, commit, or published branch is required.'],
        limitations: ['Mobile’s PR/check views cannot show work that intentionally stays local. Native Mobile does not run the .NET validation helper.'],
        fallback: ['Use local review or approved local CLI remote control if available. Label the actual surface used and do not publish exercise artifacts.'],
        commands: [], sources: ['mobile', 'remote'],
      },
    },
  },
  {
    id: 'delegate', title: 'Continue the HTTP follow-up', outcome: 'Understand the cloud boundary, then finish the regression locally.',
    panels: {
      vscode: {
        mode: 'LOCAL · bounded HTTP follow-up',
        navigation: ['Keep your practice folder open, or stop the previous agent and open that same folder in VS Code. Use a local agent for the follow-up prompt below.'],
        actions: ['Add the repeated-delete HTTP regression and request examples using the prepared test host. Run complete validation without pushing, opening a PR, or choosing a Cloud target.'],
        evidence: ['Look for 204 with an empty body, then the exact 404 error, plus unchanged other users. This continues the same feature rather than restarting it.'],
        recovery: ['Optional C3: resume from the same local DELETE example used at C2 if you need a working base. Nothing has to be published.'],
        limitations: ['Cloud agents need a hosted repository. The local-only workshop uses a local agent for this part, even while discussing cloud capabilities.'],
        fallback: ['Use CLI, the app, or manual edits in the same copy if the VS Code agent is unavailable. Keep the shared sample read-only.'],
        template: 'cloud', commands: ['complete'], sources: ['harnesses', 'cloud-use'],
      },
      cli: {
        mode: 'LOCAL · follow-up, not /delegate',
        navigation: ['Stay in the correct local copilot session, or use /resume / copilot --resume to select it deliberately. Check /cwd if you are unsure.'],
        actions: ['Give the CLI the local HTTP follow-up prompt and approve only the needed edits/test runs. Do not use /delegate: it starts cloud work and normally creates a remote draft PR.'],
        evidence: ['Read the HTTP test and complete-validation output. Both the changes and results stay in your local/personal clone.'],
        recovery: ['Optional C3: use a separate C2/C3 local example if the follow-up is stuck. No checkpoint commit or remote task is necessary.'],
        limitations: ['--continue selects the most recent local session, not necessarily this exercise. /remote on is optional local remote control, not delegation to cloud.'],
        fallback: ['Run the follow-up in another local client or manually. If remote control is unavailable, keep using the original local interface.'],
        template: 'cloud', commands: ['cliResume', 'complete'], sources: ['cli-use', 'delegate', 'remote'],
      },
      app: {
        mode: 'LOCAL · Interactive follow-up',
        navigation: ['Use the same local repository session in the app and select Interactive. Stop any other agent that was editing this copy.'],
        actions: ['Paste the local follow-up prompt, inspect Changes, and run complete validation. Do not use Create PR or switch to a cloud sandbox to publish the exercise.'],
        evidence: ['Check that the diff adds the HTTP regression and examples rather than reimplementing the handler. Read the actual test results.'],
        recovery: ['Optional C3: open the local recovery example in another folder if needed. Otherwise continue directly with the existing edits.'],
        limitations: ['There is no assumed app /delegate command. App cloud sandboxes and cloud-agent PR workflows are different and neither is needed for this local step.'],
        fallback: ['Use the local terminal or another editor if app tools are unavailable. Keep the work in the personal copy with no shared-repository writes.'],
        template: 'cloud', commands: ['complete'], sources: ['app-sessions', 'sandboxes'],
      },
      cloud: {
        mode: 'READ-ONLY BY DEFAULT · optional private cloud',
        navigation: ['Look at GitHub.com’s Agents interface and the public documentation. Do not submit New agent task, assign an issue, or request a PR in the shared sample.'],
        actions: ['By default, inspect the repository/base controls and run the HTTP follow-up in a local client. Do not publish anything just to complete this segment.', 'If you explicitly chose the private-upstream option, select that verified private, user-owned repository and published base, then use the private-cloud prompt below. Keep its task/PR there; never choose the shared sample. Reuse an existing private task if one already owns this work.', 'If the presenter shows a prepared cloud example, label it as prepared rather than claiming it was produced by the participant’s current run.'],
        evidence: ['Distinguish understanding the cloud workflow from actually executing a cloud task. The workshop’s HTTP test result should be labeled local.'],
        recovery: ['Optional C3: resume the HTTP step from the local DELETE example. C3 is a recovery label, not permission or a requirement to publish.'],
        limitations: ['Actual cloud execution requires the optional private upstream plus entitlement, write/policy permissions, and usage authorization. No private repository or approval is provisioned automatically.'],
        fallback: ['Finish the HTTP test locally or observe a driver. Keeping the shared repository untouched takes priority over trying every execution surface.'],
        template: 'privateCloud', commands: [], sources: ['cloud-use', 'access', 'delegate'],
      },
      mobile: {
        mode: 'READ / OPTIONAL LOCAL REMOTE CONTROL',
        navigation: ['Locate Copilot → New Session and Home → Agents → Agent Tasks for orientation, but do not create an exercise task or PR in the shared sample.'],
        actions: ['By default, review with the local driver or use an already approved /remote on CLI session. Remote control keeps execution on the original online machine; it is not a cloud task.', 'If you explicitly chose a private upstream and already started a cloud task there, open that same private task in Home → Agents → Agent Tasks. Only use New Session for an intentionally new task after verifying your private repository/base. Never select the shared sample.'],
        evidence: ['Identify whether you observed the driver or controlled an actual local session. In either case, do not claim the phone ran dotnet or that cloud produced the result.'],
        recovery: ['Optional C3: the local driver can resume from the prepared local example. No Mobile task or published checkpoint is required.'],
        limitations: ['Local remote control depends on approved policy, the same account, and an online host. It is optional prework, not a workaround for account restrictions.'],
        fallback: ['Review on an approved paired screen or keep working in a local client. No remote-control setup or repository publishing is necessary to finish.'],
        template: 'cloud', commands: [], sources: ['mobile-cloud', 'remote'],
      },
    },
  },
  {
    id: 'monitor', title: 'Monitor and steer', outcome: 'Watch the actual operation and keep one active writer.',
    panels: {
      vscode: {
        mode: 'LOCAL · progress and approvals',
        navigation: ['Select the current local session and inspect its operation, permission prompts, and changed files. Optional external-session views may expose a CLI/app session when supported.'],
        actions: ['Read the real tool output and stop or redirect scope drift. If switching to another local client, stop this writer and open the same folder rather than starting competing work.'],
        evidence: ['Look for the correct task and execution location, current output, and any real blocker. Session visibility does not automatically transfer file state.'],
        recovery: ['Optional C2/C3: use the local working example if you cannot get unstuck. Otherwise keep going without a checkpoint record.'],
        limitations: ['External-session discovery is version/policy dependent. A model summary or a quiet session is not proof that a test passed.'],
        fallback: ['Use the current local terminal and git diff if session controls are unavailable. Ask for help without publishing the exercise.'],
        commands: [], sources: ['sessions', 'harnesses'],
      },
      cli: {
        mode: 'LOCAL · stop and resume',
        navigation: ['Watch terminal output and individual approvals. Use /resume or copilot --resume when deliberately returning to a previous local session.'],
        actions: ['Press Esc twice to stop an unwanted operation, inspect the edits, and give a bounded correction. Do not run /delegate to chase a slow or blocked local operation.'],
        evidence: ['Read actual test output and tool requests. Check whether an optional remote controller is responding to the same local session to avoid conflicting actions.'],
        recovery: ['Optional C2/C3: keep the failed attempt and use a separate working example if needed. Resuming a session does not reset code.'],
        limitations: ['--continue may select another recent local session. Optional remote control stops being usable when the original host sleeps or goes offline.'],
        fallback: ['Continue locally without remote control, or switch to another client using the same copy. Preserve unfinished edits before trying recovery.'],
        commands: ['cliResume'], sources: ['cli-use', 'remote'],
      },
      app: {
        mode: 'LOCAL · status and Changes',
        navigation: ['Select the current local session in the app sidebar. Inspect its status, requested approvals, and Changes rather than a separate sandbox or worktree.'],
        actions: ['Read the actual command output and redirect only the bounded HTTP work. Stop another local writer before asking the app to make changes.'],
        evidence: ['Check which local folder the session uses and what the tool actually ran. Pending work is not a completed test result.'],
        recovery: ['Optional C2/C3: open a working example separately if you are stuck. If the operation is healthy, no save point or form is necessary.'],
        limitations: ['Local repository sessions, worktrees, and cloud sandboxes have different state. A similar session name does not prove it contains the current edits.'],
        fallback: ['Watch the local terminal or inspect git diff if the app cannot expose the needed detail. Keep the shared repository unchanged.'],
        commands: [], sources: ['app-sessions', 'sandboxes'],
      },
      cloud: {
        mode: 'READ-ONLY EXAMPLE · not a participant cloud run',
        navigation: ['Read the public cloud-session monitoring documentation or an already prepared presenter example. No new shared-repository task should be created for monitoring practice.'],
        actions: ['Identify where setup logs, active operations, approvals, and result links would appear. Compare those with the real local output from this exercise.'],
        evidence: ['Label an example as prepared and local results as local. The presence of cloud controls does not mean participant work has run there.'],
        recovery: ['Optional C4: review a completed local reference if the live local work is unfinished. It is not a substitute claim of cloud success.'],
        limitations: ['A real cloud task cannot monitor an unpublished local clone. If you chose the optional private workflow, inspect its actual setup/logs and keep all work and approvals in that private repository.'],
        fallback: ['Monitor in the local client that is actually running the HTTP test. Use the timebox without publishing code or starting another task.'],
        commands: [], sources: ['manage', 'environment'],
      },
      mobile: {
        mode: 'REVIEW / OPTIONAL LOCAL REMOTE CONTROL',
        navigation: ['Home → Agents → Agent Tasks shows actual account tasks, not unpublished local edits. Do not create a task just to fill this view.'],
        actions: ['Review the local driver’s output, or follow the same approved remote-controlled CLI session if already available. Coordinate permission responses with the local operator.'],
        evidence: ['Say which surface you used and where the commands ran. An empty Agent Tasks list is expected in this local-only lab, not a failure.'],
        recovery: ['Optional C4: review the completed local example if the current work is blocked. You do not need a Mobile checkpoint or a shared PR.'],
        limitations: ['Remote control keeps execution local and needs the original host online. Repository browsing cannot expose unpublished exercise files.'],
        fallback: ['Use a paired screen or a browser for observation if native Mobile or remote control is unavailable. Keep that distinction explicit.'],
        commands: [], sources: ['mobile-cloud', 'mobile', 'remote'],
      },
    },
  },
  {
    id: 'finish', title: 'Review and finish', outcome: 'Review your local diff and results. Nothing needs to be submitted.',
    panels: {
      vscode: {
        mode: 'LOCAL · final review',
        navigation: ['Open Source Control and the terminal in your practice clone. Keep other agents stopped while making any final review-driven edits.'],
        actions: ['Inspect the handler, tests, and request examples. Run complete validation and compare the actual behavior with the acceptance criteria. Leave the work local.'],
        evidence: ['Look for passing relevant tests and no unrelated changes. A local commit is optional; there is no required PR, push, or checkpoint submission.'],
        recovery: ['Optional C4: inspect the completed local example if you want to compare or finish by reviewing. Keep it distinct from your own generated attempt.'],
        limitations: ['Changing code after the last run means that result no longer covers all edits. A previously running server has its own process-local data.'],
        fallback: ['If tests are blocked, state what remains and review a prepared example or pair. Do not invent a passing result to finish the session.'],
        commands: ['complete'], sources: ['harnesses', 'review'],
      },
      cli: {
        mode: 'LOCAL · diff and test evidence',
        navigation: ['Return to the correct practice directory and inspect git status and git diff. Use the current session or choose it deliberately with copilot --resume.'],
        actions: ['Run complete validation and ask for a read-only review of the local diff. Keep fixes bounded and rerun checks when code changes; do not delegate or publish the result.'],
        evidence: ['Read actual counts and failures, then summarize what worked and what remains. No local commit or C4 record is required to finish.'],
        recovery: ['Optional C4: compare with the completed local recovery copy if needed. Preserve your unfinished work rather than resetting it away.'],
        limitations: ['A resumed conversation is not a code checkout or test run. A summary of tests is different from their actual output.'],
        fallback: ['Use direct shell commands if the CLI assistant is unavailable. You can keep learning from the same local files without remote access.'],
        commands: ['complete'], sources: ['cli-use', 'review'],
      },
      app: {
        mode: 'LOCAL · Changes and results',
        navigation: ['Open the same local repository session, inspect Changes, and use Interactive mode only for any needed local checks or fixes.'],
        actions: ['Run complete validation and review the handler/test/example diff. Leave the work in this copy; do not choose Create PR, push, or publish.'],
        evidence: ['Check the actual code and output, not a previous session’s summary. A clean committed tree is not required for a useful final review.'],
        recovery: ['Optional C4: open a separate completed local example to compare if you are stuck. The checkpoint is help, not an exit requirement.'],
        limitations: ['The app may show different worktrees with similar names. Make sure you are reviewing the folder containing the exercise edits.'],
        fallback: ['Use another local client or terminal for final checks if needed. Keep the code and QA artifacts out of shared repositories.'],
        commands: ['complete'], sources: ['app-start', 'app-sessions'],
      },
      cloud: {
        mode: 'READ-ONLY COMPARISON · no PR required',
        navigation: ['By default, review the public documentation and your local results; no PR is needed. If you explicitly used a private upstream, open only the existing task/PR in that private repository.'],
        actions: ['Review the local result without creating a hosted artifact. For the optional private workflow, inspect the actual private PR head, changed files, and complete test output; keep any follow-up in that same private task. Neither path submits anything to the shared sample.'],
        evidence: ['State whether the local feature passed or remains unfinished. A prepared cloud example and this local run are separate pieces of evidence.'],
        recovery: ['Optional C4: inspect a completed local reference if needed. A shared PR or published checkpoint is never required to complete the lab.'],
        limitations: ['Hosted CI on the shared sample cannot validate your unpublished edits. Do not trigger workflows or submit code to make a completion badge appear.'],
        fallback: ['Finish with a local diff/test review or observation. Keep questions in your own notes and leave the shared repository unchanged.'],
        commands: [], sources: ['review', 'cloud-use'],
      },
      mobile: {
        mode: 'REVIEW · no upload or submission',
        navigation: ['Use a paired local screen or an already approved local remote-control session to follow the final result. Public repository browsing still shows only the starter.'],
        actions: ['Compare the repeated-delete test with the criteria and discuss unresolved behavior. Do not create/edit a shared PR, comment on existing issues, or upload local work for this exercise.'],
        evidence: ['Describe what you actually reviewed and which local client ran the tests. Preserve the distinction between Mobile observation and local execution.'],
        recovery: ['Optional C4: review the completed local example if the live attempt is incomplete. No checkpoint, commit, or phone task is required to finish.'],
        limitations: ['Native Mobile cannot run the local .NET suite. Browser fallback or prepared results do not constitute a live Mobile/cloud execution rehearsal.'],
        fallback: ['Use read-only browser observation or pair verbally if Mobile is unavailable. Leave all code and results in the participant’s own copy.'],
        commands: [], sources: ['mobile', 'remote'],
      },
    },
  },
];

export const closing = [
  {
    id: 'recovery', title: 'If you get stuck',
    paragraphs: [
      'Recovery is optional. Stop the current agent, keep unfinished work, and use a new folder for a working starter or example. Do not hard-reset, clean, force-push, or overwrite somebody’s work to keep up with the presenter.',
      'The repository recovery instructions below explain the starter, local DELETE, and completed local examples. C1 reuses the starter with a planning prompt; C3 reuses the local DELETE example for the HTTP step. There are no mandatory checkpoint commits or published solution tags.',
      'The optional note template is there to help you explain a problem or remember where to resume. It is not homework, a handoff contract, or a required part of switching clients.',
      'Historical issue #7, PR #8, PR #13, and older practice material are read-only references. Do not change, comment on, reopen, or reuse them. Work stays local by default; the only optional upstream is private and user-owned, never shared or public.',
      'Be clear about what was actually exercised: local API tests, static-guide browser tests, prepared examples, optional private-cloud tasks, and native-client interactions are different things. The local path alone does not prove cloud or Mobile execution.',
      'Maintainers generate HTML, Markdown, and templates from content.mjs with node scripts/build-workshop-guide.mjs. Use --check and node scripts/test-workshop-guide.mjs to detect stale output. The optional --browser suite exercises the static guide, not the Copilot clients.',
    ],
    commands: ['reference'],
    links: [
      { title: 'Optional local recovery copies and verified reference', url: 'https://github.com/frye/net-users-demo/blob/main/workshop/reference/README.md#optional-recovery-copies' },
      { title: 'Historical Copilot practice instructions (read only)', url: 'https://github.com/frye/net-users-demo/blob/main/Copilot_Practice_Instructions.md' },
      { title: 'Historical TDD practice instructions (read only)', url: 'https://github.com/frye/net-users-demo/blob/main/Copilot_TDD_Practice_Instructions.md' },
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

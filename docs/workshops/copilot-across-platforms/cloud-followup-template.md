<!-- Generated from content.mjs. Replace placeholders; redact private paths before public/cloud sharing. -->
# Bounded cloud follow-up — use once, only after C3

```text
Continue the same DELETE exercise, not a new implementation.
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
If setup, policy, permissions, network or tests block you, report the blocker truthfully.
```

<!-- Generated from content.mjs. Replace placeholders; redact private paths before public/cloud sharing. -->
# Local HTTP follow-up prompt — no publishing

```text
Continue the same DELETE exercise in my current local/personal clone.
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
Leave the work in this copy. A local commit is optional, not a requirement.
```

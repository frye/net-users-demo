<!-- Generated from content.mjs. Replace placeholders; redact private paths before public/cloud sharing. -->
# Local task prompt

```text
Work only in my current local/personal clone of the public sample.
Do not push, publish files, open a PR or issue, or start a cloud task against any shared repository.
Plan the missing DELETE /api/v1/users/{id} handler and local tests first.
Read the repository instructions, controller, tests, and scripts/workshop/requirements.json.
Explain the proposed files and tests. Let me review the plan before implementation.
Acceptance criteria:
1. An existing ID returns 204 with an empty response body and removes that user.
2. A missing ID and a repeated deletion return 404 with the existing {"error":"User not found"} response.
3. Unrelated users stay unchanged. Preserve the existing GET, POST, PUT, and HTML behavior.
4. Use the injected structured logger and include the requested ID as a structured field.
5. Add meaningful local DELETE tests using scripts/workshop/requirements.json names and [Trait("Workshop", "Delete")]. Use NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh state and keep tests globally serialized.
6. Then add the HTTP repeated-delete regression using UsersApiFactory (WebApplicationFactory) and update the request examples. This is the next part of the same local exercise, not another implementation or PR.
Start with local tests and the handler; leave the HTTP regression for the follow-up step.
Use NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh per-case state.
Do not redesign storage, add a reset endpoint, weaken tests, or change unrelated routes/CI.
Run node scripts/workshop/validate.mjs local and show the actual result and test count.
No checkpoint record or commit is required to continue or switch local clients.
If I get stuck, explain the problem and offer an optional recovery copy without overwriting my work.
```

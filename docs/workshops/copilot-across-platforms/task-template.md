<!-- Generated from content.mjs. Replace placeholders; redact private paths before public/cloud sharing. -->
# Bounded local task prompt

```text
Task: implement only DELETE /api/v1/users/{id} in the prepared public sample.
Repository: https://github.com/frye/net-users-demo
Base branch: <base-branch>; working branch: <working-branch>; starting SHA: <C0-SHA>.
Read the repository instructions, controller, prepared tests and scripts/workshop/requirements.json first.
Plan before editing. Name the exact files and tests, explain risks, and wait for my approval.
Acceptance criteria:
1. DELETE /api/v1/users/{id}: an existing ID returns 204 with an empty response body and removes that user.
2. A missing ID and a repeated deletion return 404 with exactly the error contract {"error":"User not found"}.
3. Unrelated users remain unchanged. Preserve all existing GET, POST, PUT, and HTML behavior.
4. Use the injected structured logger and include the requested ID. Do not interpolate away the structured ID field.
5. Write meaningful local DELETE tests using the exact names in scripts/workshop/requirements.json and [Trait("Workshop", "Delete")]. Derive test classes from NetUsersApi.Tests.Infrastructure.UserStoreTest for fresh per-case state, and preserve globally serialized tests.
6. The bounded follow-up adds an HTTP repeated-delete regression using the prepared UsersApiFactory (WebApplicationFactory) and request examples. One task and one PR, not a second implementation.
Implement local tests and the handler first; reserve the HTTP follow-up for the next writer.
Do not redesign storage, add a reset endpoint, relax tests, alter unrelated routes, or change CI.
Use the prepared NetUsersApi.Tests.Infrastructure.UserStoreTest base class for fresh per-case state;
do not add parallel mutation of static users.
Validate with the C2 commands and report command, result, test count, and tested SHA/dirty state.
Do not commit, push, start cloud work, or create a PR without a separate explicit authorization.
If blocked, report the blocker and next action. Do not claim baseline-only checks prove DELETE works.
```

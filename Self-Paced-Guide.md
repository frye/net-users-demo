# .NET Users Demo — Workflow Guide

This guide shows how to accomplish the requested tasks using GitHub Copilot agents in VS Code: **Copilot Plan Mode** (for structured planning), **Copilot Agent Mode** (for executing changes), **Mission Control** (to observe agent runs), and **Copilot Chat** (to review changes). You'll work in a fork of `net-users-demo`, plan unit tests and delete functionality, create a tracking issue, implement tests via Agent Mode, observe execution, and review changes.

## How Copilot Agents Help

- **Copilot Plan Mode**: Produces clear, sequenced plans for features and tests before implementation.
- **Copilot Agent Mode**: Executes changes in your fork (editing files, running builds/tests) following your plans.
- **Mission Control**: Observes the Agent's actions, tool calls, diffs, and test runs in real time.
- **Copilot Chat**: Assists with code reviews, summarizes diffs, explains failures, and suggests fixes.

## Quick Start

- **Fork and clone**: Create a fork on GitHub, then `git clone` your fork; set upstream to original.
- **Branch**: `git checkout -b feature/tests-and-delete`.
- **Build check**: `dotnet --version`, then `dotnet build` to verify .NET 9 SDK is installed.

## Repository Summary and Gaps

### Structure:
- `net-users-api/Program.cs`: ASP.NET Core minimal hosting entrypoint.
- `net-users-api/Views/Home/Index.cshtml`: Razor view displaying users in an HTML table.
- `net-users-api/Models/UserProfile.cs`: User model with `Id`, `FullName`, `Emoji` properties (all `required`).
- `net-users-api/Controllers/`:
  - `HomeController.cs`: MVC controller serving the HTML table view.
  - `UsersController.cs`: REST API controller with in-memory `List<UserProfile>` storage.

### Implemented endpoints:
- `GET /` → HTML table view (via HomeController).
- `GET /api/v1/users` → returns `IEnumerable<UserProfile>` (200 OK).
- `GET /api/v1/users/{id}` → returns `UserProfile` or 404 (NotFound).
- `POST /api/v1/users` → creates and returns `UserProfile` (201 Created).
- `PUT /api/v1/users/{id}` → updates and returns `UserProfile` or 404.

### Constraints:
- .NET 9.0, minimal dependencies — `Microsoft.AspNetCore.OpenApi` for Swagger/OpenAPI.
- In-memory static `List<UserProfile>` seeded with demo users.
- `UserProfile` uses C# 12 `required` properties; nullable reference types enabled.

### Gaps:
- **No delete method** in `UsersController` or `[HttpDelete]` endpoint.
- **No tests** or CI.

## Tasks and Agent Usage (with Sample Prompts)

Use these agents and prompts to drive each task efficiently. Run prompts in **Copilot Plan Mode** for planning and **Copilot Agent Mode** for execution. Observe runs with **Mission Control** and review with **Copilot Chat**.

### Task 1: Plan Unit Test Generation (Plan Mode)

**Purpose**: Produce the unit test strategy before coding.

**Sample prompt (Plan Mode)**:
```
Plan unit tests for UsersController in net-users-demo per project guidance. 
Include test project setup (xUnit), files, coverage points, status codes, 
and minimal dependencies. Tests should use WebApplicationFactory for 
integration testing or mock ILogger for unit testing.
```

### Task 2: Plan Delete Functionality (Plan Mode)

**Purpose**: Define controller changes for delete.

**Sample prompt (Plan Mode)**:
```
Plan DELETE /api/v1/users/{id} implementation in UsersController: 
remove user from static list, return 204 No Content on success, 
404 NotFound if missing, README updates, and test plan.
```

### Task 3: Create GitHub Issue (Agent Mode + GitHub MCP)

**Purpose**: Track delete implementation in your fork.

**Sample prompt (Agent Mode, GitHub MCP)**:
```
Create an issue in my fork your-username/net-users-demo titled 
'Add DELETE /api/v1/users/{id} endpoint' with requirements, files, 
and acceptance criteria as specified. Label enhancement, backend; 
assign to me.
```

### Task 4: Implement Unit Test Plan (Agent Mode, read upstream issue with MCP)

**Purpose**: Execute the unit test plan using the tracking issue as the exact prompt via GitHub MCP.

**How to read and use the issue with MCP**:
1. Ensure GitHub MCP is connected with a PAT (`repo` scope) in VS Code.
2. Ask the Agent: "Fetch the latest open issue titled 'Add DELETE /api/v1/users/{id} endpoint' from my fork and display its body."
3. Copy the full issue body and use it verbatim as the Agent prompt for implementation.

**Sample prompt (Agent Mode)**:
```
Using the upstream tracking issue content verbatim, implement the unit test plan: 
create net-users-api.tests project with xUnit; add test file UsersControllerTests.cs 
with specified coverage; run dotnet test and fix failures aligned with UserProfile 
required properties. Commit and push a PR referencing the issue.
```

### Task 5: Observe Agent Execution (Mission Control)

**Purpose**: Monitor the agent's actions and test runs.

**Sample prompt (Mission Control context)**:
```
Start observing the unit test implementation run. Mark checkpoints after 
test project creation, after test file creation, and after successful 
dotnet test. Surface failures and suggest corrections.
```

### Task 6: Code Review with Copilot (Copilot Chat)

**Purpose**: Review changes, summarize diffs, and suggest fixes.

**Sample prompts (Copilot Chat)**:
```
Summarize changes in UsersController.cs and tests. Identify potential 
issues and suggest minimal fixes.
```

```
Explain failing tests and propose corrections consistent with project 
guidance (status codes, required properties, minimal dependencies).
```

```
Generate a review checklist covering controller paths 
(create/update/find/delete), 404 mapping, 201/200/204 status codes, 
and README updates.
```

## Detailed Steps

### Task 1: Copilot Plan Mode — Unit Test Generation

**Create test project**:
- Create `net-users-api.tests/` directory at solution level (sibling to `net-users-api/`).
- Use `dotnet new xunit -o net-users-api.tests` to scaffold test project.
- Add project reference: `dotnet add net-users-api.tests reference net-users-api`.

**Test dependencies**:
- xUnit (included by template): `xunit`, `xunit.runner.visualstudio`.
- Add `Microsoft.AspNetCore.Mvc.Testing` for integration tests with `WebApplicationFactory`.
- Alternative: Use `Moq` for mocking `ILogger<UsersController>` in unit tests.

**Create test file**:
- `net-users-api.tests/Controllers/UsersControllerTests.cs`.

**`UsersControllerTests` coverage**:

**Option A: Integration Testing with WebApplicationFactory**:
- Test against actual HTTP endpoints using `HttpClient`.
- `GET /api/v1/users` → 200 OK, JSON array with seeded users.
- `GET /api/v1/users/{id}` → 200 OK for existing ID, 404 NotFound for missing.
- `POST /api/v1/users` → 201 Created, returns created user with proper Location header.
- `PUT /api/v1/users/{id}` → 200 OK for existing, 404 NotFound for missing.

**Option B: Unit Testing with Mocks**:
- Mock `ILogger<UsersController>` using `Moq` or `NSubstitute`.
- Test controller methods directly without HTTP layer.
- Verify `ActionResult<T>` types: `OkObjectResult`, `NotFoundObjectResult`, `CreatedAtActionResult`.

**Seed users to verify**:
- "John Doe" 😀 (id: "1")
- "Jane Smith" 🚀 (id: "2")
- "Robert Johnson" 🎸 (id: "3")

**Align tests with**:
- `UserProfile` uses `required` properties - all fields must be present in test data.
- Static list in `UsersController` - tests share state unless controller is recreated per test.
- Keep dependencies minimal.

### Task 2: Copilot Plan Mode — Delete Functionality

**Controller changes**:
- Add `[HttpDelete("{id}")]` method in `UsersController`.
- Remove user from static `_users` list if exists.
- Return `NoContent()` (204) on successful deletion.
- Return `NotFound()` (404) if user ID not found.
- Log the delete operation with `_logger.LogInformation()`.

**Documentation**:
- Update `README.md` to include DELETE endpoint behavior and status codes.
- Add XML documentation comments to the delete method.

**Optional UI**:
- Add delete button to `Index.cshtml` table rows.
- Implement JavaScript `fetch('/api/v1/users/{id}', { method: 'DELETE' })`.
- Refresh table after successful deletion.

**Tests** (added in Task 4 execution):
- DELETE existing user → 204 No Content.
- DELETE non-existent user → 404 NotFound.

### Task 3: Agent Mode + GitHub MCP — Create Issue

**Prerequisites**:
- Configure GitHub MCP with PAT (`repo` scope) in VS Code.
- Start Copilot Agent Mode with GitHub MCP provider.

**Create issue in `your-username/net-users-demo`**:

**Title**: `Add DELETE /api/v1/users/{id} endpoint`

**Body**:
```
## Summary
Implement DELETE endpoint for removing users from the in-memory user list.

## Requirements
- Add [HttpDelete("{id}")] method to UsersController
- Remove user from static _users list
- Return 204 No Content on success
- Return 404 NotFound if user doesn't exist
- Add ILogger statement for delete operations
- Update README.md with DELETE endpoint documentation
- Add XML documentation comments
- Create unit/integration tests for delete functionality

## Files to Modify
- net-users-api/Controllers/UsersController.cs
- README.md
- net-users-api.tests/Controllers/UsersControllerTests.cs (add delete tests)

## Acceptance Criteria
- [ ] DELETE /api/v1/users/{id} returns 204 for existing user
- [ ] DELETE /api/v1/users/{id} returns 404 for non-existent user
- [ ] User is removed from _users list
- [ ] Tests pass with dotnet test
- [ ] README documents DELETE endpoint
- [ ] Code includes XML documentation
```

**Labels**: `enhancement`, `backend`  
**Assignee**: yourself

Verify the issue appears on GitHub.

### Task 4: Agent Mode — Implement Unit Test Plan (Read Upstream Issue as Prompt)

**Start by reading the upstream tracking issue content** (created in Task 3) and use it verbatim as the Agent Mode prompt. This ensures the agent executes exactly against the acceptance criteria and file targets from the issue.

**Steps**:

1. **Validate .NET SDK**: Run `dotnet --version` (ensure .NET 9.0 is installed).

2. **Create test project** (if not exists):
   ```bash
   dotnet new xunit -o net-users-api.tests
   dotnet add net-users-api.tests reference net-users-api
   dotnet sln add net-users-api.tests
   ```

3. **Add testing packages**:
   ```bash
   cd net-users-api.tests
   dotnet add package Microsoft.AspNetCore.Mvc.Testing
   # OR for unit testing with mocks:
   dotnet add package Moq
   ```

4. **Implement `UsersControllerTests.cs`**:
   - Create `Controllers/UsersControllerTests.cs` in test project.
   - Cover all endpoints: GET all, GET by ID, POST, PUT.
   - Use `WebApplicationFactory<Program>` for integration tests.
   - OR use `Moq` to mock `ILogger<UsersController>` for unit tests.
   - Verify status codes: 200 OK, 201 Created, 404 NotFound.
   - Verify response payloads match expected JSON structure.

5. **Run tests**:
   ```bash
   dotnet test
   ```
   Fix any failures related to:
   - `required` properties in `UserProfile` (ensure all test data includes Id, FullName, Emoji).
   - Static list state sharing between tests (consider recreating controller or clearing list).
   - HTTP status code assertions.

6. **Commit and push**:
   ```bash
   git add net-users-api.tests/
   git add net-users-demo.sln  # if modified
   git commit -m "Add unit/integration tests for UsersController"
   git push origin feature/tests-and-delete
   ```

7. **Open PR** referencing the issue (e.g., "Closes #1").

### Task 5: Mission Control — Observe Agent Execution

**During the Agent run for Task 4**:

- Open **Mission Control** panel in VS Code.
- Start observing the agent's execution.
- **Checkpoints**:
  1. After test project creation (`dotnet new xunit`).
  2. After package additions (`Microsoft.AspNetCore.Mvc.Testing` or `Moq`).
  3. After test file creation (`UsersControllerTests.cs`).
  4. After successful `dotnet test` run.
- **Intervene** if:
  - The agent stalls or generates incorrect test patterns.
  - Assertions fail due to mismatched status codes or JSON structure.
  - Dependencies are missing or versions are incompatible.
- **Export logs/diffs** for later review or debugging.

### Task 6: Code Review — Review with Copilot

**Use Copilot Chat for code review**:

1. **Summarize changes**:
   ```
   Summarize changes in UsersController.cs and UsersControllerTests.cs. 
   Identify potential issues and suggest minimal fixes.
   ```

2. **Validate with tests**:
   ```bash
   dotnet test
   ```
   If tests fail, ask Copilot:
   ```
   Explain failing tests and propose corrections consistent with project 
   guidance (status codes, required properties, minimal dependencies).
   ```

3. **Generate review checklist**:
   ```
   Generate a review checklist covering:
   - Controller paths (create/update/find/delete)
   - 404 NotFound mapping for missing users
   - Status codes: 201 Created, 200 OK, 204 No Content, 404 NotFound
   - Minimal dependencies (xUnit, Mvc.Testing or Moq)
   - README updates with DELETE endpoint
   - XML documentation on controller methods
   ```

4. **PR feedback**:
   - Review the PR diff on GitHub.
   - Use Copilot suggestions to comment on code quality, test coverage, or missing edge cases.
   - Request changes or approve when acceptance criteria are met.

## Troubleshooting

### .NET SDK not found
**Solution**: Install .NET 9 SDK from [dotnet.microsoft.com](https://dotnet.microsoft.com/download/dotnet/9.0) or use `dotnet --version` to check current version.

### Build fails with C# language errors
**Solution**: Ensure project targets .NET 9 (`<TargetFramework>net9.0</TargetFramework>` in `.csproj`). Verify nullable reference types are enabled (`<Nullable>enable</Nullable>`).

### Test failures due to `required` properties
**Solution**: Ensure all test `UserProfile` instances include `Id`, `FullName`, and `Emoji`. Use object initializers:
```csharp
new UserProfile { Id = "4", FullName = "Test User", Emoji = "🧪" }
```

### 404/response mismatches in integration tests
**Solution**: 
- Verify routes match controller `[Route]` attributes (`/api/v1/users`).
- Confirm `NotFound()` returns 404 status code in controller.
- For DELETE, ensure `NoContent()` returns 204.

### Static list state pollution between tests
**Solution**: 
- Use `WebApplicationFactory` with separate app instances per test.
- OR reset the static `_users` list in a setup method (requires making it accessible).
- Consider using dependency injection with scoped service instead of static list.

### Missing `Microsoft.AspNetCore.Mvc.Testing` package
**Solution**: 
```bash
dotnet add net-users-api.tests package Microsoft.AspNetCore.Mvc.Testing
```

### `dotnet test` hangs or fails to discover tests
**Solution**: 
- Ensure test project references main project correctly.
- Verify `xunit` and `xunit.runner.visualstudio` packages are installed.
- Run `dotnet restore` and rebuild solution.

### Emoji encoding issues in tests
**Solution**: Ensure test files use UTF-8 encoding. .NET handles Unicode strings natively, but verify your editor saves files as UTF-8.

## Additional Resources

- [ASP.NET Core Testing Documentation](https://learn.microsoft.com/en-us/aspnet/core/test/)
- [xUnit Documentation](https://xunit.net/)
- [WebApplicationFactory Integration Tests](https://learn.microsoft.com/en-us/aspnet/core/test/integration-tests)
- [Moq Mocking Library](https://github.com/moq/moq4)
- [GitHub Copilot in VS Code](https://code.visualstudio.com/docs/copilot/overview)

---

**Remember**: This is an educational project focused on learning GitHub Copilot and TDD practices. Code clarity and educational value take precedence over production-grade optimizations.

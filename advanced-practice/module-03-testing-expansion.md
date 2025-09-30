# Module 3: Testing Expansion

[⬅️ Back to Index](README.md) | [← Previous: Module 2](module-02-validation-error-handling.md) | [Next: Spec-Kit Intro →](spec-kit-intro.md)

---

## 🚀 Getting Started: Create a GitHub Issue

Before starting the exercises, create a tracking issue using GitHub Copilot:

### Step 1: Open GitHub Issue Creation
1. Navigate to your repository on github.com
2. Go to the **Issues** tab
3. Click **New Issue**

### Step 2: Use Copilot to Generate Issue
1. Below the description field, click the **Write with Copilot** link
2. Use the contents of [`module-03-issue-prompt.md`](module-03-issue-prompt.md) as your prompt
3. Copilot will generate a complete issue description with:
   - Overview of testing expansion goals
   - Detailed task checklist (45+ items)
   - Instructions for Copilot to maintain the task list
   - Acceptance criteria and resources

### Step 3: Create and Track
1. Give the issue a title: **"Module 3: Testing Expansion"**
2. Add labels: `enhancement`, `testing`, `copilot-practice`
3. Create the issue

### Step 4: Assign Work to Copilot Coding Agent
1. In the created issue on GitHub.com, locate the **Assignees** section in the right sidebar
2. Click **Assign to Copilot** (or search for "copilot" in assignees)
3. This assigns the autonomous coding agent to work on the issue
4. Copilot will begin analyzing the issue and creating an implementation plan

### Step 5: Monitor the Coding Agent Session
**Track Progress:**
- View the newly created Pull request that is in **WIP** status
- Scroll down to line that reads **Copilot started work on behalf of @your-username**
- Click the View Session button
- Monitor real-time updates as Copilot:
  - Analyzes the codebase
  - Creates a work plan
  - Implements tests
  - Runs test suites
  - Updates task checkboxes
  - Creates commits

**Review Work:**
- Check the **Files Changed** section to see what Copilot is modifying
- Review the **Commit History** for the issue branch
- Copilot will create a Pull Request when ready

**Interact with Agent:**
- Add comments to the issue to provide guidance or corrections
- Use @copilot mentions to ask questions or request changes
- Approve or request changes on the PR when Copilot completes work

**Tips:**
- The agent works autonomously but you can pause/resume as needed
- Task list updates happen automatically as Copilot completes work
- You can take over manually at any time by checking out the branch

---

### Exercise 3.1: Comprehensive Unit Test Suite

**Goal**: Achieve high unit test coverage for controllers and models

**Sample Prompt**:
```
Create an xUnit test project at solution level: net-users-api.Tests.
Add tests for UsersController covering all endpoints: GetUsers, GetUser, 
CreateUser, UpdateUser, DeleteUser. Test happy paths and error cases.
Mock the logger. Use the Arrange-Act-Assert pattern.
Test edge cases: null inputs, invalid IDs, duplicate entries, empty lists.
```

**Acceptance Criteria**:
- [ ] Test project created with xUnit
- [ ] Tests for all controller methods
- [ ] Both success and failure paths covered
- [ ] Edge cases tested
- [ ] Tests use proper naming convention
- [ ] All tests pass

**Stretch Goals**:
- Achieve >80% code coverage
- Use theory/inline data for parameterized tests
- Add performance/benchmark tests
- Test concurrent access scenarios
- Add mutation testing
- Use AutoFixture for test data generation

**Sample Prompt for Advanced Testing**:
```
Enhance the test suite with Theory tests using InlineData for multiple scenarios.
Add a test class for testing pagination: various page sizes, boundary conditions,
invalid page numbers. Use AutoFixture to generate test data.
Add a benchmark test using BenchmarkDotNet to measure GetUsers performance.
```

---

### Exercise 3.2: Integration Testing

**Goal**: Create integration tests that exercise the full API stack

**Sample Prompt**:
```
Create integration tests using WebApplicationFactory in the test project.
Test the full HTTP request/response cycle for all endpoints.
Use a test fixture to setup and teardown the test server.
Test content negotiation, status codes, response headers, and JSON serialization.
Create a test data seeder for consistent test state.
```

**Acceptance Criteria**:
- [ ] Integration test class created
- [ ] Uses `WebApplicationFactory<Program>`
- [ ] Tests actual HTTP requests/responses
- [ ] Tests don't interfere with each other (isolated)
- [ ] Validates response status codes and content
- [ ] All integration tests pass

**Stretch Goals**:
- Use TestContainers for database integration
- Test with different content types (JSON, XML)
- Add tests for middleware pipeline
- Test authentication/authorization flows
- Add load testing scenarios
- Test graceful degradation

---

### Exercise 3.3: Property-Based Testing

**Goal**: Use property-based testing to find edge cases

**Sample Prompt**:
```
Add FsCheck or FsCheck.Xunit to the test project for property-based testing.
Create property tests for UserProfile validation: any valid user should
successfully serialize/deserialize, Id generation should always produce unique values,
email validation should accept all valid RFC formats.
Test that pagination always returns correct counts and never loses/duplicates items.
```

**Acceptance Criteria**:
- [ ] FsCheck or similar library added
- [ ] At least 3 property-based tests created
- [ ] Tests find edge cases not covered by example-based tests
- [ ] Properties are clearly defined and documented
- [ ] Tests run with sufficient iterations

**Stretch Goals**:
- Add shrinking to find minimal failing cases
- Test invariants that should always hold
- Use custom generators for domain objects
- Integrate fuzzing for input validation
- Create property tests for API contract compliance

---

---

[⬅️ Back to Index](README.md) | [← Previous: Module 2](module-02-validation-error-handling.md) | [Next: Spec-Kit Intro →](spec-kit-intro.md)

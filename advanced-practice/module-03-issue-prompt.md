# Prompt: Generate Testing Expansion Issue

Generate a GitHub issue description for implementing comprehensive testing expansion in the .NET Users Demo API. The issue should track three main testing initiatives: unit testing, integration testing, and property-based testing.

## Requirements

Create a markdown issue body that includes:

1. **Title**: Module 3: Testing Expansion
2. **Overview**: Brief description of testing goals (unit, integration, property-based)
3. **Task List**: All tasks below as checkboxes
4. **Instructions**: Tell Copilot to check off tasks as completed

## Tasks to Track

### Exercise 3.1: Comprehensive Unit Test Suite
- [ ] Create xUnit test project at solution level: `net-users-api.Tests`
- [ ] Add project reference from test project to main API project
- [ ] Install required testing packages (xUnit, Moq, FluentAssertions)
- [ ] Create `UsersControllerTests` class with proper namespace
- [ ] Test `GetUsers()` - happy path (returns all users)
- [ ] Test `GetUsers()` - edge case (empty list)
- [ ] Test `GetUser(id)` - happy path (valid ID returns user)
- [ ] Test `GetUser(id)` - error case (invalid ID returns NotFound)
- [ ] Test `GetUser(id)` - edge case (null/empty ID)
- [ ] Test `CreateUser()` - happy path (creates and returns 201)
- [ ] Test `CreateUser()` - error case (duplicate ID returns conflict)
- [ ] Test `CreateUser()` - validation (null/invalid data returns BadRequest)
- [ ] Test `UpdateUser(id)` - happy path (updates existing user)
- [ ] Test `UpdateUser(id)` - error case (non-existent user returns NotFound)
- [ ] Test `UpdateUser(id)` - validation (invalid data)
- [ ] Test `DeleteUser(id)` - happy path (deletes and returns NoContent)
- [ ] Test `DeleteUser(id)` - error case (non-existent user returns NotFound)
- [ ] Mock ILogger in all controller tests
- [ ] Verify all tests follow Arrange-Act-Assert pattern
- [ ] Run `dotnet test` and confirm all tests pass
- [ ] **Stretch**: Achieve >80% code coverage
- [ ] **Stretch**: Add Theory tests with InlineData for parameterized scenarios
- [ ] **Stretch**: Add AutoFixture for test data generation
- [ ] **Stretch**: Add BenchmarkDotNet performance tests

### Exercise 3.2: Integration Testing
- [ ] Create `IntegrationTests` folder in test project
- [ ] Install `Microsoft.AspNetCore.Mvc.Testing` package
- [ ] Create `CustomWebApplicationFactory<Program>` class
- [ ] Implement test fixture for server setup/teardown
- [ ] Create `UsersApiIntegrationTests` class
- [ ] Test GET /api/v1/users - full HTTP request/response cycle
- [ ] Test GET /api/v1/users/{id} - status codes and JSON deserialization
- [ ] Test POST /api/v1/users - request body and response headers
- [ ] Test PUT /api/v1/users/{id} - full update flow
- [ ] Test DELETE /api/v1/users/{id} - status codes
- [ ] Ensure test isolation (tests don't affect each other)
- [ ] Create test data seeder for consistent state
- [ ] Validate response content types and headers
- [ ] Run integration tests and confirm all pass
- [ ] **Stretch**: Use TestContainers for database integration tests
- [ ] **Stretch**: Test content negotiation (JSON/XML)
- [ ] **Stretch**: Test middleware pipeline behavior
- [ ] **Stretch**: Add load testing scenarios

### Exercise 3.3: Property-Based Testing
- [ ] Install FsCheck.Xunit package
- [ ] Create `PropertyTests` folder in test project
- [ ] Create `UserProfilePropertyTests` class
- [ ] Add property test: UserProfile serialization/deserialization roundtrip
- [ ] Add property test: ID generation always produces unique values
- [ ] Add property test: Email validation accepts all valid RFC formats
- [ ] Add property test: Pagination never loses or duplicates items
- [ ] Add property test: Pagination count accuracy
- [ ] Configure sufficient test iterations (100+ cases)
- [ ] Document properties being tested with XML comments
- [ ] Run property tests and verify edge case discovery
- [ ] **Stretch**: Implement custom generators for domain objects
- [ ] **Stretch**: Add shrinking to find minimal failing cases
- [ ] **Stretch**: Test API contract invariants
- [ ] **Stretch**: Integrate fuzzing for input validation

## Copilot Instructions

**🤖 GitHub Copilot: Please check off tasks in this list as you complete them during development. Keep the task list current to track progress.**

When working on this issue:
1. Update checkboxes from `[ ]` to `[x]` as you complete each task
2. Work through exercises sequentially (3.1 → 3.2 → 3.3)
3. Mark stretch goals only if time permits
4. Run tests after completing each exercise to verify functionality
5. Keep the task list as a single source of truth for progress

## Acceptance Criteria

All non-stretch tasks must be completed with:
- ✅ Tests follow xUnit conventions and naming patterns
- ✅ All tests use Arrange-Act-Assert pattern
- ✅ Tests are isolated and repeatable
- ✅ All tests pass with `dotnet test`
- ✅ Test project structure mirrors main project
- ✅ Proper mocking and test doubles used
- ✅ Both happy paths and error cases covered

## Resources

- xUnit Documentation: https://xunit.net/
- Moq Documentation: https://github.com/moq/moq4
- WebApplicationFactory: https://learn.microsoft.com/aspnet/core/test/integration-tests
- FsCheck: https://fscheck.github.io/FsCheck/

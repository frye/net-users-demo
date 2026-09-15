# GitHub Copilot Instructions for .NET Users Demo

## Project Overview

This is a .NET 9 REST API demonstration project designed for practicing GitHub Copilot features and Test-Driven Development. It provides a simple user profile management API with both JSON endpoints and an HTML table view.

**Primary Purpose**: Educational project for learning GitHub Copilot and TDD practices with ASP.NET Core.

## Technology Stack

### Core Technologies
- **.NET 9.0** - Workshop target; exact SDK pinned in `global.json`
- **ASP.NET Core** - Web framework for building the REST API
- **C# 12** - Primary programming language with nullable reference types enabled
- **Kestrel** - Web server (configured to run on port 8080)

### Features & Capabilities
- **MVC Pattern** - Controllers and Views for web endpoints
- **Razor Views** - For HTML rendering (Index.cshtml)
- **REST API** - JSON endpoints following REST conventions
- **OpenAPI/Swagger** - API documentation (Microsoft.AspNetCore.OpenApi)
- **Dependency Injection** - Built-in DI container
- **Logging** - ILogger for structured logging
- **In-memory Data Storage** - Static list-based data persistence (no database)

### Testing Framework
- **xUnit** - Prepared baseline in `net-users-api.tests/`, with an HTTP test host

### Copilot Across Platforms workshop

- Start at `docs/workshops/copilot-across-platforms/guide.md`; use the standalone
  `copilot` CLI, not historical `gh copilot suggest` examples.
- Keep DELETE unfinished on the prepared starter. Implement it only when explicitly
  working on the exercise; do not copy the facilitator reference as preparation.
- Use `dotnet restore net-users-demo.sln`, `dotnet build net-users-demo.sln`,
  and `node scripts/workshop/validate.mjs baseline`.
- For exercise changes, add focused tests with the names in
  `scripts/workshop/requirements.json`, tagged `Workshop=Delete`; validate with
  `node scripts/workshop/validate.mjs local`. The local (or optional private-cloud) follow-up adds the HTTP
  regression tagged `Workshop=DeleteHttp`, then runs `complete`.
- Missing or skipped feature tests are not success. Keep existing baseline tests.
- Derive store-sharing tests from `UserStoreTest`; use `UsersApiFactory` for HTTP.
  Assembly-wide test serialization and fresh profile snapshots are intentional.
  Do not add production reset hooks or redesign storage for this exercise.
- No `.vscode/mcp.json` servers, MCP credentials, skills, or plugins are required.
- Participant exercise work stays in the user's local clone. Never push, create
  issues/PRs, or start participant cloud tasks against the shared sample.
  Only an explicitly chosen, policy-approved private user-owned upstream is allowed.
  A disabled source push URL does not block API-based tasks/PRs. Do not infer a
  private target from a second remote; verify private visibility, user ownership,
  and the actual selected repository. Prefer explicit browser selection rather
  than CLI delegation or app defaults from a sample-origin checkout.
- Checkpoints are optional recovery aids, not handoff gates. Local clients may use
  the same folder and uncommitted edits without a checkpoint commit or record.
  Stop the previous agent before another edits, and verify the intended folder.
- Use recovery examples only in a separate copy; preserve unfinished work. Finish
  the HTTP follow-up locally by default. Cloud needs the optional private upstream;
  otherwise use read-only orientation or a truthful local fallback.
- Maintainer changes to the guide itself may be published when explicitly requested;
  that is separate from the participant lab's no-shared-submission rule.

## Project Structure

```
net-users-demo/                          # Solution root
├── .github/
│   └── copilot-instructions.md          # This file
├── net-users-api/                       # Main API project
│   ├── Controllers/
│   │   ├── HomeController.cs            # MVC controller for HTML views
│   │   └── UsersController.cs           # API controller for REST endpoints
│   ├── Models/
│   │   └── UserProfile.cs               # User data model
│   ├── Views/
│   │   └── Home/
│   │       └── Index.cshtml             # HTML table view
│   ├── Properties/
│   │   └── launchSettings.json          # Launch configuration
│   ├── Program.cs                       # Application entry point
│   ├── appsettings.json                 # Application configuration
│   ├── appsettings.Development.json     # Development-specific settings
│   ├── net-users-api.csproj             # Project file
│   └── README.md                        # Project-specific documentation
├── net-users-demo.sln                   # Solution file
└── net-users-api.tests/                # Baseline tests and HTTP test host
```

### Important Structural Guidelines
- **Test Project Location**: Any future test projects should be created at the solution level (sibling to `net-users-api/`), NOT inside the API project
- **Test Project Naming**: Follow convention: `net-users-api.tests/` or `net-users-api.Tests/`
- **Separation of Concerns**: Keep API code, tests, and documentation properly separated

## Code Style & Conventions

### Naming Conventions
- **Namespace**: `NetUsersApi` (and sub-namespaces like `NetUsersApi.Models`, `NetUsersApi.Controllers`)
- **Classes**: PascalCase (e.g., `UserProfile`, `UsersController`)
- **Methods**: PascalCase (e.g., `GetUsers`, `CreateUser`)
- **Variables/Parameters**: camelCase (e.g., `userId`, `userName`)
- **Private fields**: _camelCase with underscore prefix (e.g., `_logger`, `_users`)
- **Properties**: PascalCase (e.g., `FullName`, `Id`)

### C# Language Features
- **Nullable Reference Types**: Enabled - use `required` keyword for mandatory properties
- **Implicit Usings**: Enabled - common namespaces automatically imported
- **Top-level Statements**: Used in `Program.cs` for minimal hosting model
- **Modern C# Syntax**: Use pattern matching, expression-bodied members, LINQ where appropriate

### API Conventions
- **Route Prefix**: All API endpoints use `/api/v1/` prefix
- **HTTP Verbs**: Follow RESTful conventions (GET, POST, PUT, DELETE)
- **Response Types**: Return `ActionResult<T>` from controller actions
- **Status Codes**: Use appropriate HTTP status codes (200, 201, 404, 400, etc.)
- **Error Responses**: Return JSON objects with descriptive error messages

### Controller Patterns
```csharp
[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;
    
    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }
    
    [HttpGet]
    public ActionResult<IEnumerable<UserProfile>> GetUsers()
    {
        // Implementation
    }
}
```

### Model Patterns
```csharp
namespace NetUsersApi.Models;

public class UserProfile
{
    public required string Id { get; set; }
    public required string FullName { get; set; }
    public required string Emoji { get; set; }
}
```

## API Endpoints

### Current Implementation
- **GET /** - HTML table view (via HomeController)
- **GET /api/v1/users** - Get all users (JSON)
- **GET /api/v1/users/{id}** - Get user by ID
- **POST /api/v1/users** - Create new user
- **PUT /api/v1/users/{id}** - Update existing user
- **DELETE /api/v1/users/{id}** - ⚠️ TODO: Not yet implemented (intentional for practice)

### Data Model
```json
{
  "id": "string",
  "fullName": "string",
  "emoji": "string"
}
```

### Sample Data
The API includes three pre-populated users:
1. John Doe 😀 (id: "1")
2. Jane Smith 🚀 (id: "2")
3. Robert Johnson 🎸 (id: "3")

## Development Guidelines

### When Adding New Features
1. **Controllers**: Add to appropriate controller in `Controllers/` folder
2. **Models**: Add new data models to `Models/` folder with `NetUsersApi.Models` namespace
3. **Views**: Add Razor views under `Views/{ControllerName}/` folder
4. **Logging**: Use injected `ILogger<T>` for logging, not `Console.WriteLine` (except in `Program.cs`)
5. **Validation**: Add data validation attributes from `System.ComponentModel.DataAnnotations`

### When Adding Tests
1. **Use the existing test project**: `net-users-api.tests` at solution level
2. **Reference main project**: The project reference to `net-users-api` is already configured
3. **Test structure**: Mirror the structure of the main project (Controllers/, Models/, etc.)
4. **Naming convention**: Test classes should end with `Tests` (e.g., `UsersControllerTests`)
5. **xUnit patterns**: Use `[Fact]` for tests, `[Theory]` for parameterized tests

### Testing Patterns (xUnit)
```csharp
using Xunit;

namespace NetUsersApi.Tests.Controllers;

public class UsersControllerTests
{
    [Fact]
    public void GetUsers_ReturnsAllUsers()
    {
        // Arrange
        // Act
        // Assert
    }
    
    [Theory]
    [InlineData("1")]
    [InlineData("2")]
    public void GetUser_ValidId_ReturnsUser(string id)
    {
        // Test implementation
    }
}
```

### Error Handling
- Return appropriate HTTP status codes
- Use `NotFound()` for missing resources
- Use `BadRequest()` for validation errors
- Use `Ok()` for successful GET requests
- Use `CreatedAtAction()` for successful POST requests
- Include descriptive error messages in response body

### Logging
- Log all incoming API requests
- Use appropriate log levels (Information, Warning, Error)
- Include relevant context in log messages
- Example: `_logger.LogInformation("GET /api/v1/users endpoint called");`

## Running the Application

### Development
```bash
# From solution root
dotnet run --project net-users-api

# Or from project directory
cd net-users-api
dotnet run
```

**Server runs on**: `http://localhost:8080`

### Building
```bash
dotnet build
```

### Testing
```bash
# Run all tests
dotnet test

# Run tests with coverage
dotnet test --collect:"XPlat Code Coverage"
```

## Common Tasks

### Adding a New Endpoint
1. Add method to appropriate controller
2. Use appropriate HTTP verb attribute (`[HttpGet]`, `[HttpPost]`, etc.)
3. Add XML documentation comments
4. Inject and use logger for request logging
5. Return appropriate `ActionResult<T>` type

### Adding a New Model
1. Create class in `Models/` folder
2. Use `NetUsersApi.Models` namespace
3. Use `required` keyword for mandatory properties
4. Add XML documentation comments
5. Consider adding validation attributes

### Modifying Configuration
- **Port changes**: Modify `Program.cs` in `ConfigureKestrel` section
- **Logging**: Modify `Program.cs` in logging configuration section
- **App settings**: Modify `appsettings.json` or `appsettings.Development.json`

## Key Dependencies

- **Microsoft.AspNetCore.OpenApi** (v9.0.1) - OpenAPI/Swagger support
- No database dependencies (in-memory storage only)
- No external service dependencies

## Important Notes

### Data Persistence
- **In-memory only**: Data is stored in static list, resets on application restart
- **Not thread-safe**: Current implementation doesn't handle concurrent requests safely
- **For demo purposes**: Not intended for production use

### Intentional TODOs
- **DELETE endpoint**: Left unimplemented for practice exercises
- **Tests**: Existing-route baseline is prepared; focused DELETE tests remain the TDD exercise
- **Database**: No persistence layer - simplified for learning purposes

### Practice Materials
The project includes practice instructions for:
- GitHub Copilot features (`Copilot_Practice_Instructions.md`)
- Test-Driven Development (`Copilot_TDD_Practice_Instructions.md`)

## When Generating Code

### Prefer:
- Modern C# syntax (pattern matching, expression bodies, null-coalescing)
- Async/await for I/O operations (if adding database or external calls)
- LINQ for collection operations
- Dependency injection over static dependencies
- XML documentation comments for public APIs
- Descriptive variable names over abbreviations

### Avoid:
- Blocking I/O calls
- `Console.WriteLine` in controllers (use ILogger instead)
- Hardcoding configuration values
- Exposing implementation details in public APIs
- Breaking existing API contracts without versioning

## Future Expansion Areas

When expanding this project, consider:
1. **Database integration** - Entity Framework Core with SQLite/PostgreSQL
2. **Authentication/Authorization** - JWT tokens, ASP.NET Identity
3. **Validation** - FluentValidation library
4. **Testing** - xUnit with Moq for mocking
5. **API versioning** - Microsoft.AspNetCore.Mvc.Versioning
6. **CORS** - If adding frontend applications
7. **Health checks** - ASP.NET Core health check middleware
8. **Docker** - Containerization for deployment

## Version Information

- **.NET Version**: 9.0
- **C# Version**: 12 (implicit from .NET 9)
- **Target Framework**: net9.0
- **Project SDK**: Microsoft.NET.Sdk.Web

---

**Remember**: This is an educational project focused on learning GitHub Copilot and TDD practices. Code clarity and educational value take precedence over production-grade optimizations.

# .NET Users Demo

A .NET 9 REST API demonstration project that mirrors the functionality of the [frye/go-users-demo](https://github.com/frye/go-users-demo) repository. This project is designed for practicing GitHub Copilot features and Test-Driven Development with ASP.NET Core.

## Copilot Across Platforms workshop

Start with the **[participant guide](docs/workshops/copilot-across-platforms/guide.md)**.
It covers one DELETE exercise across VS Code, the standalone Copilot CLI, the
GitHub Copilot app, cloud agent/web, and GitHub Mobile in a fixed 60-minute session.
The [static tabbed guide](docs/workshops/copilot-across-platforms/index.html) can be
opened locally; all content is also available without JavaScript and in print.
`https://frye.github.io/net-users-demo/` is the Pages deployment target, not a
claim that publication has completed.

The guide uses a GitHub-style dark theme. Checkpoints are **optional recovery
points**, not handoff requirements: if things work, skip them and continue.
Participants keep exercise work in their own local clone. The shared sample is
read-only: no participant pushes, PRs, issues, or cloud tasks against it. A private,
user-owned upstream is an optional, policy-approved choice—not a lab requirement.

The starter deliberately keeps DELETE unimplemented. Baseline tests cover existing
routes; a passing baseline is **not** a completed exercise. See
[reference verification and recovery](workshop/reference/README.md) for isolated
facilitator checks. No optional MCP server, organizational repository copy, or
account switch is required. Confirm actual account permissions before any cloud
task in an optional private upstream; local, pairing, and observation paths work
without publishing anything. Maintainer publication of this guide is separate
from participant exercise work.

## Project Structure

```
net-users-demo/
├── net-users-api/              # ASP.NET Core Web API project
│   ├── Controllers/
│   │   ├── HomeController.cs   # Handles root endpoint with HTML view
│   │   └── UsersController.cs  # REST API endpoints for user management
│   ├── Models/
│   │   └── UserProfile.cs      # User profile data model
│   ├── Views/
│   │   └── Home/
│   │       └── Index.cshtml    # HTML view displaying users in a table
│   ├── Program.cs              # Application entry point and configuration
│   ├── README.md               # Project-specific documentation
│   ├── Copilot_Practice_Instructions.md
│   └── Copilot_TDD_Practice_Instructions.md
├── net-users-api.tests/        # Serialized baseline tests and HTTP test host
├── docs/workshops/             # Generated tabbed guide and Markdown fallback
└── net-users-demo.sln          # Solution file
```

## Features

- **RESTful API** for user profile management
- **HTML table view** at root endpoint for user-friendly display
- **In-memory data storage** (simple list)
- **Structured for learning** - includes TODO functionality for practice
- **GitHub Copilot practice exercises** included

## API Endpoints

- `GET /` - Display users in an HTML table
- `GET /api/v1/users` - Get all users (JSON)
- `GET /api/v1/users/{id}` - Get a specific user by ID
- `POST /api/v1/users` - Create a new user
- `PUT /api/v1/users/{id}` - Update an existing user
- `DELETE /api/v1/users/{id}` - Delete a user (TODO: Not yet implemented)

## Data Model

Each user profile contains:
- `id` - String identifier
- `fullName` - User's full name
- `emoji` - An emoji representing the user

Sample users:
- John Doe 😀
- Jane Smith 🚀
- Robert Johnson 🎸

## Getting Started

### Prerequisites

- The exact .NET SDK from `global.json` (9.0.318; later major SDKs are not substitutes)
- Visual Studio Code (recommended) with C# Dev Kit extension
- GitHub Copilot (for practice exercises)
- Node.js 22 or newer for workshop validation helpers/site preparation (not for reading the guide)

SDK 9.0.318 includes runtime 9.0.20, selected from Microsoft's
[official release metadata](https://builds.dotnet.microsoft.com/dotnet/release-metadata/9.0/releases.json)
on September 15, 2026. .NET 9 is in maintenance through November 10, 2026;
recheck [support and servicing](https://dotnet.microsoft.com/en-us/platform/support/policy/dotnet-core)
before a later event. Do not silently roll forward the workshop SDK.

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd net-users-demo
   ```

2. Restore dependencies:
   ```bash
   dotnet restore
   ```

### Running the Application

#### Using the solution file:
```bash
dotnet run --project net-users-api
```

#### Or navigate to the project directory:
```bash
cd net-users-api
dotnet run
```

The application will start on `http://localhost:8080`

### Testing the API

#### View HTML table:
```bash
open http://localhost:8080
```

#### Get all users (JSON):
```bash
curl http://localhost:8080/api/v1/users
```

#### Get a specific user:
```bash
curl http://localhost:8080/api/v1/users/1
```

#### Create a new user:
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"id":"4", "fullName":"Alice Cooper", "emoji":"🎭"}'
```

#### Update a user:
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":"1", "fullName":"John Smith", "emoji":"😎"}'
```

#### Delete a user (not yet implemented):
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1
```

## Practice Exercises

This project includes comprehensive practice materials for learning GitHub Copilot:

### Getting Started (Beginner)

1. **[Copilot_Practice_Instructions.md](Copilot_Practice_Instructions.md)** - Learn GitHub Copilot basics:
   - Inline code completion
   - Ask/Edit mode
   - Copilot CLI
   - Agent mode

2. **[Copilot_TDD_Practice_Instructions.md](Copilot_TDD_Practice_Instructions.md)** - Practice Test-Driven Development:
   - Using Testing custom chat mode
   - Using TDD custom chat mode
   - Red-Green-Refactor cycle
   - Test coverage analysis

### Advanced Practice (Intermediate to Advanced)

3. **[Advanced Practice Instructions](advanced-practice/README.md)** - Comprehensive advanced exercises:
   - 📝 **10 Modules** covering real-world scenarios
   - 🌱 **GitHub Spec-Kit** introduction for structured development
   - 🎓 **Capstone Projects** for advanced challenges
   - 💡 **Best Practices** and professional patterns

**Topics Include:**
- CRUD operations & API design enhancements
- Input validation & error handling
- Comprehensive testing strategies (unit, integration, property-based)
- Repository pattern & database migrations
- Configuration management & secrets
- Authentication & authorization (API keys, JWT)
- Observability (logging, metrics, tracing)
- Documentation & developer experience
- CI/CD pipelines & automation
- Architecture & scalability patterns

👉 **[Start with the Advanced Practice Guide →](advanced-practice/README.md)**

## Comparison with Go Demo

This .NET implementation mirrors the [frye/go-users-demo](https://github.com/frye/go-users-demo) project:

| Feature | Go Demo | .NET Demo |
|---------|---------|-----------|
| Framework | Gin | ASP.NET Core |
| Language | Go | C# |
| View Engine | Go templates | Razor |
| Port | 8080 | 8080 |
| Data Storage | In-memory slice | In-memory List |
| DeleteUser | TODO | TODO |
| Sample Users | 3 users | 3 users (same) |

## Development

### Building the project:
```bash
dotnet build
```

### Running the prepared baseline:
```bash
dotnet test net-users-api.tests/net-users-api.tests.csproj
node scripts/workshop/validate.mjs baseline
```

After implementing the focused DELETE tests, use `node scripts/workshop/validate.mjs local`.
After the local (or optional private-cloud) HTTP follow-up, use `node scripts/workshop/validate.mjs complete`.
The latter two deliberately fail on the starter if required tests are absent.
Use the exact test names in `scripts/workshop/requirements.json`; do not remove or
skip checks to make the command green. Test runs use fresh synthetic objects and
global serialization because storage is static. This does not add production
concurrency guarantees.

### Rebuilding the public guide:
```bash
node scripts/build-workshop-guide.mjs
node scripts/build-workshop-guide.mjs --check
node scripts/test-workshop-guide.mjs
```

Edit the guide's structured source, not its generated HTML/Markdown. The Pages
workflow validates pull requests with read-only contents access; only its
default-branch deployment job receives Pages/OIDC permissions. The repository
owner must approve publication and any required environment/workflow gates.
The cloud setup workflow must be on the default branch before relying on it.
Local checks do not prove that a cloud session has run successfully.

### Cleaning build artifacts:
```bash
dotnet clean
```

## License

This project is for educational purposes.

## Contributing

This is a demonstration project for learning GitHub Copilot and TDD practices. Feel free to use it as a template for your own learning.

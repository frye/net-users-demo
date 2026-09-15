# User Profile REST API

A simple RESTful API built with ASP.NET Core that provides user profile information including ID, full name, and emoji.

## Features

- Get all user profiles
- Get a specific user profile by ID
- Create new user profiles
- Update existing user profiles
- Delete user profiles (intentionally unfinished workshop exercise)

## API Endpoints

- GET `/api/v1/users` - Get all users
- GET `/api/v1/users/:id` - Get a specific user by ID
- POST `/api/v1/users` - Create a new user
- PUT `/api/v1/users/:id` - Update an existing user
- DELETE `/api/v1/users/:id` - TODO: implement in the workshop

## Data Model

Each user profile contains:
- `id`: String identifier
- `fullName`: User's full name
- `emoji`: An emoji representing the user

## Getting Started

### Prerequisites

- The exact .NET 9 SDK in the solution's `global.json`

### Installation

1. Clone the repository
2. Navigate to the project directory
3. Run `dotnet restore` to ensure dependencies are correctly installed

### Running the API

```bash
dotnet run
```

The API will start on `http://localhost:8080`

## Example Usage

### Get all users
```bash
curl http://localhost:8080/api/v1/users
```

### Get user by ID
```bash
curl http://localhost:8080/api/v1/users/1
```

### Create a new user
```bash
curl -X POST http://localhost:8080/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{"id":"4", "fullName":"Alice Cooper", "emoji":"🎭"}'
```

### Update a user
```bash
curl -X PUT http://localhost:8080/api/v1/users/1 \
  -H "Content-Type: application/json" \
  -d '{"id":"1", "fullName":"John Smith", "emoji":"😎"}'
```

### Delete a user (only after implementing the exercise)
```bash
curl -X DELETE http://localhost:8080/api/v1/users/1
```

## Project Structure

```
net-users-api/
├── Controllers/
│   ├── HomeController.cs       # Handles root endpoint with HTML view
│   └── UsersController.cs      # REST API endpoints for user management
├── Models/
│   └── UserProfile.cs          # User profile data model
├── Views/
│   └── Home/
│       └── Index.cshtml        # HTML view displaying users in a table
├── Program.cs                  # Application entry point and configuration
└── net-users-api.csproj       # Project file
```

## Development

This project is designed for practicing GitHub Copilot features and Test-Driven Development. See the accompanying practice instruction files for guided exercises.

For the current cross-client exercise, use the
[Copilot Across Platforms guide](../docs/workshops/copilot-across-platforms/guide.md).
Run `dotnet test net-users-api.tests/net-users-api.tests.csproj` from the solution
root for existing-route coverage. Use `node scripts/workshop/validate.mjs local`
or `complete` for feature evidence; baseline-only success is not DELETE completion.
The shared HTTP request file uses the actual HTTP listener at port 8080. No HTTPS
listener is configured by this demo.

## License

This project is for educational purposes.

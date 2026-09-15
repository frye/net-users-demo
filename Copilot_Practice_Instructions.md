# Copilot_Practice_Instructions.md

# GitHub Copilot Practice Instructions for C# User Profile REST API

Follow these tasks to practice using GitHub Copilot effectively within your ASP.NET Core REST API project.

For the current standalone CLI and cross-client workflow, start with the
[Copilot Across Platforms workshop](docs/workshops/copilot-across-platforms/guide.md).
The exercises below are preserved as historical practice material; their older
CLI commands are not prerequisites for the workshop.

---

## ✅ Task 1: Add Three More Sample Users (Inline Code Completion)

**File:** [`net-users-api/Controllers/UsersController.cs`](net-users-api/Controllers/UsersController.cs)

- Locate the existing `_users` list:

```csharp
private static List<UserProfile> _users = new()
{
    new UserProfile { Id = "1", FullName = "John Doe", Emoji = "😀" },
    new UserProfile { Id = "2", FullName = "Jane Smith", Emoji = "🚀" },
    new UserProfile { Id = "3", FullName = "Robert Johnson", Emoji = "🎸" }
    // Add three more users here using Copilot inline completion
};
```

- Use GitHub Copilot inline completion to add three additional unique users:
  - Trigger Copilot suggestions by starting a new line after the last user.
  - Accept or cycle through suggestions to complete the task.

---

## ✅ Task 2: Implement Delete Functionality (Ask or Edit Mode - Base Model)

**File:** [`net-users-api/Controllers/UsersController.cs`](net-users-api/Controllers/UsersController.cs)

- Locate the incomplete `DeleteUser` method:

```csharp
[HttpDelete("{id}")]
public IActionResult DeleteUser(string id)
{
    // Implement delete functionality here using Copilot Ask or Edit mode
    throw new NotImplementedException("DeleteUser functionality not yet implemented");
}
```

- Use Copilot's Edit mode (base model):
  - Select the `DeleteUser` method
  - Open Copilot Chat and provide the following prompt:

"Implement delete functionality to remove a user by ID from the _users list and return appropriate HTTP responses (204 No Content on success, 404 Not Found if user doesn't exist)."

- Review and accept the generated code.

---

## ✅ Task 3: Use Copilot CLI to Delete a User (Integrated Terminal)

- Open the integrated terminal in Visual Studio Code.

**Option A: Using GitHub Copilot CLI (if installed)**
- Use Copilot CLI to generate a curl command to delete a user via the API:

```bash
gh copilot suggest "Generate a curl command to delete user with ID '2' from the API at http://localhost:8080/api/v1/users/2"
```

- Execute the suggested curl command to verify the delete functionality.

**Option B: Using Copilot Chat Ask Mode (if gh CLI not available)**
- Open Copilot Chat (Ctrl+Shift+I or Cmd+Shift+I)
- Use the following prompt:

"Generate a curl command to delete user with ID '2' from the API at http://localhost:8080/api/v1/users/2"

- Copy the suggested command and execute it in the integrated terminal to verify the delete functionality.

---

## ✅ Task 4: Implement Unit Tests (Agent Mode - Premium Model)

- Activate Copilot Agent mode (use premium model like Claude Sonnet 4) from the Copilot sidebar.
- Provide the following prompt to Copilot Agent:

"Generate and run unit tests for this application using xUnit and ASP.NET Core testing utilities."

- Review, accept, and run the generated tests to ensure correctness.

---

## 🎉 Completion

You've successfully practiced using GitHub Copilot's inline completion, Ask/Edit mode, CLI suggestions, and Agent mode to enhance your C# REST API development workflow!

# Module 2: Validation & Error Handling

[⬅️ Back to Index](README.md) | [← Previous: Module 1](module-01-crud-enhancements.md) | [Next: Module 3 →](module-03-testing-expansion.md)

---

### Exercise 2.1: Centralized Error Model

**Goal**: Create consistent error response structure across all endpoints

**Sample Prompt**:
```
Create a centralized error response model in Models folder called ApiError.
Include properties: ErrorCode (string), Message (string), Details (optional object),
Timestamp (DateTime), Path (request path).
Create an exception filter or middleware to catch exceptions and return 
consistent ApiError responses. Map common exceptions to appropriate status codes.
```

**Acceptance Criteria**:
- [ ] `ApiError` model created with required properties
- [ ] Global exception handler implemented
- [ ] All endpoints return consistent error format
- [ ] HTTP status codes properly mapped
- [ ] Include request path and timestamp in errors

**Stretch Goals**:
- Implement RFC 7807 Problem Details (application/problem+json)
- Add correlation IDs for error tracking
- Create custom exception classes for domain errors
- Add stack trace in development environment only
- Implement error code enumeration/catalog

**Sample Prompt for RFC 7807**:
```
Refactor the error handling to use RFC 7807 Problem Details format.
Use Microsoft.AspNetCore.Mvc.ProblemDetails as the base.
Include type (URI), title, status, detail, instance, and custom extension members.
Configure the API to return application/problem+json content type for errors.
```

---

### Exercise 2.2: Comprehensive Input Validation

**Goal**: Add robust validation layer for all input data

**Sample Prompt**:
```
Add comprehensive validation to UserProfile model and API endpoints.
Use data annotations: Required, StringLength, EmailAddress, RegularExpression.
Email must be valid format. FullName must be 2-100 characters.
Emoji must be a single emoji character. Id must follow specific format (alphanumeric, 1-50 chars).
Return 400 Bad Request with specific validation errors listing each field problem.
```

**Acceptance Criteria**:
- [ ] Data annotations added to `UserProfile` properties
- [ ] Model validation executed automatically on requests
- [ ] Returns 400 with field-specific validation errors
- [ ] Error messages are clear and actionable
- [ ] Custom validators implemented where needed

**Stretch Goals**:
- Implement FluentValidation library for complex rules
- Add conditional validation (e.g., field required if another is set)
- Internationalize validation error messages
- Create reusable validation attributes
- Add business rule validation (e.g., no duplicate names)

**Sample Prompt for FluentValidation**:
```
Install and configure FluentValidation for ASP.NET Core.
Create UserProfileValidator class with validation rules.
Email is required and must be valid. FullName required, 2-100 chars, no numbers.
Emoji must be 1-10 characters. Id required, alphanumeric only.
Register validator with DI and integrate with model binding validation.
```

---

### Exercise 2.3: Rate Limiting Implementation

**Goal**: Protect API from abuse with rate limiting

**Sample Prompt**:
```
Implement a simple rate limiting middleware for the API.
Limit requests to 100 per minute per IP address.
Use in-memory token bucket or sliding window algorithm.
Return 429 Too Many Requests when limit exceeded, include Retry-After header.
Add configuration for limits in appsettings.json.
Exclude /health endpoint from rate limiting.
```

**Acceptance Criteria**:
- [ ] Rate limiting middleware created
- [ ] Tracks requests by IP address
- [ ] Returns 429 status with Retry-After header
- [ ] Configuration stored in appsettings
- [ ] Health check endpoint excluded
- [ ] Thread-safe implementation

**Stretch Goals**:
- Implement distributed rate limiting with Redis
- Add different limits per endpoint
- API key-based rate limiting (higher limits for authenticated users)
- Rate limit by user ID instead of IP
- Implement leaky bucket algorithm
- Add rate limit status headers (X-RateLimit-Limit, X-RateLimit-Remaining)

---

## Git Workflow & Code Review

### Committing Your Changes

Once you've completed one or more exercises in this module, follow these steps to commit your work and get it reviewed:

#### 1. Create a Feature Branch

Before committing, create a feature branch from main:

```bash
# Ensure you're on main and up to date
git checkout main
git pull origin main

# Create and switch to a new feature branch
git checkout -b feature/validation-error-handling

# Or for specific exercises:
git checkout -b feature/centralized-error-model
git checkout -b feature/input-validation
git checkout -b feature/rate-limiting
```

**Branch Naming Conventions**:
- `feature/` prefix for new features
- Use descriptive kebab-case names
- Examples: `feature/add-fluent-validation`, `feature/rfc7807-problem-details`

#### 2. Stage and Commit Your Changes

```bash
# Check what files have changed
git status

# Stage specific files
git add net-users-api/Models/ApiError.cs

# Or stage all changes - preferred for this section
git add .

# Commit with a descriptive message
git commit -m "feat: implement centralized error handling with ApiError model"
```

**Commit Message Guidelines**:
- Use conventional commit format: `type: description`
- Types: `feat:`, `fix:`, `refactor:`, `test:`, `docs:`, `chore:`
- Examples:
  - `feat: add FluentValidation for UserProfile`
  - `feat: implement rate limiting middleware`
  - `fix: correct validation error response format`
  - `refactor: extract error handling to middleware`

#### 3. Push to Remote Repository

```bash
# Push your feature branch to GitHub
git push -u origin feature/validation-error-handling

# The -u flag sets upstream tracking for the branch
# Subsequent pushes can just use: git push
```

#### 4. Create a Pull Request

After pushing, GitHub will provide a URL to create a PR, or you can:

1. **Via GitHub CLI** (if installed):
```bash
gh pr create --title "feat: Add validation and error handling" \
  --body "Implements centralized error handling, input validation, and rate limiting from Module 2"
```

2. **Via GitHub Web**:
   - Navigate to your repository on GitHub
   - Click "Compare & pull request" button
   - Fill in the PR template:
     - **Title**: Clear, descriptive summary (e.g., "Add comprehensive validation and error handling")
     - **Description**: List what was implemented, reference exercises
     - Link to any related issues

**Sample PR Description Template**:
```markdown
## Summary
Implements validation and error handling improvements from Module 2.

## Changes
- ✅ Exercise 2.1: Centralized error model with ApiError class
- ✅ Exercise 2.2: Input validation with data annotations
- ✅ Exercise 2.3: Rate limiting middleware

## Testing
- Manual testing with various invalid inputs
- Rate limiting tested with multiple rapid requests
- Error responses verified to match RFC 7807 format

## Checklist
- [ ] Code follows project conventions
- [ ] All acceptance criteria met
- [ ] No breaking changes to existing API
- [ ] Tested locally
```

#### 5. Request Copilot Code Review

GitHub Copilot can review your pull request and provide feedback:

**Option A: Using GitHub Web Interface**
1. Open your pull request on GitHub
2. In the PR conversation, type: `@copilot review`
3. Copilot will analyze your changes and provide feedback

**Option B: Using GitHub CLI**
```bash
# View PR and request review
gh pr view --web
```

**Option C: Using Copilot Chat in VS Code**
1. Open the Source Control panel
2. Open Copilot Chat
3. Ask: "Review my changes for this PR" or "What potential issues do you see in my recent commits?"

**Sample Prompts for Copilot Review**:
```
@copilot review this PR focusing on:
- Error handling best practices
- Input validation completeness
- Potential security vulnerabilities
- Code consistency with existing patterns
```

```
@copilot analyze the validation logic and suggest improvements
for edge cases or missing validations
```

```
@copilot review the rate limiting implementation for
thread safety issues and performance concerns
```

#### 6. Address Review Feedback

If Copilot (or human reviewers) suggest changes:

```bash
# Make the suggested changes in your code
# Stage and commit the updates
git add .
git commit -m "fix: address review feedback on validation rules"

# Push the updates
git push
```

The PR will automatically update with your new commits.

#### 7. Merge Your PR

Once approved and all checks pass:

```bash
# Via GitHub CLI
gh pr merge --squash

# Or via GitHub web interface
# Click "Squash and merge" or "Merge pull request"
```

**Merge Strategies**:
- **Squash and merge**: Recommended for feature branches (cleaner history)
- **Merge commit**: Preserves all individual commits
- **Rebase and merge**: Linear history without merge commit

#### 8. Clean Up

After merging:

```bash
# Switch back to main
git checkout main

# Pull the latest changes
git pull origin main

# Delete the local feature branch
git branch -d feature/validation-error-handling

# The remote branch is usually auto-deleted by GitHub
# If not, delete it manually:
git push origin --delete feature/validation-error-handling
```

---

### Tips for Effective Code Reviews

**Before Requesting Review**:
- ✅ Self-review your changes first
- ✅ Run the application and test manually
- ✅ Ensure code compiles without warnings
- ✅ Check that all acceptance criteria are met
- ✅ Update documentation if needed

**Using Copilot Effectively**:
- Ask specific questions about your implementation
- Request security and performance analysis
- Ask for alternative approaches
- Verify best practices compliance
- Get suggestions for test cases

**Example Copilot Interactions**:
```
"Does this error handling middleware properly catch and format all exception types?"

"Are there any edge cases in my validation logic that I should handle?"

"Is my rate limiting implementation thread-safe for concurrent requests?"

"How can I improve the error messages to be more helpful for API consumers?"
```

---

---

[⬅️ Back to Index](README.md) | [← Previous: Module 1](module-01-crud-enhancements.md) | [Next: Module 3 →](module-03-testing-expansion.md)

# Module 2 Implementation: Validation & Error Handling

## Summary

Successfully implemented all three exercises from Module 2:

### ✅ Exercise 2.1: Centralized Error Model
- Created `ApiError` model in `Models/ApiError.cs` with:
  - `ErrorCode`: Machine-readable error code
  - `Message`: Human-readable error message
  - `Details`: Optional additional details (validation errors, etc.)
  - `Timestamp`: When the error occurred (UTC)
  - `Path`: Request path that generated the error

- Implemented `GlobalExceptionHandlerMiddleware` that:
  - Catches unhandled exceptions globally
  - Maps common exception types to appropriate HTTP status codes
  - Returns consistent ApiError JSON responses
  - Includes stack traces only in development environment
  - Logs all exceptions with ILogger

### ✅ Exercise 2.2: Comprehensive Input Validation
- Enhanced `UserProfile` model with data annotations:
  - `Id`: Required, alphanumeric only, 1-50 characters
  - `FullName`: Required, 2-100 characters, letters/spaces/hyphens/apostrophes/periods only
  - `Email`: Required, valid email format (NEW field added)
  - `Emoji`: Required, 1-10 characters

- Updated `UsersController` to:
  - Return ApiError format for all error responses
  - Check ModelState validation and return detailed validation errors
  - Check for duplicate IDs during user creation
  - Include field-specific error messages in Details object

### ✅ Exercise 2.3: Rate Limiting Implementation
- Created `RateLimitingMiddleware` with:
  - Sliding window algorithm tracking requests per IP address
  - Configurable limit: 100 requests per minute (from appsettings.json)
  - Returns 429 Too Many Requests when limit exceeded
  - Includes `Retry-After` header with seconds until next allowed request
  - Thread-safe ConcurrentDictionary for request tracking
  - Excludes `/health` endpoint from rate limiting
  - Handles X-Forwarded-For header for proxy/load balancer scenarios

- Added configuration in `appsettings.json`:
  ```json
  "RateLimiting": {
    "RequestLimit": 100,
    "TimeWindowMinutes": 1,
    "ExcludedPaths": ["/health"]
  }
  ```

## Files Created

1. `net-users-api/Models/ApiError.cs` - Centralized error response model
2. `net-users-api/Middleware/GlobalExceptionHandlerMiddleware.cs` - Global exception handler
3. `net-users-api/Middleware/RateLimitingMiddleware.cs` - Rate limiting middleware

## Files Modified

1. `net-users-api/Models/UserProfile.cs` - Added Email property and validation attributes
2. `net-users-api/Controllers/UsersController.cs` - Updated to use ApiError responses and validation
3. `net-users-api/Program.cs` - Registered both middleware components
4. `net-users-api/appsettings.json` - Added rate limiting configuration

## Testing Results

### ✅ GET /api/v1/users - Success
```json
[
  {
    "id": "1",
    "fullName": "John Doe",
    "email": "john.doe@example.com",
    "emoji": "😀"
  },
  ...
]
```

### ✅ POST /api/v1/users - Validation Errors
Request with invalid data (numbers in name, invalid email):
```json
{
  "type": "https://tools.ietf.org/html/rfc9110#section-15.5.1",
  "title": "One or more validation errors occurred.",
  "status": 400,
  "errors": {
    "Email": ["Email must be a valid email address"],
    "FullName": ["FullName must contain only letters, spaces, hyphens, apostrophes, and periods"]
  }
}
```

### ✅ POST /api/v1/users - Duplicate ID
```json
{
  "errorCode": "DUPLICATE_ID",
  "message": "User with ID '1' already exists",
  "details": null,
  "timestamp": "2025-09-30T06:28:40.059715Z",
  "path": "/api/v1/users"
}
```

### ✅ GET /api/v1/users/999 - Not Found
```json
{
  "errorCode": "USER_NOT_FOUND",
  "message": "User with ID '999' was not found",
  "details": null,
  "timestamp": "2025-09-30T06:28:34.576653Z",
  "path": "/api/v1/users/999"
}
```

### ✅ Rate Limiting - 429 Too Many Requests
After 100 requests in 1 minute:
```
HTTP/1.1 429 Too Many Requests
Content-Type: application/json
Retry-After: 16

{
  "errorCode": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Maximum 100 requests per 1 minute(s)",
  "details": {
    "limit": 100,
    "windowMinutes": 1,
    "retryAfterSeconds": 16
  },
  "timestamp": "2025-09-30T06:28:53.079249Z",
  "path": "/api/v1/users"
}
```

## Acceptance Criteria Met

### Exercise 2.1 ✅
- [x] `ApiError` model created with required properties
- [x] Global exception handler implemented
- [x] All endpoints return consistent error format
- [x] HTTP status codes properly mapped
- [x] Request path and timestamp included in errors

### Exercise 2.2 ✅
- [x] Data annotations added to `UserProfile` properties
- [x] Model validation executed automatically on requests
- [x] Returns 400 with field-specific validation errors
- [x] Error messages are clear and actionable
- [x] Custom validation for duplicate IDs implemented

### Exercise 2.3 ✅
- [x] Rate limiting middleware created
- [x] Tracks requests by IP address
- [x] Returns 429 status with Retry-After header
- [x] Configuration stored in appsettings.json
- [x] Health check endpoint excluded
- [x] Thread-safe implementation (using ConcurrentDictionary)

## Next Steps

Consider implementing stretch goals:
- RFC 7807 Problem Details format (application/problem+json)
- FluentValidation for complex validation rules
- Correlation IDs for distributed tracing
- Redis-based distributed rate limiting
- API key-based rate limiting with higher limits

## Build & Run

```bash
# Build the project
dotnet build

# Run the API
dotnet run --project net-users-api

# Server runs on http://localhost:8080
```

## Notes

- The built-in ASP.NET validation uses ProblemDetails format by default, which is already RFC-compliant
- Our custom ApiError format is used for custom business logic errors (not found, duplicate ID, rate limiting)
- Stack traces are only included in development environment for security
- Rate limiting uses in-memory storage (suitable for single instance; use Redis for distributed scenarios)

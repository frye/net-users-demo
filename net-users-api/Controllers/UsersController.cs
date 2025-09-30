using Microsoft.AspNetCore.Mvc;
using NetUsersApi.Models;

namespace NetUsersApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    // Sample user data
    private static List<UserProfile> _users = new()
    {
        new UserProfile { Id = "1", FullName = "John Doe", Email = "john.doe@example.com", Emoji = "😀" },
        new UserProfile { Id = "2", FullName = "Jane Smith", Email = "jane.smith@example.com", Emoji = "🚀" },
        new UserProfile { Id = "3", FullName = "Robert Johnson", Email = "robert.johnson@example.com", Emoji = "🎸" }
    };

    public UsersController(ILogger<UsersController> logger)
    {
        _logger = logger;
    }

    /// <summary>
    /// Get all users
    /// </summary>
    /// <returns>List of all user profiles</returns>
    [HttpGet]
    public ActionResult<IEnumerable<UserProfile>> GetUsers()
    {
        _logger.LogInformation("GET /api/v1/users endpoint called");
        return Ok(_users);
    }

    /// <summary>
    /// Get a specific user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>User profile or 404 if not found</returns>
    [HttpGet("{id}")]
    public ActionResult<UserProfile> GetUser(string id)
    {
        var user = _users.FirstOrDefault(u => u.Id == id);
        
        if (user == null)
        {
            var error = new ApiError
            {
                ErrorCode = "USER_NOT_FOUND",
                Message = $"User with ID '{id}' was not found",
                Path = HttpContext.Request.Path
            };
            return NotFound(error);
        }
        
        return Ok(user);
    }

    /// <summary>
    /// Create a new user
    /// </summary>
    /// <param name="newUser">User profile data</param>
    /// <returns>Created user profile</returns>
    [HttpPost]
    public ActionResult<UserProfile> CreateUser([FromBody] UserProfile newUser)
    {
        if (!ModelState.IsValid)
        {
            var validationErrors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            var error = new ApiError
            {
                ErrorCode = "VALIDATION_ERROR",
                Message = "One or more validation errors occurred",
                Path = HttpContext.Request.Path,
                Details = validationErrors
            };
            return BadRequest(error);
        }

        // Check for duplicate ID
        if (_users.Any(u => u.Id == newUser.Id))
        {
            var error = new ApiError
            {
                ErrorCode = "DUPLICATE_ID",
                Message = $"User with ID '{newUser.Id}' already exists",
                Path = HttpContext.Request.Path
            };
            return BadRequest(error);
        }

        // For simplicity, we're just appending to the list
        // In a real application, you would use a database
        _users.Add(newUser);
        
        return CreatedAtAction(nameof(GetUser), new { id = newUser.Id }, newUser);
    }

    /// <summary>
    /// Update an existing user
    /// </summary>
    /// <param name="id">User ID</param>
    /// <param name="updatedUser">Updated user profile data</param>
    /// <returns>Updated user profile or 404 if not found</returns>
    [HttpPut("{id}")]
    public ActionResult<UserProfile> UpdateUser(string id, [FromBody] UserProfile updatedUser)
    {
        if (!ModelState.IsValid)
        {
            var validationErrors = ModelState
                .Where(x => x.Value?.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value?.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            var error = new ApiError
            {
                ErrorCode = "VALIDATION_ERROR",
                Message = "One or more validation errors occurred",
                Path = HttpContext.Request.Path,
                Details = validationErrors
            };
            return BadRequest(error);
        }

        var index = _users.FindIndex(u => u.Id == id);
        
        if (index == -1)
        {
            var error = new ApiError
            {
                ErrorCode = "USER_NOT_FOUND",
                Message = $"User with ID '{id}' was not found",
                Path = HttpContext.Request.Path
            };
            return NotFound(error);
        }
        
        // Ensure ID doesn't change
        updatedUser.Id = id;
        _users[index] = updatedUser;
        
        return Ok(updatedUser);
    }

    /// <summary>
    /// Delete a user by ID TODO
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>No content or 404 if not found</returns>
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(string id)
    {
        // Implement delete functionality here using Copilot Ask or Edit mode
        throw new NotImplementedException("DeleteUser functionality not yet implemented");
    }

    /// <summary>
    /// Get all users for internal use (used by Home controller)
    /// </summary>
    /// <returns>List of all user profiles</returns>
    internal static List<UserProfile> GetAllUsers()
    {
        return _users;
    }
}

using Microsoft.AspNetCore.Mvc;
using NetUsersApi.Models;

namespace NetUsersApi.Controllers;

[ApiController]
[Route("api/v1/[controller]")]
public class UsersController : ControllerBase
{
    private readonly ILogger<UsersController> _logger;

    // Sample user data. Id, FullName, Emoji
    private static List<UserProfile> _users = new()
    {
        new UserProfile { Id = "1", FullName = "John Doe", Emoji = "😀" },
        new UserProfile { Id = "2", FullName = "Jane Smith", Emoji = "🚀" },
        new UserProfile { Id = "3", FullName = "Robert Johnson", Emoji = "🎸" }
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
            return NotFound(new { error = "User not found" });
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
        if (newUser == null)
        {
            return BadRequest(new { error = "Invalid user data" });
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
        if (updatedUser == null)
        {
            return BadRequest(new { error = "Invalid user data" });
        }

        var index = _users.FindIndex(u => u.Id == id);
        
        if (index == -1)
        {
            return NotFound(new { error = "User not found" });
        }
        
        // Ensure ID doesn't change
        updatedUser.Id = id;
        _users[index] = updatedUser;
        
        return Ok(updatedUser);
    }

    /// <summary>
    /// Delete a user by ID
    /// </summary>
    /// <param name="id">User ID</param>
    /// <returns>No content or 404 if not found</returns>
    [HttpDelete("{id}")]
    public IActionResult DeleteUser(string id)
    {
        _logger.LogInformation("DELETE /api/v1/users endpoint called");
        
        var user = _users.FirstOrDefault(u => u.Id == id);
        
        if (user == null)
        {
            return NotFound(new { error = "User not found" });
        }
        
        _users.Remove(user);
        
        return NoContent();
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

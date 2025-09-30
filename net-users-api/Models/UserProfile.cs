using System.ComponentModel.DataAnnotations;

namespace NetUsersApi.Models;

/// <summary>
/// Represents user profile data
/// </summary>
public class UserProfile
{
    /// <summary>
    /// User identifier - alphanumeric, 1-50 characters
    /// </summary>
    [Required(ErrorMessage = "Id is required")]
    [RegularExpression(@"^[a-zA-Z0-9]{1,50}$", ErrorMessage = "Id must be alphanumeric and 1-50 characters")]
    public required string Id { get; set; }
    
    /// <summary>
    /// User's full name - 2-100 characters, no numbers allowed
    /// </summary>
    [Required(ErrorMessage = "FullName is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "FullName must be between 2 and 100 characters")]
    [RegularExpression(@"^[a-zA-Z\s\-'\.]+$", ErrorMessage = "FullName must contain only letters, spaces, hyphens, apostrophes, and periods")]
    public required string FullName { get; set; }
    
    /// <summary>
    /// User's email address
    /// </summary>
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Email must be a valid email address")]
    public required string Email { get; set; }
    
    /// <summary>
    /// User's emoji - 1-10 characters
    /// </summary>
    [Required(ErrorMessage = "Emoji is required")]
    [StringLength(10, MinimumLength = 1, ErrorMessage = "Emoji must be between 1 and 10 characters")]
    public required string Emoji { get; set; }
}

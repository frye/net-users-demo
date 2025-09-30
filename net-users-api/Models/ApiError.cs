namespace NetUsersApi.Models;

/// <summary>
/// Represents a standardized error response for API errors
/// </summary>
public class ApiError
{
    /// <summary>
    /// A machine-readable error code
    /// </summary>
    public required string ErrorCode { get; set; }
    
    /// <summary>
    /// A human-readable error message
    /// </summary>
    public required string Message { get; set; }
    
    /// <summary>
    /// Optional additional details about the error (validation errors, stack trace, etc.)
    /// </summary>
    public object? Details { get; set; }
    
    /// <summary>
    /// Timestamp when the error occurred
    /// </summary>
    public DateTime Timestamp { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// The request path that generated the error
    /// </summary>
    public required string Path { get; set; }
}

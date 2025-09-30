using System.Net;
using System.Text.Json;
using NetUsersApi.Models;

namespace NetUsersApi.Middleware;

/// <summary>
/// Middleware to handle exceptions globally and return consistent error responses
/// </summary>
public class GlobalExceptionHandlerMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<GlobalExceptionHandlerMiddleware> _logger;
    private readonly IHostEnvironment _environment;

    public GlobalExceptionHandlerMiddleware(
        RequestDelegate next,
        ILogger<GlobalExceptionHandlerMiddleware> logger,
        IHostEnvironment environment)
    {
        _next = next;
        _logger = logger;
        _environment = environment;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "An unhandled exception occurred: {Message}", ex.Message);
            await HandleExceptionAsync(context, ex);
        }
    }

    private Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        var (statusCode, errorCode) = MapExceptionToStatusCode(exception);

        var apiError = new ApiError
        {
            ErrorCode = errorCode,
            Message = exception.Message,
            Path = context.Request.Path,
            Timestamp = DateTime.UtcNow,
            Details = _environment.IsDevelopment() ? exception.StackTrace : null
        };

        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)statusCode;

        var options = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
            WriteIndented = true
        };

        var json = JsonSerializer.Serialize(apiError, options);
        return context.Response.WriteAsync(json);
    }

    private (HttpStatusCode statusCode, string errorCode) MapExceptionToStatusCode(Exception exception)
    {
        return exception switch
        {
            ArgumentNullException => (HttpStatusCode.BadRequest, "INVALID_INPUT"),
            ArgumentException => (HttpStatusCode.BadRequest, "INVALID_ARGUMENT"),
            InvalidOperationException => (HttpStatusCode.BadRequest, "INVALID_OPERATION"),
            KeyNotFoundException => (HttpStatusCode.NotFound, "NOT_FOUND"),
            UnauthorizedAccessException => (HttpStatusCode.Unauthorized, "UNAUTHORIZED"),
            NotImplementedException => (HttpStatusCode.NotImplemented, "NOT_IMPLEMENTED"),
            TimeoutException => (HttpStatusCode.RequestTimeout, "TIMEOUT"),
            _ => (HttpStatusCode.InternalServerError, "INTERNAL_ERROR")
        };
    }
}

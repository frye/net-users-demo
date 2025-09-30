using System.Collections.Concurrent;
using System.Net;
using System.Text.Json;
using NetUsersApi.Models;

namespace NetUsersApi.Middleware;

/// <summary>
/// Middleware to implement rate limiting based on IP address
/// </summary>
public class RateLimitingMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<RateLimitingMiddleware> _logger;
    private readonly int _requestLimit;
    private readonly TimeSpan _timeWindow;
    private readonly List<string> _excludedPaths;
    
    // Thread-safe dictionary to store request counts per IP
    private static readonly ConcurrentDictionary<string, RequestCounter> _requestCounts = new();
    
    public RateLimitingMiddleware(
        RequestDelegate next,
        ILogger<RateLimitingMiddleware> logger,
        IConfiguration configuration)
    {
        _next = next;
        _logger = logger;
        
        // Load configuration with defaults
        _requestLimit = configuration.GetValue<int>("RateLimiting:RequestLimit", 100);
        var windowMinutes = configuration.GetValue<int>("RateLimiting:TimeWindowMinutes", 1);
        _timeWindow = TimeSpan.FromMinutes(windowMinutes);
        _excludedPaths = configuration.GetSection("RateLimiting:ExcludedPaths")
            .Get<List<string>>() ?? new List<string> { "/health" };
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Check if path is excluded from rate limiting
        if (_excludedPaths.Any(path => context.Request.Path.StartsWithSegments(path)))
        {
            await _next(context);
            return;
        }

        var ipAddress = GetClientIpAddress(context);
        var counter = _requestCounts.GetOrAdd(ipAddress, _ => new RequestCounter());

        bool rateLimitExceeded = false;
        int retryAfter = 0;
        ApiError? error = null;

        lock (counter)
        {
            // Clean up old requests outside the time window
            counter.Requests.RemoveAll(time => DateTime.UtcNow - time > _timeWindow);

            // Check if limit exceeded
            if (counter.Requests.Count >= _requestLimit)
            {
                _logger.LogWarning("Rate limit exceeded for IP: {IpAddress}", ipAddress);
                
                var oldestRequest = counter.Requests.Min();
                retryAfter = (int)Math.Ceiling((_timeWindow - (DateTime.UtcNow - oldestRequest)).TotalSeconds);
                
                error = new ApiError
                {
                    ErrorCode = "RATE_LIMIT_EXCEEDED",
                    Message = $"Rate limit exceeded. Maximum {_requestLimit} requests per {_timeWindow.TotalMinutes} minute(s)",
                    Path = context.Request.Path,
                    Details = new
                    {
                        Limit = _requestLimit,
                        WindowMinutes = _timeWindow.TotalMinutes,
                        RetryAfterSeconds = retryAfter
                    }
                };

                rateLimitExceeded = true;
            }
            else
            {
                // Add current request
                counter.Requests.Add(DateTime.UtcNow);
            }
        }

        if (rateLimitExceeded && error != null)
        {
            context.Response.StatusCode = (int)HttpStatusCode.TooManyRequests;
            context.Response.ContentType = "application/json";
            context.Response.Headers["Retry-After"] = retryAfter.ToString();
            
            var options = new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
                WriteIndented = true
            };
            
            await context.Response.WriteAsync(JsonSerializer.Serialize(error, options));
            return;
        }

        await _next(context);
    }

    private string GetClientIpAddress(HttpContext context)
    {
        // Try to get IP from X-Forwarded-For header (for proxies/load balancers)
        var forwardedFor = context.Request.Headers["X-Forwarded-For"].FirstOrDefault();
        if (!string.IsNullOrEmpty(forwardedFor))
        {
            var ips = forwardedFor.Split(',');
            if (ips.Length > 0)
            {
                return ips[0].Trim();
            }
        }

        // Fallback to remote IP address
        return context.Connection.RemoteIpAddress?.ToString() ?? "unknown";
    }

    private class RequestCounter
    {
        public List<DateTime> Requests { get; } = new();
    }
}

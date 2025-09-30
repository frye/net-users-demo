using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using NetUsersApi.Controllers;
using System.Reflection;

namespace NetUsersApi.Tests.IntegrationTests;

/// <summary>
/// Custom WebApplicationFactory for integration testing
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Configure test-specific services here if needed
            // For example, you could replace the data store with a test version
        });

        builder.UseEnvironment("Testing");
    }

    /// <summary>
    /// Resets the static user list to its initial state
    /// </summary>
    public void ResetUsersData()
    {
        var usersField = typeof(UsersController).GetField("_users", BindingFlags.NonPublic | BindingFlags.Static)
            ?? throw new InvalidOperationException("Could not find _users field");

        var freshUsers = new List<NetUsersApi.Models.UserProfile>
        {
            new NetUsersApi.Models.UserProfile { Id = "1", FullName = "John Doe", Emoji = "😀" },
            new NetUsersApi.Models.UserProfile { Id = "2", FullName = "Jane Smith", Emoji = "🚀" },
            new NetUsersApi.Models.UserProfile { Id = "3", FullName = "Robert Johnson", Emoji = "🎸" }
        };
        usersField.SetValue(null, freshUsers);
    }
}

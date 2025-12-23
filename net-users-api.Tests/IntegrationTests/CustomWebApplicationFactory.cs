using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Hosting;

namespace NetUsersApi.Tests.IntegrationTests;

/// <summary>
/// Custom WebApplicationFactory for integration testing
/// Configures the test server environment
/// </summary>
public class CustomWebApplicationFactory : WebApplicationFactory<Program>
{
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureServices(services =>
        {
            // Add any test-specific service configurations here if needed
        });

        builder.UseEnvironment("Testing");
    }
}

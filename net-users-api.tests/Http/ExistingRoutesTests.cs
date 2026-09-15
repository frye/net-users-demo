using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using NetUsersApi.Models;
using NetUsersApi.Tests.Infrastructure;
using Xunit;

namespace NetUsersApi.Tests.Http;

[Trait("Workshop", "Baseline")]
public class ExistingRoutesTests : UserStoreTest
{
    [Fact]
    public async Task ListReturnsAllUsersAsJson()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/v1/users");

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("application/json", response.Content.Headers.ContentType?.MediaType);
        var users = await response.Content.ReadFromJsonAsync<UserProfile[]>();
        Assert.NotNull(users);
        Assert.Equal(["1", "2", "3"], users.Select(user => user.Id));
    }

    [Fact]
    public async Task GetReturnsUser()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        var user = await client.GetFromJsonAsync<UserProfile>("/api/v1/users/1");

        Assert.NotNull(user);
        Assert.Equal("1", user.Id);
        Assert.Equal("Test User One", user.FullName);
    }

    [Fact]
    public async Task GetMissingReturnsExistingJsonError()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/api/v1/users/missing");

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("User not found", body.GetProperty("error").GetString());
    }

    [Fact]
    public async Task PostCreatesUserAtResolvableLocation()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        var profile = new UserProfile { Id = "4", FullName = "HTTP User", Emoji = "http" };
        using var response = await client.PostAsJsonAsync("/api/v1/users", profile);

        Assert.Equal(HttpStatusCode.Created, response.StatusCode);
        Assert.NotNull(response.Headers.Location);
        Assert.Equal("/api/v1/Users/4", response.Headers.Location.AbsolutePath);
        var created = await client.GetFromJsonAsync<UserProfile>(response.Headers.Location);
        Assert.NotNull(created);
        Assert.Equal(profile.FullName, created.FullName);
        Assert.Equal(4, Users.Count);
    }

    [Fact]
    public async Task PutUpdatesUserAndKeepsRouteId()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        var update = new UserProfile { Id = "ignored", FullName = "Updated HTTP User", Emoji = "updated" };
        using var response = await client.PutAsJsonAsync("/api/v1/users/1", update);

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<UserProfile>();
        Assert.NotNull(body);
        Assert.Equal("1", body.Id);
        Assert.Equal(update.FullName, body.FullName);
        Assert.Equal("Test User Two", Users[1].FullName);
    }

    [Fact]
    public async Task PutMissingReturnsExistingJsonError()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        var update = new UserProfile { Id = "missing", FullName = "Missing", Emoji = "missing" };
        using var response = await client.PutAsJsonAsync("/api/v1/users/missing", update);

        Assert.Equal(HttpStatusCode.NotFound, response.StatusCode);
        var body = await response.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("User not found", body.GetProperty("error").GetString());
    }

    [Theory]
    [InlineData("POST", "/api/v1/users")]
    [InlineData("PUT", "/api/v1/users/1")]
    public async Task InvalidBodyReturnsBadRequest(string method, string path)
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(new HttpMethod(method), path)
        {
            Content = new StringContent("{}", Encoding.UTF8, "application/json")
        };
        using var response = await client.SendAsync(request);

        Assert.Equal(HttpStatusCode.BadRequest, response.StatusCode);
        Assert.Equal(3, Users.Count);
    }

    [Fact]
    public async Task HomeRendersCurrentUsers()
    {
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();
        using var response = await client.GetAsync("/");
        var html = await response.Content.ReadAsStringAsync();

        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("text/html", response.Content.Headers.ContentType?.MediaType);
        Assert.Contains("Test User One", html);
        Assert.Contains("/api/v1/users", html);
    }
}

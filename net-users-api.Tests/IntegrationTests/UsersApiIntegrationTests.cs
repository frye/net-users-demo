using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using FluentAssertions;
using NetUsersApi.Models;

namespace NetUsersApi.Tests.IntegrationTests;

/// <summary>
/// Integration tests for the Users API
/// Tests the full HTTP request/response cycle
/// </summary>
public class UsersApiIntegrationTests : IClassFixture<CustomWebApplicationFactory>, IDisposable
{
    private readonly CustomWebApplicationFactory _factory;
    private readonly HttpClient _client;

    public UsersApiIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = _factory.CreateClient();
        _factory.ResetUsersData();
    }

    public void Dispose()
    {
        _factory.ResetUsersData();
        _client.Dispose();
    }

    #region GET /api/v1/users Tests

    [Fact]
    public async Task GetUsers_ReturnsSuccessStatusCode()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users");

        // Assert
        response.EnsureSuccessStatusCode();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUsers_ReturnsJsonContentType()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users");

        // Assert
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task GetUsers_ReturnsListOfUsers()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users");
        var users = await response.Content.ReadFromJsonAsync<List<UserProfile>>();

        // Assert
        users.Should().NotBeNull();
        users.Should().HaveCount(3);
        users.Should().Contain(u => u.Id == "1" && u.FullName == "John Doe");
    }

    #endregion

    #region GET /api/v1/users/{id} Tests

    [Fact]
    public async Task GetUser_ReturnsSuccessStatusCode_WhenUserExists()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users/1");

        // Assert
        response.EnsureSuccessStatusCode();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUser_ReturnsCorrectUser_WhenUserExists()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users/1");
        var user = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        user.Should().NotBeNull();
        user!.Id.Should().Be("1");
        user.FullName.Should().Be("John Doe");
        user.Emoji.Should().Be("😀");
    }

    [Fact]
    public async Task GetUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Act
        var response = await _client.GetAsync("/api/v1/users/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region POST /api/v1/users Tests

    [Fact]
    public async Task CreateUser_ReturnsCreatedStatusCode()
    {
        // Arrange
        var newUser = new UserProfile { Id = "4", FullName = "Alice Cooper", Emoji = "🎭" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/users", newUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
    }

    [Fact]
    public async Task CreateUser_ReturnsLocationHeader()
    {
        // Arrange
        var newUser = new UserProfile { Id = "5", FullName = "Bob Dylan", Emoji = "🎸" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/users", newUser);

        // Assert
        response.Headers.Location.Should().NotBeNull();
        response.Headers.Location!.ToString().Should().Contain("/Users/5"); // ASP.NET uses controller name with capital
    }

    [Fact]
    public async Task CreateUser_ReturnsCreatedUser()
    {
        // Arrange
        var newUser = new UserProfile { Id = "6", FullName = "Charlie Brown", Emoji = "⚾" };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/users", newUser);
        var createdUser = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        createdUser.Should().NotBeNull();
        createdUser!.Id.Should().Be("6");
        createdUser.FullName.Should().Be("Charlie Brown");
        createdUser.Emoji.Should().Be("⚾");
    }

    [Fact]
    public async Task CreateUser_PersistsUser()
    {
        // Arrange
        var newUser = new UserProfile { Id = "7", FullName = "Diana Prince", Emoji = "🦸‍♀️" };

        // Act
        await _client.PostAsJsonAsync("/api/v1/users", newUser);
        var getResponse = await _client.GetAsync("/api/v1/users/7");
        var retrievedUser = await getResponse.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        retrievedUser.Should().NotBeNull();
        retrievedUser!.Id.Should().Be("7");
        retrievedUser.FullName.Should().Be("Diana Prince");
    }

    #endregion

    #region PUT /api/v1/users/{id} Tests

    [Fact]
    public async Task UpdateUser_ReturnsOkStatusCode_WhenUserExists()
    {
        // Arrange
        var updatedUser = new UserProfile { Id = "1", FullName = "John Smith", Emoji = "😎" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/v1/users/1", updatedUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task UpdateUser_ReturnsUpdatedUser()
    {
        // Arrange
        var updatedUser = new UserProfile { Id = "2", FullName = "Jane Doe", Emoji = "🌟" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/v1/users/2", updatedUser);
        var returnedUser = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        returnedUser.Should().NotBeNull();
        returnedUser!.FullName.Should().Be("Jane Doe");
        returnedUser.Emoji.Should().Be("🌟");
    }

    [Fact]
    public async Task UpdateUser_PersistsChanges()
    {
        // Arrange
        var updatedUser = new UserProfile { Id = "3", FullName = "Bob Johnson", Emoji = "🎺" };

        // Act
        await _client.PutAsJsonAsync("/api/v1/users/3", updatedUser);
        var getResponse = await _client.GetAsync("/api/v1/users/3");
        var retrievedUser = await getResponse.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        retrievedUser.Should().NotBeNull();
        retrievedUser!.FullName.Should().Be("Bob Johnson");
        retrievedUser.Emoji.Should().Be("🎺");
    }

    [Fact]
    public async Task UpdateUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Arrange
        var updatedUser = new UserProfile { Id = "999", FullName = "Non Existent", Emoji = "❌" };

        // Act
        var response = await _client.PutAsJsonAsync("/api/v1/users/999", updatedUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region DELETE /api/v1/users/{id} Tests

    [Fact]
    public async Task DeleteUser_ReturnsNoContentStatusCode_WhenUserExists()
    {
        // Act
        var response = await _client.DeleteAsync("/api/v1/users/1");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);
    }

    [Fact]
    public async Task DeleteUser_RemovesUser()
    {
        // Act
        await _client.DeleteAsync("/api/v1/users/2");
        var getResponse = await _client.GetAsync("/api/v1/users/2");

        // Assert
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteUser_ReturnsNotFound_WhenUserDoesNotExist()
    {
        // Act
        var response = await _client.DeleteAsync("/api/v1/users/999");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region Test Isolation Tests

    [Fact]
    public async Task MultipleTests_DoNotInterfere_Test1()
    {
        // This test creates a user and verifies isolation
        var newUser = new UserProfile { Id = "100", FullName = "Test User 1", Emoji = "🔬" };
        await _client.PostAsJsonAsync("/api/v1/users", newUser);
        
        var response = await _client.GetAsync("/api/v1/users/100");
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task MultipleTests_DoNotInterfere_Test2()
    {
        // This test should not see the user created in Test1 due to test isolation
        var response = await _client.GetAsync("/api/v1/users/100");
        
        // User from Test1 should not exist due to ResetUsersData() in Dispose
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion
}

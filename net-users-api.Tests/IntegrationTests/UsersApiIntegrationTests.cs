using System.Net;
using System.Net.Http.Json;
using FluentAssertions;
using NetUsersApi.Models;

namespace NetUsersApi.Tests.IntegrationTests;

/// <summary>
/// Integration tests for the Users API
/// Tests the full HTTP request/response cycle
/// </summary>
public class UsersApiIntegrationTests : IClassFixture<CustomWebApplicationFactory>
{
    private readonly HttpClient _client;
    private readonly CustomWebApplicationFactory _factory;

    public UsersApiIntegrationTests(CustomWebApplicationFactory factory)
    {
        _factory = factory;
        _client = factory.CreateClient();
    }

    #region GET /api/v1/users Tests

    [Fact]
    public async Task GetUsers_ReturnsSuccessStatusCode()
    {
        // Arrange & Act
        var response = await _client.GetAsync("/api/v1/users");

        // Assert
        response.EnsureSuccessStatusCode();
        response.StatusCode.Should().Be(HttpStatusCode.OK);
    }

    [Fact]
    public async Task GetUsers_ReturnsJsonContentType()
    {
        // Arrange & Act
        var response = await _client.GetAsync("/api/v1/users");

        // Assert
        response.Content.Headers.ContentType?.MediaType.Should().Be("application/json");
    }

    [Fact]
    public async Task GetUsers_ReturnsUserList()
    {
        // Arrange & Act
        var response = await _client.GetAsync("/api/v1/users");
        var users = await response.Content.ReadFromJsonAsync<List<UserProfile>>();

        // Assert
        users.Should().NotBeNull();
        users.Should().HaveCountGreaterThan(0);
    }

    #endregion

    #region GET /api/v1/users/{id} Tests

    [Fact]
    public async Task GetUser_ValidId_ReturnsUser()
    {
        // Arrange
        var userId = "1";

        // Act
        var response = await _client.GetAsync($"/api/v1/users/{userId}");
        var user = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        user.Should().NotBeNull();
        user!.Id.Should().Be(userId);
        user.FullName.Should().NotBeNullOrEmpty();
        user.Emoji.Should().NotBeNullOrEmpty();
    }

    [Fact]
    public async Task GetUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidUserId = "999";

        // Act
        var response = await _client.GetAsync($"/api/v1/users/{invalidUserId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region POST /api/v1/users Tests

    [Fact]
    public async Task CreateUser_ValidUser_ReturnsCreated()
    {
        // Arrange
        var newUser = new UserProfile
        {
            Id = $"test-{Guid.NewGuid()}",
            FullName = "Integration Test User",
            Emoji = "🧪"
        };

        // Act
        var response = await _client.PostAsJsonAsync("/api/v1/users", newUser);
        var createdUser = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.Created);
        response.Headers.Location.Should().NotBeNull();
        createdUser.Should().NotBeNull();
        createdUser!.Id.Should().Be(newUser.Id);
        createdUser.FullName.Should().Be(newUser.FullName);
        createdUser.Emoji.Should().Be(newUser.Emoji);
    }

    [Fact]
    public async Task CreateUser_ValidUser_CanBeRetrieved()
    {
        // Arrange
        var newUser = new UserProfile
        {
            Id = $"test-{Guid.NewGuid()}",
            FullName = "Retrievable User",
            Emoji = "🔍"
        };

        // Act
        var createResponse = await _client.PostAsJsonAsync("/api/v1/users", newUser);
        createResponse.EnsureSuccessStatusCode();

        var getResponse = await _client.GetAsync($"/api/v1/users/{newUser.Id}");
        var retrievedUser = await getResponse.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        getResponse.StatusCode.Should().Be(HttpStatusCode.OK);
        retrievedUser.Should().NotBeNull();
        retrievedUser!.Id.Should().Be(newUser.Id);
        retrievedUser.FullName.Should().Be(newUser.FullName);
    }

    [Fact]
    public async Task CreateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange & Act
        var response = await _client.PostAsJsonAsync("/api/v1/users", (UserProfile?)null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region PUT /api/v1/users/{id} Tests

    [Fact]
    public async Task UpdateUser_ExistingUser_ReturnsOk()
    {
        // Arrange - Create a user first
        var userId = $"test-{Guid.NewGuid()}";
        var originalUser = new UserProfile
        {
            Id = userId,
            FullName = "Original Name",
            Emoji = "😀"
        };
        await _client.PostAsJsonAsync("/api/v1/users", originalUser);

        var updatedUser = new UserProfile
        {
            Id = userId,
            FullName = "Updated Name",
            Emoji = "🎉"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/v1/users/{userId}", updatedUser);
        var returnedUser = await response.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.OK);
        returnedUser.Should().NotBeNull();
        returnedUser!.FullName.Should().Be("Updated Name");
        returnedUser.Emoji.Should().Be("🎉");
    }

    [Fact]
    public async Task UpdateUser_NonExistentUser_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = "nonexistent-999";
        var updatedUser = new UserProfile
        {
            Id = nonExistentId,
            FullName = "Test User",
            Emoji = "🧪"
        };

        // Act
        var response = await _client.PutAsJsonAsync($"/api/v1/users/{nonExistentId}", updatedUser);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task UpdateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange
        var userId = "1";

        // Act
        var response = await _client.PutAsJsonAsync($"/api/v1/users/{userId}", (UserProfile?)null);

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.BadRequest);
    }

    #endregion

    #region DELETE /api/v1/users/{id} Tests

    [Fact]
    public async Task DeleteUser_ExistingUser_ReturnsNoContent()
    {
        // Arrange - Create a user first
        var userId = $"test-{Guid.NewGuid()}";
        var userToDelete = new UserProfile
        {
            Id = userId,
            FullName = "User To Delete",
            Emoji = "🗑️"
        };
        await _client.PostAsJsonAsync("/api/v1/users", userToDelete);

        // Act
        var response = await _client.DeleteAsync($"/api/v1/users/{userId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NoContent);

        // Verify user is actually deleted
        var getResponse = await _client.GetAsync($"/api/v1/users/{userId}");
        getResponse.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    [Fact]
    public async Task DeleteUser_NonExistentUser_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = "nonexistent-999";

        // Act
        var response = await _client.DeleteAsync($"/api/v1/users/{nonExistentId}");

        // Assert
        response.StatusCode.Should().Be(HttpStatusCode.NotFound);
    }

    #endregion

    #region Test Isolation Tests

    [Fact]
    public async Task MultipleRequests_DontInterfere()
    {
        // Arrange
        var user1Id = $"test-{Guid.NewGuid()}";
        var user2Id = $"test-{Guid.NewGuid()}";

        var user1 = new UserProfile { Id = user1Id, FullName = "User 1", Emoji = "1️⃣" };
        var user2 = new UserProfile { Id = user2Id, FullName = "User 2", Emoji = "2️⃣" };

        // Act
        await _client.PostAsJsonAsync("/api/v1/users", user1);
        await _client.PostAsJsonAsync("/api/v1/users", user2);

        var response1 = await _client.GetAsync($"/api/v1/users/{user1Id}");
        var response2 = await _client.GetAsync($"/api/v1/users/{user2Id}");

        var retrievedUser1 = await response1.Content.ReadFromJsonAsync<UserProfile>();
        var retrievedUser2 = await response2.Content.ReadFromJsonAsync<UserProfile>();

        // Assert
        retrievedUser1.Should().NotBeNull();
        retrievedUser2.Should().NotBeNull();
        retrievedUser1!.Id.Should().Be(user1Id);
        retrievedUser2!.Id.Should().Be(user2Id);
        retrievedUser1.FullName.Should().NotBe(retrievedUser2.FullName);
    }

    #endregion
}

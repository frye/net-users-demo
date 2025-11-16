using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using System.Reflection;

namespace NetUsersApi.Tests.Controllers;

public class UsersControllerTests : IDisposable
{
    private readonly Mock<ILogger<UsersController>> _mockLogger;
    private readonly UsersController _controller;
    private readonly List<UserProfile> _originalUsers;

    public UsersControllerTests()
    {
        _mockLogger = new Mock<ILogger<UsersController>>();
        
        // Save the original state and reset to default test data
        _originalUsers = GetUsersListViaReflection();
        ResetUsersToDefaultState();
        
        _controller = new UsersController(_mockLogger.Object);
    }

    public void Dispose()
    {
        // Reset the static users list after each test
        ResetUsersToDefaultState();
    }

    private void ResetUsersToDefaultState()
    {
        var usersList = GetUsersListViaReflection();
        usersList.Clear();
        usersList.Add(new UserProfile { Id = "1", FullName = "John Doe", Emoji = "😀" });
        usersList.Add(new UserProfile { Id = "2", FullName = "Jane Smith", Emoji = "🚀" });
        usersList.Add(new UserProfile { Id = "3", FullName = "Robert Johnson", Emoji = "🎸" });
    }

    private List<UserProfile> GetUsersListViaReflection()
    {
        var usersField = typeof(UsersController).GetField("_users", BindingFlags.NonPublic | BindingFlags.Static);
        return (List<UserProfile>)usersField!.GetValue(null)!;
    }

    [Fact]
    public void GetUsers_ReturnsOkResult_WithListOfUsers()
    {
        // Act
        var result = _controller.GetUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var users = Assert.IsAssignableFrom<IEnumerable<UserProfile>>(okResult.Value);
        Assert.NotEmpty(users);
    }

    [Fact]
    public void GetUsers_LogsInformation()
    {
        // Act
        _controller.GetUsers();

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("GET /api/v1/users endpoint called")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    [Fact]
    public void GetUser_WithValidId_ReturnsOkResult_WithUser()
    {
        // Arrange
        var validId = "1";

        // Act
        var result = _controller.GetUser(validId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(validId, user.Id);
        Assert.Equal("John Doe", user.FullName);
    }

    [Fact]
    public void GetUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = "999";

        // Act
        var result = _controller.GetUser(invalidId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.NotNull(notFoundResult.Value);
    }

    [Fact]
    public void CreateUser_WithValidUser_ReturnsCreatedAtAction()
    {
        // Arrange
        var newUser = new UserProfile
        {
            Id = "100",
            FullName = "Test User",
            Emoji = "🧪"
        };

        // Act
        var result = _controller.CreateUser(newUser);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var returnedUser = Assert.IsType<UserProfile>(createdResult.Value);
        Assert.Equal(newUser.Id, returnedUser.Id);
        Assert.Equal(newUser.FullName, returnedUser.FullName);
        Assert.Equal(newUser.Emoji, returnedUser.Emoji);
    }

    [Fact]
    public void CreateUser_WithNullUser_ReturnsBadRequest()
    {
        // Act
        var result = _controller.CreateUser(null!);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);
    }

    [Fact]
    public void UpdateUser_WithValidIdAndUser_ReturnsOkResult()
    {
        // Arrange
        var userId = "1";
        var updatedUser = new UserProfile
        {
            Id = "1",
            FullName = "John Updated",
            Emoji = "😎"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedUser = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(userId, returnedUser.Id);
        Assert.Equal(updatedUser.FullName, returnedUser.FullName);
        Assert.Equal(updatedUser.Emoji, returnedUser.Emoji);
    }

    [Fact]
    public void UpdateUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = "999";
        var updatedUser = new UserProfile
        {
            Id = "999",
            FullName = "Non-existent User",
            Emoji = "❌"
        };

        // Act
        var result = _controller.UpdateUser(invalidId, updatedUser);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result.Result);
        Assert.NotNull(notFoundResult.Value);
    }

    [Fact]
    public void UpdateUser_WithNullUser_ReturnsBadRequest()
    {
        // Arrange
        var userId = "1";

        // Act
        var result = _controller.UpdateUser(userId, null!);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);
    }

    [Fact]
    public void UpdateUser_EnsuresIdDoesNotChange()
    {
        // Arrange
        var originalId = "1";
        var updatedUser = new UserProfile
        {
            Id = "different-id",
            FullName = "John Changed",
            Emoji = "🔄"
        };

        // Act
        var result = _controller.UpdateUser(originalId, updatedUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedUser = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(originalId, returnedUser.Id);
        Assert.NotEqual("different-id", returnedUser.Id);
    }

    [Fact]
    public void DeleteUser_ThrowsNotImplementedException()
    {
        // Arrange
        var userId = "1";

        // Act & Assert
        Assert.Throws<NotImplementedException>(() => _controller.DeleteUser(userId));
    }
}

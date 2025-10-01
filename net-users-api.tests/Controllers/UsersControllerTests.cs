using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using Xunit;

namespace NetUsersApi.Tests.Controllers;

public class UsersControllerTests : IDisposable
{
    private readonly Mock<ILogger<UsersController>> _mockLogger;
    private readonly UsersController _controller;
    private readonly List<UserProfile> _originalUsers;

    public UsersControllerTests()
    {
        _mockLogger = new Mock<ILogger<UsersController>>();
        _controller = new UsersController(_mockLogger.Object);
        
        // Save original users list for restoration after each test
        _originalUsers = new List<UserProfile>(UsersController.GetAllUsers());
    }

    public void Dispose()
    {
        // Restore original users list after each test
        var currentUsers = UsersController.GetAllUsers();
        currentUsers.Clear();
        currentUsers.AddRange(_originalUsers);
    }

    [Fact]
    public void GetUsers_ReturnsAllUsers()
    {
        // Act
        var result = _controller.GetUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var users = Assert.IsAssignableFrom<IEnumerable<UserProfile>>(okResult.Value);
        Assert.NotEmpty(users);
    }

    [Fact]
    public void GetUser_ValidId_ReturnsUser()
    {
        // Arrange
        var userId = "1";

        // Act
        var result = _controller.GetUser(userId);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(userId, user.Id);
    }

    [Fact]
    public void GetUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = "nonexistent";

        // Act
        var result = _controller.GetUser(userId);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public void CreateUser_ValidUser_ReturnsCreatedUser()
    {
        // Arrange
        var newUser = new UserProfile
        {
            Id = "test123",
            FullName = "Test User",
            Emoji = "🧪"
        };

        // Act
        var result = _controller.CreateUser(newUser);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(result.Result);
        var user = Assert.IsType<UserProfile>(createdResult.Value);
        Assert.Equal(newUser.Id, user.Id);
    }

    [Fact]
    public void UpdateUser_ValidUser_ReturnsUpdatedUser()
    {
        // Arrange
        var userId = "1";
        var updatedUser = new UserProfile
        {
            Id = userId,
            FullName = "Updated Name",
            Emoji = "✨"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal("Updated Name", user.FullName);
    }

    [Fact]
    public void UpdateUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = "nonexistent";
        var updatedUser = new UserProfile
        {
            Id = userId,
            FullName = "Updated Name",
            Emoji = "✨"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public void DeleteUser_ValidId_ReturnsNoContent()
    {
        // Arrange
        var userId = "1";

        // Act
        var result = _controller.DeleteUser(userId);

        // Assert
        Assert.IsType<NoContentResult>(result);
        
        // Verify user was deleted
        var getUserResult = _controller.GetUser(userId);
        Assert.IsType<NotFoundObjectResult>(getUserResult.Result);
    }

    [Fact]
    public void DeleteUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var userId = "nonexistent";

        // Act
        var result = _controller.DeleteUser(userId);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        var errorResponse = notFoundResult.Value;
        Assert.NotNull(errorResponse);
    }

    [Fact]
    public void DeleteUser_LogsDeleteOperation()
    {
        // Arrange
        var userId = "2";

        // Act
        _controller.DeleteUser(userId);

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("DELETE")),
                It.IsAny<Exception>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }
}

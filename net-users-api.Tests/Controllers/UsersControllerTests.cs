using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;

namespace NetUsersApi.Tests.Controllers;

public class UsersControllerTests
{
    private readonly Mock<ILogger<UsersController>> _mockLogger;
    private readonly UsersController _controller;

    public UsersControllerTests()
    {
        _mockLogger = new Mock<ILogger<UsersController>>();
        _controller = new UsersController(_mockLogger.Object);
    }

    [Fact]
    public void GetUsers_ReturnsAllUsers()
    {
        // Arrange
        // The controller uses static data, so we can just call it

        // Act
        var result = _controller.GetUsers();

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var users = Assert.IsAssignableFrom<IEnumerable<UserProfile>>(okResult.Value);
        Assert.NotEmpty(users);
    }

    [Theory]
    [InlineData("1")]
    [InlineData("2")]
    [InlineData("3")]
    public void GetUser_ValidId_ReturnsUser(string id)
    {
        // Act
        var result = _controller.GetUser(id);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var user = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(id, user.Id);
    }

    [Fact]
    public void GetUser_InvalidId_ReturnsNotFound()
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
    public void CreateUser_ValidUser_ReturnsCreatedAtAction()
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
        Assert.Equal(nameof(UsersController.GetUser), createdResult.ActionName);
    }

    [Fact]
    public void CreateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange
        UserProfile? nullUser = null;

        // Act
        var result = _controller.CreateUser(nullUser!);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);
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
        var returnedUser = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(userId, returnedUser.Id);
        Assert.Equal(updatedUser.FullName, returnedUser.FullName);
        Assert.Equal(updatedUser.Emoji, returnedUser.Emoji);
    }

    [Fact]
    public void UpdateUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = "999";
        var updatedUser = new UserProfile
        {
            Id = invalidId,
            FullName = "Updated Name",
            Emoji = "✨"
        };

        // Act
        var result = _controller.UpdateUser(invalidId, updatedUser);

        // Assert
        Assert.IsType<NotFoundObjectResult>(result.Result);
    }

    [Fact]
    public void UpdateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange
        var userId = "1";
        UserProfile? nullUser = null;

        // Act
        var result = _controller.UpdateUser(userId, nullUser!);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(result.Result);
        Assert.NotNull(badRequestResult.Value);
    }

    [Fact]
    public void UpdateUser_MismatchedId_UpdatesWithCorrectId()
    {
        // Arrange
        var userId = "1";
        var updatedUser = new UserProfile
        {
            Id = "999", // Different from the route parameter
            FullName = "Updated Name",
            Emoji = "✨"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var returnedUser = Assert.IsType<UserProfile>(okResult.Value);
        Assert.Equal(userId, returnedUser.Id); // Should use the route parameter ID
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

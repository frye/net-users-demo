using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using FluentAssertions;

namespace NetUsersApi.Tests.Controllers;

/// <summary>
/// Unit tests for UsersController
/// </summary>
public class UsersControllerTests
{
    private readonly Mock<ILogger<UsersController>> _mockLogger;

    public UsersControllerTests()
    {
        _mockLogger = new Mock<ILogger<UsersController>>();
    }

    #region GetUsers Tests

    [Fact]
    public void GetUsers_HappyPath_ReturnsAllUsers()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);

        // Act
        var result = controller.GetUsers();

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var users = okResult.Value.Should().BeAssignableTo<IEnumerable<UserProfile>>().Subject;
        users.Should().NotBeNull();
    }

    [Fact]
    public void GetUsers_LogsInformation()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);

        // Act
        controller.GetUsers();

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString()!.Contains("GET /api/v1/users endpoint called")),
                It.IsAny<Exception?>(),
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    #endregion

    #region GetUser Tests

    [Fact]
    public void GetUser_ValidId_ReturnsUser()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var testId = "1";

        // Act
        var result = controller.GetUser(testId);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var user = okResult.Value.Should().BeOfType<UserProfile>().Subject;
        user.Id.Should().Be(testId);
    }

    [Fact]
    public void GetUser_InvalidId_ReturnsNotFound()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var invalidId = "999";

        // Act
        var result = controller.GetUser(invalidId);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Theory]
    [InlineData("")]
    public void GetUser_EmptyId_ReturnsNotFound(string id)
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);

        // Act
        var result = controller.GetUser(id);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region CreateUser Tests

    [Fact]
    public void CreateUser_HappyPath_CreatesAndReturns201()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var newUser = new UserProfile
        {
            Id = "100",
            FullName = "Test User",
            Emoji = "🧪"
        };

        // Act
        var result = controller.CreateUser(newUser);

        // Assert
        result.Should().NotBeNull();
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        createdResult.StatusCode.Should().Be(201);
        var returnedUser = createdResult.Value.Should().BeOfType<UserProfile>().Subject;
        returnedUser.Id.Should().Be(newUser.Id);
        returnedUser.FullName.Should().Be(newUser.FullName);
        returnedUser.Emoji.Should().Be(newUser.Emoji);
    }

    [Fact]
    public void CreateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);

        // Act
        var result = controller.CreateUser(null!);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    #endregion

    #region UpdateUser Tests

    [Fact]
    public void UpdateUser_HappyPath_UpdatesExistingUser()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var existingId = "1";
        var updatedUser = new UserProfile
        {
            Id = existingId,
            FullName = "Updated Name",
            Emoji = "🎉"
        };

        // Act
        var result = controller.UpdateUser(existingId, updatedUser);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var returnedUser = okResult.Value.Should().BeOfType<UserProfile>().Subject;
        returnedUser.FullName.Should().Be("Updated Name");
        returnedUser.Emoji.Should().Be("🎉");
    }

    [Fact]
    public void UpdateUser_NonExistentUser_ReturnsNotFound()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var nonExistentId = "999";
        var updatedUser = new UserProfile
        {
            Id = nonExistentId,
            FullName = "Test User",
            Emoji = "🧪"
        };

        // Act
        var result = controller.UpdateUser(nonExistentId, updatedUser);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public void UpdateUser_NullUser_ReturnsBadRequest()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var existingId = "1";

        // Act
        var result = controller.UpdateUser(existingId, null!);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    #endregion

    #region DeleteUser Tests

    [Fact]
    public void DeleteUser_HappyPath_DeletesAndReturnsNoContent()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var existingId = "2";

        // Act
        var result = controller.DeleteUser(existingId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<NoContentResult>();
    }

    [Fact]
    public void DeleteUser_NonExistentUser_ReturnsNotFound()
    {
        // Arrange
        var controller = new UsersController(_mockLogger.Object);
        var nonExistentId = "999";

        // Act
        var result = controller.DeleteUser(nonExistentId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion
}

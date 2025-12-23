using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using FluentAssertions;

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

    #region GetUsers Tests

    [Fact]
    public void GetUsers_ReturnsOkResult_WithListOfUsers()
    {
        // Act
        var result = _controller.GetUsers();

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult.Value.Should().BeAssignableTo<IEnumerable<UserProfile>>();
        
        var users = okResult.Value as IEnumerable<UserProfile>;
        users.Should().NotBeNull();
        users.Should().NotBeEmpty();
    }

    [Fact]
    public void GetUsers_LogsInformationMessage()
    {
        // Act
        var result = _controller.GetUsers();

        // Assert
        _mockLogger.Verify(
            x => x.Log(
                LogLevel.Information,
                It.IsAny<EventId>(),
                It.Is<It.IsAnyType>((v, t) => v.ToString().Contains("GET /api/v1/users endpoint called")),
                null,
                It.IsAny<Func<It.IsAnyType, Exception?, string>>()),
            Times.Once);
    }

    #endregion

    #region GetUser Tests

    [Fact]
    public void GetUser_WithValidId_ReturnsOkResult_WithUser()
    {
        // Arrange
        var validId = "1";

        // Act
        var result = _controller.GetUser(validId);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        okResult.Value.Should().BeOfType<UserProfile>();
        
        var user = okResult.Value as UserProfile;
        user.Should().NotBeNull();
        user.Id.Should().Be(validId);
    }

    [Fact]
    public void GetUser_WithInvalidId_ReturnsNotFound()
    {
        // Arrange
        var invalidId = "999";

        // Act
        var result = _controller.GetUser(invalidId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Value.Should().NotBeNull();
    }

    [Fact]
    public void GetUser_WithNonExistentId_ReturnsNotFoundWithErrorMessage()
    {
        // Arrange
        var nonExistentId = "nonexistent";

        // Act
        var result = _controller.GetUser(nonExistentId);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
        var notFoundResult = result.Result as NotFoundObjectResult;
        
        var errorObject = notFoundResult.Value;
        errorObject.Should().NotBeNull();
        var errorProperty = errorObject.GetType().GetProperty("error");
        errorProperty.Should().NotBeNull();
        errorProperty.GetValue(errorObject).Should().Be("User not found");
    }

    #endregion

    #region CreateUser Tests

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
        result.Result.Should().BeOfType<CreatedAtActionResult>();
        var createdResult = result.Result as CreatedAtActionResult;
        createdResult.ActionName.Should().Be(nameof(UsersController.GetUser));
        createdResult.RouteValues["id"].Should().Be(newUser.Id);
        createdResult.Value.Should().Be(newUser);
    }

    [Fact]
    public void CreateUser_WithValidUser_AddsUserToList()
    {
        // Arrange
        var newUser = new UserProfile
        {
            Id = "101",
            FullName = "Another Test User",
            Emoji = "🎉"
        };

        // Act
        _controller.CreateUser(newUser);
        var getUserResult = _controller.GetUser(newUser.Id);

        // Assert
        getUserResult.Result.Should().BeOfType<OkObjectResult>();
        var okResult = getUserResult.Result as OkObjectResult;
        var retrievedUser = okResult.Value as UserProfile;
        retrievedUser.Should().NotBeNull();
        retrievedUser.Id.Should().Be(newUser.Id);
        retrievedUser.FullName.Should().Be(newUser.FullName);
        retrievedUser.Emoji.Should().Be(newUser.Emoji);
    }

    [Fact]
    public void CreateUser_WithNullUser_ReturnsBadRequest()
    {
        // Act
        var result = _controller.CreateUser(null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        badRequestResult.Value.Should().NotBeNull();
    }

    [Fact]
    public void CreateUser_WithNullUser_ReturnsBadRequestWithErrorMessage()
    {
        // Act
        var result = _controller.CreateUser(null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        
        var errorObject = badRequestResult.Value;
        errorObject.Should().NotBeNull();
        var errorProperty = errorObject.GetType().GetProperty("error");
        errorProperty.Should().NotBeNull();
        errorProperty.GetValue(errorObject).Should().Be("Invalid user data");
    }

    #endregion

    #region UpdateUser Tests

    [Fact]
    public void UpdateUser_WithValidIdAndUser_ReturnsOkResult_WithUpdatedUser()
    {
        // Arrange
        var userId = "1";
        var updatedUser = new UserProfile
        {
            Id = "999", // This should be overwritten
            FullName = "Updated Name",
            Emoji = "🔄"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        var returnedUser = okResult.Value as UserProfile;
        returnedUser.Should().NotBeNull();
        returnedUser.Id.Should().Be(userId); // ID should match the path parameter
        returnedUser.FullName.Should().Be(updatedUser.FullName);
        returnedUser.Emoji.Should().Be(updatedUser.Emoji);
    }

    [Fact]
    public void UpdateUser_EnsuresIdDoesNotChange()
    {
        // Arrange
        var userId = "2";
        var updatedUser = new UserProfile
        {
            Id = "different-id",
            FullName = "Updated Name",
            Emoji = "🔄"
        };

        // Act
        var result = _controller.UpdateUser(userId, updatedUser);

        // Assert
        result.Result.Should().BeOfType<OkObjectResult>();
        var okResult = result.Result as OkObjectResult;
        var returnedUser = okResult.Value as UserProfile;
        returnedUser.Id.Should().Be(userId); // ID should be the path parameter, not the body ID
    }

    [Fact]
    public void UpdateUser_WithNonExistentId_ReturnsNotFound()
    {
        // Arrange
        var nonExistentId = "999";
        var updatedUser = new UserProfile
        {
            Id = nonExistentId,
            FullName = "Updated Name",
            Emoji = "🔄"
        };

        // Act
        var result = _controller.UpdateUser(nonExistentId, updatedUser);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
        var notFoundResult = result.Result as NotFoundObjectResult;
        notFoundResult.Value.Should().NotBeNull();
    }

    [Fact]
    public void UpdateUser_WithNonExistentId_ReturnsNotFoundWithErrorMessage()
    {
        // Arrange
        var nonExistentId = "nonexistent";
        var updatedUser = new UserProfile
        {
            Id = nonExistentId,
            FullName = "Updated Name",
            Emoji = "🔄"
        };

        // Act
        var result = _controller.UpdateUser(nonExistentId, updatedUser);

        // Assert
        result.Result.Should().BeOfType<NotFoundObjectResult>();
        var notFoundResult = result.Result as NotFoundObjectResult;
        
        var errorObject = notFoundResult.Value;
        errorObject.Should().NotBeNull();
        var errorProperty = errorObject.GetType().GetProperty("error");
        errorProperty.Should().NotBeNull();
        errorProperty.GetValue(errorObject).Should().Be("User not found");
    }

    [Fact]
    public void UpdateUser_WithNullUser_ReturnsBadRequest()
    {
        // Arrange
        var userId = "1";

        // Act
        var result = _controller.UpdateUser(userId, null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        badRequestResult.Value.Should().NotBeNull();
    }

    [Fact]
    public void UpdateUser_WithNullUser_ReturnsBadRequestWithErrorMessage()
    {
        // Arrange
        var userId = "1";

        // Act
        var result = _controller.UpdateUser(userId, null);

        // Assert
        result.Result.Should().BeOfType<BadRequestObjectResult>();
        var badRequestResult = result.Result as BadRequestObjectResult;
        
        var errorObject = badRequestResult.Value;
        errorObject.Should().NotBeNull();
        var errorProperty = errorObject.GetType().GetProperty("error");
        errorProperty.Should().NotBeNull();
        errorProperty.GetValue(errorObject).Should().Be("Invalid user data");
    }

    #endregion
}

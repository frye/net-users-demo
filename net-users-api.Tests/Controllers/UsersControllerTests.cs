using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using FluentAssertions;
using System.Reflection;

namespace NetUsersApi.Tests.Controllers;

public class UsersControllerTests : IDisposable
{
    private readonly Mock<ILogger<UsersController>> _mockLogger;
    private readonly UsersController _controller;
    private readonly FieldInfo _usersField;

    public UsersControllerTests()
    {
        _mockLogger = new Mock<ILogger<UsersController>>();
        _controller = new UsersController(_mockLogger.Object);
        
        // Get the static _users field for test setup/cleanup
        _usersField = typeof(UsersController).GetField("_users", BindingFlags.NonPublic | BindingFlags.Static)
            ?? throw new InvalidOperationException("Could not find _users field");
    }

    public void Dispose()
    {
        // Reset the static users list after each test
        ResetUsersList();
    }

    private void ResetUsersList()
    {
        var freshUsers = new List<UserProfile>
        {
            new UserProfile { Id = "1", FullName = "John Doe", Emoji = "😀" },
            new UserProfile { Id = "2", FullName = "Jane Smith", Emoji = "🚀" },
            new UserProfile { Id = "3", FullName = "Robert Johnson", Emoji = "🎸" }
        };
        _usersField.SetValue(null, freshUsers);
    }

    private void SetUsersList(List<UserProfile> users)
    {
        _usersField.SetValue(null, users);
    }

    #region GetUsers Tests

    [Fact]
    public void GetUsers_ReturnsAllUsers_WhenUsersExist()
    {
        // Arrange
        ResetUsersList();

        // Act
        var result = _controller.GetUsers();

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var users = okResult.Value.Should().BeAssignableTo<IEnumerable<UserProfile>>().Subject;
        users.Should().HaveCount(3);
    }

    [Fact]
    public void GetUsers_ReturnsEmptyList_WhenNoUsersExist()
    {
        // Arrange
        SetUsersList(new List<UserProfile>());

        // Act
        var result = _controller.GetUsers();

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var users = okResult.Value.Should().BeAssignableTo<IEnumerable<UserProfile>>().Subject;
        users.Should().BeEmpty();
    }

    #endregion

    #region GetUser Tests

    [Fact]
    public void GetUser_ReturnsUser_WhenValidIdProvided()
    {
        // Arrange
        ResetUsersList();
        var userId = "1";

        // Act
        var result = _controller.GetUser(userId);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var user = okResult.Value.Should().BeOfType<UserProfile>().Subject;
        user.Id.Should().Be(userId);
        user.FullName.Should().Be("John Doe");
    }

    [Fact]
    public void GetUser_ReturnsNotFound_WhenInvalidIdProvided()
    {
        // Arrange
        ResetUsersList();
        var invalidId = "999";

        // Act
        var result = _controller.GetUser(invalidId);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Theory]
    [InlineData("")]
    [InlineData(" ")]
    public void GetUser_ReturnsNotFound_WhenEmptyOrWhitespaceIdProvided(string id)
    {
        // Arrange
        ResetUsersList();

        // Act
        var result = _controller.GetUser(id);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion

    #region CreateUser Tests

    [Fact]
    public void CreateUser_ReturnsCreatedAtAction_WhenValidUserProvided()
    {
        // Arrange
        ResetUsersList();
        var newUser = new UserProfile { Id = "4", FullName = "Alice Cooper", Emoji = "🎭" };

        // Act
        var result = _controller.CreateUser(newUser);

        // Assert
        result.Should().NotBeNull();
        var createdResult = result.Result.Should().BeOfType<CreatedAtActionResult>().Subject;
        var user = createdResult.Value.Should().BeOfType<UserProfile>().Subject;
        user.Id.Should().Be("4");
        user.FullName.Should().Be("Alice Cooper");
        user.Emoji.Should().Be("🎭");
    }

    [Fact]
    public void CreateUser_ReturnsBadRequest_WhenNullUserProvided()
    {
        // Arrange
        ResetUsersList();

        // Act
        var result = _controller.CreateUser(null!);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public void CreateUser_AllowsDuplicateId_WhenUserAlreadyExists()
    {
        // Arrange
        ResetUsersList();
        var duplicateUser = new UserProfile { Id = "1", FullName = "Duplicate User", Emoji = "🔄" };

        // Act
        var result = _controller.CreateUser(duplicateUser);

        // Assert
        // Current implementation allows duplicates
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<CreatedAtActionResult>();
    }

    #endregion

    #region UpdateUser Tests

    [Fact]
    public void UpdateUser_ReturnsOk_WhenValidUserAndIdProvided()
    {
        // Arrange
        ResetUsersList();
        var updatedUser = new UserProfile { Id = "1", FullName = "John Smith", Emoji = "😎" };

        // Act
        var result = _controller.UpdateUser("1", updatedUser);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var user = okResult.Value.Should().BeOfType<UserProfile>().Subject;
        user.Id.Should().Be("1");
        user.FullName.Should().Be("John Smith");
        user.Emoji.Should().Be("😎");
    }

    [Fact]
    public void UpdateUser_ReturnsNotFound_WhenNonExistentUserIdProvided()
    {
        // Arrange
        ResetUsersList();
        var updatedUser = new UserProfile { Id = "999", FullName = "Non Existent", Emoji = "❌" };

        // Act
        var result = _controller.UpdateUser("999", updatedUser);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<NotFoundObjectResult>();
    }

    [Fact]
    public void UpdateUser_ReturnsBadRequest_WhenNullUserProvided()
    {
        // Arrange
        ResetUsersList();

        // Act
        var result = _controller.UpdateUser("1", null!);

        // Assert
        result.Should().NotBeNull();
        result.Result.Should().BeOfType<BadRequestObjectResult>();
    }

    [Fact]
    public void UpdateUser_MaintainsId_WhenDifferentIdInBody()
    {
        // Arrange
        ResetUsersList();
        var updatedUser = new UserProfile { Id = "999", FullName = "John Updated", Emoji = "🆕" };

        // Act
        var result = _controller.UpdateUser("1", updatedUser);

        // Assert
        result.Should().NotBeNull();
        var okResult = result.Result.Should().BeOfType<OkObjectResult>().Subject;
        var user = okResult.Value.Should().BeOfType<UserProfile>().Subject;
        user.Id.Should().Be("1"); // ID should be forced to match route parameter
    }

    #endregion

    #region DeleteUser Tests

    [Fact]
    public void DeleteUser_ReturnsNoContent_WhenValidIdProvided()
    {
        // Arrange
        ResetUsersList();
        var userId = "1";

        // Act
        var result = _controller.DeleteUser(userId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<NoContentResult>();
        
        // Verify user was actually removed
        var getUsersResult = _controller.GetUsers();
        var okResult = getUsersResult.Result.Should().BeOfType<OkObjectResult>().Subject;
        var users = okResult.Value.Should().BeAssignableTo<IEnumerable<UserProfile>>().Subject;
        users.Should().HaveCount(2);
        users.Should().NotContain(u => u.Id == userId);
    }

    [Fact]
    public void DeleteUser_ReturnsNotFound_WhenNonExistentIdProvided()
    {
        // Arrange
        ResetUsersList();
        var invalidId = "999";

        // Act
        var result = _controller.DeleteUser(invalidId);

        // Assert
        result.Should().NotBeNull();
        result.Should().BeOfType<NotFoundObjectResult>();
    }

    #endregion
}

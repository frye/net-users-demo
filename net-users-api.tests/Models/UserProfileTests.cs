using NetUsersApi.Models;
using FluentAssertions;

namespace NetUsersApi.Tests.Models;

public class UserProfileTests
{
    [Fact]
    public void UserProfile_CanBeCreated_WithRequiredProperties()
    {
        // Arrange & Act
        var user = new UserProfile
        {
            Id = "1",
            FullName = "John Doe",
            Emoji = "😀"
        };

        // Assert
        user.Should().NotBeNull();
        user.Id.Should().Be("1");
        user.FullName.Should().Be("John Doe");
        user.Emoji.Should().Be("😀");
    }

    [Fact]
    public void UserProfile_Properties_CanBeModified()
    {
        // Arrange
        var user = new UserProfile
        {
            Id = "1",
            FullName = "John Doe",
            Emoji = "😀"
        };

        // Act
        user.FullName = "Jane Smith";
        user.Emoji = "🚀";

        // Assert
        user.FullName.Should().Be("Jane Smith");
        user.Emoji.Should().Be("🚀");
        user.Id.Should().Be("1"); // ID should remain unchanged
    }

    [Fact]
    public void UserProfile_Id_CanBeSet()
    {
        // Arrange
        var user = new UserProfile
        {
            Id = "1",
            FullName = "John Doe",
            Emoji = "😀"
        };

        // Act
        user.Id = "2";

        // Assert
        user.Id.Should().Be("2");
    }
}

using NetUsersApi.Models;

namespace NetUsersApi.Tests.Models;

public class UserProfileTests
{
    [Fact]
    public void UserProfile_CanBeCreated_WithRequiredProperties()
    {
        // Arrange & Act
        var userProfile = new UserProfile
        {
            Id = "1",
            FullName = "John Doe",
            Emoji = "😀"
        };

        // Assert
        Assert.NotNull(userProfile);
        Assert.Equal("1", userProfile.Id);
        Assert.Equal("John Doe", userProfile.FullName);
        Assert.Equal("😀", userProfile.Emoji);
    }

    [Fact]
    public void UserProfile_PropertiesCanBeSet()
    {
        // Arrange
        var userProfile = new UserProfile
        {
            Id = "initial",
            FullName = "Initial Name",
            Emoji = "👤"
        };

        // Act
        userProfile.Id = "updated";
        userProfile.FullName = "Updated Name";
        userProfile.Emoji = "✨";

        // Assert
        Assert.Equal("updated", userProfile.Id);
        Assert.Equal("Updated Name", userProfile.FullName);
        Assert.Equal("✨", userProfile.Emoji);
    }

    [Fact]
    public void UserProfile_AllowsEmojisInEmojiFiled()
    {
        // Arrange
        var emojis = new[] { "😀", "🚀", "🎸", "🧪", "✅", "❌" };

        foreach (var emoji in emojis)
        {
            // Act
            var userProfile = new UserProfile
            {
                Id = "test",
                FullName = "Test User",
                Emoji = emoji
            };

            // Assert
            Assert.Equal(emoji, userProfile.Emoji);
        }
    }
}

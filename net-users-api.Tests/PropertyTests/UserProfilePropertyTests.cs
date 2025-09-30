using FluentAssertions;
using NetUsersApi.Models;
using System.Text.Json;
using Xunit;

namespace NetUsersApi.Tests.PropertyTests;

/// <summary>
/// Property-based tests for UserProfile and API invariants
/// Tests common properties that should hold for various inputs
/// </summary>
public class UserProfilePropertyTests
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    #region Serialization Tests

    /// <summary>
    /// Test: UserProfile should successfully round-trip through JSON serialization
    /// </summary>
    [Theory]
    [InlineData("1", "John Doe", "😀")]
    [InlineData("2", "Jane Smith", "🚀")]
    [InlineData("special-id-123", "Name with \"quotes\"", "🎭")]
    [InlineData("unicode-𝕦𝕟𝕚𝕔𝕠𝕕𝕖", "Unicode Name ©®™", "🌟")]
    public void UserProfile_SerializationRoundTrip_PreservesAllData(string id, string name, string emoji)
    {
        // Arrange
        var user = new UserProfile { Id = id, FullName = name, Emoji = emoji };

        // Act
        var json = JsonSerializer.Serialize(user);
        var deserialized = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions);

        // Assert
        deserialized.Should().NotBeNull();
        deserialized!.Id.Should().Be(user.Id);
        deserialized.FullName.Should().Be(user.FullName);
        deserialized.Emoji.Should().Be(user.Emoji);
    }

    /// <summary>
    /// Test: Serialization should handle special characters in all fields
    /// </summary>
    [Theory]
    [InlineData("id<>", "Name&Ampersand", "😀")]
    [InlineData("id'quote", "Name'Quote", "🚀")]
    [InlineData("id\ttab", "Name\tTab", "🎸")]
    public void UserProfile_SerializationHandlesSpecialCharacters(string id, string name, string emoji)
    {
        // Arrange
        var user = new UserProfile { Id = id, FullName = name, Emoji = emoji };

        // Act
        var json = JsonSerializer.Serialize(user);
        var deserialized = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions);

        // Assert
        deserialized.Should().NotBeNull();
        deserialized!.Id.Should().Be(user.Id);
        deserialized.FullName.Should().Be(user.FullName);
        deserialized.Emoji.Should().Be(user.Emoji);
    }

    #endregion

    #region ID Generation Tests

    /// <summary>
    /// Test: Generated user lists should have unique IDs
    /// </summary>
    [Fact]
    public void UserProfile_GeneratedList_HasUniqueIds()
    {
        // Arrange - generate a list of users
        var users = new List<UserProfile>();
        for (int i = 0; i < 100; i++)
        {
            users.Add(new UserProfile 
            { 
                Id = $"user_{i}", 
                FullName = $"User {i}", 
                Emoji = "😀" 
            });
        }

        // Assert
        var ids = users.Select(u => u.Id).ToList();
        ids.Should().OnlyHaveUniqueItems();
    }

    /// <summary>
    /// Test: UserProfile IDs should never be null or empty
    /// </summary>
    [Theory]
    [InlineData("1")]
    [InlineData("a")]
    [InlineData("user_123")]
    [InlineData("very_long_id_with_many_characters_12345678")]
    public void UserProfile_Id_NeverNullOrEmpty(string id)
    {
        // Arrange & Act
        var user = new UserProfile { Id = id, FullName = "Test User", Emoji = "😀" };

        // Assert
        user.Id.Should().NotBeNullOrWhiteSpace();
    }

    #endregion

    #region List Operations Tests

    /// <summary>
    /// Test: Pagination should never lose or duplicate items
    /// </summary>
    [Theory]
    [InlineData(10, 3)]  // 10 items, page size 3
    [InlineData(25, 5)]  // 25 items, page size 5
    [InlineData(50, 10)] // 50 items, page size 10
    [InlineData(7, 2)]   // 7 items, page size 2 (odd numbers)
    public void Pagination_NeverLosesOrDuplicatesItems(int totalItems, int pageSize)
    {
        // Arrange - create test data
        var users = new List<UserProfile>();
        for (int i = 0; i < totalItems; i++)
        {
            users.Add(new UserProfile 
            { 
                Id = $"user_{i}", 
                FullName = $"User {i}", 
                Emoji = "😀" 
            });
        }

        // Act - simulate pagination
        var allPaginatedUsers = new List<UserProfile>();
        var totalPages = (int)Math.Ceiling(users.Count / (double)pageSize);

        for (int page = 0; page < totalPages; page++)
        {
            var pageUsers = users.Skip(page * pageSize).Take(pageSize).ToList();
            allPaginatedUsers.AddRange(pageUsers);
        }

        // Assert
        allPaginatedUsers.Should().HaveCount(users.Count);
        allPaginatedUsers.Select(u => u.Id).Should().BeEquivalentTo(users.Select(u => u.Id));
    }

    /// <summary>
    /// Test: Pagination count should always be accurate
    /// </summary>
    [Theory]
    [InlineData(10, 3)]
    [InlineData(25, 7)]
    [InlineData(100, 15)]
    public void Pagination_CountIsAccurate(int totalItems, int pageSize)
    {
        // Arrange
        var users = new List<UserProfile>();
        for (int i = 0; i < totalItems; i++)
        {
            users.Add(new UserProfile 
            { 
                Id = $"user_{i}", 
                FullName = $"User {i}", 
                Emoji = "😀" 
            });
        }

        // Act
        var totalPages = (int)Math.Ceiling(users.Count / (double)pageSize);
        var calculatedTotal = 0;

        for (int page = 0; page < totalPages; page++)
        {
            var pageUsers = users.Skip(page * pageSize).Take(pageSize).ToList();
            calculatedTotal += pageUsers.Count;
        }

        // Assert
        calculatedTotal.Should().Be(users.Count);
    }

    /// <summary>
    /// Test: Filtering by ID should return at most one user
    /// </summary>
    [Theory]
    [InlineData("1")]
    [InlineData("2")]
    [InlineData("nonexistent")]
    [InlineData("")]
    public void Filter_ById_ReturnsAtMostOneUser(string searchId)
    {
        // Arrange
        var users = new List<UserProfile>
        {
            new UserProfile { Id = "1", FullName = "User 1", Emoji = "😀" },
            new UserProfile { Id = "2", FullName = "User 2", Emoji = "🚀" },
            new UserProfile { Id = "3", FullName = "User 3", Emoji = "🎸" }
        };

        // Act
        var filtered = users.Where(u => u.Id == searchId).ToList();

        // Assert
        filtered.Count.Should().BeLessThanOrEqualTo(1);
    }

    #endregion

    #region String Validation Tests

    /// <summary>
    /// Test: FullName should handle various string lengths
    /// </summary>
    [Theory]
    [InlineData("A")]
    [InlineData("John Doe")]
    [InlineData("A Very Long Name With Many Words And Characters That Keeps Going And Going")]
    public void UserProfile_FullName_HandlesDifferentLengths(string fullName)
    {
        // Arrange & Act
        var user = new UserProfile { Id = "1", FullName = fullName, Emoji = "😀" };

        // Assert
        user.FullName.Should().NotBeNull();
        var json = JsonSerializer.Serialize(user);
        json.Should().Contain(user.FullName);
    }

    /// <summary>
    /// Test: Emoji field should accept various Unicode characters
    /// </summary>
    [Theory]
    [InlineData("😀")]
    [InlineData("🚀")]
    [InlineData("🎸")]
    [InlineData("👨‍👩‍👧‍👦")] // Family emoji (compound)
    [InlineData("🏳️‍🌈")] // Rainbow flag (compound)
    public void UserProfile_Emoji_AcceptsUnicodeCharacters(string emoji)
    {
        // Arrange & Act
        var user = new UserProfile { Id = "1", FullName = "Test User", Emoji = emoji };
        var json = JsonSerializer.Serialize(user);
        var deserialized = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions);

        // Assert
        deserialized!.Emoji.Should().Be(user.Emoji);
    }

    #endregion

    #region Invariant Tests

    /// <summary>
    /// Test: UserProfile should maintain required properties after operations
    /// </summary>
    [Fact]
    public void UserProfile_MaintainsRequiredProperties_AfterMultipleOperations()
    {
        // Arrange
        var user = new UserProfile { Id = "1", FullName = "Original Name", Emoji = "😀" };

        // Act - multiple serialization/deserialization cycles
        for (int i = 0; i < 10; i++)
        {
            var json = JsonSerializer.Serialize(user);
            user = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions)!;
        }

        // Assert - properties should still be intact
        user.Should().NotBeNull();
        user.Id.Should().NotBeNullOrWhiteSpace();
        user.FullName.Should().NotBeNullOrWhiteSpace();
        user.Emoji.Should().NotBeNullOrWhiteSpace();
    }

    /// <summary>
    /// Test: Collection operations preserve data integrity
    /// </summary>
    [Fact]
    public void Collection_Operations_PreserveDataIntegrity()
    {
        // Arrange
        var users = new List<UserProfile>
        {
            new UserProfile { Id = "1", FullName = "User 1", Emoji = "😀" },
            new UserProfile { Id = "2", FullName = "User 2", Emoji = "🚀" },
            new UserProfile { Id = "3", FullName = "User 3", Emoji = "🎸" }
        };

        // Act - perform various operations
        var sorted = users.OrderBy(u => u.Id).ToList();
        var reversed = users.OrderByDescending(u => u.Id).ToList();
        var filtered = users.Where(u => u.Id != "2").ToList();

        // Assert - all operations should preserve complete user data
        sorted.Should().AllSatisfy(u =>
        {
            u.Id.Should().NotBeNullOrWhiteSpace();
            u.FullName.Should().NotBeNullOrWhiteSpace();
            u.Emoji.Should().NotBeNullOrWhiteSpace();
        });

        reversed.Should().HaveCount(3);
        filtered.Should().HaveCount(2);
    }

    #endregion
}

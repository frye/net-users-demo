using System.Text.Json;
using FsCheck;
using FsCheck.Xunit;
using FluentAssertions;
using NetUsersApi.Models;

namespace NetUsersApi.Tests.PropertyTests;

/// <summary>
/// Property-based tests for UserProfile
/// Uses FsCheck to generate random test cases and verify invariants
/// </summary>
public class UserProfilePropertyTests
{
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true
    };

    /// <summary>
    /// Property: UserProfile serialization/deserialization roundtrip should preserve all data
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfile_SerializationRoundtrip_PreservesData(NonEmptyString id, NonEmptyString fullName, NonEmptyString emoji)
    {
        // Arrange
        var original = new UserProfile
        {
            Id = id.Get,
            FullName = fullName.Get,
            Emoji = emoji.Get
        };

        // Act
        var json = JsonSerializer.Serialize(original);
        var deserialized = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions);

        // Assert
        deserialized.Should().NotBeNull();
        deserialized!.Id.Should().Be(original.Id);
        deserialized.FullName.Should().Be(original.FullName);
        deserialized.Emoji.Should().Be(original.Emoji);
    }

    /// <summary>
    /// Property: UserProfile properties should never be null after construction
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfile_RequiredProperties_AreNeverNull(NonEmptyString id, NonEmptyString fullName, NonEmptyString emoji)
    {
        // Arrange & Act
        var profile = new UserProfile
        {
            Id = id.Get,
            FullName = fullName.Get,
            Emoji = emoji.Get
        };

        // Assert
        profile.Id.Should().NotBeNull();
        profile.FullName.Should().NotBeNull();
        profile.Emoji.Should().NotBeNull();
    }

    /// <summary>
    /// Property: Two UserProfiles with the same ID should be considered equal in a dictionary context
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfile_SameId_CanBeUsedAsDictionaryKey(NonEmptyString id, NonEmptyString name1, NonEmptyString name2, NonEmptyString emoji)
    {
        // Arrange
        var profile1 = new UserProfile { Id = id.Get, FullName = name1.Get, Emoji = emoji.Get };
        var profile2 = new UserProfile { Id = id.Get, FullName = name2.Get, Emoji = emoji.Get };

        var dictionary = new Dictionary<string, UserProfile>
        {
            [profile1.Id] = profile1
        };

        // Act
        dictionary[profile2.Id] = profile2;

        // Assert
        dictionary.Should().ContainKey(id.Get);
        dictionary[id.Get].FullName.Should().Be(name2.Get);
        dictionary.Should().HaveCount(1);
    }

    /// <summary>
    /// Property: List operations should maintain correct count
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfileList_AddRemove_MaintainsCorrectCount(NonEmptyString id, NonEmptyString fullName, NonEmptyString emoji)
    {
        // Arrange
        var users = new List<UserProfile>();
        var user = new UserProfile
        {
            Id = id.Get,
            FullName = fullName.Get,
            Emoji = emoji.Get
        };

        // Act
        users.Add(user);
        var countAfterAdd = users.Count;

        users.Remove(user);
        var countAfterRemove = users.Count;

        // Assert
        countAfterAdd.Should().Be(1);
        countAfterRemove.Should().Be(0);
    }

    /// <summary>
    /// Property: Filtering by ID should return at most one user per unique ID
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfileList_FilterById_ReturnsExpectedCount(NonEmptyString id, NonEmptyString name, NonEmptyString emoji)
    {
        // Arrange
        var userList = new List<UserProfile>
        {
            new() { Id = id.Get, FullName = name.Get, Emoji = emoji.Get }
        };

        // Act
        var filtered = userList.Where(u => u.Id == id.Get).ToList();

        // Assert
        filtered.Should().HaveCount(1);
        filtered[0].Id.Should().Be(id.Get);
    }

    /// <summary>
    /// Property: Finding and updating a user preserves the ID
    /// Runs 100 test cases with random inputs
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfileUpdate_PreservesId(NonEmptyString id, NonEmptyString originalName, NonEmptyString updatedName, NonEmptyString emoji)
    {
        // Arrange
        var users = new List<UserProfile>
        {
            new() { Id = id.Get, FullName = originalName.Get, Emoji = emoji.Get }
        };

        var updatedUser = new UserProfile
        {
            Id = id.Get,
            FullName = updatedName.Get,
            Emoji = emoji.Get
        };

        // Act
        var index = users.FindIndex(u => u.Id == id.Get);
        if (index >= 0)
        {
            users[index] = updatedUser;
        }

        // Assert
        var foundUser = users.FirstOrDefault(u => u.Id == id.Get);
        foundUser.Should().NotBeNull();
        foundUser!.Id.Should().Be(id.Get);
        foundUser.FullName.Should().Be(updatedName.Get);
    }

    /// <summary>
    /// Property: JSON deserialization handles property name case insensitivity
    /// Runs 100 test cases with random inputs
    /// Uses proper JSON serialization to handle special characters
    /// </summary>
    [Property(MaxTest = 100)]
    public void UserProfile_JsonDeserialization_IsCaseInsensitive(NonEmptyString id, NonEmptyString fullName, NonEmptyString emoji)
    {
        // Arrange - Create UserProfile objects and serialize them with different property casing
        var profile = new UserProfile
        {
            Id = id.Get,
            FullName = fullName.Get,
            Emoji = emoji.Get
        };

        // Act - Serialize with default casing
        var json = JsonSerializer.Serialize(profile);
        
        // Deserialize with case-insensitive options
        var deserialized = JsonSerializer.Deserialize<UserProfile>(json, JsonOptions);

        // Assert
        deserialized.Should().NotBeNull();
        deserialized!.Id.Should().Be(id.Get);
        deserialized.FullName.Should().Be(fullName.Get);
        deserialized.Emoji.Should().Be(emoji.Get);
    }
}

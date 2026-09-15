using Microsoft.Extensions.Logging.Abstractions;
using NetUsersApi.Controllers;
using NetUsersApi.Models;

namespace NetUsersApi.Tests.Infrastructure;

public abstract class UserStoreTest : IDisposable
{
    private readonly List<UserProfile> _originalUsers;

    protected UsersController Controller { get; } = new(NullLogger<UsersController>.Instance);
    protected static List<UserProfile> Users => UsersController.GetAllUsers();

    protected UserStoreTest()
    {
        _originalUsers = Copy(Users);
        Users.Clear();
        Users.AddRange(CreateUsers());
    }

    public void Dispose()
    {
        Users.Clear();
        Users.AddRange(Copy(_originalUsers));
        GC.SuppressFinalize(this);
    }

    internal static List<UserProfile> CreateUsers() =>
    [
        new() { Id = "1", FullName = "Test User One", Emoji = "one" },
        new() { Id = "2", FullName = "Test User Two", Emoji = "two" },
        new() { Id = "3", FullName = "Test User Three", Emoji = "three" }
    ];

    internal static List<UserProfile> Copy(IEnumerable<UserProfile> users) =>
        users.Select(user => new UserProfile
        {
            Id = user.Id,
            FullName = user.FullName,
            Emoji = user.Emoji
        }).ToList();
}

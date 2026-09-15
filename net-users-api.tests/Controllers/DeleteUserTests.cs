using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using NetUsersApi.Controllers;
using NetUsersApi.Tests.Infrastructure;
using Xunit;

namespace NetUsersApi.Tests.Controllers;

[Trait("Workshop", "Delete")]
public class DeleteUserTests : UserStoreTest
{
    [Fact]
    public void ExistingIdReturnsNoContentAndRemovesUser()
    {
        var result = Controller.DeleteUser("2");

        Assert.IsType<NoContentResult>(result);
        Assert.Equal(["1", "3"], Users.Select(user => user.Id));
    }

    [Fact]
    public void MissingIdReturnsExistingError()
    {
        var result = Assert.IsType<NotFoundObjectResult>(Controller.DeleteUser("missing"));

        Assert.Equal("User not found", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
        Assert.Equal(3, Users.Count);
    }

    [Fact]
    public void RepeatedDeleteReturnsExistingError()
    {
        Assert.IsType<NoContentResult>(Controller.DeleteUser("2"));
        var result = Assert.IsType<NotFoundObjectResult>(Controller.DeleteUser("2"));

        Assert.Equal("User not found", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
        Assert.Equal(["1", "3"], Users.Select(user => user.Id));
    }

    [Fact]
    public void OtherUsersRemainUnchanged()
    {
        var expected = Users
            .Where(user => user.Id != "2")
            .Select(user => (user.Id, user.FullName, user.Emoji))
            .ToArray();

        Controller.DeleteUser("2");

        Assert.Equal(expected, Users.Select(user => (user.Id, user.FullName, user.Emoji)));
    }

    [Fact]
    public void LogsStructuredRequestWithUserId()
    {
        var logger = new RecordingLogger();
        var controller = new UsersController(logger);

        controller.DeleteUser("2");
        controller.DeleteUser("missing");

        Assert.Collection(
            logger.Entries,
            entry =>
            {
                Assert.Equal(LogLevel.Information, entry.Level);
                Assert.Equal("2", entry.Properties["UserId"]);
                Assert.Equal("DELETE /api/v1/users/{UserId} endpoint called", entry.Properties["{OriginalFormat}"]);
            },
            entry =>
            {
                Assert.Equal(LogLevel.Information, entry.Level);
                Assert.Equal("missing", entry.Properties["UserId"]);
                Assert.Equal("DELETE /api/v1/users/{UserId} endpoint called", entry.Properties["{OriginalFormat}"]);
            });
    }

    private sealed class RecordingLogger : ILogger<UsersController>
    {
        public List<LogEntry> Entries { get; } = [];

        public IDisposable? BeginScope<TState>(TState state) where TState : notnull => null;

        public bool IsEnabled(LogLevel logLevel) => true;

        public void Log<TState>(
            LogLevel logLevel,
            EventId eventId,
            TState state,
            Exception? exception,
            Func<TState, Exception?, string> formatter)
        {
            var properties = Assert.IsAssignableFrom<IEnumerable<KeyValuePair<string, object?>>>(state)
                .ToDictionary(property => property.Key, property => property.Value);
            Entries.Add(new LogEntry(logLevel, properties));
        }
    }

    private sealed record LogEntry(LogLevel Level, IReadOnlyDictionary<string, object?> Properties);
}

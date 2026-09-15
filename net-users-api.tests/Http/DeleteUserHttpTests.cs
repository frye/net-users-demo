using System.Net;
using System.Net.Http.Json;
using System.Text.Json;
using NetUsersApi.Models;
using NetUsersApi.Tests.Infrastructure;
using Xunit;

namespace NetUsersApi.Tests.Http;

[Trait("Workshop", "Delete")]
public class DeleteUserHttpTests : UserStoreTest
{
    [Fact]
    public async Task RepeatedDeleteReturnsNotFoundWithoutChangingOtherUsers()
    {
        var expected = Users
            .Where(user => user.Id != "2")
            .Select(user => (user.Id, user.FullName, user.Emoji))
            .ToArray();
        await using var factory = new UsersApiFactory();
        using var client = factory.CreateClient();

        using var firstResponse = await client.DeleteAsync("/api/v1/users/2");
        Assert.Equal(HttpStatusCode.NoContent, firstResponse.StatusCode);
        Assert.Empty(await firstResponse.Content.ReadAsByteArrayAsync());

        using var repeatedResponse = await client.DeleteAsync("/api/v1/users/2");
        Assert.Equal(HttpStatusCode.NotFound, repeatedResponse.StatusCode);
        var error = await repeatedResponse.Content.ReadFromJsonAsync<JsonElement>();
        Assert.Equal("User not found", error.GetProperty("error").GetString());

        var remainingUsers = await client.GetFromJsonAsync<UserProfile[]>("/api/v1/users");
        Assert.NotNull(remainingUsers);
        Assert.Equal(expected, remainingUsers.Select(user => (user.Id, user.FullName, user.Emoji)));
    }
}

using NetUsersApi.Controllers;
using Xunit;

namespace NetUsersApi.Tests.Infrastructure;

[Trait("Workshop", "Baseline")]
public class UserStoreTests : UserStoreTest
{
    [Fact]
    public void FreshFixturesDoNotReuseMutatedProfileObjects()
    {
        var first = CreateUsers();
        first[0].FullName = "Changed";
        first[0].Emoji = "changed";

        var second = CreateUsers();

        Assert.NotSame(first[0], second[0]);
        Assert.Equal("Test User One", second[0].FullName);
        Assert.Equal("one", second[0].Emoji);
    }

    [Fact]
    public void ScopeRestoresValuesWithoutRetainingMutableReferences()
    {
        var originalReference = Users[0];
        using (var scope = new StoreScope())
        {
            Users[0].FullName = "Changed inside scope";
            Users[1].Emoji = "changed";
            Users.RemoveAt(2);
        }
        originalReference.FullName = "Changed after scope";

        Assert.Equal(3, Users.Count);
        Assert.NotSame(originalReference, UsersController.GetAllUsers()[0]);
        Assert.Equal("Test User One", Users[0].FullName);
        Assert.Equal("two", Users[1].Emoji);
    }

    private sealed class StoreScope : UserStoreTest;
}

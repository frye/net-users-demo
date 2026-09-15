using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging.Abstractions;
using NetUsersApi.Controllers;
using NetUsersApi.Models;
using NetUsersApi.Tests.Infrastructure;
using Xunit;

namespace NetUsersApi.Tests.Controllers;

[Trait("Workshop", "Baseline")]
public class UsersControllerTests : UserStoreTest
{
    [Fact]
    public void GetUsersReturnsAllProfiles()
    {
        var result = Assert.IsType<OkObjectResult>(Controller.GetUsers().Result);
        var profiles = Assert.IsAssignableFrom<IEnumerable<UserProfile>>(result.Value);
        Assert.Equal(["1", "2", "3"], profiles.Select(user => user.Id));
    }

    [Theory]
    [InlineData("1", "Test User One")]
    [InlineData("2", "Test User Two")]
    public void GetUserReturnsMatchingProfile(string id, string name)
    {
        var result = Assert.IsType<OkObjectResult>(Controller.GetUser(id).Result);
        var profile = Assert.IsType<UserProfile>(result.Value);
        Assert.Equal(id, profile.Id);
        Assert.Equal(name, profile.FullName);
    }

    [Fact]
    public void GetMissingUserReturnsExistingError()
    {
        var result = Assert.IsType<NotFoundObjectResult>(Controller.GetUser("missing").Result);
        Assert.Equal("User not found", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
    }

    [Fact]
    public void CreateUserReturnsCreatedLocationAndAddsProfile()
    {
        var profile = new UserProfile { Id = "4", FullName = "New User", Emoji = "new" };
        var result = Assert.IsType<CreatedAtActionResult>(Controller.CreateUser(profile).Result);

        Assert.Equal(nameof(UsersController.GetUser), result.ActionName);
        Assert.Equal("4", result.RouteValues!["id"]);
        Assert.Equal(4, Users.Count);
        Assert.Same(profile, Users.Single(user => user.Id == "4"));
    }

    [Fact]
    public void CreateNullUserReturnsBadRequest()
    {
        var result = Assert.IsType<BadRequestObjectResult>(Controller.CreateUser(null!).Result);
        Assert.Equal("Invalid user data", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
        Assert.Equal(3, Users.Count);
    }

    [Fact]
    public void UpdateUserKeepsRouteId()
    {
        var update = new UserProfile { Id = "ignored", FullName = "Updated User", Emoji = "updated" };
        var result = Assert.IsType<OkObjectResult>(Controller.UpdateUser("1", update).Result);

        Assert.Same(update, result.Value);
        Assert.Equal("1", update.Id);
        Assert.Equal("Updated User", Users[0].FullName);
        Assert.Equal(3, Users.Count);
        Assert.Equal("Test User Two", Users[1].FullName);
    }

    [Fact]
    public void UpdateMissingUserReturnsExistingError()
    {
        var update = new UserProfile { Id = "missing", FullName = "Missing User", Emoji = "missing" };
        var result = Assert.IsType<NotFoundObjectResult>(Controller.UpdateUser("missing", update).Result);
        Assert.Equal("User not found", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
        Assert.Equal(3, Users.Count);
    }

    [Fact]
    public void UpdateNullUserReturnsBadRequest()
    {
        var result = Assert.IsType<BadRequestObjectResult>(Controller.UpdateUser("1", null!).Result);
        Assert.Equal("Invalid user data", JsonSerializer.SerializeToElement(result.Value).GetProperty("error").GetString());
        Assert.Equal("Test User One", Users[0].FullName);
    }

    [Fact]
    public void HomeReturnsProfilesForView()
    {
        var home = new HomeController(NullLogger<HomeController>.Instance);
        var result = Assert.IsType<ViewResult>(home.Index());
        var model = Assert.IsAssignableFrom<IEnumerable<UserProfile>>(result.Model);
        Assert.Equal(["1", "2", "3"], model.Select(user => user.Id));
    }
}

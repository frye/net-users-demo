using Microsoft.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container
builder.Services.AddControllers();
builder.Services.AddControllersWithViews();

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// Configure logging
builder.Logging.ClearProviders();
builder.Logging.AddConsole();

// Configure the server to listen on port 8080
builder.WebHost.ConfigureKestrel(serverOptions =>
{
    serverOptions.ListenAnyIP(8080);
});

var app = builder.Build();

// Configure the HTTP request pipeline
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseRouting();

// Map MVC controllers (for Home/Index view)
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}");

// Map API controllers
app.MapControllers();

Console.WriteLine("Starting server on :8080");
app.Run();

// Make Program class accessible for integration testing
public partial class Program { }

using EVEAbacus.Application;
using EVEAbacus.Infrastructure;
using Microsoft.AspNetCore.HttpOverrides;
using EVEAbacus.WebUI;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add UserSecrets in Development
if (builder.Environment.IsDevelopment())
{
    builder.Configuration.AddUserSecrets<Program>(optional: true).AddEnvironmentVariables();
}

// Add services to the container.
builder.Services
    .AddApplicationServices()
    .AddInfrastructureServices(builder.Configuration)
    .AddWebUIServices();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error"); 
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseSwagger(c =>
{
    c.PreSerializeFilters.Add((swaggerDoc, httpReq) =>
    {
        // Use production URL in production, localhost in development
        var serverUrl = app.Environment.IsDevelopment() 
            ? "http://localhost:5000" 
            : "https://eveabacus.com";
        swaggerDoc.Servers = new List<OpenApiServer> { new OpenApiServer { Url = serverUrl } };
    });
});
app.UseSwaggerUI(c =>
{
    c.SwaggerEndpoint("/swagger/v1/swagger.json", "EVE Abacus API v1");
    c.RoutePrefix = "swagger-ui";
});

if (!app.Environment.IsProduction())
{
    app.UseHttpsRedirection();
}
app.UseCors();

app.UseAuthorization();

app.MapInfrastructureEndpoints();
//app.UseStaticFiles();

// Add debugging middleware for CORS
app.Use(async (context, next) =>
{
    var origin = context.Request.Headers["Origin"].ToString();
    var method = context.Request.Method;
    var path = context.Request.Path;
    
    Console.WriteLine($"Request: {method} {path} from Origin: {origin}");
    
    await next();
});

app.MapControllers();

app.UseForwardedHeaders(new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedProto | ForwardedHeaders.XForwardedFor
});

app.Run();

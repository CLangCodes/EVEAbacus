using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace EVEAbacus.Infrastructure.Data
{
    public class DesignTimeDbContextFactory : IDesignTimeDbContextFactory<EVEAbacusDbContext>
    {
        public EVEAbacusDbContext CreateDbContext(string[] args)
        {
            var configurationBuilder = new ConfigurationBuilder()
                .SetBasePath(Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../EVEAbacus.WebUI")))
                .AddJsonFile("appsettings.json");

            // Add UserSecrets if available
            var webUiProjectPath = Path.GetFullPath(Path.Combine(Directory.GetCurrentDirectory(), "../EVEAbacus.WebUI/EVEAbacus.WebUI.csproj"));
            if (File.Exists(webUiProjectPath))
            {
                configurationBuilder.AddUserSecrets("be0c9849-49f3-4f7a-8806-e9688d3f7d2a");
            }

            var configuration = configurationBuilder.Build();

            var builder = new DbContextOptionsBuilder<EVEAbacusDbContext>();
            var connectionString = configuration.GetConnectionString("EVEAbacus");

            builder.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString));

            return new EVEAbacusDbContext(builder.Options);
        }
    }
} 
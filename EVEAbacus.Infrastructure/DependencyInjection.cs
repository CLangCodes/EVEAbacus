using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using EVEAbacus.Application.Interfaces;
using EVEAbacus.Infrastructure.Data;
using EVEAbacus.Infrastructure.Services;
using Microsoft.AspNetCore.Routing;
using EVEAbacus.Application.Services;
using EVEAbacus.Infrastructure.Repositories;
using StackExchange.Redis;

namespace EVEAbacus.Infrastructure
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddInfrastructureServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<ESIRateLimiter>();

            var connectionString = configuration.GetConnectionString("EVEAbacus")
                ?? throw new InvalidOperationException("Connection string 'EVEAbacus' not found.");

            // services.AddDbContextFactory<AbacusContext>(options => 
            // { 
            //     options.UseMySql(
            //         connectionString,
            //         ServerVersion.Parse("8.0.42-mysql"),
            //         sql => {
            //             sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
            //             sql.EnableRetryOnFailure(
            //                 maxRetryCount: 3,
            //                 maxRetryDelay: TimeSpan.FromSeconds(30),
            //                 errorNumbersToAdd: null);
            //         });
            // });

            services.AddDbContextFactory<EVEAbacusDbContext>(options => 
            { 
                options.UseMySql(
                    connectionString,
                    ServerVersion.Parse("8.0.42-mysql"),
                    sql => {
                        sql.UseQuerySplittingBehavior(QuerySplittingBehavior.SplitQuery);
                        sql.EnableRetryOnFailure(
                            maxRetryCount: 3,
                            maxRetryDelay: TimeSpan.FromSeconds(30),
                            errorNumbersToAdd: null);
                    });
            });

            services.AddScoped<IESIService, ESIService>();
            services.AddHttpClient<IESIService, ESIService>();

            services.AddScoped<ISDERepository, SDERepository>();
            services.AddScoped<ISDEService, SDEService>();

            services.AddScoped<MapService>();
            services.AddScoped<IMapService, MapService>();
            services.AddScoped<IMapRepository>(sp => new MapRepository(sp.GetRequiredService<IDbContextFactory<EVEAbacusDbContext>>()));

            services.AddScoped<IMarketRepository, MarketRepository>();

            services.AddScoped<CalculatorService>();

            services.AddScoped<ICharacterService, CharacterService>();
            services.AddScoped<IOrderService, OrderService>();
            services.AddScoped<IInventoryService, InventoryService>();
            services.AddScoped<ICustomBlueprintService, CustomBlueprintService>();

            services.AddScoped<IESIClient, ESIClient>();

            // Register the background service
            services.AddHostedService<MarketOrderBackgroundService>();

            var config = configuration.GetSection("Redis");
            var redisOptions = new ConfigurationOptions
            {
                EndPoints = { $"{config["Host"]}:{config["Port"]}" },
                Password = config["Password"],
                AbortOnConnectFail = false,
                ConnectRetry = 3,
                ReconnectRetryPolicy = new ExponentialRetry(5000),
                ConnectTimeout = 5000,
                SyncTimeout = 5000
            };
            
            try
            {
                services.AddSingleton<IConnectionMultiplexer>(sp =>
                    ConnectionMultiplexer.Connect(redisOptions));
                services.AddSingleton<ICacheService, CacheService>();
            }
            catch (Exception ex)
            {
                // Log the Redis connection error but don't fail the application startup
                Console.WriteLine($"Warning: Redis connection failed: {ex.Message}");
                // You could add a fallback cache service here if needed
            }

            return services;
        }
        public static IEndpointRouteBuilder MapInfrastructureEndpoints(this IEndpointRouteBuilder endpoints)
        {
            return endpoints;
        }

        public static IServiceCollection AddApiServices (this IServiceCollection services) 
        {
            services.AddControllers();
            return services;
        }
    }
}
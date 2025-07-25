using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Infrastructure;
using EVEAbacus.WebUI.Controllers;
using EVEAbacus.WebUI.Filters;
using Microsoft.AspNetCore.DataProtection;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Versioning;
using Microsoft.OpenApi.Models;
using System.Reflection;

namespace EVEAbacus.WebUI
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddWebUIServices(this IServiceCollection services)
        {
            // Add CORS services
            services.AddCors(options =>
            {
                options.AddDefaultPolicy(policy =>
                {
                    // Allow both HTTP and HTTPS for the same domains
                    policy.WithOrigins(
                            "https://eveabacus.com",
                            "http://eveabacus.com",
                            "https://www.eveabacus.com",
                            "http://www.eveabacus.com",
                            "http://localhost:3000"
                        )
                        .AllowAnyHeader()
                        .AllowAnyMethod()
                        .AllowCredentials();
                });
            });

            services.AddControllers()
                .AddNewtonsoftJson(options =>
                {
                    options.SerializerSettings.NullValueHandling = Newtonsoft.Json.NullValueHandling.Ignore;
                });

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "EVE Abacus API",
                    Version = "v1",
                    Description = "API for EVE Online manufacturing and production calculations"
                });

                // Include XML comments from WebUI and Domain projects
                var webUIAssembly = Assembly.GetExecutingAssembly();
                var webUIAssemblyName = webUIAssembly.GetName().Name;
                var webUIAssemblyXmlPath = Path.Combine(AppContext.BaseDirectory, $"{webUIAssemblyName}.xml");
                options.IncludeXmlComments(webUIAssemblyXmlPath, includeControllerXmlComments: true);

                // Include XML comments from Domain project
                var domainAssembly = typeof(EVEAbacus.Domain.Models.Calculator.OrderDTO).Assembly;
                var domainAssemblyName = domainAssembly.GetName().Name;
                var domainAssemblyXmlPath = Path.Combine(AppContext.BaseDirectory, $"{domainAssemblyName}.xml");
                if (File.Exists(domainAssemblyXmlPath))
                {
                    options.IncludeXmlComments(domainAssemblyXmlPath, includeControllerXmlComments: true);
                }

                // Enable Swagger annotations
                options.EnableAnnotations();

                // Add operation filters
                options.OperationFilter<SwaggerParameterOperationFilter>();
                options.OperationFilter<SwaggerHeaderOperationFilter>();

                // Add schema for OrderDTO - using automatic generation instead of custom schema
                // options.MapType<OrderDTO>(() => OrderDTOSchema.GetSchema());

                options.DocumentFilter<ExcludeIdentityPathsFilter>();
            });
            // Add API Versioning
            services.AddApiVersioning(options =>
            {
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.ReportApiVersions = true;
            });
            services.AddVersionedApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

            services.AddHttpContextAccessor();
            //services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddDataProtection()
                .PersistKeysToFileSystem(new DirectoryInfo("/var/aspnet-dataprotection"));

            return services;
        }
    }
}

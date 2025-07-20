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
            // Removed Blazor and UI services
            // services.AddRazorComponents().AddInteractiveServerComponents();
            // services.AddRazorPages();
            // services.AddServerSideBlazor().AddCircuitOptions(options => { options.DetailedErrors = true; });
            // services.AddBlazoredSessionStorage();
            // services.AddMudServices();
            // services.AddScoped<ICalcSessionService, CalcSessionService>();

            services.AddControllers();

            services.AddEndpointsApiExplorer();
            services.AddSwaggerGen(options =>
            {
                options.SwaggerDoc("v1", new OpenApiInfo
                {
                    Title = "EVE Abacus API",
                    Version = "v1",
                    Description = "API for EVE Online manufacturing and production calculations"
                });

                // Include XML comments
                var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
                options.IncludeXmlComments(xmlPath, includeControllerXmlComments: true);

                // Enable Swagger annotations
                options.EnableAnnotations();

                // Add operation filters
                options.OperationFilter<SwaggerParameterOperationFilter>();
                options.OperationFilter<SwaggerHeaderOperationFilter>();

                // Add schema for OrderDTO
                options.MapType<OrderDTO>(() => OrderDTOSchema.GetSchema());

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

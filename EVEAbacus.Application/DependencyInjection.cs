using EVEAbacus.Application.Interfaces;
using EVEAbacus.Application.Services;
using EVEAbacus.Application.Services.ManufCalc;
using Microsoft.Extensions.DependencyInjection;

namespace EVEAbacus.Application
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplicationServices(this IServiceCollection services)
        {
            services.AddScoped<IMapService, MapService>();
            services.AddScoped<IMarketService, MarketService>();

            return services;
        }
    }
}
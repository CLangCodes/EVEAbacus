// In EVEAbacus.Infrastructure/Services/ESIClient.cs
using EVEAbacus.Application.Interfaces;
using EVEAbacus.Infrastructure.Services;
using Microsoft.Extensions.Configuration;

public class ESIClient : BaseESIClient
{
    public ESIClient(
        HttpClient httpClient,
        IConfiguration configuration,
        ICacheService cacheService,
        ESIRateLimiter rateLimiter)
        : base(httpClient, configuration, cacheService, rateLimiter)
    {
    }
}
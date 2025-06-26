using Newtonsoft.Json;
using EVEAbacus.Application.Interfaces;
using Microsoft.Extensions.Configuration;

namespace EVEAbacus.Infrastructure.Services
{
    public abstract class BaseESIClient : IESIClient
    {
        protected readonly HttpClient _httpClient;
        protected readonly IConfiguration _configuration;
        protected readonly ICacheService _cacheService;
        protected readonly ESIRateLimiter _rateLimiter;
        protected const string ESI_BASE_URL = "https://esi.evetech.net/latest";
        protected const string USER_AGENT = "EVEAbacus/1.0 (https://eveabacus.com; webmaster@eveabacus.com)";

        protected BaseESIClient(
            HttpClient httpClient,
            IConfiguration configuration,
            ICacheService cacheService,
            ESIRateLimiter rateLimiter)
        {
            _httpClient = httpClient;
            _configuration = configuration;
            _cacheService = cacheService;
            _rateLimiter = rateLimiter;
            
            // Set default headers
            _httpClient.DefaultRequestHeaders.Add("User-Agent", USER_AGENT);
            _httpClient.DefaultRequestHeaders.Add("Accept", "application/json");
        }

        public async Task<T?> GetFromESIAsync<T>(string endpoint, string? cacheKey = null, TimeSpan? cacheTime = null) where T : class
        {
            if (!string.IsNullOrEmpty(cacheKey))
            {
                return await _cacheService.GetOrSetAsync(cacheKey,
                    () => FetchFromESIAsync<T>(endpoint),
                    cacheTime ?? TimeSpan.FromMinutes(5));
            }

            return await FetchFromESIAsync<T>(endpoint);
        }

        private async Task<T?> FetchFromESIAsync<T>(string endpoint) where T : class
        {
            try
            {
                await _rateLimiter.AcquireAsync();
                try
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, $"{ESI_BASE_URL}{endpoint}");
                    var response = await _httpClient.SendAsync(request);

                    // Handle rate limiting headers
                    if (response.Headers.TryGetValues("X-ESI-Error-Limit-Remain", out var errorLimitRemain))
                    {
                        // Log or handle remaining error limit
                    }

                    if (response.Headers.TryGetValues("X-ESI-Error-Limit-Reset", out var errorLimitReset))
                    {
                        // Log or handle error limit reset time
                    }

                    if (!response.IsSuccessStatusCode)
                    {
                        // Log error here
                        return default;
                    }

                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<T>(content);
                }
                finally
                {
                    _rateLimiter.Release();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                // Log exception here
                return default;
            }
        }

        public async Task<T?> GetAuthorizedFromESIAsync<T>(string endpoint, string accessToken, string? cacheKey = null, TimeSpan? cacheTime = null) where T : class
        {
            if (!string.IsNullOrEmpty(cacheKey))
            {
                return await _cacheService.GetOrSetAsync(cacheKey,
                    () => FetchAuthorizedFromESIAsync<T>(endpoint, accessToken),
                    cacheTime ?? TimeSpan.FromMinutes(5));
            }

            return await FetchAuthorizedFromESIAsync<T>(endpoint, accessToken);
        }

        private async Task<T?> FetchAuthorizedFromESIAsync<T>(string endpoint, string accessToken) where T : class
        {
            try
            {
                await _rateLimiter.AcquireAsync();
                try
                {
                    var request = new HttpRequestMessage(HttpMethod.Get, $"{ESI_BASE_URL}/{endpoint}");
                    request.Headers.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Bearer", accessToken);

                    var response = await _httpClient.SendAsync(request);

                    // Handle rate limiting headers
                    if (response.Headers.TryGetValues("X-ESI-Error-Limit-Remain", out var errorLimitRemain))
                    {
                        // Log or handle remaining error limit
                    }

                    if (response.Headers.TryGetValues("X-ESI-Error-Limit-Reset", out var errorLimitReset))
                    {
                        // Log or handle error limit reset time
                    }

                    if (!response.IsSuccessStatusCode)
                    {
                        // Log error here
                        return default;
                    }

                    var content = await response.Content.ReadAsStringAsync();
                    return JsonConvert.DeserializeObject<T>(content);
                }
                finally
                {
                    _rateLimiter.Release();
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Exception: {ex.Message}");
                // Log exception here
                return default;
            }
        }
    }
} 
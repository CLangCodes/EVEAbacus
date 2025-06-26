using System.Net.Http;
using Microsoft.Extensions.Caching.Memory;
using System.Net.Http.Headers;

namespace EVEAbacus.Infrastructure.Services
{
    public class ESIHttpClientHandler : DelegatingHandler
    {
        private readonly IMemoryCache _cache;
        private const int DEFAULT_CACHE_MINUTES = 5;

        public ESIHttpClientHandler(IMemoryCache cache)
        {
            _cache = cache;
        }

        protected override async Task<HttpResponseMessage> SendAsync(HttpRequestMessage request, CancellationToken cancellationToken)
        {
            string cacheKey = request.RequestUri?.ToString() ?? string.Empty;
            Console.WriteLine($"ESIHttpClientHandler: Processing request for {cacheKey}");

            // Check if we have a cached ETag for this URL
            if (_cache.TryGetValue($"{cacheKey}_etag", out string? etag) && !string.IsNullOrEmpty(etag))
            {
                Console.WriteLine($"ESIHttpClientHandler: Found cached ETag for {cacheKey}");
                request.Headers.IfNoneMatch.Add(new EntityTagHeaderValue(etag!));
            }

            var response = await base.SendAsync(request, cancellationToken);
            Console.WriteLine($"ESIHttpClientHandler: Received response with status {response.StatusCode} for {cacheKey}");

            // Handle 304 Not Modified
            if (response.StatusCode == System.Net.HttpStatusCode.NotModified)
            {
                Console.WriteLine($"ESIHttpClientHandler: Using cached response for {cacheKey}");
                var cachedResponse = _cache.Get<HttpResponseMessage>($"{cacheKey}_response");
                if (cachedResponse != null)
                {
                    return cachedResponse;
                }
                // If no cached response, return a new empty response with 304 status
                return new HttpResponseMessage(System.Net.HttpStatusCode.NotModified);
            }

            // Cache successful responses
            if (response.IsSuccessStatusCode)
            {
                var responseEtag = response.Headers.ETag?.Tag;
                if (!string.IsNullOrEmpty(responseEtag))
                {
                    Console.WriteLine($"ESIHttpClientHandler: Caching response with ETag for {cacheKey}");
                    _cache.Set($"{cacheKey}_etag", responseEtag, TimeSpan.FromMinutes(DEFAULT_CACHE_MINUTES));
                    _cache.Set($"{cacheKey}_response", response, TimeSpan.FromMinutes(DEFAULT_CACHE_MINUTES));
                }
            }

            return response;
        }
    }
} 
using EVEAbacus.Application.Interfaces;
using Newtonsoft.Json;
using StackExchange.Redis;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Infrastructure.Services
{
    public class CacheService : ICacheService
    {
        private readonly IDatabase _db;

        public CacheService(IConnectionMultiplexer connection)
        {
            _db = connection.GetDatabase();
        }

        public async Task<T?> GetAsync<T>(string key) where T : class
        {
            var value = await _db.StringGetAsync(key);
            if (value.IsNullOrEmpty) return default;
            return JsonConvert.DeserializeObject<T>(value!);
        }

        public async Task SetAsync<T>(string key, T value, TimeSpan? expiry = null) where T : class
        {
            var json = JsonConvert.SerializeObject(value);
            await _db.StringSetAsync(key, json, expiry);
        }

        public async Task<T?> GetOrSetAsync<T>(string key, Func<Task<T?>> factory, TimeSpan expiration) where T : class
        {
            var cached = await GetAsync<T>(key);
            if (cached != null) return cached;

            var result = await factory();
            if (result != null)
            {
                await SetAsync(key, result, expiration);
            }

            return result;
        }
    }
}

public interface IESIClient
{
    Task<T?> GetFromESIAsync<T>(string endpoint, string? cacheKey = null, TimeSpan? cacheTime = null) where T : class;
    Task<T?> GetAuthorizedFromESIAsync<T>(string endpoint, string accessToken, string? cacheKey = null, TimeSpan? cacheTime = null) where T : class;
}
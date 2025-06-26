using Newtonsoft.Json;

namespace Clean.Domain.Auth
{
    public class OAuthTokenResponse
    {
        [JsonProperty("access_token")]
        public required string AccessToken { get; set; }
        [JsonProperty("expires_in")]
        public int ExpiresIn { get; set; }
        [JsonProperty("refresh_token")]
        public required string RefreshToken { get; set; }
    }
}

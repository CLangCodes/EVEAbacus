namespace Clean.Domain.Auth
{
    public class OAuthExchangeRequest
    {
        public required string Code { get; set; }
        public required string State { get; set; }
    }
}

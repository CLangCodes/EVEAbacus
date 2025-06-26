namespace EVEAbacus.Domain.Models.API.DTO
{
    public class AccessTokenDTO
    {
        public string? AccessToken { get; set; }
        public DateTime? AccessTokenExpiryTime { get; set; }
        public string? RefreshToken { get; set; }
        public DateTime? RefreshTokenExpiryTime { get; set; }
    }
}

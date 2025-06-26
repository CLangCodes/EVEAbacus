using Newtonsoft.Json;

public class ESIVerificationResponse
{
    [JsonProperty("CharacterID")]
    public int CharacterId { get; set; }

    [JsonProperty("CharacterName")]
    public required string CharacterName { get; set; }

    [JsonProperty("ExpiresOn")]
    public DateTime ExpiresOn { get; set; }

    [JsonProperty("Scopes")]
    public required string Scopes { get; set; }

    [JsonProperty("TokenType")]
    public required string TokenType { get; set; }

    [JsonProperty("CharacterOwnerHash")]
    public required string CharacterOwnerHash { get; set; }

    [JsonProperty("IntellectualProperty")]
    public required string IntellectualProperty { get; set; }

    public string? UserId { get; set; }
    //    public User User { get; set; }
}

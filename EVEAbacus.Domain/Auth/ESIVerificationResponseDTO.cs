using Newtonsoft.Json;

public class ESIVerificationResponseDTO
{
    [JsonProperty("CharacterID")]
    public int CharacterId { get; set; }

    [JsonProperty("CharacterName")]
    public string CharacterName { get; set; } = string.Empty;

    [JsonProperty("ExpiresOn")]
    public DateTime ExpiresOn { get; set; }

    [JsonProperty("Scopes")]
    public string Scopes { get; set; } = string.Empty;

    [JsonProperty("TokenType")]
    public string TokenType { get; set; } = string.Empty;

    [JsonProperty("CharacterOwnerHash")]
    public string CharacterOwnerHash { get; set; } = string.Empty;

    [JsonProperty("IntellectualProperty")]
    public string IntellectualProperty { get; set; } = string.Empty;
}

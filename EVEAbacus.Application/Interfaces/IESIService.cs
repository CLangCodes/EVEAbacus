using Clean.Domain.Auth;
using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Market.DTO;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.ESI.Industry;
using System.Security.Claims;

namespace EVEAbacus.Application.Interfaces
{
    public interface IESIService
    {
        string GetAuthorizationUrl();
        Task<OAuthTokenResponse> ExchangeAuthCodeForTokensAsync(OAuthExchangeRequest request);
        Task<OAuthTokenResponse> RefreshAccessToken(string refreshToken);
        Task<ClaimsPrincipal?> ValidateTokenAsync(string token);
        Task<ESIVerificationResponse?> GetCharacterVerificationResponseAsync(string accessToken);
        Task<CharacterAttribute> GetCharacterAttributesAsync(string accessToken, int characterId);
        Task<List<SkillQueue>> GetCharacterSkillQueueAsync(string accessToken, int characterId);
        Task<CharacterSkills> GetCharacterSkillsAsync(string accessToken, int characterId);
        Task<List<BlueprintEntity>> GetCharacterBlueprintsAsync(string accessToken, int characterId);
        Task<List<CharacterStanding>> GetCharacterStandingsAsync(string accessToken, int characterId);
        Task<List<IndustryJob>> GetCharacterIndustryJobsAsync(string accessToken, int characterId);
        Task<List<CharacterMiningLedger>> GetCharacterMiningLedgerAsync(string accessToken, int characterId);
        Task<CharacterEntity?> GetPublicCharacterInfo(string accessToken);
        Task<List<int>> GetRouteAsync(int originSystemId, int destinationSystemId, string? flag);
        Task<int?> GetNumberOfJumpsAsync(int originSystemId, int destinationSystemId, string? flag);
        Task<List<MarketRegionHistory>> GetMarketRegionHistoriesAsync(int[] regionIds, int typeId);
        Task<List<MarketOrder>> GetMarketOrdersAsync(int regionId, string? orderType, int? typeId, int? page);
    }
}

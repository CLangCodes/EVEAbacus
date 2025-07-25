using Clean.Domain.Auth;
using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Extensions.Character;
using EVEAbacus.Domain.Extensions.Industry;
using EVEAbacus.Domain.Extensions.Market;
using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Character.DTO;
using EVEAbacus.Domain.Models.ESI.Industry;
using EVEAbacus.Domain.Models.ESI.Industry.DTO;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.ESI.Market.DTO;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using Newtonsoft.Json;
using System;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Text;
using MarketOrder = EVEAbacus.Domain.Models.ESI.Market.MarketOrder;

namespace EVEAbacus.Infrastructure.Services
{
    public class ESIService : IESIService
    {
        private readonly IConfiguration _configuration;
        private readonly HttpClient _httpClient;
        private readonly ISDERepository _sDERepository;
        private readonly IOrderService _orderService;
        private readonly ICacheService _cacheService;
        private readonly MemoryCache _cache = new(new MemoryCacheOptions());
        private readonly IESIClient _eSIClient;

        public int[] MarketHubRegionIds { get; set; } =
                    [10000002,
                    10000043,
                    10000030,
                    10000032,
                    10000042];
        readonly List<string> _scopes =
                [
                "publicData",
                "esi-skills.read_skills.v1",
                "esi-skills.read_skillqueue.v1",
                "esi-characters.read_blueprints.v1",
                "esi-characters.read_standings.v1",
                "esi-industry.read_character_jobs.v1",
                "esi-industry.read_character_mining.v1",
                ];

        private const string Issuer = "https://login.eveonline.com";
        private const string esiBase = "https://esi.evetech.net/latest";
        private const string JwksUrl = "https://login.eveonline.com/oauth/jwks";

        public ESIService
            (
                IConfiguration configuration,
                HttpClient httpClient,
                ISDERepository sDERepository,
                ICacheService cacheService,
                IESIClient eSIClient,
                IOrderService orderService
            )
        {
            _configuration = configuration;
            _httpClient = httpClient;
            _sDERepository = sDERepository;
            _cacheService = cacheService;
            _eSIClient = eSIClient;
            _orderService = orderService;
        }

        string IESIService.GetAuthorizationUrl()
        {
#if !RELEASE
            var _clientId = _configuration["ESISettingsDev:ClientId"];
            var _redirectUri = _configuration["ESISettingsDev:CallbackUrl"];
#else
            var _clientId = _configuration["ESISettings:ClientId"];
            var _redirectUri = _configuration["ESISettings:CallbackUrl"];
#endif

            if (string.IsNullOrEmpty(_clientId) || string.IsNullOrEmpty(_redirectUri))
            {
                throw new InvalidOperationException("ESI configuration is missing required values");
            }

            Debug.WriteLine($"LogScopes: {Uri.EscapeDataString(string.Join(" ", _scopes))}");
            string authorizationUrl = $"https://login.eveonline.com/v2/oauth/authorize/?" +
                                   $"response_type=code&client_id={_clientId}&redirect_uri={Uri.EscapeDataString(_redirectUri)}&scope={Uri.EscapeDataString(string.Join(" ", _scopes))}";
            Debug.WriteLine($"Returning {authorizationUrl}");
            return authorizationUrl;
        }

        async Task<OAuthTokenResponse?> IESIService.ExchangeAuthCodeForTokensAsync(OAuthExchangeRequest oAuthExchangeRequest)
        {
#if !RELEASE
            
            var _clientId = _configuration["ESISettingsDev:ClientId"];
            var _clientSecret = _configuration["ESISettingsDev:SecretKey"];
            var _redirectUri = _configuration["ESISettingsDev:CallbackUrl"];
#else
            var _clientId = _configuration["ESISettings:ClientId"];
            var _clientSecret = _configuration["ESISettings:SecretKey"];
            var _redirectUri = _configuration["ESISettings:CallbackUrl"];
#endif

            var request = new HttpRequestMessage(HttpMethod.Post, "https://login.eveonline.com/v2/oauth/token");
            var authHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "authorization_code"),
                new KeyValuePair<string, string>("code", oAuthExchangeRequest.Code),
            });
            request.Content = content;

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<OAuthTokenResponse>(responseContent);

            var principal = await ((IESIService)this).ValidateTokenAsync(tokenResponse?.AccessToken ?? "");
            if (principal == null)
            {
                return null;
            }

            return tokenResponse;
        }

        async Task<OAuthTokenResponse?> IESIService.RefreshAccessToken(string refreshToken)
        {
            //var clientId = _configuration["ESISettings:ClientId"];
            //var clientSecret = _configuration["ESISettings:SecretKey"];

#if !RELEASE
            var _clientId = _configuration["ESISettingsDev:ClientId"];
            var _clientSecret = _configuration["ESISettingsDev:SecretKey"];
            //var _redirectUri = _configuration["ESISettingsDev:CallbackUrl"];
#else
            var _clientId = _configuration["ESISettings:ClientId"];
            var _clientSecret = _configuration["ESISettings:SecretKey"];
            //var _redirectUri = _configuration["ESISettings:CallbackUrl"];
#endif

            //var _scopes = "publicData";
            var _scopesString = string.Join(" ", _scopes);

            var request = new HttpRequestMessage(HttpMethod.Post,
                "https://login.eveonline.com/v2/oauth/token");

            var authHeader = Convert.ToBase64String(System.Text.Encoding.UTF8.GetBytes($"{_clientId} : {_clientSecret}"));
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", authHeader);

            var content = new FormUrlEncodedContent(new[]
            {
                new KeyValuePair<string, string>("grant_type", "refresh_token"),
                new KeyValuePair<string, string>("refresh_token", refreshToken),
                new KeyValuePair<string, string>("scopes", _scopesString),
            });
            request.Content = content;

            var response = await _httpClient.SendAsync(request);
            if (!response.IsSuccessStatusCode)
            {
                return null;
            }

            var responseContent = await response.Content.ReadAsStringAsync();
            var tokenResponse = JsonConvert.DeserializeObject<OAuthTokenResponse>(responseContent);

            var principal = await ((IESIService)this).ValidateTokenAsync(tokenResponse?.AccessToken ?? "");
            if (principal == null)
            {
                return null;
            }
            
            return tokenResponse;
        }

        async Task<ESIVerificationResponse?> IESIService.GetCharacterVerificationResponseAsync(string accessToken)
        {
            var verificationResponse = new ESIVerificationResponse
            {
                CharacterName = string.Empty,
                Scopes = string.Empty,
                TokenType = string.Empty,
                CharacterOwnerHash = string.Empty,
                IntellectualProperty = string.Empty
            };

            try
            {
                var request = new HttpRequestMessage(HttpMethod.Get, "https://esi.evetech.net/verify");
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", accessToken);

                var response = await _httpClient.SendAsync(request);
                if (!response.IsSuccessStatusCode)
                {
                    Console.WriteLine($"Failed to verify token: {response.StatusCode}");
                    return verificationResponse;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                var verifiedData = JsonConvert.DeserializeObject<ESIVerificationResponse>(responseContent);

                if (verifiedData != null && verifiedData.CharacterId > 0)
                {
                    verificationResponse = verifiedData;
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching character IDs: {ex.Message}");
            }

            return verificationResponse;
        }

        async Task<ClaimsPrincipal?> IESIService.ValidateTokenAsync(string token)
        {
#if !RELEASE
            var _clientId = _configuration["ESISettingsDev:ClientId"];
#else
            var _clientId = _configuration["ESISettings:ClientId"];
#endif

            try
            {
                var handler = new JwtSecurityTokenHandler();
                var jwt = handler.ReadJwtToken(token);
                var keys = await GetSigningKeysAsync();

                var validationParams = new TokenValidationParameters
                {
                    ValidateIssuer = true,
                    ValidIssuers = new[] { Issuer, "login.eveonline.com" }, // Handle both formats
                    ValidateAudience = true,
                    ValidAudiences = new[] { _clientId, "EVE Online" }, // Must contain both client_id & "EVE Online"
                    ValidateLifetime = true,
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKeys = keys
                };

                var principal = handler.ValidateToken(token, validationParams, out _);
                return principal;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Token validation failed: {ex.Message}");
                return null;
            }
        }

        private static async Task<IEnumerable<SecurityKey>> GetSigningKeysAsync()
        {
            using var httpClient = new HttpClient();
            var response = await httpClient.GetStringAsync(JwksUrl);
            var jsonWebKeySet = new JsonWebKeySet(response);

            return jsonWebKeySet.Keys.Cast<SecurityKey>();
        }

        async Task<CharacterAttribute?> IESIService.GetCharacterAttributesAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/attributes/?datasource=tranquility";
                string cacheKey = $"character_attributes_{characterId}";

                var characterAttributeDTO = await _eSIClient.GetAuthorizedFromESIAsync<CharacterAttributeDTO>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                if (characterAttributeDTO == null)
                {
                    return null;
                }
                var characterAttribute = characterAttributeDTO.ToCharacterAttribute();
                return characterAttribute;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character attributes: {ex.Message}");
                return null;
            }
        }
        
        async Task<List<SkillQueue>?> IESIService.GetCharacterSkillQueueAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/skillqueue/?datasource=tranquility";
                string cacheKey = $"character_skillqueue_{characterId}";

                var skillQueueDTOs = await _eSIClient.GetAuthorizedFromESIAsync<List<SkillQueueDTO>>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var skillQueue = skillQueueDTOs?.ToSkillQueues() ?? [];
                return skillQueue.ToList();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character skill queue: {ex.Message}");
                return null;
            }
        }

        async Task<CharacterSkills?> IESIService.GetCharacterSkillsAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/skills/?datasource=tranquility";
                string cacheKey = $"character_skills_{characterId}";

                var characterSkillsDTO = await _eSIClient.GetAuthorizedFromESIAsync<CharacterSkillsDTO>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var characterSkills = characterSkillsDTO?.ToCharacterSkills();

                if (characterSkills != null)
                {
                    foreach (var skill in characterSkills.Skills)
                    {
                        var skillItem = await _sDERepository.GetItemAsync(skill.SkillId);
                        if (skillItem != null)
                        {
                            skill.SkillProperty = skillItem;
                        }
                    }
                    return characterSkills;
                }
                return null;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character skills: {ex.Message}");
                return null;
            }
        }

        async Task<List<BlueprintEntity>?> IESIService.GetCharacterBlueprintsAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/blueprints/?datasource=tranquility";
                string cacheKey = $"character_blueprints_{characterId}";

                var blueprintsDTO = await _eSIClient.GetAuthorizedFromESIAsync<List<BlueprintEntityDTO>>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var blueprints = blueprintsDTO?.ToBlueprintEntities() ?? [];
                return blueprints.ToList();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character blueprints: {ex.Message}");
                return null;
            }
        }

        async Task<List<CharacterStanding>?> IESIService.GetCharacterStandingsAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/standings/?datasource=tranquility";
                string cacheKey = $"character_standings_{characterId}";

                var standingsDTO = await _eSIClient.GetAuthorizedFromESIAsync<List<CharacterStandingDTO>>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var standings = standingsDTO?.ToCharacterStandings() ?? [];
                return standings.ToList();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character standings: {ex.Message}");
                return null;
            }
        }

        async Task<List<IndustryJob>?> IESIService.GetCharacterIndustryJobsAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/industry/jobs/?datasource=tranquility";
                string cacheKey = $"character_industry_jobs_{characterId}";

                var industryJobsDTO = await _eSIClient.GetAuthorizedFromESIAsync<List<IndustryJobDTO>>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var industryJobs = industryJobsDTO?.ToIndustryJobs() ?? [];
                return industryJobs.ToList();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character industry jobs: {ex.Message}");
                return null;
            }
        }
        
        async Task<List<CharacterMiningLedger>?> IESIService.GetCharacterMiningLedgerAsync(string accessToken, int characterId)
        {
            try
            {
                var endpoint = $"/characters/{characterId}/mining/?datasource=tranquility";
                string cacheKey = $"character_mining_ledger_{characterId}";

                var miningLedgerDTOs = await _eSIClient.GetAuthorizedFromESIAsync<List<CharacterMiningLedgerDTO>>(endpoint, accessToken, cacheKey, TimeSpan.FromMinutes(5));
                var miningLedgers = miningLedgerDTOs?.ToCharacterMiningLedgers() ?? [];
                return miningLedgers.ToList();
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching character mining ledger: {ex.Message}");
                return null;
            }
        }

        async Task<CharacterEntity?> IESIService.GetPublicCharacterInfo(string accessToken)
        {
            try
            {
                var verificationResponse = await ((IESIService)this).GetCharacterVerificationResponseAsync(accessToken);
                if (verificationResponse == null)
                {
                    return null;
                }

                var endpoint = $"/characters/{verificationResponse.CharacterId}/?datasource=tranquility";
                string cacheKey = $"character_info_{verificationResponse.CharacterId}";

                var characterDTO = await _eSIClient.GetFromESIAsync<CharacterDTO>(endpoint, cacheKey, TimeSpan.FromMinutes(5));
                if (characterDTO != null)
                {
                    int characterId = verificationResponse.CharacterId;
                    string characterName = verificationResponse.CharacterName;
                    var character = characterDTO.ToCharacter(characterId, characterName);

                    return character;
                }
                return null;
            }
            catch (Exception ex)
            {
                Debug.WriteLine($"Error fetching public character info: {ex.Message}");
                return null;
            }
        }

        async Task<List<int>?> IESIService.GetRouteAsync(int originSystemId, int destinationSystemId, string? flag)
        {
            try
            {
                flag ??= "shortest"; // Changed from "safe" to "shortest" to match frontend expectation
                string endpoint = $"/route/{originSystemId}/{destinationSystemId}/?datasource=tranquility&flag={flag}";
                string cacheKey = $"route_{originSystemId}_{destinationSystemId}_{flag}";

                Console.WriteLine($"ESI Route request: {endpoint}");
                var route = await _eSIClient.GetFromESIAsync<List<int>>(endpoint, cacheKey, TimeSpan.FromMinutes(5));
                
                if (route == null)
                {
                    Console.WriteLine($"ESI Route returned null for {originSystemId} -> {destinationSystemId}");
                    return new List<int>();
                }
                
                Console.WriteLine($"ESI Route returned {route.Count} systems: [{string.Join(", ", route)}]");
                return route;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching system route: {ex.Message}");
                Console.WriteLine($"Stack trace: {ex.StackTrace}");
                return null;
            }
        }

        async Task<int?> IESIService.GetNumberOfJumpsAsync(int originSystemId, int destinationSystemId, string? flag)
        {
            try
            {
                flag ??= "shortest"; // Changed from "safe" to "shortest" to match frontend expectation
                string endpoint = $"/route/{originSystemId}/{destinationSystemId}/?datasource=tranquility&flag={flag}";
                
                string cacheKey = $"jumps_{originSystemId}_{destinationSystemId}_{flag}";
                var jumps = await GetIntFromESIAsync(endpoint, cacheKey, TimeSpan.FromMinutes(5));
                return jumps.HasValue ? jumps.Value - 1 : null;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching system route: {ex.Message}");
                return null;
            }
        }

        async Task<List<MarketRegionHistory>?> IESIService.GetMarketRegionHistoriesAsync(int[] regionIds, int typeId)
        {
            try {
                List<MarketRegionHistory> marketRegionHistories = new List<MarketRegionHistory>();

                foreach (var regionId in regionIds)
                {
                    string endpoint = $"/markets/{regionId}/history/?datasource=tranquility&type_id={typeId}";
                    string cacheKey = $"market_history_{regionId}_{typeId}";

                    var marketRegionHistory = await _eSIClient.GetFromESIAsync<MarketRegionHistory>(endpoint, cacheKey, TimeSpan.FromMinutes(5));

                    if (marketRegionHistory != null) { marketRegionHistories.Add(marketRegionHistory); }
                }

                return marketRegionHistories;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching market region histories: {ex.Message}");
                return null;
            }
        }

        async Task<List<MarketOrder>?> IESIService.GetMarketOrdersAsync(int regionId, string? orderType, int? typeId, int? page)
        {
            try
            {
                orderType = string.IsNullOrEmpty(orderType) ? "all" : orderType.ToLowerInvariant();
                page ??= 1;

                var uri = new StringBuilder($"/markets/{regionId}/orders/?datasource=tranquility");
                uri.Append($"&order_type={orderType}&page={page}");
                if (typeId.HasValue)
                    uri.Append($"&type_id={typeId}");

                string endpoint = uri.ToString();
                string cacheKey = $"market_orders_{regionId}_{orderType}_{typeId}_{page}";

                var marketOrderDTOs = await _eSIClient.GetFromESIAsync<List<MarketOrderDTO>>(endpoint, cacheKey, TimeSpan.FromMinutes(5));
                
                var marketOrders = marketOrderDTOs?.ToMarketOrders(regionId) ?? [];
                
                return marketOrders.ToList();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching market orders: {ex.Message}");
                return null;
            }
        }

        private async Task<int?> GetIntFromESIAsync(string endpoint, string cacheKey, TimeSpan? cacheTime = null)
        {
            try
            {
                var response = await _eSIClient.GetFromESIAsync<List<int>>(endpoint, cacheKey, cacheTime);
                return response?.FirstOrDefault();
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error fetching integer from ESI: {ex.Message}");
                return null;
            }
        }
    }
}

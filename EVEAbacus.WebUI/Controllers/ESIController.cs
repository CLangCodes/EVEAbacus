using Clean.Domain.Auth;
using Microsoft.AspNetCore.Mvc;
using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.ESI.Market.DTO;

namespace EVEAbacus.WebUI.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class ESIController : ControllerBase
    {
        private readonly IESIService _esiService;
        private readonly IMarketService _marketService;
        private readonly ICharacterService _characterService;
        private string? _returnUrl;

        public ESIController(IESIService esiService, 
            ICharacterService characterService, IMarketService marketService)
        {
            _esiService = esiService;
            _characterService = characterService;
            _marketService = marketService;
        }

        [HttpGet("AuthRequest")]
        public IActionResult AuthRequest(string returnUrl)
        {
            if (!string.IsNullOrEmpty(returnUrl) && returnUrl.StartsWith("http://"))
            {
                returnUrl = "https://" + returnUrl.Substring(7);
            }
            _returnUrl = returnUrl;
            var authorizationUrl = _esiService.GetAuthorizationUrl() + $"&state={Uri.EscapeDataString(returnUrl)}";
            return Redirect(authorizationUrl);
        }

        [HttpGet("Callback")]
        public async Task<IActionResult> Callback(string code, string state)
        {
            if (string.IsNullOrEmpty(code))
            {
                return BadRequest("Authorization code is missing.");
            }

            var tokenResponse = await _esiService.ExchangeAuthCodeForTokensAsync(new OAuthExchangeRequest() { Code = code, State = state });
            if (tokenResponse == null)
            {
                return StatusCode(500, "Token exchange failed.");
            }

            //bool stored = await _userCommandService.StoreOAuthTokensAsync(tokenResponse);
            //if (!stored)
            //{
            //    return StatusCode(500, "Failed to store tokens.");
            //}
            return Redirect($"/post-login?redirectUrl={Uri.EscapeDataString(state)}");
        }

        [HttpGet("RefreshToken")]
        public async Task<IActionResult> RefreshAccessToken(string refreshToken, string returnUrl)
        {
            if (string.IsNullOrEmpty(refreshToken))
            {
                return BadRequest("Refresh token is missing.");
            }

            var tokenResponse = await _esiService.RefreshAccessToken(refreshToken); if (tokenResponse == null)
            {
                return StatusCode(500, "Token exchange failed.");
            }

            //bool storedOAuthTokens = await _userCommandService.StoreOAuthTokensAsync(tokenResponse);
            //if (!storedOAuthTokens)
            //{
            //    return StatusCode(500, "Failed to store tokens.");
            //}
            
            returnUrl = string.IsNullOrEmpty(returnUrl) ? "/" : Uri.UnescapeDataString(returnUrl);

            return Redirect(returnUrl);
        }
        [HttpGet("route/{originId}/{destinationId}")]
        public async Task<ActionResult<List<int>>> GetRoute(int originId, int destinationId, string? flag = "shortest")
        {
            try
            {
                var route = await _esiService.GetRouteAsync(originId, destinationId, flag);
                
                if (route == null || route.Count == 0)
                {
                    // No route found between the systems
                    return Ok(new List<int>());
                }
                
                // Return the array of system IDs representing the route
                return Ok(route);
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error getting route between {originId} and {destinationId}: {ex.Message}");
                return StatusCode(500, new List<int>());
            }
        }
    }
}

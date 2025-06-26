using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.API.Requests;
using EVEAbacus.Domain.Models.API.DTO;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;
using System.Collections.Generic;
using System.Threading.Tasks;
using System.Linq;

namespace EVEAbacus.WebUI.Controllers
{
    /// <summary>
    /// Controller for EVE Online map and planetary search endpoints
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class MapController : ControllerBase
    {
        private readonly IMapService _mapService;

        public MapController(IMapService mapService)
        {
            _mapService = mapService;
        }

        /// <summary>
        /// Searches for EVE Online solar system names for autocomplete functionality
        /// </summary>
        [SwaggerOperation(
            Summary = "Searches for EVE Online solar system names",
            Description = "Returns a list of solar system names matching the search term for autocomplete functionality. If no search term is provided, returns all system names."
        )]
        [HttpGet("SearchSolarSystems")]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<IEnumerable<string>>> SearchSolarSystems(
            [FromQuery, SwaggerParameter(Description = "Optional search term for solar system names")] string? searchTerm = null)
        {
            var results = string.IsNullOrWhiteSpace(searchTerm)
                ? await _mapService.SearchSolarSystemNamesAsync()
                : await _mapService.SearchSolarSystemNamesAsync(searchTerm);

            if (results == null || results.Length == 0)
                return NotFound("No matching solar systems found.");

            return Ok(results);
        }

        /// <summary>
        /// Gets the available planet types for filter selection
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the available planet types",
            Description = "Returns a list of all planet types that can be used for filtering planetary search results."
        )]
        [HttpGet("PlanetTypes")]
        [ProducesResponseType(typeof(IEnumerable<string>), StatusCodes.Status200OK)]
        public ActionResult<IEnumerable<string>> GetPlanetTypes()
        {
            var types = _mapService.GetPlanetTypeArray();
            return Ok(types);
        }

        /// <summary>
        /// Gets planets based on filters for Planetary Interaction planning
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets planets based on filters",
            Description = "Returns a paginated list of planets matching the specified criteria for Planetary Interaction planning."
        )]
        [HttpPost("Planets")]
        [ProducesResponseType(typeof(PaginatedResponse<PlanetDTO>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<PaginatedResponse<PlanetDTO>>> GetPlanets(
            [FromBody] PIPlannerRequest request)
        {
            if (string.IsNullOrEmpty(request.FocalSystemName) || request.Range < 0)
                return BadRequest("Focal system name is required and range must be non-negative.");

            // Validate pagination parameters
            if (request.PageNumber < 1)
                request.PageNumber = 1;
            if (request.PageSize < 1 || request.PageSize > 100)
                request.PageSize = 25;

            // First check if the focal system exists
            var focalSystemId = await _mapService.GetSolarSystemId(request.FocalSystemName);
            if (focalSystemId == null)
                return NotFound($"Solar system '{request.FocalSystemName}' not found.");

            var planets = await _mapService.SelectPlanetsAsync(
                request.FocalSystemName, 
                request.Range, 
                request.SecurityStatus, 
                request.PlanetTypes);

            // If we get here, the focal system exists, so return 200 with results (even if empty)
            var planetDTOs = planets.Select(p => new PlanetDTO
            {
                Name = p.Name?.ItemName ?? string.Empty,
                SolarSystem = p.SolarSystem?.SolarSystemName ?? string.Empty,
                Constellation = p.Constellation?.ConstellationName ?? string.Empty,
                Region = p.Region?.RegionName ?? string.Empty,
                PlanetType = p.Item?.TypeName ?? string.Empty,
                Security = p.Security,
                Radius = p.Radius,
                MinLinkPowerGrid = p.MinLinkPowerGrid,
                MinLinkCPU = p.MinLinkCPU
            });

            // Apply pagination
            var totalCount = planetDTOs.Count();
            var totalPages = (int)Math.Ceiling((double)totalCount / request.PageSize);
            var pagedItems = planetDTOs
                .Skip((request.PageNumber - 1) * request.PageSize)
                .Take(request.PageSize)
                .ToList();

            var response = new PaginatedResponse<PlanetDTO>
            {
                Items = pagedItems,
                TotalCount = totalCount,
                PageNumber = request.PageNumber,
                PageSize = request.PageSize,
                TotalPages = totalPages,
                HasPreviousPage = request.PageNumber > 1,
                HasNextPage = request.PageNumber < totalPages
            };

            return Ok(response);
        }
    }
}

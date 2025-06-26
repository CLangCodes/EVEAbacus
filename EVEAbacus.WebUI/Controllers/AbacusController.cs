using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.API.Requests;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.Map;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace EVEAbacus.WebUI.Controllers
{
    /// <summary>
    /// Controller for EVE Online manufacturing and production calculations
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class AbacusController : ControllerBase
    {
        private readonly CalculatorService _calculatorService;
        private readonly IOrderService _orderService;
        private readonly IMapService _mapService;

        public AbacusController(CalculatorService calculatorService, IOrderService orderService, IMapService mapService)
        {
            _calculatorService = calculatorService;
            _orderService = orderService;
            _mapService = mapService;
        }

        /// <summary>
        /// Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis
        /// </summary>
        [SwaggerOperation(
            Summary = "Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis",
            Description = "Processes blueprint manufacturing orders and returns detailed analysis including materials, costs, and market data."
        )]
        [HttpPost("ManufBatch")]
        [ProducesResponseType(typeof(ManufBatch), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<ManufBatch>> GetManufacturingBatch(
            [FromBody] ManufacturingBatchRequest request)
        {
            if (request.OrderDTOs == null || !request.OrderDTOs.Any())
            {
                return BadRequest("No orders provided.");
            }

            var orders = await _orderService.OrderDTOsToOrders(request.OrderDTOs);
            var manufBatch = await _calculatorService.GetManufacturingBatch(orders, request.StationIds);

            if (manufBatch == null)
            {
                return NotFound();
            }

            return Ok(manufBatch);
        }

        /// <summary>
        /// Returns a list of blueprints suitable for invention based on character's Research and Development skills
        /// </summary>
        [SwaggerOperation(
            Summary = "Returns a list of blueprints suitable for invention based on character's R&D skills",
            Description = "Analyzes the provided R&D skill IDs and returns a list of blueprints that can be used for invention with those skills."
        )]
        [HttpPost("InventionSuggestion")]
        [ProducesResponseType(typeof(Dictionary<int, string>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Dictionary<int, string>>> GetInventionSuggestion(
            [FromQuery, SwaggerParameter(Description = "Array of EVE Online R&D skill IDs")] string[] skillIds)
        {
            if (skillIds == null || !skillIds.Any()) 
                return BadRequest("At least one R&D skill ID is required.");
            
            var suggestions = await _calculatorService.InventionSuggestions(skillIds);
            if (suggestions == null) 
                return NotFound("No suitable blueprints found for the given skill combination.");
            
            return Ok(suggestions);
        }

        /// <summary>
        /// Finds planets suitable for Planetary Interaction (PI) within a specified range of a focal system
        /// </summary>
        [SwaggerOperation(
            Summary = "Finds planets suitable for Planetary Interaction (PI)",
            Description = "Returns a list of planets within the specified range of a focal system, with optional filtering by security status and planet type."
        )]
        [HttpPost("PIPlanner")]
        [ProducesResponseType(typeof(Denormalize[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Denormalize[]>> GetPIPlanner(
            [FromQuery, SwaggerParameter(
                Description = "Name of the EVE Online solar system to use as the center point",
                Required = true
            )] string focalSystemName,
            
            [FromQuery, SwaggerParameter(
                Description = "Number of jumps from the focal system to search (1-10)",
                Required = true
            )] int range,
            
            [FromQuery, SwaggerParameter(
                Description = "Array of security status filters (e.g., ['highsec', 'lowsec', 'nullsec'])"
            )] string[]? securityStatus = null,
            
            [FromQuery, SwaggerParameter(
                Description = "Array of planet types to filter by (e.g., ['Barren', 'Gas', 'Ice', 'Lava', 'Oceanic', 'Plasma', 'Storm', 'Temperate'])"
            )] string[]? planetTypes = null)
        {
            if (string.IsNullOrEmpty(focalSystemName) || range < 0) 
                return BadRequest("Focal system name is required and range must be non-negative.");

            var planets = await _mapService.SelectPlanetsAsync(focalSystemName, range, securityStatus, planetTypes);
            if (planets == null) 
                return NotFound("No planets found matching the specified criteria.");

            return Ok(planets);
        }
    }
}

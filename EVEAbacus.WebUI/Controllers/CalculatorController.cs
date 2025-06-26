using EVEAbacus.Application.Interfaces;
using EVEAbacus.Application.Services;
using EVEAbacus.Domain.Models.API.Requests;
using EVEAbacus.Domain.Models.Calculator;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Swashbuckle.AspNetCore.Annotations;

namespace EVEAbacus.WebUI.Controllers
{
    /// <summary>
    /// Controller for EVE Online manufacturing calculator operations
    /// </summary>
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public class CalculatorController : ControllerBase
    {
        private readonly CalculatorService _calculatorService;
        private readonly IOrderService _orderService;

        public CalculatorController(CalculatorService calculatorService, IOrderService orderService)
        {
            _calculatorService = calculatorService;
            _orderService = orderService;
        }

        /// <summary>
        /// Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis
        /// </summary>
        [SwaggerOperation(
            Summary = "Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis",
            Description = "Processes blueprint manufacturing orders and returns detailed analysis including materials, costs, and market data."
        )]
        [HttpPost("manufacturing-batch")]
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
                return NotFound("Failed to calculate manufacturing batch");
            }

            return Ok(manufBatch);
        }

        /// <summary>
        /// Searches for blueprints by name for autocomplete functionality
        /// </summary>
        [SwaggerOperation(
            Summary = "Searches for blueprints by name",
            Description = "Performs a search across all blueprints and returns matching names for autocomplete functionality. Used for blueprint selection in manufacturing orders."
        )]
        [HttpGet("search-blueprints")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string[]>> SearchBlueprints(
            [FromQuery, SwaggerParameter(
                Description = "Search term for blueprint names (minimum 2 characters recommended)",
                Required = true
            )] string searchTerm)
        {
            if (string.IsNullOrWhiteSpace(searchTerm))
            {
                return BadRequest("Search term is required");
            }

            if (searchTerm.Length < 2)
            {
                return BadRequest("Search term must be at least 2 characters long");
            }

            try
            {
                var results = await _calculatorService.SearchBlueprintNamesAsync(searchTerm);
                
                if (results == null || !results.Any())
                {
                    return NotFound("No blueprints found matching the search term");
                }

                return Ok(results);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while searching blueprints: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets the blueprint TypeID by its exact name
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the blueprint TypeID by its exact name",
            Description = "Retrieves the TypeID of a blueprint using its exact name. Used for validation when a user selects a blueprint from the autocomplete list."
        )]
        [HttpGet("blueprint-type-id")]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> GetBlueprintTypeId(
            [FromQuery, SwaggerParameter(
                Description = "Exact name of the blueprint (case-sensitive)",
                Required = true
            )] string blueprintName)
        {
            if (string.IsNullOrWhiteSpace(blueprintName))
            {
                return BadRequest("Blueprint name is required");
            }

            try
            {
                var typeId = await _calculatorService.GetBlueprintTypeIdbyNameAsync(blueprintName);
                
                if (typeId == null)
                {
                    return NotFound($"Blueprint '{blueprintName}' not found");
                }

                return Ok(typeId.Value);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving blueprint TypeID: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets the product TypeID that a blueprint produces for a specific activity
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the product TypeID that a blueprint produces",
            Description = "Retrieves the TypeID of the product manufactured by a blueprint for the specified activity. Used to determine what item will be produced."
        )]
        [HttpGet("product-type-id")]
        [ProducesResponseType(typeof(int), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<int>> GetProductTypeId(
            [FromQuery, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int blueprintTypeId,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention, etc.)",
                Required = true
            )] byte activityId)
        {
            if (blueprintTypeId <= 0)
            {
                return BadRequest("Blueprint TypeID must be greater than 0");
            }

            try
            {
                var productTypeId = await _calculatorService.GetProductIdbyBPTypeId(blueprintTypeId, activityId);
                
                if (productTypeId == null)
                {
                    return NotFound($"No product found for blueprint TypeID {blueprintTypeId} with activity {activityId}");
                }

                return Ok(productTypeId.Value);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving product TypeID: {ex.Message}");
            }
        }

        /// <summary>
        /// Validates a blueprint name and returns both blueprint and product TypeIDs
        /// </summary>
        [SwaggerOperation(
            Summary = "Validates a blueprint name and returns blueprint and product TypeIDs",
            Description = "Combines blueprint validation and product lookup in a single call. Returns both the blueprint TypeID and the product TypeID for the specified activity."
        )]
        [HttpGet("validate-blueprint")]
        [ProducesResponseType(typeof(object), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<object>> ValidateBlueprint(
            [FromQuery, SwaggerParameter(
                Description = "Exact name of the blueprint (case-sensitive)",
                Required = true
            )] string blueprintName,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention, etc.)",
                Required = true
            )] byte activityId)
        {
            if (string.IsNullOrWhiteSpace(blueprintName))
            {
                return BadRequest("Blueprint name is required");
            }

            try
            {
                var blueprintTypeId = await _calculatorService.GetBlueprintTypeIdbyNameAsync(blueprintName);
                
                if (blueprintTypeId == null)
                {
                    return NotFound($"Blueprint '{blueprintName}' not found");
                }

                var productTypeId = await _calculatorService.GetProductIdbyBPTypeId(blueprintTypeId.Value, activityId);
                
                if (productTypeId == null)
                {
                    return NotFound($"No product found for blueprint '{blueprintName}' with activity {activityId}");
                }

                return Ok(new
                {
                    BlueprintName = blueprintName,
                    BlueprintTypeId = blueprintTypeId.Value,
                    ProductTypeId = productTypeId.Value,
                    ActivityId = activityId
                });
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(ex.Message);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while validating blueprint: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a list of available market hub names
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets a list of available market hub names",
            Description = "Returns a list of market hub station names that can be used for market analysis and price calculations."
        )]
        [HttpGet("market-hubs")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string[]>> GetMarketHubs()
        {
            try
            {
                var marketHubs = await _calculatorService.GetMarketHubStringArrayAsync();
                
                if (marketHubs == null || !marketHubs.Any())
                {
                    return NotFound("No market hubs found");
                }

                return Ok(marketHubs);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving market hubs: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets a list of invention skills available in EVE Online
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets a list of invention skills",
            Description = "Returns a list of R&D skills that can be used for blueprint invention calculations."
        )]
        [HttpGet("invention-skills")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status500InternalServerError)]
        public async Task<ActionResult<string[]>> GetInventionSkills()
        {
            try
            {
                var inventionSkills = await _calculatorService.GetInventionSkillsAsync();
                
                if (inventionSkills == null || !inventionSkills.Any())
                {
                    return NotFound("No invention skills found");
                }

                return Ok(inventionSkills);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving invention skills: {ex.Message}");
            }
        }

        /// <summary>
        /// Gets invention suggestions based on provided skill names
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets invention suggestions based on skills",
            Description = "Analyzes the provided invention skill names and returns a list of blueprints suitable for invention with those skills. Requires at least 3 skills to be provided."
        )]
        [HttpPost("invention-suggestions")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status400BadRequest)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string[]>> GetInventionSuggestions(
            [FromBody, SwaggerParameter(
                Description = "Array of at least 3 invention skill names",
                Required = true
            )] string[] inventionSkills)
        {
            if (inventionSkills == null || inventionSkills.Length < 3)
            {
                return BadRequest("At least 3 invention skills are required");
            }

            // Validate that all items are strings
            if (!inventionSkills.All(skill => !string.IsNullOrWhiteSpace(skill)))
            {
                return BadRequest("All invention skills must be non-empty strings");
            }

            try
            {
                var suggestions = await _calculatorService.InventionSuggestions(inventionSkills);
                
                if (suggestions == null || !suggestions.Any())
                {
                    return NotFound("No suitable blueprints found for the given skill combination");
                }

                return Ok(suggestions);
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, $"An error occurred while retrieving invention suggestions: {ex.Message}");
            }
        }
    }
}

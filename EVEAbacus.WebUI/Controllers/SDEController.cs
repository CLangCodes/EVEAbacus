using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;
using System.Threading.Tasks;

namespace EVEAbacus.WebUI.Controllers
{
    /// <summary>
    /// Controller for accessing EVE Online Static Data Export (SDE) information
    /// </summary>
    [ApiVersion("1.0")]
    [Route("api/v{version:apiVersion}/[controller]")]
    [ApiController]
    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)] // Default no cache
    public class SDEController : ControllerBase
    {
        private readonly ISDEService _sdeService;
        public SDEController(ISDEService sdeService)
        {
            _sdeService = sdeService;
        }

        /// <summary>
        /// Checks if a blueprint is a product of invention
        /// </summary>
        [SwaggerOperation(
            Summary = "Checks if a blueprint is a product of invention",
            Description = "Determines whether the specified blueprint can be obtained through invention"
        )]
        [HttpGet("blueprintProdOfInvention")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(ValidationProblemDetails), StatusCodes.Status400BadRequest)]
        public ActionResult<bool> BlueprintProdOfInvention(
            [FromQuery, SwaggerParameter(
                Description = "TypeID of the blueprint to check",
                Required = true
            )] int id)
        {
            var data = _sdeService.IsBlueprintProductOfInvention(id);
            return Ok(data);
        }
        
        /// <summary>
        /// Gets the name of an item by its TypeID
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the name of an item by its TypeID",
            Description = "Retrieves the full name of an EVE Online item using its TypeID"
        )]
        [HttpGet("itemName")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        [ResponseCache(Duration = 3600)] // Cache for 1 hour since item names rarely change
        public async Task<ActionResult<string>> GetItemName(
            [FromQuery, SwaggerParameter(
                Description = "TypeID of the item",
                Required = true
            )] int id)
        {
            var data = await _sdeService.GetItemNameAsync(id);
            if (data == null)
            {
                return NotFound("Item not found");
            }

            return Ok(data);
        }

        /// <summary>
        /// Gets the TypeID of an item by its exact name
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the TypeID of an item by its exact name",
            Description = "Retrieves the TypeID of an EVE Online item using its exact name (case-sensitive)"
        )]
        [HttpGet("itemId")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> GetItemId(
            [FromQuery, SwaggerParameter(
                Description = "Exact name of the item (case-sensitive)",
                Required = true
            )] string name)
        {
            var data = await _sdeService.GetItemTypeIdAsync(name);
            if (data == null)
            {
                return NotFound("Item not found");
            }

            return Ok(data);
        }
        
        /// <summary>
        /// Gets the blueprint TypeID that produces a specific item
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the blueprint TypeID that produces a specific item",
            Description = "Finds the blueprint that can manufacture the specified product"
        )]
        [HttpGet("bpIdByProdId")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> GetBlueprintIdByProductIdAsync(
            [FromQuery, SwaggerParameter(
                Description = "TypeID of the product",
                Required = true
            )] int id)
        {
            var data = await _sdeService.GetBlueprintIdByProductIdAsync(id);
            if (data == null)
            {
                return NotFound("No blueprint found for this product");
            }

            return Ok(data);
        }
        
        /// <summary>
        /// Gets the product TypeID that a blueprint produces
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the product TypeID that a blueprint produces",
            Description = "Finds the product that is manufactured by the specified blueprint"
        )]
        [HttpGet("prodIdByBpId")]
        [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string>> GetProductIdByBlueprintIdAsync(
            [FromQuery, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int id,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, default)",
                Required = false
            )] byte activityId = 1)
        {
            var data = await _sdeService.GetProductIdByBlueprintIdAsync(id, activityId);
            if (data == null)
            {
                return NotFound("No product found for this blueprint");
            }

            return Ok(data);
        }

        /// <summary>
        /// Gets detailed information about an item by its TypeID
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets detailed information about an item by its TypeID",
            Description = "Retrieves complete item information from the EVE Online SDE"
        )]
        [HttpGet("item/{id}")]
        [ProducesResponseType(typeof(Item), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Item>> GetItem(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the item",
                Required = true
            )] int id) 
        {
            var item = await _sdeService.GetItemAsync(id);
            if (item == null)
            {
                return NotFound("Item not found");
            }

            return Ok(item);
        }

        /// <summary>
        /// Gets detailed information about a blueprint by its TypeID
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets detailed information about a blueprint by its TypeID",
            Description = "Retrieves complete blueprint information from the EVE Online SDE"
        )]
        [HttpGet("bp/{id}")]
        [ProducesResponseType(typeof(Blueprint), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<Blueprint>> GetBlueprint(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int id,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention)",
                Required = false
            )] byte? activityId)
        {
            var blueprint = await _sdeService.GetBlueprintAsync(id, activityId);
            if (blueprint == null)
            {
                return NotFound("Blueprint not found");
            }
            return Ok(blueprint);
        }

        /// <summary>
        /// Gets the material requirements for a blueprint
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the material requirements for a blueprint",
            Description = "Retrieves the list of materials needed for manufacturing or other activities with this blueprint"
        )]
        [HttpGet("bp/{id}/materials")]
        [ProducesResponseType(typeof(List<BPSkill>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<BPSkill>>> GetBPMaterials(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int id,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention)",
                Required = false
            )] byte? activityId)
        {
            var products = await _sdeService.GetBlueprintMaterialsAsync(id, activityId);
            if (products == null)
            {
                return NotFound("Blueprint materials not found");
            }
            return Ok(products);
        }
        
        /// <summary>
        /// Gets the products produced by a blueprint
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the products produced by a blueprint",
            Description = "Retrieves the list of items produced by this blueprint for the specified activity"
        )]
        [HttpGet("bp/{id}/products")]
        [ProducesResponseType(typeof(List<BPSkill>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<BPSkill>>> GetBPProducts(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int id,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention)",
                Required = false
            )] byte? activityId)
        {
            var products = await _sdeService.GetBlueprintProductsAsync(id, activityId);

            if (products == null)
            {
                return NotFound("Blueprint products not found");  
            }
            return Ok(products);
        }
        
        /// <summary>
        /// Gets the skill requirements for a blueprint
        /// </summary>
        [SwaggerOperation(
            Summary = "Gets the skill requirements for a blueprint",
            Description = "Retrieves the list of skills needed to use this blueprint for the specified activity"
        )]
        [HttpGet("bp/{id}/skills")]
        [ProducesResponseType(typeof(List<BPSkill>), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<List<BPSkill>>> GetBPSkills(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the blueprint",
                Required = true
            )] int id,
            [FromQuery, SwaggerParameter(
                Description = "Activity ID (1 = Manufacturing, 8 = Invention)",
                Required = false
            )] byte? activityId)
        {
            var skills = await _sdeService.GetBlueprintSkillsAsync(id, activityId);

            if (skills == null)
            {
                return NotFound("Blueprint skills not found");
            }
            return Ok(skills);
        }

        /// <summary>
        /// Checks if a blueprint exists in the SDE
        /// </summary>
        [SwaggerOperation(
            Summary = "Checks if a blueprint exists in the SDE",
            Description = "Verifies whether a blueprint with the specified TypeID exists in the EVE Online Static Data Export"
        )]
        [HttpGet("bpexists/{id}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public ActionResult<bool> BPExists(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the blueprint to check",
                Required = true
            )] int id)
        {
            return Ok(_sdeService.DoesBlueprintExist(id));
        }
        
        /// <summary>
        /// Checks if an item exists in the SDE
        /// </summary>
        [SwaggerOperation(
            Summary = "Checks if an item exists in the SDE",
            Description = "Verifies whether an item with the specified TypeID exists in the EVE Online Static Data Export"
        )]
        [HttpGet("itemexists/{id}")]
        [ProducesResponseType(typeof(bool), StatusCodes.Status200OK)]
        public ActionResult<bool> ItemExists(
            [FromRoute, SwaggerParameter(
                Description = "TypeID of the item to check",
                Required = true
            )] int id)
        {
            return Ok(_sdeService.DoesItemExist(id));
        }

        /// <summary>
        /// Searches for blueprints by name
        /// </summary>
        [SwaggerOperation(
            Summary = "Searches for blueprints by name",
            Description = "Performs a search across all blueprints and returns matching names for autocomplete functionality"
        )]
        [HttpPost("bpSearch")]
        [ProducesResponseType(typeof(string[]), StatusCodes.Status200OK)]
        [ProducesResponseType(StatusCodes.Status404NotFound)]
        public async Task<ActionResult<string[]>> SearchBlueprints(
            [FromQuery, SwaggerParameter(
                Description = "Search term for blueprint names",
                Required = true
            )] string search) 
        { 
            var results = await _sdeService.SearchBlueprintsAsync(search);
            if (results == null) 
                return NotFound("No matching blueprints found");
            
            return Ok(results);
        }
    }
}

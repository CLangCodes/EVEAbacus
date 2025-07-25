using EVEAbacus.Infrastructure.Data;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace EVEAbacus.WebUI.Controllers
{
    /// <summary>
    /// Controller for health check and system status endpoints
    /// </summary>
    [Route("api/[controller]")]
    [ApiController]
    public class HealthController : ControllerBase
    {
        private readonly EVEAbacusDbContext _dbContext;

        public HealthController(EVEAbacusDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        /// <summary>
        /// Performs a basic health check of the API service
        /// </summary>
        [SwaggerOperation(
            Summary = "Performs a basic health check of the API service",
            Description = "Returns the current status of the API service including version and timestamp."
        )]
        [HttpGet]
        [ProducesResponseType(typeof(HealthResponse), StatusCodes.Status200OK)]
        public ActionResult<HealthResponse> GetHealth()
        {
            return Ok(new HealthResponse
            {
                Status = "ok",
                Timestamp = DateTime.UtcNow,
                Version = "1.0.0",
                Service = "EVE Abacus API"
            });
        }

        /// <summary>
        /// Performs a database connectivity health check
        /// </summary>
        [SwaggerOperation(
            Summary = "Performs a database connectivity health check",
            Description = "Tests the connection to the database and returns the status."
        )]
        [HttpGet("db")]
        [ProducesResponseType(typeof(DatabaseHealthResponse), StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(DatabaseHealthResponse), StatusCodes.Status503ServiceUnavailable)]
        public async Task<ActionResult<DatabaseHealthResponse>> GetDatabaseHealth()
        {
            try
            {
                // Test database connectivity with a simple query
                var canConnect = await _dbContext.Database.CanConnectAsync();
                
                if (canConnect)
                {
                    // Optional: Perform a simple query to ensure full connectivity
                    // Use a simple SQL query without requiring a specific entity
                    var testQuery = await _dbContext.Database.ExecuteSqlRawAsync("SELECT 1");
                    
                    return Ok(new DatabaseHealthResponse
                    {
                        Status = "ok",
                        Database = "connected",
                        Timestamp = DateTime.UtcNow,
                        ResponseTime = "fast"
                    });
                }
                else
                {
                    return StatusCode(503, new DatabaseHealthResponse
                    {
                        Status = "error",
                        Database = "disconnected",
                        Timestamp = DateTime.UtcNow,
                        ResponseTime = "timeout"
                    });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(503, new DatabaseHealthResponse
                {
                    Status = "error",
                    Database = "error",
                    Timestamp = DateTime.UtcNow,
                    ResponseTime = "error",
                    Message = ex.Message
                });
            }
        }
    }

    /// <summary>
    /// Response model for basic health check
    /// </summary>
    public class HealthResponse
    {
        public string Status { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string Version { get; set; } = string.Empty;
        public string Service { get; set; } = string.Empty;
    }

    /// <summary>
    /// Response model for database health check
    /// </summary>
    public class DatabaseHealthResponse
    {
        public string Status { get; set; } = string.Empty;
        public string Database { get; set; } = string.Empty;
        public DateTime Timestamp { get; set; }
        public string ResponseTime { get; set; } = string.Empty;
        public string? Message { get; set; }
    }
} 
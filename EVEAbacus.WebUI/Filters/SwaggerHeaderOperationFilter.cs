using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EVEAbacus.WebUI.Filters
{
    public class SwaggerHeaderOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Add response headers documentation
            if (!operation.Responses.ContainsKey("200"))
            {
                operation.Responses.Add("200", new OpenApiResponse());
            }

            operation.Responses["200"].Headers = new Dictionary<string, OpenApiHeader>
            {
                ["api-supported-versions"] = new OpenApiHeader
                {
                    Description = "The API versions supported by this endpoint",
                    Schema = new OpenApiSchema { Type = "string" }
                },
                ["content-type"] = new OpenApiHeader
                {
                    Description = "The content type of the response",
                    Schema = new OpenApiSchema { Type = "string" }
                },
                ["date"] = new OpenApiHeader
                {
                    Description = "The date and time when the response was generated",
                    Schema = new OpenApiSchema { Type = "string" }
                },
                ["server"] = new OpenApiHeader
                {
                    Description = "The server software used to handle the request",
                    Schema = new OpenApiSchema { Type = "string" }
                },
                ["transfer-encoding"] = new OpenApiHeader
                {
                    Description = "The encoding used to transfer the response",
                    Schema = new OpenApiSchema { Type = "string" }
                }
            };

            // Add rate limiting information to the operation description
            operation.Description = (operation.Description ?? "") + 
                "\n\n**Rate Limiting:**\n" +
                "- 20 requests per second\n" +
                "- 100 requests per minute\n" +
                "- 1000 requests per hour";
        }
    }
} 
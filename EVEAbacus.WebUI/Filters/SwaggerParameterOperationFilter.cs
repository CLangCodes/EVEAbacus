using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;
using System.Reflection;

namespace EVEAbacus.WebUI.Filters
{
    public class SwaggerParameterOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Ensure parameters collection exists
            operation.Parameters ??= new List<OpenApiParameter>();

            var methodInfo = context.MethodInfo;
            var parameters = methodInfo.GetParameters();

            // Check if this operation has a request body
            bool hasRequestBody = operation.RequestBody != null || 
                                 parameters.Any(p => p.GetCustomAttribute<Microsoft.AspNetCore.Mvc.FromBodyAttribute>() != null);

            // If the operation has a request body, remove all parameters
            if (hasRequestBody)
            {
                operation.Parameters.Clear();
            }
            else
            {
                // Process each parameter to ensure it's properly documented
                foreach (var parameter in parameters)
                {
                    // Skip parameters that are already in the operation (like FromBody parameters)
                    if (operation.Parameters.Any(p => p.Name == parameter.Name))
                        continue;

                    // Handle FromQuery parameters
                    var fromQueryAttr = parameter.GetCustomAttribute<Microsoft.AspNetCore.Mvc.FromQueryAttribute>();
                    if (fromQueryAttr != null)
                    {
                        var swaggerParamAttr = parameter.GetCustomAttribute<Swashbuckle.AspNetCore.Annotations.SwaggerParameterAttribute>();
                        
                        var openApiParameter = new OpenApiParameter
                        {
                            Name = parameter.Name,
                            In = ParameterLocation.Query,
                            Required = !parameter.IsOptional,
                            Schema = GetOpenApiSchema(parameter.ParameterType)
                        };

                        if (swaggerParamAttr != null)
                        {
                            openApiParameter.Description = swaggerParamAttr.Description;
                            openApiParameter.Required = swaggerParamAttr.Required;
                        }

                        operation.Parameters.Add(openApiParameter);
                    }

                    // Handle FromRoute parameters
                    var fromRouteAttr = parameter.GetCustomAttribute<Microsoft.AspNetCore.Mvc.FromRouteAttribute>();
                    if (fromRouteAttr != null)
                    {
                        var swaggerParamAttr = parameter.GetCustomAttribute<Swashbuckle.AspNetCore.Annotations.SwaggerParameterAttribute>();
                        
                        var openApiParameter = new OpenApiParameter
                        {
                            Name = parameter.Name,
                            In = ParameterLocation.Path,
                            Required = true, // Route parameters are always required
                            Schema = GetOpenApiSchema(parameter.ParameterType)
                        };

                        if (swaggerParamAttr != null)
                        {
                            openApiParameter.Description = swaggerParamAttr.Description;
                        }

                        operation.Parameters.Add(openApiParameter);
                    }

                    // Handle FromBody parameters - ensure request body is properly documented
                    var fromBodyAttr = parameter.GetCustomAttribute<Microsoft.AspNetCore.Mvc.FromBodyAttribute>();
                    if (fromBodyAttr != null)
                    {
                        // Ensure request body exists and is marked as required
                        if (operation.RequestBody == null)
                        {
                            operation.RequestBody = new OpenApiRequestBody
                            {
                                Required = true,
                                Content = new Dictionary<string, OpenApiMediaType>
                                {
                                    ["application/json"] = new OpenApiMediaType
                                    {
                                        Schema = GetOpenApiSchema(parameter.ParameterType)
                                    }
                                }
                            };
                        }
                        else
                        {
                            operation.RequestBody.Required = true;
                        }
                    }
                }
            }

            // Remove parameters section entirely if it's empty
            if (operation.Parameters.Count == 0)
            {
                operation.Parameters = null;
            }

            // Handle specific endpoint customizations
            if (context.ApiDescription.RelativePath?.Contains("ManufBatch") == true || 
                context.ApiDescription.RelativePath?.Contains("manufacturing-batch") == true)
            {
                operation.Summary = "Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis";
                
                // Handle request body for manufacturing batch
                if (operation.RequestBody?.Content?.ContainsKey("application/json") == true)
                {
                    var jsonContent = operation.RequestBody.Content["application/json"];
                    
                    // Ensure the request body is marked as required
                    operation.RequestBody.Required = true;
                    
                    // If the schema uses a reference, we need to modify the referenced schema
                    if (jsonContent.Schema?.Reference?.Id == "ManufacturingBatchRequest")
                    {
                        // Create a new inline schema with proper documentation
                        jsonContent.Schema = new OpenApiSchema
                        {
                            Type = "object",
                            Required = new HashSet<string> { "orderDTOs" },
                            Properties = new Dictionary<string, OpenApiSchema>
                            {
                                ["orderDTOs"] = new OpenApiSchema
                                {
                                    Type = "array",
                                    Description = "Array of manufacturing orders",
                                    Items = new OpenApiSchema
                                    {
                                        Type = "object",
                                        Required = new HashSet<string> { "activityId", "copies", "runs", "me", "te" },
                                        Properties = new Dictionary<string, OpenApiSchema>
                                        {
                                            ["blueprintName"] = new OpenApiSchema
                                            {
                                                Type = "string",
                                                Description = "Name of the blueprint (optional)",
                                                Example = new Microsoft.OpenApi.Any.OpenApiString("Tritanium")
                                            },
                                            ["activityId"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Description = "Activity ID (1 = Manufacturing, 8 = Invention)",
                                                Example = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                                            },
                                            ["copies"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Minimum = 1,
                                                Maximum = 2147483647,
                                                Description = "Number of blueprint copies",
                                                Example = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                                            },
                                            ["runs"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Minimum = 1,
                                                Maximum = 2147483647,
                                                Description = "Number of production runs",
                                                Example = new Microsoft.OpenApi.Any.OpenApiInteger(10)
                                            },
                                            ["me"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Minimum = 0,
                                                Maximum = 10,
                                                Description = "Material Efficiency level (0-10)",
                                                Example = new Microsoft.OpenApi.Any.OpenApiInteger(0)
                                            },
                                            ["te"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Minimum = 0,
                                                Maximum = 20,
                                                Description = "Time Efficiency level (0-20)",
                                                Example = new Microsoft.OpenApi.Any.OpenApiInteger(0)
                                            },
                                            ["parentBlueprintTypeId"] = new OpenApiSchema
                                            {
                                                Type = "integer",
                                                Nullable = true,
                                                Description = "Parent blueprint TypeID (optional)"
                                            }
                                        }
                                    }
                                },
                                ["stationIds"] = new OpenApiSchema
                                {
                                    Type = "array",
                                    Nullable = true,
                                    Description = "Array of station IDs for market analysis (optional)",
                                    Items = new OpenApiSchema
                                    {
                                        Type = "string"
                                    },
                                    Example = new Microsoft.OpenApi.Any.OpenApiArray
                                    {
                                        new Microsoft.OpenApi.Any.OpenApiString("60003760"),
                                        new Microsoft.OpenApi.Any.OpenApiString("60008494")
                                    }
                                }
                            }
                        };
                        
                        // Add an example for the entire request body
                        jsonContent.Example = new Microsoft.OpenApi.Any.OpenApiObject
                        {
                            ["orderDTOs"] = new Microsoft.OpenApi.Any.OpenApiArray
                            {
                                new Microsoft.OpenApi.Any.OpenApiObject
                                {
                                    ["blueprintName"] = new Microsoft.OpenApi.Any.OpenApiString("Tritanium"),
                                    ["activityId"] = new Microsoft.OpenApi.Any.OpenApiInteger(1),
                                    ["copies"] = new Microsoft.OpenApi.Any.OpenApiInteger(1),
                                    ["runs"] = new Microsoft.OpenApi.Any.OpenApiInteger(10),
                                    ["me"] = new Microsoft.OpenApi.Any.OpenApiInteger(0),
                                    ["te"] = new Microsoft.OpenApi.Any.OpenApiInteger(0)
                                }
                            },
                            ["stationIds"] = new Microsoft.OpenApi.Any.OpenApiArray
                            {
                                new Microsoft.OpenApi.Any.OpenApiString("60003760"),
                                new Microsoft.OpenApi.Any.OpenApiString("60008494")
                            }
                        };
                    }
                }
            }
            else if (context.ApiDescription.RelativePath?.Contains("InventionSuggestion") == true)
            {
                operation.Summary = "Returns a list of blueprints suitable for invention based on character's R&D skills";

                var skillIdsParam = operation.Parameters?.FirstOrDefault(p => p.Name == "skillIds");
                if (skillIdsParam != null)
                {
                    skillIdsParam.Required = true;
                    skillIdsParam.Description = "Array of EVE Online R&D skill IDs. Common skills include:\n" +
                        "- 3408: Science\n" +
                        "- 3409: Advanced Industry\n" +
                        "- 11433: High Energy Physics\n" +
                        "- 11442: Molecular Engineering\n" +
                        "- 11443: Nanite Engineering";
                    skillIdsParam.Schema.MinItems = 1;
                    skillIdsParam.Example = new Microsoft.OpenApi.Any.OpenApiArray
                    {
                        new Microsoft.OpenApi.Any.OpenApiString("3408"),
                        new Microsoft.OpenApi.Any.OpenApiString("3409")
                    };
                }
            }
            else if (context.ApiDescription.RelativePath?.Contains("SDE/blueprintProdOfInvention") == true)
            {
                operation.Summary = "Checks if a blueprint's product can be invented";

                var blueprintTypeIdParam = operation.Parameters?.FirstOrDefault(p => p.Name == "blueprintTypeId");
                if (blueprintTypeIdParam != null)
                {
                    blueprintTypeIdParam.Required = true;
                    blueprintTypeIdParam.Description = "The type ID of the blueprint to check. This is the ID of the blueprint item itself, not the product it produces.";
                    blueprintTypeIdParam.Example = new Microsoft.OpenApi.Any.OpenApiInteger(1230); // Example: Small Hybrid Turret Blueprint
                }
            }
            else if (context.ApiDescription.RelativePath?.Contains("PIPlanner") == true)
            {
                operation.Summary = "Finds planets suitable for Planetary Interaction (PI)";

                var rangeParam = operation.Parameters?.FirstOrDefault(p => p.Name == "range");
                if (rangeParam != null)
                {
                    rangeParam.Schema.Minimum = 1;
                    rangeParam.Schema.Maximum = 10;
                    rangeParam.Example = new Microsoft.OpenApi.Any.OpenApiInteger(5);
                }

                var securityStatusParam = operation.Parameters?.FirstOrDefault(p => p.Name == "securityStatus");
                if (securityStatusParam != null)
                {
                    securityStatusParam.Example = new Microsoft.OpenApi.Any.OpenApiArray
                    {
                        new Microsoft.OpenApi.Any.OpenApiString("highsec"),
                        new Microsoft.OpenApi.Any.OpenApiString("nullsec")
                    };
                }

                var planetTypesParam = operation.Parameters?.FirstOrDefault(p => p.Name == "planetTypes");
                if (planetTypesParam != null)
                {
                    planetTypesParam.Example = new Microsoft.OpenApi.Any.OpenApiArray
                    {
                        new Microsoft.OpenApi.Any.OpenApiString("Barren"),
                        new Microsoft.OpenApi.Any.OpenApiString("Oceanic")
                    };
                    planetTypesParam.Description += "\nAvailable planet types:\n" +
                        "- Barren\n" +
                        "- Gas\n" +
                        "- Ice\n" +
                        "- Lava\n" +
                        "- Oceanic\n" +
                        "- Plasma\n" +
                        "- Storm\n" +
                        "- Temperate";
                }

                var focalSystemParam = operation.Parameters?.FirstOrDefault(p => p.Name == "focalSystemName");
                if (focalSystemParam != null)
                {
                    focalSystemParam.Example = new Microsoft.OpenApi.Any.OpenApiString("Jita");
                }
            }
        }

        private OpenApiSchema GetOpenApiSchema(Type type)
        {
            if (type == typeof(string))
                return new OpenApiSchema { Type = "string" };
            if (type == typeof(int) || type == typeof(int?))
                return new OpenApiSchema { Type = "integer", Format = "int32" };
            if (type == typeof(long) || type == typeof(long?))
                return new OpenApiSchema { Type = "integer", Format = "int64" };
            if (type == typeof(double) || type == typeof(double?))
                return new OpenApiSchema { Type = "number", Format = "double" };
            if (type == typeof(decimal) || type == typeof(decimal?))
                return new OpenApiSchema { Type = "number", Format = "decimal" };
            if (type == typeof(bool) || type == typeof(bool?))
                return new OpenApiSchema { Type = "boolean" };
            if (type == typeof(DateTime) || type == typeof(DateTime?))
                return new OpenApiSchema { Type = "string", Format = "date-time" };
            if (type == typeof(Guid) || type == typeof(Guid?))
                return new OpenApiSchema { Type = "string", Format = "uuid" };
            if (type == typeof(byte) || type == typeof(byte?))
                return new OpenApiSchema { Type = "integer", Format = "int32" };
            if (type == typeof(short) || type == typeof(short?))
                return new OpenApiSchema { Type = "integer", Format = "int32" };
            if (type == typeof(float) || type == typeof(float?))
                return new OpenApiSchema { Type = "number", Format = "float" };

            // Handle arrays
            if (type.IsArray)
            {
                var elementType = type.GetElementType();
                if (elementType != null)
                {
                    return new OpenApiSchema
                    {
                        Type = "array",
                        Items = GetOpenApiSchema(elementType)
                    };
                }
            }

            // Handle generic collections
            if (type.IsGenericType && (type.GetGenericTypeDefinition() == typeof(List<>) || 
                                      type.GetGenericTypeDefinition() == typeof(IEnumerable<>) ||
                                      type.GetGenericTypeDefinition() == typeof(ICollection<>) ||
                                      type.GetGenericTypeDefinition() == typeof(IList<>)))
            {
                var elementType = type.GetGenericArguments()[0];
                return new OpenApiSchema
                {
                    Type = "array",
                    Items = GetOpenApiSchema(elementType)
                };
            }

            // Default to string for unknown types
            return new OpenApiSchema { Type = "string" };
        }
    }
} 
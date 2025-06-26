using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace EVEAbacus.WebUI.Filters
{
    public class SwaggerParameterOperationFilter : IOperationFilter
    {
        public void Apply(OpenApiOperation operation, OperationFilterContext context)
        {
            // Ensure parameters collection exists
            operation.Parameters ??= new List<OpenApiParameter>();

            var methodInfo = context.MethodInfo;
            var summaryXml = methodInfo.GetCustomAttributes(true)
                .OfType<System.ComponentModel.DescriptionAttribute>()
                .FirstOrDefault()?.Description;

            if (context.ApiDescription.RelativePath?.Contains("ManufBatch") == true)
            {
                operation.Summary = "Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis";
            }
            else if (context.ApiDescription.RelativePath?.Contains("InventionSuggestion") == true)
            {
                operation.Summary = "Returns a list of blueprints suitable for invention based on character's R&D skills";

                var skillIdsParam = operation.Parameters.FirstOrDefault(p => p.Name == "skillIds");
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

                var blueprintTypeIdParam = operation.Parameters.FirstOrDefault(p => p.Name == "blueprintTypeId");
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

                var rangeParam = operation.Parameters.FirstOrDefault(p => p.Name == "range");
                if (rangeParam != null)
                {
                    rangeParam.Schema.Minimum = 1;
                    rangeParam.Schema.Maximum = 10;
                    rangeParam.Example = new Microsoft.OpenApi.Any.OpenApiInteger(5);
                }

                var securityStatusParam = operation.Parameters.FirstOrDefault(p => p.Name == "securityStatus");
                if (securityStatusParam != null)
                {
                    securityStatusParam.Example = new Microsoft.OpenApi.Any.OpenApiArray
                    {
                        new Microsoft.OpenApi.Any.OpenApiString("highsec"),
                        new Microsoft.OpenApi.Any.OpenApiString("nullsec")
                    };
                }

                var planetTypesParam = operation.Parameters.FirstOrDefault(p => p.Name == "planetTypes");
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

                var focalSystemParam = operation.Parameters.FirstOrDefault(p => p.Name == "focalSystemName");
                if (focalSystemParam != null)
                {
                    focalSystemParam.Example = new Microsoft.OpenApi.Any.OpenApiString("Jita");
                }
            }
        }
    }
} 
using Microsoft.OpenApi.Models;

public static class OrderDTOSchema
{
    public static OpenApiSchema GetSchema() => new OpenApiSchema
    {
        Type = "object",
                    Properties = new Dictionary<string, OpenApiSchema>
                    {
                        ["blueprintName"] = new OpenApiSchema 
                        { 
                            Type = "string",
                            Description = "The exact name of the blueprint in EVE Online"
                        },
                        ["activityId"] = new OpenApiSchema 
                        { 
                            Type = "integer",
                            Format = "int32",
                            Description = "Type of activity (1 = Manufacturing, default)",
                            Default = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                        },
                        ["copies"] = new OpenApiSchema 
                        { 
                            Type = "integer",
                            Format = "int32",
                            Minimum = 1,
                            // Maximum = 1000,
                            Description = "Number of blueprint copies to produce (1-1000)",
                            Default = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                        },
                        ["runs"] = new OpenApiSchema 
                        { 
                            Type = "integer",
                            Format = "int32",
                            Minimum = 1,
                            // Maximum = 1000,
                            Description = "Number of manufacturing runs per copy (1-1000)",
                            Default = new Microsoft.OpenApi.Any.OpenApiInteger(1)
                        },
                        ["me"] = new OpenApiSchema 
                        { 
                            Type = "integer",
                            Format = "int32",
                            Minimum = 0,
                            Maximum = 10,
                            Description = "Material Efficiency level, reduces material requirements (0-10)",
                            Default = new Microsoft.OpenApi.Any.OpenApiInteger(0)
                        },
                        ["te"] = new OpenApiSchema 
                        { 
                            Type = "integer",
                            Format = "int32",
                            Minimum = 0,
                            Maximum = 20,
                            Description = "Time Efficiency level, reduces production time (must be zero or even, 0-20)",
                            Default = new Microsoft.OpenApi.Any.OpenApiInteger(0)
                        }
                    },
                    Required = new HashSet<string> { "blueprintName" }
    };
}
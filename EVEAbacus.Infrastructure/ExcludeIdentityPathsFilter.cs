using Swashbuckle.AspNetCore.SwaggerGen;
using Microsoft.OpenApi.Models;

namespace EVEAbacus.Infrastructure
{
    public class ExcludeIdentityPathsFilter : IDocumentFilter
    {
        public void Apply(OpenApiDocument swaggerDoc, DocumentFilterContext context)
        {
            var identityPathsToRemove = new[] { 
                "/Account/Logout", 
                "/Account/Manage/DownloadPersonalData",
                "/ESI/AuthRequest", 
                "/ESI/Callback", 
                "/ESI/RefreshToken", 
                "/ESI/route/{originId}/{destinationId}", 
            };

            foreach (var path in identityPathsToRemove)
            {
                if (swaggerDoc.Paths.ContainsKey(path))
                {
                    swaggerDoc.Paths.Remove(path);
                }
            }
        }
    }
}

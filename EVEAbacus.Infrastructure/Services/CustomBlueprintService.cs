using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Infrastructure.Services
{
    public class CustomBlueprintService : ICustomBlueprintService
    {
        public required List<CustomBlueprint> CustomBlueprints { get; set; } = [];

        public CustomBlueprintService() { }

        public async Task AddCustomBlueprintAsync(CustomBlueprint customBlueprint)
        {
            if (!this.CustomBlueprints.Any(cb => cb.BlueprintTypeId == customBlueprint.BlueprintTypeId))
            {
                CustomBlueprints.Add(customBlueprint);
            }
            else
            {
                await EditCustomBlueprintAsync(customBlueprint);
            }
        }

        public async Task AddCustomBlueprintsAsync(CustomBlueprint[] customBlueprints)
        {
            foreach (var customBlueprint in customBlueprints)
            {
                await AddCustomBlueprintAsync(customBlueprint);
            }
        }

        public void DeleteCustomBlueprint(int blueprintTypeId)
        {
            try
            {
                var blueprintToRemove = CustomBlueprints.FirstOrDefault(cb => cb.BlueprintTypeId == blueprintTypeId);
                if (blueprintToRemove != null)
                {
                    CustomBlueprints.Remove(blueprintToRemove);
                }
            }
            catch
            {
                Console.WriteLine("Custom blueprint not found to delete.");
            }
        }

        public async Task EditCustomBlueprintAsync(CustomBlueprint customBlueprint)
        {
            try
            {
                var existingBlueprint = CustomBlueprints.FirstOrDefault(cb => cb.BlueprintTypeId == customBlueprint.BlueprintTypeId);
                if (existingBlueprint != null)
                {
                    CustomBlueprints[CustomBlueprints.IndexOf(existingBlueprint)] = customBlueprint;
                }
            }
            catch
            {
                Console.WriteLine("Custom blueprint not found to edit.");
            }
        }

        public void SetCustomBlueprintsFromStorage(List<CustomBlueprint> customBlueprints)
        {
            CustomBlueprints = customBlueprints;
        }

        public CustomBlueprint? GetCustomBlueprint(int blueprintTypeId)
        {
            return CustomBlueprints.FirstOrDefault(cb => cb.BlueprintTypeId == blueprintTypeId);
        }

        public int GetMaterialEfficiency(int blueprintTypeId)
        {
            var customBlueprint = CustomBlueprints.FirstOrDefault(cb => cb.BlueprintTypeId == blueprintTypeId);
            return customBlueprint?.MaterialEfficiency ?? 0;
        }

        public int GetTimeEfficiency(int blueprintTypeId)
        {
            var customBlueprint = CustomBlueprints.FirstOrDefault(cb => cb.BlueprintTypeId == blueprintTypeId);
            return customBlueprint?.TimeEfficiency ?? 0;
        }
    }
} 
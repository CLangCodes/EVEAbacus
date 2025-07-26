using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Application.Interfaces
{
    public interface ICustomBlueprintService
    {
        List<CustomBlueprint> CustomBlueprints { get; }
        Task AddCustomBlueprintAsync(CustomBlueprint customBlueprint);
        Task AddCustomBlueprintsAsync(CustomBlueprint[] customBlueprints);
        void DeleteCustomBlueprint(int blueprintTypeId);
        Task EditCustomBlueprintAsync(CustomBlueprint customBlueprint);
        void SetCustomBlueprintsFromStorage(List<CustomBlueprint> customBlueprints);
        CustomBlueprint? GetCustomBlueprint(int blueprintTypeId);
        int GetMaterialEfficiency(int blueprintTypeId);
        int GetTimeEfficiency(int blueprintTypeId);
    }
} 
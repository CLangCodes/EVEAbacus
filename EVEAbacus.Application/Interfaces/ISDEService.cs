using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Application.Interfaces
{
    public interface ISDEService
    {
        bool CanItemBeManufactured(int typeId);
        Task<int?> CanThisBeBuiltAsync(int typeId);
        bool DoesBlueprintExist(int typeId);
        bool DoesItemExist(int typeId); 
        bool IsBlueprintProductOfInvention(int blueprintProductId);
        Task<Blueprint> GetBlueprintAsync(int typeId, byte? activityId);
        Task<int?> GetBlueprintIdByProductIdAsync(int productId);
        Task<List<BPMaterial>?> GetBlueprintMaterialsAsync(int blueprintTypeId, byte? activityId);
        Task<List<BPProduct>?> GetBlueprintProductsAsync(int typeId, byte? activityId);
        Task<List<BPSkill>?> GetBlueprintSkillsAsync(int typeId, byte? activityId);
        Task<List<BPTime>?> GetBlueprintTimesAsync(int typeId, byte? activityId);
        Task<BPMaterial[]> GetBuildableBPMaterials(int blueprintTypeIds);
        Task<int[]> GetGroupIdsInCategory(int categoryId);
        Task<float> GetInventionChance(int blueprintTypeId, int productTypeId);
        Task<string[]> GetInventionTargetsBySkillsAsync(int[] skillIds);
        Task<string[]> GetInventionSkillsAsync();
        Task<Item> GetItemAsync(int typeId);
        Task<string?> GetItemNameAsync(int typeId);
        Task<Item[]> GetItemsInGroup(int groupId);
        Task<int?> GetItemTypeIdAsync(string name);
        Task<int?> GetProductIdByBlueprintIdAsync(int typeId, byte activityId);
        Task<BPMaterial[]> GetUnbuildableBPMaterials(int blueprintTypeId);
        Task<int?> HowManyProductsMadeAsync(int productId);
        Task<string[]> SearchBlueprintsAsync(string searchTerm);
    }
}

using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Application.Interfaces
{
    public interface ISDERepository
    {
        bool CanItemBeManufactured(int typeId);
        Task<int?> CanThisBeBuiltAsync(int typeId);
        bool DoesBlueprintExist(int blueprintTypeId);
        bool DoesItemExist(int typeId);
        Task<Blueprint?> GetBlueprintAsync(int typeId, byte? activityId);
        Task<int?> GetBlueprintIdByProductIdAsync(int productId);
        Task<string[]> GetBlueprintNamesAsync(string searchTerm);
        Task<List<BPMaterial>?> GetBuildableBlueprintMaterialsAsync(int typeId);
        Task<List<BPMaterial>?> GetBlueprintMaterialsAsync(int blueprintTypeId, byte? activityId);
        Task<List<BPProduct>?> GetBlueprintProductsAsync(int typeId, byte? activityId);
        Task<List<BPSkill>?> GetBlueprintSkillsAsync(int typeId, byte? activityId);
        Task<List<BPTime>?> GetBlueprintTimesAsync(int typeId, byte? activityId);
        Task<int[]?> GetGroupIdsInCategory(int categoryId);
        Task<string[]> GetInventionSkillsAsync();
        Task<string[]> GetInventionTargetsBySkillsAsync(int[] skillIds);
        Task<Item?> GetItemAsync(int typeId);
        Task<string?> GetItemNameAsync(int typeId);
        Task<Item[]?> GetItemsInGroup(int groupId);
        Task<int?> GetItemTypeIdAsync(string name);
        Task<int?> GetProductIdByBlueprintIdAsync(int typeId, byte activityId);
        Task<float> GetInventionChance(int blueprintTypeId, int productTypeId);
        Task<List<BPMaterial>?> GetUnbuildableBlueprintMaterialsAsync(int typeId);
        Task<int?> HowManyProductsMadeAsync(int productId);
        bool IsBlueprintProductOfInvention(int blueprintProductId);
    }
}

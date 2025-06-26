using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.ESI.Character;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Diagnostics;
using System.Runtime.Intrinsics.X86;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Services
{
    public class SDEService : ISDEService
    {
        private readonly ISDERepository _sdeRepository;

        public SDEService(ISDERepository sdeRepository)
        {
            _sdeRepository = sdeRepository;
        }
        bool ISDEService.CanItemBeManufactured(int typeId)
        {
            return _sdeRepository.CanItemBeManufactured(typeId);
        }
        Task<int?> ISDEService.CanThisBeBuiltAsync(int typeId)
        {
            return _sdeRepository.CanThisBeBuiltAsync(typeId);
        }
        bool ISDEService.DoesBlueprintExist(int typeId)
        {
            return _sdeRepository.DoesBlueprintExist(typeId);
        }
        bool ISDEService.DoesItemExist(int typeId)
        {
            return _sdeRepository.DoesItemExist(typeId);
        }
        async Task<Blueprint> ISDEService.GetBlueprintAsync(int typeId, byte? activityId)
        {
            return await _sdeRepository.GetBlueprintAsync(typeId, activityId);
        }
        async Task<int?> ISDEService.GetBlueprintIdByProductIdAsync(int productId)
        {
            return await _sdeRepository.GetBlueprintIdByProductIdAsync(productId);
        }
        async Task<List<BPMaterial>?> ISDEService.GetBlueprintMaterialsAsync(int blueprintTypeId, byte? activityId)
        {
            return await _sdeRepository.GetBlueprintMaterialsAsync(blueprintTypeId, activityId);
        }
        async Task<List<BPProduct>?> ISDEService.GetBlueprintProductsAsync(int typeId, byte? activityId)
        {
            return await _sdeRepository.GetBlueprintProductsAsync(typeId, activityId);
        }
        async Task<List<BPSkill>?> ISDEService.GetBlueprintSkillsAsync(int typeId, byte? activityId)
        {
            return await _sdeRepository.GetBlueprintSkillsAsync(typeId, activityId);
        }
        async Task<List<BPTime>?> ISDEService.GetBlueprintTimesAsync(int typeId, byte? activityId)
        {
            return await _sdeRepository.GetBlueprintTimesAsync(typeId, activityId);
        }
        async Task<BPMaterial[]> ISDEService.GetBuildableBPMaterials(int blueprintTypeId)
        {
            var result = await _sdeRepository.GetBuildableBlueprintMaterialsAsync(blueprintTypeId);
            if (result != null) { return result!.ToArray(); }
            else return [];
        }
        async Task<int[]> ISDEService.GetGroupIdsInCategory(int categoryId)
        {
            return await _sdeRepository.GetGroupIdsInCategory(categoryId);
        }
        async Task<float> ISDEService.GetInventionChance(int blueprintTypeId, int productTypeId)
        {
            return await _sdeRepository.GetInventionChance(blueprintTypeId, productTypeId);
        }
        async Task<string[]> ISDEService.GetInventionSkillsAsync()
        {
            return await _sdeRepository.GetInventionSkillsAsync();
        }
        async Task<string[]> ISDEService.GetInventionTargetsBySkillsAsync(int[] skillIds)
        {
            return await _sdeRepository.GetInventionTargetsBySkillsAsync(skillIds);
        }
        async Task<Item> ISDEService.GetItemAsync(int typeId)
        {
            return await _sdeRepository.GetItemAsync(typeId);
        }
        async Task<string?> ISDEService.GetItemNameAsync(int typeId)
        {
            return await _sdeRepository.GetItemNameAsync(typeId);
        }

        async Task<Item[]> ISDEService.GetItemsInGroup(int groupId)
        {
            return await _sdeRepository.GetItemsInGroup(groupId);
        }

        async Task<int?> ISDEService.GetItemTypeIdAsync(string name)
        {
            return await _sdeRepository.GetItemTypeIdAsync(name);
        }
        async Task<int?> ISDEService.GetProductIdByBlueprintIdAsync(int typeId, byte activityId)
        {
            return await _sdeRepository.GetProductIdByBlueprintIdAsync(typeId, activityId);
        }
        async Task<BPMaterial[]> ISDEService.GetUnbuildableBPMaterials(int blueprintTypeId)
        {
            var result = await _sdeRepository.GetUnbuildableBlueprintMaterialsAsync(blueprintTypeId);
            if (result != null) { return result!.ToArray(); }
            else return [];
        }
        Task<int?> ISDEService.HowManyProductsMadeAsync(int productId)
        {
            return _sdeRepository.HowManyProductsMadeAsync(productId);
        }
        bool ISDEService.IsBlueprintProductOfInvention(int blueprintProductId)
        {
            return _sdeRepository.IsBlueprintProductOfInvention(blueprintProductId);
        }
        async Task<string[]> ISDEService.SearchBlueprintsAsync(string searchTerm)
        {
            return await _sdeRepository.GetBlueprintNamesAsync(searchTerm);
        }
    }
}
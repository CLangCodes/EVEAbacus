using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Infrastructure.Data;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System;
using System.Diagnostics;
using System.Linq;
using static NuGet.Packaging.PackagingConstants;

namespace EVEAbacus.Infrastructure.Services
{
    public class SDERepository : ISDERepository
    {
        private readonly IDbContextFactory<EVEAbacusDbContext> _dbContextFactory;
        public SDERepository(IDbContextFactory<EVEAbacusDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }
        bool ISDERepository.CanItemBeManufactured(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.industryBlueprints.Any(e => e.BPProducts.Any(p => p.ProductTypeId == typeId));
        }
        async Task<int?> ISDERepository.CanThisBeBuiltAsync(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.industryActivityProducts
                .AsNoTracking()
                .Where(p => p.ProductTypeId == typeId
                    && p.ActivityId == 1)
                .FirstOrDefaultAsync();
            if (data == null) { return null; }
            else { return data.BlueprintTypeId; }
        }
        bool ISDERepository.DoesBlueprintExist(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.industryBlueprints.Any(e => e.BlueprintTypeId == typeId);
        }
        bool ISDERepository.DoesItemExist(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.invTypes.Any(e => e.TypeId == typeId);
        }
        async Task<Blueprint?> ISDERepository.GetBlueprintAsync(int typeId, byte? activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.industryBlueprints
                .Include(bp => bp.BPTimes)
                .Include(bp => bp.BPSkills).ThenInclude(sk => sk.Skill).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(bp => bp.BPProducts).ThenInclude(pr => pr.Product).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(m => m.BPMaterials).ThenInclude(m => m.Material).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .FirstOrDefaultAsync(b => b.BlueprintTypeId == typeId);

            if (data == null) { return null; }
            if (activityId.HasValue)
            {
                data.BPTimes = data.BPTimes.Where(t => t.ActivityId == activityId).ToList();
                data.BPSkills = data.BPSkills.Where(s => s.ActivityId == activityId).ToList();
                data.BPProducts = data.BPProducts.Where(p => p.ActivityId == activityId).ToList();
                data.BPMaterials = data.BPMaterials.Where(m => m.ActivityId == activityId).ToList();
            }
            return data;
        }
        async Task<int?> ISDERepository.GetBlueprintIdByProductIdAsync(int productId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var result = await context.industryActivityProducts
                .FirstOrDefaultAsync(e => e.ProductTypeId == productId);
            if (result == null)
            {
                return null;
            }
            return result.BlueprintTypeId;
        }
        async Task<List<BPMaterial>?> ISDERepository.GetBlueprintMaterialsAsync(int blueprintTypeId, byte? activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var query = context.industryActivityMaterials
                .Where(bp => bp.BlueprintTypeId == blueprintTypeId);

            if (activityId.HasValue)
            {
                query = query.Where(bpm => bpm.ActivityId == activityId.Value);
            }

            var data = await query
                .AsNoTracking()
                .Include(m => m.Material).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<string[]> ISDERepository.GetBlueprintNamesAsync(string searchTerm)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.industryBlueprints
                .Where(bp => bp.ItemProperty!.TypeName != null && bp.ItemProperty.TypeName.Contains(searchTerm))
                .OrderBy(bp => bp.ItemProperty!.TypeName)
                .Take(10)
                .Select(bp => bp.ItemProperty!.TypeName!)
                .ToArrayAsync();
        }
        async Task<List<BPProduct>?> ISDERepository.GetBlueprintProductsAsync(int typeId, byte? activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var query = context.industryActivityProducts
                .Where(bp => bp.BlueprintTypeId == typeId);

            if (activityId.HasValue)
            {
                query = query.Where(bpm => bpm.ActivityId == activityId.Value);
            }

            var data = await query
                .AsNoTracking()
                .Include(m => m.Product).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<List<BPSkill>?> ISDERepository.GetBlueprintSkillsAsync(int typeId, byte? activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var query = context.industryActivitySkills
                .Where(bp => bp.BlueprintTypeId == typeId);

            if (activityId.HasValue)
            {
                query = query.Where(bpm => bpm.ActivityId == activityId.Value);
            }

            var data = await query
                .AsNoTracking()
                .Include(m => m.Skill).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<List<BPTime>?> ISDERepository.GetBlueprintTimesAsync(int typeId, byte? activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var query = context.industryActivities
                .Where(bp => bp.BlueprintTypeId == typeId);

            if (activityId.HasValue)
            {
                query = query.Where(bpm => bpm.ActivityId == activityId.Value);
            }

            var data = await query
                .AsNoTracking()
                .Include(m => m.Time)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<List<BPMaterial>?> ISDERepository.GetBuildableBlueprintMaterialsAsync(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var data = await context.industryActivityMaterials
                .Where(bp => bp.BlueprintTypeId == typeId && bp.ActivityId == 1)
                .AsNoTracking()
                .Include(m => m.Material).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .ToListAsync();
            var filteredData = new List<BPMaterial>();
            foreach (var bp in data)
            {
                var bpTypeId = await ((ISDERepository)this).CanThisBeBuiltAsync((int)bp.MaterialTypeId!);
                if (bpTypeId != null)
                {
                    filteredData.Add(bp);
                }
            }

            return filteredData;
        }
        async Task<int[]?> ISDERepository.GetGroupIdsInCategory(int categoryId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var result = await context.invGroups
                .Where(g => g.CategoryId == categoryId)
                .Select(g => g.GroupId)
                .ToListAsync();
            return result?.ToArray();
        }
        async Task<float> ISDERepository.GetInventionChance(int blueprintTypeId, int productTypeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var result = await context.industryActivityProducts
                .Where(e => e.BlueprintTypeId == blueprintTypeId &&
                            e.ProductTypeId == productTypeId)
                .Select(e => e.Probability)
                .FirstOrDefaultAsync();
            if (result == null)
            {
                return 0f;
            }
            return (float)result;
        }
        async Task<int?> ISDERepository.GetProductIdByBlueprintIdAsync(int typeId, byte activityId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var result = await context.industryActivityProducts
                .Where(e => e.BlueprintTypeId == typeId)
                .FirstOrDefaultAsync(e => e.ActivityId == activityId);
            if (result == null)
            {
                return null;
            }
            return result.ProductTypeId;
        }
        async Task<string[]> ISDERepository.GetInventionSkillsAsync()
        {
            using var context = _dbContextFactory.CreateDbContext();

            var data = await context.industryActivitySkills
                .Where(s => s.ActivityId == 8 && s.Skill!.TypeName != string.Empty)
                .Select(s => (string)s.Skill!.TypeName!)
                .Distinct()
                .OrderBy(s => s)
                .ToListAsync();
            return data.ToArray();
        }
        async Task<string[]> ISDERepository.GetInventionTargetsBySkillsAsync(int[] skillIds)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var results = await context.industryActivitySkills
                .Where(s => s.ActivityId == 8 && skillIds.Contains((int)s.SkillId!))
                .GroupBy(s => s.BlueprintTypeId)
                .Where(g => g.Select(x => x.SkillId!).Distinct().Count() >= 3)
                .Select(g => (string)g.First().Blueprint!.ItemProperty!.TypeName!)
                .ToListAsync();

            return results.ToArray();
        }
        async Task<Item?> ISDERepository.GetItemAsync(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var data = await context.invTypes
                .AsNoTracking()
                .Include(bp => bp.Group).ThenInclude(gr => gr!.Category)
                .FirstOrDefaultAsync(b => b.TypeId == typeId);

            return data;
        }
        async Task<string?> ISDERepository.GetItemNameAsync(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.invTypes
                .AsNoTracking()
                .FirstOrDefaultAsync(b => b.TypeId == typeId);

            if (data == null) { return null; } else { return data.TypeName; }
        }
        async Task<Item[]?> ISDERepository.GetItemsInGroup(int groupId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.invTypes
                .Where(b => b.GroupId == groupId)
                .AsNoTracking()
                .ToListAsync();

            return data?.ToArray();
        }

        async Task<int?> ISDERepository.GetItemTypeIdAsync(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.invTypes
                .AsNoTracking()
                .Include(it => it!.Group).ThenInclude(gr => gr!.Category)
                .FirstOrDefaultAsync(b => b.TypeName == name);

            if (data == null) { return null; } else { return data.TypeId; }
        }
        async Task<List<BPMaterial>?> ISDERepository.GetUnbuildableBlueprintMaterialsAsync(int typeId)
        {
            using var context = _dbContextFactory.CreateDbContext();

            var data = await context.industryActivityMaterials
                .Where(bp => bp.BlueprintTypeId == typeId && bp.ActivityId == 1)
                .AsNoTracking()
                .Include(m => m.Material).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .ToListAsync();

            var filteredData = new List<BPMaterial>();
            foreach (var bp in data)
            {
                if ((await ((ISDERepository)this).CanThisBeBuiltAsync((int)bp.MaterialTypeId!) == null))
                {
                    filteredData.Add(bp);
                }
            }
            return filteredData.Any() ? filteredData : null;
        }
        async Task<int?> ISDERepository.HowManyProductsMadeAsync(int productId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.industryActivityProducts
                .Where(bp => bp.ProductTypeId == productId
                    && bp.ActivityId == 1)
                .AsNoTracking()
                .FirstOrDefaultAsync();
            return data!.Quantity;
        }
        bool ISDERepository.IsBlueprintProductOfInvention(int blueprintProductId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.industryActivityProducts.Any(pr => pr.ProductTypeId == blueprintProductId &&
                                                              pr.ActivityId == 8);
        }

        
    }
}

using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Map;
using EVEAbacus.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace EVEAbacus.Infrastructure.Repositories
{
    public class MapRepository : IMapRepository
    {
        private readonly IDbContextFactory<EVEAbacusDbContext> _dbContextFactory;

        private readonly List<long> PlanetTypeIds = [11, 12, 13, 2014, 2015, 2016, 2017, 2063,
            56018, 56019, 56020, 56021, 56022, 56023, 56024];

        public MapRepository(IDbContextFactory<EVEAbacusDbContext> dbContextFactory)
        {
            _dbContextFactory = dbContextFactory;
        }
        async Task<Constellation> IMapRepository.GetConstellation(int id)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapConstellations
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.ConstellationId == id);

            if (data == null) { return null; }
            else { return data; }

        }
        async Task<int?> IMapRepository.GetConstellationId(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapConstellations
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.ConstellationName == name);

            if (data == null) { return null; }
            else { return data.ConstellationId; }
        }
        async Task<string[]> IMapRepository.GetConstellationNamesInRegion(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapConstellations
                .AsNoTracking()
                .Where(ss => ss.RegionId == regionId
                    && ss.ConstellationName != null)
                .OrderBy(ss => ss.ConstellationName)
                .Select(ss => ss.ConstellationName!)
                .ToArrayAsync();
        }
        async Task<IQueryable<Constellation>> IMapRepository.GetConstellations()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapConstellations
                .AsNoTracking()
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }
        async Task<IQueryable<Constellation>> IMapRepository.GetConstellationsInRegion(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapConstellations
                .AsNoTracking()
                .Where(co => co.RegionId == regionId)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }

        async Task<Denormalize> IMapRepository.GetPlanet(int id)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(x => x.SolarSystem)
                .Include(x => x.Constellation)
                .Include(x => x.Region)
                .FirstOrDefaultAsync(x => x.ItemId == id);

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<long?> IMapRepository.GetPlanetId(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                
                .FirstOrDefaultAsync(x => x.Name.ItemName == name);

            if (data == null) { return null; }
            else { return data.ItemId; }
        }

        async Task<string[]> IMapRepository.GetPlanetNamesInConstellation(int constellationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Where( ss => ss.ConstellationId == constellationId
                    && ss.Name != null)
                .OrderBy(ss => ss.Name.ItemName)
                .Select(ss => ss.Name.ItemName!)
                .ToArrayAsync();
        }
        async Task<string[]> IMapRepository.GetPlanetNamesInRegion(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Where( ss => ss.RegionId == regionId
                    && ss.Name != null)
                .OrderBy(ss => ss.Name.ItemName)
                .Select(ss => ss.Name.ItemName!)
                .ToArrayAsync();
        }
        async Task<string[]> IMapRepository.GetPlanetNamesInSolarSystem(int solarSystemId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Where( ss => ss.SolarSystemId == solarSystemId
                    && ss.Name != null)
                .OrderBy(ss => ss.Name.ItemName)
                .Select(ss => ss.Name.ItemName!)
                .ToArrayAsync();
        }
        async Task<IQueryable<Denormalize>> IMapRepository.GetPlanets()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize.Where(x => PlanetTypeIds.Contains((int)x.TypeId!))
                .AsNoTracking()
                .Include(x => x.Name)
                .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(x => x.SolarSystem)
                .Include(x => x.Constellation)
                .Include(x => x.Region)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }
        async Task<List<Denormalize>> IMapRepository.GetPlanetsInChunk(int[] solarSystemIds)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapDenormalize.Where(x => solarSystemIds.Contains((int)x.SolarSystemId!) 
                && PlanetTypeIds.Contains((int)x.TypeId!))
               .AsNoTracking()
               .Include(x => x.Name)
               .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
               .Include(x => x.SolarSystem)
               .Include(x => x.Constellation)
               .Include(x => x.Region)
               .ToListAsync();
        }

        async Task<IQueryable<Denormalize>> IMapRepository.GetPlanetsInConstellation(
            int constellationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(x => x.SolarSystem)
                .Include(x => x.Constellation)
                .Include(x => x.Region)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }
        async Task<IQueryable<Denormalize>> IMapRepository.GetPlanetsInRegion(
            int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(x => x.SolarSystem)
                .Include(x => x.Constellation)
                .Include(x => x.Region)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }
        async Task<IQueryable<Denormalize>> IMapRepository.GetPlanetsInSolarSystem(
            int solarSystemId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapDenormalize
                .AsNoTracking()
                .Include(x => x.Name)
                .Include(x => x.Item).ThenInclude(it => it!.Group).ThenInclude(gr => gr!.Category)
                .Include(x => x.SolarSystem)
                .Include(x => x.Constellation)
                .Include(x => x.Region)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }

        async Task<Region> IMapRepository.GetRegion(int id)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapRegions
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.RegionId == id);

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<int?> IMapRepository.GetRegionId(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapRegions
                .AsNoTracking()
                .FirstOrDefaultAsync(x => x.RegionName == name);

            if (data == null) { return null; }
            else { return data.RegionId; }
        }
        async Task<string> IMapRepository.GetRegionName(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapRegions
                .AsNoTracking()
                .Where(x => x.RegionId == regionId)
                .Select(ss => ss.RegionName!)
                .FirstOrDefaultAsync() ?? "Region Not Found";
        }
        async Task<string[]> IMapRepository.GetRegionNames()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapRegions
                .AsNoTracking()
                .Where(ss => ss.RegionName != null)
                .OrderBy(ss => ss.RegionName)
                .Select(ss => ss.RegionName!)
                .ToArrayAsync();
        }
        async Task<IQueryable<Region>> IMapRepository.GetRegions()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapRegions
                .AsNoTracking()
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }

        async Task<SolarSystem> IMapRepository.GetSolarSystem(int id)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.SolarSystemId == id);

            if (data == null) { return null; }
            else { return data; }
        }

        async Task<SolarSystem?> IMapRepository.GetSolarSystemByStationId(int id)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var station = await context.staStations
                .AsNoTracking()
                .FirstOrDefaultAsync(st => st.StationId == id);
            if (station == null) { return null; }

            var solarSystem = await context.mapSolarSystems
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.SolarSystemId == id);

            if (solarSystem == null) { return null; }
            else { return solarSystem; }
        }
        async Task<int?> IMapRepository.GetSolarSystemId(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()

                .FirstOrDefaultAsync(x => x.SolarSystemName == name);

            if (data == null) { return null; }
            else { return data.SolarSystemId; }
        }
        async Task<int[]> IMapRepository.GetSolarSystemJumps(int solarSystemId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystemJumps
                .AsNoTracking()
                .Where(x => x.FromSolarSystemId == solarSystemId)
                .Select(x => x.ToSolarSystemId)
                .ToArrayAsync();

            if (data == null) { return null; }
            else { return data; }
        }
        async Task<string[]> IMapRepository.GetSolarSystemNames()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.SolarSystemName != null)
                .OrderBy(ss => ss.SolarSystemName)
                .Select(ss => ss.SolarSystemName!)
                .ToArrayAsync();
        }
        async Task<string[]> IMapRepository.GetSolarSystemNamesInConstellation(int constellationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.SolarSystemName != null 
                    && ss.ConstellationId == constellationId)
                .OrderBy(ss => ss.SolarSystemName)
                .Select(ss => ss.SolarSystemName!)
                .ToArrayAsync();
        }
        async Task<string[]> IMapRepository.GetSolarSystemNamesInRegion(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.SolarSystemName != null 
                    && ss.RegionId == regionId)
                .OrderBy(ss => ss.SolarSystemName)
                .Select(ss => ss.SolarSystemName!)
                .ToArrayAsync();
        }
        async Task<IQueryable<SolarSystem>> IMapRepository.GetSolarSystems()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }

        async Task<IQueryable<SolarSystem>> IMapRepository.GetSolarSystemsInConstellation(int constellationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.ConstellationId == constellationId)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }
        async Task<IQueryable<SolarSystem>> IMapRepository.GetSolarSystemsInRegion(int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.RegionId == regionId)
                .ToListAsync();

            if (data == null) { return null; }
            else { return data.AsQueryable(); }
        }

        async Task<float?> IMapRepository.GetSolarSystemSecurityStatus(int solarSystemId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.mapSolarSystems
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.SolarSystemId == solarSystemId);
            if (data == null) { return null; }
            else { return data.Security; }
        }

        async Task<Station?> IMapRepository.GetStationAsync(long stationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.staStations
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => (int)(ss.StationId) == stationId);
            if (data == null) { return null; }
            return data;
        }
        
        async Task<long?> IMapRepository.GetStationId(string name)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.invNames
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.ItemName == name);
            if (data == null) { return null; }
            return data.ItemId;
        }
        
        async Task<string?> IMapRepository.GetStationName(long stationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.invNames
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.ItemId == stationId);
            if (data == null) { return null; }
            return data.ItemName;
        }

        async Task<string[]> IMapRepository.SearchSolarSystemNamesAsync(
            string searchTerm)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapSolarSystems
                .Where(ss => ss.SolarSystemName != null && ss.SolarSystemName.Contains(searchTerm))
                .OrderBy(ss => ss.SolarSystemName)
                .Take(10)
                .Select(ss => ss.SolarSystemName!)
                .ToArrayAsync();
        }
        async Task<string[]> IMapRepository.SearchSolarSystemNamesAsync()
        {
            using var context = _dbContextFactory.CreateDbContext();
            return await context.mapSolarSystems
                .AsNoTracking()
                .Where(ss => ss.SolarSystemName != null)
                .OrderBy(ss => ss.SolarSystemName)
                .Select(ss => ss.SolarSystemName!)
                .ToArrayAsync();
        }

        async Task<int> IMapRepository.GetRegionIdFromStationId(long stationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.staStations
                .AsNoTracking()
                .FirstOrDefaultAsync(ss => ss.StationId == stationId);
            if (data == null) { return 0; }
            return data.RegionId;
        }
    }
}

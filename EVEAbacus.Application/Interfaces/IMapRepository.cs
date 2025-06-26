using EVEAbacus.Domain.Models.Map;

namespace EVEAbacus.Application.Interfaces
{
    public interface IMapRepository
    {
        Task<Constellation> GetConstellation(int id);
        Task<int?> GetConstellationId(string name);
        Task<string[]> GetConstellationNamesInRegion(int regionId);
        Task<IQueryable<Constellation>> GetConstellations();
        Task<IQueryable<Constellation>> GetConstellationsInRegion(int regionId);

        Task<Denormalize> GetPlanet(int id);
        Task<long?> GetPlanetId(string name);
        Task<string[]> GetPlanetNamesInConstellation(int constellationId);
        Task<string[]> GetPlanetNamesInRegion(int regionId);
        Task<string[]> GetPlanetNamesInSolarSystem(int solarSystemId);
        Task<IQueryable<Denormalize>> GetPlanets();
        Task<List<Denormalize>> GetPlanetsInChunk(int[] solarSystemIds);
        Task<IQueryable<Denormalize>> GetPlanetsInConstellation(int constellationId);
        Task<IQueryable<Denormalize>> GetPlanetsInRegion(int regionId);
        Task<IQueryable<Denormalize>> GetPlanetsInSolarSystem(int solarSystemId);
        Task<Region> GetRegion(int id);
        Task<int?> GetRegionId(string name);
        Task<int> GetRegionIdFromStationId(long stationId);
        Task<string> GetRegionName(int regionId);
        Task<string[]> GetRegionNames();
        Task<IQueryable<Region>> GetRegions();
        Task<SolarSystem> GetSolarSystem(int id);
        Task<SolarSystem?> GetSolarSystemByStationId(int id);
        Task<int?> GetSolarSystemId(string name);
        Task<int[]> GetSolarSystemJumps(int solarSystemId);
        Task<string[]> GetSolarSystemNames();
        Task<string[]> GetSolarSystemNamesInConstellation(int constellationId);
        Task<string[]> GetSolarSystemNamesInRegion(int regionId);
        Task<IQueryable<SolarSystem>> GetSolarSystems();
        Task<IQueryable<SolarSystem>> GetSolarSystemsInConstellation(int constellationId);
        Task<IQueryable<SolarSystem>> GetSolarSystemsInRegion(int regionId);
        Task<float?> GetSolarSystemSecurityStatus(int solarSystemId);
        Task<Station?> GetStationAsync(long stationId);
        Task<long?> GetStationId(string name);
        Task<string?> GetStationName(long stationId);
        Task<string[]> SearchSolarSystemNamesAsync();
        Task<string[]> SearchSolarSystemNamesAsync(string searchTerm);

    }
}

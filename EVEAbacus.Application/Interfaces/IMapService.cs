using EVEAbacus.Domain.Models.Map;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Interfaces
{
    public interface IMapService
    {
        IQueryable<Region>? Regions { get; set; }
        IQueryable<Constellation>? Constellations { get; set; }
        IQueryable<SolarSystem>? SolarSystems { get; set; }
        IQueryable<Denormalize>? Planets { get; set; }
        List<string> PlanetTypes { get; set; }
        Task<Constellation> GetConstellation(int id, int? focalId, string? routeFlag);
        Task<int?> GetConstellationId(string name);
        Task<string[]> GetConstellationNamesInRegion(int regionId);
        Task<IQueryable<Constellation>> GetConstellations();
        Task<IQueryable<Constellation>> GetConstellationsInRegion(int regionId);
        int[] GetMarketHubRegionIds();
        Task<string[]> GetMarketHubNames();
        long[] GetMarketHubStationIds();
        Task<Denormalize> GetPlanet(int id, int? focalId, string? routeFlag);
        Task<long?> GetPlanetId(string name);
        Task<string[]> GetPlanetNamesInConstellation(int constellationId, int? focalId, string? routeFlag);
        Task<string[]> GetPlanetNamesInRegion(int regionId, int? focalId, string? routeFlag);
        Task<string[]> GetPlanetNamesInSolarSystem(int solarSystemId, int? focalId, string? routeFlag);
        Task<IQueryable<Denormalize>> GetPlanets(int? focalId, string? routeFlag);
        Task<IQueryable<Denormalize>> GetPlanets(string focalSystemName, string? routeFlag, int range);
        Task<List<Denormalize>> GetPlanetsInChunk(int[] solarSystemIds);
        Task<IQueryable<Denormalize>> GetPlanetsInConstellation(int constellationId, int? focalId, string? routeFlag);
        Task<IQueryable<Denormalize>> GetPlanetsInRegion(int regionId, int? focalId, string? routeFlag);
        Task<IQueryable<Denormalize>> GetPlanetsInSolarSystem(int solarSystemId, int? focalId, string? routeFlag);
        string[] GetPlanetTypeArray();
        Task<Region> GetRegion(int id);
        Task<int?> GetRegionId(string name);
        Task<int> GetRegionIdFromStationId(long stationId);
        Task<string> GetRegionName(int regionId);
        Task<string[]> GetRegionNames();
        Task<IQueryable<Region>> GetRegions();
        Task<SolarSystem> GetSolarSystem(int id);
        Task<SolarSystem?> GetSolarSystemByStationId(int id);
        Task<int?> GetSolarSystemId(string name);
        Task<string[]> GetSolarSystemNames();
        Task<string[]> GetSolarSystemNamesInConstellation(int constellationId);
        Task<string[]> GetSolarSystemNamesInRegion(int regionId);
        Task<IQueryable<SolarSystem>> GetSolarSystems(int? focalId, string? routeFlag);
        Task<IQueryable<SolarSystem>> GetSolarSystemsInConstellation(int constellationId, int? focalId, string? routeFlag);
        Task<int[]> GetSolarSystemsInRange(int focalSystemId, int range);
        Task<IQueryable<SolarSystem>> GetSolarSystemsInRegion(int regionId, int? focalId, string? routeFlag);
        Task<float?> GetSolarSystemSecurityStatus(int solarSystemId);
        Task<Station?> GetStationAsync(long stationId);
        Task<long?> GetStationId(string name);
        Task<string?> GetStationName(long stationId);

        Task LoadMapDb(int? focalId, string? routeFlag);
        Task<string[]> SearchSolarSystemNamesAsync();
        Task<string[]> SearchSolarSystemNamesAsync(string searchTerm);

        Task<Denormalize[]> SelectPlanetsAsync(string focalSystemName, int range, string[]? securityStatus, string[]? planetTypes);
    }
}

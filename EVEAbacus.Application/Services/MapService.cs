using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Map;
using System.Diagnostics;
using System.Numerics;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Services
{
    public class MapService : IMapService
    {
        private readonly IMapRepository _mapRepository;
        private readonly IESIService _eSIService;
        public int[] MarketHubRegionIds { get; set; } =
                    [10000002,
                    10000043,
                    10000030,
                    10000032,
                    10000042];
        public long[] MarketHubStationIds { get; set; } =
                    [60008494,
                    60011866,
                    60005686,
                    60003760,
                    60004588];
        IQueryable<Region>? IMapService.Regions { get; set; }
        IQueryable<Constellation>? IMapService.Constellations { get; set; }
        IQueryable<SolarSystem>? IMapService.SolarSystems { get; set; }
        IQueryable<Denormalize>? IMapService.Planets { get; set; }

        List<string> IMapService.PlanetTypes { get; set; } =
        [
        "Planet (Barren)",
        "Planet (Gas)",
        "Planet (Ice)",
        "Planet (Lava)",
        "Planet (Oceanic)",
        "Planet (Plasma)",
        "Planet (Storm)",
        "Planet (Temperate)",
        ];

        string[] planetTypeArray = [
        "Planet (Barren)",
        "Planet (Gas)",
        "Planet (Ice)",
        "Planet (Lava)",
        "Planet (Oceanic)",
        "Planet (Plasma)",
        "Planet (Storm)",
        "Planet (Temperate)",
        ];

        public MapService(
            IMapRepository mapRepository, IESIService eSIService)
        {
            _mapRepository = mapRepository;
            _eSIService = eSIService;
        }
        async Task<Constellation> IMapService.GetConstellation(
            int id, int? focalId, string? routeFlag)
        {
            return await _mapRepository.GetConstellation(id);
        }
        async Task<int?> IMapService.GetConstellationId(string name)
        {
            return await _mapRepository.GetConstellationId(name);
        }
        async Task<string[]> IMapService.GetConstellationNamesInRegion(int regionId)
        {
            return await _mapRepository.GetConstellationNamesInRegion(regionId);
        }
        async Task<IQueryable<Constellation>> IMapService.GetConstellations()
        {
            return await _mapRepository.GetConstellations();
        }
        async Task<IQueryable<Constellation>> IMapService.GetConstellationsInRegion(
            int regionID)
        {
            var constellations = await _mapRepository.GetConstellationsInRegion(regionID);

            return constellations;
        }
        int[] IMapService.GetMarketHubRegionIds()
        {
            return MarketHubRegionIds;
        }
        async Task<Denormalize> IMapService.GetPlanet(
            int id, int? focalId, string? routeFlag)
        {
            var planet = await _mapRepository.GetPlanet(id);
            if (focalId != null)
            {
                planet.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                (int)planet.SolarSystemId!, (int)focalId!, routeFlag);
            }
            return planet;
        }
        async Task<long?> IMapService.GetPlanetId(string name)
        {
            return await _mapRepository.GetPlanetId(name);
        }
        async Task<string[]> IMapService.SearchSolarSystemNamesAsync()
        {
            return await _mapRepository.SearchSolarSystemNamesAsync();
        }
        async Task<string[]> IMapService.GetPlanetNamesInConstellation(int constellationId, int? focalId, string? routeFlag)
        {
            return await _mapRepository.GetPlanetNamesInConstellation(constellationId);
        }
        async Task<string[]> IMapService.GetPlanetNamesInRegion(int regionId, int? focalId, string? routeFlag)
        {
            return await _mapRepository.GetPlanetNamesInRegion(regionId);
        }
        async Task<string[]> IMapService.GetPlanetNamesInSolarSystem(int solarSystemId, int? focalId, string? routeFlag)
        {
            return await _mapRepository.GetPlanetNamesInSolarSystem(solarSystemId);
        }
        async Task<IQueryable<Denormalize>> IMapService.GetPlanets(
            int? focalId, string? routeFlag)
        {
            var planets = await _mapRepository.GetPlanets();
            if (focalId != null)
            {
                foreach (var p in planets)
                {
                    p.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        (int)p.SolarSystemId!, (int)focalId, routeFlag);
                }
            }
            return planets;
        }
        async Task<IQueryable<Denormalize>> IMapService.GetPlanets(
            string focalSystemName, string? routeFlag, int range)
        {
            var planetId = await _mapRepository.GetPlanetId(focalSystemName);
            var planets = await _mapRepository.GetPlanets();
            if (planetId != null)
            {
                foreach (var p in planets)
                {
                    p.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        (int)p.SolarSystemId!, (int)planetId, routeFlag);
                }
            }
            return planets;
        }
        async Task<IQueryable<Denormalize>> IMapService.GetPlanetsInConstellation(
            int constellationId, int? focalId, string? routeFlag)
        {
            var planets = await _mapRepository.GetPlanetsInConstellation(constellationId);
            if (focalId != null)
            {
                foreach (var p in planets)
                {
                    p.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        (int)p.SolarSystemId!, (int)focalId, routeFlag);
                }
            }
            return planets;
        }
        async Task<IQueryable<Denormalize>> IMapService.GetPlanetsInRegion(
            int regionId, int? focalId, string? routeFlag)
        {
            var planets = await _mapRepository.GetPlanetsInRegion(regionId);
            if (focalId != null)
            {
                foreach (var p in planets)
                {
                    p.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        (int)p.SolarSystemId!, (int)focalId, routeFlag);
                }
            }
            return planets;
        }
        async Task<IQueryable<Denormalize>> IMapService.GetPlanetsInSolarSystem(
            int solarSystemId, int? focalId, string? routeFlag)
        {
            var planets = await _mapRepository.GetPlanetsInSolarSystem(solarSystemId);
            if (focalId != null)
            {
                foreach (var p in planets)
                {
                    p.SolarSystem!.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        (int)p.SolarSystemId!, (int)focalId, routeFlag);
                }
            }
            return planets;
        }
        string[] IMapService.GetPlanetTypeArray()
        {
            return planetTypeArray;
        }
        async Task<Region> IMapService.GetRegion(int id)
        {
            return await _mapRepository.GetRegion(id);
        }
        async Task<int?> IMapService.GetRegionId(string name)
        {
            return await _mapRepository.GetRegionId(name);
        }
        async Task<string> IMapService.GetRegionName(int regionId)
        {
            return await _mapRepository.GetRegionName(regionId);
        }
        async Task<string[]> IMapService.GetRegionNames()
        {
            return await _mapRepository.GetRegionNames();
        }
        async Task<IQueryable<Region>> IMapService.GetRegions()
        {
            return await _mapRepository.GetRegions();
        }

        async Task<SolarSystem> IMapService.GetSolarSystem(int id)
        {
            return await _mapRepository.GetSolarSystem(id);
        }
        
        async Task<SolarSystem?> IMapService.GetSolarSystemByStationId(int stationId)
        {
            return await _mapRepository.GetSolarSystemByStationId(stationId);
        }

        async Task<int?> IMapService.GetSolarSystemId(
            string name)
        {
            return await _mapRepository.GetSolarSystemId(name);
        }
        async Task<string[]> IMapService.GetSolarSystemNames()
        {
            return await _mapRepository.GetSolarSystemNames();
        }
        async Task<string[]> IMapService.GetSolarSystemNamesInConstellation(int constellationId)
        {
            return await _mapRepository.GetSolarSystemNamesInConstellation(constellationId);
        }
        async Task<string[]> IMapService.GetSolarSystemNamesInRegion(int regionId)
        {
            return await _mapRepository.GetSolarSystemNamesInRegion(regionId);
        }
        async Task<IQueryable<SolarSystem>> IMapService.GetSolarSystems(
            int? focalId, string? routeFlag)
        {
            var solarSystems = await _mapRepository.GetSolarSystems();
            if (focalId != null)
            {
                foreach (var s in solarSystems)
                {
                    s.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        s.SolarSystemId, (int)focalId, routeFlag);
                }
            }
            return solarSystems;
        }
        async Task<IQueryable<SolarSystem>> IMapService.GetSolarSystemsInConstellation(
            int constellationId, int? focalId, string? routeFlag)
        {
            var solarSystems = await _mapRepository.GetSolarSystemsInConstellation(
                constellationId);
            if (focalId != null)
            {
                foreach (var s in solarSystems)
                {
                    s.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        s.SolarSystemId, (int)focalId, routeFlag);
                }
            }
            return solarSystems;
        }
        async Task<IQueryable<SolarSystem>> IMapService.GetSolarSystemsInRegion(
            int regionId, int? focalId, string? routeFlag)
        {
            var solarSystems = await _mapRepository.GetSolarSystemsInRegion(regionId);
            if (focalId != null)
            {
                foreach (var s in solarSystems)
                {
                    s.JumpDistance = await _eSIService.GetNumberOfJumpsAsync(
                        s.SolarSystemId, (int)focalId, routeFlag);
                }
            }
            return solarSystems;
        }

        async Task IMapService.LoadMapDb(
            int? focalId, string? routeFlag)
        {
            ((IMapService)this).Planets = await ((IMapService)this).GetPlanets(focalId, routeFlag);
            ((IMapService)this).Regions = await ((IMapService)this).GetRegions();
            ((IMapService)this).Constellations = await ((IMapService)this).GetConstellations();
            ((IMapService)this).SolarSystems = await ((IMapService)this).GetSolarSystems(focalId, routeFlag);
        }
        public async Task<string[]> SearchSolarSystemNamesAsync(
            string searchTerm)
        {
            if (String.IsNullOrEmpty(searchTerm))
            {
                return await _mapRepository.GetSolarSystemNames();
            }
            return await _mapRepository.SearchSolarSystemNamesAsync(searchTerm);
        }

        async Task<int[]> IMapService.GetSolarSystemsInRange(int focalSystemId, int range)
        {
            HashSet<int> visitedSystems = new() { focalSystemId };
            Queue<int> toProcess = new();
            toProcess.Enqueue(focalSystemId);

            for (int i = 0; i < range; i++)
            {
                int count = toProcess.Count;
                for (int j = 0; j < count; j++)
                {
                    int currentSystem = toProcess.Dequeue();
                    var jumpList = await _mapRepository.GetSolarSystemJumps(currentSystem);

                    foreach (var system in jumpList)
                    {
                        if (!visitedSystems.Contains(system))
                        {
                            visitedSystems.Add(system);
                            toProcess.Enqueue(system);
                        }
                    }
                }
            }

            return visitedSystems.ToArray();
        }
        
        async Task<float?> IMapService.GetSolarSystemSecurityStatus(int solarSystemId)
        {
            return await _mapRepository.GetSolarSystemSecurityStatus(solarSystemId);
        }

        async Task<Station?> IMapService.GetStationAsync(long stationId)
        {
            return await _mapRepository.GetStationAsync(stationId);
        }

        async Task<string?> IMapService.GetStationName(long stationId)
        {
            return await _mapRepository.GetStationName(stationId);
        }


        async Task<List<Denormalize>> IMapService.GetPlanetsInChunk(int[] solarSystemIds)
        {
            return await _mapRepository.GetPlanetsInChunk(solarSystemIds);
        }

        async Task<int> IMapService.GetRegionIdFromStationId(long stationId)
        {
            return await _mapRepository.GetRegionIdFromStationId(stationId);
        }

        long[] IMapService.GetMarketHubStationIds()
        {
            return MarketHubStationIds;
        }

        async Task<string[]> IMapService.GetMarketHubNames()
        {
            List<string> hubs = [];
            foreach (var i in MarketHubStationIds)
            {
                hubs.Add(await _mapRepository.GetStationName(i) ?? "");
            }
            return hubs.ToArray();
        }

        async Task<long?> IMapService.GetStationId(string name)
        {
            return await _mapRepository.GetStationId(name);
        }

        async Task<Denormalize[]> IMapService.SelectPlanetsAsync(string focalSystemName, int range, string[]? securityStatus, string[]? planetTypes)
        {
            var filteredPlanets = new HashSet<Denormalize>();
            securityStatus ??= [];
            planetTypes ??= [];

            if (string.IsNullOrEmpty(focalSystemName))
            {
                return filteredPlanets.ToArray();
            }

            var FocalSystemId = await ((IMapService)this).GetSolarSystemId(focalSystemName);
            if (FocalSystemId != null)
            {
                var planetsInRange = await ((IMapService)this).GetSolarSystemsInRange((int)FocalSystemId, range);
                Debug.WriteLine($"Planets in Range: {planetsInRange.Count()}");

                var allPlanets = await ((IMapService)this).GetPlanetsInChunk(planetsInRange);

                Func<float?, string> getSecurityCategory = secStatus =>
                secStatus > 0.45 ? "High Sec" :
                (secStatus >= 0.05 && secStatus <= 0.45) ? "Low Sec" :
                secStatus < 0.05 ? "Null Sec" :
                "Error";

                // Filter for specific planet type
                if (planetTypes!.Length != 0)
                {
                    Debug.WriteLine("Filtering planets by selected types");
                    filteredPlanets = allPlanets
                    .Where(pl => pl.Item != null
                        && planetTypes.Contains(pl.Item.TypeName!)).ToHashSet();
                                    }
                else
                {
                    Debug.WriteLine("No filters, resetting to full planet list");
                    filteredPlanets = allPlanets.ToHashSet();
                }
                if (securityStatus.Any())
                {
                    return filteredPlanets
                    .Where(pl => securityStatus.Contains(getSecurityCategory(pl.Security!)))
                    .ToArray();
                }
                return filteredPlanets.ToArray();
            }
            else
            {
                 return [];
            }
        }
    }
}

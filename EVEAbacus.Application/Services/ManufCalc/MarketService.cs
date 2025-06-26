using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.ESI.Market.DTO;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;
using Newtonsoft.Json;
using System;
using System.Collections.Concurrent;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;
using System.Threading;

namespace EVEAbacus.Application.Services.ManufCalc
{
    public class MarketService : IMarketService
    {
        List<MarketOrder> IMarketService.MarketOrders => _marketOrders.Values.SelectMany(list => list).ToList();
        private static readonly ConcurrentDictionary<int, List<MarketOrder>> _marketOrders = new();
        private static readonly ConcurrentDictionary<(int typeId, long stationId), MarketStat> _marketStats = new();
        
        List<MarketStat> IMarketService.MarketStats => _marketStats.Values.ToList();
        
        private readonly IMarketRepository _marketRepository;
        private readonly IESIService _esiService;
        private readonly IMapService _mapService;

        int[] IMarketService.MarketHubRegionIds { get; } =
                    [10000002,
                    10000043,
                    10000030,
                    10000032,
                    10000042];

        long[] IMarketService.MarketHubStationIds { get; } =
                    [60008494,
                    60011866,
                    60005686,
                    60003760,
                    60004588];

        public MarketService(IMarketRepository marketRepository, IESIService esiService, IMapService mapService)
        {
            _marketRepository = marketRepository;
            _esiService = esiService;
            _mapService = mapService;
        }

        static decimal CalculateMaterialCost(BOMLineItem[] billOfMaterials)
        {
            decimal materialCost = 0;
            foreach (var bomLineItem in billOfMaterials)
            {
                var lowestSellPrice = bomLineItem.MarketStats.MinBy(mkst => mkst.AverageSellPrice);

                materialCost += (lowestSellPrice!.AverageSellPrice * bomLineItem.Requisitioned);
            }
            return materialCost;
        }

        private async Task<MarketStat> CalculateMarketStatAsync(int typeId, long stationId)
        {
            var regionId = await _mapService.GetRegionIdFromStationId(stationId);
            
            if (!_marketOrders.TryGetValue(regionId, out var relevantOrders))
            {
                Console.WriteLine($"No market orders found for RegionId {regionId}");
                return new MarketStat
                {
                    TypeId = typeId,
                    StationId = stationId,
                    StationName = await _mapService.GetStationName(stationId) ?? string.Empty,
                    AverageSellPrice = 0,
                    SellVolume = 0,
                    AverageBuyPrice = 0,
                    BuyVolume = 0
                };
            }

            // Filter orders by TypeId and LocationId first
            var filteredOrders = relevantOrders
                .Where(o => o.TypeId == typeId && o.LocationId == stationId)
                .ToList();

            Console.WriteLine($"Orders for TypeId {typeId} at StationId {stationId}:");
            foreach (var order in filteredOrders)
            {
                Console.WriteLine($"Order: TypeId={order.TypeId}, StationId={order.LocationId}, " +
                                $"IsBuy={order.IsBuyOrder}, Price={order.Price}, Volume={order.VolumeRemain}");
            }

            if (!filteredOrders.Any())
            {
                Console.WriteLine($"No matching orders found for TypeId {typeId}, StationId {stationId}");
                return new MarketStat
                {
                    TypeId = typeId,
                    StationId = stationId,
                    StationName = await _mapService.GetStationName(stationId) ?? string.Empty,
                    AverageSellPrice = 0,
                    SellVolume = 0,
                    AverageBuyPrice = 0,
                    BuyVolume = 0
                };
            }

            decimal averageSellPrice = GetVolumeWeightedAverage(filteredOrders, isBuyOrder: false);
            decimal averageBuyPrice = GetVolumeWeightedAverage(filteredOrders, isBuyOrder: true);

            MarketStat marketStat = new MarketStat()
            {
                TypeId = typeId,
                StationId = stationId,
                StationName = await _mapService.GetStationName(stationId) ?? string.Empty,
                AverageSellPrice = averageSellPrice,
                SellVolume = filteredOrders.Where(o => !o.IsBuyOrder).Sum(o => (long)o.VolumeRemain),
                AverageBuyPrice = averageBuyPrice,
                BuyVolume = filteredOrders.Where(o => o.IsBuyOrder).Sum(o => (long)o.VolumeRemain)
            };

            return marketStat;
        }

        private decimal GetVolumeWeightedAverage(List<MarketOrder> orders, bool isBuyOrder)
        {
            // Filter to buy or sell
            var filtered = orders
                .Where(o => o.IsBuyOrder == isBuyOrder)
                .OrderByDescending(o => isBuyOrder ? o.Price : -o.Price) // Buy: high to low, Sell: low to high
                .ToList();

            long totalVolume = filtered.Sum(o => (long)o.VolumeRemain);
            long targetVolume = (long)Math.Ceiling(totalVolume * 0.05);

            long accumulatedVolume = 0;
            decimal weightedSum = 0;

            foreach (var order in filtered)
            {
                int volumeToUse = order.VolumeRemain;

                if (accumulatedVolume + volumeToUse > targetVolume)
                {
                    volumeToUse = (int)(targetVolume - accumulatedVolume);
                }

                weightedSum += order.Price * volumeToUse;
                accumulatedVolume += volumeToUse;

                if (accumulatedVolume >= targetVolume)
                    break;
            }

            return accumulatedVolume == 0 ? 0 : (weightedSum / accumulatedVolume);
        }

        MarketProfile IMarketService.GetMarketProfile(ManufBatch manufBatch)
        {
            var profile = new MarketProfile();

            decimal totalCost = 0;
            foreach (var item in manufBatch.SupplyPlan!.ProcurementPlans)
            {
                totalCost += item.EstimatedCost;
            }
            profile.MaterialCost = totalCost;

            foreach (var productionRoute in manufBatch.ProductionRouting.Where(prc => prc.Order.ParentBlueprintTypeId == 0
                            || prc.Order.ParentBlueprintTypeId == null))
            {
                // Get all orders for the material type from all regions
                var orders = _marketOrders.Values
                    .SelectMany(list => list)
                    .Where(or => or.TypeId == productionRoute.MaterialTypeId);

                profile.RevenueSellOrder += (GetVolumeWeightedAverage(orders.ToList(), false)) * productionRoute.Produced;
                //profile.RevenueSellOrder += (GetVolumeWeightedAverage(orders.ToList(), false)) * productionRoute.Requisitioned;
                profile.RevenueBuyOrder += (GetVolumeWeightedAverage(orders.ToList(), true)) * productionRoute.Produced; 
                //profile.RevenueBuyOrder += (GetVolumeWeightedAverage(orders.ToList(), true)) * productionRoute.Requisitioned;
            }
            return profile;
        }

        BOMLineItem[] IMarketService.GetMarketStatsForBillOfMaterials(BOMLineItem[] billOfMaterials, long[] stationIds)
        {
            int[] typeIds = billOfMaterials.Select(o => o.TypeId).Distinct().ToArray();
            
            foreach (var lineItem in billOfMaterials)
            {
                // Filter market stats by typeId and station, and ensure we have valid prices
                var marketStats = _marketStats.Values
                    .Where(x => 
                    {
                        var matches = x.TypeId == lineItem.TypeId && 
                                    stationIds.Contains(x.StationId) && 
                                    x.AverageSellPrice > 0;
                        return matches;
                    })
                    .ToList();

                lineItem.MarketStats = marketStats;
            }

            return billOfMaterials;
        }

        async Task IMarketService.UpdateMarketStats(int[] typeIds, long[] stationIds)
        {
            foreach (var typeId in typeIds)
            {
                foreach (var stationId in stationIds)
                {
                    var regionId = await _mapService.GetRegionIdFromStationId(stationId);
                    var key = (typeId, stationId);
                    if (regionId != 0 && !_marketStats.ContainsKey(key))
                    {
                        var newMarketStat = await CalculateMarketStatAsync(key.typeId, key.stationId);
                        _marketStats[key] = newMarketStat;
                    }
                }

                var staleKeys = _marketStats
                    .Where(kvp => (DateTime.UtcNow - kvp.Value.DateTime).TotalMinutes >= 60)
                    .Select(kvp => kvp.Key)
                    .ToList();

                foreach (var key in staleKeys)
                {
                    var updatedStat = await CalculateMarketStatAsync(key.typeId, key.stationId);
                    _marketStats[key] = updatedStat;
                }
            }

        }

        // Need to know where to go to buy the items on the Bill Of Materials
        async Task<SupplyPlan> IMarketService.GetSupplyPlanAsync(ManufBatch manufBatch, long[] stationIds)
        {
            SupplyPlan supplyPlan = new SupplyPlan();
            var billOfMaterials = manufBatch.BillOfMaterials; 
            var productionRouting = manufBatch.ProductionRouting; 
            
            List<PurchaseRequisition> purchaseRequisitions = new List<PurchaseRequisition>();

            // Need to find the cheapest orders from the stationIds that will satisfy the Requisitioned amount on the BOM
            foreach (var lineItem in billOfMaterials)
            {
                int remaining = lineItem.Requisitioned;

                // Get all region IDs first
                var regionIds = new Dictionary<long, int>();
                foreach (var stationId in stationIds)
                {
                    var regionId = await _mapService.GetRegionIdFromStationId(stationId);
                    if (regionId != 0)
                    {
                        regionIds[stationId] = regionId;
                    }
                }

                // Now get matching orders
                var matchingOrders = new List<MarketOrder>();
                foreach (var (stationId, regionId) in regionIds)
                {
                    if (_marketOrders.TryGetValue(regionId, out var orders))
                    {
                        matchingOrders.AddRange(orders.Where(o => o.TypeId == lineItem.TypeId && o.LocationId == stationId));
                    }
                }

                var sortedOrders = matchingOrders
                    .Where(o => o.IsBuyOrder == false)
                    .OrderBy(o => o.Price)
                    .ToList();

                var requisitions = await GeneratePurchaseRequisitionsAsync(lineItem, sortedOrders);
                purchaseRequisitions.AddRange(requisitions);
            }

            long[] stationRouteIds = purchaseRequisitions.Select(pr => pr.StationId).Distinct().ToArray();
            foreach (long stationId in stationRouteIds)
            {
                var stationPurchases = purchaseRequisitions.Where(pr => pr.StationId == stationId);
                string stationName = await _mapService.GetStationName(stationId) ?? "Station Name Not Found";
                ProcurementPlan stationPlan = new ProcurementPlan()
                {
                    StationId = stationId,
                    StationName = stationName,
                    PurchaseRequisitions = stationPurchases.ToList(),
                };
                supplyPlan.ProcurementPlans.Add(stationPlan);
            }

            supplyPlan.ProcurementPlans.OrderBy(p => p.StationId).ToList();

            return supplyPlan;
        }

        // Find the cheapest orders in the list, and generate the PR List to fulfill the requisitioned quantity from BOM Line Item.
        private async Task<List<PurchaseRequisition>> GeneratePurchaseRequisitionsAsync(BOMLineItem lineItem, IEnumerable<MarketOrder> matchingOrders)
        {
            var requisitions = new List<PurchaseRequisition>();
            int remaining = lineItem.Requisitioned;

            foreach (var order in matchingOrders)
            {
                if (remaining <= 0)
                    break;

                int taken = Math.Min(order.VolumeRemain, remaining);
                remaining -= taken;
                var station = await _mapService.GetStationAsync(order.LocationId);
                requisitions.Add(new PurchaseRequisition
                {
                    StationId = order.LocationId,
                    Station = station,
                    TypeId = lineItem.TypeId,
                    Name = lineItem.Name,
                    Quantity = taken,
                    MarketOrder = order,
                    Price = order.Price,
                    Item = lineItem.Item
                });
            }

            return requisitions;
        }

        async Task IMarketService.UpdateGlobalMarketOrders(long[] stationIds)
        {
            // Create a semaphore that allows 5 concurrent requests (EVE ESI rate limit)
            using var semaphore = new SemaphoreSlim(5);
            var tasks = new List<Task>();

            foreach (var stationId in stationIds)
            {
                var regionId = await _mapService.GetRegionIdFromStationId(stationId);
                if (regionId != 0 && !_marketOrders.ContainsKey(regionId))
                {
                    tasks.Add(ProcessRegionOrdersAsync(regionId, semaphore));
                }
            }

            // Wait for all tasks to complete
            await Task.WhenAll(tasks);

            // Process stale orders
            var staleKeys = _marketOrders
                .Where(kvp => (DateTime.UtcNow - kvp.Value[0].DateTime).TotalMinutes >= 60)
                .Select(kvp => kvp.Key)
                .ToList();

            tasks.Clear();
            foreach (var regionId in staleKeys)
            {
                tasks.Add(ProcessRegionOrdersAsync(regionId, semaphore));
            }

            await Task.WhenAll(tasks);
        }

        private async Task ProcessRegionOrdersAsync(int regionId, SemaphoreSlim semaphore)
        {
            try
            {
                await semaphore.WaitAsync();
                var allOrders = new List<MarketOrder>();
                int page = 1;
                List<MarketOrder>? pageOrders;

                // Fetch all pages
                do
                {
                    pageOrders = await _esiService.GetMarketOrdersAsync(regionId, null, null, page);
                    if (pageOrders != null && pageOrders.Any())
                    {
                        allOrders.AddRange(pageOrders);
                        page++;
                    }
                } while (pageOrders != null && pageOrders.Any());

                if (allOrders.Any())
                {
                    _marketOrders[regionId] = allOrders;
                }
            }
            finally
            {
                semaphore.Release();
            }
        }
    }
}

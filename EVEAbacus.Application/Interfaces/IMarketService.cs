using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.ESI.Market;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Interfaces
{
    public interface IMarketService
    {
        int[] MarketHubRegionIds { get; }
        long[] MarketHubStationIds { get; }
        List<MarketOrder> MarketOrders { get; }
        List<MarketStat> MarketStats { get; }
        MarketProfile GetMarketProfile(ManufBatch manufBatch);
        BOMLineItem[] GetMarketStatsForBillOfMaterials(BOMLineItem[] billOfMaterials, long[] stationIds);
        Task UpdateMarketStats(int[] typeIds, long[] stationIds);
        Task UpdateGlobalMarketOrders(long[] stationIds);
        Task<SupplyPlan> GetSupplyPlanAsync(ManufBatch manufBatch, long[] stationIds);
    }
}

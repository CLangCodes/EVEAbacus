using EVEAbacus.Domain.Models.ESI.Market;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Interfaces
{
    public interface IMarketRepository
    {
        Task AddMarketRegionHistoryAsync(MarketRegionHistory history);
        Task DeleteMarketRegionHistoryAsync(int typeId, int regionId);
        bool DoesMarketRegionHistoryExist(int typeId, int regionId);
        Task<MarketRegionHistory?> GetMarketRegionHistoryAsync(int typeId, int regionId);
        Task<List<MarketRegionHistory>> GetAllMarketRegionsHistoryAsync();
        Task AddMarketOrderAsync(MarketOrder order);
        Task DeleteMarketOrderAsync(long orderId);
        bool DoesMarketOrderExist(long orderId);
        Task<MarketOrder?> GetMarketOrderAsync(long orderId);
        Task<List<MarketOrder>?> GetMarketOrdersAsync(int typeId, int regionId);
        Task<List<MarketOrder>?> GetMarketOrdersAsync(int typeId, long stationId);
        Task AddMarketStatAsync(MarketStat marketStat);
        Task DeleteMarketStatAsync(MarketStat marketStat);
        Task<MarketStat?> GetMarketStatAsync(int typeId, long stationId);
        Task PurgeMarketOrders();
    }
}

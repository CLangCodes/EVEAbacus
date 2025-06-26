using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;
using EVEAbacus.Infrastructure.Data;
using Microsoft.CodeAnalysis;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static System.Runtime.InteropServices.JavaScript.JSType;

namespace EVEAbacus.Infrastructure.Repositories
{
    public class MarketRepository : IMarketRepository
    {
        private readonly IDbContextFactory<EVEAbacusDbContext> _dbContextFactory;
        private readonly IESIService _esiService;
        public MarketRepository(IDbContextFactory<EVEAbacusDbContext> dbContextFactory, IESIService esiService)
        {
            _dbContextFactory = dbContextFactory;
            _esiService = esiService;
        }

        async Task IMarketRepository.AddMarketOrderAsync(MarketOrder order)
        {
            using var context = _dbContextFactory.CreateDbContext();
            context.Add(order);
            await context.SaveChangesAsync();
        }

        async Task IMarketRepository.AddMarketRegionHistoryAsync(MarketRegionHistory history)
        {
            using var context = _dbContextFactory.CreateDbContext();
            context.Add(history);
            await context.SaveChangesAsync();
        }

        async Task IMarketRepository.AddMarketStatAsync(MarketStat marketStat)
        {
            using var context = _dbContextFactory.CreateDbContext();
            context.Add(marketStat);
            await context.SaveChangesAsync();
        }

        async Task IMarketRepository.DeleteMarketOrderAsync(long orderId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            Debug.WriteLine($"IMarketRepository.Delete: {orderId}");
            var data = await context.MarketOrders
                .FirstOrDefaultAsync(mkt => mkt.OrderId == orderId);
            if (data != null)
            {
                Debug.WriteLine("Successfully found order");
                context.MarketOrders.Remove(data);
                await context.SaveChangesAsync();
            }
        }

        async Task IMarketRepository.DeleteMarketRegionHistoryAsync(int typeId, int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketRegionHistories
                .FirstOrDefaultAsync(mrh => mrh.RegionId == regionId
                && mrh.TypeId == typeId);
            if (data != null)
            {
                context.MarketRegionHistories.Remove(data);
                await context.SaveChangesAsync();
            }
        }

        async Task IMarketRepository.DeleteMarketStatAsync(MarketStat marketStat)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketStats
                .FirstOrDefaultAsync(mrh => mrh.StationId == marketStat.StationId
                && mrh.TypeId == marketStat.TypeId);
            if (data != null)
            {
                context.MarketStats.Remove(data);
                await context.SaveChangesAsync();
            }
        }

        bool IMarketRepository.DoesMarketOrderExist(long orderId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.MarketOrders.Any(mkt => mkt.OrderId == orderId);
        }

        bool IMarketRepository.DoesMarketRegionHistoryExist(int typeId, int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            return context.MarketRegionHistories.Any(mrh => mrh.RegionId == regionId && mrh.TypeId == typeId);
        }

        async Task<List<MarketRegionHistory>> IMarketRepository.GetAllMarketRegionsHistoryAsync()
        {
            using var context = _dbContextFactory.CreateDbContext();

            var data = await context.MarketRegionHistories.ToListAsync();
            if (data != null) { return data.ToList(); }
            else { return []; }
        }

        async Task<MarketOrder> IMarketRepository.GetMarketOrderAsync(long orderId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketOrders
                .FirstOrDefaultAsync(mkt => mkt.OrderId == orderId);
            if (data != null) { return data; }
            else { return null; }
        }

        async Task<List<MarketOrder>> IMarketRepository.GetMarketOrdersAsync(int typeId, int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketOrders
                .Where(mkt => mkt.TypeId == typeId
                && mkt.RegionId == regionId)
                .ToListAsync();
            if (data != null) { return data; }
            else { return null; }
        }

        async Task<List<MarketOrder>> IMarketRepository.GetMarketOrdersAsync(int typeId, long stationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketOrders
                .Where(mkt => mkt.TypeId == typeId
                && mkt.LocationId == stationId)
                .ToListAsync();
            if (data != null) { return data; }
            else { return null; }
        }

        async Task<MarketRegionHistory> IMarketRepository.GetMarketRegionHistoryAsync(int typeId, int regionId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketRegionHistories
                .FirstOrDefaultAsync(mrh => mrh.RegionId == regionId && mrh.TypeId == typeId);
            if (data != null) { return data; } 
            else { return null; }
        }

        async Task<MarketStat> IMarketRepository.GetMarketStatAsync(int typeId, long stationId)
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketStats
                .FirstOrDefaultAsync(mrh => mrh.StationId == stationId && mrh.TypeId == typeId);
            if (data != null) { return data; }
            else { return null; }
        }

        async Task IMarketRepository.PurgeMarketOrders()
        {
            using var context = _dbContextFactory.CreateDbContext();
            var data = await context.MarketOrders.ToListAsync();
            foreach (var item in data) 
            {
                context.Remove(item);
                context.SaveChanges();
            }
        }
    }
}

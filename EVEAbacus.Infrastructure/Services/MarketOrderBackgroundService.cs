using EVEAbacus.Application.Interfaces;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.DependencyInjection;

namespace EVEAbacus.Infrastructure.Services
{
    public class MarketOrderBackgroundService : BackgroundService
    {
        private readonly ILogger<MarketOrderBackgroundService> _logger;
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly PeriodicTimer _timer;

        public MarketOrderBackgroundService(
            ILogger<MarketOrderBackgroundService> logger,
            IServiceScopeFactory scopeFactory)
        {
            _logger = logger;
            _scopeFactory = scopeFactory;
            _timer = new PeriodicTimer(TimeSpan.FromMinutes(5));
            _logger.LogInformation("MarketOrderBackgroundService initialized");
        }

        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogInformation("MarketOrderBackgroundService starting execution");
            
            try
            {
                // Run immediately on startup
                _logger.LogInformation("Running initial market order update");
                await UpdateMarketOrdersAsync();
                _logger.LogInformation("Initial market order update completed");
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred during initial market order update");
            }

            // Then run every 5 minutes
            while (await _timer.WaitForNextTickAsync(stoppingToken) && !stoppingToken.IsCancellationRequested)
            {
                try
                {
                    _logger.LogInformation("Starting market order update cycle");
                    await UpdateMarketOrdersAsync();
                    _logger.LogInformation("Completed market order update cycle");
                }
                catch (Exception ex)
                {
                    _logger.LogError(ex, "Error occurred while updating market orders");
                }
            }
        }

        private async Task UpdateMarketOrdersAsync()
        {
            _logger.LogInformation("Creating service scope for market order update");
            using var scope = _scopeFactory.CreateScope();
            var marketService = scope.ServiceProvider.GetRequiredService<IMarketService>();
            
            // Get the market hub station IDs from the MarketService
            var stationIds = marketService.MarketHubStationIds;
            _logger.LogInformation("Updating market orders for {Count} stations: {StationIds}", 
                stationIds.Length, string.Join(", ", stationIds));
            
            // Update market orders for all market hub stations
            await marketService.UpdateGlobalMarketOrders(stationIds);

            // Log the current state of market orders
            var marketOrders = marketService.MarketOrders;
            _logger.LogInformation("Current market orders count: {Count}", marketOrders.Count);
            
            // Group by station and log counts
            var ordersByStation = marketOrders.GroupBy(o => o.LocationId)
                .ToDictionary(g => g.Key, g => g.Count());
            
            foreach (var station in ordersByStation)
            {
                _logger.LogInformation("Station {StationId}: {Count} orders", station.Key, station.Value);
            }
        }
    }
} 
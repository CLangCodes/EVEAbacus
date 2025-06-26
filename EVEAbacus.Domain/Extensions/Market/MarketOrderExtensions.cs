using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.ESI.Market.DTO;

namespace EVEAbacus.Domain.Extensions.Market
{
    public static class MarketOrderExtensions
    {
        public static MarketOrder ToMarketOrder(this MarketOrderDTO dto, int regionId)
        {
            return new MarketOrder
            {
                DateTime = DateTime.UtcNow,
                Duration = dto.Duration,
                IsBuyOrder = dto.IsBuyOrder,
                Issued = dto.Issued,
                LocationId = dto.LocationId,
                MinVolume = dto.MinVolume,
                OrderId = dto.OrderId,
                Price = (decimal)dto.Price,
                Range = dto.Range,
                RegionId = regionId,
                SystemId = dto.SystemId,
                TypeId = dto.TypeId,
                VolumeRemain = dto.VolumeRemain,
                VolumeTotal = dto.VolumeTotal
            };
        }

        public static IEnumerable<MarketOrder> ToMarketOrders(this IEnumerable<MarketOrderDTO> dtos, int regionId)
        {
            return dtos.Select(dto => dto.ToMarketOrder(regionId));
        }
    }
} 
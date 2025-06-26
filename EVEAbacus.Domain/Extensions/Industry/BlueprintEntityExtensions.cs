using EVEAbacus.Domain.Models.ESI.Industry;
using EVEAbacus.Domain.Models.ESI.Industry.DTO;

namespace EVEAbacus.Domain.Extensions.Industry
{
    public static class BlueprintEntityExtensions
    {
        public static BlueprintEntity ToBlueprintEntity(this BlueprintEntityDTO dto)
        {
            return new BlueprintEntity()
            {
                ItemId = dto.ItemId,
                LocationFlag = dto.LocationFlag,
                LocationId = dto.LocationId,
                MaterialEfficiency = dto.MaterialEfficiency,
                Quantity = dto.Quantity,
                Runs = dto.Runs,
                TimeEfficiency = dto.TimeEfficiency,
                TypeId = dto.TypeId
            };
        }

        public static IEnumerable<BlueprintEntity> ToBlueprintEntities(this IEnumerable<BlueprintEntityDTO> dtos)
        {
            return dtos.Select(dto => dto.ToBlueprintEntity());
        }
    }
} 
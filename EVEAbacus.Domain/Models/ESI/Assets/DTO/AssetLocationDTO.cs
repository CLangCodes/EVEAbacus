using EVEAbacus.Domain.Models.Map;

namespace EVEAbacus.Domain.Models.ESI.Assets.DTO
{
    public class AssetLocationDTO
    {
        public long ItemId { get; set; }
        public required Position Position { get; set; }
    }
}

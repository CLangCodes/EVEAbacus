namespace EVEAbacus.Domain.Models.ESI.PI.DTO
{
    public class PIPlanetDTO
    {
        public string LastUpdate { get; set; } = string.Empty;
        public int NumPins { get; set; }
        public int OwnerId { get; set; }
        public int PlanetId { get; set; }
        public string PlanetType { get; set; } = string.Empty;
        public int SolarSystemId { get; set; }
        public int UpgradeLevel { get; set; }
    }
}

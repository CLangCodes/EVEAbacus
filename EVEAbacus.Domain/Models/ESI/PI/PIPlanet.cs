using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.PI
{
    public class PIPlanet
    {
        public required string LastUpdate { get; set; }
        public int NumPins { get; set; }
        public int OwnerId { get; set; }
        public int PlanetId { get; set; }
        public required string PlanetType { get; set; }
        public int SolarSystemId { get; set; }
        public int UpgradeLevel { get; set; }
    }
}

using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.Map
{
    public class Station
    {
        public int StationId { get; set; }
        public float Security { get; set; }
        public float DockingCostPerVolume { get; set; }
        public float MaxShipVolumeDockable {get; set;}
        public int OfficeRentalCost { get; set; }
        public byte OperationId { get; set; }
        public int StationTypeId { get; set; }
        public int CorporationId { get; set; }
        public int SolarSystemId { get; set; }
        public SolarSystem? SolarSystem { get; set; }
        public int ConstellationId { get; set; }
        public int RegionId { get; set; }
        public string StationName { get; set; } = string.Empty;
        public float X { get; set; }
        public float Y { get; set; }
        public float Z { get; set; }
        public float ReprocessingEfficiency { get; set; }
        public float ReprocessingStationsTake { get; set; }
        public byte ReprocessingHangarFlag { get; set; }
    }
}

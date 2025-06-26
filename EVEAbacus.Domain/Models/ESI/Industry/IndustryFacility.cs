using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Industry
{
    public class IndustryFacility
    {
        public long FacilityId { get; set; }
        public int OwnerId { get; set; }
        public int RegionId { get; set; }
        public int SolarSystemId { get; set; }
        public float Tax { get; set; }
        public int TypeId { get; set; }
    }
}

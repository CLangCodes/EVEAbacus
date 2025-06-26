using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MapItemEffectBeacon
{
    public int ItemId { get; set; }

    public int? EffectBeaconTypeId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MapLocationWormholeClass
{
    public int LocationId { get; set; }

    public int? WormholeClassId { get; set; }
}

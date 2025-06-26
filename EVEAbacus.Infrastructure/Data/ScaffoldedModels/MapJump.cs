using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MapJump
{
    public int StargateId { get; set; }

    public int? DestinationId { get; set; }

    public int? TypeId { get; set; }

    public float? X { get; set; }

    public float? Y { get; set; }

    public float? Z { get; set; }
}

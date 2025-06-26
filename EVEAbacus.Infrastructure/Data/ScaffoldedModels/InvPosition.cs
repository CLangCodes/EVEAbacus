using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class InvPosition
{
    public long ItemId { get; set; }

    public float X { get; set; }

    public float Y { get; set; }

    public float Z { get; set; }

    public float? Yaw { get; set; }

    public float? Pitch { get; set; }

    public float? Roll { get; set; }
}

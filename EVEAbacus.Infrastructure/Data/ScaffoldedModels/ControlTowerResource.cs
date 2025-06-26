using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class ControlTowerResource
{
    public int? TypeId { get; set; }

    public int? Purpose { get; set; }

    public int? FactionId { get; set; }

    public float? MinSecurityLevel { get; set; }

    public int? Quantity { get; set; }

    public int? ResourceTypeId { get; set; }
}

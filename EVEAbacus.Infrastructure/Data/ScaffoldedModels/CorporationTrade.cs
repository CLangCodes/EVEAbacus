using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CorporationTrade
{
    public int CorporationId { get; set; }

    public int? TypeId { get; set; }

    public float? Value { get; set; }
}

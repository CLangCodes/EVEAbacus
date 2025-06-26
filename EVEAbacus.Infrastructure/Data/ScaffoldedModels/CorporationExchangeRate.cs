using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CorporationExchangeRate
{
    public int CorporationId { get; set; }

    public int? ExchangeId { get; set; }

    public float? ExchangeRate { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CorporationInvestor
{
    public int CorporationId { get; set; }

    public int? InvestorId { get; set; }

    public float? Shares { get; set; }
}

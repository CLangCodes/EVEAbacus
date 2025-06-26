using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CorporationDivision
{
    public int CorporationId { get; set; }

    public int DivisionId { get; set; }

    public int? DivisionNumber { get; set; }

    public int? LeaderId { get; set; }

    public int? Size { get; set; }
}

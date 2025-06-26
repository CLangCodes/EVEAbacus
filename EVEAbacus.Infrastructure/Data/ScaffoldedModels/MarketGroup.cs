using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MarketGroup
{
    public int MarketGroupId { get; set; }

    public string? DescriptionId { get; set; }

    public byte? HasTypes { get; set; }

    public int? IconId { get; set; }

    public string? NameId { get; set; }

    public int? ParentGroupId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class InvItem
{
    public long ItemId { get; set; }

    public int? TypeId { get; set; }

    public int? OwnerId { get; set; }

    public long? LocationId { get; set; }

    public short? FlagId { get; set; }

    public int? Quantity { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class InvUniqueName
{
    public int ItemId { get; set; }

    public string? ItemName { get; set; }

    public int? GroupId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class InvFlag
{
    public short FlagId { get; set; }

    public string? FlagName { get; set; }

    public string? FlagText { get; set; }

    public int? OrderId { get; set; }
}

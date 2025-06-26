using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class SovereigntyUpgrade
{
    public long TypeId { get; set; }

    public long? FuelHourlyUpkeep { get; set; }

    public long? FuelStartupCost { get; set; }

    public long? FuelTypeId { get; set; }

    public string? MutuallyExclusiveGroup { get; set; }

    public int? PowerAllocation { get; set; }

    public int? WorkforceAllocation { get; set; }
}

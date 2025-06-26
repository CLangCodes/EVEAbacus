using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class PlanetResource
{
    public long StarId { get; set; }

    public long? Power { get; set; }

    public long? Workforce { get; set; }

    public int? CycleMinutes { get; set; }

    public long? HarvestSiloMax { get; set; }

    public long? MaturationCycleMinutes { get; set; }

    public int? MaturationPercent { get; set; }

    public double? MatureSiloMax { get; set; }

    public long? ReagentHarvestAmount { get; set; }

    public long? ReagentTypeId { get; set; }
}

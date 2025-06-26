using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class PlanetSchematic
{
    public short SchematicId { get; set; }

    public string? SchematicName { get; set; }

    public int? CycleTime { get; set; }
}

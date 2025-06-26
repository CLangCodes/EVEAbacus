using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class StationOperation
{
    public byte OperationId { get; set; }

    public string? OperationName { get; set; }

    public byte? ActivityId { get; set; }

    public float? Border { get; set; }

    public float? Corridor { get; set; }

    public string? Description { get; set; }

    public float? Fringe { get; set; }

    public float? Hub { get; set; }

    public float? ManufacturingFactor { get; set; }

    public float? Ratio { get; set; }

    public float? ResearchFactor { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class StationOperationType
{
    public int OperationId { get; set; }

    public int? RaceId { get; set; }

    public int? StationTypeId { get; set; }
}

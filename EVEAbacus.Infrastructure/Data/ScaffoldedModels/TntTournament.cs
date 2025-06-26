using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class TntTournament
{
    public string? RuleSetId { get; set; }

    public string? RuleSetName { get; set; }

    public int? MaximumPointsMatch { get; set; }

    public int? MaximumPilotsMatch { get; set; }
}

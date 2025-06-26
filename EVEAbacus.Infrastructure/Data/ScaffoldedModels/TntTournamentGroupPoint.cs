using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class TntTournamentGroupPoint
{
    public string? RuleSetId { get; set; }

    public int? GroupId { get; set; }

    public int? Points { get; set; }
}

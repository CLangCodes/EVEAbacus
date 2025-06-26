using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class TntTournamentTypePoint
{
    public string? RuleSetId { get; set; }

    public int? TypeId { get; set; }

    public int? Points { get; set; }
}

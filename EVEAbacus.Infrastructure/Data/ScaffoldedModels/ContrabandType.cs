using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class ContrabandType
{
    public int? TypeId { get; set; }

    public int? FactionId { get; set; }

    public float? AttackMinSec { get; set; }

    public float? ConfiscateMinSec { get; set; }

    public float? FineByValue { get; set; }

    public float? StandingLoss { get; set; }
}

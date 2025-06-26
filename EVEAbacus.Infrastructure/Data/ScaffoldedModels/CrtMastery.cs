using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CrtMastery
{
    public int? TypeId { get; set; }

    public byte? MasteryLevel { get; set; }

    public int? MasteryRecommendedTypeId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MetaGroup
{
    public short MetaGroupId { get; set; }

    public string? DescriptionId { get; set; }

    public int? IconId { get; set; }

    public string? IconSuffix { get; set; }

    public string? NameId { get; set; }
}

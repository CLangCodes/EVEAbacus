using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class NpcCorporationDivision
{
    public byte DivisionId { get; set; }

    public string? InternalName { get; set; }

    public string? Description { get; set; }

    public string? DescriptionId { get; set; }

    public string? LeaderTypeNameId { get; set; }

    public string? NameId { get; set; }
}

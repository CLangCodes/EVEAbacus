using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Faction
{
    public int FactionId { get; set; }

    public string? FactionName { get; set; }

    public string? Description { get; set; }

    public string? ShortDescriptionId { get; set; }

    public int? SolarSystemId { get; set; }

    public int? CorporationId { get; set; }

    public float? SizeFactor { get; set; }

    public int? MilitiaCorporationId { get; set; }

    public int? IconId { get; set; }

    public int? UniqueName { get; set; }

    public string? FlatLogo { get; set; }

    public string? FlatLogoWithName { get; set; }
}

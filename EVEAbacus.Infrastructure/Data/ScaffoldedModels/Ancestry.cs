using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Ancestry
{
    public byte AncestryId { get; set; }

    public string? AncestryName { get; set; }

    public byte? BloodlineId { get; set; }

    public string? Description { get; set; }

    public byte? Perception { get; set; }

    public byte? Willpower { get; set; }

    public byte? Charisma { get; set; }

    public byte? Memory { get; set; }

    public byte? Intelligence { get; set; }

    public int? IconId { get; set; }

    public string? ShortDescription { get; set; }
}

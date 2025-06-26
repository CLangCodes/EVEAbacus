using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Bloodline
{
    public byte BloodlineId { get; set; }

    public string? BloodlineName { get; set; }

    public byte? RaceId { get; set; }

    public string? Description { get; set; }

    public int? ShipTypeId { get; set; }

    public int? CorporationId { get; set; }

    public byte? Perception { get; set; }

    public byte? Willpower { get; set; }

    public byte? Charisma { get; set; }

    public byte? Memory { get; set; }

    public byte? Intelligence { get; set; }

    public int? IconId { get; set; }
}

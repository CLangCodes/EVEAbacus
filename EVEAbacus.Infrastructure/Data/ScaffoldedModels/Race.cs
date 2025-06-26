using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Race
{
    public byte? RaceId { get; set; }

    public string? RaceName { get; set; }

    public string? RaceDescription { get; set; }

    public int? IconId { get; set; }

    public int? ShipTypeId { get; set; }
}

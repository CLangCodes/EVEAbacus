using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class MapLandmark
{
    public int LandmarkId { get; set; }

    public int? DescriptionId { get; set; }

    public string? Description { get; set; }

    public int? LandmarkNameId { get; set; }

    public string? LandmarkName { get; set; }

    public int? LocationId { get; set; }

    public float? X { get; set; }

    public float? Y { get; set; }

    public float? Z { get; set; }

    public int? IconId { get; set; }
}

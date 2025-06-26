using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CorporationActivity
{
    public byte ActivityId { get; set; }

    public string? ActivityName { get; set; }
}

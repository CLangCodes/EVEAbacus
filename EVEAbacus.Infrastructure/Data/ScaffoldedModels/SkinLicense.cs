using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class SkinLicense
{
    public int LicenseTypeId { get; set; }

    public int? Duration { get; set; }

    public int? IsSingleUse { get; set; }

    public int? SkinId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class SkinMaterial
{
    public int SkinMaterialId { get; set; }

    public int? DisplayNameId { get; set; }

    public int? MaterialSetId { get; set; }
}

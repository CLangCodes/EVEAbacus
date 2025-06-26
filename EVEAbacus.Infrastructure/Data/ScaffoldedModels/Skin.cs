using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Skin
{
    public int? SkinId { get; set; }

    public string? SkinDescription { get; set; }

    public string? InternalName { get; set; }

    public int? SkinMaterialId { get; set; }

    public int? IsStructureSkin { get; set; }

    public int? TypeId { get; set; }

    public byte? AllowCcpdevs { get; set; }

    public byte? VisibleSerenity { get; set; }

    public byte? VisibleTranquility { get; set; }
}

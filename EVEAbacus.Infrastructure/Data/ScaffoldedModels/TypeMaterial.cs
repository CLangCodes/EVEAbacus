using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class TypeMaterial
{
    public int TypeId { get; set; }

    public int MaterialTypeId { get; set; }

    public int? Quantity { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaTypeAttribute
{
    public int TypeId { get; set; }

    public short AttributeId { get; set; }

    public float? Value { get; set; }
}

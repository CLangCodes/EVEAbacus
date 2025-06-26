using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaTypeEffect
{
    public int TypeId { get; set; }

    public short EffectId { get; set; }

    public byte? IsDefault { get; set; }
}

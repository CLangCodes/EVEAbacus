using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class PlanetSchematicsTypeMap
{
    public short? SchematicId { get; set; }

    public int? TypeId { get; set; }

    public short? Quantity { get; set; }

    public byte? IsInput { get; set; }
}

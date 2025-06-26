using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaAttributeCategory
{
    public byte CategoryId { get; set; }

    public string? Name { get; set; }

    public string? Description { get; set; }
}

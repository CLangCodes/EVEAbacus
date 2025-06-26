using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class CharacterAttribute
{
    public byte AttributeId { get; set; }

    public string? AttributeName { get; set; }

    public string? Description { get; set; }

    public int? IconId { get; set; }

    public string? ShortDescription { get; set; }

    public string? Notes { get; set; }
}

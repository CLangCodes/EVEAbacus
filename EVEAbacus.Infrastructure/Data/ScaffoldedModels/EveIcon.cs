using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class EveIcon
{
    public int IconId { get; set; }

    public string? IconFile { get; set; }

    public string? Description { get; set; }

    public int? Obsolete { get; set; }
}

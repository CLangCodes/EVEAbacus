using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class EveGraphic
{
    public int GraphicId { get; set; }

    public string? GraphicFile { get; set; }

    public string? Description { get; set; }

    public string? SofFactionName { get; set; }

    public string? SofHullName { get; set; }

    public string? SofRaceName { get; set; }
}

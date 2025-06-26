using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class Agent
{
    public int AgentId { get; set; }

    public byte? DivisionId { get; set; }

    public int? CorporationId { get; set; }

    public int? LocationId { get; set; }

    public byte? Level { get; set; }

    public int? AgentTypeId { get; set; }

    public byte? IsLocator { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class AgentsInSpace
{
    public int AgentId { get; set; }

    public int? DungeonId { get; set; }

    public int? SolarSystemId { get; set; }

    public int? SpawnPointId { get; set; }

    public int? TypeId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class RaceSkill
{
    public int RaceId { get; set; }

    public int? SkillTypeId { get; set; }

    public int? Level { get; set; }
}

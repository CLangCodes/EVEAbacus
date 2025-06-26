using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class FactionsMemberRace
{
    public int FactionId { get; set; }

    public int? MemberRace { get; set; }
}

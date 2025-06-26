using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class InvTrait
{
    public int? BonusId { get; set; }

    public int? TypeId { get; set; }

    public int? IconId { get; set; }

    public int? SkilltypeId { get; set; }

    public float? Bonus { get; set; }

    public string? BonusText { get; set; }

    public int? Importance { get; set; }

    public int? NameId { get; set; }

    public int? UnitId { get; set; }

    public byte? IsPositive { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaEffectsModifierInfo
{
    public short? EffectId { get; set; }

    public string? Domain { get; set; }

    public string? Func { get; set; }

    public int? GroupId { get; set; }

    public int? ModifiedAttributeId { get; set; }

    public int? ModifyingAttributeId { get; set; }

    public string? Operation { get; set; }

    public int? SkillTypeId { get; set; }

    public short? SecondaryEffectId { get; set; }
}

using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaEffect
{
    public short EffectId { get; set; }

    public string? DescriptionId { get; set; }

    public byte? DisallowAutoRepeat { get; set; }

    public string? DisplayNameId { get; set; }

    public short? DischargeAttributeId { get; set; }

    public string? Distribution { get; set; }

    public short? DurationAttributeId { get; set; }

    public string? EffectCategory { get; set; }

    public string? EffectName { get; set; }

    public byte? ElectronicChance { get; set; }

    public short? FittingUsageChanceAttributeId { get; set; }

    public short? FalloffAttributeId { get; set; }

    public string? Guid { get; set; }

    public int? IconId { get; set; }

    public byte? IsAssistance { get; set; }

    public byte? IsOffensive { get; set; }

    public byte? IsWarpSafe { get; set; }

    public short? NpcUsageChanceAttributeId { get; set; }

    public short? NpcActivationChanceAttributeId { get; set; }

    public byte? PropulsionChance { get; set; }

    public byte? Published { get; set; }

    public short? RangeAttributeId { get; set; }

    public short? ResistanceAttributeId { get; set; }

    public byte? RangeChance { get; set; }

    public string? SfxName { get; set; }

    public short? TrackingSpeedAttributeId { get; set; }
}

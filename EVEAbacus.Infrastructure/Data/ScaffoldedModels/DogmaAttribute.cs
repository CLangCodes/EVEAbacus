using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class DogmaAttribute
{
    public short AttributeId { get; set; }

    public string? AttributeName { get; set; }

    public string? Description { get; set; }

    public string? DisplayNameId { get; set; }

    public string? DataType { get; set; }

    public int? IconId { get; set; }

    public float? DefaultValue { get; set; }

    public byte? Published { get; set; }

    public byte? Stackable { get; set; }

    public string? Name { get; set; }

    public byte? UnitId { get; set; }

    public byte? HighIsGood { get; set; }

    public byte? CategoryId { get; set; }

    public string? TooltipDescriptionId { get; set; }

    public string? TooltipTitleId { get; set; }

    public int? MaxAttributeId { get; set; }

    public short? ChargeRechargeTimeId { get; set; }

    public byte? DisplayWhenZero { get; set; }

    public int? MinAttributeId { get; set; }
}

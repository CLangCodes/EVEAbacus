using System;
using System.Collections.Generic;

namespace EVEAbacus.Infrastructure.Data.ScaffoldedModels;

public partial class NpcCorporation
{
    public int CorporationId { get; set; }

    public string? TickerName { get; set; }

    public string? CorporationName { get; set; }

    public string? CorporationDescription { get; set; }

    public byte? UniqueName { get; set; }

    public float? TaxRate { get; set; }

    public int? MemberLimit { get; set; }

    public byte? HasPlayerPersonnelManager { get; set; }

    public int? FactionId { get; set; }

    public int? CeoId { get; set; }

    public byte? Deleted { get; set; }

    public string? Extent { get; set; }

    public int? FriendId { get; set; }

    public int? EnemyId { get; set; }

    public int? SolarSystemId { get; set; }

    public int? StationId { get; set; }

    public float? MinSecurity { get; set; }

    public float? MinimumJoinStanding { get; set; }

    public long? PublicShares { get; set; }

    public long? Shares { get; set; }

    public float? InitialPrice { get; set; }

    public int? MainActivityId { get; set; }

    public int? SecondaryActivityId { get; set; }

    public string? Size { get; set; }

    public float? SizeFactor { get; set; }

    public int? RaceId { get; set; }

    public byte? SendCharTerminationMessage { get; set; }

    public string? Url { get; set; }

    public int? IconId { get; set; }
}

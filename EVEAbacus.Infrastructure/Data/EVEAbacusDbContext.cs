using System;
using System.Collections.Generic;
using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.ESI.Assets;
using EVEAbacus.Domain.Models.ESI.Character;
using EVEAbacus.Domain.Models.ESI.Industry;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;
using EVEAbacus.Infrastructure.Data.ScaffoldedModels;
using Microsoft.EntityFrameworkCore;
using Pomelo.EntityFrameworkCore.MySql.Scaffolding.Internal;
using CharacterAttribute = EVEAbacus.Infrastructure.Data.ScaffoldedModels.CharacterAttribute;
using MarketGroup = EVEAbacus.Infrastructure.Data.ScaffoldedModels.MarketGroup;
using Microsoft.Extensions.Configuration;

namespace EVEAbacus.Infrastructure.Data;

public partial class EVEAbacusDbContext : DbContext
{
    public EVEAbacusDbContext()
    {
    }

    public EVEAbacusDbContext(DbContextOptions<EVEAbacusDbContext> options)
        : base(options)
    {
    }

    public virtual DbSet<Agent> Agents { get; set; }

    public virtual DbSet<AgentsInSpace> AgentsInSpaces { get; set; }

    public virtual DbSet<Ancestry> Ancestries { get; set; }

    public virtual DbSet<Bloodline> Bloodlines { get; set; }

    public virtual DbSet<BloodlineLastName> BloodlineLastNames { get; set; }

    public virtual DbSet<CharacterAttribute> CharacterAttributes { get; set; }

    public virtual DbSet<ContrabandType> ContrabandTypes { get; set; }

    public virtual DbSet<ControlTowerResource> ControlTowerResources { get; set; }

    public virtual DbSet<CorporationActivity> CorporationActivities { get; set; }

    public virtual DbSet<CorporationAllowedMemberRace> CorporationAllowedMemberRaces { get; set; }

    public virtual DbSet<CorporationDivision> CorporationDivisions { get; set; }

    public virtual DbSet<CorporationExchangeRate> CorporationExchangeRates { get; set; }

    public virtual DbSet<CorporationInvestor> CorporationInvestors { get; set; }

    public virtual DbSet<CorporationLpoffer> CorporationLpoffers { get; set; }

    public virtual DbSet<CorporationTrade> CorporationTrades { get; set; }

    public virtual DbSet<CrtCertificate> CrtCertificates { get; set; }

    public virtual DbSet<CrtCertificateSkill> CrtCertificateSkills { get; set; }

    public virtual DbSet<CrtMastery> CrtMasteries { get; set; }

    public virtual DbSet<CrtRecommendedType> CrtRecommendedTypes { get; set; }

    public virtual DbSet<DogmaAttribute> DogmaAttributes { get; set; }

    public virtual DbSet<DogmaAttributeCategory> DogmaAttributeCategories { get; set; }

    public virtual DbSet<DogmaEffect> DogmaEffects { get; set; }

    public virtual DbSet<DogmaEffectsModifierInfo> DogmaEffectsModifierInfos { get; set; }

    public virtual DbSet<DogmaTypeAttribute> DogmaTypeAttributes { get; set; }

    public virtual DbSet<DogmaTypeEffect> DogmaTypeEffects { get; set; }

    public virtual DbSet<EfmigrationsHistory> EfmigrationsHistories { get; set; }

    public virtual DbSet<EveGraphic> EveGraphics { get; set; }

    public virtual DbSet<EveIcon> EveIcons { get; set; }

    public virtual DbSet<EveIconsBackground> EveIconsBackgrounds { get; set; }

    public virtual DbSet<EveIconsForeground> EveIconsForegrounds { get; set; }

    public virtual DbSet<EvegraphicBackground> EvegraphicBackgrounds { get; set; }

    public virtual DbSet<EvegraphicForeground> EvegraphicForegrounds { get; set; }

    public virtual DbSet<EvegraphicIconInfo> EvegraphicIconInfos { get; set; }

    public virtual DbSet<Faction> Factions { get; set; }

    public virtual DbSet<FactionsMemberRace> FactionsMemberRaces { get; set; }

    public virtual DbSet<GraphicsofLayout> GraphicsofLayouts { get; set; }

    public virtual DbSet<BPTime> IndustryActivities { get; set; }

    public virtual DbSet<BPMaterial> IndustryActivityMaterials { get; set; }

    public virtual DbSet<BPProduct> IndustryActivityProducts { get; set; }

    public virtual DbSet<BPSkill> IndustryActivitySkills { get; set; }

    public virtual DbSet<Blueprint> IndustryBlueprints { get; set; }

    public virtual DbSet<Category> InvCategories { get; set; }

    public virtual DbSet<InvFlag> InvFlags { get; set; }

    public virtual DbSet<Group> InvGroups { get; set; }

    public virtual DbSet<InvItem> InvItems { get; set; }

    public virtual DbSet<Name> InvNames { get; set; }

    public virtual DbSet<InvPosition> InvPositions { get; set; }

    public virtual DbSet<InvTrait> InvTraits { get; set; }

    public virtual DbSet<Item> InvTypes { get; set; }

    public virtual DbSet<InvUniqueName> InvUniqueNames { get; set; }

    public virtual DbSet<CelestialStatistic> MapCelestialStatistics { get; set; }

    public virtual DbSet<Constellation> MapConstellations { get; set; }

    public virtual DbSet<Denormalize> MapDenormalizes { get; set; }

    public virtual DbSet<MapDisallowedAnchorCategory> MapDisallowedAnchorCategories { get; set; }

    public virtual DbSet<MapDisallowedAnchorGroup> MapDisallowedAnchorGroups { get; set; }

    public virtual DbSet<MapItemEffectBeacon> MapItemEffectBeacons { get; set; }

    public virtual DbSet<MapJump> MapJumps { get; set; }

    public virtual DbSet<MapLandmark> MapLandmarks { get; set; }

    public virtual DbSet<MapLocationScene> MapLocationScenes { get; set; }

    public virtual DbSet<MapLocationWormholeClass> MapLocationWormholeClasses { get; set; }

    public virtual DbSet<Region> MapRegions { get; set; }

    public virtual DbSet<SolarSystem> MapSolarSystems { get; set; }

    public virtual DbSet<MarketGroup> MarketGroups { get; set; }

    public virtual DbSet<MetaGroup> MetaGroups { get; set; }

    public virtual DbSet<MetaGroupsColor> MetaGroupsColors { get; set; }

    public virtual DbSet<NpcCorporation> NpcCorporations { get; set; }

    public virtual DbSet<NpcCorporationDivision> NpcCorporationDivisions { get; set; }

    public virtual DbSet<PlanetResource> PlanetResources { get; set; }

    public virtual DbSet<PlanetSchematic> PlanetSchematics { get; set; }

    public virtual DbSet<PlanetSchematicsPinMap> PlanetSchematicsPinMaps { get; set; }

    public virtual DbSet<PlanetSchematicsTypeMap> PlanetSchematicsTypeMaps { get; set; }

    public virtual DbSet<Race> Races { get; set; }

    public virtual DbSet<RaceSkill> RaceSkills { get; set; }

    public virtual DbSet<ResearchAgent> ResearchAgents { get; set; }

    public virtual DbSet<Skin> Skins { get; set; }

    public virtual DbSet<SkinLicense> SkinLicenses { get; set; }

    public virtual DbSet<SkinMaterial> SkinMaterials { get; set; }

    public virtual DbSet<SovereigntyUpgrade> SovereigntyUpgrades { get; set; }

    public virtual DbSet<Station> StaStations { get; set; }

    public virtual DbSet<StationOperation> StationOperations { get; set; }

    public virtual DbSet<StationOperationService> StationOperationServices { get; set; }

    public virtual DbSet<StationOperationType> StationOperationTypes { get; set; }

    public virtual DbSet<StationService> StationServices { get; set; }

    public virtual DbSet<TntTournament> TntTournaments { get; set; }

    public virtual DbSet<TntTournamentBannedGroup> TntTournamentBannedGroups { get; set; }

    public virtual DbSet<TntTournamentBannedType> TntTournamentBannedTypes { get; set; }

    public virtual DbSet<TntTournamentGroupPoint> TntTournamentGroupPoints { get; set; }

    public virtual DbSet<TntTournamentTypePoint> TntTournamentTypePoints { get; set; }

    public virtual DbSet<TypeMaterial> TypeMaterials { get; set; }

    public DbSet<MarketRegionHistory> MarketRegionHistories { get; set; }
    public DbSet<MarketOrder> MarketOrders { get; set; }
    public DbSet<MarketStat> MarketStats { get; set; }
    public DbSet<Blueprint> industryBlueprints { get; set; }
    public DbSet<Item> invTypes { get; set; }
    public DbSet<BPMaterial> industryActivityMaterials { get; set; }
    public DbSet<BPProduct> industryActivityProducts { get; set; }
    public DbSet<BPSkill> industryActivitySkills { get; set; }
    public DbSet<BPTime> industryActivities { get; set; }
    public DbSet<Category> invCategories { get; set; }
    public DbSet<Group> invGroups { get; set; }
    public DbSet<MarketGroup> marketGroups { get; set; }
    public DbSet<Name> invNames { get; set; }
    public DbSet<Denormalize> mapDenormalize { get; set; }
    public DbSet<Region> mapRegions { get; set; }
    public DbSet<RegionJump> mapRegionJumps { get; set; }
    public DbSet<Constellation> mapConstellations { get; set; }
    public DbSet<ConstellationJump> mapRegionConstellations { get; set; }
    public DbSet<SolarSystem> mapSolarSystems { get; set; }
    public DbSet<SolarSystemJump> mapSolarSystemJumps { get; set; }
    public DbSet<Station> staStations { get; set; }
    public DbSet<CelestialStatistic> mapCelestialStatistics { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        var propertyMappings = new Dictionary<string, string>
        {
            { "AllianceId", "AllianceID" },
            { "BlueprintTypeId", "BlueprintTypeID" },
            { "CategoryId", "CategoryID" },
            { "CelestialId", "CelestialID" },
            { "CharacterId", "CharacterID" },
            { "ConstellationId", "ConstellationID" },
            { "CorporationId", "CorporationID" },
            { "FactionId", "FactionID" },
            { "FromConstellationId", "FromConstellationID" },
            { "FromRegionId", "FromRegionID" },
            { "GroupId", "GroupID" },
            { "IconId", "IconID" },
            { "Id", "ID" },
            { "ItemId", "ItemID" },
            { "MarketGroupId", "MarketGroupID" },
            { "MaterialTypeId", "MaterialTypeID" },
            { "MetaGroupId", "MetaGroupID" },
            { "NameId", "NameID" },
            { "OrbitId", "OrbitID" },
            { "OrderId", "OrderID" },
            { "ProductTypeId", "ProductTypeID" },
            { "RaceId", "RaceID" },
            { "RegionId", "RegionID" },
            { "SkillId", "SkillID" },
            { "SolarSystemId", "SolarSystemID" },
            { "SofMaterialSetId", "SofMaterialSetID" },
            { "SoundId", "SoundID" },
            { "ToConstellationId", "ToConstellationID" },
            { "ToRegionId", "ToRegionID" },
            { "TypeId", "TypeID" },
            { "UserId", "UserID" },
            { "VariationparentTypeId", "VariationparentTypeID" }
        };

        foreach (var entityType in modelBuilder.Model.GetEntityTypes())
        {
            foreach (var property in entityType.ClrType.GetProperties())
            {
                if (propertyMappings.TryGetValue(property.Name, out string dbColumnName))
                {
                    modelBuilder.Entity(entityType.ClrType)
                        .Property(property.Name)
                        .HasColumnName(dbColumnName);
                }
            }
        }

        modelBuilder.Entity<Denormalize>(entity =>
        {
            entity.HasKey(s => s.ItemId);
            modelBuilder.Entity<Name>().HasKey(c => c.ItemId);
            entity.HasOne(s => s.Name)
                .WithOne()
                .HasPrincipalKey<Denormalize>(s => (Int64)s.ItemId)
                .HasForeignKey<Name>(s => s.ItemId)
                .IsRequired(true);
            entity.HasOne(s => s.Item)
                .WithOne()
                .HasPrincipalKey<Denormalize>(s => s.TypeId)
                .HasForeignKey<Item>(s => s.TypeId)
                .IsRequired(true);
            entity.HasOne(s => s.SolarSystem)
                .WithOne()
                .HasPrincipalKey<Denormalize>(s => s.SolarSystemId)
                .HasForeignKey<SolarSystem>(s => s.SolarSystemId)
                .IsRequired(true);
            entity.HasOne(s => s.Constellation)
                .WithOne()
                .HasPrincipalKey<Denormalize>(s => s.ConstellationId)
                .HasForeignKey<Constellation>(s => s.ConstellationId)
                .IsRequired(true);
            entity.HasOne(s => s.Region)
                .WithOne()
                .HasPrincipalKey<Denormalize>(s => s.RegionId)
                .HasForeignKey<Region>(s => s.RegionId)
                .IsRequired(true);
        });

        modelBuilder.Entity<MarketOrder>(entity =>
        {
            entity.HasKey(mkt => mkt.OrderId);
            entity.Ignore(mkt => mkt.Station);
            entity.Property(mkt => mkt.Price).HasPrecision(18, 6);
        });

        modelBuilder.Entity<MarketRegionHistory>(entity =>
        {
            entity.HasKey(mrh => new { mrh.RegionId, mrh.TypeId });
            entity.Property(mrh => mrh.Average).HasPrecision(18, 6);
            entity.Property(mrh => mrh.Highest).HasPrecision(18, 6);
            entity.Property(mrh => mrh.Lowest).HasPrecision(18, 6);
        });

        modelBuilder.Entity<MarketStat>(entity =>
        {
            entity.HasKey(mktSt => new { mktSt.TypeId, mktSt.StationId });
            entity.Property(mktSt => mktSt.AverageBuyPrice).HasPrecision(18, 6);
            entity.Property(mktSt => mktSt.AverageSellPrice).HasPrecision(18, 6);
        });

        modelBuilder.Entity<Acquisition>().HasKey(acq => new { acq.UserId, acq.OrderId, acq.TypeId });

        modelBuilder.Entity<CelestialStatistic>().HasKey(c => c.CelestialId);
        modelBuilder.Entity<RegionJump>().HasKey(r => new { r.FromRegionId, r.ToRegionId });
        modelBuilder.Entity<ConstellationJump>().HasKey(c => new { c.FromConstellationId, c.ToConstellationId });
        modelBuilder.Entity<SolarSystemJump>().HasKey(s => new { s.FromSolarSystemId, s.ToSolarSystemId });

        modelBuilder.Entity<BPTime>().HasKey(bpt => new { bpt.BlueprintTypeId, bpt.ActivityId });
        modelBuilder.Entity<BPSkill>().HasKey(bps => new { bps.BlueprintTypeId, bps.ActivityId, bps.SkillId });
        modelBuilder.Entity<BPProduct>().HasKey(bpp => new { bpp.BlueprintTypeId, bpp.ActivityId, bpp.ProductTypeId });
        modelBuilder.Entity<BPMaterial>().HasKey(bpm => new { bpm.BlueprintTypeId, bpm.ActivityId, bpm.MaterialTypeId });

        modelBuilder.Entity<Category>().HasKey(gr => gr.CategoryId);
        modelBuilder.Entity<MarketGroup>().HasKey(gr => gr.MarketGroupId);

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(gr => gr.GroupId);
            entity.HasOne(gr => gr.Category)
                .WithMany()
                .HasForeignKey(gr => gr.CategoryId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(i => i.TypeId);
            entity.HasOne(i => i.Group)
                .WithMany()
                .HasForeignKey(i => i.GroupId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);
        });

        modelBuilder.Entity<Blueprint>(entity =>
        {
            entity.HasKey(bp => bp.BlueprintTypeId);
            entity.HasOne(it => it.ItemProperty)
                .WithOne()
                .HasForeignKey<Item>(bp => bp.TypeId)
                .IsRequired(false)
                .OnDelete(DeleteBehavior.NoAction);

            entity.HasMany(bp => bp.BPTimes)
                .WithOne(bp => bp.Blueprint)
                .HasForeignKey(bp => bp.BlueprintTypeId)
                .IsRequired();

            entity.HasMany(bp => bp.Skills)
                .WithMany(bp => bp.Blueprints)
                .UsingEntity<BPSkill>(
                    b => b.HasOne<Item>(bpsk => bpsk.Skill)
                        .WithMany(bp => bp.BPSkills)
                        .IsRequired(false)
                        .HasForeignKey(bpsk => bpsk.SkillId)
                        .OnDelete(DeleteBehavior.NoAction));

            entity.HasMany(bp => bp.Products)
                .WithMany(bp => bp.Blueprints)
                .UsingEntity<BPProduct>(
                    b => b.HasOne<Item>(bppr => bppr.Product)
                        .WithMany(bp => bp.BPProducts)
                        .IsRequired(false)
                        .HasForeignKey(bppr => bppr.ProductTypeId)
                        .OnDelete(DeleteBehavior.NoAction));

            entity.HasMany(bp => bp.Materials)
                .WithMany(bp => bp.Blueprints)
                .UsingEntity<BPMaterial>(
                    b => b.HasOne<Item>(bpmt => bpmt.Material)
                        .WithMany(bp => bp.BPMaterials)
                        .IsRequired(false)
                        .HasForeignKey(bpmt => bpmt.MaterialTypeId)
                        .OnDelete(DeleteBehavior.NoAction));
        });

        modelBuilder.Entity<Agent>(entity =>
        {
            entity.HasKey(e => e.AgentId).HasName("PRIMARY");

            entity
                .ToTable("agents")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CorporationId, "IDX_agents_CID");

            entity.HasIndex(e => e.LocationId, "IDX_agents_LID");

            entity.Property(e => e.AgentId)
                .ValueGeneratedNever()
                .HasColumnName("agentID");
            entity.Property(e => e.AgentTypeId).HasColumnName("agentTypeID");
            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.DivisionId).HasColumnName("divisionID");
            entity.Property(e => e.IsLocator).HasColumnName("isLocator");
            entity.Property(e => e.Level).HasColumnName("level");
            entity.Property(e => e.LocationId).HasColumnName("locationID");
        });

        modelBuilder.Entity<AgentsInSpace>(entity =>
        {
            entity.HasKey(e => e.AgentId).HasName("PRIMARY");

            entity
                .ToTable("agentsInSpace")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.AgentId, "IDX_agentsInSpace_AID");

            entity.HasIndex(e => e.SolarSystemId, "IDX_agentsInSpace_SSID");

            entity.Property(e => e.AgentId)
                .ValueGeneratedNever()
                .HasColumnName("agentID");
            entity.Property(e => e.DungeonId).HasColumnName("dungeonID");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
            entity.Property(e => e.SpawnPointId).HasColumnName("spawnPointID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<Ancestry>(entity =>
        {
            entity.HasKey(e => e.AncestryId).HasName("PRIMARY");

            entity
                .ToTable("ancestries")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.AncestryId).HasColumnName("ancestryID");
            entity.Property(e => e.AncestryName)
                .HasMaxLength(100)
                .HasColumnName("ancestryName");
            entity.Property(e => e.BloodlineId).HasColumnName("bloodlineID");
            entity.Property(e => e.Charisma).HasColumnName("charisma");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Intelligence).HasColumnName("intelligence");
            entity.Property(e => e.Memory).HasColumnName("memory");
            entity.Property(e => e.Perception).HasColumnName("perception");
            entity.Property(e => e.ShortDescription)
                .HasMaxLength(500)
                .HasColumnName("shortDescription");
            entity.Property(e => e.Willpower).HasColumnName("willpower");
        });

        modelBuilder.Entity<Bloodline>(entity =>
        {
            entity.HasKey(e => e.BloodlineId).HasName("PRIMARY");

            entity
                .ToTable("bloodlines")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.BloodlineId).HasColumnName("bloodlineID");
            entity.Property(e => e.BloodlineName)
                .HasMaxLength(100)
                .HasColumnName("bloodlineName");
            entity.Property(e => e.Charisma).HasColumnName("charisma");
            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Intelligence).HasColumnName("intelligence");
            entity.Property(e => e.Memory).HasColumnName("memory");
            entity.Property(e => e.Perception).HasColumnName("perception");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.ShipTypeId).HasColumnName("shipTypeID");
            entity.Property(e => e.Willpower).HasColumnName("willpower");
        });

        modelBuilder.Entity<BloodlineLastName>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("bloodlineLastNames")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.BloodlineId).HasColumnName("bloodlineID");
            entity.Property(e => e.LastName)
                .HasMaxLength(100)
                .HasColumnName("lastName");
        });

        modelBuilder.Entity<CharacterAttribute>(entity =>
        {
            entity.HasKey(e => e.AttributeId).HasName("PRIMARY");

            entity
                .ToTable("characterAttributes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.AttributeId).HasColumnName("attributeID");
            entity.Property(e => e.AttributeName)
                .HasMaxLength(100)
                .HasColumnName("attributeName");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Notes)
                .HasMaxLength(500)
                .HasColumnName("notes");
            entity.Property(e => e.ShortDescription)
                .HasMaxLength(500)
                .HasColumnName("shortDescription");
        });

        modelBuilder.Entity<ContrabandType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("contrabandTypes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.TypeId, "IDX_contrabandTypes_TID");

            entity.Property(e => e.AttackMinSec).HasColumnName("attackMinSec");
            entity.Property(e => e.ConfiscateMinSec).HasColumnName("confiscateMinSec");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.FineByValue).HasColumnName("fineByValue");
            entity.Property(e => e.StandingLoss).HasColumnName("standingLoss");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<ControlTowerResource>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("controlTowerResources")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.TypeId, "IDX_controlTowerResources_TID");

            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.MinSecurityLevel).HasColumnName("minSecurityLevel");
            entity.Property(e => e.Purpose).HasColumnName("purpose");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.ResourceTypeId).HasColumnName("resourceTypeID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<CorporationActivity>(entity =>
        {
            entity.HasKey(e => e.ActivityId).HasName("PRIMARY");

            entity
                .ToTable("corporationActivities")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ActivityId).HasColumnName("activityID");
            entity.Property(e => e.ActivityName)
                .HasMaxLength(100)
                .HasColumnName("activityName");
        });

        modelBuilder.Entity<CorporationAllowedMemberRace>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationAllowedMemberRaces")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.MemberRace).HasColumnName("memberRace");
        });

        modelBuilder.Entity<CorporationDivision>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationDivisions")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.DivisionId).HasColumnName("divisionID");
            entity.Property(e => e.DivisionNumber).HasColumnName("divisionNumber");
            entity.Property(e => e.LeaderId).HasColumnName("leaderID");
            entity.Property(e => e.Size).HasColumnName("size");
        });

        modelBuilder.Entity<CorporationExchangeRate>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationExchangeRates")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.ExchangeId).HasColumnName("exchangeID");
            entity.Property(e => e.ExchangeRate).HasColumnName("exchangeRate");
        });

        modelBuilder.Entity<CorporationInvestor>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationInvestors")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.InvestorId).HasColumnName("investorID");
            entity.Property(e => e.Shares).HasColumnName("shares");
        });

        modelBuilder.Entity<CorporationLpoffer>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationLPOffers")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.LpOfferTableId).HasColumnName("lpOfferTableID");
        });

        modelBuilder.Entity<CorporationTrade>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("corporationTrades")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.Value).HasColumnName("value");
        });

        modelBuilder.Entity<CrtCertificate>(entity =>
        {
            entity.HasKey(e => e.CertificateId).HasName("PRIMARY");

            entity
                .ToTable("crtCertificates")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CertificateId)
                .ValueGeneratedNever()
                .HasColumnName("certificateID");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.Name)
                .HasMaxLength(100)
                .HasColumnName("name");
        });

        modelBuilder.Entity<CrtCertificateSkill>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("crtCertificateSkills")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CertificateId, "IDX_crtCertificateSkills_CID");

            entity.HasIndex(e => e.SkillTypeId, "IDX_crtCertificateSkills_SID");

            entity.Property(e => e.CertificateId).HasColumnName("certificateID");
            entity.Property(e => e.MasteryLevel).HasColumnName("masteryLevel");
            entity.Property(e => e.MasteryText)
                .HasMaxLength(10)
                .HasColumnName("masteryText");
            entity.Property(e => e.RequiredSkillLevel).HasColumnName("requiredSkillLevel");
            entity.Property(e => e.SkillTypeId).HasColumnName("skillTypeID");
        });

        modelBuilder.Entity<CrtMastery>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("crtMasteries")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.TypeId, "IDX_crtMasteries_TID");

            entity.Property(e => e.MasteryLevel).HasColumnName("masteryLevel");
            entity.Property(e => e.MasteryRecommendedTypeId).HasColumnName("masteryRecommendedTypeID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<CrtRecommendedType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("crtRecommendedTypes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => new { e.TypeId, e.CertificateId }, "IDX_crtRecommendedTypes_TID_CID");

            entity.Property(e => e.CertificateId).HasColumnName("certificateID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<DogmaAttribute>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("dogmaAttributes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.AttributeId).HasColumnName("attributeID");
            entity.Property(e => e.AttributeName)
                .HasMaxLength(100)
                .HasColumnName("attributeName");
            entity.Property(e => e.CategoryId).HasColumnName("categoryID");
            entity.Property(e => e.ChargeRechargeTimeId).HasColumnName("chargeRechargeTimeID");
            entity.Property(e => e.DataType)
                .HasMaxLength(100)
                .HasColumnName("dataType");
            entity.Property(e => e.DefaultValue).HasColumnName("defaultValue");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.DisplayNameId)
                .HasMaxLength(1000)
                .HasColumnName("displayNameID");
            entity.Property(e => e.DisplayWhenZero).HasColumnName("displayWhenZero");
            entity.Property(e => e.HighIsGood).HasColumnName("highIsGood");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.MaxAttributeId).HasColumnName("maxAttributeID");
            entity.Property(e => e.MinAttributeId).HasColumnName("minAttributeID");
            entity.Property(e => e.Name)
                .HasMaxLength(1000)
                .HasColumnName("name");
            entity.Property(e => e.Published).HasColumnName("published");
            entity.Property(e => e.Stackable).HasColumnName("stackable");
            entity.Property(e => e.TooltipDescriptionId)
                .HasMaxLength(1000)
                .HasColumnName("tooltipDescriptionID");
            entity.Property(e => e.TooltipTitleId)
                .HasMaxLength(1000)
                .HasColumnName("tooltipTitleID");
            entity.Property(e => e.UnitId).HasColumnName("unitID");
        });

        modelBuilder.Entity<DogmaAttributeCategory>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity
                .ToTable("dogmaAttributeCategories")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CategoryId).HasColumnName("categoryID");
            entity.Property(e => e.Description)
                .HasMaxLength(200)
                .HasColumnName("description");
            entity.Property(e => e.Name)
                .HasMaxLength(50)
                .HasColumnName("name");
        });

        modelBuilder.Entity<DogmaEffect>(entity =>
        {
            entity.HasKey(e => e.EffectId).HasName("PRIMARY");

            entity
                .ToTable("dogmaEffects")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.EffectId)
                .ValueGeneratedNever()
                .HasColumnName("effectID");
            entity.Property(e => e.DescriptionId)
                .HasMaxLength(1000)
                .HasColumnName("descriptionID");
            entity.Property(e => e.DisallowAutoRepeat).HasColumnName("disallowAutoRepeat");
            entity.Property(e => e.DischargeAttributeId).HasColumnName("dischargeAttributeID");
            entity.Property(e => e.DisplayNameId)
                .HasMaxLength(1000)
                .HasColumnName("displayNameID");
            entity.Property(e => e.Distribution)
                .HasMaxLength(100)
                .HasColumnName("distribution");
            entity.Property(e => e.DurationAttributeId).HasColumnName("durationAttributeID");
            entity.Property(e => e.EffectCategory)
                .HasMaxLength(100)
                .HasColumnName("effectCategory");
            entity.Property(e => e.EffectName)
                .HasMaxLength(400)
                .HasColumnName("effectName");
            entity.Property(e => e.ElectronicChance).HasColumnName("electronicChance");
            entity.Property(e => e.FalloffAttributeId).HasColumnName("falloffAttributeID");
            entity.Property(e => e.FittingUsageChanceAttributeId).HasColumnName("fittingUsageChanceAttributeID");
            entity.Property(e => e.Guid)
                .HasMaxLength(60)
                .HasColumnName("guid");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.IsAssistance).HasColumnName("isAssistance");
            entity.Property(e => e.IsOffensive).HasColumnName("isOffensive");
            entity.Property(e => e.IsWarpSafe).HasColumnName("isWarpSafe");
            entity.Property(e => e.NpcActivationChanceAttributeId).HasColumnName("npcActivationChanceAttributeID");
            entity.Property(e => e.NpcUsageChanceAttributeId).HasColumnName("npcUsageChanceAttributeID");
            entity.Property(e => e.PropulsionChance).HasColumnName("propulsionChance");
            entity.Property(e => e.Published).HasColumnName("published");
            entity.Property(e => e.RangeAttributeId).HasColumnName("rangeAttributeID");
            entity.Property(e => e.RangeChance).HasColumnName("rangeChance");
            entity.Property(e => e.ResistanceAttributeId).HasColumnName("resistanceAttributeID");
            entity.Property(e => e.SfxName)
                .HasMaxLength(20)
                .HasColumnName("sfxName");
            entity.Property(e => e.TrackingSpeedAttributeId).HasColumnName("trackingSpeedAttributeID");
        });

        modelBuilder.Entity<DogmaEffectsModifierInfo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("dogmaEffectsModifierInfo")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => new { e.EffectId, e.Domain, e.Func, e.GroupId, e.ModifiedAttributeId, e.ModifyingAttributeId, e.Operation, e.SkillTypeId, e.SecondaryEffectId }, "IDX_dogmaEffectsModifierInfo_EID").IsUnique();

            entity.Property(e => e.Domain)
                .HasMaxLength(50)
                .HasColumnName("domain");
            entity.Property(e => e.EffectId).HasColumnName("effectID");
            entity.Property(e => e.Func)
                .HasMaxLength(50)
                .HasColumnName("func");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.ModifiedAttributeId).HasColumnName("modifiedAttributeID");
            entity.Property(e => e.ModifyingAttributeId).HasColumnName("modifyingAttributeID");
            entity.Property(e => e.Operation)
                .HasMaxLength(50)
                .HasColumnName("operation");
            entity.Property(e => e.SecondaryEffectId).HasColumnName("secondaryEffectID");
            entity.Property(e => e.SkillTypeId).HasColumnName("skillTypeID");
        });

        modelBuilder.Entity<DogmaTypeAttribute>(entity =>
        {
            entity.HasKey(e => new { e.TypeId, e.AttributeId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("dogmaTypeAttributes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.AttributeId).HasColumnName("attributeID");
            entity.Property(e => e.Value).HasColumnName("value");
        });

        modelBuilder.Entity<DogmaTypeEffect>(entity =>
        {
            entity.HasKey(e => new { e.TypeId, e.EffectId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("dogmaTypeEffects")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.EffectId).HasColumnName("effectID");
            entity.Property(e => e.IsDefault).HasColumnName("isDefault");
        });

        modelBuilder.Entity<EfmigrationsHistory>(entity =>
        {
            entity.HasKey(e => e.MigrationId).HasName("PRIMARY");

            entity.ToTable("__EFMigrationsHistory");

            entity.Property(e => e.MigrationId).HasMaxLength(150);
            entity.Property(e => e.ProductVersion).HasMaxLength(32);
        });

        modelBuilder.Entity<EveGraphic>(entity =>
        {
            entity.HasKey(e => e.GraphicId).HasName("PRIMARY");

            entity
                .ToTable("eveGraphics")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.GraphicId)
                .ValueGeneratedNever()
                .HasColumnName("graphicID");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.GraphicFile)
                .HasMaxLength(150)
                .HasColumnName("graphicFile");
            entity.Property(e => e.SofFactionName)
                .HasMaxLength(100)
                .HasColumnName("sofFactionName");
            entity.Property(e => e.SofHullName)
                .HasMaxLength(100)
                .HasColumnName("sofHullName");
            entity.Property(e => e.SofRaceName)
                .HasMaxLength(100)
                .HasColumnName("sofRaceName");
        });

        modelBuilder.Entity<EveIcon>(entity =>
        {
            entity.HasKey(e => e.IconId).HasName("PRIMARY");

            entity
                .ToTable("eveIcons")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.IconId)
                .ValueGeneratedNever()
                .HasColumnName("iconID");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.IconFile)
                .HasMaxLength(500)
                .HasColumnName("iconFile");
            entity.Property(e => e.Obsolete).HasColumnName("obsolete");
        });

        modelBuilder.Entity<EveIconsBackground>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("eveIconsBackgrounds")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_eveIconsBackgrounds_GID");

            entity.Property(e => e.BackgroundProperty)
                .HasMaxLength(50)
                .HasColumnName("backgroundProperty");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<EveIconsForeground>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("eveIconsForegrounds")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_eveIconsForegrounds_GID");

            entity.Property(e => e.ForegroundProperty)
                .HasMaxLength(50)
                .HasColumnName("foregroundProperty");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<EvegraphicBackground>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("evegraphicBackgrounds")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_evegraphicBackgrounds_GID");

            entity.Property(e => e.BackgroundProperty)
                .HasMaxLength(50)
                .HasColumnName("backgroundProperty");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<EvegraphicForeground>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("evegraphicForegrounds")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_evegraphicForegrounds_GID");

            entity.Property(e => e.ForegroundProperty)
                .HasMaxLength(50)
                .HasColumnName("foregroundProperty");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<EvegraphicIconInfo>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("evegraphicIconInfo")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_evegraphicIconInfo_GID");

            entity.Property(e => e.Folder)
                .HasMaxLength(100)
                .HasColumnName("folder");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<Faction>(entity =>
        {
            entity.HasKey(e => e.FactionId).HasName("PRIMARY");

            entity
                .ToTable("factions")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.FactionId)
                .ValueGeneratedNever()
                .HasColumnName("factionID");
            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.Description)
                .HasMaxLength(2000)
                .HasColumnName("description");
            entity.Property(e => e.FactionName)
                .HasMaxLength(100)
                .HasColumnName("factionName");
            entity.Property(e => e.FlatLogo)
                .HasMaxLength(100)
                .HasColumnName("flatLogo");
            entity.Property(e => e.FlatLogoWithName)
                .HasMaxLength(100)
                .HasColumnName("flatLogoWithName");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.MilitiaCorporationId).HasColumnName("militiaCorporationID");
            entity.Property(e => e.ShortDescriptionId)
                .HasMaxLength(500)
                .HasColumnName("shortDescriptionID");
            entity.Property(e => e.SizeFactor).HasColumnName("sizeFactor");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
            entity.Property(e => e.UniqueName).HasColumnName("uniqueName");
        });

        modelBuilder.Entity<FactionsMemberRace>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("factionsMemberRaces")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.MemberRace).HasColumnName("memberRace");
        });

        modelBuilder.Entity<GraphicsofLayout>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("graphicsofLayouts")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GraphicId, "IDX_graphicsofLayouts_GID");

            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
            entity.Property(e => e.SofLayout)
                .HasMaxLength(100)
                .HasColumnName("sofLayout");
        });

        // modelBuilder.Entity<BPTime>(entity =>
        // {
        //     entity.HasKey(e => new { e.BlueprintTypeId, e.ActivityId })
        //         .HasName("PRIMARY")
        //         .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

        //     entity
        //         .ToTable("industryActivities")
        //         .UseCollation("utf8mb4_unicode_ci");

        //     entity.HasIndex(e => e.ActivityId, "IDX_industryActivities_AID");

        //     entity.Property(e => e.BlueprintTypeId).HasColumnName("blueprintTypeID");
        //     entity.Property(e => e.ActivityId).HasColumnName("activityID");
        //     entity.Property(e => e.Time).HasColumnName("time");
        // });

        // modelBuilder.Entity<BPMaterial>(entity =>
        // {
        //     entity
        //         .HasNoKey()
        //         .ToTable("industryActivityMaterials")
        //         .UseCollation("utf8mb4_unicode_ci");

        //     entity.HasIndex(e => new { e.BlueprintTypeId, e.ActivityId }, "IDX_industryActivityMaterials_TID_AID");

        //     entity.Property(e => e.ActivityId).HasColumnName("activityID");
        //     entity.Property(e => e.BlueprintTypeId).HasColumnName("blueprintTypeID");
        //     entity.Property(e => e.MaterialTypeId).HasColumnName("materialTypeID");
        //     entity.Property(e => e.Quantity).HasColumnName("quantity");
        // });

        // modelBuilder.Entity<BPProduct>(entity =>
        // {
        //     entity
        //         .HasNoKey()
        //         .ToTable("industryActivityProducts")
        //         .UseCollation("utf8mb4_unicode_ci");

        //     entity.HasIndex(e => e.ProductTypeId, "IDX_industryActivityProducts_PTID");

        //     entity.HasIndex(e => new { e.BlueprintTypeId, e.ActivityId }, "IDX_industryActivityProducts_TID_AID");

        //     entity.Property(e => e.ActivityId).HasColumnName("activityID");
        //     entity.Property(e => e.BlueprintTypeId).HasColumnName("blueprintTypeID");
        //     entity.Property(e => e.Probability).HasColumnName("probability");
        //     entity.Property(e => e.ProductTypeId).HasColumnName("productTypeID");
        //     entity.Property(e => e.Quantity).HasColumnName("quantity");
        // });

        // modelBuilder.Entity<BPSkill>(entity =>
        // {
        //     entity
        //         .HasNoKey()
        //         .ToTable("industryActivitySkills")
        //         .UseCollation("utf8mb4_unicode_ci");

        //     entity.HasIndex(e => new { e.BlueprintTypeId, e.ActivityId }, "IDX_industryActivitySkills_TID_AID");

        //     entity.Property(e => e.ActivityId).HasColumnName("activityID");
        //     entity.Property(e => e.BlueprintTypeId).HasColumnName("blueprintTypeID");
        //     entity.Property(e => e.Level).HasColumnName("level");
        //     entity.Property(e => e.SkillId).HasColumnName("skillID");
        // });

        // modelBuilder.Entity<Blueprint>(entity =>
        // {
        //     entity.HasKey(e => e.BlueprintTypeId).HasName("PRIMARY");

        //     entity
        //         .ToTable("industryBlueprints")
        //         .UseCollation("utf8mb4_unicode_ci");

        //     entity.HasIndex(e => e.BlueprintTypeId, "IDX_industryBlueprints_BPID");

        //     entity.Property(e => e.BlueprintTypeId)
        //         .ValueGeneratedNever()
        //         .HasColumnName("blueprintTypeID");
        //     entity.Property(e => e.MaxProductionLimit).HasColumnName("maxProductionLimit");
        // });

modelBuilder.Entity<Blueprint>(entity =>
            {
                entity.HasKey(bp => bp.BlueprintTypeId);
                entity.HasOne(it => it.ItemProperty)
                    .WithOne()
                    .HasForeignKey<Item>(bp => bp.TypeId)
                    .IsRequired(false)
                    .OnDelete(DeleteBehavior.NoAction);

                entity.HasMany(bp => bp.BPTimes)
                    .WithOne(bp => bp.Blueprint)
                    .HasForeignKey(bp => bp.BlueprintTypeId)
                    .IsRequired();

                entity.HasMany(bp => bp.Skills)
                    .WithMany(bp => bp.Blueprints)
                    .UsingEntity<BPSkill>(
                        b => b.HasOne<Item>(bpsk => bpsk.Skill)
                            .WithMany(bp => bp.BPSkills)
                            .IsRequired(false)
                            .HasForeignKey(bpsk => bpsk.SkillId)
                            .OnDelete(DeleteBehavior.NoAction));

                entity.HasMany(bp => bp.Products)
                    .WithMany(bp => bp.Blueprints)
                    .UsingEntity<BPProduct>(
                        b => b.HasOne<Item>(bppr => bppr.Product)
                            .WithMany(bp => bp.BPProducts)
                            .IsRequired(false)
                            .HasForeignKey(bppr => bppr.ProductTypeId)
                            .OnDelete(DeleteBehavior.NoAction));

                entity.HasMany(bp => bp.Materials)
                    .WithMany(bp => bp.Blueprints)
                    .UsingEntity<BPMaterial>(
                        b => b.HasOne<Item>(bpmt => bpmt.Material)
                            .WithMany(bp => bp.BPMaterials)
                            .IsRequired(false)
                            .HasForeignKey(bpmt => bpmt.MaterialTypeId)
                            .OnDelete(DeleteBehavior.NoAction));
            });

        modelBuilder.Entity<Category>(entity =>
        {
            entity.HasKey(e => e.CategoryId).HasName("PRIMARY");

            entity
                .ToTable("invCategories")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CategoryId, "IDX_invCategories_CID");

            entity.Property(e => e.CategoryId)
                .ValueGeneratedNever()
                .HasColumnName("categoryID");
            entity.Property(e => e.CategoryName)
                .HasMaxLength(500)
                .HasColumnName("categoryName");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Published).HasColumnName("published");
        });

        modelBuilder.Entity<InvFlag>(entity =>
        {
            entity.HasKey(e => e.FlagId).HasName("PRIMARY");

            entity
                .ToTable("invFlags")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.FlagId)
                .ValueGeneratedNever()
                .HasColumnName("flagID");
            entity.Property(e => e.FlagName)
                .HasMaxLength(200)
                .HasColumnName("flagName");
            entity.Property(e => e.FlagText)
                .HasMaxLength(100)
                .HasColumnName("flagText");
            entity.Property(e => e.OrderId).HasColumnName("orderID");
        });

        modelBuilder.Entity<Group>(entity =>
        {
            entity.HasKey(e => e.GroupId).HasName("PRIMARY");

            entity
                .ToTable("invGroups")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.CategoryId, "IDX_invGroups_CID");

            entity.HasIndex(e => e.GroupId, "IDX_invGroups_GID");

            entity.Property(e => e.GroupId)
                .ValueGeneratedNever()
                .HasColumnName("groupID");
            entity.Property(e => e.Anchorable).HasColumnName("anchorable");
            entity.Property(e => e.Anchored).HasColumnName("anchored");
            entity.Property(e => e.CategoryId).HasColumnName("categoryID");
            entity.Property(e => e.FittableNonSingleton).HasColumnName("fittableNonSingleton");
            entity.Property(e => e.GroupName)
                .HasMaxLength(500)
                .HasColumnName("groupName");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Published).HasColumnName("published");
            entity.Property(e => e.UseBasePrice).HasColumnName("useBasePrice");
        });

        modelBuilder.Entity<InvItem>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("invItems")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.LocationId, "IDX_invItems_LID");

            entity.HasIndex(e => new { e.OwnerId, e.LocationId }, "IDX_invItems_OID_LID");

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.FlagId).HasColumnName("flagID");
            entity.Property(e => e.LocationId).HasColumnName("locationID");
            entity.Property(e => e.OwnerId).HasColumnName("ownerID");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<Name>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("invNames")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.ItemName)
                .HasMaxLength(200)
                .HasColumnName("itemName");
        });

        modelBuilder.Entity<InvPosition>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("invPositions")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.Pitch).HasColumnName("pitch");
            entity.Property(e => e.Roll).HasColumnName("roll");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Yaw).HasColumnName("yaw");
            entity.Property(e => e.Z).HasColumnName("z");
        });

        modelBuilder.Entity<InvTrait>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("invTraits")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.BonusId, "IDX_invTraits_BID");

            entity.HasIndex(e => e.TypeId, "IDX_invTraits_TID");

            entity.Property(e => e.Bonus).HasColumnName("bonus");
            entity.Property(e => e.BonusId).HasColumnName("bonusID");
            entity.Property(e => e.BonusText).HasColumnName("bonusText");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.Importance).HasColumnName("importance");
            entity.Property(e => e.IsPositive).HasColumnName("isPositive");
            entity.Property(e => e.NameId).HasColumnName("nameID");
            entity.Property(e => e.SkilltypeId).HasColumnName("skilltypeID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.UnitId).HasColumnName("unitID");
        });

        modelBuilder.Entity<Item>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PRIMARY");

            entity
                .ToTable("invTypes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.GroupId, "IDX_invTypes_GID");

            entity.HasIndex(e => e.MarketGroupId, "IDX_invTypes_MGID");

            entity.HasIndex(e => e.TypeId, "IDX_invTypes_TID");

            entity.Property(e => e.TypeId)
                .ValueGeneratedNever()
                .HasColumnName("typeID");
            entity.Property(e => e.BasePrice).HasColumnName("basePrice");
            entity.Property(e => e.Capacity).HasColumnName("capacity");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.MarketGroupId).HasColumnName("marketGroupID");
            entity.Property(e => e.Mass).HasColumnName("mass");
            entity.Property(e => e.MetaGroupId).HasColumnName("metaGroupID");
            entity.Property(e => e.PackagedVolume).HasColumnName("packagedVolume");
            entity.Property(e => e.PortionSize).HasColumnName("portionSize");
            entity.Property(e => e.Published).HasColumnName("published");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.Radius).HasColumnName("radius");
            entity.Property(e => e.SofFactionName)
                .HasMaxLength(100)
                .HasColumnName("sofFactionName");
            entity.Property(e => e.SofMaterialSetId).HasColumnName("sofMaterialSetID");
            entity.Property(e => e.SoundId).HasColumnName("soundID");
            entity.Property(e => e.TypeName)
                .HasMaxLength(500)
                .HasColumnName("typeName");
            entity.Property(e => e.VariationparentTypeId).HasColumnName("variationparentTypeID");
            entity.Property(e => e.Volume).HasColumnName("volume");
        });

        modelBuilder.Entity<InvUniqueName>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("invUniqueNames")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => new { e.GroupId, e.ItemName }, "IDX_invUniqueNames_GID_IN");

            entity.HasIndex(e => e.ItemName, "IDX_invUniqueNames_IN").IsUnique();

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.ItemName)
                .HasMaxLength(200)
                .HasColumnName("itemName");
        });

        modelBuilder.Entity<CelestialStatistic>(entity =>
        {
            entity.HasKey(e => e.CelestialId).HasName("PRIMARY");

            entity
                .ToTable("mapCelestialStatistics")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CelestialId)
                .ValueGeneratedNever()
                .HasColumnName("celestialID");
            entity.Property(e => e.Age).HasColumnName("age");
            entity.Property(e => e.Density).HasColumnName("density");
            entity.Property(e => e.Eccentricity).HasColumnName("eccentricity");
            entity.Property(e => e.EscapeVelocity).HasColumnName("escapeVelocity");
            entity.Property(e => e.Fragmented).HasColumnName("fragmented");
            entity.Property(e => e.HeightMap1).HasColumnName("heightMap1");
            entity.Property(e => e.HeightMap2).HasColumnName("heightMap2");
            entity.Property(e => e.Life).HasColumnName("life");
            entity.Property(e => e.Locked).HasColumnName("locked");
            entity.Property(e => e.Luminosity).HasColumnName("luminosity");
            entity.Property(e => e.MassDust).HasColumnName("massDust");
            entity.Property(e => e.MassGas).HasColumnName("massGas");
            entity.Property(e => e.OrbitPeriod).HasColumnName("orbitPeriod");
            entity.Property(e => e.OrbitRadius).HasColumnName("orbitRadius");
            entity.Property(e => e.Population).HasColumnName("population");
            entity.Property(e => e.Pressure).HasColumnName("pressure");
            entity.Property(e => e.Radius).HasColumnName("radius");
            entity.Property(e => e.RotationRate).HasColumnName("rotationRate");
            entity.Property(e => e.ShaderPreset).HasColumnName("shaderPreset");
            entity.Property(e => e.SpectralClass)
                .HasMaxLength(10)
                .HasColumnName("spectralClass");
            entity.Property(e => e.SurfaceGravity).HasColumnName("surfaceGravity");
            entity.Property(e => e.Temperature).HasColumnName("temperature");
        });

        modelBuilder.Entity<Constellation>(entity =>
        {
            entity.HasKey(e => e.ConstellationId).HasName("PRIMARY");

            entity
                .ToTable("mapConstellations")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ConstellationId)
                .ValueGeneratedNever()
                .HasColumnName("constellationID");
            entity.Property(e => e.ConstellationName)
                .HasMaxLength(100)
                .HasColumnName("constellationName");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.Radius).HasColumnName("radius");
            entity.Property(e => e.RegionId).HasColumnName("regionID");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.X_Max).HasColumnName("x_Max");
            entity.Property(e => e.X_Min).HasColumnName("x_Min");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Y_Max).HasColumnName("y_Max");
            entity.Property(e => e.Y_Min).HasColumnName("y_Min");
            entity.Property(e => e.Z).HasColumnName("z");
            entity.Property(e => e.Z_Max).HasColumnName("z_Max");
            entity.Property(e => e.Z_Min).HasColumnName("z_Min");
        });

        modelBuilder.Entity<Denormalize>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("mapDenormalize")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.CelestialIndex).HasColumnName("celestialIndex");
            entity.Property(e => e.ConstellationId).HasColumnName("constellationID");
            entity.Property(e => e.NameId).HasColumnName("nameID");
            entity.Property(e => e.OrbitId).HasColumnName("orbitID");
            entity.Property(e => e.OrbitIndex).HasColumnName("orbitIndex");
            entity.Property(e => e.Radius).HasColumnName("radius");
            entity.Property(e => e.RegionId).HasColumnName("regionID");
            entity.Property(e => e.Security).HasColumnName("security");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Z).HasColumnName("z");
        });

        modelBuilder.Entity<MapDisallowedAnchorCategory>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("mapDisallowedAnchorCategories")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CategoryId).HasColumnName("categoryID");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
        });

        modelBuilder.Entity<MapDisallowedAnchorGroup>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("mapDisallowedAnchorGroups")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
        });

        modelBuilder.Entity<MapItemEffectBeacon>(entity =>
        {
            entity.HasKey(e => e.ItemId).HasName("PRIMARY");

            entity
                .ToTable("mapItemEffectBeacons")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ItemId)
                .ValueGeneratedNever()
                .HasColumnName("itemID");
            entity.Property(e => e.EffectBeaconTypeId).HasColumnName("effectBeaconTypeID");
        });

        modelBuilder.Entity<MapJump>(entity =>
        {
            entity.HasKey(e => e.StargateId).HasName("PRIMARY");

            entity
                .ToTable("mapJumps")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.StargateId)
                .ValueGeneratedNever()
                .HasColumnName("stargateID");
            entity.Property(e => e.DestinationId).HasColumnName("destinationID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Z).HasColumnName("z");
        });

        modelBuilder.Entity<MapLandmark>(entity =>
        {
            entity.HasKey(e => e.LandmarkId).HasName("PRIMARY");

            entity
                .ToTable("mapLandmarks")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.LandmarkId)
                .ValueGeneratedNever()
                .HasColumnName("landmarkID");
            entity.Property(e => e.Description).HasColumnName("description");
            entity.Property(e => e.DescriptionId).HasColumnName("descriptionID");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.LandmarkName)
                .HasMaxLength(100)
                .HasColumnName("landmarkName");
            entity.Property(e => e.LandmarkNameId).HasColumnName("landmarkNameID");
            entity.Property(e => e.LocationId).HasColumnName("locationID");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Z).HasColumnName("z");
        });

        modelBuilder.Entity<MapLocationScene>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PRIMARY");

            entity
                .ToTable("mapLocationScenes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.LocationId)
                .ValueGeneratedNever()
                .HasColumnName("locationID");
            entity.Property(e => e.GraphicId).HasColumnName("graphicID");
        });

        modelBuilder.Entity<MapLocationWormholeClass>(entity =>
        {
            entity.HasKey(e => e.LocationId).HasName("PRIMARY");

            entity
                .ToTable("mapLocationWormholeClasses")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.LocationId)
                .ValueGeneratedNever()
                .HasColumnName("locationID");
            entity.Property(e => e.WormholeClassId).HasColumnName("wormholeClassID");
        });

        modelBuilder.Entity<Region>(entity =>
        {
            entity.HasKey(e => e.RegionId).HasName("PRIMARY");

            entity
                .ToTable("mapRegions")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.RegionId)
                .ValueGeneratedNever()
                .HasColumnName("regionID");
            entity.Property(e => e.DescriptionId).HasColumnName("descriptionID");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.NameId).HasColumnName("nameID");
            entity.Property(e => e.RegionName)
                .HasMaxLength(100)
                .HasColumnName("regionName");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.X_Max).HasColumnName("x_Max");
            entity.Property(e => e.X_Min).HasColumnName("x_Min");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Y_Max).HasColumnName("y_Max");
            entity.Property(e => e.Y_Min).HasColumnName("y_Min");
            entity.Property(e => e.Z).HasColumnName("z");
            entity.Property(e => e.Z_Max).HasColumnName("z_Max");
            entity.Property(e => e.Z_Min).HasColumnName("z_Min");
        });

        modelBuilder.Entity<SolarSystem>(entity =>
        {
            entity.HasKey(e => e.SolarSystemId).HasName("PRIMARY");

            entity
                .ToTable("mapSolarSystems")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.SolarSystemId)
                .ValueGeneratedNever()
                .HasColumnName("solarSystemID");
            entity.Property(e => e.Border).HasColumnName("border");
            entity.Property(e => e.ConstellationId).HasColumnName("constellationID");
            entity.Property(e => e.Corridor).HasColumnName("corridor");
            entity.Property(e => e.DescriptionId).HasColumnName("descriptionID");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.Fringe).HasColumnName("fringe");
            entity.Property(e => e.Hub).HasColumnName("hub");
            entity.Property(e => e.International).HasColumnName("international");
            entity.Property(e => e.Luminosity).HasColumnName("luminosity");
            entity.Property(e => e.Radius).HasColumnName("radius");
            entity.Property(e => e.RegionId).HasColumnName("regionID");
            entity.Property(e => e.Regional).HasColumnName("regional");
            entity.Property(e => e.Security).HasColumnName("security");
            entity.Property(e => e.SecurityClass)
                .HasMaxLength(2)
                .HasColumnName("securityClass");
            entity.Property(e => e.SolarSystemName)
                .HasMaxLength(100)
                .HasColumnName("solarSystemName");
            entity.Property(e => e.SolarSystemNameId).HasColumnName("solarSystemNameID");
            entity.Property(e => e.SunTypeId).HasColumnName("sunTypeID");
            entity.Property(e => e.VisualEffect)
                .HasMaxLength(50)
                .HasColumnName("visualEffect");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.X_Max).HasColumnName("x_Max");
            entity.Property(e => e.X_Min).HasColumnName("x_Min");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Y_Max).HasColumnName("y_Max");
            entity.Property(e => e.Y_Min).HasColumnName("y_Min");
            entity.Property(e => e.Z).HasColumnName("z");
            entity.Property(e => e.Z_Max).HasColumnName("z_Max");
            entity.Property(e => e.Z_Min).HasColumnName("z_Min");
        });

        modelBuilder.Entity<MarketGroup>(entity =>
        {
            entity.HasKey(e => e.MarketGroupId).HasName("PRIMARY");

            entity
                .ToTable("marketGroups")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.MarketGroupId, "IDX_marketGroups_MGID");

            entity.Property(e => e.MarketGroupId)
                .ValueGeneratedNever()
                .HasColumnName("marketGroupID");
            entity.Property(e => e.DescriptionId)
                .HasMaxLength(300)
                .HasColumnName("descriptionID");
            entity.Property(e => e.HasTypes).HasColumnName("hasTypes");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.NameId)
                .HasMaxLength(100)
                .HasColumnName("nameID");
            entity.Property(e => e.ParentGroupId).HasColumnName("parentGroupID");
        });

        modelBuilder.Entity<MetaGroup>(entity =>
        {
            entity.HasKey(e => e.MetaGroupId).HasName("PRIMARY");

            entity
                .ToTable("metaGroups")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.MetaGroupId)
                .ValueGeneratedNever()
                .HasColumnName("metaGroupID");
            entity.Property(e => e.DescriptionId)
                .HasMaxLength(1000)
                .HasColumnName("descriptionID");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.IconSuffix)
                .HasMaxLength(30)
                .HasColumnName("iconSuffix");
            entity.Property(e => e.NameId)
                .HasMaxLength(100)
                .HasColumnName("nameID");
        });

        modelBuilder.Entity<MetaGroupsColor>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("metaGroupsColors")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ColorValue).HasColumnName("colorValue");
            entity.Property(e => e.MetaGroupId).HasColumnName("metaGroupID");
        });

        modelBuilder.Entity<NpcCorporation>(entity =>
        {
            entity.HasKey(e => e.CorporationId).HasName("PRIMARY");

            entity
                .ToTable("npcCorporations")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.CorporationId)
                .ValueGeneratedNever()
                .HasColumnName("corporationID");
            entity.Property(e => e.CeoId).HasColumnName("ceoID");
            entity.Property(e => e.CorporationDescription)
                .HasMaxLength(1500)
                .HasColumnName("corporationDescription");
            entity.Property(e => e.CorporationName)
                .HasMaxLength(100)
                .HasColumnName("corporationName");
            entity.Property(e => e.Deleted).HasColumnName("deleted");
            entity.Property(e => e.EnemyId).HasColumnName("enemyID");
            entity.Property(e => e.Extent)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("extent");
            entity.Property(e => e.FactionId).HasColumnName("factionID");
            entity.Property(e => e.FriendId).HasColumnName("friendID");
            entity.Property(e => e.HasPlayerPersonnelManager).HasColumnName("hasPlayerPersonnelManager");
            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.InitialPrice).HasColumnName("initialPrice");
            entity.Property(e => e.MainActivityId).HasColumnName("mainActivityID");
            entity.Property(e => e.MemberLimit).HasColumnName("memberLimit");
            entity.Property(e => e.MinSecurity).HasColumnName("minSecurity");
            entity.Property(e => e.MinimumJoinStanding).HasColumnName("minimumJoinStanding");
            entity.Property(e => e.PublicShares).HasColumnName("publicShares");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.SecondaryActivityId).HasColumnName("secondaryActivityID");
            entity.Property(e => e.SendCharTerminationMessage).HasColumnName("sendCharTerminationMessage");
            entity.Property(e => e.Shares).HasColumnName("shares");
            entity.Property(e => e.Size)
                .HasMaxLength(1)
                .IsFixedLength()
                .HasColumnName("size");
            entity.Property(e => e.SizeFactor).HasColumnName("sizeFactor");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
            entity.Property(e => e.StationId).HasColumnName("stationID");
            entity.Property(e => e.TaxRate).HasColumnName("taxRate");
            entity.Property(e => e.TickerName)
                .HasMaxLength(5)
                .HasColumnName("tickerName");
            entity.Property(e => e.UniqueName).HasColumnName("uniqueName");
            entity.Property(e => e.Url)
                .HasMaxLength(1000)
                .HasColumnName("url");
        });

        modelBuilder.Entity<NpcCorporationDivision>(entity =>
        {
            entity.HasKey(e => e.DivisionId).HasName("PRIMARY");

            entity
                .ToTable("npcCorporationDivisions")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.DivisionId).HasColumnName("divisionID");
            entity.Property(e => e.Description)
                .HasMaxLength(100)
                .HasColumnName("description");
            entity.Property(e => e.DescriptionId)
                .HasMaxLength(1000)
                .HasColumnName("descriptionID");
            entity.Property(e => e.InternalName)
                .HasMaxLength(100)
                .HasColumnName("internalName");
            entity.Property(e => e.LeaderTypeNameId)
                .HasMaxLength(100)
                .HasColumnName("leaderTypeNameID");
            entity.Property(e => e.NameId)
                .HasMaxLength(100)
                .HasColumnName("nameID");
        });

        modelBuilder.Entity<PlanetResource>(entity =>
        {
            entity.HasKey(e => e.StarId).HasName("PRIMARY");

            entity
                .ToTable("planetResources")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.StarId)
                .ValueGeneratedNever()
                .HasColumnName("starID");
            entity.Property(e => e.CycleMinutes).HasColumnName("cycle_minutes");
            entity.Property(e => e.HarvestSiloMax).HasColumnName("harvest_silo_max");
            entity.Property(e => e.MaturationCycleMinutes).HasColumnName("maturation_cycle_minutes");
            entity.Property(e => e.MaturationPercent).HasColumnName("maturation_percent");
            entity.Property(e => e.MatureSiloMax).HasColumnName("mature_silo_max");
            entity.Property(e => e.Power).HasColumnName("power");
            entity.Property(e => e.ReagentHarvestAmount).HasColumnName("reagent_harvest_amount");
            entity.Property(e => e.ReagentTypeId).HasColumnName("reagent_type_id");
            entity.Property(e => e.Workforce).HasColumnName("workforce");
        });

        modelBuilder.Entity<PlanetSchematic>(entity =>
        {
            entity.HasKey(e => e.SchematicId).HasName("PRIMARY");

            entity
                .ToTable("planetSchematics")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.SchematicId)
                .ValueGeneratedNever()
                .HasColumnName("schematicID");
            entity.Property(e => e.CycleTime).HasColumnName("cycleTime");
            entity.Property(e => e.SchematicName)
                .HasMaxLength(255)
                .HasColumnName("schematicName");
        });

        modelBuilder.Entity<PlanetSchematicsPinMap>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("planetSchematicsPinMap")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.PinTypeId).HasColumnName("pinTypeID");
            entity.Property(e => e.SchematicId).HasColumnName("schematicID");
        });

        modelBuilder.Entity<PlanetSchematicsTypeMap>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("planetSchematicsTypeMap")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.IsInput).HasColumnName("isInput");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
            entity.Property(e => e.SchematicId).HasColumnName("schematicID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<Race>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("races")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.IconId).HasColumnName("iconID");
            entity.Property(e => e.RaceDescription)
                .HasMaxLength(1000)
                .HasColumnName("raceDescription");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.RaceName)
                .HasMaxLength(100)
                .HasColumnName("raceName");
            entity.Property(e => e.ShipTypeId).HasColumnName("shipTypeID");
        });

        modelBuilder.Entity<RaceSkill>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("raceSkills")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.Level).HasColumnName("level");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.SkillTypeId).HasColumnName("skillTypeID");
        });

        modelBuilder.Entity<ResearchAgent>(entity =>
        {
            entity.HasKey(e => new { e.AgentId, e.TypeId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("researchAgents")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.TypeId, "IDX_researchAgents_TID");

            entity.Property(e => e.AgentId).HasColumnName("agentID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<Skin>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("skins")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.SkinId, "IDX_skins_SID");

            entity.Property(e => e.AllowCcpdevs).HasColumnName("allowCCPDevs");
            entity.Property(e => e.InternalName)
                .HasMaxLength(100)
                .HasColumnName("internalName");
            entity.Property(e => e.IsStructureSkin).HasColumnName("isStructureSkin");
            entity.Property(e => e.SkinDescription).HasColumnName("skinDescription");
            entity.Property(e => e.SkinId).HasColumnName("skinID");
            entity.Property(e => e.SkinMaterialId).HasColumnName("skinMaterialID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.VisibleSerenity).HasColumnName("visibleSerenity");
            entity.Property(e => e.VisibleTranquility).HasColumnName("visibleTranquility");
        });

        modelBuilder.Entity<SkinLicense>(entity =>
        {
            entity.HasKey(e => e.LicenseTypeId).HasName("PRIMARY");

            entity
                .ToTable("skinLicenses")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.LicenseTypeId)
                .ValueGeneratedNever()
                .HasColumnName("licenseTypeID");
            entity.Property(e => e.Duration).HasColumnName("duration");
            entity.Property(e => e.IsSingleUse).HasColumnName("isSingleUse");
            entity.Property(e => e.SkinId).HasColumnName("skinID");
        });

        modelBuilder.Entity<SkinMaterial>(entity =>
        {
            entity.HasKey(e => e.SkinMaterialId).HasName("PRIMARY");

            entity
                .ToTable("skinMaterials")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.SkinMaterialId)
                .ValueGeneratedNever()
                .HasColumnName("skinMaterialID");
            entity.Property(e => e.DisplayNameId).HasColumnName("displayNameID");
            entity.Property(e => e.MaterialSetId).HasColumnName("materialSetID");
        });

        modelBuilder.Entity<SovereigntyUpgrade>(entity =>
        {
            entity.HasKey(e => e.TypeId).HasName("PRIMARY");

            entity
                .ToTable("sovereigntyUpgrades")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.TypeId)
                .ValueGeneratedNever()
                .HasColumnName("typeID");
            entity.Property(e => e.FuelHourlyUpkeep).HasColumnName("fuel_hourly_upkeep");
            entity.Property(e => e.FuelStartupCost).HasColumnName("fuel_startup_cost");
            entity.Property(e => e.FuelTypeId).HasColumnName("fuel_type_id");
            entity.Property(e => e.MutuallyExclusiveGroup)
                .HasMaxLength(100)
                .HasColumnName("mutually_exclusive_group");
            entity.Property(e => e.PowerAllocation).HasColumnName("power_allocation");
            entity.Property(e => e.WorkforceAllocation).HasColumnName("workforce_allocation");
        });

        modelBuilder.Entity<Station>(entity =>
        {
            entity.HasKey(e => e.StationId).HasName("PRIMARY");

            entity
                .ToTable("staStations")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.ConstellationId, "IDX_staStations_CID");

            entity.HasIndex(e => e.CorporationId, "IDX_staStations_CPID");

            entity.HasIndex(e => e.OperationId, "IDX_staStations_OID");

            entity.HasIndex(e => e.RegionId, "IDX_staStations_RID");

            entity.HasIndex(e => e.SolarSystemId, "IDX_staStations_SSID");

            entity.HasIndex(e => e.StationTypeId, "IDX_staStations_STID");

            entity.Property(e => e.StationId)
                .ValueGeneratedNever()
                .HasColumnName("stationID");
            entity.Property(e => e.ConstellationId).HasColumnName("constellationID");
            entity.Property(e => e.CorporationId).HasColumnName("corporationID");
            entity.Property(e => e.DockingCostPerVolume).HasColumnName("dockingCostPerVolume");
            entity.Property(e => e.MaxShipVolumeDockable).HasColumnName("maxShipVolumeDockable");
            entity.Property(e => e.OfficeRentalCost).HasColumnName("officeRentalCost");
            entity.Property(e => e.OperationId).HasColumnName("operationID");
            entity.Property(e => e.RegionId).HasColumnName("regionID");
            entity.Property(e => e.ReprocessingEfficiency).HasColumnName("reprocessingEfficiency");
            entity.Property(e => e.ReprocessingHangarFlag).HasColumnName("reprocessingHangarFlag");
            entity.Property(e => e.ReprocessingStationsTake).HasColumnName("reprocessingStationsTake");
            entity.Property(e => e.Security).HasColumnName("security");
            entity.Property(e => e.SolarSystemId).HasColumnName("solarSystemID");
            entity.Property(e => e.StationName)
                .HasMaxLength(100)
                .HasColumnName("stationName");
            entity.Property(e => e.StationTypeId).HasColumnName("stationTypeID");
            entity.Property(e => e.X).HasColumnName("x");
            entity.Property(e => e.Y).HasColumnName("y");
            entity.Property(e => e.Z).HasColumnName("z");
        });

        modelBuilder.Entity<StationOperation>(entity =>
        {
            entity.HasKey(e => e.OperationId).HasName("PRIMARY");

            entity
                .ToTable("stationOperations")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.OperationId).HasColumnName("operationID");
            entity.Property(e => e.ActivityId).HasColumnName("activityID");
            entity.Property(e => e.Border).HasColumnName("border");
            entity.Property(e => e.Corridor).HasColumnName("corridor");
            entity.Property(e => e.Description)
                .HasMaxLength(1500)
                .HasColumnName("description");
            entity.Property(e => e.Fringe).HasColumnName("fringe");
            entity.Property(e => e.Hub).HasColumnName("hub");
            entity.Property(e => e.ManufacturingFactor).HasColumnName("manufacturingFactor");
            entity.Property(e => e.OperationName)
                .HasMaxLength(1000)
                .HasColumnName("operationName");
            entity.Property(e => e.Ratio).HasColumnName("ratio");
            entity.Property(e => e.ResearchFactor).HasColumnName("researchFactor");
        });

        modelBuilder.Entity<StationOperationService>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("stationOperationServices")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.OperationId).HasColumnName("operationID");
            entity.Property(e => e.ServiceId).HasColumnName("serviceID");
        });

        modelBuilder.Entity<StationOperationType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("stationOperationTypes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.OperationId).HasColumnName("operationID");
            entity.Property(e => e.RaceId).HasColumnName("raceID");
            entity.Property(e => e.StationTypeId).HasColumnName("stationTypeID");
        });

        modelBuilder.Entity<StationService>(entity =>
        {
            entity.HasKey(e => e.ServiceId).HasName("PRIMARY");

            entity
                .ToTable("stationServices")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.ServiceId)
                .ValueGeneratedNever()
                .HasColumnName("serviceID");
            entity.Property(e => e.Description)
                .HasMaxLength(1000)
                .HasColumnName("description");
            entity.Property(e => e.ServiceName)
                .HasMaxLength(100)
                .HasColumnName("serviceName");
        });

        modelBuilder.Entity<TntTournament>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tntTournaments")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.MaximumPilotsMatch).HasColumnName("maximumPilotsMatch");
            entity.Property(e => e.MaximumPointsMatch).HasColumnName("maximumPointsMatch");
            entity.Property(e => e.RuleSetId)
                .HasMaxLength(100)
                .HasColumnName("ruleSetID");
            entity.Property(e => e.RuleSetName)
                .HasMaxLength(100)
                .HasColumnName("ruleSetName");
        });

        modelBuilder.Entity<TntTournamentBannedGroup>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tntTournamentBannedGroups")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.RuleSetId, "IDX_tntTournamentBannedGroups_RSID");

            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.RuleSetId)
                .HasMaxLength(100)
                .HasColumnName("ruleSetID");
        });

        modelBuilder.Entity<TntTournamentBannedType>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tntTournamentBannedTypes")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.RuleSetId, "IDX_tntTournamentBannedTypes_RSID");

            entity.Property(e => e.RuleSetId)
                .HasMaxLength(100)
                .HasColumnName("ruleSetID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<TntTournamentGroupPoint>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tntTournamentGroupPoints")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.RuleSetId, "IDX_tntTournamentGroupPoints_RSID");

            entity.Property(e => e.GroupId).HasColumnName("groupID");
            entity.Property(e => e.Points).HasColumnName("points");
            entity.Property(e => e.RuleSetId)
                .HasMaxLength(100)
                .HasColumnName("ruleSetID");
        });

        modelBuilder.Entity<TntTournamentTypePoint>(entity =>
        {
            entity
                .HasNoKey()
                .ToTable("tntTournamentTypePoints")
                .UseCollation("utf8mb4_unicode_ci");

            entity.HasIndex(e => e.RuleSetId, "IDX_tntTournamentTypePoints_RSID");

            entity.Property(e => e.Points).HasColumnName("points");
            entity.Property(e => e.RuleSetId)
                .HasMaxLength(100)
                .HasColumnName("ruleSetID");
            entity.Property(e => e.TypeId).HasColumnName("typeID");
        });

        modelBuilder.Entity<TypeMaterial>(entity =>
        {
            entity.HasKey(e => new { e.TypeId, e.MaterialTypeId })
                .HasName("PRIMARY")
                .HasAnnotation("MySql:IndexPrefixLength", new[] { 0, 0 });

            entity
                .ToTable("typeMaterials")
                .UseCollation("utf8mb4_unicode_ci");

            entity.Property(e => e.TypeId).HasColumnName("typeID");
            entity.Property(e => e.MaterialTypeId).HasColumnName("materialTypeID");
            entity.Property(e => e.Quantity).HasColumnName("quantity");
        });

        OnModelCreatingPartial(modelBuilder);
    }

    partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
}

using System.Diagnostics;
using System.Text.Json.Serialization;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class ManufBatch
    {
        [JsonIgnore]
        public ProductionRoute[] ProductionRouting { get; set; } = [];
        public string[] ProductionRoutingString { get; set; } = [];
        [JsonIgnore]
        public BOMLineItem[] BillOfMaterials { get; set; } = [];
        public string[] BillOfMaterialsString { get; set; } = [];
        public List<StationBillOfMaterials> StationBillOfMaterials { get; set; } = [];
        public List<PurchaseRequisition> PurchaseOrders { get; set; } = [];
        public MarketProfile? MarketProfile { get; set; }
        public SupplyPlan? SupplyPlan { get; set; }
    }
}

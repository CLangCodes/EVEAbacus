using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class StationBillOfMaterials
    {
        public long StationId { get; set; }
        public required Station Station { get; set; }
        public PurchaseRequisition[] PurchaseRequisitions { get; set; } = []; // ToDo: Change this to PurchaseRequisition object
        public string[] ImportStrings
        {
            get
            {
                HashSet<string> strings = new HashSet<string>();
                foreach (var pr in PurchaseRequisitions)
                {
                    string import = $"{pr.Name} x{pr.Quantity}";
                    strings.Add(import);
                }
                return strings.ToArray();
            }
        }
    }
}

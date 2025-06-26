using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.Calculator
{
    public class ProcurementPlan
    {
        public long StationId { get; set; }
        public string StationName { get; set; } = string.Empty;
        public DateTime DateTime { get; set; } = DateTime.UtcNow;
        public List<PurchaseRequisition> PurchaseRequisitions { get; set; } = [];
        public decimal TotalVolume { get
            {
                decimal totalVolume = 0;
                foreach (var item in PurchaseRequisitions)
                {
                    totalVolume += (decimal)(item.Item.Volume! * item.Quantity);
                }
                return totalVolume;
            }
        }
        public string[] MarketImport
        {
            get
            {
                HashSet<string> strings = new();
                int[] typeIds = PurchaseRequisitions.Select(pr => pr.TypeId).Distinct().ToArray();
                foreach (var typeId in typeIds) 
                {
                    var prs = PurchaseRequisitions.Where(pr => pr.TypeId == typeId);
                    int quantity = prs.Sum(pr => pr.Quantity);
                    string name = prs.First().Name;
                    string import = $"{name} x{quantity}";
                    strings.Add(import);
                }
                return strings.ToArray();
            }
        }
        public decimal EstimatedCost { get 
            {
                decimal totalCost = 0;
                foreach (var item in PurchaseRequisitions)
                {
                    totalCost += (item.Price * item.Quantity);
                }
                return totalCost;
            } 
        }
    }
}

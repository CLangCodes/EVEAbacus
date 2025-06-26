using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Wallet
{
    public class Transaction
    {
        public int ClientId { get; set; }
        public string Date { get; set; }
        public bool IsBuy { get; set; }
        public bool IsPersonal { get; set; }
        public long JournalRefId { get; set; }
        public long LocationId { get; set; }
        public int Quantity { get; set; }
        public long TransactionId { get; set; }
        public int TypeId { get; set; }
        public float UnitPrice { get; set; }
    }
}

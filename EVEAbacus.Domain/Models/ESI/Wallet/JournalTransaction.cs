using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.ESI.Wallet
{
    public class JournalTransaction
    {
        public float Amount { get; set; }
        public float Balance { get; set; }
        public long ContextId { get; set; }
        public string ContextIDType { get; set; } = string.Empty;
        public string Date { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public int FirstPartyId { get; set; }
        public long Id { get; set; }
        public string Reason { get; set; } = string.Empty;
        public string RefType { get; set; } = string.Empty;
        public int SecondPartyId { get; set; }
        public float Tax { get; set; }
        public int TaxReceiverId { get; set; }
    }
}

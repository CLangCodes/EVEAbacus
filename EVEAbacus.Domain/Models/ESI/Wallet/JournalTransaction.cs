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
        public string ContextIDType { get; set; }
        public string Date { get; set; }
        public string Description { get; set; }
        public int FirstPartyId { get; set; }
        public long Id { get; set; }
        public string Reason { get; set; }
        public string RefType { get; set; }
        public int SecondPartyId { get; set; }
        public float Tax { get; set; }
        public int TaxReceiverId { get; set; }
    }
}

namespace EVEAbacus.Domain.Models.ESI.Wallet.DTO
{
    public class TransactionDTO
    {
        public int ClientId { get; set; }
        public string Date { get; set; } = string.Empty;
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

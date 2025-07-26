using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Application.Interfaces
{
    public interface IInventoryService
    {
        List<StockInventory> StockInventories { get; }
        Task AddInventoryItemAsync(StockInventory inventoryItem);
        Task AddInventoryItemsAsync(StockInventory[] inventoryItems);
        void DeleteInventoryItem(int typeId);
        Task EditInventoryItemAsync(StockInventory inventoryItem);
        void SetInventoryFromStorage(List<StockInventory> inventoryItems);
        int GetInventoryQuantity(int typeId);
        void UpdateInventoryQuantity(int typeId, int quantity);
    }
} 
using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.Infrastructure.Services
{
    public class InventoryService : IInventoryService
    {
        public required List<StockInventory> StockInventories { get; set; } = [];

        public InventoryService() { }

        public async Task AddInventoryItemAsync(StockInventory inventoryItem)
        {
            if (!this.StockInventories.Any(inv => inv.TypeId == inventoryItem.TypeId))
            {
                StockInventories.Add(inventoryItem);
            }
            else
            {
                await EditInventoryItemAsync(inventoryItem);
            }
        }

        public async Task AddInventoryItemsAsync(StockInventory[] inventoryItems)
        {
            foreach (var inventoryItem in inventoryItems) 
            { 
                await AddInventoryItemAsync(inventoryItem); 
            }
        }

        public void DeleteInventoryItem(int typeId)
        {
            try
            {
                var itemToRemove = StockInventories.FirstOrDefault(i => i.TypeId == typeId);
                if (itemToRemove != null)
                {
                    StockInventories.Remove(itemToRemove);
                }
            }
            catch
            {
                Console.WriteLine("Inventory item not found to delete.");
            }
        }

        public async Task EditInventoryItemAsync(StockInventory inventoryItem)
        {
            try
            {
                var existingItem = StockInventories.FirstOrDefault(i => i.TypeId == inventoryItem.TypeId);
                if (existingItem != null)
                {
                    StockInventories[StockInventories.IndexOf(existingItem)] = inventoryItem;
                }
            }
            catch
            {
                Console.WriteLine("Inventory item not found to edit.");
            }
        }

        public void SetInventoryFromStorage(List<StockInventory> inventoryItems)
        {
            StockInventories = inventoryItems;
        }

        public int GetInventoryQuantity(int typeId)
        {
            var inventoryItem = StockInventories.FirstOrDefault(i => i.TypeId == typeId);
            return inventoryItem?.Quantity ?? 0;
        }

        public void UpdateInventoryQuantity(int typeId, int quantity)
        {
            var inventoryItem = StockInventories.FirstOrDefault(i => i.TypeId == typeId);
            if (inventoryItem != null)
            {
                inventoryItem.Quantity = quantity;
            }
            else if (quantity > 0)
            {
                StockInventories.Add(new StockInventory { TypeId = typeId, Quantity = quantity });
            }
        }
    }
} 
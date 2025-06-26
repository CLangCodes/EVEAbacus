using Blazored.SessionStorage;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.WebUI.Services
{
    public class CalcSessionService : ICalcSessionService
    {
        private readonly ISessionStorageService _sessionStorage;
        private const string StorageKey = "userOrders";

        public CalcSessionService(ISessionStorageService sessionStorage)
        {
            _sessionStorage = sessionStorage;
        }

        async Task<List<Order>> ICalcSessionService.GetOrdersAsync()
        {
            return await _sessionStorage.GetItemAsync<List<Order>>(StorageKey)
               ?? new List<Order>();
        }

        async Task ICalcSessionService.SetOrdersAsync(List<Order> orders)
        {
            await _sessionStorage.SetItemAsync(StorageKey, orders);
        }
        async Task ICalcSessionService.ClearOrders()
        {
            await _sessionStorage.RemoveItemAsync(StorageKey);
        }
    }
}

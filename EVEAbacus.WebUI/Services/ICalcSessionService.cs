using Blazored.SessionStorage;
using EVEAbacus.Domain.Models.Calculator;

namespace EVEAbacus.WebUI.Services
{
    public interface ICalcSessionService
    {
        Task<List<Order>> GetOrdersAsync();
        Task SetOrdersAsync(List<Order> orders);
        Task ClearOrders();
    }
}

using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Application.Interfaces
{
    public interface IOrderService
    {
        List<Order> Orders { get; }
        Task AddOrderAsync(OrderDTO orderDTO);
        Task AddOrdersAsync(OrderDTO[] orders);
        void DeleteOrder(OrderDTO orderDTO);
        Task EditOrderAsync(OrderDTO orderDTO);
        Task<Order> OrderFromBPMaterialAsync(BPMaterial material, int parentBpId, int rootCopies, int rootRuns, int rootMEff, int rootTEff);
        OrderDTO OrderToOrderDTO(Order order);
        Task<Order[]> OrderDTOsToOrders(OrderDTO[] orderDTOs);
        void SetOrdersFromStorage(List<Order> orders);
    }
}

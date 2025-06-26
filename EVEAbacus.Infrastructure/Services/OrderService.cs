using EVEAbacus.Application.Interfaces;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Infrastructure.Services
{
    public class OrderService : IOrderService
    {
        private readonly ISDEService _sdeService;

        public required List<Order> Orders { get; set; } = [];

        public OrderService(ISDEService sdeService) 
        {
            _sdeService = sdeService;
        }
        async Task IOrderService.AddOrderAsync(OrderDTO orderDTO)
        {
            if (!this.Orders.Any(or => or.BlueprintName == orderDTO.BlueprintName))
            {
                Order order = await OrderDTOToOrder(orderDTO);
                Orders.Add(order);
            }
            else
            {
                var order = await OrderDTOToOrder(orderDTO);
                //var order = await _sdeService.OrderDTOToOrder(orderDTO);
                await ((IOrderService)this).EditOrderAsync(orderDTO);
            }
        }
        async Task IOrderService.AddOrdersAsync(OrderDTO[] orders)
        {
            foreach (var order in orders) { await ((IOrderService)this).AddOrderAsync(order); }
        }
        void IOrderService.DeleteOrder(OrderDTO orderDTO)
        {
            try
            {
                var orderToRemove = Orders.FirstOrDefault(o => o.BlueprintName == orderDTO.BlueprintName);
                if (orderToRemove != null)
                {
                    Orders.Remove(orderToRemove);
                }
            }
            catch
            {
                Console.WriteLine("Order not found to delete.");
            }
        }
        async Task IOrderService.EditOrderAsync(OrderDTO orderDTO)
        {
            try
            {
                var existingOrder = Orders.FirstOrDefault(or => or.BlueprintName == orderDTO.BlueprintName);
                if (existingOrder != null)
                {
                    Order order = await OrderDTOToOrder(orderDTO);
                    Orders[Orders.IndexOf(existingOrder)] = order;
                }
            }
            catch
            {
                Console.WriteLine("Order not found to edit.");
            }
        }
        async Task<Order> IOrderService.OrderFromBPMaterialAsync(BPMaterial material, int parentBpId, int rootCopies, int rootRuns, int rootMEff, int rootTEff)
        {
            int childBPId = await _sdeService.GetBlueprintIdByProductIdAsync((int)material.MaterialTypeId!) ?? 0;
            string childBPName = await _sdeService.GetItemNameAsync(childBPId) ?? "Error.";
            int materialTypeId = material.MaterialTypeId ?? 0;
            string materialName = material.Material!.TypeName ?? "Error.";
            int materialQuantity = (int)material.Quantity!;
            bool childBPInventable = _sdeService.IsBlueprintProductOfInvention(childBPId);
            int mEff = childBPInventable ? 2 : 10;
            int tEff = childBPInventable ? 4 : 10;

            return new Order()
            {
                BlueprintTypeId = childBPId,
                ActivityId = 1,
                ProductTypeId = materialTypeId,
                ProductName = materialName,
                Product = await _sdeService.GetItemAsync(materialTypeId),
                BlueprintName = childBPName,
                Copies = 1,
                Runs = CalculatorService.CalcMat(materialQuantity, rootCopies, rootRuns, rootMEff),
                ME = mEff,
                TE = tEff,
                ParentBlueprintTypeId = parentBpId
            };
        }
        OrderDTO IOrderService.OrderToOrderDTO(Order order)
        {
            return new OrderDTO() 
            { 
                ActivityId = order.ActivityId,
                BlueprintName = order.BlueprintName,
                Copies = order.Copies,
                Runs = order.Runs,
                ME = order.ME,
                TE = order.TE,
                ParentBlueprintTypeId = order.ParentBlueprintTypeId,

            };
        }
        void IOrderService.SetOrdersFromStorage(List<Order> orders)
        {
            Orders = orders;
        }
        private async Task<Order> OrderDTOToOrder(OrderDTO orderDTO)
        {
            int? bpId = await _sdeService.GetItemTypeIdAsync(orderDTO.BlueprintName);
            if (bpId == null)
            {
                throw new ArgumentException($"Blueprint '{orderDTO.BlueprintName}' not found in EVE Online database.");
            }

            int? prodId = await _sdeService.GetProductIdByBlueprintIdAsync((int)bpId, 1);
            if (prodId == null)
            {
                throw new ArgumentException($"No product found for blueprint '{orderDTO.BlueprintName}'.");
            }

            string prodName = await _sdeService.GetItemNameAsync((int)prodId) ?? "Error";
            if (prodName == "Error")
            {
                throw new ArgumentException($"Could not find product name for ID {prodId}.");
            }

            return new Order()
            {
                BlueprintName = orderDTO.BlueprintName,
                ProductName = prodName,
                Copies = orderDTO.Copies,
                Runs = orderDTO.Runs,
                ME = orderDTO.ME,
                TE = orderDTO.TE,
                BlueprintTypeId = (int)bpId,
                ProductTypeId = (int)prodId,
                Product = await _sdeService.GetItemAsync((int)prodId),
                ActivityId = 1,
                ParentBlueprintTypeId = orderDTO.ParentBlueprintTypeId
            };
        }

        async Task<Order[]> IOrderService.OrderDTOsToOrders(OrderDTO[] orderDTOs)
        {
            List<Order> orders = new();
            foreach (var orderDTO in orderDTOs)
            {
                try
                {
                    Order order = await OrderDTOToOrder(orderDTO);
                    orders.Add(order);
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"Error converting order {orderDTO.BlueprintName}: {ex.Message}");
                    throw;
                }
            }
            return orders.ToArray();
        }
    }
}

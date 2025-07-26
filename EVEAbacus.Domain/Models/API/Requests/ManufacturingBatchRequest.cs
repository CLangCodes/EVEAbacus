using EVEAbacus.Domain.Models.Calculator;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace EVEAbacus.Domain.Models.API.Requests
{
    /// <summary>
    /// Request model for manufacturing batch calculations
    /// </summary>
    public class ManufacturingBatchRequest
    {
        /// <summary>
        /// Array of blueprint manufacturing orders
        /// </summary>
        public OrderDTO[] OrderDTOs { get; set; } = [];

        /// <summary>
        /// Array of EVE Online station IDs where market prices will be analyzed
        /// </summary>
        public string[] StationIds { get; set; } = [];

        /// <summary>
        /// Array of inventory items with quantities
        /// </summary>
        public StockInventory[]? Inventory { get; set; }
    }
}

using EVEAbacus.Application.Interfaces;
using EVEAbacus.Application.Services;
using EVEAbacus.Domain.Models;
using EVEAbacus.Domain.Models.Blueprint;
using EVEAbacus.Domain.Models.Calculator;
using EVEAbacus.Domain.Models.ESI.Market;
using EVEAbacus.Domain.Models.Map;
using Microsoft.Extensions.Logging;
using System.Diagnostics;
using System.Linq;

public class CalculatorService
{
    private readonly ISDEService _sdeService;
    private readonly IMarketService _marketService;
    private readonly IMapService _mapService;
    private readonly IOrderService _orderService;
    private readonly IInventoryService _inventoryService;
    private readonly ICustomBlueprintService _customBlueprintService;
    private readonly ILogger<CalculatorService> _logger;

    public IEnumerable<Order> Orders { get {  return _orderService.Orders; } }
    public IEnumerable<StockInventory> StockInventories { get { return _inventoryService.StockInventories; } }
    public IEnumerable<CustomBlueprint> CustomBlueprints { get { return _customBlueprintService.CustomBlueprints; } }
    public long[] SelectedMarketIds { get; set; } = [];
    private IEnumerable<string> _selectedMarkets { get; set; } = [];
    public IEnumerable<string> SelectedMarkets 
    { 
        get => _selectedMarkets;
        set
        {
            if (!_selectedMarkets.SequenceEqual(value))
            {
                _selectedMarkets = value;
            }
        }
    }

    public bool Loading { get; set; } = false;

    public ManufBatch? ManufBatch { get; set; }

    public CalculatorService(ISDEService sdeService, IMarketService marketService, 
        IMapService mapService, IOrderService orderService, IInventoryService inventoryService, ICustomBlueprintService customBlueprintService, ILogger<CalculatorService> logger)
    {
        _sdeService = sdeService;   
        _marketService = marketService;
        _mapService = mapService;
        _orderService = orderService;
        _inventoryService = inventoryService;
        _customBlueprintService = customBlueprintService;
        _logger = logger;
        _logger.LogInformation("CalculatorService initialized");
    }

    public async Task InventionRun (Order order, int decryptorId)
    {
        if (order.ActivityId != 8) { return; }

        //For Invention Runs
        var bp = await _sdeService.GetBlueprintAsync(order.BlueprintTypeId, order.ActivityId);
        var inventionChance = await _sdeService.GetInventionChance(order.BlueprintTypeId, order.ProductTypeId);
        // Need to pull necessary skills - stored in blueprint
        // User input for skill level calculates chance (use cards, adaptive list that changes based on orders)
        // BPProducts has probability parameter method to get float from product Id
        // Generic Decryptors Group: 1304
        
        // Need to research how sleeper invention works to handle situations where different BPIds have a chance of making the same product
        // As long as we only run this specifying the bpId explicitly, the above won't be a problem

        Item[] decryptors = await _sdeService.GetItemsInGroup(1304);
        
        // Calculate Time
        // Calculate cost of products manufactured, how many products made, how long
        // Calculate estimated profit cost analysis

    }

    private static HashSet<BOMLineItem> AddBOMLineItem(HashSet<BOMLineItem> billOfMaterials, BOMLineItem bOMLineItem)
    {
        if (billOfMaterials == null) throw new ArgumentNullException(nameof(billOfMaterials));

        var existingItem = billOfMaterials.FirstOrDefault(pr => pr.TypeId == bOMLineItem.TypeId);

        if (existingItem == null)
        {
            billOfMaterials.Add(bOMLineItem);
        }
        else
        {
            // Aggregate the required amounts
            existingItem.Requisitioned += bOMLineItem.Requisitioned;
            // Inventory should be the same for the same TypeId, so we can use either value
            // (they should be identical since they come from the same inventory service)
        }

        return billOfMaterials;
    }
    private HashSet<ProductionRoute> AddProductionRoute(HashSet<ProductionRoute> productionRouting, ProductionRoute productionRoute)
    {
        _logger?.LogInformation("AddProductionRoute called.");
        if (productionRouting == null) throw new ArgumentNullException(nameof(productionRouting));

        var existingItem = productionRouting.FirstOrDefault(pr => pr.MaterialTypeId == productionRoute.MaterialTypeId &&
                                                            pr.Order.ME == productionRoute.Order.ME &&
                                                            pr.Order.TE == productionRoute.Order.TE);

        if (existingItem == null)
        {
            _logger?.LogInformation($"ProductionRoute does not already exist.");
            _logger?.LogInformation("AddProductionRoute: Child order and More than one produced.");
            // Don't want to modify the root order (assume the user knows how many will be produced per run).
        if (productionRoute.ProducedPerRun != 1 && (productionRoute.Order.ParentBlueprintTypeId != null || productionRoute.Order.ParentBlueprintTypeId != 0))
            {
            float modRuns = ((float)productionRoute.Requisitioned / (float)productionRoute.ProducedPerRun);
            int modRunsInt = (int)Math.Ceiling(modRuns);
            productionRoute!.Order.Runs = modRunsInt;
            productionRouting.Add(productionRoute);
        } // need to adjust requisitioned if root order and more than one produced per order
        else if(productionRoute.ProducedPerRun != 1 && (productionRoute.Order.ParentBlueprintTypeId == null || productionRoute.Order.ParentBlueprintTypeId == 0))
        {
            _logger?.LogInformation("AddProductionRoute: Root order and More than one produced.");
            productionRoute.Requisitioned = productionRoute.Requisitioned * productionRoute.ProducedPerRun;
            productionRouting.Add(productionRoute);
        }
        else
        {
            _logger?.LogInformation("AddProductionRoute: Child order and only one produced per order.");
                productionRouting.Add(productionRoute);
            }
        }
        else if (productionRoute.ProducedPerRun != 1 && (productionRoute.Order.ParentBlueprintTypeId == null || productionRoute.Order.ParentBlueprintTypeId == 0))
        {
            _logger?.LogInformation("AddProductionRoute: Root order and More than one produced.");
            productionRoute.Requisitioned = productionRoute.Requisitioned * productionRoute.ProducedPerRun;
            productionRouting.Add(productionRoute);
        }
        else
        {
            _logger?.LogInformation($"ProductionRoute already exists. Adjusting it from {existingItem.Requisitioned}");

            existingItem.Requisitioned += productionRoute.Requisitioned;

            if (productionRoute.ProducedPerRun != 1)
            {
                float modRuns = ((float)existingItem.Requisitioned / (float)existingItem.ProducedPerRun);
                int modRunsInt = (int)Math.Ceiling(modRuns);

                existingItem!.Order.Runs = modRunsInt;
            }
            else
            {
                _logger?.LogInformation($"{productionRoute.BlueprintName} produces {productionRoute.ProducedPerRun}");

                existingItem!.Order.Runs += productionRoute.Order.Runs;
            }
            existingItem.Orders.Add(productionRoute.Order);

        }

        return productionRouting;
    }
    private async Task<BOMLineItem> BOMLineItemFromBPMaterial(BPMaterial bpMaterial, int rootCopies, int rootRuns, long[] stationIds, int? mEff = 10, int? tEff = 20)
    {
        int requisitioned = CalcMat((int)bpMaterial.Quantity!, rootCopies, rootRuns, (int)mEff!);
        int inventoryQuantity = _inventoryService.GetInventoryQuantity((int)bpMaterial.MaterialTypeId!);
        
        return new BOMLineItem()
        {
            TypeId = (int)bpMaterial.MaterialTypeId!,
            Name = bpMaterial.Material!.TypeName!,
            Requisitioned = requisitioned, // Keep original required amount
            Inventory = inventoryQuantity,
            Item = await _sdeService.GetItemAsync((int)bpMaterial.MaterialTypeId!)
            //MarketHistory = await _marketService.GetItemMarketRegionHistoryAsync([], (int)bpMaterial.MaterialTypeId!),
            //PurchaseRequisitions = await GetPurchaseOrders((int)bpMaterial.MaterialTypeId!, stationIds, requisitioned, null),
            //MarketStats = await _marketService.GetMarketStatsAsync((int)bpMaterial.MaterialTypeId!)
        };
    }
    public static int CalcMat(int matQuantity, int orderCopies, int orderRuns, int mEff = 10)
    {
        int outputMaterial;

        if (matQuantity == 1)
        {
            outputMaterial = matQuantity * orderRuns * orderCopies;
        }
        else
        {
            var calc = Math.Ceiling((double)(matQuantity * orderRuns * (1 - (mEff * 0.01)))) * orderCopies;
            outputMaterial = Convert.ToInt32(calc);
        }
        return outputMaterial;
    }
    public static TimeSpan CalcTime(int time, int runs, int tEff = 20)
    {
        return TimeSpan.FromSeconds(Math.Ceiling((double)(time * runs * (1 - (tEff * 0.01)))));
    }
    
    // To get Bill of Materials from every buildable item in the complete Production Routing
    private async Task<BOMLineItem[]> GetBillOfMaterialsFromProductionRouting(ProductionRoute[] productionRouting, long[] stationIds)
    {
        HashSet<BOMLineItem> billOfMaterials = [];

        foreach (ProductionRoute productionRoute in productionRouting)
        {
            var unbuildables = await _sdeService.GetUnbuildableBPMaterials((int)productionRoute!.BlueprintTypeId!);
            foreach (var bPMaterial in unbuildables)
            {
                var bOMLineItem = await BOMLineItemFromBPMaterial(
                    bPMaterial, productionRoute.Order.Copies, productionRoute.Order.Runs, stationIds, productionRoute.Order.ME, productionRoute.Order.TE);

                billOfMaterials = AddBOMLineItem(billOfMaterials, bOMLineItem);
            }
        }

        return billOfMaterials.ToArray();
    }

    // To get Bill of Materials aggregated from Production Routing Net Required values
    private async Task<BOMLineItem[]> GetBillOfMaterialsFromProductionRoutingNetRequired(ProductionRoute[] productionRouting, long[] stationIds)
    {
        HashSet<BOMLineItem> billOfMaterials = [];

        // For each Production Route, get the raw materials needed and apply the Net Required logic
        foreach (ProductionRoute productionRoute in productionRouting)
        {
            // Get only unbuildable materials (raw materials) for this blueprint
            var unbuildables = await _sdeService.GetUnbuildableBPMaterials((int)productionRoute!.BlueprintTypeId!);
            
            foreach (var bPMaterial in unbuildables)
            {
                // Calculate the required amount for this material based on the Production Route's Net Required
                int materialTypeId = (int)bPMaterial.MaterialTypeId!;
                int materialQuantity = (int)bPMaterial.Quantity!;
                
                // Calculate how much of this raw material is needed for the Net Required amount of the final product
                int requiredForNetRequired = 0;
                if (productionRoute.NetRequisitioned > 0)
                {
                    // Calculate the proportion of this material needed for the net required amount
                    float proportion = (float)productionRoute.NetRequisitioned / (float)productionRoute.Requisitioned;
                    requiredForNetRequired = (int)Math.Ceiling(materialQuantity * proportion * productionRoute.Order.Copies * productionRoute.Order.Runs * (1 - (productionRoute.Order.ME * 0.01)));
                }
                
                // Get current inventory for this raw material
                int inventoryQuantity = _inventoryService.GetInventoryQuantity(materialTypeId);
                
                // Create BOM line item with Net Required logic
                var bOMLineItem = new BOMLineItem()
                {
                    TypeId = materialTypeId,
                    Name = bPMaterial.Material!.TypeName!,
                    Requisitioned = requiredForNetRequired, // This is the amount needed for the Net Required
                    Inventory = inventoryQuantity,
                    Item = await _sdeService.GetItemAsync(materialTypeId)
                };

                billOfMaterials = AddBOMLineItem(billOfMaterials, bOMLineItem);
            }
        }

        return billOfMaterials.ToArray();
    }

    private async Task SetStationIds(string[] stationNames)
    {
        if (stationNames.Count() == 0)
        {
            SelectedMarketIds = _mapService.GetMarketHubStationIds();
        }
        else
        {
            List<long> ids = new List<long>();
            Console.WriteLine($"Received station names: {string.Join(", ", stationNames)}");
            
            foreach (var name in stationNames)
            {
                // Check if the input is a station ID (numeric string)
                if (long.TryParse(name, out long stationId))
                {
                    // Input is already a station ID
                    Console.WriteLine($"Station ID: '{name}' -> Using as-is: {stationId}");
                    ids.Add(stationId);
                }
                else
                {
                    // Input is a station name, need to look it up
                    var foundStationId = await _mapService.GetStationId(name);
                    Console.WriteLine($"Station name: '{name}' -> Station ID: {foundStationId}");
                    ids.Add((long)(foundStationId ?? 0));
                }
            }
            
            SelectedMarketIds = ids.ToArray();
            Console.WriteLine($"Final selected market IDs: {string.Join(", ", SelectedMarketIds)}");
        }
    }
    // The Manufacturing Batch contains the orders, production routing, and Bill of Materials, as well as pricing information
    public async Task<ManufBatch> GetManufacturingBatch(Order[] orders, string[] stationNames)
    {
        if (orders == null || orders.Length == 0)
            throw new ArgumentException("Orders cannot be null or empty", nameof(orders));

        Loading = true;
        await SetStationIds(stationNames);

        ManufBatch manufBatch = new ManufBatch();
        try
        {
            manufBatch.ProductionRouting = await GetProductionRoutesAsync(orders.ToArray(), SelectedMarketIds);
            manufBatch.BillOfMaterials = await GetBillOfMaterialsFromProductionRoutingNetRequired(manufBatch.ProductionRouting, SelectedMarketIds);
            manufBatch.ProductionRoutingString = GetProductionRoutingString(manufBatch.ProductionRouting);
            manufBatch.BillOfMaterialsString = GetBillOfMaterialsString(manufBatch.BillOfMaterials);
            manufBatch.StockInventories = _inventoryService.StockInventories;
            manufBatch.CustomBlueprints = _customBlueprintService.CustomBlueprints;

            int[] bomTypeIds = manufBatch.BillOfMaterials.Select(o => o.TypeId).Distinct().ToArray();
            int[] prTypeIds = manufBatch.ProductionRouting.Select(o => o.MaterialTypeId).Distinct().ToArray();
            int[] typeIds = bomTypeIds.Concat(prTypeIds).Distinct().ToArray();

            await _marketService.UpdateMarketStats(typeIds, SelectedMarketIds);
            manufBatch.BillOfMaterials = _marketService.GetMarketStatsForBillOfMaterials(manufBatch.BillOfMaterials, SelectedMarketIds);
            manufBatch.SupplyPlan = await _marketService.GetSupplyPlanAsync(manufBatch, SelectedMarketIds);

            var marketProfile = _marketService.GetMarketProfile(manufBatch);
            if (marketProfile != null ) { manufBatch.MarketProfile = marketProfile; } else { manufBatch.MarketProfile = new MarketProfile(); }

            Loading = false;
            return manufBatch;
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex.Message);
            Loading = false;
            throw new InvalidOperationException("Failed to create manufacturing batch", ex);
        }
    }

    private async Task<ProductionRoute[]> GetProductionRoutesAsync(Order[] orders, long[] stationIds, 
        HashSet<(int parentBlueprintTypeId, int childBlueprintTypeId)>? startedMaterials = null, 
        HashSet<(int parentBlueprintTypeId, int childBlueprintTypeId)>? finishedMaterials = null)
    {
        startedMaterials ??= new();
        finishedMaterials ??= new();
        HashSet<ProductionRoute> productionRouting = [];
        HashSet<Order> childrenOrders = new HashSet<Order>();
        HashSet<BPMaterial> materials = new HashSet<BPMaterial>();

        foreach (Order order in orders)
        {
            if (order == null) continue;
            int parentBpId;
            if (order.ParentBlueprintTypeId == null) { parentBpId = 0; }
            else { parentBpId = (int)order.ParentBlueprintTypeId; }
            var orderKey = (parentBpId, order.BlueprintTypeId);

            if (startedMaterials.Contains(orderKey))
            {
                Console.WriteLine($"orderKey: {orderKey} already found in startedMaterials. Order: {order.BlueprintName} will not be processed further.");
                continue;
            }

            ProductionRoute orderProductionRoute = await GetProductionRouteFromOrder(order, stationIds); 
            productionRouting.Add(orderProductionRoute);

            var orderMaterials = await _sdeService.GetBuildableBPMaterials(order.BlueprintTypeId);
            foreach (var material in orderMaterials)
            {
                int parentBlueprintTypeId = order.BlueprintTypeId;
                int blueprintTypeId = await _sdeService.GetBlueprintIdByProductIdAsync((int)material.MaterialTypeId!) ?? 0;
                var materialKey = (parentBlueprintTypeId, blueprintTypeId);
                
                ProductionRoute materialProductionRoute = await GetProductionRouteFromBPMaterial(material, order.Copies, order.Runs, stationIds, order.ME);

                // Check if material can be built, and if so add it to a Queue to be processed recursively
                if (_sdeService.CanItemBeManufactured(materialProductionRoute.MaterialTypeId) && parentBlueprintTypeId != blueprintTypeId)
                {
                    Order childOrder = await _orderService.OrderFromBPMaterialAsync(material, order.BlueprintTypeId, order.Copies, order.Runs, order.ME, order.TE);
                    childrenOrders.Add(childOrder);
                } 
                else
                {
                    startedMaterials.Add(materialKey);
                    productionRouting = AddProductionRoute(productionRouting, materialProductionRoute);
                }
            }
        }

        // Process suborders if there are any
        if (childrenOrders.Count > 0)
        {
            var childrenProductionRoutes = await GetProductionRoutesAsync(childrenOrders.ToArray(), stationIds, startedMaterials, finishedMaterials);

            foreach (var childProductionRoute in childrenProductionRoutes)
            {
                int parentBpId = childProductionRoute.Order.ParentBlueprintTypeId ?? 0;
                int bpId = childProductionRoute.BlueprintTypeId;

                var childKey = (parentBpId, bpId);

                if (finishedMaterials.Contains(childKey))
                {
                    Console.WriteLine($"childKey: {childKey} already found in finishedMaterials. Order: {childProductionRoute.BlueprintName} will not be processed further.");
                    continue;
                }
                productionRouting = AddProductionRoute(productionRouting, childProductionRoute);
            }
        }
        return productionRouting.ToArray();
    }

    
    private async Task<ProductionRoute> GetProductionRouteFromBPMaterial(BPMaterial bpMaterial, int rootCopies, int rootRuns, long[] stationIds, int? mEff = 10)
    {
        int madePerRun = await _sdeService.HowManyProductsMadeAsync((int)bpMaterial.MaterialTypeId!) ?? 0;
        int bpId = await _sdeService.GetBlueprintIdByProductIdAsync((int)bpMaterial.MaterialTypeId) ?? 0;
        string blueprintName = string.Empty;
        int requisitioned;
        int runs;

        if (bpId != 0)
        {
            blueprintName = (await _sdeService.GetItemNameAsync((int)bpId))!;
        }

        // Get custom blueprint ME/TE values if they exist
        int customME = _customBlueprintService.GetMaterialEfficiency(bpId);
        int customTE = _customBlueprintService.GetTimeEfficiency(bpId);
        int effectiveME = customME > 0 ? customME : (int)mEff!;
        int effectiveTE = customTE > 0 ? customTE : 20; // Default TE is 20

        if (madePerRun != 1)
        {
            requisitioned = CalcMat((int)bpMaterial.Quantity!, rootCopies, rootRuns, effectiveME);
            float newQuantityFloat = (float)((requisitioned) / madePerRun)!;
            runs = (int)(Math.Ceiling(newQuantityFloat));
        }
        else
        {
            runs = CalcMat((int)bpMaterial.Quantity!, rootCopies, rootRuns, effectiveME);
            requisitioned = CalcMat((int)bpMaterial.Quantity!, rootCopies, rootRuns, effectiveME);
        }

        int inventoryQuantity = _inventoryService.GetInventoryQuantity((int)bpMaterial.MaterialTypeId!);
        
        ProductionRoute productionRoute = new ProductionRoute()
        {
            MaterialTypeId = (int)bpMaterial.MaterialTypeId!,
            MaterialName = bpMaterial.Material!.TypeName!,
            BlueprintTypeId = (int)bpId!,
            BlueprintName = blueprintName,
            Requisitioned = requisitioned,
            Order = new Order()
            {
                BlueprintName = blueprintName,
                BlueprintTypeId = (int)bpId!,
                ProductTypeId = (int)bpMaterial.MaterialTypeId!,
                ProductName = bpMaterial.Material!.TypeName!,
                Product = bpMaterial.Material!,
                ActivityId = 1,
                Copies = 1,
                Runs = runs,
                ME = effectiveME,
                TE = effectiveTE,
                ParentBlueprintTypeId = bpMaterial.BlueprintTypeId!,
            },
            Orders = [new Order()
            {
                BlueprintName = blueprintName,
                BlueprintTypeId = (int)bpId!,
                ProductTypeId = (int)bpMaterial.MaterialTypeId!,
                ProductName = bpMaterial.Material!.TypeName!,
                Product = bpMaterial.Material!,
                ActivityId = 1,
                Copies = 1,
                Runs = runs,
                ME = effectiveME,
                TE = effectiveTE,
                ParentBlueprintTypeId = bpMaterial.BlueprintTypeId!,
                },
            ],
            ProducedPerRun = madePerRun,
            Inventory = inventoryQuantity,
            BlueprintMetaData = await _sdeService.GetItemAsync(bpId),
            MaterialMetaData = await _sdeService.GetItemAsync((int)bpMaterial.MaterialTypeId!),
        };
        return productionRoute;
    }
    private async Task<ProductionRoute> GetProductionRouteFromOrder(Order order, long[] stationIds)
    {
        int inventoryQuantity = _inventoryService.GetInventoryQuantity(order.ProductTypeId);
        
        // Get custom blueprint ME/TE values if they exist
        int customME = _customBlueprintService.GetMaterialEfficiency(order.BlueprintTypeId);
        int customTE = _customBlueprintService.GetTimeEfficiency(order.BlueprintTypeId);
        
        // Create a copy of the order with custom ME/TE if they exist
        Order modifiedOrder = new Order()
        {
            BlueprintTypeId = order.BlueprintTypeId,
            ActivityId = order.ActivityId,
            ProductTypeId = order.ProductTypeId,
            ProductName = order.ProductName,
            Product = order.Product,
            BlueprintName = order.BlueprintName,
            Copies = order.Copies,
            Runs = order.Runs,
            ME = customME > 0 ? customME : order.ME,
            TE = customTE > 0 ? customTE : order.TE,
            ParentBlueprintTypeId = order.ParentBlueprintTypeId
        };
        
        ProductionRoute productionRoute = new ProductionRoute()
        {
            MaterialTypeId = order.ProductTypeId,
            MaterialName = order.ProductName,
            BlueprintTypeId = order.BlueprintTypeId,
            BlueprintName = order.BlueprintName,
            Requisitioned = (modifiedOrder.Runs * modifiedOrder.Copies),
            Order = modifiedOrder,
            Orders = [modifiedOrder],
            ProducedPerRun = (int)(await _sdeService.HowManyProductsMadeAsync(order.ProductTypeId) ?? 0),
            Inventory = inventoryQuantity,
            BlueprintMetaData = await _sdeService.GetItemAsync(order.BlueprintTypeId),
            MaterialMetaData = await _sdeService.GetItemAsync(order.ProductTypeId),
        };

        return productionRoute;
    }

    public async Task<string[]> SearchBlueprintNamesAsync(string searchTerm)
    {
        return await _sdeService.SearchBlueprintsAsync(searchTerm);
    }

    private static string[] GetProductionRoutingString(ProductionRoute[] productionRouting)
    {
        HashSet<string> returnList = [];
        foreach (var pr in productionRouting)
        {
            string ordString = $"Build: {pr.BlueprintName} Copies: {pr.Order.Copies} Runs: {pr.Order.Runs} ME: {pr.Order.ME} for total of {pr.Requisitioned} ";
            returnList.Add(ordString);
        }
        return returnList.ToArray();
    }
    private static string[] GetBillOfMaterialsString(BOMLineItem[] billOfMaterials)
    {
        HashSet<string> returnList = [];
        foreach (var bom in billOfMaterials)
        {
            string markOrd = $"{bom.Name} x{bom.Requisitioned} ";
            returnList.Add(markOrd);
        }
        return returnList.ToArray();
    }

    public async Task<int?> GetProductIdbyBPTypeId(int bpTypeId, byte activityId)
    {
        return await _sdeService.GetProductIdByBlueprintIdAsync(bpTypeId, activityId);
    }

    public async Task<int?> GetBlueprintTypeIdbyNameAsync(string name)
    {
        var typeId = await _sdeService.GetItemTypeIdAsync(name);
        if (typeId == null)
        {
            throw new KeyNotFoundException("Blueprint not found");
        }

        return typeId;
    }
    private async Task<int[]> ItemNameArrayToItemIdArray(string[] names)
    {
        HashSet<int> ints = new HashSet<int>();
        foreach (string name in names)
        {
            var id = await _sdeService.GetItemTypeIdAsync(name);
            if (id != null) { ints.Add((int)id); }
        }
        return ints.ToArray();
    }


    // Invention Calculator Methods
    public async Task<string[]> GetInventionSkillsAsync()
    {
        return await _sdeService.GetInventionSkillsAsync();
    }
    public async Task<string[]> InventionSuggestions(string[] inventionSkills)
    {
        var skillIds = await ItemNameArrayToItemIdArray(inventionSkills);

        return await _sdeService.GetInventionTargetsBySkillsAsync(skillIds);
    }

    // Market Service Related Methods
    public async Task<string[]> GetMarketHubStringArrayAsync()
    {
        return await _mapService.GetMarketHubNames();
    }
    public async Task SelectMarkets(string[] markets)
    {
        HashSet<long> stationIds = [];

        foreach (var market in markets)
        {
            stationIds.Add(await _mapService.GetStationId(market) ?? 0);
        }
        SelectedMarketIds = stationIds.ToArray();
    }

    // Inventory Management Methods
    public async Task AddInventoryItemAsync(StockInventory inventoryItem)
    {
        await _inventoryService.AddInventoryItemAsync(inventoryItem);
    }

    public async Task AddInventoryItemsAsync(StockInventory[] inventoryItems)
    {
        await _inventoryService.AddInventoryItemsAsync(inventoryItems);
    }

    public void DeleteInventoryItem(int typeId)
    {
        _inventoryService.DeleteInventoryItem(typeId);
    }

    public async Task EditInventoryItemAsync(StockInventory inventoryItem)
    {
        await _inventoryService.EditInventoryItemAsync(inventoryItem);
    }

    public void SetInventoryFromStorage(List<StockInventory> inventoryItems)
    {
        _inventoryService.SetInventoryFromStorage(inventoryItems);
    }

    public int GetInventoryQuantity(int typeId)
    {
        return _inventoryService.GetInventoryQuantity(typeId);
    }

    public void UpdateInventoryQuantity(int typeId, int quantity)
    {
        _inventoryService.UpdateInventoryQuantity(typeId, quantity);
    }

    // Custom Blueprint Management Methods
    public async Task AddCustomBlueprintAsync(CustomBlueprint customBlueprint)
    {
        await _customBlueprintService.AddCustomBlueprintAsync(customBlueprint);
    }

    public async Task AddCustomBlueprintsAsync(CustomBlueprint[] customBlueprints)
    {
        await _customBlueprintService.AddCustomBlueprintsAsync(customBlueprints);
    }

    public void DeleteCustomBlueprint(int blueprintTypeId)
    {
        _customBlueprintService.DeleteCustomBlueprint(blueprintTypeId);
    }

    public async Task EditCustomBlueprintAsync(CustomBlueprint customBlueprint)
    {
        await _customBlueprintService.EditCustomBlueprintAsync(customBlueprint);
    }

    public void SetCustomBlueprintsFromStorage(List<CustomBlueprint> customBlueprints)
    {
        _customBlueprintService.SetCustomBlueprintsFromStorage(customBlueprints);
    }

    public CustomBlueprint? GetCustomBlueprint(int blueprintTypeId)
    {
        return _customBlueprintService.GetCustomBlueprint(blueprintTypeId);
    }

    public int GetMaterialEfficiency(int blueprintTypeId)
    {
        return _customBlueprintService.GetMaterialEfficiency(blueprintTypeId);
    }

    public int GetTimeEfficiency(int blueprintTypeId)
    {
        return _customBlueprintService.GetTimeEfficiency(blueprintTypeId);
    }

}

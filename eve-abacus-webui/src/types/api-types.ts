// Auto-generated types from .NET API models
// These should match the C# models in EVEAbacus.Domain/Models/Calculator/

// Core manufacturing types
export interface OrderDTO {
  blueprintName: string;
  activityId: number;
  copies: number;
  runs: number;
  me: number;
  te: number;
  parentBlueprintTypeId?: number;
}

export interface ManufacturingBatchRequest {
  orderDTOs: OrderDTO[];
  stationIds: string[];
}

// Calculator models
export interface Item {
  typeId: number;
  published: boolean;
  typeName: string;
  description: string;
  groupId: number;
  group: {
    groupId: number;
    categoryId: number;
    category: {
      categoryId: number;
      categoryName: string;
      published: boolean;
      iconId: number;
    };
    groupName: string;
    iconId: number;
    useBasePrice: boolean;
    anchored: boolean;
    anchorable: boolean;
    fittableNonSingleton: boolean;
    published: boolean;
  };
  marketGroupId: number;
  graphicId: number | null;
  radius: number | null;
  iconId: number;
  soundId: number | null;
  factionId: number | null;
  raceId: number | null;
  sofFactionName: string | null;
  sofMaterialSetId: number | null;
  metaGroupId: number | null;
  variationparentTypeId: number | null;
  mass: number | null;
  volume: number;
  packagedVolume: number;
  capacity: number | null;
  portionSize: number;
  basePrice: number;
  blueprints: unknown[];
  bpSkills: unknown[];
  bpProducts: unknown[];
  bpMaterials: unknown[];
}

export interface MarketOrder {
  dateTime: string;
  duration: number;
  isBuyOrder: boolean;
  issued: string;
  locationId: number;
  station: unknown | null;
  minVolume: number;
  orderId: number;
  price: number;
  range: string;
  regionId: number;
  systemId: number;
  typeId: number;
  typeName: string;
  volumeRemain: number;
  volumeTotal: number;
}

export interface Station {
  stationId: number;
  security: number;
  dockingCostPerVolume: number;
  maxShipVolumeDockable: number;
  officeRentalCost: number;
  operationId: number;
  stationTypeId: number;
  corporationId: number;
  solarSystemId: number;
  solarSystem: unknown | null;
  constellationId: number;
  regionId: number;
  stationName: string;
  x: number;
  y: number;
  z: number;
  reprocessingEfficiency: number;
  reprocessingStationsTake: number;
  reprocessingHangarFlag: number;
}

export interface PurchaseRequisition {
  stationId: number;
  station: Station | null;
  typeId: number;
  name: string;
  quantity: number;
  marketOrder: MarketOrder | null;
  price: number;
  item: Item;
}

export interface ProcurementPlan {
  stationId: number;
  stationName: string;
  dateTime: string;
  purchaseRequisitions: PurchaseRequisition[];
  totalVolume: number;
  marketImport: string[];
  estimatedCost: number;
}

export interface SupplyPlan {
  procurementPlans: ProcurementPlan[];
  estimatedTotalCost: number;
  totalVolume: number;
}

export interface MarketProfile {
  materialCost: number;
  revenueSellOrder: number;
  revenueBuyOrder: number;
  profitSellOrder: number;
  profitBuyOrder: number;
}

export interface ManufBatch {
  productionRoutingString: string[];
  billOfMaterialsString: string[];
  stationBillOfMaterials: unknown[];
  purchaseOrders: PurchaseRequisition[];
  marketProfile: MarketProfile;
  supplyPlan: SupplyPlan;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
} 
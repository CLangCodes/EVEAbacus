// Manufacturing calculator types - using generated types when available
// Fallback to manual types for development

// Import manual types as fallback
import type { 
  OrderDTO, 
  ManufacturingBatchRequest, 
  Item, 
  MarketOrder, 
  Station, 
  PurchaseRequisition, 
  ProcurementPlan, 
  SupplyPlan, 
  MarketProfile, 
  ManufBatch 
} from './api-types';

import type { Order } from './orders';

// Use generated types if available, otherwise use manual types
export type {
  OrderDTO,
  ManufacturingBatchRequest,
  Item,
  MarketOrder,
  Station,
  PurchaseRequisition,
  ProcurementPlan,
  SupplyPlan,
  MarketProfile,
  ManufBatch
};

// Frontend-specific types (not in API)
export interface MarketStat {
  typeId: number;
  stationId: number;
  stationName: string;
  averageSellPrice: number;
  averageBuyPrice: number;
  sellVolume: number;
  buyVolume: number;
}

export interface MarketRegionHistory {
  date: string;
  average: number;
  highest: number;
  lowest: number;
  orderCount: number;
  volume: number;
}

export interface BOMLineItem {
  typeId: number;
  name: string;
  requisitioned: number;
  item: Item;
  marketHistory: MarketRegionHistory[];
  purchaseRequisitions: PurchaseRequisition[];
  marketStats: MarketStat[];
  lowestSellPrice?: number;
  sellStation?: string;
  lowestBuyPrice?: number;
  buyStation?: string;
}

// Extended Order type for manufacturing with additional fields
export interface ManufacturingOrder extends Order {
  blueprintTypeId: number;
  productTypeId: number;
  productName: string;
  product: Item;
  parentBlueprintTypeId?: number;
  marketStats: MarketStat[];
}

export interface ProductionRoute {
  materialTypeId: number;
  materialName: string;
  blueprintTypeId: number;
  blueprintName?: string;
  requisitioned: number;
  order: ManufacturingOrder;
  orders: ManufacturingOrder[];
  producedPerRun: number;
  produced: number;
  inventory?: number;
  averageSellPrice?: number;
  averageBuyPrice?: number;
  blueprintMetaData?: Item;
  materialMetaData?: Item;
  materialMarketHistory: MarketRegionHistory[];
  marketStats: MarketStat[];
}

export interface StationBillOfMaterials {
  [key: string]: unknown;
}
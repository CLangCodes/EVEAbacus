export interface Order {
  id: string;
  blueprintName: string;
  activityId: number;
  copies: number;
  runs: number;
  me: number;
  te: number;
  createdAt: string;
  updatedAt: string;
}

export interface OrderFormData {
  blueprintName: string;
  activityId: number;
  copies: number;
  runs: number;
  me: number;
  te: number;
}

export interface OrderStats {
  totalOrders: number;
  totalCopies: number;
  totalRuns: number;
  averageME: number;
  averageTE: number;
} 
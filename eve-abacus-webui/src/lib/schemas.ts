import { z, ZodError } from 'zod';

// Base schemas
export const PaginationSchema = z.object({
  pageNumber: z.number().int().min(1).optional().default(1),
  pageSize: z.number().int().min(1).max(100).optional().default(10),
});

// Planet schemas
export const PlanetSchema = z.object({
  name: z.string().min(1, "Planet name is required"),
  solarSystem: z.string().min(1, "Solar system is required"),
  constellation: z.string().min(1, "Constellation is required"),
  region: z.string().min(1, "Region is required"),
  planetType: z.string().min(1, "Planet type is required"),
  security: z.number().nullable().optional(),
  radius: z.number().positive("Radius must be positive"),
  minLinkPowerGrid: z.number().min(0, "Power grid must be non-negative"),
  minLinkCPU: z.number().min(0, "CPU must be non-negative"),
});

export const PaginatedPlanetResponseSchema = z.object({
  items: z.array(PlanetSchema),
  totalCount: z.number().int().min(0),
  pageNumber: z.number().int().min(1),
  pageSize: z.number().int().min(1),
  totalPages: z.number().int().min(0),
  hasPreviousPage: z.boolean(),
  hasNextPage: z.boolean(),
});

// PI Planner request schema
export const PIPlannerRequestSchema = z.object({
  focalSystemName: z.string().min(1, "Focal system name is required"),
  range: z.number().int().min(0).max(20, "Range must be between 0 and 20 jumps"),
  securityStatus: z.array(z.string()).optional().default([]),
  planetTypes: z.array(z.string()).optional().default([]),
}).merge(PaginationSchema);

// Search schemas
export const SearchQuerySchema = z.object({
  searchTerm: z.string().min(1, "Search term is required").max(100, "Search term too long").optional(),
  query: z.string().min(1, "Search term is required").max(100, "Search term too long").optional(),
}).transform((data) => {
  if (!data.searchTerm && !data.query) {
    throw new Error('Either searchTerm or query must be provided');
  }
  return {
    searchTerm: data.searchTerm || data.query as string,
  };
});

// Health check schemas
export const HealthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  timestamp: z.string().datetime(),
  version: z.string(),
  service: z.string().optional(),
});

export const DatabaseHealthResponseSchema = z.object({
  status: z.enum(['ok', 'error']),
  database: z.string(),
  timestamp: z.string().datetime(),
  responseTime: z.string(),
  message: z.string().optional(),
});

// API Response wrapper schema
export const ApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    success: z.boolean(),
    data: dataSchema.optional(),
    error: z.string().optional(),
    timestamp: z.string().datetime(),
    requestId: z.string(),
  });

// Manufacturing schemas
export const OrderDTOSchema = z.object({
  itemId: z.number().int().positive("Item ID must be positive"),
  quantity: z.number().int().positive("Quantity must be positive"),
  blueprintId: z.number().int().positive("Blueprint ID must be positive").optional(),
  materialEfficiency: z.number().int().min(0).max(10).optional().default(0),
  timeEfficiency: z.number().int().min(0).max(20).optional().default(0),
});

export const ManufacturingBatchRequestSchema = z.object({
  orderDTOs: z.array(OrderDTOSchema).min(1, "At least one order is required"),
  stationIds: z.array(z.number().int().positive()).min(1, "At least one station ID is required"),
});

// Invention suggestion schemas
export const InventionSuggestionRequestSchema = z.object({
  skillIds: z.array(z.string().min(1)).min(1, "At least one skill ID is required"),
});

// Export types
export type Planet = z.infer<typeof PlanetSchema>;
export type PaginatedPlanetResponse = z.infer<typeof PaginatedPlanetResponseSchema>;
export type PIPlannerRequest = z.infer<typeof PIPlannerRequestSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type HealthResponse = z.infer<typeof HealthResponseSchema>;
export type DatabaseHealthResponse = z.infer<typeof DatabaseHealthResponseSchema>;
export type OrderDTO = z.infer<typeof OrderDTOSchema>;
export type ManufacturingBatchRequest = z.infer<typeof ManufacturingBatchRequestSchema>;
export type InventionSuggestionRequest = z.infer<typeof InventionSuggestionRequestSchema>;

// Helper function to create API response schemas
export const createApiResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  ApiResponseSchema(dataSchema);

// Validation helper functions
export const validateRequest = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): z.infer<T> => {
  try {
    return schema.parse(data);
  } catch (error) {
    if (error instanceof ZodError) {
      const errorMessages = error.errors.map((err: z.ZodIssue) => 
        `${err.path.join('.')}: ${err.message}`
      ).join(', ');
      throw new Error(`Validation failed: ${errorMessages}`);
    }
    throw error;
  }
};

export const validateRequestSafe = <T extends z.ZodTypeAny>(
  schema: T,
  data: unknown
): { success: true; data: z.infer<T> } | { success: false; errors: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof ZodError) {
      const errors = error.errors.map((err: z.ZodIssue) => 
        `${err.path.join('.')}: ${err.message}`
      );
      return { success: false, errors };
    }
    return { success: false, errors: ['Unknown validation error'] };
  }
}; 
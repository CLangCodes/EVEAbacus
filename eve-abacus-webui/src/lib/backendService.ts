import { createCircuitBreaker, CircuitBreakerOptions } from './circuitBreaker';
import { logger } from './logger';

export interface BackendServiceOptions {
  baseUrl: string;
  timeout?: number;
  circuitBreakerOptions?: CircuitBreakerOptions;
}

export interface PIPlannerRequest {
  focalSystemName: string;
  range: number;
  securityStatus: string[];
  planetTypes: string[];
  pageNumber: number;
  pageSize: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Planet {
  name: string;
  solarSystem: string;
  constellation: string;
  region: string;
  planetType: string;
  security: number | null;
  radius: number;
  minLinkPowerGrid: number;
  minLinkCPU: number;
}

export interface HealthResponse {
  status: string;
  service?: string;
  timestamp: string;
  version?: string;
}

export interface DatabaseHealthResponse {
  status: string;
  database?: string;
  timestamp: string;
  responseTime?: string;
}

export interface BlueprintValidationResponse {
  blueprintTypeId: number;
  productTypeId: number;
  blueprintName: string;
  productName: string;
}

class BackendService {
  private baseUrl: string;
  private timeout: number;

  constructor(options: BackendServiceOptions) {
    this.baseUrl = options.baseUrl;
    this.timeout = options.timeout || 10000;
  }

  private async makeRequest<T>(
    endpoint: string,
    options: RequestInit = {},
    circuitBreakerName: string,
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    const breaker = createCircuitBreaker(circuitBreakerName, {
      failureThreshold: 3,
      recoveryTimeout: 30000,
      expectedResponseTime: this.timeout,
      monitorWindow: 60000,
    });

    return breaker.execute(
      async () => {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        try {
          const response = await fetch(`${this.baseUrl}${endpoint}`, {
            ...options,
            signal: controller.signal,
            headers: {
              'Content-Type': 'application/json',
              ...options.headers,
            },
          });

          clearTimeout(timeoutId);

          if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
          }

          const data = await response.json();
          return data;
        } catch (error) {
          clearTimeout(timeoutId);
          throw error;
        }
      },
      fallback
    );
  }

  // Planet Types endpoint with circuit breaker
  async getPlanetTypes(): Promise<string[]> {
    const endpoint = '/api/Map/PlanetTypes';
    
    console.log('Backend service calling planet types endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      { method: 'GET' },
      'planet-types',
      () => {
        console.log('Using fallback for planet types - backend unavailable');
        logger.warn('Using fallback for planet types - backend unavailable');
        return Promise.resolve(['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma']);
      }
    );
  }

  // Search Solar Systems endpoint with circuit breaker
  async searchSolarSystems(query?: string): Promise<string[]> {
    const endpoint = query 
      ? `/api/Map/SearchSolarSystems?searchTerm=${encodeURIComponent(query)}`
      : '/api/Map/SearchSolarSystems';
    
    console.log('Backend service calling solar system search endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      { method: 'GET' },
      'search-solar-systems',
      () => {
        console.log('Using fallback for solar system search - backend unavailable');
        logger.warn('Using fallback for solar system search - backend unavailable');
        return Promise.resolve(['Jita', 'Dodixie', 'Amarr', 'Rens', 'Hek']);
      }
    );
  }

  // Planets endpoint with circuit breaker
  async getPlanets(request: PIPlannerRequest): Promise<PaginatedResponse<Planet>> {
    console.log('Backend service - getPlanets called with request:', request);
    console.log('Backend service - calling endpoint:', `${this.baseUrl}/api/Map/Planets`);
    
    return this.makeRequest<PaginatedResponse<Planet>>(
      '/api/Map/Planets',
      {
        method: 'POST',
        body: JSON.stringify(request),
      },
      'planets',
      () => {
        console.warn('Backend service - Using fallback for planets - backend unavailable');
        logger.warn('Using fallback for planets - backend unavailable');
        // Only return fallback data when backend is actually unavailable
        // Empty results from backend should not trigger fallback
        return Promise.resolve({
          items: [],
          totalCount: 0,
          pageNumber: request.pageNumber || 1,
          pageSize: request.pageSize || 10,
          totalPages: 0,
          hasPreviousPage: false,
          hasNextPage: false,
        });
      }
    );
  }

  // Health check endpoint with circuit breaker
  async checkHealth(): Promise<HealthResponse> {
    return this.makeRequest<HealthResponse>(
      '/api/health',
      { method: 'GET' },
      'health-check',
      () => {
        logger.warn('Using fallback for health check - backend unavailable');
        return Promise.resolve({
          status: 'error',
          service: 'EVE Abacus API',
          timestamp: new Date().toISOString(),
          version: '1.0.0',
        });
      }
    );
  }

  async checkDatabaseHealth(): Promise<DatabaseHealthResponse> {
    return this.makeRequest<DatabaseHealthResponse>(
      '/api/health/db',
      { method: 'GET' },
      'database-health',
      () => {
        logger.warn('Using fallback for database health check - backend unavailable');
        return Promise.resolve({
          status: 'error',
          database: 'disconnected',
          timestamp: new Date().toISOString(),
          responseTime: 'timeout',
        });
      }
    );
  }

  // Calculator endpoints

  // Search blueprints endpoint
  async searchBlueprints(searchTerm: string): Promise<string[]> {
    const endpoint = `/api/v1/calculator/search-blueprints?searchTerm=${encodeURIComponent(searchTerm)}`;
    
    console.log('Backend service calling blueprint search endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      { method: 'GET' },
      'search-blueprints',
      () => {
        console.log('Using fallback for blueprint search - backend unavailable');
        logger.warn('Using fallback for blueprint search - backend unavailable');
        return Promise.resolve([]);
      }
    );
  }

  // Get blueprint TypeID by name
  async getBlueprintTypeId(blueprintName: string): Promise<number> {
    const endpoint = `/api/v1/calculator/blueprint-type-id?blueprintName=${encodeURIComponent(blueprintName)}`;
    
    console.log('Backend service calling blueprint TypeID endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<number>(
      endpoint,
      { method: 'GET' },
      'blueprint-type-id',
      () => {
        console.log('Using fallback for blueprint TypeID - backend unavailable');
        logger.warn('Using fallback for blueprint TypeID - backend unavailable');
        throw new Error('Blueprint TypeID lookup failed - backend unavailable');
      }
    );
  }

  // Get product TypeID by blueprint TypeID and activity
  async getProductTypeId(blueprintTypeId: number, activityId: number): Promise<number> {
    const endpoint = `/api/v1/calculator/product-type-id?blueprintTypeId=${blueprintTypeId}&activityId=${activityId}`;
    
    console.log('Backend service calling product TypeID endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<number>(
      endpoint,
      { method: 'GET' },
      'product-type-id',
      () => {
        console.log('Using fallback for product TypeID - backend unavailable');
        logger.warn('Using fallback for product TypeID - backend unavailable');
        throw new Error('Product TypeID lookup failed - backend unavailable');
      }
    );
  }

  // Validate blueprint and get both TypeIDs
  async validateBlueprint(blueprintName: string, activityId: number): Promise<BlueprintValidationResponse> {
    const endpoint = `/api/v1/calculator/validate-blueprint?blueprintName=${encodeURIComponent(blueprintName)}&activityId=${activityId}`;
    
    console.log('Backend service calling blueprint validation endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<BlueprintValidationResponse>(
      endpoint,
      { method: 'GET' },
      'validate-blueprint',
      () => {
        console.log('Using fallback for blueprint validation - backend unavailable');
        logger.warn('Using fallback for blueprint validation - backend unavailable');
        throw new Error('Blueprint validation failed - backend unavailable');
      }
    );
  }

  // Get market hubs
  async getMarketHubs(): Promise<string[]> {
    const endpoint = '/api/v1/calculator/market-hubs';
    
    console.log('Backend service calling market hubs endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      { method: 'GET' },
      'market-hubs',
      () => {
        console.log('Using fallback for market hubs - backend unavailable');
        logger.warn('Using fallback for market hubs - backend unavailable');
        return Promise.resolve(['Jita', 'Dodixie', 'Amarr', 'Rens', 'Hek']);
      }
    );
  }

  // Get invention skills
  async getInventionSkills(): Promise<string[]> {
    const endpoint = '/api/v1/calculator/invention-skills';
    
    console.log('Backend service calling invention skills endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      { method: 'GET' },
      'invention-skills',
      () => {
        console.log('Using fallback for invention skills - backend unavailable');
        logger.warn('Using fallback for invention skills - backend unavailable');
        return Promise.resolve([]);
      }
    );
  }

  // Get invention suggestions
  async getInventionSuggestions(inventionSkills: string[]): Promise<string[]> {
    const endpoint = '/api/v1/calculator/invention-suggestions';
    
    console.log('Backend service calling invention suggestions endpoint:', `${this.baseUrl}${endpoint}`);

    return this.makeRequest<string[]>(
      endpoint,
      {
        method: 'POST',
        body: JSON.stringify(inventionSkills),
      },
      'invention-suggestions',
      () => {
        console.log('Using fallback for invention suggestions - backend unavailable');
        logger.warn('Using fallback for invention suggestions - backend unavailable');
        return Promise.resolve([]);
      }
    );
  }
}

// Create a singleton instance
const backendService = new BackendService({
  baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000',
  timeout: 10000,
});

export { backendService }; 
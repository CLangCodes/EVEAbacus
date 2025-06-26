// API service layer for EVE Abacus Next.js API calls

import { ManufBatch, ManufacturingBatchRequest } from '@/types/manufacturing';

export interface Planet {
  [key: string]: string | number | null;
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

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface PIPlannerRequest {
  focalSystemName: string;
  range: number;
  securityStatus: string[];
  planetTypes: string[];
  pageNumber?: number;
  pageSize?: number;
}

// Calculator API interfaces
export interface BlueprintValidation {
  blueprintName: string;
  blueprintTypeId: number;
  productTypeId: number;
  activityId: number;
}

class ApiService {
  private async request<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const url = `${endpoint}`;
    console.log('API Request:', { url, method: options?.method || 'GET', body: options?.body });
    
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      ...options,
    });

    console.log('API Response:', { status: response.status, statusText: response.statusText, url: response.url });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Search for solar systems
  async searchSolarSystems(searchTerm: string): Promise<string[]> {
    const endpoint = searchTerm 
      ? `/api/pihelper/search-solar-systems?searchTerm=${encodeURIComponent(searchTerm)}`
      : '/api/pihelper/search-solar-systems';
    
    try {
      const response = await this.request<unknown>(endpoint);
      console.log('Search response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data as string[];
      } else {
        console.warn('Search response data is not an array:', data);
        return [];
      }
    } catch (error) {
      console.error('Search API error:', error);
      return [];
    }
  }

  // Get planet types
  async getPlanetTypes(): Promise<string[]> {
    try {
      const response = await this.request<unknown>('/api/pihelper/planet-types');
      console.log('Planet types API response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      // Ensure we always return an array
      if (Array.isArray(data)) {
        return data as string[];
      } else {
        console.warn('Planet types API response data is not an array:', data);
        return ['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma'];
      }
    } catch (error) {
      console.error('Planet types API error:', error);
      return ['Temperate', 'Ice', 'Gas', 'Oceanic', 'Lava', 'Barren', 'Storm', 'Plasma'];
    }
  }

  // Get planets based on filters with pagination
  async getPlanets(request: PIPlannerRequest): Promise<PaginatedResponse<Planet>> {
    try {
      const response = await this.request<PaginatedResponse<Planet>>('/api/pihelper/planets', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      
      console.log('Planets API response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: PaginatedResponse<Planet> }).data;
      }
      
      return data;
    } catch (error) {
      console.error('Planets API error:', error);
      throw error;
    }
  }

  // Calculator API methods

  // Search for blueprints by name
  async searchBlueprints(searchTerm: string): Promise<string[]> {
    if (!searchTerm || searchTerm.length < 2) {
      return [];
    }

    try {
      const response = await this.request<unknown>(`/api/calculator/search-blueprints?searchTerm=${encodeURIComponent(searchTerm)}`);
      console.log('Blueprint search response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return Array.isArray(data) ? data as string[] : [];
    } catch (error) {
      console.error('Blueprint search API error:', error);
      return [];
    }
  }

  // Get blueprint TypeID by name
  async getBlueprintTypeId(blueprintName: string): Promise<number | null> {
    if (!blueprintName) {
      return null;
    }

    try {
      const response = await this.request<unknown>(`/api/calculator/blueprint-type-id?blueprintName=${encodeURIComponent(blueprintName)}`);
      console.log('Blueprint TypeID response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return typeof data === 'number' ? data : null;
    } catch (error) {
      console.error('Blueprint TypeID API error:', error);
      return null;
    }
  }

  // Get product TypeID by blueprint TypeID and activity
  async getProductTypeId(blueprintTypeId: number, activityId: number): Promise<number | null> {
    if (blueprintTypeId <= 0) {
      return null;
    }

    try {
      const response = await this.request<unknown>(`/api/calculator/product-type-id?blueprintTypeId=${blueprintTypeId}&activityId=${activityId}`);
      console.log('Product TypeID response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return typeof data === 'number' ? data : null;
    } catch (error) {
      console.error('Product TypeID API error:', error);
      return null;
    }
  }

  // Validate blueprint and get both TypeIDs
  async validateBlueprint(blueprintName: string, activityId: number): Promise<BlueprintValidation | null> {
    if (!blueprintName) {
      return null;
    }

    try {
      const response = await this.request<unknown>(`/api/calculator/validate-blueprint?blueprintName=${encodeURIComponent(blueprintName)}&activityId=${activityId}`);
      console.log('Blueprint validation response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return data && typeof data === 'object' && 'blueprintName' in data ? data as BlueprintValidation : null;
    } catch (error) {
      console.error('Blueprint validation API error:', error);
      return null;
    }
  }

  // Get market hubs
  async getMarketHubs(): Promise<string[]> {
    try {
      const response = await this.request<unknown>('/api/calculator/market-hubs');
      console.log('Market hubs response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return Array.isArray(data) ? data as string[] : [];
    } catch (error) {
      console.error('Market hubs API error:', error);
      return [];
    }
  }

  // Get invention skills
  async getInventionSkills(): Promise<string[]> {
    try {
      const response = await this.request<unknown>('/api/calculator/invention-skills');
      console.log('Invention skills response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return Array.isArray(data) ? data as string[] : [];
    } catch (error) {
      console.error('Invention skills API error:', error);
      return [];
    }
  }

  // Get invention suggestions
  async getInventionSuggestions(inventionSkills: string[]): Promise<string[]> {
    if (!Array.isArray(inventionSkills) || inventionSkills.length < 3) {
      return [];
    }

    try {
      const response = await this.request<unknown>('/api/calculator/invention-suggestions', {
        method: 'POST',
        body: JSON.stringify(inventionSkills),
      });
      console.log('Invention suggestions response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return Array.isArray(data) ? data as string[] : [];
    } catch (error) {
      console.error('Invention suggestions API error:', error);
      return [];
    }
  }

  // Get manufacturing batch calculation
  async getManufacturingBatch(request: ManufacturingBatchRequest): Promise<ManufBatch | null> {
    try {
      const response = await this.request<unknown>('/api/calculator/manufacturing-batch', {
        method: 'POST',
        body: JSON.stringify(request),
      });
      console.log('Manufacturing batch response:', response);
      
      // Handle the wrapped response format from middleware
      let data = response;
      if (response && typeof response === 'object' && 'data' in response) {
        data = (response as { data: unknown }).data;
      }
      
      return data && typeof data === 'object' ? data as ManufBatch : null;
    } catch (error) {
      console.error('Manufacturing batch API error:', error);
      return null;
    }
  }
}

export const apiService = new ApiService(); 
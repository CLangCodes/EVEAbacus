import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://eveabacus.com');

export async function GET(req: NextRequest) { // eslint-disable-line @typescript-eslint/no-unused-vars
  try {
    // Try to fetch from backend first
    const backendSwaggerUrl = `${BACKEND_BASE_URL}/swagger/v1/swagger.json`;
    
    console.log('Fetching backend Swagger from:', backendSwaggerUrl);
    
    const response = await fetch(backendSwaggerUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const backendSwagger = await response.json();
      
      // Update the servers to point to the frontend API routes
      backendSwagger.servers = [
        {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://eveabacus.com',
          description: process.env.NODE_ENV === 'development' ? 'Frontend API (Development)' : 'Frontend API (Production)',
        },
      ];
      
      // Use frontend API routes to avoid CORS issues
      backendSwagger.servers = [
        {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://eveabacus.com',
          description: process.env.NODE_ENV === 'development' ? 'Frontend API (Development)' : 'Frontend API (Production)',
        },
      ];
      
      // Create a custom Swagger spec with frontend API routes
      const frontendSwagger = {
        ...backendSwagger,
        paths: {
          '/api/calculator/market-hubs': {
            get: {
              tags: ['calculator'],
              summary: 'Get market hubs',
              description: 'Returns a list of market hub station names that can be used for market analysis',
              responses: {
                '200': {
                  description: 'List of market hub names',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                },
                '500': {
                  description: 'Internal server error'
                }
              }
            }
          },
          '/api/calculator/search-blueprints': {
            get: {
              tags: ['calculator'],
              summary: 'Search for blueprints by name',
              description: 'Performs a search across all blueprints and returns matching names for autocomplete functionality',
              parameters: [
                {
                  in: 'query',
                  name: 'searchTerm',
                  schema: { type: 'string', minLength: 2, maxLength: 100 },
                  description: 'Search term for blueprint names (minimum 2 characters)',
                  required: true
                }
              ],
              responses: {
                '200': {
                  description: 'List of matching blueprint names',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'array',
                        items: { type: 'string' }
                      }
                    }
                  }
                },
                '400': { description: 'Bad request - invalid query parameters' },
                '404': { description: 'No blueprints found' },
                '500': { description: 'Internal server error' }
              }
            }
          },
          '/api/calculator/manufacturing-batch': {
            post: {
              tags: ['calculator'],
              summary: 'Calculate manufacturing batch',
              description: 'Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis',
              requestBody: {
                required: true,
                content: {
                  'application/json': {
                    schema: {
                      type: 'object',
                      properties: {
                        orderDTOs: {
                          type: 'array',
                          items: { type: 'object' },
                          description: 'Array of manufacturing orders'
                        },
                        stationIds: {
                          type: 'array',
                          items: { type: 'string' },
                          description: 'Array of station IDs for market analysis'
                        }
                      }
                    }
                  }
                }
              },
              responses: {
                '200': {
                  description: 'Manufacturing batch calculation results',
                  content: {
                    'application/json': {
                      schema: { type: 'object' }
                    }
                  }
                },
                '400': { description: 'Bad request - invalid input data' },
                '500': { description: 'Internal server error' }
              }
            }
          }
        }
             };
       
       console.log('Successfully created frontend Swagger spec');
       return NextResponse.json(frontendSwagger);
    } else {
      console.warn('Backend Swagger not available, falling back to local Swagger');
      // Fallback to local swagger if backend is not available
      const localSwagger = await import('../../../swagger');
      return NextResponse.json(localSwagger.default);
    }
  } catch (error) {
    console.error('Error fetching backend Swagger:', error);
    // Fallback to local swagger if backend is not available
    const localSwagger = await import('../../../swagger');
    return NextResponse.json(localSwagger.default);
  }
} 
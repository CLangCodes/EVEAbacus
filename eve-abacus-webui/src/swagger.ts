import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EVE Abacus API',
      version: 'v1',
      description: 'API for EVE Online manufacturing and production calculations',
      contact: {
        name: 'EVE Abacus Webmaster',
        email: 'webmaster@eveabacus.com',
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT',
      },
    },
    servers: [
      {
        url: 'http://localhost:5000',
        description: 'Development server',
      },
      {
        url: 'https://api.eveabacus.com',
        description: 'Production server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token for authentication',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API key for admin operations',
        },
      },
      schemas: {
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message',
            },
            status: {
              type: 'integer',
              description: 'HTTP status code',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Error timestamp',
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier',
            },
          },
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Whether the request was successful',
            },
            data: {
              type: 'object',
              description: 'Response data',
            },
            timestamp: {
              type: 'string',
              format: 'date-time',
              description: 'Response timestamp',
            },
            requestId: {
              type: 'string',
              description: 'Unique request identifier',
            },
          },
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            items: {
              type: 'array',
              description: 'Array of items',
            },
            totalCount: {
              type: 'integer',
              description: 'Total number of items',
            },
            pageNumber: {
              type: 'integer',
              description: 'Current page number',
            },
            pageSize: {
              type: 'integer',
              description: 'Number of items per page',
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages',
            },
            hasPreviousPage: {
              type: 'boolean',
              description: 'Whether there is a previous page',
            },
            hasNextPage: {
              type: 'boolean',
              description: 'Whether there is a next page',
            },
          },
        },
      },
    },
    tags: [
      {
        name: 'calculator',
        description: 'Manufacturing calculator and blueprint operations',
      },
      {
        name: 'sde',
        description: 'EVE Online Static Data Export (SDE) endpoints',
      },
      {
        name: 'esi',
        description: 'EVE Swagger Interface (ESI) authentication and routing',
      },
      {
        name: 'abacus',
        description: 'Core EVE Abacus manufacturing and production calculations',
      },
      {
        name: 'map',
        description: 'EVE Online map and solar system endpoints',
      },
      {
        name: 'pihelper',
        description: 'PI (Planetary Industry) helper endpoints',
      },
      {
        name: 'System',
        description: 'System and utility endpoints',
      },
    ],
    externalDocs: {
      description: 'Backend API Documentation',
      url: 'https://blazor.eveabacus.com/swaggerComp',
    },
  },
  apis: [
    './src/app/api/**/*.ts',
    './src/app/api/calculator/**/*.ts',
    './src/app/api/sde/**/*.ts',
    './src/app/api/esi/**/*.ts',
    './src/app/api/abacus/**/*.ts',
    './src/app/api/map/**/*.ts',
    './src/app/api/pihelper/**/*.ts',
    './src/app/api/monitoring/**/*.ts',
  ], // Path to your API route files including all available endpoints
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 
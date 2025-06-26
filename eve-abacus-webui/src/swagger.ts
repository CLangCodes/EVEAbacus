import swaggerJSDoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'EVE Abacus API',
      version: '2.0.0',
      description: 'API documentation for EVE Abacus Next.js layer',
      contact: {
        name: 'EVE Abacus Webmaster',
        email: 'webmaster@eveabacus.com',
      },
    },
    servers: [
      {
        url: 'http://localhost:3000',
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
          },
        },
      },
    },
    tags: [
      {
        name: 'pihelper',
        description: 'PI (Planetary Industry) helper endpoints',
      },
      {
        name: 'System',
        description: 'System and utility endpoints',
      },
    ],
  },
  apis: [
    './src/app/api/**/*.ts',
    './src/app/api/pihelper/**/*.ts',
    './src/app/api/monitoring/**/*.ts',
  ], // Path to your API route files including pihelper and monitoring
};

const swaggerSpec = swaggerJSDoc(options);

export default swaggerSpec; 
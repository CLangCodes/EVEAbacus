import { NextRequest, NextResponse } from 'next/server';
import { z, ZodError } from 'zod';
import { logger } from './logger';

export interface ValidationOptions {
  body?: z.ZodTypeAny;
  query?: z.ZodTypeAny;
  params?: z.ZodTypeAny;
  strict?: boolean;
}

export function withValidation<T>(
  req: NextRequest,
  handler: (validatedData: T) => Promise<unknown>,
  options: ValidationOptions
): Promise<NextResponse> {
  return new Promise(async (resolve) => {
    try {
      const validatedData: Record<string, unknown> = {};

      // Validate request body
      if (options.body && req.method !== 'GET') {
        try {
          const body = await req.json();
          validatedData.body = options.body.parse(body);
        } catch (error) {
          if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => 
              `body.${err.path.join('.')}: ${err.message}`
            ).join(', ');
            logger.warn('Request validation failed', {
              method: req.method,
              url: req.url,
              error: errorMessages,
            });
            resolve(NextResponse.json(
              { 
                success: false, 
                error: `Validation failed: ${errorMessages}`,
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              },
              { status: 400 }
            ));
            return;
          }
          // If it's not a ZodError, it's likely a JSON parsing error
          logger.warn('Invalid JSON in request body', {
            method: req.method,
            url: req.url,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
          resolve(NextResponse.json(
            { 
              success: false, 
              error: 'Invalid JSON in request body',
              timestamp: new Date().toISOString(),
              requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            },
            { status: 400 }
          ));
          return;
        }
      }

      // Validate query parameters
      if (options.query) {
        try {
          const url = new URL(req.url);
          const queryParams: Record<string, string> = {};
          url.searchParams.forEach((value, key) => {
            queryParams[key] = value;
          });
          validatedData.query = options.query.parse(queryParams);
        } catch (error) {
          if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => 
              `query.${err.path.join('.')}: ${err.message}`
            ).join(', ');
            logger.warn('Query validation failed', {
              method: req.method,
              url: req.url,
              error: errorMessages,
            });
            resolve(NextResponse.json(
              { 
                success: false, 
                error: `Validation failed: ${errorMessages}`,
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              },
              { status: 400 }
            ));
            return;
          }
        }
      }

      // Validate URL parameters (if needed)
      if (options.params) {
        try {
          // Extract params from URL path if needed
          // This is a simplified version - you might need to adjust based on your routing
          validatedData.params = options.params.parse({});
        } catch (error) {
          if (error instanceof ZodError) {
            const errorMessages = error.errors.map(err => 
              `params.${err.path.join('.')}: ${err.message}`
            ).join(', ');
            logger.warn('Params validation failed', {
              method: req.method,
              url: req.url,
              error: errorMessages,
            });
            resolve(NextResponse.json(
              { 
                success: false, 
                error: `Validation failed: ${errorMessages}`,
                timestamp: new Date().toISOString(),
                requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
              },
              { status: 400 }
            ));
            return;
          }
        }
      }

      // Call the handler with validated data
      const result = await handler(validatedData as T);
      resolve(NextResponse.json(result, { status: 200 }));

    } catch (error) {
      logger.error('Validation middleware error', {
        method: req.method,
        url: req.url,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      
      resolve(NextResponse.json(
        { 
          success: false, 
          error: 'Internal server error during validation',
          timestamp: new Date().toISOString(),
          requestId: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        },
        { status: 500 }
      ));
    }
  });
}

// Convenience function for body-only validation
export function validateBody<T>(
  req: NextRequest,
  handler: (body: T) => Promise<unknown>,
  schema: z.ZodType<T>
): Promise<NextResponse> {
  return withValidation(req, async (validatedData: { body: T }) => {
    return await handler(validatedData.body);
  }, { body: schema });
}

// Convenience function for query-only validation
export function validateQuery<T>(
  req: NextRequest,
  handler: (query: T) => Promise<unknown>,
  schema: z.ZodType<T>
): Promise<NextResponse> {
  return withValidation(req, async (validatedData: { query: T }) => {
    return await handler(validatedData.query);
  }, { query: schema });
} 
import { NextRequest, NextResponse } from 'next/server';
import { logger } from './logger';
import { performanceMonitor } from './performance';

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  timestamp: string;
  requestId: string;
}

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    message: string,
    public code?: string
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

export function createApiResponse<T>(
  data: T,
  success: boolean = true,
  requestId: string = generateRequestId()
): ApiResponse<T> {
  return {
    success,
    data,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

export function createErrorResponse(
  error: string,
  requestId: string = generateRequestId()
): ApiResponse {
  return {
    success: false,
    error,
    timestamp: new Date().toISOString(),
    requestId,
  };
}

function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

function getClientIP(req: NextRequest): string {
  return req.headers.get('x-forwarded-for') || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function extractEndpoint(req: NextRequest): string {
  const url = new URL(req.url);
  return url.pathname;
}

export async function withErrorHandling<T>(
  req: NextRequest,
  handler: () => Promise<T>
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const ip = getClientIP(req);
  const endpoint = extractEndpoint(req);
  
  try {
    // Log request start
    logger.logRequest(req, requestId, ip);
    
    // Record performance start
    const result = await handler();
    const responseTime = Date.now() - startTime;
    
    // Log successful response
    logger.logResponse(req, requestId, 200, responseTime, ip);
    
    // Record performance metrics
    performanceMonitor.recordRequest(req.method, endpoint, responseTime, false);
    
    return NextResponse.json(
      createApiResponse(result, true, requestId),
      { status: 200 }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof ApiError ? error.message : 'Internal server error';
    
    // Log error
    logger.logError(req, requestId, error as Error, responseTime, ip);
    
    // Record performance metrics (with error flag)
    performanceMonitor.recordRequest(req.method, endpoint, responseTime, true);
    
    return NextResponse.json(
      createErrorResponse(errorMessage, requestId),
      { status: 500 }
    );
  }
}

// Enhanced middleware with detailed logging
export async function withDetailedLogging<T>(
  req: NextRequest,
  handler: () => Promise<T>,
  options?: {
    logRequestBody?: boolean;
    logResponseBody?: boolean;
    sensitiveHeaders?: string[];
  }
): Promise<NextResponse> {
  const startTime = Date.now();
  const requestId = generateRequestId();
  const ip = getClientIP(req);
  const endpoint = extractEndpoint(req);
  
  // Log request details
  const requestMetadata: Record<string, unknown> = {
    requestId,
    method: req.method,
    url: req.url,
    userAgent: req.headers.get('user-agent'),
    ip,
  };

  // Log request body if enabled and present
  if (options?.logRequestBody && req.method !== 'GET') {
    try {
      const body = await req.clone().text();
      if (body) {
        requestMetadata.requestBody = body;
      }
    } catch {
      requestMetadata.requestBodyError = 'Failed to read request body';
    }
  }

  logger.info('API Request Started', requestMetadata);
  
  try {
    const result = await handler();
    const responseTime = Date.now() - startTime;
    
    // Log response details
    const responseMetadata: Record<string, unknown> = {
      requestId,
      method: req.method,
      url: req.url,
      statusCode: 200,
      responseTime,
      ip,
    };

    // Log response body if enabled
    if (options?.logResponseBody) {
      responseMetadata.responseBody = JSON.stringify(result);
    }

    logger.info('API Request Completed', responseMetadata);
    performanceMonitor.recordRequest(req.method, endpoint, responseTime, false);
    
    return NextResponse.json(
      createApiResponse(result, true, requestId),
      { status: 200 }
    );
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof ApiError ? error.message : 'Internal server error';
    const statusCode = error instanceof ApiError ? error.statusCode : 500;
    
    logger.error('API Request Failed', {
      requestId,
      method: req.method,
      url: req.url,
      error: errorMessage,
      stack: (error as Error).stack,
      responseTime,
      ip,
    });
    
    performanceMonitor.recordRequest(req.method, endpoint, responseTime, true);
    
    return NextResponse.json(
      createErrorResponse(errorMessage, requestId),
      { status: statusCode }
    );
  }
} 
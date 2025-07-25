import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Determine backend URL based on the request host
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  // Get backend URL from environment or use default
  const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';
  try {
    // Always fetch from backend
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
      // Update the servers to point to the backend API routes
      // In production, the frontend and backend might be on the same server
      const serverUrl = isLocalhost ? 'http://localhost:5000' : BACKEND_BASE_URL;
      backendSwagger.servers = [
        {
          url: serverUrl,
          description: isLocalhost ? 'Backend API (Development)' : 'Backend API (Production)',
        },
      ];
      console.log('Successfully fetched and processed Swagger from:', BACKEND_BASE_URL);
      return NextResponse.json(backendSwagger);
    } else {
      console.error('Backend Swagger fetch failed:', {
        status: response.status,
        statusText: response.statusText,
        url: backendSwaggerUrl,
        host: host,
        isLocalhost: isLocalhost,
        backendUrl: BACKEND_BASE_URL
      });
      
      // Try to provide more helpful error information
      let errorMessage = `Failed to fetch from ${backendSwaggerUrl} (${response.status} ${response.statusText})`;
      if (response.status === 404) {
        errorMessage += '. Backend Swagger endpoint not found. Check if backend is running and Swagger is enabled.';
      } else if (response.status === 503) {
        errorMessage += '. Backend service unavailable. Check if backend is running.';
      } else if (response.status === 0) {
        errorMessage += '. Network error. Check if backend is accessible and CORS is configured correctly.';
      }
      
      return NextResponse.json({ 
        error: 'Backend Swagger not available',
        details: errorMessage,
        debug: {
          host: host,
          isLocalhost: isLocalhost,
          backendUrl: BACKEND_BASE_URL,
          attemptedUrl: backendSwaggerUrl
        }
      }, { status: 503 });
    }
  } catch (error) {
    console.error('Error fetching backend Swagger:', {
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      host: host,
      isLocalhost: isLocalhost,
      backendUrl: BACKEND_BASE_URL
    });
    
    let errorMessage = error instanceof Error ? error.message : 'Unknown error';
    if (errorMessage.includes('fetch')) {
      errorMessage += '. Network error - check if backend is running and accessible.';
    }
    
    return NextResponse.json({ 
      error: 'Backend Swagger not available',
      details: errorMessage,
      debug: {
        host: host,
        isLocalhost: isLocalhost,
        backendUrl: BACKEND_BASE_URL,
        errorType: error instanceof Error ? error.constructor.name : 'Unknown'
      }
    }, { status: 503 });
  }
} 
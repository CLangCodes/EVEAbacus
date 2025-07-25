import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Determine backend URL based on the request host
  const host = request.headers.get('host') || '';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  
  const BACKEND_BASE_URL = process.env.BACKEND_URL || 
    (isLocalhost ? 'http://localhost:5000' : 'https://eveabacus.com');
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
      backendSwagger.servers = [
        {
          url: isLocalhost ? 'http://localhost:5000' : 'https://eveabacus.com',
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
        isLocalhost: isLocalhost
      });
      return NextResponse.json({ 
        error: 'Backend Swagger not available',
        details: `Failed to fetch from ${backendSwaggerUrl} (${response.status} ${response.statusText})`
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
    return NextResponse.json({ 
      error: 'Backend Swagger not available',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 503 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

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
      
      // Update the servers to point to the backend API
      backendSwagger.servers = [
        {
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://api.eveabacus.com',
          description: process.env.NODE_ENV === 'development' ? 'Development server' : 'Production server',
        },
        {
          url: 'https://eveabacus.com',
          description: 'Production frontend',
        },
      ];
      
      console.log('Successfully fetched backend Swagger');
      return NextResponse.json(backendSwagger);
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
import { NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || (process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://eveabacus.com');

export async function GET() {
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
          url: process.env.NODE_ENV === 'development' ? 'http://localhost:5000' : 'https://eveabacus.com',
          description: process.env.NODE_ENV === 'development' ? 'Backend API (Development)' : 'Backend API (Production)',
        },
      ];
      return NextResponse.json(backendSwagger);
    } else {
      return NextResponse.json({ error: 'Backend Swagger not available' }, { status: 503 });
    }
  } catch (error) {
    console.error('Error fetching backend Swagger:', error);
    return NextResponse.json({ error: 'Backend Swagger not available' }, { status: 503 });
  }
} 
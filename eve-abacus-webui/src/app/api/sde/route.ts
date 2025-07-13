import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/sde:
 *   get:
 *     tags:
 *       - sde
 *     summary: Proxy SDE endpoint
 *     description: Proxies requests to the backend SDE controller endpoints
 *     parameters:
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: The SDE endpoint path to call
 *         required: true
 *     responses:
 *       200:
 *         description: SDE data from backend
 *       400:
 *         description: Bad request - missing path parameter
 *       500:
 *         description: Internal server error
 *   post:
 *     tags:
 *       - sde
 *     summary: Proxy SDE POST endpoint
 *     description: Proxies POST requests to the backend SDE controller endpoints
 *     parameters:
 *       - in: query
 *         name: path
 *         schema:
 *           type: string
 *         description: The SDE endpoint path to call
 *         required: true
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: SDE data from backend
 *       400:
 *         description: Bad request - missing path parameter
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    const backendUrl = `${BACKEND_BASE_URL}/api/v1.0/sde/${path}`;
    
    console.log('SDE API request:', {
      url: backendUrl,
      method: 'GET'
    });

    const response = await fetch(backendUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend SDE response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend SDE error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('SDE API response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('SDE API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json(
        { error: 'Path parameter is required' },
        { status: 400 }
      );
    }

    const body = await req.json();
    const backendUrl = `${BACKEND_BASE_URL}/api/v1.0/sde/${path}`;
    
    console.log('SDE API POST request:', {
      url: backendUrl,
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch(backendUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend SDE POST response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend SDE POST error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('SDE API POST response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('SDE API POST error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
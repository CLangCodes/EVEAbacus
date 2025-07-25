import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/esi/route/{originId}/{destinationId}:
 *   get:
 *     tags:
 *       - esi
 *     summary: Get route between systems
 *     description: Returns an array of system IDs representing the route between two solar systems using EVE Online ESI route finding
 *     parameters:
 *       - in: path
 *         name: originId
 *         schema: { type: 'integer' }
 *         description: TypeID of the origin solar system
 *         required: true
 *       - in: path
 *         name: destinationId
 *         schema: { type: 'integer' }
 *         description: TypeID of the destination solar system
 *         required: true
 *       - in: query
 *         name: flag
 *         schema: { type: 'string', default: 'shortest' }
 *         description: Route finding flag (e.g., "shortest", "secure", "insecure")
 *     responses:
 *       200:
 *         description: Array of system IDs representing the route
 *         content:
 *           application/json:
 *             schema:
 *               type: 'array'
 *               items:
 *                 type: 'integer'
 *               description: Array of system IDs in the route (empty array if no route found)
 *       400:
 *         description: Bad request - invalid parameters
 *       500:
 *         description: Internal server error
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { originId: string; destinationId: string } }
) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log('ESI Route route called');
    
    const { searchParams } = new URL(request.url);
    const flag = searchParams.get('flag') || 'shortest';
    const originId = params.originId;
    const destinationId = params.destinationId;
    
    if (!originId || !destinationId) {
      return NextResponse.json(
        { error: 'Origin ID and destination ID are required' },
        { status: 400 }
      );
    }
    
    console.log('ESI Route request:', {
      url: `${BACKEND_BASE_URL}/ESI/route/${originId}/${destinationId}`,
      method: 'GET',
      originId,
      destinationId,
      flag
    });

    const response = await fetch(`${BACKEND_BASE_URL}/ESI/route/${originId}/${destinationId}?flag=${flag}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend ESI Route response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend ESI Route error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('ESI Route response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    // Return raw data for Swagger UI compatibility
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('ESI Route error:', {
      requestId,
      error: errorMessage,
      responseTime,
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 
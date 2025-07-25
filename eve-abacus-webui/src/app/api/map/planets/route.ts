import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/map/planets:
 *   post:
 *     tags:
 *       - map
 *     summary: Get planets based on filters
 *     description: Returns a paginated list of planets matching the specified criteria for Planetary Interaction planning.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               focalSystemName:
 *                 type: string
 *                 description: Name of the EVE Online solar system to use as the center point
 *               range:
 *                 type: integer
 *                 minimum: 0
 *                 description: Number of jumps from the focal system to search
 *               securityStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of security status filters
 *               planetTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of planet types to filter by
 *               pageNumber:
 *                 type: integer
 *                 minimum: 1
 *                 default: 1
 *                 description: Page number for pagination
 *               pageSize:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 25
 *                 description: Number of items per page
 *             required:
 *               - focalSystemName
 *               - range
 *     responses:
 *       200:
 *         description: Paginated list of planets matching criteria
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request - invalid parameters
 *       404:
 *         description: Solar system not found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log('Map Planets route called');
    
    const body = await request.json();
    
    console.log('Map Planets request:', {
      url: `${BACKEND_BASE_URL}/api/Map/Planets`,
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/Map/Planets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend Map Planets response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend Map Planets error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Map Planets response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    // Return raw data for Swagger UI compatibility
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('Map Planets error:', {
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
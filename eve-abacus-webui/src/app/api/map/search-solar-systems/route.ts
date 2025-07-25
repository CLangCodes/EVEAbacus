import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/map/search-solar-systems:
 *   get:
 *     tags:
 *       - map
 *     summary: Search for EVE Online solar system names
 *     description: Returns a list of solar system names matching the search term for autocomplete functionality. If no search term is provided, returns all system names.
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *         description: Optional search term for solar system names
 *     responses:
 *       200:
 *         description: List of matching solar system names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: No matching solar systems found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log('Map SearchSolarSystems route called');
    
    const { searchParams } = new URL(request.url);
    const searchTerm = searchParams.get('searchTerm');
    
    const queryParams = new URLSearchParams();
    if (searchTerm) {
      queryParams.append('searchTerm', searchTerm);
    }
    
    console.log('Map SearchSolarSystems request:', {
      url: `${BACKEND_BASE_URL}/api/Map/SearchSolarSystems`,
      method: 'GET',
      searchTerm: searchTerm || 'all'
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/Map/SearchSolarSystems?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend Map SearchSolarSystems response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend Map SearchSolarSystems error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Map SearchSolarSystems response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    // Return raw data for Swagger UI compatibility
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('Map SearchSolarSystems error:', {
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
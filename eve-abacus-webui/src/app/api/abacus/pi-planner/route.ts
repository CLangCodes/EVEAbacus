import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/abacus/pi-planner:
 *   post:
 *     tags:
 *       - abacus
 *     summary: Find planets for Planetary Interaction
 *     description: Finds planets suitable for Planetary Interaction (PI) within a specified range of a focal system
 *     parameters:
 *       - in: query
 *         name: focalSystemName
 *         schema:
 *           type: string
 *         description: Name of the EVE Online solar system to use as the center point
 *         required: true
 *       - in: query
 *         name: range
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 10
 *         description: Number of jumps from the focal system to search (1-10)
 *         required: true
 *       - in: query
 *         name: securityStatus
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of security status filters (e.g., ['highsec', 'lowsec', 'nullsec'])
 *       - in: query
 *         name: planetTypes
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of planet types to filter by (e.g., ['Barren', 'Gas', 'Ice', 'Lava', 'Oceanic', 'Plasma', 'Storm', 'Temperate'])
 *     responses:
 *       200:
 *         description: List of suitable planets for PI
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       400:
 *         description: Bad request - invalid parameters
 *       404:
 *         description: No suitable planets found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    console.log('Abacus PIPlanner route called');
    
    const { searchParams } = new URL(request.url);
    const focalSystemName = searchParams.get('focalSystemName');
    const range = searchParams.get('range');
    const securityStatus = searchParams.getAll('securityStatus');
    const planetTypes = searchParams.getAll('planetTypes');
    
    if (!focalSystemName || !range) {
      return NextResponse.json(
        { error: 'focalSystemName and range are required parameters' },
        { status: 400 }
      );
    }
    
    const queryParams = new URLSearchParams();
    queryParams.append('focalSystemName', focalSystemName);
    queryParams.append('range', range);
    securityStatus.forEach(status => queryParams.append('securityStatus', status));
    planetTypes.forEach(type => queryParams.append('planetTypes', type));
    
    console.log('Abacus PIPlanner request:', {
      url: `${BACKEND_BASE_URL}/api/Abacus/PIPlanner`,
      method: 'POST',
      focalSystemName,
      range,
      securityStatus,
      planetTypes
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/Abacus/PIPlanner?${queryParams.toString()}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend Abacus PIPlanner response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend Abacus PIPlanner error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Abacus PIPlanner response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  });
} 
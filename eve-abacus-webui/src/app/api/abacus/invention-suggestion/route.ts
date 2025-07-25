import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/abacus/invention-suggestion:
 *   post:
 *     tags:
 *       - abacus
 *     summary: Get invention suggestions
 *     description: Returns a list of blueprints suitable for invention based on character's R&D skills
 *     parameters:
 *       - in: query
 *         name: skillIds
 *         schema:
 *           type: array
 *           items:
 *             type: string
 *         description: Array of EVE Online R&D skill IDs
 *         required: true
 *     responses:
 *       200:
 *         description: List of suitable blueprints for invention
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request - missing skill IDs
 *       404:
 *         description: No suitable blueprints found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    console.log('Abacus InventionSuggestion route called');
    
    const { searchParams } = new URL(request.url);
    const skillIds = searchParams.getAll('skillIds');
    
    if (!skillIds || skillIds.length === 0) {
      return NextResponse.json(
        { error: 'At least one R&D skill ID is required' },
        { status: 400 }
      );
    }
    
    console.log('Abacus InventionSuggestion request:', {
      url: `${BACKEND_BASE_URL}/api/Abacus/InventionSuggestion`,
      method: 'POST',
      skillIds: skillIds
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/Abacus/InventionSuggestion?${skillIds.map(id => `skillIds=${encodeURIComponent(id)}`).join('&')}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend Abacus InventionSuggestion response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend Abacus InventionSuggestion error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Abacus InventionSuggestion response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  });
} 
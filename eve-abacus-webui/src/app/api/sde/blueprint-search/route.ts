import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/sde/blueprint-search:
 *   post:
 *     tags:
 *       - sde
 *     summary: Search for blueprints by name
 *     description: Performs a search across all blueprints and returns matching names for autocomplete functionality
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for blueprint names
 *         required: true
 *     responses:
 *       200:
 *         description: List of matching blueprint names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       404:
 *         description: No blueprints found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    console.log('SDE BlueprintSearch route called');
    
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    
    if (!search) {
      return NextResponse.json(
        { error: 'Search parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('SDE BlueprintSearch request:', {
      url: `${BACKEND_BASE_URL}/api/v1.0/SDE/bpSearch`,
      method: 'POST',
      search: search
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1.0/SDE/bpSearch?search=${encodeURIComponent(search)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend SDE BlueprintSearch response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend SDE BlueprintSearch error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('SDE BlueprintSearch response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  });
} 
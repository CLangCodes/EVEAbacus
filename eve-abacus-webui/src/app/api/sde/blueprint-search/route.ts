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
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
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

    // Check if response is JSON or plain text
    const contentType = response.headers.get('content-type');
    let data;
    
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      // Handle plain text response
      data = await response.text();
    }
    
    console.log('SDE BlueprintSearch response:', {
      status: response.status,
      contentType,
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    });

    // Return raw data for Swagger UI compatibility
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('SDE BlueprintSearch error:', {
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
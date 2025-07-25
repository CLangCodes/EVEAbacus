import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/sde/item-name:
 *   get:
 *     tags:
 *       - sde
 *     summary: Get item name by TypeID
 *     description: Retrieves the full name of an EVE Online item using its TypeID
 *     parameters:
 *       - in: query
 *         name: id
 *         schema:
 *           type: integer
 *         description: TypeID of the item
 *         required: true
 *     responses:
 *       200:
 *         description: Item name
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       404:
 *         description: Item not found
 *       500:
 *         description: Internal server error
 */
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  try {
    console.log('SDE GetItemName route called');
    
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { error: 'TypeID parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('SDE GetItemName request:', {
      url: `${BACKEND_BASE_URL}/api/v1.0/SDE/itemName`,
      method: 'GET',
      id: id
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1.0/SDE/itemName?id=${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend SDE GetItemName response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend SDE GetItemName error response:', errorText);
      
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
    
    console.log('SDE GetItemName response:', {
      status: response.status,
      contentType,
      data: typeof data === 'string' ? data : JSON.stringify(data, null, 2)
    });

    // Return raw data for Swagger UI compatibility
    return NextResponse.json(data);
  } catch (error) {
    const responseTime = Date.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    
    console.error('SDE GetItemName error:', {
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
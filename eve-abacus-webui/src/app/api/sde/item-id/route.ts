import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/sde/item-id:
 *   get:
 *     tags:
 *       - sde
 *     summary: Get TypeID by item name
 *     description: Retrieves the TypeID of an EVE Online item using its exact name (case-sensitive)
 *     parameters:
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Exact name of the item (case-sensitive)
 *         required: true
 *     responses:
 *       200:
 *         description: Item TypeID
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
  return withErrorHandling(request, async () => {
    console.log('SDE GetItemId route called');
    
    const { searchParams } = new URL(request.url);
    const name = searchParams.get('name');
    
    if (!name) {
      return NextResponse.json(
        { error: 'Name parameter is required' },
        { status: 400 }
      );
    }
    
    console.log('SDE GetItemId request:', {
      url: `${BACKEND_BASE_URL}/api/v1.0/SDE/itemId`,
      method: 'GET',
      name: name
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1.0/SDE/itemId?name=${encodeURIComponent(name)}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      console.error('Backend SDE GetItemId response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend SDE GetItemId error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('SDE GetItemId response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  });
} 
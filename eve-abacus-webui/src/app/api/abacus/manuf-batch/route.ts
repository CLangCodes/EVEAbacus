import { NextRequest, NextResponse } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/abacus/manuf-batch:
 *   post:
 *     tags:
 *       - abacus
 *     summary: Calculate manufacturing batch
 *     description: Calculates a complete manufacturing batch analysis including Bill of Materials, Production Routing, and Market Analysis
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               orderDTOs:
 *                 type: array
 *                 items:
 *                   type: object
 *                 description: Array of manufacturing orders
 *               stationIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of station IDs for market analysis
 *     responses:
 *       200:
 *         description: Manufacturing batch calculation results
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       400:
 *         description: Bad request - invalid input data
 *       404:
 *         description: Not found
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  return withErrorHandling(request, async () => {
    console.log('Abacus ManufBatch route called');
    
    const body = await request.json();
    
    console.log('Abacus ManufBatch request:', {
      url: `${BACKEND_BASE_URL}/api/Abacus/ManufBatch`,
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/Abacus/ManufBatch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend Abacus ManufBatch response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend Abacus ManufBatch error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Abacus ManufBatch response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  });
} 
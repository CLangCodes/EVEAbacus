import { NextRequest, NextResponse } from 'next/server';

const BACKEND_BASE_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * @openapi
 * /api/calculator/manufacturing-batch:
 *   post:
 *     tags:
 *       - calculator
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
 *                   type: integer
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
 *       500:
 *         description: Internal server error
 */
export async function POST(request: NextRequest) {
  try {
    console.log('Manufacturing batch route called');
    console.log('BACKEND_BASE_URL:', BACKEND_BASE_URL);
    console.log('Environment variables:', {
      BACKEND_URL: process.env.BACKEND_URL,
      NODE_ENV: process.env.NODE_ENV
    });

    const body = await request.json();
    
    console.log('Manufacturing batch request:', {
      url: `${BACKEND_BASE_URL}/api/v1.0/calculator/manufacturing-batch`,
      method: 'POST',
      body: JSON.stringify(body, null, 2)
    });

    const response = await fetch(`${BACKEND_BASE_URL}/api/v1.0/calculator/manufacturing-batch`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      console.error('Backend response error:', {
        status: response.status,
        statusText: response.statusText,
        url: response.url
      });
      
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      
      return NextResponse.json(
        { error: `Backend request failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    
    console.log('Manufacturing batch response:', {
      status: response.status,
      data: JSON.stringify(data, null, 2)
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error('Manufacturing batch API error:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { error: 'Internal server error', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
} 
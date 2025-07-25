import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/calculator/market-hubs:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Get market hubs
 *     description: Returns a list of market hub station names that can be used for market analysis
 *     responses:
 *       200:
 *         description: List of market hub names
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 requestId:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    console.log('Getting market hubs');
    
    try {
      const marketHubs = await backendService.getMarketHubs();
      console.log('Backend market hubs result:', marketHubs);
      
      // Ensure we return an array even if the backend returns unexpected data
      const hubs = Array.isArray(marketHubs) ? marketHubs : [];
      console.log('Final market hubs result:', hubs);
      
      if (hubs.length === 0) {
        throw new ApiError(404, 'No market hubs found');
      }
      
      return hubs;
    } catch (error) {
      console.error('Error in market hubs route:', error);
      console.error('Error details:', {
        message: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : 'No stack trace',
        name: error instanceof Error ? error.name : 'Unknown error type'
      });
      throw error;
    }
  });
} 
import { NextRequest } from 'next/server';
import { ApiError, withDetailedLogging } from '../../../../lib/middleware';
import { rateLimit } from '../../../../lib/rateLimit';
import { backendService } from '../../../../lib/backendService';
import { withCache } from '../../../../lib/cache';

/**
 * @openapi
 * /api/pihelper/planet-types:
 *   get:
 *     tags:
 *       - pihelper
 *     summary: Get available planet types
 *     description: Retrieves a list of all available planet types for PI planning
 *     responses:
 *       200:
 *         description: List of planet types
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
 *                 requestId:
 *                   type: string
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  // Rate limit: 10 requests per minute per IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip, { windowMs: 60_000, max: 10 })) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }

  return withDetailedLogging(req, async () => {
    const cacheKey = 'planet-types';
    
    const results = await withCache(cacheKey, 3600, async () => {
      return await backendService.getPlanetTypes();
    });
    
    // Ensure we return an array even if the backend returns unexpected data
    const planetTypes = Array.isArray(results) ? results : [];
    
    return planetTypes;
  }, {
    logRequestBody: false, // GET request, no body
    logResponseBody: false, // Don't log the full response for privacy
  });
} 
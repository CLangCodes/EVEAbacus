import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { withCache } from '../../../../lib/cache';
import { rateLimit } from '../../../../lib/rateLimit';
import { backendService } from '../../../../lib/backendService';
import { PIPlannerRequestSchema, validateRequest } from '../../../../lib/schemas';

/**
 * @openapi
 * components:
 *   schemas:
 *     PIPlannerRequest:
 *       type: object
 *       required:
 *         - focalSystemName
 *         - range
 *       properties:
 *         focalSystemName:
 *           type: string
 *           description: The central system name for the search
 *         range:
 *           type: number
 *           description: Jump range from the focal system
 *         securityStatus:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of security status filters (optional, defaults to all)
 *         planetTypes:
 *           type: array
 *           items:
 *             type: string
 *           description: Array of planet type filters (optional, defaults to all)
 *         pageNumber:
 *           type: number
 *           description: Page number for pagination
 *         pageSize:
 *           type: number
 *           description: Number of items per page
 *     Planet:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *         solarSystem:
 *           type: string
 *         constellation:
 *           type: string
 *         region:
 *           type: string
 *         planetType:
 *           type: string
 *         security:
 *           type: number
 *           nullable: true
 *         radius:
 *           type: number
 *         minLinkPowerGrid:
 *           type: number
 *         minLinkCPU:
 *           type: number
 *     PaginatedResponse:
 *       type: object
 *       properties:
 *         items:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Planet'
 *         totalCount:
 *           type: number
 *         pageNumber:
 *           type: number
 *         pageSize:
 *           type: number
 *         totalPages:
 *           type: number
 *         hasPreviousPage:
 *           type: boolean
 *         hasNextPage:
 *           type: boolean
 */

/**
 * @openapi
 * /api/pihelper/planets:
 *   post:
 *     tags:
 *       - pihelper
 *     summary: Get planets for PI planning
 *     description: Retrieves a paginated list of planets based on PI planning criteria
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - focalSystemName
 *               - range
 *             properties:
 *               focalSystemName:
 *                 type: string
 *                 description: The central system name for the search
 *                 minLength: 1
 *               range:
 *                 type: number
 *                 description: Jump range from the focal system
 *                 minimum: 0
 *                 maximum: 20
 *               securityStatus:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of security status filters (optional, defaults to all)
 *               planetTypes:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of planet type filters (optional, defaults to all)
 *               pageNumber:
 *                 type: number
 *                 description: Page number for pagination
 *                 minimum: 1
 *                 default: 1
 *               pageSize:
 *                 type: number
 *                 description: Number of items per page
 *                 minimum: 1
 *                 maximum: 100
 *                 default: 10
 *     responses:
 *       200:
 *         description: Paginated list of planets
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Planet'
 *                     totalCount:
 *                       type: number
 *                     pageNumber:
 *                       type: number
 *                     pageSize:
 *                       type: number
 *                     totalPages:
 *                       type: number
 *                     hasPreviousPage:
 *                       type: boolean
 *                     hasNextPage:
 *                       type: boolean
 *                 timestamp:
 *                   type: string
 *                 requestId:
 *                   type: string
 *       400:
 *         description: Bad request - invalid request body
 *       429:
 *         description: Too many requests
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  // Rate limit: 10 requests per minute per IP
  const ip = req.headers.get('x-forwarded-for') || 'unknown';
  if (rateLimit(ip, { windowMs: 60_000, max: 10 })) {
    throw new ApiError(429, 'Too many requests. Please try again later.');
  }

  return withErrorHandling(req, async () => {
    // Validate request body using Zod
    let validatedRequest;
    try {
      const body = await req.json();
      console.log('Planets API - Raw request body:', body);
      validatedRequest = validateRequest(PIPlannerRequestSchema, body);
      console.log('Planets API - Validated request:', validatedRequest);
    } catch (error) {
      console.error('Planets API - Validation error:', error);
      if (error instanceof Error) {
        throw new ApiError(400, error.message);
      }
      throw new ApiError(400, 'Invalid request body');
    }

    // Generate cache key based on validated request
    const cacheKey = `planets:${JSON.stringify(validatedRequest)}`;
    
    return withCache(cacheKey, 300, async () => { // Cache for 5 minutes
      // Provide defaults for empty arrays and map to backend format
      const requestWithDefaults = {
        focalSystemName: validatedRequest.focalSystemName,
        range: validatedRequest.range,
        securityStatus: validatedRequest.securityStatus.length > 0 
          ? validatedRequest.securityStatus 
          : ['High Sec', 'Low Sec', 'Null Sec'],
        planetTypes: validatedRequest.planetTypes.length > 0 
          ? validatedRequest.planetTypes.map(type => `Planet (${type})`)
          : ['Planet (Barren)', 'Planet (Gas)', 'Planet (Ice)', 'Planet (Lava)', 'Planet (Oceanic)', 'Planet (Plasma)', 'Planet (Storm)', 'Planet (Temperate)'],
        pageNumber: validatedRequest.pageNumber || 1,
        pageSize: validatedRequest.pageSize || 25
      };
      
      console.log('Planets API - Request to backend:', requestWithDefaults);
      
      const backendResponse = await backendService.getPlanets(requestWithDefaults);
      console.log('Planets API - Backend response:', backendResponse);
      
      return backendResponse;
    });
  });
} 
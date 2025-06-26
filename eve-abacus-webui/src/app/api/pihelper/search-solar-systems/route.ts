import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';
import { SearchQuerySchema, validateRequest } from '../../../../lib/schemas';

/**
 * @openapi
 * /api/pihelper/search-solar-systems:
 *   get:
 *     tags:
 *       - pihelper
 *     summary: Search for solar system names
 *     description: Searches for solar system names that match the provided query term
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           minLength: 1
 *           maxLength: 100
 *         description: The search term to filter solar systems
 *         required: true
 *     responses:
 *       200:
 *         description: List of matching solar system names
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
 *       400:
 *         description: Bad request - invalid query parameters
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    // Validate query parameters using Zod
    let validatedQuery;
    
    try {
      const { searchParams } = new URL(req.url);
      const queryParams: Record<string, string> = {};
      searchParams.forEach((value, key) => {
        queryParams[key] = value;
      });
      
      validatedQuery = validateRequest(SearchQuerySchema, queryParams);
    } catch (error) {
      if (error instanceof Error) {
        throw new ApiError(400, error.message);
      }
      throw new ApiError(400, 'Invalid query parameters');
    }

    try {
      const results = await backendService.searchSolarSystems(validatedQuery.searchTerm);
      const solarSystems = Array.isArray(results) ? results : [];
      return solarSystems;
    } catch (err) {
      console.error('Error in backendService.searchSolarSystems:', err);
      throw new ApiError(500, 'Internal server error: ' + (err instanceof Error ? err.message : String(err)));
    }
  });
} 
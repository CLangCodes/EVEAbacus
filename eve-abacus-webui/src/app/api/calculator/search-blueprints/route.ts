import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/v1.0/calculator/search-blueprints:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Search for blueprints by name
 *     description: Performs a search across all blueprints and returns matching names for autocomplete functionality
 *     parameters:
 *       - in: query
 *         name: searchTerm
 *         schema:
 *           type: string
 *           minLength: 2
 *           maxLength: 100
 *         description: Search term for blueprint names (minimum 2 characters)
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
 *       400:
 *         description: Bad request - invalid query parameters
 *       404:
 *         description: No blueprints found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const { searchParams } = new URL(req.url);
    const searchTerm = searchParams.get('searchTerm');

    if (!searchTerm || searchTerm.length < 2) {
      throw new ApiError(400, 'Search term must be at least 2 characters long');
    }

    console.log('Blueprint search query:', searchTerm);
    const results = await backendService.searchBlueprints(searchTerm);
    console.log('Backend blueprint search results:', results);
    
    // Ensure we return an array even if the backend returns unexpected data
    const blueprints = Array.isArray(results) ? results : [];
    console.log('Final blueprint search results:', blueprints);
    
    if (blueprints.length === 0) {
      throw new ApiError(404, 'No blueprints found matching the search term');
    }
    
    return blueprints;
  });
} 
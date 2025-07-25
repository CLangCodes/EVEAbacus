import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/calculator/validate-blueprint:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Validate blueprint and get both TypeIDs
 *     description: Combines blueprint validation and product lookup in a single call
 *     parameters:
 *       - in: query
 *         name: blueprintName
 *         schema:
 *           type: string
 *         description: Exact name of the blueprint (case-sensitive)
 *         required: true
 *       - in: query
 *         name: activityId
 *         schema:
 *           type: integer
 *         description: Activity ID (1 = Manufacturing, 8 = Invention, etc.)
 *         required: true
 *     responses:
 *       200:
 *         description: Blueprint validation result
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 blueprintName:
 *                   type: string
 *                 blueprintTypeId:
 *                   type: integer
 *                 productTypeId:
 *                   type: integer
 *                 activityId:
 *                   type: integer
 *       400:
 *         description: Bad request - invalid parameters
 *       404:
 *         description: Blueprint not found or no product for activity
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const { searchParams } = new URL(req.url);
    const blueprintName = searchParams.get('blueprintName');
    const activityId = searchParams.get('activityId');

    if (!blueprintName) {
      throw new ApiError(400, 'Blueprint name is required');
    }

    if (!activityId) {
      throw new ApiError(400, 'Activity ID is required');
    }

    const actId = parseInt(activityId);
    if (isNaN(actId)) {
      throw new ApiError(400, 'Activity ID must be a valid integer');
    }

    console.log('Blueprint validation for:', blueprintName, 'activity:', actId);
    const validation = await backendService.validateBlueprint(blueprintName, actId);
    console.log('Backend blueprint validation result:', validation);
    
    return validation;
  });
} 
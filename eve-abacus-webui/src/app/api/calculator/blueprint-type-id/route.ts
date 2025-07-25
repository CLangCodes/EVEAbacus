import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/calculator/blueprint-type-id:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Get blueprint TypeID by name
 *     description: Retrieves the TypeID of a blueprint using its exact name
 *     parameters:
 *       - in: query
 *         name: blueprintName
 *         schema:
 *           type: string
 *         description: Exact name of the blueprint (case-sensitive)
 *         required: true
 *     responses:
 *       200:
 *         description: Blueprint TypeID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       400:
 *         description: Bad request - missing blueprint name
 *       404:
 *         description: Blueprint not found
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const { searchParams } = new URL(req.url);
    const blueprintName = searchParams.get('blueprintName');

    if (!blueprintName) {
      throw new ApiError(400, 'Blueprint name is required');
    }

    console.log('Blueprint TypeID lookup for:', blueprintName);
    const typeId = await backendService.getBlueprintTypeId(blueprintName);
    console.log('Backend blueprint TypeID result:', typeId);
    
    return typeId;
  });
} 
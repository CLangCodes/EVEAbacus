import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/v1.0/calculator/product-type-id:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Get product TypeID by blueprint TypeID and activity
 *     description: Retrieves the TypeID of the product manufactured by a blueprint for the specified activity
 *     parameters:
 *       - in: query
 *         name: blueprintTypeId
 *         schema:
 *           type: integer
 *         description: TypeID of the blueprint
 *         required: true
 *       - in: query
 *         name: activityId
 *         schema:
 *           type: integer
 *         description: Activity ID (1 = Manufacturing, 8 = Invention, etc.)
 *         required: true
 *     responses:
 *       200:
 *         description: Product TypeID
 *         content:
 *           application/json:
 *             schema:
 *               type: integer
 *       400:
 *         description: Bad request - invalid parameters
 *       404:
 *         description: No product found for this blueprint
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const { searchParams } = new URL(req.url);
    const blueprintTypeId = searchParams.get('blueprintTypeId');
    const activityId = searchParams.get('activityId');

    if (!blueprintTypeId || !activityId) {
      throw new ApiError(400, 'Blueprint TypeID and Activity ID are required');
    }

    const bpTypeId = parseInt(blueprintTypeId);
    const actId = parseInt(activityId);

    if (isNaN(bpTypeId) || bpTypeId <= 0) {
      throw new ApiError(400, 'Blueprint TypeID must be a positive integer');
    }

    if (isNaN(actId)) {
      throw new ApiError(400, 'Activity ID must be a valid integer');
    }

    console.log('Product TypeID lookup for blueprint:', bpTypeId, 'activity:', actId);
    const productTypeId = await backendService.getProductTypeId(bpTypeId, actId);
    console.log('Backend product TypeID result:', productTypeId);
    
    return productTypeId;
  });
} 
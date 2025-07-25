import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/calculator/invention-skills:
 *   get:
 *     tags:
 *       - calculator
 *     summary: Get invention skills
 *     description: Returns a list of R&D skills that can be used for blueprint invention calculations
 *     responses:
 *       200:
 *         description: List of invention skill names
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    console.log('Getting invention skills');
    const inventionSkills = await backendService.getInventionSkills();
    console.log('Backend invention skills result:', inventionSkills);
    
    // Ensure we return an array even if the backend returns unexpected data
    const skills = Array.isArray(inventionSkills) ? inventionSkills : [];
    console.log('Final invention skills result:', skills);
    
    if (skills.length === 0) {
      throw new ApiError(404, 'No invention skills found');
    }
    
    return skills;
  });
} 
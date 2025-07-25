import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/calculator/invention-suggestions:
 *   post:
 *     tags:
 *       - calculator
 *     summary: Get invention suggestions based on skills
 *     description: Analyzes the provided invention skill names and returns a list of blueprints suitable for invention. Requires at least 3 skills to be provided.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               type: string
 *             minItems: 3
 *           example: ["Science", "Research", "Metallurgy", "Electronic Engineering"]
 *     responses:
 *       200:
 *         description: List of blueprint names suitable for invention
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *       400:
 *         description: Bad request - invalid skill array (must be at least 3 skills)
 *       404:
 *         description: No suitable blueprints found
 *       500:
 *         description: Internal server error
 */
export async function POST(req: NextRequest) {
  return withErrorHandling(req, async () => {
    let inventionSkills: string[];
    
    try {
      inventionSkills = await req.json();
    } catch {
      throw new ApiError(400, 'Invalid JSON in request body');
    }

    if (!Array.isArray(inventionSkills) || inventionSkills.length < 3) {
      throw new ApiError(400, 'At least 3 invention skills are required');
    }

    // Validate that all items are non-empty strings
    if (!inventionSkills.every(skill => typeof skill === 'string' && skill.trim().length > 0)) {
      throw new ApiError(400, 'All invention skills must be non-empty strings');
    }

    console.log('Getting invention suggestions for skills:', inventionSkills);
    const suggestions = await backendService.getInventionSuggestions(inventionSkills);
    console.log('Backend invention suggestions result:', suggestions);
    
    // Ensure we return an array even if the backend returns unexpected data
    const results = Array.isArray(suggestions) ? suggestions : [];
    console.log('Final invention suggestions result:', results);
    
    if (results.length === 0) {
      throw new ApiError(404, 'No suitable blueprints found for the given skill combination');
    }
    
    return results;
  });
} 
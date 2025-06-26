import { NextRequest } from 'next/server';
import { withErrorHandling, ApiError } from '../../../../lib/middleware';
import { redisCache } from '../../../../lib/redisCache';

/**
 * @openapi
 * /api/monitoring/cache:
 *   get:
 *     tags:
 *       - System
 *     summary: Get cache statistics and health
 *     description: Returns Redis cache statistics, health status, and memory usage
 *     responses:
 *       200:
 *         description: Cache statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 connected:
 *                   type: boolean
 *                 memory:
 *                   type: object
 *                 info:
 *                   type: object
 *                 timestamp:
 *                   type: string
 *       500:
 *         description: Internal server error
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const stats = await redisCache.getStats();
    const health = await redisCache.healthCheck();
    
    return {
      connected: health,
      memory: stats.memory,
      info: stats.info,
      timestamp: new Date().toISOString(),
    };
  });
}

export async function DELETE(req: NextRequest) {
  return withErrorHandling(req, async () => {
    // Basic authorization check
    const authHeader = req.headers.get('authorization');
    const apiKey = process.env.ADMIN_API_KEY || 'admin-secret-key';
    
    if (!authHeader || authHeader !== `Bearer ${apiKey}`) {
      throw new ApiError(401, 'Unauthorized - Admin access required');
    }
    
    let pattern: string | undefined;
    
    try {
      const body = await req.json();
      pattern = body.pattern;
    } catch {
      // No body provided, will clear all cache
    }
    
    await redisCache.flush(pattern);
    
    return {
      success: true,
      message: pattern ? `Cache cleared for pattern: ${pattern}` : 'All cache cleared',
      timestamp: new Date().toISOString(),
    };
  });
} 
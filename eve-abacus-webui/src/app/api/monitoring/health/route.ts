import { NextRequest } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';
import { backendService } from '../../../../lib/backendService';

/**
 * @openapi
 * /api/monitoring/health:
 *   get:
 *     tags:
 *       - System
 *     summary: Health check endpoint
 *     description: Returns the health status of the API service and backend database
 *     responses:
 *       200:
 *         description: Service is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 backendStatus:
 *                   type: string
 *                   example: ok
 *                 dbStatus:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 version:
 *                   type: string
 *                   example: 1.0.0
 *       503:
 *         description: Service unhealthy
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    // Check backend API health using circuit breaker
    let backendStatus = 'unknown';
    let dbStatus = 'unknown';
    
    try {
      // Check basic backend health
      const backendHealth = await backendService.checkHealth();
      backendStatus = backendHealth.status || 'unknown';
      
      // Check database health
      const dbHealth = await backendService.checkDatabaseHealth();
      dbStatus = dbHealth.status || 'unknown';
    } catch {
      backendStatus = 'error';
      dbStatus = 'error';
    }

    return {
      status: 'ok',
      backendStatus,
      dbStatus,
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  });
} 
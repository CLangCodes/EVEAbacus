import { NextRequest } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';
import { circuitBreakerRegistry } from '../../../../lib/circuitBreaker';

/**
 * @openapi
 * /api/monitoring/circuit-breakers:
 *   get:
 *     tags:
 *       - System
 *     summary: Get circuit breaker status
 *     description: Returns the status of all circuit breakers for monitoring and debugging
 *     responses:
 *       200:
 *         description: Circuit breaker status
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 circuitBreakers:
 *                   type: object
 *                   additionalProperties:
 *                     type: object
 *                     properties:
 *                       state:
 *                         type: string
 *                         enum: [CLOSED, OPEN, HALF_OPEN]
 *                       failureCount:
 *                         type: number
 *                       successCount:
 *                         type: number
 *                       totalRequests:
 *                         type: number
 *                       failureRate:
 *                         type: number
 *                       lastFailureTime:
 *                         type: string
 *                         format: date-time
 *                       lastSuccessTime:
 *                         type: string
 *                         format: date-time
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const stats = circuitBreakerRegistry.getStats();
    
    return {
      circuitBreakers: stats,
      timestamp: new Date().toISOString(),
    };
  });
} 
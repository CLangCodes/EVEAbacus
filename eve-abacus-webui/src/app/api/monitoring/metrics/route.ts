import { NextRequest } from 'next/server';
import { withErrorHandling } from '../../../../lib/middleware';
import { performanceMonitor } from '../../../../lib/performance';

/**
 * @openapi
 * /api/monitoring/metrics:
 *   get:
 *     tags:
 *       - System
 *     summary: Get API performance metrics
 *     description: Returns detailed performance metrics for all API endpoints
 *     responses:
 *       200:
 *         description: Performance metrics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 overall:
 *                   type: object
 *                   properties:
 *                     totalRequests:
 *                       type: number
 *                     totalErrors:
 *                       type: number
 *                     averageResponseTime:
 *                       type: number
 *                     activeEndpoints:
 *                       type: number
 *                 endpoints:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       endpoint:
 *                         type: string
 *                       method:
 *                         type: string
 *                       count:
 *                         type: number
 *                       averageTime:
 *                         type: number
 *                       errorCount:
 *                         type: number
 *                 alerts:
 *                   type: object
 *                   properties:
 *                     slowEndpoints:
 *                       type: array
 *                     highErrorEndpoints:
 *                       type: array
 *                     inactiveEndpoints:
 *                       type: array
 */
export async function GET(req: NextRequest) {
  return withErrorHandling(req, async () => {
    const metrics = performanceMonitor.getMetrics();
    const overallStats = performanceMonitor.getOverallStats();
    const slowEndpoints = performanceMonitor.getSlowEndpoints(1000); // > 1 second
    const highErrorEndpoints = performanceMonitor.getHighErrorEndpoints(0.1); // > 10% error rate
    const inactiveEndpoints = performanceMonitor.getInactiveEndpoints(60); // > 1 hour inactive

    return {
      overall: overallStats,
      endpoints: metrics.map(metric => ({
        endpoint: metric.endpoint,
        method: metric.method,
        count: metric.count,
        averageTime: Math.round(metric.averageTime),
        minTime: metric.minTime,
        maxTime: metric.maxTime,
        errorCount: metric.errorCount,
        errorRate: metric.count > 0 ? (metric.errorCount / metric.count * 100).toFixed(2) + '%' : '0%',
        lastRequest: metric.lastRequest,
      })),
      alerts: {
        slowEndpoints: slowEndpoints.map(metric => ({
          endpoint: metric.endpoint,
          method: metric.method,
          averageTime: Math.round(metric.averageTime),
        })),
        highErrorEndpoints: highErrorEndpoints.map(metric => ({
          endpoint: metric.endpoint,
          method: metric.method,
          errorRate: (metric.errorCount / metric.count * 100).toFixed(2) + '%',
        })),
        inactiveEndpoints: inactiveEndpoints.map(metric => ({
          endpoint: metric.endpoint,
          method: metric.method,
          lastRequest: metric.lastRequest,
        })),
      },
      timestamp: new Date().toISOString(),
    };
  });
} 
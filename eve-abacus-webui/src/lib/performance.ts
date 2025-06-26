interface PerformanceMetric {
  endpoint: string;
  method: string;
  count: number;
  totalTime: number;
  averageTime: number;
  minTime: number;
  maxTime: number;
  lastRequest: Date;
  errorCount: number;
}

interface PerformanceSnapshot {
  timestamp: Date;
  metrics: Map<string, PerformanceMetric>;
  totalRequests: number;
  totalErrors: number;
  averageResponseTime: number;
}

class PerformanceMonitor {
  private metrics = new Map<string, PerformanceMetric>();
  private snapshots: PerformanceSnapshot[] = [];
  private readonly maxSnapshots = 100; // Keep last 100 snapshots

  private getMetricKey(method: string, endpoint: string): string {
    return `${method}:${endpoint}`;
  }

  recordRequest(method: string, endpoint: string, responseTime: number, isError: boolean = false): void {
    const key = this.getMetricKey(method, endpoint);
    const now = new Date();

    let metric = this.metrics.get(key);
    if (!metric) {
      metric = {
        endpoint,
        method,
        count: 0,
        totalTime: 0,
        averageTime: 0,
        minTime: responseTime,
        maxTime: responseTime,
        lastRequest: now,
        errorCount: 0,
      };
      this.metrics.set(key, metric);
    }

    // Update metrics
    metric.count++;
    metric.totalTime += responseTime;
    metric.averageTime = metric.totalTime / metric.count;
    metric.minTime = Math.min(metric.minTime, responseTime);
    metric.maxTime = Math.max(metric.maxTime, responseTime);
    metric.lastRequest = now;

    if (isError) {
      metric.errorCount++;
    }
  }

  getMetrics(): PerformanceMetric[] {
    return Array.from(this.metrics.values());
  }

  getMetric(method: string, endpoint: string): PerformanceMetric | undefined {
    const key = this.getMetricKey(method, endpoint);
    return this.metrics.get(key);
  }

  getOverallStats(): {
    totalRequests: number;
    totalErrors: number;
    averageResponseTime: number;
    activeEndpoints: number;
  } {
    let totalRequests = 0;
    let totalErrors = 0;
    let totalTime = 0;

    for (const metric of this.metrics.values()) {
      totalRequests += metric.count;
      totalErrors += metric.errorCount;
      totalTime += metric.totalTime;
    }

    return {
      totalRequests,
      totalErrors,
      averageResponseTime: totalRequests > 0 ? totalTime / totalRequests : 0,
      activeEndpoints: this.metrics.size,
    };
  }

  takeSnapshot(): PerformanceSnapshot {
    const stats = this.getOverallStats();
    const snapshot: PerformanceSnapshot = {
      timestamp: new Date(),
      metrics: new Map(this.metrics),
      totalRequests: stats.totalRequests,
      totalErrors: stats.totalErrors,
      averageResponseTime: stats.averageResponseTime,
    };

    this.snapshots.push(snapshot);

    // Keep only the last maxSnapshots
    if (this.snapshots.length > this.maxSnapshots) {
      this.snapshots = this.snapshots.slice(-this.maxSnapshots);
    }

    return snapshot;
  }

  getSnapshots(): PerformanceSnapshot[] {
    return [...this.snapshots];
  }

  getRecentSnapshots(count: number = 10): PerformanceSnapshot[] {
    return this.snapshots.slice(-count);
  }

  clearMetrics(): void {
    this.metrics.clear();
  }

  clearSnapshots(): void {
    this.snapshots = [];
  }

  // Performance alerts
  getSlowEndpoints(threshold: number = 1000): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(
      metric => metric.averageTime > threshold
    );
  }

  getHighErrorEndpoints(threshold: number = 0.1): PerformanceMetric[] {
    return Array.from(this.metrics.values()).filter(
      metric => metric.count > 0 && (metric.errorCount / metric.count) > threshold
    );
  }

  getInactiveEndpoints(maxAgeMinutes: number = 60): PerformanceMetric[] {
    const cutoff = new Date(Date.now() - maxAgeMinutes * 60 * 1000);
    return Array.from(this.metrics.values()).filter(
      metric => metric.lastRequest < cutoff
    );
  }
}

export const performanceMonitor = new PerformanceMonitor();

// Auto-snapshot every 5 minutes
setInterval(() => {
  performanceMonitor.takeSnapshot();
}, 5 * 60 * 1000); 
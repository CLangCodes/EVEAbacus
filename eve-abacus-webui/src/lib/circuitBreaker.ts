export enum CircuitState {
  CLOSED = 'CLOSED',    // Normal operation - requests flow through
  OPEN = 'OPEN',        // Circuit is open - requests fail fast
  HALF_OPEN = 'HALF_OPEN' // Testing if service is back
}

export interface CircuitBreakerOptions {
  failureThreshold: number;     // Number of failures before opening circuit
  recoveryTimeout: number;      // Time to wait before trying HALF_OPEN (ms)
  expectedResponseTime: number; // Expected response time (ms)
  monitorWindow: number;        // Time window for failure counting (ms)
}

export interface CircuitBreakerStats {
  state: CircuitState;
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  totalRequests: number;
  failureRate: number;
}

class CircuitBreaker {
  private state: CircuitState = CircuitState.CLOSED;
  private failureCount: number = 0;
  private successCount: number = 0;
  private lastFailureTime?: Date;
  private lastSuccessTime?: Date;
  private lastStateChange: Date = new Date();
  private totalRequests: number = 0;

  constructor(
    private readonly name: string,
    private readonly options: CircuitBreakerOptions = {
      failureThreshold: 5,
      recoveryTimeout: 30000, // 30 seconds
      expectedResponseTime: 5000, // 5 seconds
      monitorWindow: 60000, // 1 minute
    }
  ) {}

  async execute<T>(
    operation: () => Promise<T>,
    fallback?: () => T | Promise<T>
  ): Promise<T> {
    this.totalRequests++;

    // Check if circuit is open
    if (this.state === CircuitState.OPEN) {
      const timeSinceLastFailure = Date.now() - (this.lastFailureTime?.getTime() || 0);
      
      if (timeSinceLastFailure >= this.options.recoveryTimeout) {
        this.transitionToHalfOpen();
      } else {
        // Circuit is still open, return fallback or throw error
        if (fallback) {
          return await fallback();
        }
        throw new Error(`Circuit breaker '${this.name}' is OPEN. Service unavailable.`);
      }
    }

    // Check if circuit is half-open (limit concurrent requests)
    if (this.state === CircuitState.HALF_OPEN) {
      // Allow only one request in half-open state
      if (this.totalRequests % 2 !== 0) {
        if (fallback) {
          return await fallback();
        }
        throw new Error(`Circuit breaker '${this.name}' is HALF_OPEN. Service testing.`);
      }
    }

    try {
      const startTime = Date.now();
      const result = await operation();
      const responseTime = Date.now() - startTime;

      // Check if response time is acceptable
      if (responseTime > this.options.expectedResponseTime) {
        this.recordFailure();
        throw new Error(`Response time too slow: ${responseTime}ms`);
      }

      this.recordSuccess();
      return result;
    } catch (error) {
      this.recordFailure();
      throw error;
    }
  }

  private recordSuccess(): void {
    this.successCount++;
    this.lastSuccessTime = new Date();
    this.failureCount = 0; // Reset failure count on success

    if (this.state === CircuitState.HALF_OPEN) {
      this.transitionToClosed();
    }
  }

  private recordFailure(): void {
    this.failureCount++;
    this.lastFailureTime = new Date();

    // Check if we should open the circuit
    if (this.state === CircuitState.CLOSED && this.failureCount >= this.options.failureThreshold) {
      this.transitionToOpen();
    } else if (this.state === CircuitState.HALF_OPEN) {
      // If we fail in half-open state, go back to open
      this.transitionToOpen();
    }
  }

  private transitionToOpen(): void {
    this.state = CircuitState.OPEN;
    this.lastStateChange = new Date();
    console.warn(`Circuit breaker '${this.name}' is now OPEN due to ${this.failureCount} failures`);
  }

  private transitionToHalfOpen(): void {
    this.state = CircuitState.HALF_OPEN;
    this.lastStateChange = new Date();
    console.info(`Circuit breaker '${this.name}' is now HALF_OPEN - testing service recovery`);
  }

  private transitionToClosed(): void {
    this.state = CircuitState.CLOSED;
    this.lastStateChange = new Date();
    this.failureCount = 0;
    console.info(`Circuit breaker '${this.name}' is now CLOSED - service recovered`);
  }

  getStats(): CircuitBreakerStats {
    return {
      state: this.state,
      failureCount: this.failureCount,
      successCount: this.successCount,
      lastFailureTime: this.lastFailureTime,
      lastSuccessTime: this.lastSuccessTime,
      totalRequests: this.totalRequests,
      failureRate: this.totalRequests > 0 ? (this.failureCount / this.totalRequests) * 100 : 0,
    };
  }

  reset(): void {
    this.state = CircuitState.CLOSED;
    this.failureCount = 0;
    this.successCount = 0;
    this.lastFailureTime = undefined;
    this.lastSuccessTime = undefined;
    this.lastStateChange = new Date();
    console.info(`Circuit breaker '${this.name}' has been reset`);
  }

  isOpen(): boolean {
    return this.state === CircuitState.OPEN;
  }

  isHalfOpen(): boolean {
    return this.state === CircuitState.HALF_OPEN;
  }

  isClosed(): boolean {
    return this.state === CircuitState.CLOSED;
  }
}

// Global circuit breaker registry
class CircuitBreakerRegistry {
  private breakers = new Map<string, CircuitBreaker>();

  getBreaker(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
    if (!this.breakers.has(name)) {
      this.breakers.set(name, new CircuitBreaker(name, options));
    }
    return this.breakers.get(name)!;
  }

  getAllBreakers(): Map<string, CircuitBreaker> {
    return new Map(this.breakers);
  }

  resetAll(): void {
    for (const breaker of this.breakers.values()) {
      breaker.reset();
    }
  }

  getStats(): Record<string, CircuitBreakerStats> {
    const stats: Record<string, CircuitBreakerStats> = {};
    for (const [name, breaker] of this.breakers.entries()) {
      stats[name] = breaker.getStats();
    }
    return stats;
  }
}

export const circuitBreakerRegistry = new CircuitBreakerRegistry();

// Convenience function to create a circuit breaker
export function createCircuitBreaker(name: string, options?: CircuitBreakerOptions): CircuitBreaker {
  return circuitBreakerRegistry.getBreaker(name, options);
} 
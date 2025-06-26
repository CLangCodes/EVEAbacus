export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  requestId?: string;
  method?: string;
  url?: string;
  statusCode?: number;
  responseTime?: number;
  userAgent?: string;
  ip?: string;
  error?: string;
  stack?: string;
  metadata?: Record<string, unknown>;
}

class Logger {
  private logLevel: LogLevel = LogLevel.INFO;

  setLogLevel(level: LogLevel): void {
    this.logLevel = level;
  }

  private shouldLog(level: LogLevel): boolean {
    return level >= this.logLevel;
  }

  private formatLog(entry: LogEntry): string {
    const levelName = LogLevel[entry.level];
    const base = `[${entry.timestamp}] [${levelName}] [${entry.requestId || 'N/A'}] ${entry.message}`;
    
    const details = [];
    if (entry.method && entry.url) {
      details.push(`${entry.method} ${entry.url}`);
    }
    if (entry.statusCode) {
      details.push(`Status: ${entry.statusCode}`);
    }
    if (entry.responseTime !== undefined) {
      details.push(`${entry.responseTime}ms`);
    }
    if (entry.ip) {
      details.push(`IP: ${entry.ip}`);
    }
    if (entry.error) {
      details.push(`Error: ${entry.error}`);
    }
    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      details.push(`Metadata: ${JSON.stringify(entry.metadata)}`);
    }

    return details.length > 0 ? `${base} | ${details.join(' | ')}` : base;
  }

  private log(level: LogLevel, message: string, metadata?: Partial<LogEntry>): void {
    if (!this.shouldLog(level)) return;

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      ...metadata,
    };

    const formattedLog = this.formatLog(entry);
    
    switch (level) {
      case LogLevel.DEBUG:
        console.debug(formattedLog);
        break;
      case LogLevel.INFO:
        console.info(formattedLog);
        break;
      case LogLevel.WARN:
        console.warn(formattedLog);
        break;
      case LogLevel.ERROR:
        console.error(formattedLog);
        if (entry.stack) {
          console.error(entry.stack);
        }
        break;
    }
  }

  debug(message: string, metadata?: Partial<LogEntry>): void {
    this.log(LogLevel.DEBUG, message, metadata);
  }

  info(message: string, metadata?: Partial<LogEntry>): void {
    this.log(LogLevel.INFO, message, metadata);
  }

  warn(message: string, metadata?: Partial<LogEntry>): void {
    this.log(LogLevel.WARN, message, metadata);
  }

  error(message: string, metadata?: Partial<LogEntry>): void {
    this.log(LogLevel.ERROR, message, metadata);
  }

  // Convenience methods for API logging
  logRequest(req: Request, requestId: string, ip?: string): void {
    this.info('API Request Started', {
      requestId,
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent') || undefined,
      ip,
    });
  }

  logResponse(req: Request, requestId: string, statusCode: number, responseTime: number, ip?: string): void {
    this.info('API Request Completed', {
      requestId,
      method: req.method,
      url: req.url,
      statusCode,
      responseTime,
      ip,
    });
  }

  logError(req: Request, requestId: string, error: Error, responseTime: number, ip?: string): void {
    this.error('API Request Failed', {
      requestId,
      method: req.method,
      url: req.url,
      error: error.message,
      stack: error.stack,
      responseTime,
      ip,
    });
  }
}

export const logger = new Logger();

// Set log level based on environment
if (process.env.NODE_ENV === 'development') {
  logger.setLogLevel(LogLevel.DEBUG);
} else {
  logger.setLogLevel(LogLevel.INFO);
} 
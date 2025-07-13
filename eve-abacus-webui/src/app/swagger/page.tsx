'use client';
import { useEffect, useRef, useState, useCallback } from 'react';

interface SwaggerUIBundle {
  (config: { 
    url: string; 
    dom_id: string;
    deepLinking?: boolean;
    displayOperationId?: boolean;
    defaultModelsExpandDepth?: number;
    defaultModelExpandDepth?: number;
    displayRequestDuration?: boolean;
    docExpansion?: string;
    filter?: boolean;
    showExtensions?: boolean;
    showCommonExtensions?: boolean;
    tryItOutEnabled?: boolean;
    requestInterceptor?: (request: unknown) => unknown;
    responseInterceptor?: (response: unknown) => unknown;
    theme?: string;
  }): void;
}

interface SwaggerRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: string;
}

interface SwaggerResponse {
  status: number;
  statusText: string;
  url: string;
  body?: string;
}

declare global {
  interface Window {
    SwaggerUIBundle?: SwaggerUIBundle;
  }
}

export default function SwaggerPage() {
  const swaggerRef = useRef<HTMLDivElement>(null);
  const [swaggerInitialized, setSwaggerInitialized] = useState(false);

  // Always apply dark mode
  useEffect(() => {
    document.documentElement.classList.add('dark');
    localStorage.setItem('swagger-theme', 'dark');
  }, []);

  // Inject custom Swagger dark CSS
  useEffect(() => {
    const darkCss = document.createElement('link');
    darkCss.rel = 'stylesheet';
    darkCss.href = '/swagger-dark.css';
    darkCss.id = 'swagger-dark-css';
    document.head.appendChild(darkCss);
    
    return () => {
      if (darkCss) darkCss.remove();
    };
  }, []);

  const initializeSwagger = useCallback(() => {
    if (window.SwaggerUIBundle && !swaggerInitialized) {
      window.SwaggerUIBundle({
        url: '/api/swagger',
        dom_id: '#swagger-ui',
        deepLinking: true,
        displayOperationId: false,
        defaultModelsExpandDepth: 1,
        defaultModelExpandDepth: 1,
        displayRequestDuration: true,
        docExpansion: 'list',
        filter: true,
        showExtensions: true,
        showCommonExtensions: true,
        tryItOutEnabled: true,
        theme: 'dark',
        requestInterceptor: (request: unknown) => {
          console.log('Swagger request:', request);
          return request;
        },
        responseInterceptor: (response: unknown) => {
          console.log('Swagger response:', response);
          return response;
        },
      });
      setSwaggerInitialized(true);
    }
  }, [swaggerInitialized]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.SwaggerUIBundle) {
        initializeSwagger();
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js';
        script.onload = () => {
          if (window.SwaggerUIBundle) {
            initializeSwagger();
          }
        };
        document.body.appendChild(script);
      }
    }
  }, [initializeSwagger]);

  return (
    <div className="min-h-screen transition-colors duration-200 bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-white">
              EVE Abacus API Documentation
            </h1>
            <p className="text-gray-300">
              API documentation for EVE Online manufacturing and production calculations
            </p>
          </div>
        </div>
        
        <div className="rounded-lg shadow-lg transition-colors duration-200 bg-gray-800">
          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
          />
          <div id="swagger-ui" ref={swaggerRef} className="p-4" />
        </div>
        
        <div className="mt-6 text-sm text-gray-400">
          <p>API Version: v1.0</p>
          <p>
            For more information, visit the{' '}
            <a 
              href="https://blazor.eveabacus.com/swaggerComp" 
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              backend Swagger documentation
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
} 
'use client';
import { useEffect, useRef } from 'react';

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
    requestInterceptor?: (request: any) => any;
    responseInterceptor?: (response: any) => any;
  }): void;
}

declare global {
  interface Window {
    SwaggerUIBundle?: SwaggerUIBundle;
  }
}

export default function SwaggerPage() {
  const swaggerRef = useRef<HTMLDivElement>(null);

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
  }, []);

  const initializeSwagger = () => {
    if (window.SwaggerUIBundle) {
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
        requestInterceptor: (request: any) => {
          // Add any request interceptors here if needed
          console.log('Swagger request:', request);
          return request;
        },
        responseInterceptor: (response: any) => {
          // Add any response interceptors here if needed
          console.log('Swagger response:', response);
          return response;
        },
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">EVE Abacus API Documentation</h1>
          <p className="text-gray-600">
            API documentation for EVE Online manufacturing and production calculations
          </p>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg">
          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
          />
          <div id="swagger-ui" ref={swaggerRef} className="p-4" />
        </div>
        
        <div className="mt-6 text-sm text-gray-500">
          <p>API Version: v1.0</p>
          <p>For more information, visit the <a href="https://blazor.eveabacus.com/swaggerComp" className="text-blue-600 hover:text-blue-800">backend Swagger documentation</a>.</p>
        </div>
      </div>
    </div>
  );
} 
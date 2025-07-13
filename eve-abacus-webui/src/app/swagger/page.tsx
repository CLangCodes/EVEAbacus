'use client';
import { useEffect, useRef, useState } from 'react';

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
    theme?: string;
  }): void;
}

declare global {
  interface Window {
    SwaggerUIBundle?: SwaggerUIBundle;
  }
}

export default function SwaggerPage() {
  const swaggerRef = useRef<HTMLDivElement>(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [swaggerInitialized, setSwaggerInitialized] = useState(false);

  // Check for system preference or stored preference
  useEffect(() => {
    const savedTheme = localStorage.getItem('swagger-theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    setIsDarkMode(savedTheme ? savedTheme === 'dark' : systemPrefersDark);
  }, []);

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('swagger-theme', isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // Inject or remove custom Swagger dark CSS
  useEffect(() => {
    let darkCss: HTMLLinkElement | null = null;
    if (isDarkMode) {
      darkCss = document.createElement('link');
      darkCss.rel = 'stylesheet';
      darkCss.href = '/swagger-dark.css';
      darkCss.id = 'swagger-dark-css';
      document.head.appendChild(darkCss);
    } else {
      const existing = document.getElementById('swagger-dark-css');
      if (existing) existing.remove();
    }
    return () => {
      if (darkCss) darkCss.remove();
    };
  }, [isDarkMode]);

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
  }, [isDarkMode, swaggerInitialized]);

  const initializeSwagger = () => {
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
        theme: isDarkMode ? 'dark' : 'light',
        requestInterceptor: (request: any) => {
          console.log('Swagger request:', request);
          return request;
        },
        responseInterceptor: (response: any) => {
          console.log('Swagger response:', response);
          return response;
        },
      });
      setSwaggerInitialized(true);
    }
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    setSwaggerInitialized(false); // Reinitialize Swagger with new theme
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      isDarkMode 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${
              isDarkMode ? 'text-white' : 'text-gray-900'
            }`}>
              EVE Abacus API Documentation
            </h1>
            <p className={`${
              isDarkMode ? 'text-gray-300' : 'text-gray-600'
            }`}>
              API documentation for EVE Online manufacturing and production calculations
            </p>
          </div>
          
          <button
            onClick={toggleDarkMode}
            className={`px-4 py-2 rounded-lg transition-colors duration-200 flex items-center space-x-2 ${
              isDarkMode
                ? 'bg-gray-700 hover:bg-gray-600 text-white'
                : 'bg-white hover:bg-gray-100 text-gray-900 border border-gray-300'
            }`}
            aria-label="Toggle dark mode"
          >
            {isDarkMode ? (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
                <span>Light Mode</span>
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
                <span>Dark Mode</span>
              </>
            )}
          </button>
        </div>
        
        <div className={`rounded-lg shadow-lg transition-colors duration-200 ${
          isDarkMode ? 'bg-gray-800' : 'bg-white'
        }`}>
          <link
            rel="stylesheet"
            href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
          />
          <div id="swagger-ui" ref={swaggerRef} className="p-4" />
        </div>
        
        <div className={`mt-6 text-sm ${
          isDarkMode ? 'text-gray-400' : 'text-gray-500'
        }`}>
          <p>API Version: v1.0</p>
        </div>
      </div>
    </div>
  );
} 
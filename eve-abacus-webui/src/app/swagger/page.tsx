'use client';
import { useEffect, useRef } from 'react';

interface SwaggerUIBundle {
  (config: { url: string; dom_id: string }): void;
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
        window.SwaggerUIBundle({
          url: '/api/swagger',
          dom_id: '#swagger-ui',
        });
      } else {
        const script = document.createElement('script');
        script.src = 'https://unpkg.com/swagger-ui-dist/swagger-ui-bundle.js';
        script.onload = () => {
          if (window.SwaggerUIBundle) {
            window.SwaggerUIBundle({
              url: '/api/swagger',
              dom_id: '#swagger-ui',
            });
          }
        };
        document.body.appendChild(script);
      }
    }
  }, []);

  return (
    <div>
      <link
        rel="stylesheet"
        href="https://unpkg.com/swagger-ui-dist/swagger-ui.css"
      />
      <div id="swagger-ui" ref={swaggerRef} />
    </div>
  );
} 
"use client";

import { useEffect, useRef, useState } from "react";

declare global {
  interface Window {
    RufflePlayer: any;
  }
}

interface RufflePlayerProps {
  className?: string;
}

export default function RufflePlayer({ className = "" }: RufflePlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const container = containerRef.current;

    async function loadRuffle() {
      try {
        if (!container) return;

        setIsLoading(true);
        setError(null);

        // Interceptar todas las peticiones fetch del SWF para redirigir a nuestro proxy
        const originalFetch = window.fetch;
        window.fetch = function (
          input: RequestInfo | URL,
          init?: RequestInit
        ): Promise<Response> {
          const url =
            typeof input === "string"
              ? input
              : input instanceof URL
              ? input.href
              : input.url;

          // Si es una petición a transformice.com/images, redirigir a nuestro proxy
          if (url.includes("transformice.com/images/")) {
            const imagePath = url.split("/images/")[1].split("?")[0]; // Remover query params
            const proxyUrl = `/api/proxy-images/${imagePath}`;
            console.log(`🔄 Redirigiendo: ${url} → ${proxyUrl}`);
            return originalFetch(proxyUrl, init);
          }

          return originalFetch(input, init);
        };

        // También interceptar XMLHttpRequest para compatibilidad con SWF antiguos
        const originalXHROpen = XMLHttpRequest.prototype.open;

        XMLHttpRequest.prototype.open = function (
          method: string,
          url: string | URL,
          async: boolean = true,
          username?: string | null,
          password?: string | null
        ) {
          const urlString = typeof url === "string" ? url : url.toString();

          if (urlString.includes("transformice.com/images/")) {
            const imagePath = urlString.split("/images/")[1].split("?")[0];
            const proxyUrl = `/api/proxy-images/${imagePath}`;
            console.log(`🔄 XHR Redirigiendo: ${urlString} → ${proxyUrl}`);
            return originalXHROpen.call(
              this,
              method,
              proxyUrl,
              async,
              username,
              password
            );
          }

          return originalXHROpen.call(
            this,
            method,
            url,
            async,
            username,
            password
          );
        };

        // Load Ruffle from CDN to avoid WASM loading issues
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@ruffle-rs/ruffle@latest/ruffle.js";
        script.async = true;

        script.onload = () => {
          if (!mounted || !container) return;

          // Create the SWF embed after Ruffle is loaded
          container.innerHTML = `
            <embed
              src="/Transformice.swf"
              width="100%"
              height="600"
              style="display: block;"
            />
          `;

          if (mounted) {
            setIsLoading(false);
          }
        };

        script.onerror = () => {
          if (mounted) {
            setError("Failed to load Ruffle player");
            setIsLoading(false);
          }
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("Error loading Ruffle:", err);
        if (mounted) {
          setError("Failed to load game. Please refresh the page.");
          setIsLoading(false);
        }
      }
    }

    loadRuffle();

    return () => {
      mounted = false;
      if (container) {
        container.innerHTML = "";
      }
    };
  }, []);
  if (error) {
    return (
      <div
        className={`flex items-center justify-center bg-destructive/10 rounded-lg p-8 ${className}`}
      >
        <div className="text-center">
          <p className="text-destructive mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-destructive hover:bg-destructive/90 text-destructive-foreground rounded-md transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-background ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-foreground">Loading game...</p>
          </div>
        </div>
      )}
      <div ref={containerRef} className="w-full h-full min-h-[600px]" />
    </div>
  );
}

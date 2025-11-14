"use client";

import { useEffect, useRef, useState } from "react";

const TRANSFORMICE_HOST =
  process.env.NEXT_PUBLIC_TRANSFORMICE_HOST ?? "15.204.211.244";
const TRANSFORMICE_PORT = Number.parseInt(
  process.env.NEXT_PUBLIC_TRANSFORMICE_PORT ?? "11801",
  10
);
const SOCKET_PROXY_URL =
  process.env.NEXT_PUBLIC_SOCKET_PROXY_URL ?? "ws://localhost:2096";

declare global {
  interface Window {
    RufflePlayer?: {
      config?: Record<string, unknown>;
      [key: string]: unknown;
    };
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

        // Interceptar SOLO peticiones de imágenes para descargarlas automáticamente
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

          // Interceptar SOLO imágenes
          if (url.includes("/images/")) {
            const imagePath = url.split("/images/")[1].split("?")[0];
            const proxyUrl = `/api/proxy-images/${imagePath}`;
            console.log(`🔄 Imagen: ${url} → ${proxyUrl}`);
            return originalFetch(proxyUrl, init);
          }

          // Todo lo demás pasa directo (incluye servidor de juego)
          return originalFetch(input, init);
        };

        // También interceptar XMLHttpRequest para imágenes
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (
          method: string,
          url: string | URL,
          async: boolean = true,
          username?: string | null,
          password?: string | null
        ) {
          const urlString = typeof url === "string" ? url : url.toString();

          // Interceptar SOLO imágenes
          if (urlString.includes("/images/")) {
            const imagePath = urlString.split("/images/")[1].split("?")[0];
            const proxyUrl = `/api/proxy-images/${imagePath}`;
            console.log(`🔄 XHR Imagen: ${urlString} → ${proxyUrl}`);
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

        // Configurar RufflePlayer ANTES de cargar el script
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).RufflePlayer = (window as any).RufflePlayer || {};
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (window as any).RufflePlayer.config = {
          preloader: false,
          warnOnUnsupportedContent: false,
          logLevel: "info",
          autoplay: "on",
          unmuteOverlay: "hidden",
          socketProxy: [
            {
              host: TRANSFORMICE_HOST,
              port: TRANSFORMICE_PORT,
              proxyUrl: SOCKET_PROXY_URL,
            },
          ],
        };

        // Load Ruffle from CDN to avoid WASM loading issues
        const script = document.createElement("script");
        script.src = "https://unpkg.com/@ruffle-rs/ruffle@latest/ruffle.js";
        script.async = true;

        script.onload = () => {
          if (!mounted || !container) return;

          try {
            // Configurar Ruffle siguiendo el patrón de mice2.com
            // Usar el enfoque de ruffle-object (como mice2.com)
            container.innerHTML = `
              <ruffle-object 
                data="/Transformice.swf" 
                type="application/x-shockwave-flash" 
                width="100%" 
                height="100%"
                style="display: block; width: 100%; height: 100%;"
              >
                <param name="wmode" value="direct">
                <param name="allowScriptAccess" value="always">
                <param name="allowfullscreen" value="true">
                <param name="allowfullscreeninteractive" value="true">
                <param name="allownetworkingmode" value="all">
              </ruffle-object>
            `;

            console.log(
              `✅ Ruffle player ready → server ${TRANSFORMICE_HOST}:${TRANSFORMICE_PORT} via ${SOCKET_PROXY_URL}`
            );
            if (mounted) {
              setIsLoading(false);
            }
          } catch (err) {
            console.error("Error configurando Ruffle:", err);
            // Fallback a método antiguo
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

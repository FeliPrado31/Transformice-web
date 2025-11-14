"use client";

import { useEffect, useRef, useState } from "react";

const TRANSFORMICE_HOST =
  process.env.NEXT_PUBLIC_TRANSFORMICE_HOST ?? "15.204.211.244";
const SOCKET_PROXY_URL =
  process.env.NEXT_PUBLIC_SOCKET_PROXY_URL ?? "ws://15.204.211.244:2096";
const PRIMARY_TRANSFORMICE_PORT_RAW = Number.parseInt(
  process.env.NEXT_PUBLIC_TRANSFORMICE_PORT ?? "11801",
  10
);
const PRIMARY_TRANSFORMICE_PORT = Number.isFinite(PRIMARY_TRANSFORMICE_PORT_RAW)
  ? PRIMARY_TRANSFORMICE_PORT_RAW
  : 11801;
const TRANSFORMICE_PORTS = (
  process.env.NEXT_PUBLIC_TRANSFORMICE_PORTS ?? "11801,12801,13801,14801"
)
  .split(",")
  .map((value) => Number.parseInt(value.trim(), 10))
  .filter((port) => Number.isFinite(port) && port > 0);
const SOCKET_PROXY_ENTRIES = (
  TRANSFORMICE_PORTS.length ? TRANSFORMICE_PORTS : [PRIMARY_TRANSFORMICE_PORT]
).map((port) => ({
  host: TRANSFORMICE_HOST,
  port,
  proxyUrl: `${SOCKET_PROXY_URL}?port=${port}`,
}));

const loadRuffleScript = (): Promise<void> =>
  new Promise((resolve, reject) => {
    if (
      document.querySelector("script[data-ruffle]") ||
      window.RufflePlayer?.newest
    ) {
      resolve();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://unpkg.com/@ruffle-rs/ruffle/ruffle.js";
    script.async = false;
    script.setAttribute("data-ruffle", "true");
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Ruffle script"));
    document.head.appendChild(script);
  });

const waitForRuffleFactory = async (
  attempts = 20,
  delayMs = 250
): Promise<(() => RuffleInstance) | undefined> => {
  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const factory = window.RufflePlayer?.newest?.();
    if (factory) {
      return factory.createPlayer;
    }
    await new Promise((resolve) => setTimeout(resolve, delayMs));
  }

  return undefined;
};

type RuffleInstance = HTMLElement & {
  load: (url: string) => void;
};

declare global {
  interface Window {
    RufflePlayer?: {
      config?: Record<string, unknown>;
      newest?: () => {
        createPlayer: () => RuffleInstance;
      };
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
    let player: RuffleInstance | null = null;
    const container = containerRef.current;

    async function loadRuffle() {
      try {
        if (!container) return;

        setIsLoading(true);
        setError(null);

        // Interceptar TODAS las peticiones a transformice.com para descargarlas automáticamente
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

          // Interceptar CUALQUIER petición a transformice.com
          if (url.includes("transformice.com/")) {
            const pathMatch = url.match(/transformice\.com\/(.*?)(?:\?|#|$)/);
            if (pathMatch && pathMatch[1]) {
              const resourcePath = pathMatch[1];
              const proxyUrl = `/api/proxy-images/${resourcePath}`;
              console.log(`🔄 Recurso: ${url} → ${proxyUrl}`);
              return originalFetch(proxyUrl, init);
            }
          }

          // Si es una petición relativa que falla, intentar desde transformice.com
          if (
            !url.startsWith("http") &&
            !url.startsWith("//_next/") &&
            !url.startsWith("/api/")
          ) {
            console.log(
              `🔄 Ruta relativa: ${url} → /api/proxy-images/images/${url}`
            );
            return originalFetch(`/api/proxy-images/images/${url}`, init);
          }

          // Todo lo demás pasa directo
          return originalFetch(input, init);
        };

        // También interceptar XMLHttpRequest para cualquier recurso de transformice.com
        const originalXHROpen = XMLHttpRequest.prototype.open;
        XMLHttpRequest.prototype.open = function (
          method: string,
          url: string | URL,
          async: boolean = true,
          username?: string | null,
          password?: string | null
        ) {
          const urlString = typeof url === "string" ? url : url.toString();

          // Interceptar CUALQUIER petición a transformice.com
          if (urlString.includes("transformice.com/")) {
            const pathMatch = urlString.match(
              /transformice\.com\/(.*?)(?:\?|#|$)/
            );
            if (pathMatch && pathMatch[1]) {
              const resourcePath = pathMatch[1];
              const proxyUrl = `/api/proxy-images/${resourcePath}`;
              console.log(`🔄 XHR Recurso: ${urlString} → ${proxyUrl}`);
              return originalXHROpen.call(
                this,
                method,
                proxyUrl,
                async,
                username,
                password
              );
            }
          }

          // Si es una petición relativa que falla, intentar desde transformice.com
          if (
            !urlString.startsWith("http") &&
            !urlString.startsWith("//_next/") &&
            !urlString.startsWith("/api/")
          ) {
            console.log(
              `🔄 XHR Ruta relativa: ${urlString} → /api/proxy-images/images/${urlString}`
            );
            return originalXHROpen.call(
              this,
              method,
              `/api/proxy-images/images/${urlString}`,
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
        window.RufflePlayer = window.RufflePlayer || {};
        window.RufflePlayer.config = {
          preloader: false,
          warnOnUnsupportedContent: false,
          logLevel: "warn",
          autoplay: "on",
          unmuteOverlay: "hidden",
          letterbox: "fullscreen",
          backgroundColor: "#6a7495",
          contextMenu: false,
          showSwfDownload: false,
          socketProxy: SOCKET_PROXY_ENTRIES,
        };

        await loadRuffleScript();

        if (!mounted || !container) return;

        const createPlayer = await waitForRuffleFactory();
        if (!createPlayer) {
          throw new Error("Ruffle could not initialize");
        }

        player = createPlayer();

        player.style.width = "100%";
        player.style.height = "100%";
        player.style.display = "block";

        // Adjuntar al DOM primero
        container.appendChild(player);

        // Esperar un momento para que el elemento esté completamente en el DOM
        await new Promise((resolve) => setTimeout(resolve, 100));

        // Agregar listeners de eventos
        player.addEventListener("loadeddata", () => {
          console.log("🎮 SWF loaded successfully");
          if (mounted) {
            setIsLoading(false);
          }
        });

        player.addEventListener("error", (e) => {
          console.error("❌ Ruffle error:", e);
          if (mounted) {
            setError("Error loading game");
            setIsLoading(false);
          }
        });

        // Ahora sí cargar el SWF
        console.log("📂 Loading Transformice.swf...");
        player.load("/Transformice.swf");

        console.log(
          `✅ Ruffle player ready → server ${TRANSFORMICE_HOST}:${PRIMARY_TRANSFORMICE_PORT} via ${SOCKET_PROXY_URL}`
        );

        // Timeout de seguridad para ocultar el loading
        setTimeout(() => {
          if (mounted) {
            console.log("⏱️ Loading timeout - hiding loader");
            setIsLoading(false);
          }
        }, 5000);
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
      if (player) {
        try {
          player.remove();
        } catch (e) {
          console.error("Error removing player:", e);
        }
      }
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

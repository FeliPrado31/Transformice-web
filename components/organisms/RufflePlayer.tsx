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
    script.src =
      "https://unpkg.com/@ruffle-rs/ruffle@0.1.0-nightly.2024.12.31/ruffle.js";
    script.async = true;
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
    const container = containerRef.current;

    async function loadRuffle() {
      try {
        if (!container) return;

        setIsLoading(true);
        setError(null);

        // Configurar RufflePlayer DESPUÉS de cargar el script
        await loadRuffleScript();

        window.RufflePlayer = window.RufflePlayer || {};
        window.RufflePlayer.config = {
          preloader: false,
          warnOnUnsupportedContent: false,
          logLevel: "debug",
          autoplay: "on",
          unmuteOverlay: "hidden",
          letterbox: "fullscreen",
          backgroundColor: "#000000",
          contextMenu: false,
          showSwfDownload: false,
          socketProxy: SOCKET_PROXY_ENTRIES,
        };

        if (!mounted || !container) return;

        const createPlayer = await waitForRuffleFactory();
        if (!createPlayer) {
          throw new Error("Ruffle could not initialize");
        }

        const player = createPlayer();

        player.style.width = "100%";
        player.style.height = "100%";
        player.load("/Transformice.swf");

        container.replaceChildren(player);

        console.log(
          `✅ Ruffle player ready → server ${TRANSFORMICE_HOST}:${PRIMARY_TRANSFORMICE_PORT} via ${SOCKET_PROXY_URL}`
        );
        if (mounted) {
          setIsLoading(false);
        }
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

import { NextRequest } from "next/server";

// WebSocket proxy para conectar el Flash SWF con el servidor Transformice
// Este proxy convierte conexiones WebSocket del navegador a conexiones TCP al servidor real

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token = searchParams.get("token") || "server1";

  // Mapear tokens a puertos del servidor
  const serverMap: Record<string, number> = {
    server1: 11801,
    server2: 12801,
    server3: 13801,
    server4: 14801,
  };

  const targetPort = serverMap[token] || 11801;
  const targetHost = "15.204.211.244";

  console.log(
    `🔌 WebSocket proxy request for ${token} (${targetHost}:${targetPort})`
  );

  // Intentar establecer conexión WebSocket
  try {
    // Note: Next.js no soporta WebSocket directo en API Routes
    // Necesitamos usar un servidor WebSocket separado o proxy externo
    return new Response(
      JSON.stringify({
        error: "WebSocket proxy requires separate server",
        message: `Para conectar al servidor Transformice en ${targetHost}:${targetPort}, necesitas:`,
        solutions: [
          "1. Usar un proxy WebSocket externo (como wstunnel o websockify)",
          "2. Configurar servidor Node.js separado con ws library",
          "3. Usar servicios como ngrok con forwarding TCP->WS",
        ],
        currentConfig: {
          host: targetHost,
          port: targetPort,
          token,
        },
      }),
      {
        status: 501,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  } catch (error) {
    console.error("❌ Error en WebSocket proxy:", error);
    return new Response(JSON.stringify({ error: "Connection failed" }), {
      status: 500,
    });
  }
}

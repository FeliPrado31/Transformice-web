import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export default function proxy(request: NextRequest) {
  // Interceptar peticiones que el SWF hace a transformice.com
  const url = request.nextUrl.clone();

  // Si es una petición a transformice.com/images, redirigir a nuestros assets locales
  if (
    url.pathname.startsWith("/images/x_transformice/") ||
    url.pathname.startsWith("/images/badges/")
  ) {
    // La petición ya está apuntando a nuestro servidor, solo asegurar CORS
    const response = NextResponse.next();
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, OPTIONS");
    response.headers.set(
      "Cache-Control",
      "public, max-age=31536000, immutable"
    );
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/images/:path*"],
};

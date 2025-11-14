import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

function getContentType(filePath: string): string {
  const extension = path.extname(filePath).toLowerCase();
  const contentTypes: Record<string, string> = {
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".png": "image/png",
    ".gif": "image/gif",
    ".svg": "image/svg+xml",
    ".webp": "image/webp",
    ".js": "application/javascript",
    ".css": "text/css",
    ".xml": "application/xml",
    ".json": "application/json",
    ".swf": "application/x-shockwave-flash",
    ".txt": "text/plain",
    ".html": "text/html",
  };
  return contentTypes[extension] || "application/octet-stream";
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const resourcePath = pathArray.join("/");
    const localPath = path.join(process.cwd(), "public", resourcePath);

    // Verificar si el archivo existe localmente Y tiene contenido
    if (fs.existsSync(localPath)) {
      const stats = fs.statSync(localPath);
      if (stats.size > 0) {
        console.log(`✅ [PROXY] Sirviendo local: ${resourcePath}`);
        const fileBuffer = fs.readFileSync(localPath);
        const contentType = getContentType(localPath);

        return new NextResponse(fileBuffer, {
          headers: {
            "Content-Type": contentType,
            "Access-Control-Allow-Origin": "*",
            "Cache-Control": "public, max-age=31536000, immutable",
          },
        });
      } else {
        console.log(
          `⚠️  [PROXY] Archivo local vacío, reintentando descarga: ${resourcePath}`
        );
      }
    }

    // Si no existe localmente o está vacío, intentar descargar de transformice.com
    console.log(
      `⬇️  [PROXY] Descargando desde transformice.com: ${resourcePath}`
    );

    // Intentar múltiples URLs si es necesario
    const urls = [
      `http://www.transformice.com/${resourcePath}`,
      `https://www.transformice.com/${resourcePath}`,
    ];

    let lastError: Error | null = null;
    for (const externalUrl of urls) {
      try {
        const response = await fetch(externalUrl, {
          headers: {
            "User-Agent":
              "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
          },
        });

        if (response.ok) {
          const buffer = await response.arrayBuffer();

          // Guardar localmente para futuras peticiones
          const dir = path.dirname(localPath);
          if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
          }
          fs.writeFileSync(localPath, Buffer.from(buffer));
          console.log(
            `💾 [PROXY] Guardado localmente: ${resourcePath} (${buffer.byteLength} bytes)`
          );

          const contentType =
            response.headers.get("Content-Type") || getContentType(localPath);

          return new NextResponse(buffer, {
            headers: {
              "Content-Type": contentType,
              "Access-Control-Allow-Origin": "*",
              "Cache-Control": "public, max-age=31536000, immutable",
            },
          });
        }
      } catch (err) {
        lastError = err as Error;
        console.log(
          `⚠️  [PROXY] Fallo con ${externalUrl}, intentando siguiente...`
        );
      }
    }

    console.error(`❌ [PROXY] No encontrado en ninguna URL: ${resourcePath}`);
    return new NextResponse("Resource not found", { status: 404 });
  } catch (error) {
    console.error(`❌ [PROXY] Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

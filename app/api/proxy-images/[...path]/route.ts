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

    // Verificar si el archivo existe localmente
    if (fs.existsSync(localPath)) {
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
    }

    // Si no existe localmente, intentar descargar de transformice.com
    console.log(
      `⬇️  [PROXY] Descargando desde transformice.com: ${resourcePath}`
    );
    const externalUrl = `http://www.transformice.com/${resourcePath}`;
    const response = await fetch(externalUrl);

    if (!response.ok) {
      console.error(`❌ [PROXY] No encontrado: ${resourcePath}`);
      return new NextResponse("Resource not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    // Guardar localmente para futuras peticiones
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localPath, Buffer.from(buffer));
    console.log(`💾 [PROXY] Guardado localmente: ${resourcePath}`);

    const contentType =
      response.headers.get("Content-Type") || getContentType(localPath);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": contentType,
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`❌ [PROXY] Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

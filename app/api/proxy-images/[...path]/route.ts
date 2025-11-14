import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path: pathArray } = await params;
    const imagePath = pathArray.join("/");
    const localPath = path.join(process.cwd(), "public", "images", imagePath);

    // Verificar si el archivo existe localmente
    if (fs.existsSync(localPath)) {
      console.log(`✅ [PROXY] Sirviendo local: ${imagePath}`);
      const fileBuffer = fs.readFileSync(localPath);
      const extension = path.extname(localPath).toLowerCase();

      let contentType = "image/png";
      if (extension === ".jpg" || extension === ".jpeg") {
        contentType = "image/jpeg";
      } else if (extension === ".gif") {
        contentType = "image/gif";
      } else if (extension === ".svg") {
        contentType = "image/svg+xml";
      }

      return new NextResponse(fileBuffer, {
        headers: {
          "Content-Type": contentType,
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }

    // Si no existe localmente, intentar descargar de transformice.com
    console.log(`⬇️  [PROXY] Descargando desde transformice.com: ${imagePath}`);
    const externalUrl = `http://www.transformice.com/images/${imagePath}`;
    const response = await fetch(externalUrl);

    if (!response.ok) {
      console.error(`❌ [PROXY] No encontrado: ${imagePath}`);
      return new NextResponse("Image not found", { status: 404 });
    }

    const buffer = await response.arrayBuffer();

    // Guardar localmente para futuras peticiones
    const dir = path.dirname(localPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(localPath, Buffer.from(buffer));
    console.log(`💾 [PROXY] Guardado localmente: ${imagePath}`);

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": response.headers.get("Content-Type") || "image/png",
        "Access-Control-Allow-Origin": "*",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error(`❌ [PROXY] Error: ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

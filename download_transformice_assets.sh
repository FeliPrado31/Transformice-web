#!/bin/bash

BASE_URL="http://www.transformice.com/images"
OUTPUT_DIR="/home/feli/local/Transformice-web/public/images"

echo "=========================================="
echo "Descargando assets de Transformice"
echo "=========================================="

# Función para descargar con reintentos
download_file() {
    local url="$1"
    local output="$2"
    local dir=$(dirname "$output")
    
    mkdir -p "$dir"
    
    if curl -f -sS -o "$output" "$url" 2>/dev/null; then
        echo "✓ $(basename $output)"
        return 0
    else
        return 1
    fi
}

# Crear estructura de directorios
mkdir -p "$OUTPUT_DIR"

# x_transformice/x_interface (UI elements)
echo ""
echo "Descargando x_transformice/x_interface..."
for file in c1.png c2.png c3.png c4.png c5.png c6.png go.png \
    boutique.png boutiqueClose.png titre.png titre2.png \
    bg.jpg bg2.jpg bg3.jpg bg4.jpg \
    bulle.png bulleQueue.png cadre.png cadre2.png cadre3.png \
    fleche.png flecheRetour.png loading.png logo.png \
    menu.png menu2.png ok.png options.png panel.png \
    sablier.png scroll.png separateur.png vote.png \
    btn_close.png btn_help.png btn_invite.png btn_like.png \
    icon_admin.png icon_cheese.png icon_crown.png icon_flag.png \
    icon_home.png icon_mail.png icon_shop.png icon_star.png; do
    download_file "$BASE_URL/x_transformice/x_interface/$file" \
                  "$OUTPUT_DIR/x_transformice/x_interface/$file"
done

# x_transformice/x_connexion (Login screen)
echo ""
echo "Descargando x_transformice/x_connexion..."
for file in x_steam_.jpg x_steam_.png bg.jpg bg.png cadre.png \
    logo.png logo2.png titre.png titre2.png \
    btn_connect.png btn_disconnect.png btn_login.png \
    input.png input_focus.png; do
    download_file "$BASE_URL/x_transformice/x_connexion/$file" \
                  "$OUTPUT_DIR/x_transformice/x_connexion/$file"
done

# x_transformice/x_pictos (Icons, avatars)
echo ""
echo "Descargando x_transformice/x_pictos..."
for i in {1..200}; do
    download_file "$BASE_URL/x_transformice/x_pictos/$i.png" \
                  "$OUTPUT_DIR/x_transformice/x_pictos/$i.png"
done

# x_transformice/x_modos (Game modes)
echo ""
echo "Descargando x_transformice/x_modos..."
for file in vanilla.png racing.png bootcamp.png survivor.png \
    defilante.png village.png module.png; do
    download_file "$BASE_URL/x_transformice/x_modos/$file" \
                  "$OUTPUT_DIR/x_transformice/x_modos/$file"
done

# x_transformice/x_maps (Map elements)
echo ""
echo "Descargando x_transformice/x_maps..."
for file in cheese.png hole.png spawn.png \
    cloud.png wood.png ice.png trampoline.png \
    water.png lava.png chocolate.png; do
    download_file "$BASE_URL/x_transformice/x_maps/$file" \
                  "$OUTPUT_DIR/x_transformice/x_maps/$file"
done

# badges (Insignias)
echo ""
echo "Descargando badges..."
for i in {1..100}; do
    download_file "$BASE_URL/badges/$i.png" \
                  "$OUTPUT_DIR/badges/$i.png"
done

echo ""
echo "=========================================="
echo "Descarga completada!"
echo "=========================================="
find "$OUTPUT_DIR" -type f | wc -l | xargs echo "Total archivos:"
du -sh "$OUTPUT_DIR" | awk '{print "Tamaño total: " $1}'

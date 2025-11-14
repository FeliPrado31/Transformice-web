# Solución para CORS de Transformice Assets

## Problema

El archivo SWF de Transformice hace peticiones directas a `http://www.transformice.com/images/...` que son bloqueadas por CORS cuando se ejecuta desde localhost.

## Soluciones Implementadas

### 1. Assets Locales (✓ Implementado)

- Archivos descargados en `/public/images/`
- Disponibles en `http://localhost:3000/images/...`

### 2. API Proxy (✓ Implementado)

- Endpoint: `/api/proxy-images/[...path]`
- Descarga automática de assets que no existen localmente
- Headers CORS configurados

### 3. Next.js Rewrites (✓ Configurado)

- `next.config.ts` con reglas de reescritura
- Middleware para añadir headers CORS

## Soluciones Alternativas

### Opción A: Modificar archivo hosts (Recomendado para desarrollo)

**Linux/Mac:**

```bash
sudo nano /etc/hosts
```

**Windows:**

```bash
notepad C:\Windows\System32\drivers\etc\hosts
```

Añadir:

```
127.0.0.1 www.transformice.com
```

Luego configurar un servidor local en el puerto 80 que sirva los assets.

### Opción B: Extensión de navegador

Usar una extensión como "Requestly" o "ModHeader" para:

1. Interceptar peticiones a `www.transformice.com/images/*`
2. Redirigir a `localhost:3000/images/*`

### Opción C: Proxy Local

Usar un proxy HTTP como `mitmproxy` o `Charles Proxy`:

```bash
npm install -g local-cors-proxy
lcp --proxyUrl http://www.transformice.com
```

### Opción D: Desactivar CORS temporalmente

**Chrome:**

```bash
google-chrome --disable-web-security --user-data-dir="/tmp/chrome_dev"
```

**Firefox:**
about:config → security.fileuri.strict_origin_policy → false

## Script de Descarga

Ejecutar para obtener más assets:

```bash
./download_transformice_assets.sh
```

## Archivos Actuales

```bash
find public/images -type f | wc -l
# Total: 6+ archivos

du -sh public/images
# Tamaño: ~84KB
```

## Verificación

1. Assets disponibles localmente: `http://localhost:3000/images/x_transformice/x_interface/c1.png`
2. Proxy API: `http://localhost:3000/api/proxy-images/x_transformice/x_interface/c1.png`
3. SWF requiere: `http://www.transformice.com/images/x_transformice/x_interface/c1.png`

## Próximos Pasos

1. Probar con modificación de hosts (más confiable)
2. O usar Chrome con CORS deshabilitado para desarrollo
3. Para producción: negociar con Transformice para habilitar CORS o usar proxy reverso

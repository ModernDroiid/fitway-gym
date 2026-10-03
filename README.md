# Fitway Gym — Sitio web

Página de una sola vista para Fitway Gym, una cadena de gimnasios en el sur de Bogotá. Hecha con HTML, CSS y JavaScript nativos (sin frameworks ni compilación).

## Cómo ejecutarlo

El JavaScript usa módulos ES (`import`/`export`), así que **el sitio debe servirse por HTTP**. Si abres `index.html` con doble clic, el navegador bloquea los módulos.

```bash
# Opción 1: extensión "Live Server" de VS Code → clic derecho en index.html → "Open with Live Server"
# Opción 2: Node
npx serve .
# Opción 3: Python
python -m http.server 8080
```

## Estructura

```
fitway-gym/
├── index.html                  Marcado semántico de toda la página
├── .htaccess                   HTTPS forzado y cabeceras de seguridad (Apache)
├── legal/                      Aviso legal, datos personales, cookies, términos
├── assets/
│   ├── img/                    Logo oficial (texto negro y versión con texto blanco para modo oscuro), favicon
│   ├── css/
│   │   ├── main.css            Importa todo en orden
│   │   ├── base/               Variables, reseteo, tipografía
│   │   ├── layout/             Contenedor, cabecera, secciones, pie
│   │   └── components/         Botones, barra, sedes, horario, formulario, FAQ...
│   └── js/
│       ├── main.js             Arranque
│       ├── config.js           Backend, zona horaria, intervalos
│       ├── data/               Sedes y horarios (editar aquí el contenido)
│       ├── utils/              Fechas en hora de Bogotá, festivos, reglas de horario, DOM
│       ├── services/           Envío de solicitudes (único punto con el backend)
│       └── components/         Un archivo por pieza interactiva
```

## Tareas comunes

| Quiero...                         | Edita                                                  |
|----------------------------------|--------------------------------------------------------|
| Agregar o cambiar una sede        | `assets/js/data/sedes.js` (lista, barra, filtros, formulario y pie se actualizan solos) |
| Cambiar el horario                | `assets/js/data/horarios.js` y el texto del pie en `index.html` |
| Conectar el formulario a un backend | `endpointSolicitudes` en `assets/js/config.js`        |
| Cambiar colores o tipografía      | `assets/css/base/tokens.css`                           |

## Decisiones de diseño

- **Colores de marca.** Los tres azules del corredor del logo (`--marca-marino`, `--marca-azul`, `--marca-cian`) se usan en los botones, la banda de "Primer día" y el foco del teclado.
- **Discos olímpicos como sistema de color.** Cada sede tiene el color de un disco de competencia (rojo, azul, amarillo, verde). Ese color la identifica en la barra del hero, en la lista y en su marcador.
- **Barra del hero interactiva.** Al cargar, los discos entran y encajan. Es la única animación de entrada. Cada disco es un botón que lleva a su sede.
- **Horario en vivo.** El estado "Abierto ahora" usa la hora de Bogotá (no la del visitante) y conoce los festivos colombianos (Ley Emiliani y Semana Santa), calculados por año.
- **Formulario que ayuda.** Al elegir la fecha, muestra el horario de ese día. Valida al salir del campo, enfoca el primer error y no permite fechas pasadas.

## Accesibilidad

Enlace para saltar al contenido, foco visible, áreas táctiles de 44 px o más, `aria-live` en el estado y los filtros, acordeón nativo `<details>`, respeto a `prefers-reduced-motion` y modo oscuro automático.

## Cumplimiento legal (Colombia)

| Requisito | Dónde está |
|-----------|-----------|
| Datos del titular (razón social, NIT, domicilio, contacto) | `assets/js/data/empresa.js`: se insertan solos en el pie y en `legal/` |
| Aviso legal y propiedad intelectual | `legal/aviso-legal.html` |
| Política de tratamiento de datos (Ley 1581 de 2012, Decreto 1377 de 2013) | `legal/privacidad.html` |
| Autorización expresa en el formulario | Casilla desmarcada y obligatoria. La casilla de promociones es aparte y opcional. Se envía la fecha y la versión de la política aceptada como prueba |
| Aviso de cookies con bloqueo previo | `components/cookies.js` y `services/consentimiento.js` |
| Política de cookies | `legal/cookies.html` (actualiza la tabla si agregas analítica) |
| Términos y condiciones, promociones (Ley 1480 de 2011) | `legal/terminos.html` |
| HTTPS | Certificado SSL del hosting, más `.htaccess` (Apache) y `upgrade-insecure-requests` |

**Antes de publicar:**
1. Llena todos los campos vacíos de `assets/js/data/empresa.js`. Mientras falten, se ven resaltados en amarillo como `[Por completar: ...]` y aparece un aviso en la consola.
2. Activa el certificado SSL en el hosting (Let's Encrypt es gratis en la mayoría).
3. Haz que un abogado revise los textos. Son una base completa, no reemplazan la asesoría legal.
4. Si la empresa debe hacerlo, inscribe las bases de datos en el Registro Nacional de Bases de Datos (RNBD) de la SIC.

**Para agregar analítica** (Google Analytics u otra): escribe el script con `type="text/plain" data-consentimiento="analiticas"`. Hay un ejemplo comentado en el `<head>` de `index.html`.

## Modo demo

Si `endpointSolicitudes` está vacío, las solicitudes **no se envían a ningún lado**: se guardan en el `localStorage` del navegador (`fitway:solicitudes`). Conecta un backend antes de publicar el sitio.

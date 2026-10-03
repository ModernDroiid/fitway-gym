/* =============================================================
   consentimiento.js — Guarda la elección de cookies y activa scripts opcionales.
   Bloqueo previo: un script opcional se escribe así en el HTML y NO se ejecuta
   hasta que el usuario acepte su categoría:
     <script type="text/plain" data-consentimiento="analiticas" src="..."></script>
   ============================================================= */
const CLAVE = 'fitway:consentimiento'; // Clave en localStorage (almacenamiento técnico necesario)
const VERSION = 1;                     // Súbela si cambian las categorías: se vuelve a preguntar

// Elección guardada o null si nunca eligió (o la versión cambió)
export function leerConsentimiento() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return guardado?.version === VERSION ? guardado : null;
  } catch {
    return null; // Almacenamiento bloqueado: se trata como "sin elegir"
  }
}

// Ejecuta los scripts bloqueados de las categorías aceptadas
export function aplicarConsentimiento(consentimiento) {
  if (!consentimiento?.analiticas) return;                       // Sin permiso: no se carga nada
  document.querySelectorAll('script[type="text/plain"][data-consentimiento="analiticas"]').forEach((bloqueado) => {
    const script = document.createElement('script');             // Un script nuevo sí se ejecuta
    [...bloqueado.attributes].forEach(({ name, value }) => {
      if (name !== 'type' && name !== 'data-consentimiento') script.setAttribute(name, value); // Copia src, async...
    });
    script.text = bloqueado.text;                                // Copia código en línea
    bloqueado.replaceWith(script);
  });
}

// Guarda la elección, la aplica y avisa al resto de la página
export function guardarConsentimiento({ analiticas }) {
  const anterior = leerConsentimiento();
  const consentimiento = {
    version: VERSION,
    necesarias: true,                     // Siempre activas: sin ellas el sitio no funciona
    analiticas: Boolean(analiticas),
    fecha: new Date().toISOString(),      // Prueba de cuándo eligió
  };
  try { localStorage.setItem(CLAVE, JSON.stringify(consentimiento)); } catch { /* Navegación privada: no se recuerda */ }
  // Si retira un permiso ya dado, se recarga para que los scripts no sigan activos
  if (anterior?.analiticas && !consentimiento.analiticas) { location.reload(); return consentimiento; }
  aplicarConsentimiento(consentimiento);
  return consentimiento;
}

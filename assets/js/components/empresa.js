/* =============================================================
   empresa.js — Inserta los datos legales en cualquier [data-empresa="campo"].
   ============================================================= */
import { EMPRESA, ETIQUETAS } from '../data/empresa.js';
import { $$ } from '../utils/dom.js';

// Enlace correcto según el tipo de dato
const enlacePara = (clave, valor) => {
  if (clave.startsWith('correo')) return `mailto:${valor}`;                    // Correos
  if (clave === 'telefono') return `tel:${valor.replace(/[^\d+]/g, '')}`;      // Teléfono sin espacios
  return null;                                                                 // Resto: sin enlace
};

export function rellenarDatosEmpresa(raiz = document) {
  const faltantes = new Set();
  $$('[data-empresa]', raiz).forEach((el) => {
    const clave = el.dataset.empresa;
    const valor = EMPRESA[clave];
    if (valor) {
      el.textContent = valor;                                    // Dato real
      el.classList.remove('es-pendiente');
      const href = enlacePara(clave, valor);
      if (el.tagName === 'A' && href) el.href = href;            // mailto: / tel:
    } else {
      el.textContent = `[Por completar: ${ETIQUETAS[clave] ?? clave}]`; // Recordatorio visible
      el.classList.add('es-pendiente');                          // Estilo de alerta (legal.css)
      el.removeAttribute('href');                                // Sin enlace roto
      faltantes.add(clave);
    }
  });
  // Aviso para quien mantiene el sitio
  if (faltantes.size) console.warn(`Fitway: faltan datos legales en assets/js/data/empresa.js → ${[...faltantes].join(', ')}`);
}

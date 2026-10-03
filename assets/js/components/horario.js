/* =============================================================
   horario.js — Línea de tiempo con el horario de cada tipo de día.
   Resalta el día de hoy y marca la hora actual.
   ============================================================= */
import { $ } from '../utils/dom.js';
import { HORARIOS } from '../data/horarios.js';
import { ahoraEnBogota, formatoHora } from '../utils/fecha.js';
import { tipoDeDia } from '../utils/horario.js';
import { esFestivo } from '../utils/festivos.js';

const INICIO = 4 * 60;              // La pista empieza a las 4:00 a.m.
const FIN = 23 * 60;                // ...y termina a las 11:00 p.m.
const MARCAS = [6, 9, 12, 15, 18, 21]; // Horas que se rotulan abajo

// Minutos → porcentaje horizontal dentro de la pista
const pct = (minutos) => `${(((minutos - INICIO) / (FIN - INICIO)) * 100).toFixed(2)}%`;

// Hora entera → texto corto para la regla ('6 a.m.', '12 m.', '3 p.m.')
const rotulo = (h) => (h === 12 ? '12 m.' : `${h % 12} ${h < 12 ? 'a.m.' : 'p.m.'}`);

// Dibuja (o redibuja) el horario
export function renderHorario() {
  const contenedor = $('[data-horario]');
  if (!contenedor) return;
  const ahora = ahoraEnBogota();
  const tipoHoy = tipoDeDia(ahora);                        // Qué fila es "hoy"
  const etiquetaHoy = esFestivo(ahora) ? 'Hoy, festivo' : 'Hoy';

  const filas = Object.entries(HORARIOS).map(([clave, { etiqueta, abre, cierra }]) => {
    const esHoy = clave === tipoHoy;
    const rango = `${formatoHora(abre)} a ${formatoHora(cierra)}`;
    // Marcador "Ahora" solo en la fila de hoy y dentro de la pista
    const marcador = esHoy && ahora.minutos >= INICIO && ahora.minutos <= FIN
      ? `<span class="horario__ahora" style="left:${pct(ahora.minutos)}" aria-hidden="true"></span>`
      : '';
    return `
      <div class="horario__fila${esHoy ? ' es-hoy' : ''}">
        <p>
          <span class="horario__dia">${etiqueta}</span>${esHoy ? `<span class="horario__hoy">${etiquetaHoy}</span>` : ''}
          <span class="horario__horas num">${rango}</span>
        </p>
        <div class="horario__pista" role="img" aria-label="${etiqueta}: abierto de ${rango}">
          <span class="horario__abierto" style="left:${pct(abre)};width:calc(${pct(cierra)} - ${pct(abre)})"></span>
          ${marcador}
        </div>
      </div>`;
  });

  // Regla con horas (decorativa para lectores: el texto de cada fila ya lo dice)
  const regla = `
    <div class="horario__regla" aria-hidden="true">
      <span></span>
      <div class="horario__marcas num">${MARCAS.map((h) => `<span style="left:${pct(h * 60)}">${rotulo(h)}</span>`).join('')}</div>
    </div>`;

  contenedor.innerHTML = filas.join('') + regla;
}

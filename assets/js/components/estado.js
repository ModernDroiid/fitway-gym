/* =============================================================
   estado.js — Indicador "Abierto ahora / Cerrado" del hero.
   ============================================================= */
import { $ } from '../utils/dom.js';
import { estadoActual } from '../utils/horario.js';

// Pinta el estado actual (se llama al cargar y cada minuto)
export function actualizarEstado() {
  const contenedor = $('[data-estado]');
  if (!contenedor) return;
  const { abierto, texto } = estadoActual();             // Calcula con hora de Bogotá
  contenedor.classList.toggle('es-abierto', abierto);    // Punto verde o gris
  $('[data-estado-texto]', contenedor).textContent = texto;
}

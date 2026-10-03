/* =============================================================
   horario.js — Reglas de negocio del horario (qué horario aplica y si está abierto).
   ============================================================= */
import { HORARIOS } from '../data/horarios.js';
import { esFestivo } from './festivos.js';
import { ahoraEnBogota, sumarDias, formatoHora } from './fecha.js';

const AVISO_CIERRE = 60; // Minutos antes del cierre para avisar "cierra pronto"

// Clave del horario que aplica a una fecha: 'semana' | 'sabado' | 'domingo'
export function tipoDeDia(fecha) {
  if (fecha.diaSemana === 0 || esFestivo(fecha)) return 'domingo'; // Domingo o festivo
  if (fecha.diaSemana === 6) return 'sabado';                      // Sábado
  return 'semana';                                                 // Lunes a viernes
}

// Objeto de horario { etiqueta, abre, cierra } para una fecha
export const horarioDe = (fecha) => HORARIOS[tipoDeDia(fecha)];

// Estado actual: { abierto, texto } listo para mostrar
export function estadoActual(ahora = ahoraEnBogota()) {
  const hoy = horarioDe(ahora);
  const { minutos } = ahora;

  // Dentro del horario
  if (minutos >= hoy.abre && minutos < hoy.cierra) {
    const pronto = hoy.cierra - minutos <= AVISO_CIERRE;           // Última hora
    return {
      abierto: true,
      texto: pronto ? `Cierra pronto, a las ${formatoHora(hoy.cierra)}` : `Abierto ahora. Cierra a las ${formatoHora(hoy.cierra)}`,
    };
  }
  // Antes de abrir hoy
  if (minutos < hoy.abre) return { abierto: false, texto: `Cerrado. Abre hoy a las ${formatoHora(hoy.abre)}` };
  // Después de cerrar: mira el horario de mañana
  const manana = horarioDe(sumarDias(ahora, 1));
  return { abierto: false, texto: `Cerrado. Abre mañana a las ${formatoHora(manana.abre)}` };
}

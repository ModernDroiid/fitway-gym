/* =============================================================
   festivos.js — Festivos de Colombia (incluye Ley Emiliani y Semana Santa).
   Se calculan por año, así el sitio no hay que actualizarlo cada enero.
   ============================================================= */
import { aISO } from './fecha.js';

const DIA_MS = 86_400_000;           // Milisegundos en un día
const cache = new Map();             // Año → Set de fechas ISO (se calcula una vez)

// Fijos: no se mueven
const FIJOS = ['01-01', '05-01', '07-20', '08-07', '12-08', '12-25'];
// Ley Emiliani: si no caen lunes, pasan al lunes siguiente
const EMILIANI = ['01-06', '03-19', '06-29', '08-15', '10-12', '11-01', '11-11'];

// Domingo de Pascua (algoritmo gregoriano anónimo) → ms UTC
function pascua(anio) {
  const a = anio % 19, b = Math.floor(anio / 100), c = anio % 100;
  const d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4), k = c % 4, l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const mes = Math.floor((h + l - 7 * m + 114) / 31);    // 3 = marzo, 4 = abril
  const dia = ((h + l - 7 * m + 114) % 31) + 1;
  return Date.UTC(anio, mes - 1, dia);
}

// Mueve una fecha al lunes siguiente (si ya es lunes, la deja igual)
function aLunes(ms) {
  const diaSemana = new Date(ms).getUTCDay();             // 0 = domingo
  return ms + ((8 - diaSemana) % 7) * DIA_MS;             // Días hasta el lunes
}

// ms UTC → 'AAAA-MM-DD'
const msAISO = (ms) => new Date(ms).toISOString().slice(0, 10);

// Conjunto de festivos de un año
export function festivosDe(anio) {
  if (cache.has(anio)) return cache.get(anio);            // Ya calculado
  const fechas = new Set();
  FIJOS.forEach((md) => fechas.add(`${anio}-${md}`));     // Fijos tal cual
  EMILIANI.forEach((md) => fechas.add(msAISO(aLunes(Date.parse(`${anio}-${md}T00:00:00Z`)))));
  const p = pascua(anio);
  fechas.add(msAISO(p - 3 * DIA_MS));                     // Jueves Santo
  fechas.add(msAISO(p - 2 * DIA_MS));                     // Viernes Santo
  fechas.add(msAISO(aLunes(p + 39 * DIA_MS)));            // Ascensión del Señor
  fechas.add(msAISO(aLunes(p + 60 * DIA_MS)));            // Corpus Christi
  fechas.add(msAISO(aLunes(p + 68 * DIA_MS)));            // Sagrado Corazón
  cache.set(anio, fechas);                                // Guarda para la próxima
  return fechas;
}

// ¿La fecha es festivo en Colombia?
export const esFestivo = (fecha) => festivosDe(fecha.anio).has(aISO(fecha));

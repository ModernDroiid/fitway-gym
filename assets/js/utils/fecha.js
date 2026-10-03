/* =============================================================
   fecha.js — Fechas en hora de Bogotá, sin depender del reloj local del visitante.
   Una "fecha" aquí es { anio, mes (1-12), dia, diaSemana (0 = domingo) }.
   ============================================================= */
import { CONFIG } from '../config.js';

// Formateador que devuelve las partes de la fecha en la zona de las sedes
const formateador = new Intl.DateTimeFormat('en-US', {
  timeZone: CONFIG.zonaHoraria,  // Siempre hora de Bogotá
  year: 'numeric', month: 'numeric', day: 'numeric',
  hour: 'numeric', minute: 'numeric',
  hourCycle: 'h23',              // 0–23, sin a.m./p.m.
  weekday: 'short',              // Sun, Mon, ...
});

// Traduce el día corto en inglés a número
const DIAS = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

// Fecha y minutos actuales en Bogotá
export function ahoraEnBogota(momento = new Date()) {
  // Convierte [{type, value}] en { year: '2026', ... }
  const p = Object.fromEntries(formateador.formatToParts(momento).map(({ type, value }) => [type, value]));
  return {
    anio: Number(p.year),
    mes: Number(p.month),
    dia: Number(p.day),
    diaSemana: DIAS[p.weekday],
    minutos: (Number(p.hour) % 24) * 60 + Number(p.minute), // Minutos desde medianoche
  };
}

// Crea una fecha normalizada (corrige desbordes: 32 de enero → 1 de febrero)
export function crearFecha(anio, mes, dia) {
  const d = new Date(Date.UTC(anio, mes - 1, dia)); // UTC: evita saltos por zona horaria
  return { anio: d.getUTCFullYear(), mes: d.getUTCMonth() + 1, dia: d.getUTCDate(), diaSemana: d.getUTCDay() };
}

// Suma (o resta) días a una fecha
export const sumarDias = (fecha, n) => crearFecha(fecha.anio, fecha.mes, fecha.dia + n);

// Fecha → 'AAAA-MM-DD' (formato del <input type="date">)
export const aISO = ({ anio, mes, dia }) =>
  `${anio}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;

// 'AAAA-MM-DD' → fecha (null si el texto no es válido)
export function desdeISO(texto) {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(texto ?? ''); // Valida formato
  return m ? crearFecha(Number(m[1]), Number(m[2]), Number(m[3])) : null;
}

// Minutos → '5:00 a.m.' (formato usado en Colombia)
export function formatoHora(minutos) {
  const h = Math.floor(minutos / 60);           // Hora 0–23
  const m = String(minutos % 60).padStart(2, '0'); // Minutos con dos dígitos
  const h12 = h % 12 || 12;                     // 0 → 12, 13 → 1
  return `${h12}:${m} ${h < 12 ? 'a.m.' : 'p.m.'}`;
}

// Fecha → 'sábado 4 de octubre'
const formateadorLargo = new Intl.DateTimeFormat('es-CO', { timeZone: 'UTC', weekday: 'long', day: 'numeric', month: 'long' });
export const formatoFechaLarga = ({ anio, mes, dia }) => formateadorLargo.format(new Date(Date.UTC(anio, mes - 1, dia)));

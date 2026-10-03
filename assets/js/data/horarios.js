/* =============================================================
   horarios.js — Horario general (igual en todas las sedes).
   Las horas se guardan en minutos desde medianoche: 5:00 a.m. = 300.
   ============================================================= */
export const HORARIOS = {
  semana:  { etiqueta: 'Lunes a viernes',     abre: 5 * 60, cierra: 22 * 60 }, // 5:00 a.m. – 10:00 p.m.
  sabado:  { etiqueta: 'Sábados',             abre: 7 * 60, cierra: 18 * 60 }, // 7:00 a.m. – 6:00 p.m.
  domingo: { etiqueta: 'Domingos y festivos', abre: 7 * 60, cierra: 16 * 60 }, // 7:00 a.m. – 4:00 p.m.
};

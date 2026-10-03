/* =============================================================
   config.js — Ajustes del sitio que cambian por entorno.
   ============================================================= */
export const CONFIG = {
  // URL del backend que recibe las solicitudes de día gratis (POST JSON).
  // Vacío = modo demo: la solicitud se guarda solo en el navegador.
  endpointSolicitudes: '',

  // Zona horaria de las sedes: el estado "Abierto ahora" usa esta hora, no la del visitante.
  zonaHoraria: 'America/Bogota',

  // Cada cuánto se refresca el estado y el marcador "Ahora" (ms).
  intervaloActualizacion: 60_000,
};

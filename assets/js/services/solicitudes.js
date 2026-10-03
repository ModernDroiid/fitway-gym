/* =============================================================
   solicitudes.js — Envío de solicitudes de día gratis.
   Único punto de contacto con el backend: cambia aquí la integración.
   ============================================================= */
import { CONFIG } from '../config.js';

const CLAVE_LOCAL = 'fitway:solicitudes'; // Clave de localStorage en modo demo

// Envía la solicitud. Resuelve si todo salió bien; lanza Error si falló.
export async function enviarSolicitud(datos) {
  // Con backend configurado: POST JSON
  if (CONFIG.endpointSolicitudes) {
    const respuesta = await fetch(CONFIG.endpointSolicitudes, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datos),
    });
    if (!respuesta.ok) throw new Error(`El servidor respondió ${respuesta.status}`); // 4xx/5xx = error
    return { demo: false };
  }

  // Modo demo: simula la espera de red
  await new Promise((resolver) => setTimeout(resolver, 600));
  // Guarda en el navegador (puede fallar en modo privado: se ignora)
  try {
    const lista = JSON.parse(localStorage.getItem(CLAVE_LOCAL) || '[]');
    lista.push({ ...datos, creado: new Date().toISOString() });
    localStorage.setItem(CLAVE_LOCAL, JSON.stringify(lista));
  } catch { /* Sin almacenamiento disponible: no bloquea al usuario */ }
  return { demo: true };
}

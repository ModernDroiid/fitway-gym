/* =============================================================
   dom.js — Atajos para el DOM y preferencias del usuario.
   ============================================================= */

// Un elemento (o null)
export const $ = (selector, raiz = document) => raiz.querySelector(selector);

// Varios elementos como arreglo
export const $$ = (selector, raiz = document) => [...raiz.querySelectorAll(selector)];

// ¿El usuario pidió menos movimiento en su sistema?
export const prefiereMenosMovimiento = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Escapa texto antes de insertarlo como HTML (evita inyección)
export const escapar = (texto) =>
  String(texto).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);

/* =============================================================
   nav.js — Menú móvil y borde de la cabecera al hacer scroll.
   ============================================================= */
import { $, $$ } from '../utils/dom.js';

export function iniciarNavegacion() {
  const cabecera = $('[data-cabecera]');
  const boton = $('[data-menu-boton]');
  const menu = $('[data-menu]');
  if (!cabecera || !boton || !menu) return; // Sin cabecera, nada que hacer

  // Abre o cierra el menú y sincroniza la accesibilidad
  const alternar = (abrir) => {
    boton.setAttribute('aria-expanded', String(abrir));             // Lectores de pantalla
    $('.sr-only', boton).textContent = abrir ? 'Cerrar menú' : 'Abrir menú';
    menu.classList.toggle('esta-abierto', abrir);                   // Visibilidad (CSS)
  };

  // Clic en la hamburguesa: invierte el estado
  boton.addEventListener('click', () => alternar(boton.getAttribute('aria-expanded') !== 'true'));

  // Elegir un enlace cierra el menú
  $$('a', menu).forEach((enlace) => enlace.addEventListener('click', () => alternar(false)));

  // Escape cierra y devuelve el foco al botón
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('esta-abierto')) {
      alternar(false);
      boton.focus();
    }
  });

  // Borde inferior solo cuando ya se bajó (passive: no bloquea el scroll)
  const marcar = () => cabecera.classList.toggle('es-desplazada', window.scrollY > 8);
  window.addEventListener('scroll', marcar, { passive: true });
  marcar(); // Estado inicial (por si la página carga ya desplazada)
}

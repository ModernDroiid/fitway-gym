/* =============================================================
   barra.js — Barra olímpica del hero: un disco por sede.
   Al cargar, los discos entran y encajan (la animación es CSS).
   ============================================================= */
import { $ } from '../utils/dom.js';
import { SEDES } from '../data/sedes.js';
import { destacarSede } from './sedes.js';

const ESCALAS = [1, 1, 0.86, 0.74]; // Alto relativo de cada disco (del centro hacia afuera)
const TINTA_OSCURA = ['amarillo', 'azul']; // Discos claros que necesitan texto oscuro

// Aplica las variables CSS comunes a un disco
function estilizar(disco, sede, i) {
  disco.className = 'disco';
  disco.style.setProperty('--color', `var(--disco-${sede.color})`); // Color de la sede
  disco.style.setProperty('--escala', ESCALAS[i] ?? 0.7);           // Tamaño
  disco.style.setProperty('--i', i);                                // Orden de entrada
  if (TINTA_OSCURA.includes(sede.color)) disco.style.setProperty('--tinta', 'var(--marca-marino)');
}

export function iniciarBarra() {
  const barra = $('[data-barra]');
  if (!barra) return;
  const derecha = $('[data-manga="der"]', barra);
  const izquierda = $('[data-manga="izq"]', barra);

  SEDES.forEach((sede, i) => {
    // Disco interactivo (manga derecha)
    const boton = document.createElement('button');
    boton.type = 'button';
    estilizar(boton, sede, i);
    boton.textContent = sede.corto;                         // Texto impreso en el disco
    boton.setAttribute('aria-label', `Ver sede ${sede.nombre}`); // Nombre completo para lectores
    boton.addEventListener('click', () => destacarSede(sede.id));
    derecha.append(boton);

    // Disco espejo decorativo (manga izquierda, sin texto)
    const espejo = document.createElement('span');
    estilizar(espejo, sede, i);
    izquierda.append(espejo);
  });

  // Doble frame: asegura que el navegador pinte la posición inicial antes de animar
  requestAnimationFrame(() => requestAnimationFrame(() => barra.classList.add('esta-cargada')));
}

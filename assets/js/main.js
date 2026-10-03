/* =============================================================
   main.js — Punto de entrada: arranca cada componente.
   ============================================================= */
import { CONFIG } from './config.js';
import { $ } from './utils/dom.js';
import { ahoraEnBogota } from './utils/fecha.js';
import { iniciarNavegacion } from './components/nav.js';
import { actualizarEstado } from './components/estado.js';
import { iniciarBarra } from './components/barra.js';
import { iniciarSedes } from './components/sedes.js';
import { renderHorario } from './components/horario.js';
import { iniciarFormulario } from './components/formulario.js';
import { rellenarDatosEmpresa } from './components/empresa.js';
import { iniciarCookies } from './components/cookies.js';

// Primero lo legal: aviso de cookies y bloqueo previo de scripts opcionales
iniciarCookies();
rellenarDatosEmpresa();

// Orden: sedes antes que la barra (la barra enlaza a las filas de sedes)
iniciarNavegacion();
iniciarSedes();
iniciarBarra();
actualizarEstado();
renderHorario();
iniciarFormulario();

// Año actual en el pie
const anio = $('[data-anio]');
if (anio) anio.textContent = ahoraEnBogota().anio;

// Refresca lo que depende de la hora (abierto/cerrado y marcador "Ahora")
setInterval(() => {
  actualizarEstado();
  renderHorario();
}, CONFIG.intervaloActualizacion);

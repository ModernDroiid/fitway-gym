/* =============================================================
   legal.js — Punto de entrada de las páginas de /legal.
   ============================================================= */
import { rellenarDatosEmpresa } from './components/empresa.js';
import { iniciarCookies } from './components/cookies.js';

rellenarDatosEmpresa();              // Razón social, NIT, correos...
iniciarCookies({ rutaLegal: '' });   // Ya estamos dentro de /legal

/* =============================================================
   cookies.js — Aviso de cookies (primera visita) y panel de configuración.
   "Aceptar" y "Rechazar" tienen el mismo peso visual: elegir es libre.
   ============================================================= */
import { $ } from '../utils/dom.js';
import { leerConsentimiento, guardarConsentimiento, aplicarConsentimiento } from '../services/consentimiento.js';

// Marcado del aviso y del panel (rutaLegal cambia según la página: 'legal/' o '')
const plantilla = (rutaLegal) => `
  <section class="cookies" data-cookies-aviso aria-label="Aviso de cookies" hidden>
    <p class="cookies__texto">
      Usamos almacenamiento técnico necesario para que el sitio funcione. Las cookies analíticas
      solo se activan si las aceptas. <a href="${rutaLegal}cookies.html">Política de cookies</a>
    </p>
    <div class="cookies__acciones">
      <button class="boton boton--secundario boton--compacto" type="button" data-cookies="rechazar">Solo necesarias</button>
      <button class="boton boton--secundario boton--compacto" type="button" data-cookies="aceptar">Aceptar todas</button>
      <button class="cookies__configurar" type="button" data-abrir-cookies>Configurar</button>
    </div>
  </section>

  <dialog class="cookies-panel" data-cookies-panel aria-labelledby="cookies-panel-titulo">
    <form method="dialog" class="cookies-panel__form">
      <h2 class="cookies-panel__titulo" id="cookies-panel-titulo">Configurar cookies</h2>
      <!-- Categoría obligatoria: no se puede desactivar -->
      <div class="interruptor">
        <input type="checkbox" id="ck-necesarias" checked disabled>
        <label for="ck-necesarias"><strong>Necesarias</strong><br>Guardan tu elección de cookies. Siempre activas.</label>
      </div>
      <!-- Categoría opcional: desmarcada por defecto -->
      <div class="interruptor">
        <input type="checkbox" id="ck-analiticas" data-cookies-analiticas>
        <label for="ck-analiticas"><strong>Analíticas</strong><br>Nos dicen qué secciones se visitan más, sin identificarte.</label>
      </div>
      <div class="cookies-panel__acciones">
        <button class="boton boton--secundario boton--compacto" value="cancelar">Cancelar</button>
        <button class="boton boton--primario boton--compacto" value="guardar" data-cookies="guardar">Guardar elección</button>
      </div>
    </form>
  </dialog>`;

export function iniciarCookies({ rutaLegal = 'legal/' } = {}) {
  const actual = leerConsentimiento();
  aplicarConsentimiento(actual);                                  // Activa lo que ya aceptó antes

  document.body.insertAdjacentHTML('afterbegin', plantilla(rutaLegal)); // Al inicio: el teclado lo encuentra pronto
  const aviso = $('[data-cookies-aviso]');
  const panel = $('[data-cookies-panel]');
  const casillaAnaliticas = $('[data-cookies-analiticas]', panel);

  if (!actual) aviso.hidden = false;                              // Primera visita: mostrar aviso

  // Guarda y cierra todo
  const elegir = (analiticas) => {
    guardarConsentimiento({ analiticas });
    aviso.hidden = true;
  };

  // Botones del aviso
  aviso.addEventListener('click', (e) => {
    const accion = e.target.closest('[data-cookies]')?.dataset.cookies;
    if (accion === 'aceptar') elegir(true);
    if (accion === 'rechazar') elegir(false);
  });

  // "Configurar" (en el aviso o "Configurar cookies" en el pie): abre el panel con la elección actual
  document.addEventListener('click', (e) => {
    if (!e.target.closest('[data-abrir-cookies]')) return;
    casillaAnaliticas.checked = Boolean(leerConsentimiento()?.analiticas);
    panel.returnValue = '';                                       // Limpia el resultado anterior (Escape no lo cambia)
    panel.showModal();                                           // Modal nativo: atrapa el foco y cierra con Escape
  });

  // Al cerrar el panel con "Guardar elección"
  panel.addEventListener('close', () => {
    if (panel.returnValue === 'guardar') elegir(casillaAnaliticas.checked);
  });
}

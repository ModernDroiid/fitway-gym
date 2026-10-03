/* =============================================================
   sedes.js — Filtros, lista de sedes y direcciones del pie.
   ============================================================= */
import { $, $$, escapar, prefiereMenosMovimiento } from '../utils/dom.js';
import { SEDES, ENFOQUES, enlaceMapa } from '../data/sedes.js';

const TODAS = 'todas'; // Valor del filtro sin restricción

// HTML de una sede (los datos son propios, igual se escapan por seguridad)
const plantillaSede = (sede) => `
  <li class="sede" id="sede-${sede.id}" style="--color: var(--disco-${sede.color})" data-enfoques="${sede.enfoques.join(' ')}">
    <span class="sede__disco" aria-hidden="true"></span>
    <div>
      <h3 class="sede__nombre" tabindex="-1">${escapar(sede.nombre)}</h3>
      <p class="sede__lugar">${escapar(sede.localidad)}</p>
      <p class="sede__nota">${escapar(sede.nota)}</p>
    </div>
    <div class="sede__detalle">
      <p class="sede__direccion">${escapar(sede.direccion ?? 'Ubicación en el mapa')}</p>
      <p class="sede__resumen">${escapar(sede.resumen)}</p>
      <ul class="sede__zonas" aria-label="Qué encuentras en ${escapar(sede.nombre)}">
        ${sede.zonas.map((zona) => `<li class="sede__zona">${escapar(zona)}</li>`).join('')}
      </ul>
    </div>
    <div class="sede__acciones">
      <a class="boton boton--secundario boton--compacto" href="${enlaceMapa(sede)}" target="_blank" rel="noopener noreferrer">
        Cómo llegar<span class="sr-only"> a ${escapar(sede.nombre)} (abre Google Maps)</span>
      </a>
      <a class="boton boton--primario boton--compacto" href="#dia-gratis" data-elegir-sede="${sede.id}">
        Día gratis aquí<span class="sr-only">, en ${escapar(sede.nombre)}</span>
      </a>
    </div>
  </li>`;

// Aplica un filtro: oculta sedes que no coinciden y actualiza chips y resumen
function aplicarFiltro(clave) {
  let visibles = 0;
  $$('.sede').forEach((fila) => {
    const coincide = clave === TODAS || fila.dataset.enfoques.split(' ').includes(clave);
    fila.hidden = !coincide;                               // hidden = fuera del árbol de accesibilidad
    if (coincide) visibles++;
  });
  // Marca el chip activo
  $$('[data-filtro]').forEach((chip) => chip.setAttribute('aria-pressed', String(chip.dataset.filtro === clave)));
  // Texto del resumen (también lo anuncia aria-live)
  $('[data-filtros-resumen]').textContent = clave === TODAS
    ? `Mostrando las ${SEDES.length} sedes.`
    : `${visibles} ${visibles === 1 ? 'sede' : 'sedes'} con ${ENFOQUES[clave].toLowerCase()}.`;
}

// Lleva al usuario a una sede y la resalta un momento (lo usa la barra del hero)
export function destacarSede(id) {
  const fila = document.getElementById(`sede-${id}`);
  if (!fila) return;
  if (fila.hidden) aplicarFiltro(TODAS);                   // Si estaba filtrada, quita el filtro
  fila.scrollIntoView({ behavior: prefiereMenosMovimiento() ? 'auto' : 'smooth', block: 'start' });
  $('.sede__nombre', fila).focus({ preventScroll: true }); // Foco para teclado y lector de pantalla
  fila.classList.add('es-destacada');                      // Fondo del color de la sede
  setTimeout(() => fila.classList.remove('es-destacada'), 1800);
}

export function iniciarSedes() {
  const lista = $('[data-sedes]');
  const filtros = $('[data-filtros]');
  if (!lista || !filtros) return;

  // Lista de sedes
  lista.innerHTML = SEDES.map(plantillaSede).join('');

  // Chips: "Todas" + uno por enfoque
  const opciones = [[TODAS, 'Todas'], ...Object.entries(ENFOQUES)];
  filtros.innerHTML = opciones
    .map(([clave, texto]) => `<button class="chip" type="button" data-filtro="${clave}" aria-pressed="false">${texto}</button>`)
    .join('');
  // Un solo listener para todos los chips (delegación)
  filtros.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-filtro]');
    if (chip) aplicarFiltro(chip.dataset.filtro);
  });
  aplicarFiltro(TODAS); // Estado inicial

  // "Día gratis aquí": avisa al formulario qué sede preseleccionar
  lista.addEventListener('click', (e) => {
    const enlace = e.target.closest('[data-elegir-sede]');
    if (enlace) document.dispatchEvent(new CustomEvent('fitway:elegir-sede', { detail: { id: enlace.dataset.elegirSede } }));
  });

  // Direcciones en el pie
  const pie = $('[data-pie-sedes]');
  if (pie) {
    pie.innerHTML = SEDES
      .map((s) => `<li><strong>${escapar(s.nombre)}</strong><br>${escapar(s.direccion ?? s.localidad)}</li>`)
      .join('');
  }
}

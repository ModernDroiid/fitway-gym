/* =============================================================
   formulario.js — Formulario "Reclama tu día gratis".
   Valida con mensajes claros, muestra el horario del día elegido y confirma.
   ============================================================= */
import { $, $$ } from '../utils/dom.js';
import { SEDES, sedePorId } from '../data/sedes.js';
import { ahoraEnBogota, aISO, desdeISO, formatoHora, formatoFechaLarga } from '../utils/fecha.js';
import { horarioDe } from '../utils/horario.js';
import { esFestivo } from '../utils/festivos.js';
import { enviarSolicitud } from '../services/solicitudes.js';
import { EMPRESA } from '../data/empresa.js';

// Solo dígitos del celular, sin el indicativo 57 si lo pusieron
const soloDigitos = (valor) => valor.replace(/\D/g, '').replace(/^57(?=3\d{9}$)/, '');

// Reglas: cada una devuelve el mensaje de error o '' si está bien
const VALIDADORES = {
  nombre: (v) => (v.trim().length >= 2 ? '' : 'Escribe tu nombre.'),
  celular: (v) => (/^3\d{9}$/.test(soloDigitos(v)) ? '' : 'Escribe un celular de 10 dígitos que empiece por 3.'),
  sede: (v) => (sedePorId(v) ? '' : 'Elige la sede a la que vas a ir.'),
  fecha: (v, input) => {
    if (!desdeISO(v)) return 'Elige el día que vienes.';
    return v < input.min ? 'Elige hoy o un día posterior.' : ''; // Comparar ISO funciona como texto
  },
  // Ley 1581: sin autorización expresa no se pueden recibir los datos
  autoriza: (_, input) => (input.checked ? '' : 'Para continuar, autoriza el tratamiento de tus datos.'),
};

export function iniciarFormulario() {
  const form = $('[data-form]');
  if (!form) return;
  const select = $('[data-select-sede]', form);
  const inputFecha = $('[data-input-fecha]', form);
  const ayudaFecha = $('[data-ayuda-fecha]', form);
  const botonEnviar = $('[data-form-enviar]', form);
  const estado = $('[data-form-estado]', form);
  const confirmacion = $('[data-confirmacion]');

  // Opciones del select desde los datos
  SEDES.forEach((sede) => select.add(new Option(`${sede.nombre} (${sede.localidad})`, sede.id)));

  // No se puede elegir un día pasado
  inputFecha.min = aISO(ahoraEnBogota());

  // Muestra/oculta el error de un campo
  const marcarError = (nombre, mensaje) => {
    const campo = form.elements[nombre];
    campo.setAttribute('aria-invalid', String(Boolean(mensaje)));  // Borde rojo y lectura del error
    $(`[data-error-de="${nombre}"]`, form).textContent = mensaje;
  };

  // Valida un campo y devuelve true si está bien
  const validar = (nombre) => {
    const campo = form.elements[nombre];
    const mensaje = VALIDADORES[nombre](campo.value, campo);
    marcarError(nombre, mensaje);
    return !mensaje;
  };

  // Valida al salir del campo, pero solo si el usuario ya escribió algo (no regaña antes de tiempo)
  Object.keys(VALIDADORES).forEach((nombre) => {
    const campo = form.elements[nombre];
    // (Las casillas no se validan al salir: solo al enviar o al corregir)
    campo.addEventListener('blur', () => { if (campo.type !== 'checkbox' && campo.value) validar(nombre); });
    // Si había error, revalida mientras corrige para quitarlo apenas esté bien
    campo.addEventListener('input', () => { if (campo.getAttribute('aria-invalid') === 'true') validar(nombre); });
  });

  // Formatea el celular como "300 123 4567" mientras se escribe
  form.elements.celular.addEventListener('input', (e) => {
    const d = soloDigitos(e.target.value).slice(0, 10);
    e.target.value = [d.slice(0, 3), d.slice(3, 6), d.slice(6)].filter(Boolean).join(' ');
  });

  // Ayuda dinámica: horario del día elegido
  const actualizarAyuda = () => {
    const fecha = desdeISO(inputFecha.value);
    if (!fecha) { ayudaFecha.textContent = 'Elige un día y te decimos el horario.'; return; }
    const { abre, cierra } = horarioDe(fecha);
    const festivo = esFestivo(fecha) ? ' es festivo:' : '';     // Avisa si cae festivo
    // Termina en "p.m." sin punto extra
    ayudaFecha.textContent = `El ${formatoFechaLarga(fecha)}${festivo} abrimos de ${formatoHora(abre)} a ${formatoHora(cierra)}`;
  };
  inputFecha.addEventListener('change', actualizarAyuda);

  // Preselección desde "Día gratis aquí" en la lista de sedes
  document.addEventListener('fitway:elegir-sede', (e) => {
    select.value = e.detail.id;
    marcarError('sede', '');
    // Espera el scroll suave y lleva el foco al primer campo
    setTimeout(() => form.elements.nombre.focus({ preventScroll: true }), 450);
  });

  // Envío
  form.addEventListener('submit', async (e) => {
    e.preventDefault();                                        // Sin recarga de página
    estado.textContent = '';
    const nombres = Object.keys(VALIDADORES);
    const resultados = nombres.map(validar);                   // Valida todos (muestra todos los errores)
    const primerError = nombres.find((_, i) => !resultados[i]);
    if (primerError) { form.elements[primerError].focus(); return; } // Lleva al primer error

    // Datos limpios
    const datos = {
      nombre: form.elements.nombre.value.trim(),
      celular: soloDigitos(form.elements.celular.value),
      sede: select.value,
      fecha: inputFecha.value,
      // Prueba de la autorización (el responsable debe poder demostrarla: Decreto 1377 de 2013)
      autorizaTratamiento: true,
      aceptaPromociones: form.elements.promociones.checked,
      versionPolitica: EMPRESA.versionPolitica,
      fechaAutorizacion: new Date().toISOString(),
    };

    // Estado de carga: evita doble envío
    botonEnviar.setAttribute('aria-busy', 'true');
    botonEnviar.disabled = true;
    botonEnviar.textContent = 'Enviando…';

    try {
      await enviarSolicitud(datos);
      mostrarConfirmacion(datos);
    } catch {
      // Error accionable, sin disculpas vagas
      estado.textContent = 'No se pudo enviar. Revisa tu conexión e inténtalo de nuevo.';
    } finally {
      botonEnviar.removeAttribute('aria-busy');
      botonEnviar.disabled = false;
      botonEnviar.textContent = 'Reclamar día gratis';
    }
  });

  // Reemplaza el formulario por la confirmación
  function mostrarConfirmacion({ nombre, celular, sede, fecha }) {
    const s = sedePorId(sede);
    const dia = desdeISO(fecha);
    const { abre, cierra } = horarioDe(dia);
    const texto = $('[data-confirmacion-texto]', confirmacion);
    texto.replaceChildren();                                   // Limpia confirmación previa
    // Se arma con nodos de texto: el nombre del usuario nunca se interpreta como HTML
    const negrita = (t) => Object.assign(document.createElement('strong'), { textContent: t });
    texto.append(
      `Listo, ${nombre}. Te esperamos en `, negrita(`Fitway ${s.nombre}`),
      ` el `, negrita(formatoFechaLarga(dia)),
      ` (abrimos de ${formatoHora(abre)} a ${formatoHora(cierra)}). Te escribiremos al ${celular.replace(/(\d{3})(\d{3})(\d{4})/, '$1 $2 $3')} para confirmar.`,
    );
    form.hidden = true;
    confirmacion.hidden = false;
    confirmacion.focus();                                      // Anuncia el cambio a lectores de pantalla
  }

  // "Reclamar para otra persona": vuelve al formulario limpio
  $('[data-confirmacion-otra]', confirmacion).addEventListener('click', () => {
    form.reset();
    $$('[aria-invalid]', form).forEach((c) => c.removeAttribute('aria-invalid'));
    actualizarAyuda();
    confirmacion.hidden = true;
    form.hidden = false;
    form.elements.nombre.focus();
  });
}

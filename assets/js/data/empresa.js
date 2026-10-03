/* =============================================================
   empresa.js — Datos legales del titular del sitio.
   ÚNICO lugar donde se editan: se insertan solos en el pie y en las páginas legales.
   Campo vacío = se muestra "[Por completar: ...]" y se avisa en la consola.
   ============================================================= */
export const EMPRESA = {
  marca: 'Fitway Gym',            // Nombre comercial
  razonSocial: '',                // Ej.: 'Fitway Gym S.A.S.' (como aparece en el RUT / Cámara de Comercio)
  nit: '',                        // Ej.: '900.123.456-7'
  domicilio: '',                  // Dirección de notificación judicial (Cámara de Comercio)
  ciudad: 'Bogotá D.C., Colombia', // Ciudad del domicilio
  correo: '',                     // Correo de contacto general
  telefono: '',                   // Teléfono o WhatsApp de contacto
  correoDatos: '',                // Canal para consultas y reclamos de datos personales (Ley 1581)
  plazoConservacion: '12 meses',  // Tiempo que se guardan solicitudes sin inscripción (ajustar con su asesor legal)
  fechaVigencia: '3 de octubre de 2026', // Desde cuándo rigen las políticas
  versionPolitica: '1.0',         // Versión de la política de datos (se guarda con cada autorización)
};

// Nombre legible de cada campo (para el aviso "[Por completar: ...]")
export const ETIQUETAS = {
  razonSocial: 'razón social',
  nit: 'NIT',
  domicilio: 'domicilio',
  correo: 'correo de contacto',
  telefono: 'teléfono',
  correoDatos: 'correo de datos personales',
};

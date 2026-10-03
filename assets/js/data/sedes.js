/* =============================================================
   sedes.js — Datos de las sedes. Para agregar una sede, añade un objeto aquí.
   ============================================================= */

// Tipos de entrenamiento usados por los filtros (clave: texto visible)
export const ENFOQUES = {
  fuerza: 'Fuerza',
  cardio: 'Cardio',
  clases: 'Clases grupales',
  funcional: 'Funcional',
};

// Lista de sedes, en orden de disco (de mayor a menor en la barra)
export const SEDES = [
  {
    id: 'tres-esquinas',                         // Identificador único (se usa en URLs y en el formulario)
    nombre: 'Tres Esquinas',                     // Nombre completo
    corto: 'Tres Esquinas',                      // Nombre impreso en el disco
    localidad: 'Ciudad Bolívar',                 // Localidad de Bogotá
    direccion: 'Transversal 50 #76a Sur',        // Dirección exacta
    color: 'rojo',                               // Color de disco (ver tokens.css)
    nota: 'Nuestra sede más completa',           // Rasgo destacado
    resumen: 'Una de las sedes más populares, con zonas separadas para cada parte de tu rutina.',
    zonas: ['Zona cardiovascular', 'Tren superior con máquinas Hammer', 'Prensas', 'Sentadilla libre', 'Jaca', 'Extensiones', 'Cafetería'],
    enfoques: ['fuerza', 'cardio'],              // Claves de ENFOQUES para filtrar
  },
  {
    id: 'bosa-san-jose',
    nombre: 'Bosa San José',
    corto: 'Bosa',
    localidad: 'Bosa',
    direccion: 'Transversal 80i #88-24',
    color: 'azul',
    nota: 'Recién renovada',
    resumen: 'Una de nuestras sedes más nuevas, con maquinaria moderna pensada para rutinas de fuerza.',
    zonas: ['Maquinaria moderna', 'Rutinas de fuerza'],
    enfoques: ['fuerza'],
  },
  {
    id: 'santo-domingo',
    nombre: 'Santo Domingo',
    corto: 'Santo Domingo',
    localidad: 'Ciudad Bolívar',
    direccion: 'Transversal 76b',
    color: 'amarillo',
    nota: 'Clases grupales en la noche',
    resumen: 'Reconocida por sus clases grupales nocturnas, como Zumba.',
    zonas: ['Zumba', 'Clases nocturnas'],
    enfoques: ['clases'],
  },
  {
    id: 'san-cristobal-sur',
    nombre: 'San Cristóbal Sur',
    corto: 'San Cristóbal',
    localidad: 'San Cristóbal',
    direccion: null,                             // Sin dirección confirmada: se muestra el enlace al mapa
    color: 'verde',
    nota: 'Funcional y rumba fitness',
    resumen: 'Enfocada en entrenamiento funcional y rumba fitness.',
    zonas: ['Entrenamiento funcional', 'Rumba fitness'],
    enfoques: ['funcional', 'clases'],
  },
];

// Busca una sede por id (devuelve undefined si no existe)
export const sedePorId = (id) => SEDES.find((sede) => sede.id === id);

// Enlace a Google Maps: usa la dirección si existe; si no, el nombre de la sede
export const enlaceMapa = (sede) =>
  'https://www.google.com/maps/search/?api=1&query=' +
  encodeURIComponent(`Fitway Gym ${sede.direccion ?? sede.nombre}, ${sede.localidad}, Bogotá`);

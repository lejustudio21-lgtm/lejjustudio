// Oracle data aligned to each Chakra / day of week
// Each day maps to a chakra, a numerological number (1-7), element, symbolism, and ritual
export const ORACLE_PHRASES = {
  Lunes: {
    chakra: 'Muladhara',
    number: 1,
    affirmation: 'Soy la raíz. Todo lo que soy se sostiene desde aquí.',
    element: 'Tierra',
    element_symbolism: 'La tierra pide enraizar. Hoy la energía trabaja la supervivencia, la seguridad y el arraigo. Lo que no está plantado, no crece. Lo que está plantado, resiste la tormenta.',
    ritual: 'Camina descalzo sobre tierra o césped durante 5 minutos. Visualiza raíces que descienden desde tus pies hasta el centro de la tierra. Canta LAM siete veces sintiendo cómo la tierra te sostiene.',
    phrase: 'Hoy enraízo mi presencia en la tierra que soy. Desde la raíz, todo florece.',
  },
  Martes: {
    chakra: 'Svadhisthana',
    number: 2,
    affirmation: 'Fluyo con lo que soy. Mi agua encuentra su cauce natural.',
    element: 'Agua',
    element_symbolism: 'El agua pide fluir. Hoy la energía trabaja las emociones, la creatividad y los patrones. Lo que se represa, se pudre. Lo que fluye, se limpia.',
    ritual: 'Bebe un vaso de agua con intención consciente. Coloca las manos en el bajo vientre. Respira en naranja. Siente el agua que fluye en ti. Canta VAM siete veces.',
    phrase: 'Dejo fluir lo que ya no soy. El agua que soy encuentra su cauce natural.',
  },
  Miércoles: {
    chakra: 'Manipura',
    number: 3,
    affirmation: 'Mi fuego interior transforma todo lo que toco. Soy la llama y el alquimista.',
    element: 'Fuego',
    element_symbolism: 'El fuego pide transformar. Hoy la energía trabaja el poder personal, la confianza y la reparación celular. Lo que no arde, no cambia. Lo que arde, renace.',
    ritual: 'Enciende una vela amarilla. Manos sobre el estómago. Visualiza un sol dorado en tu centro. Siente tu fuego interior. Canta RAM siete veces mientras miras la llama.',
    phrase: 'Mi fuego interior transforma todo lo que toco. Soy la llama y el alquimista.',
  },
  Jueves: {
    chakra: 'Anahata',
    number: 4,
    affirmation: 'Amo desde la plenitud, no desde la carencia. El corazón abierto es mi escudo.',
    element: 'Aire',
    element_symbolism: 'El aire pide conectar. Hoy la energía trabaja el amor, la compasión y la armonía. Lo que no respira, se marchita. Lo que respira, se expande.',
    ritual: 'Sal al aire libre. Respira profundamente siete veces. Manos en el pecho. Siente tu corazón expandirse con cada respiración. Canta YAM siete veces.',
    phrase: 'Amo desde la plenitud, no desde la carencia. El corazón abierto es mi escudo.',
  },
  Viernes: {
    chakra: 'Vishuddha',
    number: 5,
    affirmation: 'Mi verdad es válida. La expreso con libertad y sin temor al espejo.',
    element: 'Éter',
    element_symbolism: 'El éter pide expresar. Hoy la energía trabaja la comunicación, la expresión y los bucles mentales. Lo que no se dice, se enferma. Lo que se dice, libera.',
    ritual: 'Frente a un espejo, di en voz alta tres verdades que has callado. Manos en la garganta. Respira en azul cielo. Canta HAM siete veces.',
    phrase: 'Mi verdad es válida. La expreso con libertad y sin temor al espejo.',
  },
  Sábado: {
    chakra: 'Ajna',
    number: 6,
    affirmation: 'Veo más allá de lo evidente. Mi intuición es la brújula que no falla.',
    element: 'Luz',
    element_symbolism: 'La luz pide ver. Hoy la energía trabaja la intuición, la sabiduría y el orden espiritual. Lo que no se ve, te gobierna. Lo que se ve, pierde su poder sobre ti.',
    ritual: 'Cierra los ojos en silencio. Manos en el entrecejo. Respira en índigo. Pregúntate: ¿Qué no quiero ver? Escucha sin juzgar. Canta OM siete veces.',
    phrase: 'Veo más allá de lo evidente. Mi intuición es la brújula que no falla.',
  },
  Domingo: {
    chakra: 'Sahasrara',
    number: 7,
    affirmation: 'Me abro a lo que me trasciende. En el silencio, todo se completa.',
    element: 'Conciencia',
    element_symbolism: 'La conciencia pide soltar. Hoy la energía trabaja la conexión divina y la entrega. Lo que se sostiene con fuerza, se pierde. Lo que se suelta, se expande.',
    ritual: 'Manos sobre la cabeza. Respira en luz blanca. Silencio total por 5 minutos. No pidas, no pienses, no esperes. Solo sé. Permítete recibir.',
    phrase: 'Me abro a lo que me trasciende. En el silencio, todo se completa.',
  },
};

// Behavioral reprogramming phrases for each phase (1-5)
export const REPROGRAMMING_PHRASES = [
  {
    phase: 1,
    name: 'Reconocimiento',
    phrase: 'Reconozco los patrones que ya no me sirven. Los veo sin juicio, sin resistencia, sin huida.',
    code: 'VEO',
  },
  {
    phase: 2,
    name: 'Liberación',
    phrase: 'Suelto lo heredado que no elegí. Devuelvo lo prestado. Libero lo que no soy.',
    code: 'SUELO',
  },
  {
    phase: 3,
    name: 'Reprogramación',
    phrase: 'Siembro la verdad que elijo vivir. Cada pensamiento es una semilla. Cada palabra, un acto creador.',
    code: 'SIEMBRO',
  },
  {
    phase: 4,
    name: 'Sello',
    phrase: 'Sello esta nueva frecuencia en cada célula. Lo que decido aquí, se ancla en mi ser.',
    code: 'SELLO',
  },
  {
    phase: 5,
    name: 'Expansión',
    phrase: 'Expando mi soberanía al mundo. Vivo según la Ley, en Equilibrio, con Justicia, desde el Juicio consciente, en Unidad.',
    code: 'EXPANDO',
  },
];

export const DAY_NAMES = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

// Numerological meaning for numbers 1-7
export const NUMEROLOGY_MEANINGS = {
  1: { title: 'El Iniciador', desc: 'Liderazgo, independencia y nuevo comienzo. La energía del día pide dar el primer paso.' },
  2: { title: 'El Espejo', desc: 'Cooperación, equilibrio y sensibilidad. La energía del día pide armonizar opuestos.' },
  3: { title: 'El Creador', desc: 'Expresión, creatividad y comunicación. La energía del día pide manifestar tu voz.' },
  4: { title: 'El Constructor', desc: 'Estructura, estabilidad y compromiso. La energía del día pide consolidar cimientos.' },
  5: { title: 'El Libre', desc: 'Libertad, cambio y movimiento. La energía del día pide soltar lo establecido.' },
  6: { title: 'El Guardián', desc: 'Responsabilidad, amor y servicio. La energía del día pide cuidar lo que importa.' },
  7: { title: 'El Vidente', desc: 'Espiritualidad, introspección y sabiduría. La energía del día pide mirar hacia adentro.' },
};
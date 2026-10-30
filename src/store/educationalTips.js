// ─── CONSEJOS PEDAGÓGICOS Y SUBLIMINALES SOBRE EL USO DE PANTALLAS ───────────
// Basados en recomendaciones de la Organización Mundial de la Salud (OMS),
// la Academia Americana de Pediatría (AAP) y neurociencia del desarrollo infantil.

export const CHILD_SUBLIMINAL_TIPS = [
  {
    id: 'ct_1',
    icon: '👀',
    tag: 'Salud Visual',
    text: '¿Sabías que parpadeamos 60% menos frente a una pantalla? ¡Pestañea fuerte 5 veces y dale un descanso a tus ojos!',
  },
  {
    id: 'ct_2',
    icon: '💤',
    tag: 'Sueño Reparador',
    text: 'La luz de las pantallas engaña a tu cerebro haciéndole creer que es de día. ¡Apaga 1 hora antes de dormir para tener superpoderes mañana!',
  },
  {
    id: 'ct_3',
    icon: '☀️',
    tag: 'Ojos Fuertes',
    text: 'La luz del sol ayuda a que tus ojos no se cansen tan rápido. ¡Jugar al aire libre previene tener que usar lentes de aumento!',
  },
  {
    id: 'ct_4',
    icon: '🏃',
    tag: 'Energía Real',
    text: 'Correr y saltar libera dopamina natural, ¡la misma alegría de ganar un videojuego, pero con músculos de acero!',
  },
  {
    id: 'ct_5',
    icon: '🧠',
    tag: 'Supercerebro',
    text: 'Los mejores campeones del mundo duermen 9 horas completas. Durante el sueño, tu cerebro guarda todo lo que aprendiste.',
  },
  {
    id: 'ct_6',
    icon: '📖',
    tag: 'Imaginación',
    text: 'Al leer un libro, tu cerebro inventa los gráficos en 4K en tu mente. ¡Es el motor gráfico más potente que existe!',
  },
  {
    id: 'ct_7',
    icon: '⏱️',
    tag: 'Regla 20-20-20',
    text: 'Cada 20 minutos de pantalla, mira un punto a 6 metros de distancia durante 20 segundos. ¡Tus ojos te lo agradecerán!',
  },
  {
    id: 'ct_8',
    icon: '🌳',
    tag: 'Vida Real',
    text: 'Las mejores aventuras no tienen batería ni se actualizan: ¡se viven jugando con amigos en el parque o en casa!',
  },
];

export const PARENT_NEURO_TIPS = [
  {
    id: 'pt_1',
    category: 'neurociencia',
    title: 'Dopamina Rápida y Tolerancia a la Frustración',
    text: 'Los videos cortos (menos de 60s) hiperestimulan la corteza prefrontal con ráfagas continuas de dopamina sin esfuerzo. Esto dificulta la paciencia para tareas escolares de concentración sostenida.',
    action: 'Incentivar lecturas de al menos 15 minutos continuos para reentrenar el foco.',
    tag: 'Neurodesarrollo',
    badge: 'Cerebro',
  },
  {
    id: 'pt_2',
    category: 'sueno',
    title: 'Supresión de Melatonina por Luz Azul (460 nm)',
    text: 'La exposición a pantallas después de las 20:00 suprime hasta un 85% la producción natural de melatonina en menores, retrasando el sueño profundo REM que repara la memoria.',
    action: 'Establecer la regla "Dormitorio Libre de Pantallas" al menos 60 minutos antes de acostarse.',
    tag: 'Ciclo Circadiano',
    badge: 'Sueño',
  },
  {
    id: 'pt_3',
    category: 'vision',
    title: 'Epidemia de Miopía y Falta de Luz Natural',
    text: 'La OMS advierte que el enfoque cercano constante en pantallas planas sin luz solar triplica el riesgo de miopía precoz en niños de 5 a 12 años.',
    action: 'Garantizar un mínimo de 90 a 120 minutos diarios de juego con luz solar natural.',
    tag: 'Salud Ocular',
    badge: 'Visión',
  },
  {
    id: 'pt_4',
    category: 'emocional',
    title: 'El Aburrimiento como Motor Creativo',
    text: 'Cuando los niños se aburren sin recurrir a una pantalla, se activa la Red Neuronal por Defecto (DMN), responsable de la introspección, resolución de problemas e imaginación.',
    action: 'Resistir el impulso de calmar rabietas o momentos de espera con el teléfono móvil.',
    tag: 'Desarrollo Emocional',
    badge: 'Creatividad',
  },
  {
    id: 'pt_5',
    category: 'familia',
    title: 'Cero Pantallas en la Mesa Familiar',
    text: 'Comer frente a pantallas interrumpe las señales de saciedad del hipotálamo y bloquea el intercambio verbal, reduciendo el vocabulario y la conexión afectiva.',
    action: 'Mantener las comidas como un santuario libre de dispositivos para toda la familia.',
    tag: 'Apego y Nutrición',
    badge: 'Vínculo',
  },
  {
    id: 'pt_6',
    category: 'habitos',
    title: 'La Economía de Esfuerzo Previo (Premack)',
    text: 'Condicionar el ocio digital a la finalización previa de deberes reales fija una estructura de recompensa saludable que previene la adicción a la gratificación instantánea.',
    action: 'Validar las misiones completadas antes de liberar minutos de juego digital.',
    tag: 'Autorregulación',
    badge: 'Hábitos',
  },
];

// ─── ESTÁNDARES PEDIÁTRICOS OFICIALES SEGÚN EDAD (OMS / AAP) ──────────────────
export const PEDIATRIC_STANDARDS = {
  preschool: {
    ageRange: '3 a 5 años',
    minAge: 3,
    maxAge: 5,
    maxScreenMinutesDaily: 60,
    idealScreenMinutesDaily: 45,
    recommendedSleepHours: 11,
    minPhysicalActivityMinutes: 120,
    guideline: 'Contenido de alta calidad exclusivamente, siempre co-visualizado con un adulto. Cero pantallas en soledad.',
    dopamineRisk: 'Alto si se usan dispositivos táctiles sin supervisión.',
  },
  school: {
    ageRange: '6 a 12 años',
    minAge: 6,
    maxAge: 12,
    maxScreenMinutesDaily: 90,
    idealScreenMinutesDaily: 60,
    recommendedSleepHours: 10,
    minPhysicalActivityMinutes: 60,
    guideline: 'Ocio digital regulado por misiones y acuerdos. Nunca durante comidas ni 1 hora antes de dormir.',
    dopamineRisk: 'Moderado a Alto con videojuegos online competitivos y redes.',
  },
  teen: {
    ageRange: '13+ años',
    minAge: 13,
    maxAge: 17,
    maxScreenMinutesDaily: 120,
    idealScreenMinutesDaily: 90,
    recommendedSleepHours: 9,
    minPhysicalActivityMinutes: 60,
    guideline: 'Foco en pensamiento crítico y autocontrol. Prioridad al rendimiento escolar y desconexión nocturna.',
    dopamineRisk: 'Alto por algoritmos de redes sociales y gratificación social virtual.',
  },
};

export const getPediatricStandardForAge = (age = 8) => {
  const numericAge = parseInt(age, 10) || 8;
  if (numericAge <= 5) return PEDIATRIC_STANDARDS.preschool;
  if (numericAge <= 12) return PEDIATRIC_STANDARDS.school;
  return PEDIATRIC_STANDARDS.teen;
};

// ─── CATEGORÍAS DE INVERSIÓN DE TIEMPO DE PANTALLA ───────────────────────────
export const SCREEN_INVESTMENT_CATEGORIES = [
  {
    id: 'videojuegos',
    label: 'Videojuegos',
    icon: '🎮',
    examples: 'Roblox, Minecraft, Consola',
    color: '#8B5CF6',
    healthImpact: 'Alto estímulo de dopamina. Requiere pausas activas cada 20 min.',
  },
  {
    id: 'videos',
    label: 'Videos / Streaming',
    icon: '🎬',
    examples: 'YouTube, Películas, Series',
    color: '#EF4444',
    healthImpact: 'Consumo pasivo. Evitar antes de ir a dormir.',
  },
  {
    id: 'educativo',
    label: 'Educativo / Escolar',
    icon: '📚',
    examples: 'Tareas en PC, Lectura digital, Idiomas',
    color: '#10B981',
    healthImpact: 'Consumo activo constructivo. Menor sobreestimulación.',
  },
  {
    id: 'social',
    label: 'Redes / Mensajes',
    icon: '💬',
    examples: 'WhatsApp con familia, Discord con amigos',
    color: '#3B82F6',
    healthImpact: 'Interacción social. Vigilar privacidad y horario nocturno.',
  },
  {
    id: 'creatividad',
    label: 'Creatividad Digital',
    icon: '🎨',
    examples: 'Dibujo digital, Edición, Música, Programación',
    color: '#F59E0B',
    healthImpact: 'Estimula la corteza creadora. Recomendable con buena postura.',
  },
];

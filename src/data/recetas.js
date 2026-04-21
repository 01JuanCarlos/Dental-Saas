export const recetasData = {
  periodoncia: {
    p: '',
    i: 'Realizar enjuagues con 5 ml de VITIS sin diluir, durante 30 segundos, como mínimo 2 veces al día después de cada cepillado.\n\nPara una mayor eficacia es recomendable no mezclar con agua y evitar comer o beber inmediatamente después de su uso.',
  },
  alveolitis: {
    p: '-Amoxicilina 500 mg más ácido clavulánico 125 mg x 5 días.\n15 tabletas cada 8 horas \n\n- Etoricoxib 120 mg  una vez al día x 3 días.\n- Después de cada comida.',
    i: '',
  },
  extraccion_adulto: {
    p: '- Amoxicilina 500 mg x 5 días # 15 tabletas cada 8 horas \n\n- Dolocordralan extraforte x 2 días # 6 tabletas cada 8 horas.\n\n Después de cada comida ',
    i: 'Evitar:\n- Fumar\n- Escupir las primeras 24 hrs.\n- Actividad física por 3 días.\n- Sol y comidas picantes.\n\nDieta:\n- Helado.\n- Verduras al vapor.\n- Dieta blanda.',
  },
  'extraccion_nino_5-6': {
    p: '- Jarabe Amoxicilina 250 mg x 5 días: 7 ml cada 8 horas.\n\n- Jarabe Ibuprofeno 100 mg x 2 días: 7 ml cada 8 horas.\n\n Las dos juntas después de cada comida.',
    i: '',
  },
  extraccion_nino_2: {
    p: '- Amoxicilina 250 mg x 5 días: 5 ml cada 8 horas.\n- Ibuprofeno 100 mg x 2 días: 5 ml cada 8 horas.\n\n Las dos juntas después de cada comida.',
    i: '',
  },
}

export const PROCEDIMIENTOS = [
  { value: '', label: 'Seleccionar...' },
  { value: 'extraccion', label: 'Extracción Dental' },
  { value: 'periodoncia', label: 'Periodoncia' },
  { value: 'alveolitis', label: 'Alveolitis' },
]

export const RANGOS_NINO = [
  { value: '5-6', label: '5 a 6 años' },
  { value: '2', label: '2 años' },
]

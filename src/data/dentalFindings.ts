export type FindingVariant = 'blue' | 'red' | 'single'

export interface FindingAction {
  variant: FindingVariant
  icon: string
}

export interface DentalShortcut {
  id: string
  label: string
  icon: string
}

export interface DentalFinding {
  id: string
  label: string
  abbreviation?: string
  aliases?: string[]
  actions: FindingAction[]
  options?: string[]
}

const s = (name: string) => `/odontogram/symbols/${name}`

export const OPTION_ABBREVIATIONS: Record<string, string> = {
  // Defectos esmalte
  'Decoloración del Esmalte': 'D',
  'Fluorosis': 'Fluorosis',
  'Hipo mineralización': 'HM',
  'Hipoplasia': 'HP',
  'Opacidades del Esmalte': 'O',

  // Caries
  'Mancha Blanca': 'MB',
  'a nivel del esmalte': 'E',
  'a nivel de la dentina': 'D',
  'a nivel de la dentina/compromiso de la pulpa': 'DP',
  'a nivel cervical': 'C',
  
  // Restauraciones
  'Amalgama dental': 'AM',
  'Resina': 'R',
  'Ionómero de vidrio': 'IV',
  'Incrustación metálica': 'IM',
  'Incrustación estética': 'IE',
  'Carilla estética': 'CE',
  
  // Superficies
  'Vestibular': 'V',
  'Lingual': 'L',
  'Palatina': 'P',
  'Oclusal': 'O',
  'Incisal': 'I',
  'Mesial': 'M',
  'Distal': 'D',
}

export const dentalShortcuts: DentalShortcut[] = [
  { id: 'caries', label: 'Caries', icon: s('lesion_caries.svg') },
  { id: 'restau-ok', label: 'Restauración buen estado', icon: s('Group_1000002391.svg') },
  { id: 'restau-nok', label: 'Restauración mal estado', icon: s('Group_1000002390.svg') },
]

export function shortcutToFinding(shortcutId: string): { finding: DentalFinding; action: FindingAction } | null {
  const shortcut = dentalShortcuts.find((sc) => sc.id === shortcutId)
  if (!shortcut) return null

  const variant: FindingVariant =
    shortcutId === 'restau-ok' ? 'blue' : shortcutId === 'restau-nok' || shortcutId === 'caries' ? 'red' : 'single'

  return {
    finding: { id: shortcut.id, label: shortcut.label, actions: [{ variant, icon: shortcut.icon }] },
    action: { variant, icon: shortcut.icon },
  }
}

export const dentalFindings: DentalFinding[] = [
  {
    id: 'ortodoncia-fijo',
    label: 'Aparato ortodóntico fijo',
    actions: [
      { variant: 'blue', icon: s('thumbnails31_ortodontico_fijo_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails31_ortodontico_fijo_nok_thumb.svg') },
    ],
  },
  {
    id: 'ortodoncia-removible',
    label: 'Aparato ortodóntico removible',
    actions: [
      { variant: 'blue', icon: s('thumbnails32_ortodon_rem_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails32_ortodon_rem_nok_thumb.svg') },
    ],
  },
  {
    id: 'carillas',
    label: 'Carillas',
    actions: [
      { variant: 'red', icon: s('thumbnaile1_carillas_nok_thumb.svg') },
      { variant: 'blue', icon: s('thumbnaile1_carillas_ok_thumb.svg') },
    ],
  },
  {
    id: 'carillas-varios',
    label: 'Carillas varios',
    actions: [
      { variant: 'blue', icon: s('thumbnaile1_carillas_varios_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnaile1_carillas_varios_nok_thumb.svg') },
    ],
  },
  {
    id: 'corona',
    label: 'Corona',
    actions: [
      { variant: 'blue', icon: s('thumbnails28_corona_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails28_corona_nok_thumb.svg') },
    ],
  },
  {
    id: 'corona-temporal',
    label: 'Corona temporal',
    abbreviation: 'CT',
    actions: [{ variant: 'single', icon: s('thumbnails27_corona_temporal_thumb.svg') }],
  },
  {
    id: 'defectos-esmalte',
    label: 'Defectos de desarrollo de esmalte',
    actions: [{ variant: 'single', icon: s('t_c7_defecto_de_esmalte_thu.svg') }],
  },
  {
    id: 'diastema',
    label: 'Diastema',
    actions: [{ variant: 'single', icon: s('thumbnails14_diastema_thumb.svg') }],
  },
  {
    id: 'edentulo-total',
    label: 'Edéntulo total',
    actions: [{ variant: 'single', icon: s('thumbnails10_edentulo_total_thumb.svg') }],
  },
  {
    id: 'endodoncia',
    label: 'Endodoncia',
    actions: [
      { variant: 'blue', icon: s('t_thumbnaile4_endodoncia_ok_thumb.svg') },
      { variant: 'red', icon: s('t_thumbnaile4_endodoncia_not_thumb.svg') },
    ],
  },
  {
    id: 'espigo-munon',
    label: 'Espigo - muñón',
    actions: [
      { variant: 'blue', icon: s('thumbnails29_espigo_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails29_espigo_nok_thumb.svg') },
    ],
  },
  {
    id: 'extraccion',
    label: 'Extracción',
    actions: [{ variant: 'single', icon: s('thumbnaile6_extraccion_thumb.svg') }],
  },
  {
    id: 'fosa-fisuras',
    label: 'Fosa y fisuras profundas',
    abbreviation: 'FFP',
    actions: [
      { variant: 'blue', icon: s('thumbnailfosas_fisuras_ok.svg') },
      { variant: 'red', icon: s('thumbnailfosas_fisuras_nok.svg') },
    ],
  },
  {
    id: 'fractura',
    label: 'Fractura',
    actions: [{ variant: 'single', icon: s('thumbnails4_fractura_thumb.svg') }],
  },
  {
    id: 'frenillo-corto',
    label: 'Frenillo corto',
    actions: [{ variant: 'single', icon: s('t_e8_frenillo_thumbnail.svg') }],
  },
  {
    id: 'fusion',
    label: 'Fusión',
    actions: [{ variant: 'single', icon: s('thumbnails21_fusion_thumb.svg') }],
  },
  {
    id: 'geminacion',
    label: 'Geminación',
    actions: [{ variant: 'single', icon: s('thumbnails22_geminacion_thumb.svg') }],
  },
  {
    id: 'gingivitis',
    label: 'Gingivitis',
    actions: [{ variant: 'single', icon: s('t_gingivitis_thumbnail.svg') }],
  },
  {
    id: 'giroversion',
    label: 'Giroversión',
    actions: [
      { variant: 'blue', icon: s('thumbnails15_giroversion_thumb.svg') },
      { variant: 'blue', icon: s('thumbnails15_giroversion_b_thumb.svg') },
    ],
  },
  { id: 'impactacion', label: 'Impactación', abbreviation: 'I', actions: [{ variant: 'blue', icon: '' }] },
  {
    id: 'implante',
    label: 'Implante dental',
    actions: [
      { variant: 'blue', icon: s('t_e12_implante_minsa_ok.svg') },
      { variant: 'red', icon: s('t_e12_implante_minsa_nok.svg') },
    ],
  },
  {
    id: 'lesion-cervical',
    label: 'Lesión cervical',
    actions: [
      { variant: 'blue', icon: s('t_e5_lesion_cervical_ok_thumb.svg') },
      { variant: 'red', icon: s('t_e5_lesion_cervical_nok_thumb.svg') },
    ],
  },
  { id: 'macrodoncia', label: 'Macrodoncia', abbreviation: 'MAC', actions: [{ variant: 'blue', icon: '' }] },
  { id: 'microdoncia', label: 'Microdoncia', abbreviation: 'MIC', actions: [{ variant: 'blue', icon: '' }] },
  { id: 'movilidad', label: 'Movilidad patológica', actions: [{ variant: 'red', icon: '' }] },
  { id: 'no-erupcionado', label: 'No erupcionado', abbreviation: 'NE', actions: [{ variant: 'blue', icon: '' }] },
  {
    id: 'perno-fibra',
    label: 'Perno de fibra',
    actions: [
      { variant: 'blue', icon: s('thumbnailnew_perno_fibra_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnailnew_perno_fibra_nok_thumb.svg') },
    ],
  },
  {
    id: 'perno-metalico',
    label: 'Perno metálico',
    actions: [
      { variant: 'blue', icon: s('t_e3_perno_metalico_ok_thumbnail.svg') },
      { variant: 'red', icon: s('t_e3_perno_metalico_nok_thumbnail.svg') },
    ],
  },
  {
    id: 'pieza-extruida',
    label: 'Pieza dental extruida',
    actions: [{ variant: 'blue', icon: s('thumbnails12_extruido_thumb.svg') }],
  },
  {
    id: 'pieza-intruida',
    label: 'Pieza dental intruida',
    actions: [{ variant: 'blue', icon: s('thumbnails13_intruido_thumb.svg') }],
  },
  {
    id: 'pieza-intruida-anquilosis',
    label: 'Pieza dental intruida - anquilosis',
    actions: [{ variant: 'blue', icon: s('t_s13_intruido_thumbnail.svg') }],
  },
  {
    id: 'supernumeraria',
    label: 'Pieza dental supernumeraría',
    actions: [{ variant: 'blue', icon: s('thumbnails11_supernumerario_thumb.svg') }],
  },
  {
    id: 'pieza-ausente',
    label: 'Pieza dentaria ausente',
    actions: [{ variant: 'blue', icon: s('thumbnails6_pieza_ausente_thumb.svg') }],
  },
  { id: 'discromico', label: 'Pieza dentaria discromico', abbreviation: 'PDD', actions: [{ variant: 'blue', icon: '' }] },
  { id: 'ectopica', label: 'Pieza dentaria ectópica', abbreviation: 'PDE', actions: [{ variant: 'blue', icon: '' }] },
  {
    id: 'clavija',
    label: 'Pieza dentaria en clavija',
    actions: [{ variant: 'blue', icon: s('thumbnails17_clavija_thumb.svg') }],
  },
  {
    id: 'erupcion',
    label: 'Pieza dentaria en erupción',
    actions: [{ variant: 'blue', icon: s('thumbnails7_pieza_erupcion_thumb.svg') }],
  },
  { id: 'posicion', label: 'Posición dentaria', actions: [{ variant: 'blue', icon: '' }] },
  {
    id: 'protesis-fija',
    label: 'Prótesis fija',
    actions: [
      { variant: 'blue', icon: s('thumbnails33_protesis_fija_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails33_protesis_fija_nok_thumb.svg') },
    ],
  },
  {
    id: 'protesis-removible',
    label: 'Prótesis removible',
    actions: [
      { variant: 'blue', icon: s('thumbnails34_protesis_removible_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails34_protesis_removible_nok_thumb.svg') },
    ],
  },
  {
    id: 'protesis-total',
    label: 'Prótesis total',
    actions: [
      { variant: 'blue', icon: s('thumbnails35_protesis_total_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails35_protesis_total_nok_thumb.svg') },
    ],
  },
  {
    id: 'pulpectomia',
    label: 'Pulpectomía',
    actions: [
      { variant: 'blue', icon: s('t_thumbnaile4_endodoncia_ok_thumb.svg') },
      { variant: 'red', icon: s('t_thumbnaile4_endodoncia_not_thumb.svg') },
    ],
  },
  {
    id: 'pulpotomia',
    label: 'Pulpotomía',
    abbreviation: 'PP',
    actions: [
      { variant: 'blue', icon: s('t_pulpotomia_thumbnail_blue.svg') },
      { variant: 'red', icon: s('t_pulpotomia_symbol_thumbnail.svg') },
    ],
  },
  { id: 'remanente-radicular', label: 'Remanente radicular', abbreviation: 'RR', actions: [{ variant: 'red', icon: '' }] },
  {
    id: 'restauracion-temporal',
    label: 'Restauración temporal',
    actions: [{ variant: 'red', icon: s('thumbnails8_restauracion_temporal_nok_thumb.svg') }],
  },
  {
    id: 'sellantes',
    label: 'Sellantes',
    abbreviation: 'S',
    actions: [
      { variant: 'blue', icon: s('thumbnails3_sellante_ok_thumb.svg') },
      { variant: 'red', icon: s('thumbnails3_sellante_nok_thumb.svg') },
    ],
  },
  { id: 'superficie-desgastada', label: 'Superficie desgastada', abbreviation: 'SD', actions: [{ variant: 'red', icon: '' }] },
  {
    id: 'trat-pulpar',
    label: 'Trat. pulpar (conducto)',
    actions: [
      { variant: 'blue', icon: '' },
      { variant: 'red', icon: '' },
    ],
  },
]

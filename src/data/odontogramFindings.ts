export type FindingIconType = 'bracket' | 'removable' | 'veneer' | 'crown' | 'extract' | 'implant'

export interface OdontogramFinding {
  id: string
  label: string
  iconType: FindingIconType
}

export const odontogramFindings: OdontogramFinding[] = [
  { id: 'ortodoncia-fijo', label: 'Aparato ortodóntico fijo', iconType: 'bracket' },
  { id: 'ortodoncia-removible', label: 'Aparato ortodóntico removible', iconType: 'removable' },
  { id: 'carillas', label: 'Carillas', iconType: 'veneer' },
  { id: 'corona', label: 'Corona', iconType: 'crown' },
  { id: 'caries', label: 'Caries', iconType: 'crown' },
  { id: 'restauracion', label: 'Restauración', iconType: 'crown' },
  { id: 'extraccion', label: 'Extracción indicada', iconType: 'extract' },
  { id: 'implante', label: 'Implante', iconType: 'implant' },
  { id: 'endodoncia', label: 'Endodoncia', iconType: 'crown' },
  { id: 'sellante', label: 'Sellante', iconType: 'veneer' },
  { id: 'puente', label: 'Puente', iconType: 'bracket' },
  { id: 'protesis', label: 'Prótesis removible', iconType: 'removable' },
]

export const upperRightTeeth = [18, 17, 16, 15, 14, 13, 12, 11]
export const upperLeftTeeth = [21, 22, 23, 24, 25, 26, 27, 28]
export const lowerRightTeeth = [48, 47, 46, 45, 44, 43, 42, 41]
export const lowerLeftTeeth = [31, 32, 33, 34, 35, 36, 37, 38]

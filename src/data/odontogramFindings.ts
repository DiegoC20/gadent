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

export const upperRightTeethDeciduous = [55, 54, 53, 52, 51]
export const upperLeftTeethDeciduous = [61, 62, 63, 64, 65]
export const lowerRightTeethDeciduous = [85, 84, 83, 82, 81]
export const lowerLeftTeethDeciduous = [71, 72, 73, 74, 75]

// ──────────────────────────────────────────────────────────────────────────────
// ADA Nomenclature Mapping
// ──────────────────────────────────────────────────────────────────────────────

export const adaMapping: Record<number, string> = {
  // Permanentes Superiores
  18: '01', 17: '02', 16: '03', 15: '04', 14: '05', 13: '06', 12: '07', 11: '08',
  21: '09', 22: '10', 23: '11', 24: '12', 25: '13', 26: '14', 27: '15', 28: '16',
  // Permanentes Inferiores
  48: '32', 47: '31', 46: '30', 45: '29', 44: '28', 43: '27', 42: '26', 41: '25',
  31: '24', 32: '23', 33: '22', 34: '21', 35: '20', 36: '19', 37: '18', 38: '17',
  
  // Deciduos Superiores
  55: 'A', 54: 'B', 53: 'C', 52: 'D', 51: 'E',
  61: 'F', 62: 'G', 63: 'H', 64: 'I', 65: 'J',
  // Deciduos Inferiores
  85: 'T', 84: 'S', 83: 'R', 82: 'Q', 81: 'P',
  71: 'O', 72: 'N', 73: 'M', 74: 'L', 75: 'K',
}

export function getToothLabel(tooth: number, nomenclature: 'Internacional' | 'ADA'): string {
  if (nomenclature === 'ADA') {
    return adaMapping[tooth] ?? tooth.toString()
  }
  return tooth.toString()
}

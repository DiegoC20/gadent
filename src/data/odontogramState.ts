import type { DentalFinding, FindingAction, FindingVariant } from './dentalFindings'

export type ToothSurface = 'oclusal' | 'vestibular' | 'palatino' | 'mesial' | 'distal'

export const SURFACE_LABELS: Record<ToothSurface, string> = {
  oclusal: 'Oclusal',
  vestibular: 'Vestibular',
  palatino: 'Palatino',
  mesial: 'Mesial',
  distal: 'Distal',
}

export interface AppliedFinding {
  id: string
  findingId: string
  label: string
  variant: FindingVariant
  icon: string
  surfaces?: ToothSurface[]  // Caras afectadas: todas en un solo AppliedFinding
  option?: string            // Sub-tipo seleccionado (ej. 'a nivel del esmalte')
}

export type ToothFindingsMap = Record<number, AppliedFinding[]>

export function createAppliedFinding(
  tooth: number,
  finding: DentalFinding,
  action: FindingAction,
): AppliedFinding {
  return {
    id: `${tooth}-${finding.id}-${action.variant}-${Date.now()}`,
    findingId: finding.id,
    label: finding.label,
    variant: action.variant,
    icon: action.icon,
  }
}

export function variantDotColor(variant: FindingVariant): string {
  if (variant === 'blue') return 'bg-blue-500'
  if (variant === 'red') return 'bg-red-500'
  return 'bg-gray-400'
}

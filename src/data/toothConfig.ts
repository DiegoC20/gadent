export type ToothCrownType =
  | 'molar-upper'
  | 'molar-lower'
  | 'premolar-single'
  | 'premolar-double'
  | 'anterior'

export interface ToothShapeConfig {
  crownType: ToothCrownType
}

const upperMolars = new Set([18, 17, 16, 26, 27, 28, 55, 54, 64, 65])
const lowerMolars = new Set([48, 47, 46, 36, 37, 38, 85, 84, 74, 75])
const premolarSingle = new Set([15, 25, 45, 35, 44, 34])
const premolarDouble = new Set([14, 24])
const anteriors = new Set([
  11, 12, 13, 21, 22, 23, 41, 42, 43, 31, 32, 33,
  51, 52, 53, 61, 62, 63, 81, 82, 83, 71, 72, 73,
])

export function getToothConfig(number: number): ToothShapeConfig {
  if (upperMolars.has(number)) return { crownType: 'molar-upper' }
  if (lowerMolars.has(number)) return { crownType: 'molar-lower' }
  if (premolarSingle.has(number)) return { crownType: 'premolar-single' }
  if (premolarDouble.has(number)) return { crownType: 'premolar-double' }
  if (anteriors.has(number)) return { crownType: 'anterior' }
  return { crownType: 'premolar-single' }
}

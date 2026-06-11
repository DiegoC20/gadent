import {
  upperRightTeeth,
  upperLeftTeeth,
  lowerRightTeeth,
  lowerLeftTeeth,
} from './odontogramFindings'
import type { FindingVariant } from './dentalFindings'

// ──────────────────────────────────────────────────────────────────────────────
// Tipos
// ──────────────────────────────────────────────────────────────────────────────

export type OrthoRole = 'begin' | 'medium' | 'end'
export type OrthoType = 'fijo' | 'removible' | 'carillas-varios' | 'edentulo-total' | 'protesis-fija' | 'protesis-removible' | 'protesis-total'

/** Un grupo de dientes conectados por un aparato ortodóntico */
export interface OrthoGroup {
  id: string
  type: OrthoType
  variant: FindingVariant        // 'blue' | 'red'
  findingId: string              // 'ortho-ok' | 'ortho-nok' | 'ortho-rem-ok' ...
  label: string
  /** Dientes ordenados tal como aparecen en la fila (izquierda → derecha) */
  teeth: number[]
}

/** Estado transitorio mientras el usuario selecciona el segundo diente */
export interface PendingOrtho {
  startTooth: number
  type: OrthoType
  variant: FindingVariant
  findingId: string
}

// ──────────────────────────────────────────────────────────────────────────────
// Constantes
// ──────────────────────────────────────────────────────────────────────────────

/** Orden visual completo de cada arco (izquierda → derecha) */
export const UPPER_ROW: number[] = [...upperRightTeeth, ...upperLeftTeeth]
export const LOWER_ROW: number[] = [...lowerRightTeeth, ...lowerLeftTeeth]

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────

/** Devuelve en qué arco vive el diente ('upper' | 'lower' | null) */
export function getToothArch(tooth: number): 'upper' | 'lower' | null {
  if (UPPER_ROW.includes(tooth)) return 'upper'
  if (LOWER_ROW.includes(tooth)) return 'lower'
  return null
}

/**
 * Calcula todos los dientes que quedan entre dos dientes en el mismo arco,
 * en el orden visual de la fila (izquierda → derecha).
 * Devuelve null si los dos dientes no están en el mismo arco.
 */
export function getTeethBetween(a: number, b: number): number[] | null {
  const archA = getToothArch(a)
  const archB = getToothArch(b)
  if (!archA || archA !== archB) return null

  const row = archA === 'upper' ? UPPER_ROW : LOWER_ROW
  const idxA = row.indexOf(a)
  const idxB = row.indexOf(b)
  const lo = Math.min(idxA, idxB)
  const hi = Math.max(idxA, idxB)
  return row.slice(lo, hi + 1)
}

/**
 * Determina el rol visual de un diente dentro de su grupo orthodóntico.
 * 'begin' = izquierda (primer elemento de `group.teeth`)
 * 'end'   = derecha  (último elemento)
 * 'medium'= cualquier diente intermedio
 */
export function getOrthoRole(tooth: number, group: OrthoGroup): OrthoRole {
  if (group.teeth[0] === tooth) return 'begin'
  if (group.teeth[group.teeth.length - 1] === tooth) return 'end'
  return 'medium'
}

/** Retorna la ruta al SVG local correspondiente */
export function getOrthoIcon(group: OrthoGroup, role: OrthoRole): string {
  const color = group.variant === 'blue' ? 'blue' : 'red'
  if (group.type === 'removible') {
    return `/odontogram/ortho/removable/${color}.svg`
  }
  return `/odontogram/ortho/${color}-${role}.svg`
}


import { useState } from 'react'
import { createPortal } from 'react-dom'
import type { DentalFinding, FindingAction } from '../../data/dentalFindings'
import { dentalFindings, dentalShortcuts, shortcutToFinding } from '../../data/dentalFindings'

interface MultipleMarkingPopoverProps {
  anchorRef: React.RefObject<HTMLButtonElement | null>
  onClose: () => void
  onSelectFinding: (finding: DentalFinding, action: FindingAction) => void
}

// ──────────────────────────────────────────────────────────────────────────────
// Subcomponentes
// ──────────────────────────────────────────────────────────────────────────────
function ActionButton({
  action,
  label,
  onClick,
  disabled,
  disabledMessage,
}: {
  action: FindingAction
  label: string
  onClick: () => void
  disabled?: boolean
  disabledMessage?: string
}) {
  return (
    <button
      type="button"
      onClick={disabled ? undefined : onClick}
      title={disabled ? disabledMessage : label}
      disabled={disabled}
      className={`flex h-7 w-7 items-center justify-center rounded text-xs font-semibold transition ${
        disabled
          ? 'opacity-40 cursor-not-allowed bg-gray-100 text-gray-500'
          : `hover:scale-110 ${
              action.variant === 'red'
                ? 'bg-red-100 text-red-700 hover:bg-red-200'
                : action.variant === 'blue'
                  ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`
      }`}
      aria-label={`${action.variant} – ${label}`}
    >
      {action.icon ? (
        <img src={action.icon} alt="" className="h-4 w-5 object-contain" />
      ) : (
        <span>{action.variant === 'red' ? 'R' : action.variant === 'blue' ? 'A' : 'S'}</span>
      )}
    </button>
  )
}

// ──────────────────────────────────────────────────────────────────────────────
// Componente principal
// ──────────────────────────────────────────────────────────────────────────────
function MultipleMarkingPopover({
  anchorRef,
  onClose,
  onSelectFinding,
}: MultipleMarkingPopoverProps) {
  const [search, setSearch] = useState('')

  const filtered = search.trim()
    ? dentalFindings.filter(
        (f) =>
          f.label.toLowerCase().includes(search.toLowerCase()) ||
          f.aliases?.some((a) => a.toLowerCase().includes(search.toLowerCase())),
      )
    : dentalFindings

  function handleShortcut(shortcutId: string) {
    const mapped = shortcutToFinding(shortcutId)
    if (mapped) { onSelectFinding(mapped.finding, mapped.action); onClose() }
  }

  // ── Posicionamiento ─────────────────────────────────────────────────────────
  const anchor = anchorRef.current?.getBoundingClientRect()
  if (!anchor) return null

  // Por defecto se abre debajo del botón
  let finalPlacement = 'below'
  if (anchor.bottom + 350 > window.innerHeight) {
    finalPlacement = 'above'
  }

  const top =
    finalPlacement === 'above'
      ? anchor.top + window.scrollY - 8
      : anchor.bottom + window.scrollY + 8
  const left = anchor.left + window.scrollX + anchor.width / 2
  const translateY = finalPlacement === 'above' ? '-100%' : '0%'

  return createPortal(
    <div className="fixed inset-0 z-[9999]" onClick={onClose}>
      <div
        className="absolute w-72 rounded-xl border border-gray-200 bg-white shadow-xl"
        style={{ top, left, transform: `translateX(-50%) translateY(${translateY})` }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── AGREGAR ─────────────────────────────────────────────────── */}
            {/* Shortcuts */}
            <div className="border-b border-gray-100 px-3 py-2">
              <div className="flex gap-2">
                {dentalShortcuts.map((sc) => (
                  <button
                    key={sc.id}
                    type="button"
                    className="cursor-pointer"
                    title={sc.label}
                    onClick={() => {
                      handleShortcut(sc.id)
                    }}
                  >
                    <img src={sc.icon} alt={sc.label} className="w-14 object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Buscador */}
            <div className="border-b border-gray-100 px-4 py-2">
              <div className="flex items-center rounded-lg border border-gray-300 px-4 py-1 focus-within:border-cyan-400 focus-within:ring-1 focus-within:ring-cyan-400">
                <svg
                  className="mr-2 h-3.5 w-3.5 shrink-0 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.35-4.35" />
                </svg>
                <input
                  type="text"
                  placeholder="Buscar hallazgo"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
                  autoFocus
                />
              </div>
            </div>

            {/* Lista de hallazgos */}
            <ul className="max-h-60 overflow-y-auto py-1">
              {filtered.map((finding) => {
                const isRangeFinding = [
                  'ortodoncia-fijo',
                  'ortodoncia-removible',
                  'carillas-varios',
                  'edentulo-total',
                  'protesis-fija',
                  'protesis-removible',
                  'protesis-total',
                ].includes(finding.id)

                return (
                  <li
                    key={finding.id}
                    className="flex items-center justify-between gap-2 px-4 py-2 hover:bg-gray-50"
                  >
                    <span className={`flex-1 text-sm ${isRangeFinding ? 'text-gray-400' : 'text-gray-700'}`}>
                      {finding.label}
                    </span>
                    <div className="flex gap-1">
                      {finding.actions.map((action, i) => (
                        <ActionButton
                          key={`${finding.id}-${i}`}
                          action={action}
                          label={finding.label}
                          disabled={isRangeFinding}
                          disabledMessage="El marcado múltiple aplica solo para hallazgos que se marcan individuales a cada diente."
                          onClick={() => {
                            onSelectFinding(finding, action)
                            onClose()
                          }}
                        />
                      ))}
                    </div>
                  </li>
                )
              })}
            </ul>
      </div>
    </div>,
    document.body,
  )
}

export default MultipleMarkingPopover

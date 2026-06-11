import { useEffect, useRef, useState } from 'react'

interface ToothNoteBoxProps {
  toothNumber: number
}

function ToothNoteBox({ toothNumber }: ToothNoteBoxProps) {
  const [open, setOpen] = useState(false)
  const [note, setNote] = useState('')
  const boxRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClickOutside(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [open])

  return (
    <div ref={boxRef} className="group relative">
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          setOpen((v) => !v)
        }}
        className="h-4 w-9 rounded-sm border border-gray-300 bg-white transition-colors hover:border-cyan-400 hover:bg-cyan-50"
        aria-label={`Agregar nota al diente ${toothNumber}`}
      >
        {note && <span className="block h-full w-full rounded-sm bg-yellow-100" />}
      </button>
      {!open && (
        <span className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1 -translate-x-1/2 whitespace-nowrap rounded bg-gray-800 px-2 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
          Agregar Nota
        </span>
      )}

      {open && (
        <div className="absolute left-1/2 z-[10000] mt-1 w-44 -translate-x-1/2 rounded-lg border border-gray-200 bg-white p-2 shadow-xl">
          <p className="mb-1 text-[10px] font-medium text-gray-500">Nota — diente {toothNumber}</p>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full resize-none rounded border border-gray-300 p-1.5 text-xs outline-none focus:border-cyan-400"
            placeholder="Escribe una nota..."
            autoFocus
          />
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="mt-1 w-full rounded bg-[#408a97] py-1 text-xs text-white hover:bg-[#357580]"
          >
            Guardar
          </button>
        </div>
      )}
    </div>
  )
}

export default ToothNoteBox

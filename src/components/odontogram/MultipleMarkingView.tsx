import type { DentalFinding, FindingAction } from '../../data/dentalFindings'
import {
  lowerLeftTeeth,
  lowerRightTeeth,
  upperLeftTeeth,
  upperRightTeeth,
} from '../../data/odontogramFindings'
import type { ToothFindingsMap, ToothSurface } from '../../data/odontogramState'
import ToothPartsSvg from './ToothPartsSvg'
import ToothSvg from './ToothSvg'
import type { SurfaceModalType } from './SurfaceModal'

export interface MultipleMarkingTarget {
  finding: DentalFinding
  action: FindingAction
}

interface MultipleMarkingViewProps {
  target: MultipleMarkingTarget
  toothFindings: ToothFindingsMap
  onToggleSurface: (tooth: number, type: SurfaceModalType, surface: ToothSurface) => void
}

function getSurfaceModalType(target: MultipleMarkingTarget): string {
  // Mapping de shortcuts/findings a type. Usamos el id directamente.
  return target.finding.id
}

export function getDisplayColor(target: MultipleMarkingTarget): string {
  if (target.action.variant === 'blue') return '#3b82f6'
  if (target.action.variant === 'red') return '#ef4444'
  return '#3b82f6'
}

export function getDisplayLabel(target: MultipleMarkingTarget): string {
  if (target.finding.id === 'caries') return 'Lesión de caries'
  if (target.finding.id === 'restau-ok') return 'Restauración definitiva en buen estado'
  if (target.finding.id === 'restau-nok') return 'Restauración definitiva en mal estado'
  return target.finding.label
}

function MultipleMarkingView({ target, toothFindings, onToggleSurface }: MultipleMarkingViewProps) {
  const type = getSurfaceModalType(target)
  const color = getDisplayColor(target)

  const upperTeeth = [...upperRightTeeth, ...upperLeftTeeth]
  const lowerTeeth = [...lowerRightTeeth, ...lowerLeftTeeth]

  function getSelectedSurfacesForTooth(tooth: number): ToothSurface[] {
    const findings = toothFindings[tooth] ?? []
    const applied = findings.find((f) => f.findingId === type)
    return applied?.surfaces ?? []
  }

  function handleToggle(tooth: number, surface: ToothSurface) {
    onToggleSurface(tooth, type as SurfaceModalType, surface)
  }

  const isSurfaceMode = target.finding.id === 'caries' || target.finding.id === 'restau-ok' || target.finding.id === 'restau-nok'

  function handleWholeToggle(tooth: number) {
    onToggleSurface(tooth, type as SurfaceModalType, 'completo' as any)
  }

  return (
    <div className="w-full bg-white animate-fade-in pt-6 pb-2">
      {/* Dientes */}
      <div className="flex flex-col gap-8 px-2 sm:px-6 w-full">
        {/* Fila Superior */}
        <div className="flex justify-between gap-1">
          {upperTeeth.map((tooth) => {
            const isSelected = isSurfaceMode 
              ? getSelectedSurfacesForTooth(tooth).length > 0 
              : (toothFindings[tooth] ?? []).some(f => f.findingId === type)
              
            return (
              <div 
                key={tooth} 
                className={`flex flex-1 min-w-0 max-w-[64px] flex-col items-center gap-0.5 p-1 px-1 pb-3 rounded-xl transition-colors ${
                  !isSurfaceMode 
                    ? `cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-cyan-50/50' : ''}`
                    : ''
                }`}
                onClick={() => {
                  if (!isSurfaceMode) handleWholeToggle(tooth)
                }}
              >
                <div 
                  className={`px-2 py-0.5 text-sm border transition-colors ${
                    !isSurfaceMode && isSelected 
                      ? 'bg-[#3e8697] text-white border-[#3e8697]' 
                      : 'text-gray-500 border-gray-200'
                  }`}
                >
                  {tooth}
                </div>
                {isSurfaceMode ? (
                  <ToothPartsSvg
                    selectedSurfaces={getSelectedSurfacesForTooth(tooth)}
                    color={color}
                    onToggle={(surface) => handleToggle(tooth, surface)}
                    size={48}
                  />
                ) : (
                  <div className="w-full">
                    <ToothSvg number={tooth} flipped={false} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        {/* Fila Inferior */}
        <div className="flex justify-between gap-1">
          {lowerTeeth.map((tooth) => {
            const isSelected = isSurfaceMode 
              ? getSelectedSurfacesForTooth(tooth).length > 0 
              : (toothFindings[tooth] ?? []).some(f => f.findingId === type)
              
            return (
              <div 
                key={tooth} 
                className={`flex flex-1 min-w-0 max-w-[64px] flex-col items-center gap-0.5 p-1 px-1 pb-3 rounded-xl transition-colors ${
                  !isSurfaceMode 
                    ? `cursor-pointer hover:bg-gray-100 ${isSelected ? 'bg-cyan-50/50' : ''}`
                    : ''
                }`}
                onClick={() => {
                  if (!isSurfaceMode) handleWholeToggle(tooth)
                }}
              >
                <div 
                  className={`px-2 py-0.5 text-sm border transition-colors ${
                    !isSurfaceMode && isSelected 
                      ? 'bg-[#3e8697] text-white border-[#3e8697]' 
                      : 'text-gray-500 border-gray-200'
                  }`}
                >
                  {tooth}
                </div>
                {isSurfaceMode ? (
                  <ToothPartsSvg
                    selectedSurfaces={getSelectedSurfacesForTooth(tooth)}
                    color={color}
                    onToggle={(surface) => handleToggle(tooth, surface)}
                    size={48}
                  />
                ) : (
                  <div className="w-full">
                    <ToothSvg number={tooth} flipped={true} />
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MultipleMarkingView

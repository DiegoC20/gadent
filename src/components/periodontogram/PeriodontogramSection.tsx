import { useState, useMemo } from 'react'
import teeth01 from '../../assets/teeth-01.jpg'
import teeth02 from '../../assets/teeth-02.jpg'
import teeth03 from '../../assets/teeth-03.jpg'
import teeth04 from '../../assets/teeth-04.jpg'
import PeriodontogramLines from './PeriodontogramLines'
import TreatmentPlanSection from './TreatmentPlanSection'

const UPPER_TEETH = [18, 17, 16, 15, 14, 13, 12, 11, 21, 22, 23, 24, 25, 26, 27, 28]
const LOWER_TEETH = [48, 47, 46, 45, 44, 43, 42, 41, 31, 32, 33, 34, 35, 36, 37, 38]

type SiteData = {
  sangrado: [boolean, boolean, boolean]
  placa: [boolean, boolean, boolean]
  margen: [number, number, number]
  profundidad: [number, number, number]
  nota?: string
}

export type ToothData = {
  movilidad: number
  vestibular: SiteData
  palatinoLingual: SiteData
}

export type PeriodontogramState = Record<number, ToothData>

function createInitialToothData(): ToothData {
  return {
    movilidad: 0,
    vestibular: {
      sangrado: [false, false, false],
      placa: [false, false, false],
      margen: [0, 0, 0],
      profundidad: [0, 0, 0]
    },
    palatinoLingual: {
      sangrado: [false, false, false],
      placa: [false, false, false],
      margen: [0, 0, 0],
      profundidad: [0, 0, 0],
      nota: ''
    }
  }
}

const INITIAL_STATE: PeriodontogramState = [...UPPER_TEETH, ...LOWER_TEETH].reduce((acc, tooth) => {
  acc[tooth] = createInitialToothData()
  return acc
}, {} as PeriodontogramState)

function TriInput({ 
  values, 
  onChange,
  min = -15,
  max = 15,
  highlightThreshold
}: { 
  values: [number, number, number], 
  onChange: (idx: number, val: number) => void,
  min?: number,
  max?: number,
  highlightThreshold?: number
}) {
  const handleChange = (idx: number, rawVal: string) => {
    let val = parseInt(rawVal)
    if (isNaN(val)) val = 0
    if (val < min) val = min
    if (val > max) val = max
    onChange(idx, val)
  }

  return (
    <div className="flex w-full gap-0.5">
      {[0, 1, 2].map(idx => {
        const isHighlighted = highlightThreshold !== undefined && values[idx] >= highlightThreshold
        return (
          <input
            key={idx}
            type="number"
            min={min}
            max={max}
            value={values[idx] === 0 ? '' : values[idx]}
            placeholder="0"
            onChange={e => handleChange(idx, e.target.value)}
            className={`w-full text-center text-xs outline-none focus:bg-gray-100 border border-transparent hover:border-gray-300 h-6 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none ${isHighlighted ? 'text-red-600 font-bold bg-red-50' : 'text-gray-700'}`}
          />
        )
      })}
    </div>
  )
}

function TriCheckbox({ values, onChange }: { values: [boolean, boolean, boolean], onChange: (idx: number, val: boolean) => void }) {
  return (
    <div className="flex w-full gap-0.5 h-6 items-center">
      {[0, 1, 2].map(idx => (
        <div
          key={idx}
          onClick={() => onChange(idx, !values[idx])}
          className={`flex-1 h-4 cursor-pointer border border-gray-300 rounded-sm mx-px ${values[idx] ? 'bg-red-500' : 'bg-gray-100 hover:bg-gray-200'}`}
        />
      ))}
    </div>
  )
}

export default function PeriodontogramSection() {
  const [data, setData] = useState<PeriodontogramState>(INITIAL_STATE)
  const [activeTab, setActiveTab] = useState<'periodontograma' | 'tratamiento'>('periodontograma')

  // Calculate Indice de Placa (%IP) and Sangrado (%SAS)
  const { ip, sas } = useMemo(() => {
    let totalSites = 0
    let plaqueCount = 0
    let bleedingCount = 0

    Object.values(data).forEach(tooth => {
      totalSites += 6 // 3 vestibular + 3 palatinoLingual
      tooth.vestibular.placa.forEach(p => p && plaqueCount++)
      tooth.palatinoLingual.placa.forEach(p => p && plaqueCount++)
      tooth.vestibular.sangrado.forEach(s => s && bleedingCount++)
      tooth.palatinoLingual.sangrado.forEach(s => s && bleedingCount++)
    })

    return {
      ip: totalSites === 0 ? 0 : (plaqueCount / totalSites) * 100,
      sas: totalSites === 0 ? 0 : (bleedingCount / totalSites) * 100
    }
  }, [data])

  const updateTooth = (toothNum: number, updater: (draft: ToothData) => void) => {
    setData(prev => {
      const next = { ...prev, [toothNum]: { ...prev[toothNum] } }
      // Deep clone vestibular and palatinoLingual to avoid mutation bugs
      next[toothNum].vestibular = {
        ...next[toothNum].vestibular,
        sangrado: [...next[toothNum].vestibular.sangrado],
        placa: [...next[toothNum].vestibular.placa],
        margen: [...next[toothNum].vestibular.margen],
        profundidad: [...next[toothNum].vestibular.profundidad]
      }
      next[toothNum].palatinoLingual = {
        ...next[toothNum].palatinoLingual,
        sangrado: [...next[toothNum].palatinoLingual.sangrado],
        placa: [...next[toothNum].palatinoLingual.placa],
        margen: [...next[toothNum].palatinoLingual.margen],
        profundidad: [...next[toothNum].palatinoLingual.profundidad]
      }
      updater(next[toothNum])
      return next
    })
  }

  const renderTableHead = (teeth: number[], showLabels: boolean) => (
    <tr>
      {showLabels && <th className="w-[120px] border border-gray-300 bg-white px-1 py-0.5 text-right text-[10px] text-gray-500 font-normal"></th>}
      {teeth.map(t => (
        <th key={t} className="border border-gray-300 bg-white p-1 text-center text-sm font-medium text-gray-700">
          {t}
        </th>
      ))}
    </tr>
  )

  const renderMovilidadRow = (teeth: number[], label: string, showLabels: boolean) => (
    <tr>
      {showLabels && <td className="w-[120px] border border-gray-300 bg-white px-1 py-0.5 text-right text-[10px] leading-tight whitespace-nowrap text-gray-500">{label}</td>}
      {teeth.map(t => (
        <td key={t} className="border border-gray-300 p-0 bg-white">
          <input
            type="number"
            min={0}
            max={3}
            value={data[t].movilidad === 0 ? '' : data[t].movilidad}
            placeholder="0"
            onChange={e => updateTooth(t, draft => draft.movilidad = parseInt(e.target.value) || 0)}
            className="w-full text-center text-xs outline-none focus:bg-gray-100 h-6 p-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
          />
        </td>
      ))}
    </tr>
  )

  const renderCheckboxRow = (teeth: number[], label: string, view: 'vestibular' | 'palatinoLingual', field: 'sangrado' | 'placa', showLabels: boolean) => (
    <tr>
      {showLabels && <td className="w-[120px] border border-gray-300 bg-white px-1 py-0.5 text-right text-[10px] leading-tight whitespace-nowrap text-gray-500">{label}</td>}
      {teeth.map(t => (
        <td key={t} className="border border-gray-300 p-0 bg-white px-0.5">
          <TriCheckbox
            values={data[t][view][field]}
            onChange={(idx, val) => updateTooth(t, draft => draft[view][field][idx] = val)}
          />
        </td>
      ))}
    </tr>
  )

  const renderInputRow = (teeth: number[], label: string, view: 'vestibular' | 'palatinoLingual', field: 'margen' | 'profundidad', showLabels: boolean) => {
    const isProfundidad = field === 'profundidad'
    return (
      <tr>
        {showLabels && <td className="w-[120px] border border-gray-300 bg-white px-1 py-0.5 text-right text-[10px] leading-tight whitespace-nowrap text-gray-500">{label}</td>}
        {teeth.map(t => (
          <td key={t} className="border border-gray-300 p-0 bg-white">
            <TriInput
              values={data[t][view][field]}
              min={isProfundidad ? 0 : -15}
              max={15}
              highlightThreshold={isProfundidad ? 4 : undefined}
              onChange={(idx, val) => updateTooth(t, draft => draft[view][field][idx] = val)}
            />
          </td>
        ))}
      </tr>
    )
  }

  const renderNotaRow = (teeth: number[], label: string, showLabels: boolean) => (
    <tr>
      {showLabels && <td className="w-[120px] border border-gray-300 bg-white px-1 py-0.5 text-right text-[10px] leading-tight whitespace-nowrap text-gray-500">{label}</td>}
      {teeth.map(t => (
        <td key={t} className="border border-gray-300 p-0 bg-white">
          <input
            type="text"
            value={data[t].palatinoLingual.nota || ''}
            onChange={e => updateTooth(t, draft => draft.palatinoLingual.nota = e.target.value)}
            className="w-full text-center text-xs outline-none focus:bg-gray-100 h-6 px-1"
          />
        </td>
      ))}
    </tr>
  )

  const upperRight = UPPER_TEETH.slice(0, 8)
  const upperLeft = UPPER_TEETH.slice(8)
  const lowerRight = LOWER_TEETH.slice(0, 8)
  const lowerLeft = LOWER_TEETH.slice(8)

  const renderUpperGrid = (teeth: number[]) => {
    const right = teeth.slice(0, 8)
    const left = teeth.slice(8)
    return (
      <div className="flex gap-4 w-full">
        <div style={{ width: 'calc(50% + 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <thead>
              {renderTableHead(right, true)}
            </thead>
            <tbody>
              {renderMovilidadRow(right, 'Movilidad', true)}
              {renderCheckboxRow(right, 'Sangrado al sondaje', 'vestibular', 'sangrado', true)}
              {renderCheckboxRow(right, 'Placa', 'vestibular', 'placa', true)}
              {renderInputRow(right, 'Margen Gingival', 'vestibular', 'margen', true)}
              {renderInputRow(right, 'Profundidad de Sondaje', 'vestibular', 'profundidad', true)}
            </tbody>
          </table>
        </div>
        <div style={{ width: 'calc(50% - 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <thead>
              {renderTableHead(left, false)}
            </thead>
            <tbody>
              {renderMovilidadRow(left, 'Movilidad', false)}
              {renderCheckboxRow(left, 'Sangrado al sondaje', 'vestibular', 'sangrado', false)}
              {renderCheckboxRow(left, 'Placa', 'vestibular', 'placa', false)}
              {renderInputRow(left, 'Margen Gingival', 'vestibular', 'margen', false)}
              {renderInputRow(left, 'Profundidad de Sondaje', 'vestibular', 'profundidad', false)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderUpperPalatineGrid = (teeth: number[]) => {
    const right = teeth.slice(0, 8)
    const left = teeth.slice(8)
    return (
      <div className="flex gap-4 w-full mt-2">
        <div style={{ width: 'calc(50% + 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderInputRow(right, 'Margen Gingival', 'palatinoLingual', 'margen', true)}
              {renderInputRow(right, 'Profundidad de Sondaje', 'palatinoLingual', 'profundidad', true)}
              {renderCheckboxRow(right, 'Placa', 'palatinoLingual', 'placa', true)}
              {renderCheckboxRow(right, 'Sangrado al sondaje', 'palatinoLingual', 'sangrado', true)}
              {renderNotaRow(right, 'Nota', true)}
            </tbody>
          </table>
        </div>
        <div style={{ width: 'calc(50% - 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderInputRow(left, 'Margen Gingival', 'palatinoLingual', 'margen', false)}
              {renderInputRow(left, 'Profundidad de Sondaje', 'palatinoLingual', 'profundidad', false)}
              {renderCheckboxRow(left, 'Placa', 'palatinoLingual', 'placa', false)}
              {renderCheckboxRow(left, 'Sangrado al sondaje', 'palatinoLingual', 'sangrado', false)}
              {renderNotaRow(left, 'Nota', false)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderLowerLingualGrid = (teeth: number[]) => {
    const right = teeth.slice(0, 8)
    const left = teeth.slice(8)
    return (
      <div className="flex gap-4 w-full mb-2">
        <div style={{ width: 'calc(50% + 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderNotaRow(right, 'Nota', true)}
              {renderCheckboxRow(right, 'Sangrado al sondaje', 'palatinoLingual', 'sangrado', true)}
              {renderCheckboxRow(right, 'Placa', 'palatinoLingual', 'placa', true)}
              {renderInputRow(right, 'Margen Gingival', 'palatinoLingual', 'margen', true)}
              {renderInputRow(right, 'Profundidad de Sondaje', 'palatinoLingual', 'profundidad', true)}
            </tbody>
          </table>
        </div>
        <div style={{ width: 'calc(50% - 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderNotaRow(left, 'Nota', false)}
              {renderCheckboxRow(left, 'Sangrado al sondaje', 'palatinoLingual', 'sangrado', false)}
              {renderCheckboxRow(left, 'Placa', 'palatinoLingual', 'placa', false)}
              {renderInputRow(left, 'Margen Gingival', 'palatinoLingual', 'margen', false)}
              {renderInputRow(left, 'Profundidad de Sondaje', 'palatinoLingual', 'profundidad', false)}
            </tbody>
          </table>
        </div>
      </div>
    )
  }

  const renderLowerVestibularGrid = (teeth: number[]) => {
    const right = teeth.slice(0, 8)
    const left = teeth.slice(8)
    return (
      <div className="flex gap-4 w-full">
        <div style={{ width: 'calc(50% + 60px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderInputRow(right, 'Margen Gingival', 'vestibular', 'margen', true)}
              {renderInputRow(right, 'Profundidad de Sondaje', 'vestibular', 'profundidad', true)}
              {renderCheckboxRow(right, 'Placa', 'vestibular', 'placa', true)}
              {renderCheckboxRow(right, 'Sangrado al sondaje', 'vestibular', 'sangrado', true)}
              {renderMovilidadRow(right, 'Movilidad', true)}
            </tbody>
            <tfoot>
              {renderTableHead(right, true)}
            </tfoot>
          </table>
        </div>
        <div style={{ width: 'calc(50% - 64px - 8px)' }}>
          <table className="w-full border-collapse table-fixed">
            <tbody>
              {renderInputRow(left, 'Margen Gingival', 'vestibular', 'margen', false)}
              {renderInputRow(left, 'Profundidad de Sondaje', 'vestibular', 'profundidad', false)}
              {renderCheckboxRow(left, 'Placa', 'vestibular', 'placa', false)}
              {renderCheckboxRow(left, 'Sangrado al sondaje', 'vestibular', 'sangrado', false)}
              {renderMovilidadRow(left, 'Movilidad', false)}
            </tbody>
            <tfoot>
              {renderTableHead(left, false)}
            </tfoot>
          </table>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-white">
      {/* Tabs Header */}
      <div className="flex gap-6 border-b border-gray-200 px-6 pt-4">
        <button 
          onClick={() => setActiveTab('periodontograma')}
          className={`pb-4 text-sm font-medium ${activeTab === 'periodontograma' ? 'border-b-2 border-cyan-500 text-cyan-600 -mb-[2px]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Periodontogramas
        </button>
        <button 
          onClick={() => setActiveTab('tratamiento')}
          className={`pb-4 text-sm font-medium ${activeTab === 'tratamiento' ? 'border-b-2 border-cyan-500 text-cyan-600 -mb-[2px]' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Plan de tratamiento
        </button>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between px-6 py-4 bg-white border-b border-gray-100">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">Doctor:</span>
          <select className="rounded-full border border-gray-300 bg-white px-4 py-1.5 text-sm text-cyan-600 outline-none focus:border-cyan-400">
            <option>Diego Cruzado</option>
          </select>
        </div>

        <div className="flex items-center gap-6">
          {activeTab === 'periodontograma' && (
            <>
              <div className="flex gap-4">
                <div className="flex flex-col items-center justify-center rounded-lg bg-[#e5f6f8] px-4 py-1">
                  <span className="text-xs text-[#3db4c7]">Índice de placa (%IP):</span>
                  <span className="text-sm font-medium text-[#3db4c7]">{ip.toFixed(2)}%</span>
                </div>
                <div className="flex flex-col items-center justify-center rounded-lg bg-[#e5f6f8] px-4 py-1">
                  <span className="text-xs text-[#3db4c7]">Sangrado (%SAS):</span>
                  <span className="text-sm font-medium text-[#3db4c7]">{sas.toFixed(2)}%</span>
                </div>
              </div>

              <button className="rounded-full bg-[#408a97] px-6 py-2 text-sm font-medium text-white hover:bg-[#357580]">
                Guardar
              </button>
            </>
          )}

          <button className="text-gray-400 hover:text-cyan-600">
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="p-6 bg-gray-50 flex-1">
        <div className="mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-x-auto p-4 max-w-[1200px]">
          {activeTab === 'periodontograma' ? (
            <>
              {/* UPPER ARCH */}
              <div className="mb-12">
                <div className="mb-2">
                  {renderUpperGrid(UPPER_TEETH)}
                </div>
                
                <div className="w-full px-40 mb-2">
                  <div className="relative w-full">
                    <img src={teeth01} alt="Teeth Upper Vestibular" className="w-full opacity-90 h-auto block" />
                    <PeriodontogramLines data={data} teethOrder={UPPER_TEETH} view="vestibular" rootsPointUp={true} />
                  </div>
                </div>

                <div className="w-full px-40 mb-2">
                  <div className="relative w-full">
                    <img src={teeth02} alt="Teeth Upper Palatine" className="w-full opacity-90 h-auto block" />
                    <PeriodontogramLines data={data} teethOrder={UPPER_TEETH} view="palatinoLingual" rootsPointUp={false} />
                  </div>
                </div>

                <div className="">
                  {renderUpperPalatineGrid(UPPER_TEETH)}
                </div>
              </div>

              {/* LOWER ARCH */}
              <div>
                <div className="">
                  {renderLowerLingualGrid(LOWER_TEETH)}
                </div>

                <div className="w-full px-40 mt-2 mb-2">
                  <div className="relative w-full">
                    <img src={teeth03} alt="Teeth Lower Lingual" className="w-full opacity-90 h-auto block" />
                    <PeriodontogramLines data={data} teethOrder={LOWER_TEETH} view="palatinoLingual" rootsPointUp={true} isLowerArch={true} />
                  </div>
                </div>

                <div className="w-full px-40 mb-2">
                  <div className="relative w-full">
                    <img src={teeth04} alt="Teeth Lower Vestibular" className="w-full opacity-90 h-auto block" />
                    <PeriodontogramLines data={data} teethOrder={LOWER_TEETH} view="vestibular" rootsPointUp={false} isLowerArch={true} />
                  </div>
                </div>

                <div className="">
                  {renderLowerVestibularGrid(LOWER_TEETH)}
                </div>
              </div>
            </>
          ) : (
            <TreatmentPlanSection />
          )}
        </div>
      </div>
    </div>
  )
}

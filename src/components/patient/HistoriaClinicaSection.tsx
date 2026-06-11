import { useState } from 'react'
import EvolutionNoteModal from './EvolutionNoteModal'
import { DatePicker } from '../ui/DatePicker'

const TABS = [
  'Anam. Odontología',
  'Nota evolución',
  'Anam. Odontopediatría',
  'Endodoncia',
  'Signos Vitales',
  'Consentimientos'
]

const CLINICAL_DATA_ROWS = [
  'Único',
  'Vestibular',
  'Palatino/Lingual',
  'Mesio lingual',
  'Mesio Bucal',
  'Distal',
  'Disto Bucal',
  'Disto Lingual'
]

const CLINICAL_DATA_COLS = [
  'Conducto',
  'Longitud de trabajo (mm)',
  'Punto de referencia',
  'Lima inicial',
  'Última lima apical',
  'Tipo Cemento',
  'Cono maestro de gutapercha'
]

const VITAL_SIGNS_ROWS = [
  'Peso(Kg)',
  'Talla(m)',
  'Temperatura(°C)',
  'Tensión arterial(mmHg)',
  'F. cardiaca(lat/min)',
  'Oxigenación (SpO2)'
]

function Accordion({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  return (
    <div className="mb-2">
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-3 text-sm font-semibold tracking-wide text-[#3f8a9e]"
      >
        {title}
        <svg className={`h-4 w-4 transition-transform ${isOpen ? '' : 'rotate-180'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
        </svg>
      </button>
      {isOpen && (
        <div className="border-t border-[#e2eff4] py-4">
          {children}
        </div>
      )}
    </div>
  )
}

function SimpleInput({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <label className="w-1/3 text-sm text-gray-600">{label}</label>
      <div className="w-2/3 flex justify-end">
        <input type="text" className="w-full rounded-full border border-gray-300 px-4 py-1.5 text-sm outline-none focus:border-cyan-400" />
      </div>
    </div>
  )
}

function ConditionCheckbox({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-sm text-gray-600 w-1/2">{label}</span>
      <div className="flex items-center gap-4 w-1/2 justify-start sm:justify-center pr-4 sm:pr-0">
        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
          No
        </label>
        <label className="flex items-center gap-2 text-sm text-gray-500">
          <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
          Si
        </label>
      </div>
    </div>
  )
}

function QuestionRow({ label }: { label: string }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 w-1/2 pr-4">{label}</span>
      <div className="flex items-center gap-4 w-1/2">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
            No
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
            Si
          </label>
        </div>
        <input type="text" className="w-32 flex-1 rounded-full border border-gray-300 px-3 py-1.5 text-sm outline-none focus:border-cyan-400" />
      </div>
    </div>
  )
}

function UnitInput({ label, unit }: { label: string; unit: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-600">{label}</label>
      <div className="flex overflow-hidden rounded-full border border-gray-300 focus-within:border-cyan-400 bg-white">
        <input type="text" className="w-1/2 border-r border-gray-200 px-4 py-2 text-sm outline-none" />
        <div className="flex w-1/2 items-center justify-center bg-slate-50 text-sm text-gray-500">
          {unit}
        </div>
      </div>
    </div>
  )
}

function ColumnInput({ label }: { label: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-600">{label}</label>
      <input type="text" className="w-full rounded-full border border-gray-300 px-4 py-2 text-sm outline-none focus:border-cyan-400" />
    </div>
  )
}

function TextArea({ label }: { label: string }) {
  return (
    <div>
      <label className="mb-2 block text-sm text-gray-600">{label}</label>
      <textarea rows={4} className="w-full rounded-xl border border-gray-300 p-3 text-sm outline-none focus:border-cyan-400" />
    </div>
  )
}

function Checkbox({ label }: { label: string }) {
  return (
    <label className="flex items-center gap-2 text-sm text-gray-600 whitespace-nowrap">
      <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
      {label}
    </label>
  )
}

function EndoYesNoRow({ label, rightElement }: { label: string; rightElement?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-600 w-1/3 pr-4">{label}</span>
      <div className="flex items-center gap-8 w-2/3">
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
            Sí
          </label>
          <label className="flex items-center gap-2 text-sm text-gray-500">
            <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
            No
          </label>
        </div>
        <div className="flex-1">
          {rightElement}
        </div>
      </div>
    </div>
  )
}

function EndoSelect({ label, options = [] }: { label?: string; options?: string[] }) {
  return (
    <div className="flex items-center gap-4">
      {label && <span className="text-sm text-gray-600 whitespace-nowrap">{label}</span>}
      <div className="relative w-full">
        <select className="w-full appearance-none rounded-full border border-gray-300 bg-white px-4 py-1.5 pr-8 text-sm outline-none focus:border-cyan-400 text-gray-400">
          <option>Seleccionar</option>
          {options.map(opt => (
            <option key={opt} value={opt} className="text-gray-700">{opt}</option>
          ))}
        </select>
        <svg className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-cyan-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  )
}

function ClinicalDataTable() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-white">
            <th className="border border-gray-200 p-2 font-medium text-[#2b6ba3]"></th>
            {CLINICAL_DATA_COLS.map(col => (
              <th key={col} className="border border-gray-200 p-2 font-medium text-[#2b6ba3] text-center min-w-[90px]">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {CLINICAL_DATA_ROWS.map(row => (
            <tr key={row} className="bg-white">
              <td className="border border-gray-200 p-2 text-gray-600 whitespace-nowrap">{row}</td>
              {CLINICAL_DATA_COLS.map(col => (
                <td key={`${row}-${col}`} className="border border-gray-200 p-0">
                  <input type="text" className="w-full h-full px-2 py-2 outline-none focus:bg-gray-50 text-center" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function VitalSignsTable() {
  const ROWS = [
    'Peso(Kg)',
    'Talla(m)',
    'Temperatura(°C)',
    'Tensión arterial(mmHg)',
    'F. cardiaca(lat/min)',
    'Oxigenación (SpO2)',
  ]

  return (
    <div className="overflow-x-auto w-full mb-4">
      <table className="w-full border-collapse border border-gray-200 text-sm">
        <thead>
          <tr className="bg-[#f8fafc]">
            <th className="border border-gray-200 p-2 font-medium text-gray-600 min-w-[150px]"></th>
            {[...Array(6)].map((_, i) => (
              <th key={i} className="border border-gray-200 p-2 font-medium text-gray-600 min-w-[90px] h-10">
                <div className="flex justify-center items-center h-full relative">
                  <DatePicker variant="minimal" className="w-full h-full absolute inset-0" />
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ROWS.map((rowName) => (
            <tr key={rowName} className="bg-white">
              <td className="border border-gray-200 p-3 text-gray-600 whitespace-nowrap">{rowName}</td>
              {[...Array(6)].map((_, colIndex) => (
                <td key={colIndex} className="border border-gray-200 p-0 h-10">
                  <input 
                    type="text" 
                    defaultValue=""
                    className="w-full h-full px-2 py-3 outline-none focus:bg-gray-50 text-center text-gray-600" 
                  />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function HistoriaClinicaSection() {
  const [activeTab, setActiveTab] = useState(TABS[0])
  const [isEvolutionModalOpen, setIsEvolutionModalOpen] = useState(false)

  return (
    <div className="flex flex-col rounded-xl bg-white shadow-sm border border-gray-200 p-6">
      {/* Top Navigation */}
      <div className="flex items-center justify-between border-b border-gray-200 pb-2">
        <div className="flex gap-6 overflow-x-auto">
          {TABS.map((tab, index) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap pb-2 text-sm font-medium transition-colors flex items-center gap-1 ${
                activeTab === tab
                  ? 'border-b-2 border-[#75cdd8] text-[#3f8a9e]'
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Doctor Dropdown & Options */}
      <div className="flex items-center justify-between pt-4 pb-2">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <span>Doctor:</span>
          <button className="flex items-center gap-1 text-[#3f8a9e] hover:text-[#2d6878]">
            Diego Cruzado
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className="text-[#3f8a9e] hover:text-[#2d6878]">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {activeTab === 'Anam. Odontología' && (
        <div className="mt-4">
          <Accordion title="Sección">
            <SimpleInput label="Motivo de consulta" />
          </Accordion>

          <Accordion title="ENFERMEDAD ACTUAL">
            <div className="space-y-1">
              <SimpleInput label="Tiempo de enfermedad" />
              <SimpleInput label="Signos y síntomas principales" />
              <SimpleInput label="Relato cronológico" />
              <SimpleInput label="Funciones biológicas" />
            </div>
          </Accordion>

          <Accordion title="ANTECEDENTES">
            <div className="space-y-6">
              <div className="space-y-1">
                <SimpleInput label="Antecedentes familiares" />
                <SimpleInput label="Antecedentes personales" />
              </div>
              
              <div>
                <p className="mb-3 text-sm text-gray-600">¿Tiene o ha tenido?</p>
                <div className="grid grid-cols-2 gap-x-8 gap-y-1">
                  <ConditionCheckbox label="Presión alta" />
                  <ConditionCheckbox label="VIH" />
                  <ConditionCheckbox label="Presión baja" />
                  <ConditionCheckbox label="Diabetes" />
                  <ConditionCheckbox label="Hepatitis" />
                  <ConditionCheckbox label="Asma" />
                  <ConditionCheckbox label="Gastritis" />
                  <ConditionCheckbox label="¿Fuma?" />
                  <ConditionCheckbox label="Úlceras" />
                </div>
              </div>

              <SimpleInput label="Comentario adicional" />

              <div className="space-y-1 pt-2">
                <QuestionRow label="Enfermedades sanguíneas" />
                <QuestionRow label="Problemas cardíacos" />
                <QuestionRow label="¿Padece de alguna otra enfermedad?" />
                <QuestionRow label="¿Cuántas veces al día se cepilla los dientes?" />
                <QuestionRow label="¿Le sangra sus encías?" />
                <QuestionRow label="¿Ha tenido hemorragias anormales después de una extracción?" />
                <QuestionRow label="¿Hace rechinar o aprieta los dientes?" />
                <QuestionRow label="Otras molestias en la boca" />
                <QuestionRow label="Alergias" />
                <QuestionRow label="¿Ha tenido alguna operación grande en los últimos años?" />
                <QuestionRow label="¿Toma alguna medicación de manera permanente?" />
              </div>
            </div>
          </Accordion>

          <Accordion title="EXAMEN CLINICO">
            <div className="space-y-6">
              <p className="text-sm text-gray-600">Signos vitales:</p>
              <div className="grid grid-cols-2 gap-6">
                <UnitInput label="PA" unit="mmgh" />
                <UnitInput label="FC" unit="bpm" />
                <UnitInput label="Temperatura" unit="°C" />
                <UnitInput label="FR" unit="r/m" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <TextArea label="Examen extraoral" />
                <TextArea label="Examen intraoral" />
                <TextArea label="Resultado de exámenes auxiliares" />
                <TextArea label="Observaciones" />
              </div>
            </div>
          </Accordion>

          <div className="mt-8 flex justify-center pb-4">
            <button
              type="button"
              className="rounded-full bg-[#408a97] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#357580]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Nota evolución' && (
        <div className="mt-8 flex px-8">
          <button
            type="button"
            onClick={() => setIsEvolutionModalOpen(true)}
            className="rounded-full bg-[#c3d7e0] px-8 py-3 text-sm font-medium text-white hover:bg-[#aabed0] shadow-sm"
          >
            Agregar evolución
          </button>
        </div>
      )}

      {activeTab === 'Anam. Odontopediatría' && (
        <div className="mt-4">
          <Accordion title="Sección">
            <div className="space-y-4">
              <TextArea label="Motivo de consulta" />
              <div className="grid grid-cols-4 gap-4">
                <ColumnInput label="Nombre mamá" />
                <ColumnInput label="Nombre papá" />
                <ColumnInput label="Número de hermanos" />
                <ColumnInput label="Orden" />
              </div>
            </div>
          </Accordion>

          <Accordion title="ENFERMEDAD ACTUAL">
            <div className="grid grid-cols-2 gap-6">
              <TextArea label="Tipo de enfermedad" />
              <TextArea label="Relato cronológico" />
            </div>
          </Accordion>

          <Accordion title="ANTECEDENTES PRENATALES">
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-6">
                <ColumnInput label="Enfermedades maternas" />
                <ColumnInput label="¿Hubo complicaciones en el embarazo?" />
              </div>
              <div className="grid grid-cols-2 gap-6">
                <ColumnInput label="¿Fue un bebé prematuro?" />
                <UnitInput label="Peso al nacer" unit="kg" />
              </div>
              <TextArea label="Comentario" />
            </div>
          </Accordion>

          <Accordion title="ANTECEDENTES POSTNATALES">
            <div className="space-y-4">
              <div className="space-y-1">
                <QuestionRow label="¿Problemas en el parto?" />
                <QuestionRow label="¿Usó chupón?" />
                <QuestionRow label="¿Usó biberón?" />
                <QuestionRow label="¿Se chupa/chupaba el dedo?" />
                <QuestionRow label="¿Toma alguna medicación o terapia?" />
                <QuestionRow label="¿Es alérgico o intolerante a algo?" />
                <QuestionRow label="¿Se cepilla antes de dormir?" />
                <QuestionRow label="¿Duerme con la boca abierta o ronca?" />
              </div>

              <div className="pt-2">
                <TextArea label="Comentario adicional" />
              </div>

              <div className="grid grid-cols-2 gap-6 pt-2">
                <UnitInput label="¿Cuánto dulce come?" unit="Veces al día" />
                <UnitInput label="¿Con qué frecuencia?" unit="días/semana" />
              </div>

              <div className="pt-2 space-y-4">
                <ColumnInput label="¿Qué tipo de leche recibe el bebé?" />
                <ColumnInput label="¿Cómo le lava los dientes al bebé o niño?" />
                <TextArea label="Describa un día de comida de su bebé/niño desde el desayuno." />
                <ColumnInput label="¿Te consideras un papá/mamá autoritario, cooperador, despreocupado o sobreprotector?" />
                
                <div className="grid grid-cols-2 gap-6">
                  <TextArea label="Hábitos orales" />
                  <TextArea label="Técnica de cepillado" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <TextArea label="Examen clínico" />
                  <TextArea label="Observaciones" />
                </div>
              </div>
            </div>
          </Accordion>

          <div className="mt-8 flex justify-center pb-4">
            <button
              type="button"
              className="rounded-full bg-[#408a97] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#357580]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Endodoncia' && (
        <div className="mt-4">
          <Accordion title="Sección">
            <div className="space-y-4">
              <ColumnInput label="¿Tratamiento endodóntico previo?" />
              <ColumnInput label="Historia del dolor" />
              <ColumnInput label="Nota adicional" />
              <div className="w-1/4">
                <ColumnInput label="N° de diente" />
              </div>
            </div>
          </Accordion>

          <Accordion title="EXAMEN CLÍNICO">
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm text-gray-600">Corona Anatómica</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <Checkbox label="Caries" />
                  <Checkbox label="Restauración" />
                  <Checkbox label="Bruxismo" />
                  <Checkbox label="Fractura" />
                  <Checkbox label="Fractura y exposición pulpar" />
                </div>
              </div>

              <div className="space-y-2">
                <EndoYesNoRow label="Inflamación presente" rightElement={<EndoSelect label="Especificar" options={['Encía Vestibular', 'Encía lingual/palatina', 'Facial']} />} />
                <EndoYesNoRow label="Fístulas" rightElement={<EndoSelect label="Especificar" options={['Vestibular', 'Lingual/Palatino', 'Extraoral']} />} />
                <EndoYesNoRow label="Gingivitis" rightElement={<EndoSelect label="Movilidad" options={['Normal', 'Grado I', 'Grado II', 'Grado III']} />} />
                <EndoYesNoRow label="Bolsas" rightElement={
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-gray-600">Sondeo</span>
                    <input type="text" className="w-full rounded-full border border-gray-300 px-4 py-1.5 text-sm outline-none focus:border-cyan-400" />
                  </div>
                } />
                <EndoYesNoRow label="Sarro" />
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Características del dolor</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <Checkbox label="Espontáneo" />
                  <Checkbox label="Provocado" />
                  <Checkbox label="Frio" />
                  <Checkbox label="Calor" />
                  <Checkbox label="Masticación" />
                  <Checkbox label="Nocturno" />
                  <Checkbox label="Aire" />
                  <Checkbox label="Dulce" />
                  <Checkbox label="Ácido" />
                  <Checkbox label="Irradiado" />
                  <Checkbox label="Difuso" />
                  <Checkbox label="Punzante" />
                  <Checkbox label="Continuo" />
                  <Checkbox label="Intermitente" />
                  <Checkbox label="Esporádico" />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="mb-3 text-sm text-gray-600">Dolor a la percusión</p>
                  <div className="flex gap-6">
                    <Checkbox label="Horizontal" />
                    <Checkbox label="Vertical" />
                  </div>
                </div>
                <div>
                  <p className="mb-3 text-sm text-gray-600">Dolor a la palpación</p>
                  <div className="flex gap-6">
                    <Checkbox label="Vestibular" />
                    <Checkbox label="Lingual/Palatino" />
                  </div>
                </div>
              </div>

              <TextArea label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="PRUEBA DE VITALIDAD">
            <div className="space-y-4">
              <div className="flex items-center gap-8">
                <div className="w-1/4">
                  <p className="mb-3 text-sm text-gray-600">Calor</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                      Sí
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                      No
                    </label>
                  </div>
                </div>
                <div className="w-1/4">
                  <p className="mb-3 text-sm text-gray-600">Duración</p>
                  <EndoSelect options={['Corta', 'Mediana', 'Larga']} />
                </div>
                <div className="w-1/2">
                  <p className="mb-3 text-sm text-gray-600">Intensidad</p>
                  <EndoSelect options={['Leve(1-3)', 'Moderada(4-7)', 'Severa(8-10)']} />
                </div>
              </div>
              <div className="flex items-center gap-8">
                <div className="w-1/4">
                  <p className="mb-3 text-sm text-gray-600">Frío</p>
                  <div className="flex gap-4">
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                      Sí
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-500">
                      <input type="checkbox" className="rounded border-gray-300 text-cyan-500 focus:ring-cyan-500" />
                      No
                    </label>
                  </div>
                </div>
                <div className="w-1/4">
                  <p className="mb-3 text-sm text-gray-600">Duración</p>
                  <EndoSelect options={['Corta', 'Mediana', 'Larga']} />
                </div>
                <div className="w-1/2">
                  <p className="mb-3 text-sm text-gray-600">Intensidad</p>
                  <EndoSelect options={['Leve(1-3)', 'Moderada(4-7)', 'Severa(8-10)']} />
                </div>
              </div>
            </div>
          </Accordion>

          <Accordion title="EXAMEN RADIOGRÁFICO">
            <div className="space-y-6">
              <div>
                <p className="mb-3 text-sm text-gray-600">Cámara Pulpar:</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <Checkbox label="Abierta" />
                  <Checkbox label="Cerrada" />
                  <Checkbox label="Amplia" />
                  <Checkbox label="Estrecha" />
                  <Checkbox label="Cálculos pulpares" />
                </div>
              </div>
              <div>
                <p className="mb-3 text-sm text-gray-600">Conducto(s):</p>
                <div className="flex flex-wrap gap-x-6 gap-y-3 mb-3">
                  <Checkbox label="Único" />
                  <Checkbox label="2 conductos" />
                  <Checkbox label="3 conductos" />
                  <Checkbox label="4 conductos" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-3">
                  <Checkbox label="Recto" />
                  <Checkbox label="Curvo" />
                  <Checkbox label="Amplio" />
                  <Checkbox label="Estrecho" />
                  <Checkbox label="Tratado anteriormente" />
                  <Checkbox label="Ápice abierto" />
                </div>
              </div>

              <div className="space-y-2">
                <EndoYesNoRow label="Lesión en Furca" />
                <EndoYesNoRow label="Lesión Apical" />
                <EndoYesNoRow label="Lesión Lateral" />
                <EndoYesNoRow label="Lesión Endo-perio" />
                <EndoYesNoRow label="Raíces enanas" />
                <EndoYesNoRow label="Fractura radicular" rightElement={<EndoSelect options={['Horizontal', 'Vertical']} />} />
                <EndoYesNoRow label="Calcificación" rightElement={<EndoSelect options={['Total', 'Parcial']} />} />
                <EndoYesNoRow label="Ligamento periodontal" rightElement={<EndoSelect options={['Normal', 'Ensanchado']} />} />
                <EndoYesNoRow label="Reabsorción" rightElement={<EndoSelect options={['Externa', 'Interna']} />} />
              </div>

              <ColumnInput label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="DIAGNÓSTICO PULPAR DE PRESUNCION">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Checkbox label="Pulpa normal" />
                <Checkbox label="Pulpitis Reversible" />
                <Checkbox label="Pulpitis Irreversible sintomática" />
                <Checkbox label="Pulpitis Irreversible asintomática" />
                <Checkbox label="Necrosis Pulpar" />
                <Checkbox label="Previamente tratado" />
                <Checkbox label="Previamente iniciado" />
              </div>
              <ColumnInput label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="DIAGNÓSTICO PERIAPICAL">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Checkbox label="Tejidos apicales sanos" />
                <Checkbox label="Periodontitis apical aguda (sintomática)" />
                <Checkbox label="Periodontitis apical crónica (asintomática)" />
                <Checkbox label="Absceso apical agudo (sin fístula)" />
                <Checkbox label="Absceso apical crónico (con fístula)" />
                <Checkbox label="Osteítis condensante" />
              </div>
              <ColumnInput label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="DIAGNÓSTICO DEFINITIVO">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Checkbox label="Pulpitis irreversible" />
                <Checkbox label="Pulpa necrótica" />
              </div>
              <ColumnInput label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="TRATAMIENTO INDICADO">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-x-6 gap-y-4">
                <Checkbox label="Biopulpectomía" />
                <Checkbox label="Apicectomía" />
                <Checkbox label="Necropulpectomía" />
                <Checkbox label="Hemisección" />
                <Checkbox label="Retratamiento" />
                <Checkbox label="Radicectomía" />
                <Checkbox label="Blanqueamiento" />
                <Checkbox label="Extracción" />
              </div>
              <TextArea label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="DATOS CLÍNICOS">
            <div className="space-y-4">
              <ClinicalDataTable />
              <TextArea label="Nota adicional" />
            </div>
          </Accordion>

          <Accordion title="Sección">
            <div className="space-y-6">
              <ColumnInput label="Accidentes operatorios" />
              
              <div>
                <p className="mb-3 text-sm text-gray-600">Restauración post-endodóntica indicada</p>
                <div className="flex gap-6">
                  <Checkbox label="Poste" />
                  <Checkbox label="Amalgama/Resina" />
                  <Checkbox label="Corona" />
                  <Checkbox label="Otro" />
                </div>
              </div>

              <div>
                <p className="mb-3 text-sm text-gray-600">Pronóstico</p>
                <div className="flex gap-6">
                  <Checkbox label="Favorable" />
                  <Checkbox label="Desfavorable" />
                  <Checkbox label="Reservado" />
                </div>
              </div>

              <TextArea label="Nota adicional" />
            </div>
          </Accordion>

          <div className="mt-8 flex justify-center pb-4">
            <button
              type="button"
              className="rounded-full bg-[#408a97] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#357580]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Signos Vitales' && (
        <div className="mt-4">
          <Accordion title="Sección">
            <div className="space-y-6">
              <VitalSignsTable />
              
              <div>
                <button type="button" className="text-[#75cdd8] hover:text-[#5eb8c3] font-medium text-sm">
                  Actualizar gráficos
                </button>
              </div>

              <TextArea label="Nota adicional" />
            </div>
          </Accordion>

          <div className="mt-8 flex justify-center pb-4">
            <button
              type="button"
              className="rounded-full bg-[#408a97] px-10 py-2.5 text-sm font-medium text-white hover:bg-[#357580]"
            >
              Guardar
            </button>
          </div>
        </div>
      )}

      {activeTab === 'Consentimientos' && (
        <div className="mt-4">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-sm text-gray-500 max-w-2xl">
              Sube fotos o archivos PDF de los consentimientos debidamente firmados por el paciente. 
              <br />
              <span className="text-[#3f8a9e]">Las plantillas oficiales en blanco están disponibles en la web del COP.</span>
            </div>
            <button className="whitespace-nowrap rounded bg-[#75cdd8] px-5 py-2 text-sm font-medium text-white hover:bg-[#5dbbc8] transition-colors shadow-sm">
              + Agregar otro
            </button>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
            {[
              'Apicectomía', 'Caninos retenidos', 'Cirugía tercera molar', 'Cirugía apical', 
              'Cirugía bucal menor', 'Cirugía ortognática', 'Endodoncia', 'Exodoncia simple', 
              'Implantes', 'Normas técnicas del odontograma', 'Operatoria', 'Ortodoncia', 
              'Periodoncia', 'Prótesis fija', 'Tercer molar', 'Tratamiento general'
            ].map((item) => (
              <div key={item} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-gray-100 rounded-xl bg-white shadow-sm hover:shadow-md transition-shadow gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-[#f0f7f9] p-2 rounded-lg text-[#3f8a9e] shrink-0">
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 0 0-3.375-3.375h-1.5A1.125 1.125 0 0 1 13.5 7.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 0 0-9-9Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 12h7.5m-7.5 4.5h7.5m-7.5 4.5h7.5" />
                    </svg>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[15px] font-semibold text-gray-700">{item}</span>
                    <span className="text-xs text-amber-500 font-medium">Pendiente de firma y subida</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-[#75cdd8] bg-white border border-[#dbebf1] rounded-lg hover:bg-[#f0f7f9] transition-colors w-full sm:w-auto">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
                    </svg>
                    Subir firmado
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab !== 'Anam. Odontología' && activeTab !== 'Nota evolución' && activeTab !== 'Anam. Odontopediatría' && activeTab !== 'Endodoncia' && activeTab !== 'Signos Vitales' && activeTab !== 'Consentimientos' && (
        <div className="py-16 text-center text-gray-500">
          Módulo "{activeTab}" en construcción.
        </div>
      )}

      <EvolutionNoteModal isOpen={isEvolutionModalOpen} onClose={() => setIsEvolutionModalOpen(false)} />
    </div>
  )
}

import { Accordion, Field, TextInput, TextArea, Select } from './OrthodonticsUI'
import { DatePicker } from '../ui/DatePicker'

export default function ResumenTab() {
  return (
    <div className="mx-auto max-w-6xl pt-4 pb-12 font-sans space-y-6">
      
      {/* Doctor Dropdown */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-[#5B6973]">Doctor:</span>
          <button className="flex items-center gap-1 text-[#318B9F] text-sm hover:text-[#256c7d] transition-colors">
            Diego Cruzado
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
        <button className="text-[#318B9F] hover:text-[#256c7d]">
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      <Accordion title="Sección">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-6">
          <Field label="Fecha inicial"><DatePicker /></Field>
          <Field label="Fecha final"><DatePicker /></Field>
          
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5B6973]">Tiempo estimado</label>
            <div className="flex overflow-hidden rounded-md border border-gray-300 focus-within:border-[#318B9F] focus-within:ring-1 focus-within:ring-[#318B9F] bg-white transition-all">
              <input type="number" className="w-2/3 px-3 py-2 text-sm outline-none bg-transparent text-gray-800" />
              <div className="flex w-1/3 items-center justify-center bg-[#f8fafc] text-sm text-[#5B6973] border-l border-gray-200">
                Meses
              </div>
            </div>
          </div>
          
          <Field label="Tipo de Brackets"><Select options={['Bracket metálico', 'Bracket cerámico', 'Bracket zafiro', 'Bracket lingual', 'Bracket férulas', 'Bracket resina', 'Autoligante metálico', 'Autoligante estético', 'Iconix', 'Carriere slx 3D', 'Invisalign', 'Aliwell', 'Smartaligner', 'CCO system', 'Otros']} /></Field>
          
          <div className="md:col-span-2">
            <Field label="Diagnóstico"><TextArea rows={4} /></Field>
          </div>

          <Field label="Anclaje superior"><Select options={['Absoluto', 'Máximo', 'Medio', 'Mínimo']} /></Field>
          <Field label="Anclaje inferior"><Select options={['Absoluto', 'Máximo', 'Medio', 'Mínimo']} /></Field>
          
          <div className="md:col-span-2">
            <Field label="Nota"><TextArea rows={4} /></Field>
          </div>
        </div>
      </Accordion>

      <div className="flex justify-center mt-8">
        <button className="rounded-md bg-[#318B9F] px-8 py-2 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
          Guardar
        </button>
      </div>
    </div>
  )
}

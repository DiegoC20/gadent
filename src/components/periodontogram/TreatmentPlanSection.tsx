import { useState, ReactNode } from 'react'

interface AccordionProps {
  title: string
  children: ReactNode
  defaultOpen?: boolean
}

function Accordion({ title, children, defaultOpen = true }: AccordionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <div className="mb-4 rounded-lg border border-gray-200 bg-white shadow-sm overflow-hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between bg-gray-50 px-6 py-4 text-left transition-colors hover:bg-gray-100 outline-none"
      >
        <span className="font-semibold text-gray-700">{title}</span>
        <svg
          className={`h-5 w-5 transform text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {isOpen && (
        <div className="px-6 py-6 border-t border-gray-200 bg-white">
          {children}
        </div>
      )}
    </div>
  )
}

function Field({ label, children }: { label: string, children: ReactNode }) {
  return (
    <div className="mb-4">
      <label className="mb-1 block text-sm font-medium text-gray-700">{label}</label>
      {children}
    </div>
  )
}

function TextInput() {
  return <input type="text" className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-shadow" />
}

function TextArea() {
  return <textarea rows={3} className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 resize-none transition-shadow" />
}

export default function TreatmentPlanSection() {
  return (
    <div className="mx-auto max-w-4xl pt-4 pb-12 font-sans">
      <Accordion title="Sección">
        <Field label="Pronostico">
          <TextInput />
        </Field>
        <Field label="Diagnostico">
          <select className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 bg-white transition-shadow">
            <option>Seleccionar</option>
            <option>Gingivitis inducida por placa</option>
            <option>Periodontitis Estadio I</option>
            <option>Periodontitis Estadio II</option>
            <option>Periodontitis Estadio III</option>
            <option>Periodontitis Estadio IV</option>
          </select>
        </Field>
        <Field label="Notas:">
          <TextArea />
        </Field>
      </Accordion>

      <Accordion title="PLAN DE TRATAMIENTO - FASE 1">
        <Field label="Control de placa:"><TextInput /></Field>
        <Field label="Técnica de cepillado:"><TextInput /></Field>
        <Field label="Técnica de hilo dental:"><TextInput /></Field>
        <Field label="Eliminacion supragingival de placa y cálculo:"><TextInput /></Field>
        <Field label="Raspado y aislado:"><TextInput /></Field>
      </Accordion>

      <Accordion title="PLAN DE TRATAMIENTO - FASE II">
        <Field label="Procedimientos quirúrgicos:"><TextInput /></Field>
        <Field label="Notas:"><TextArea /></Field>
      </Accordion>

      <Accordion title="PLAN DE TRATAMIENTO - FASE III">
        <Field label="Mantenimiento:"><TextArea /></Field>
      </Accordion>

      <div className="mt-8 flex justify-end">
        <button className="rounded-lg bg-[#008BA1] px-8 py-2.5 text-base font-medium text-white hover:bg-[#007488] transition-colors shadow-sm">
          Guardar
        </button>
      </div>
    </div>
  )
}

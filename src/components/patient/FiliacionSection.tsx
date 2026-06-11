import { useState } from 'react'
import type { ReactNode } from 'react'
import type { Patient } from '../../types/patient'
import FamilyMemberModal from './FamilyMemberModal'
import FiscalDataModal from './FiscalDataModal'
import { DatePicker } from '../ui/DatePicker'

function FormField({
  label,
  children,
  className = '',
}: {
  label: string
  children: ReactNode
  className?: string
}) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs text-gray-500">{label}</label>
      {children}
    </div>
  )
}

function SelectInput({ value, options = ['Seleccionar'] }: { value: string; options?: string[] }) {
  return (
    <div className="relative">
      <select
        defaultValue={value}
        className="w-full appearance-none rounded border border-gray-300 bg-white px-3 py-2 pr-8 text-sm text-gray-700 outline-none focus:border-cyan-400"
      >
        {options.map((opt) => (
          <option key={opt}>{opt}</option>
        ))}
      </select>
      <svg
        className="pointer-events-none absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </div>
  )
}

function TextInput({ value, placeholder = '' }: { value: string; placeholder?: string }) {
  return (
    <input
      type="text"
      defaultValue={value}
      placeholder={placeholder}
      className="w-full rounded border border-gray-300 px-3 py-2 text-sm text-gray-700 outline-none focus:border-cyan-400"
    />
  )
}

function FiliacionSection({ patient }: { patient: Patient }) {
  const { detail } = patient
  const [activeTab, setActiveTab] = useState<'Personales' | 'Fiscales'>('Personales')
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false)
  const [isFiscalModalOpen, setIsFiscalModalOpen] = useState(false)

  return (
    <>
      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-4">
          <div className="flex gap-6">
            <button 
              type="button" 
              onClick={() => setActiveTab('Personales')}
              className={`relative py-3 text-sm font-medium ${activeTab === 'Personales' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Datos Personales
              {activeTab === 'Personales' && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />}
            </button>
            <button 
              type="button" 
              onClick={() => setActiveTab('Fiscales')}
              className={`relative py-3 text-sm font-medium ${activeTab === 'Fiscales' ? 'text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
            >
              Datos Fiscales
              {activeTab === 'Fiscales' && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-cyan-400" />}
            </button>
          </div>
          <button type="button" className="flex items-center gap-1 text-xs text-cyan-600 hover:underline">
            <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
              />
            </svg>
            Editar campos
          </button>
        </div>

        {activeTab === 'Personales' ? (
          <div className="space-y-4 p-4">
            <div className="grid grid-cols-3 gap-4">
              <FormField label="Nombres">
                <TextInput value={detail.nombres} />
              </FormField>
              <FormField label="Apellidos">
                <div className="flex gap-2">
                  <TextInput value={detail.apellidos} />
                  <TextInput value="" />
                </div>
              </FormField>
              <FormField label="Apodo">
                <TextInput value={detail.apodo} />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Documento">
                <div className="flex gap-2">
                  <SelectInput value="DNI" options={['DNI', 'CE', 'Pasaporte']} />
                  <TextInput value={detail.documento} />
                </div>
              </FormField>
              <FormField label="Teléfono">
                <div className="flex gap-2">
                  <div className="flex items-center gap-1 rounded border border-gray-300 px-2 text-sm">
                    <span>🇵🇪</span>
                    <span className="text-gray-500">+51</span>
                  </div>
                  <TextInput value={detail.telefono} />
                </div>
              </FormField>
              <FormField label="Email">
                <TextInput value={detail.email} />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="F. nacimiento">
                <DatePicker />
              </FormField>
              <FormField label="País de nacimiento">
                <SelectInput value={detail.paisNacimiento} options={['Perú', 'Colombia', 'Chile']} />
              </FormField>
              <FormField label="Tel. Fijo">
                <TextInput value={detail.telFijo} />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="N° HC">
                <TextInput value={detail.numeroHC} />
              </FormField>
              <FormField label="Dirección">
                <button
                  type="button"
                  className="flex w-full items-center rounded border border-dashed border-gray-300 px-3 py-2 text-sm text-cyan-600 hover:bg-gray-50"
                >
                  + Agregar
                </button>
              </FormField>
              <FormField label="Fuente captación">
                <SelectInput value="Seleccionar" />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Sexo">
                <SelectInput value={detail.sexo} options={['Mujer', 'Hombre']} />
              </FormField>
              <FormField label="Aseguradora">
                <SelectInput value={detail.aseguradora} />
              </FormField>
              <FormField label="Línea de negocio">
                <SelectInput value={detail.lineaNegocio} />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Grupo">
                <SelectInput value={detail.grupo} />
              </FormField>
              <FormField label="Ocupación">
                <TextInput value={detail.ocupacion} />
              </FormField>
              <FormField label="Adicional">
                <TextInput value={detail.adicional} />
              </FormField>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <FormField label="Última cita">
                <span className="block py-2 text-sm text-gray-700">{detail.ultimaCita}</span>
              </FormField>
            </div>

            <div className="flex justify-center pt-2">
              <button
                type="button"
                className="rounded bg-[#408a97] px-8 py-2 text-sm font-medium text-white hover:bg-[#357580]"
              >
                Guardar
              </button>
            </div>
          </div>
        ) : (
          <div className="p-4">
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="bg-[#2f75b5] text-white">
                    <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Razón Social</th>
                    <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Número Fiscal</th>
                    <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Dirección</th>
                    <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Departmento</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={4} className="bg-white py-12 text-center text-gray-400">
                      {/* Empty state visually matching the one we use below */}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div className="mt-4 flex">
              <button
                type="button"
                onClick={() => setIsFiscalModalOpen(true)}
                className="rounded-full bg-[#dbebf1] px-6 py-2 text-sm font-medium text-gray-600 hover:bg-[#cde0e8]"
              >
                Nuevo Registro
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="mt-6">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Familiar</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#2f75b5] text-white">
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Nombre</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">N° doc</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Teléfono</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Email</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Apoderado</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={5} className="bg-white py-12 text-center">
                  {/* Empty state can go here, similar to appointments */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 flex">
          <button
            type="button"
            onClick={() => setIsFamilyModalOpen(true)}
            className="rounded-full bg-[#dbebf1] px-6 py-2 text-sm font-medium text-gray-600 hover:bg-[#cde0e8]"
          >
            Nuevo Registro
          </button>
        </div>
      </div>

      <div className="mt-8 pb-8">
        <h3 className="mb-3 text-sm font-semibold text-gray-700">Citas</h3>
        <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="bg-[#2f75b5] text-white">
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Fecha</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Doctor</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Motivo</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Estado</th>
                <th className="px-4 py-3 text-center font-medium border-r border-[#3b85c8] last:border-0">Comentario</th>
              </tr>
            </thead>
            <tbody>
              {patient.appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className="bg-white py-12 text-center text-gray-400">
                    <div className="flex flex-col items-center justify-center">
                      <svg className="mb-2 h-16 w-16 text-[#cce0e8]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                        <circle cx="12" cy="13" r="3" strokeWidth={1.5} />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 15l2 2" />
                      </svg>
                      <span className="text-sm">No se encontró ninguna información</span>
                    </div>
                  </td>
                </tr>
              ) : (
                patient.appointments.map((appt) => (
                  <tr key={appt.date} className="border-b border-gray-200 bg-white">
                    <td className="px-4 py-3 text-center text-gray-700">{appt.date}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{appt.doctor}</td>
                    <td className="px-4 py-3 text-center text-gray-700">{appt.reason}</td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center gap-1 text-emerald-600">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        {appt.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-gray-500">{appt.comment || ''}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      <FamilyMemberModal isOpen={isFamilyModalOpen} onClose={() => setIsFamilyModalOpen(false)} />
      <FiscalDataModal isOpen={isFiscalModalOpen} onClose={() => setIsFiscalModalOpen(false)} />
    </>
  )
}

export default FiliacionSection

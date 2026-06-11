import { Accordion, Field, TextArea, Checkbox } from './OrthodonticsUI'

export default function PlanTrabajoTab() {
  return (
    <div className="mx-auto max-w-6xl pt-4 pb-12 font-sans space-y-6">
      <Accordion title="Sección">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Fotografías set ortodóntico" />
            <Checkbox label="Fotografías set quirúrgico" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Modelos de estudio con alginato" />
            <Checkbox label="Modelos de estudio con silicona" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="TAC de volumen completo con protocolo Morzán" />
            <Checkbox label="TAC de volumen completo sin informe" />
            <Checkbox label="TAC de campo pequeño" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Radiografías">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Postero anterior" />
            <Checkbox label="Periapicales de incisivos superiores" />
            <Checkbox label="Periapicales de incisivos inferiores" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Bitewing de molares" />
            <Checkbox label="Bitewing de molares y premolares" />
            <Checkbox label="Bitewing de premolares" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Carpal" />
            <Checkbox label="Oclusal superior" />
            <Checkbox label="Oclusal inferior" />
            <Checkbox label="Panorámica" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Interconsultas">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Otorrinolaringólogo" />
            <Checkbox label="Odontopediatra" />
            <Checkbox label="Odontólogo General" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Cirujano Máxilo facial" />
            <Checkbox label="Periodoncista" />
            <Checkbox label="Médica" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Fisioterapeuta Oral" />
            <Checkbox label="Psicólogo" />
            <Checkbox label="Encerado diagnóstico" />
            <Checkbox label="Exámenes auxiliares" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Informes</label>
          <TextArea rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Diagnóstico definitivo</label>
          <TextArea rows={4} />
        </div>
        <div>
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Objetivo</label>
          <TextArea rows={4} />
        </div>
      </div>

      <div className="flex justify-center mt-8">
        <button className="rounded-md bg-[#318B9F] px-8 py-2 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
          Guardar
        </button>
      </div>
    </div>
  )
}

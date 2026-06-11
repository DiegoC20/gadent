import { Accordion, Field, TextInput, TextArea, Select, Checkbox } from './OrthodonticsUI'
import { DatePicker } from '../ui/DatePicker'

export default function PlanTratamientoTab() {
  return (
    <div className="mx-auto max-w-6xl pt-4 pb-12 font-sans space-y-6">
      <Accordion title="Sección">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Field label="Fecha inicial"><DatePicker /></Field>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#5B6973]">Tiempo estimado</label>
            <TextInput type="number" />
            <span className="text-xs text-gray-400 mt-1 block">meses</span>
          </div>
          <Field label="Fecha final"><DatePicker /></Field>
        </div>
        
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-center mb-6">
          <label className="text-sm font-medium text-[#5B6973] w-12">Tipo</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
            <Select options={['Interceptivo', 'Guía de oclusión', 'Ortodóntico', 'Ortopédico', 'Ortodóntico - Ortopédico', 'Ortodóntico interdisciplinario', 'Ortodóntico interprofesional']} />
            <Select options={['Ortodoncia con corticotomía', 'Ortodoncia con PAOO']} />
            <Select options={['Ortodoncia con corticotomía', 'Alineadores Invisalign']} />
            <Select options={['Ortodoncia con corticotomía', 'Alineadores Keep Smiling']} />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Aparatos Ortopédicos">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="AEO" />
            <Checkbox label="Hiperpropulsión con bloques gemelos" />
            <Checkbox label="Hiperpropulsión con Bionator" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="ERP Haas" />
            <Checkbox label="ERP Hyrax" />
            <Checkbox label="ERP MARPE tipo Moon" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="ERP MARPE con acrílico" />
            <Checkbox label="Máscara facial Delaire" />
            <Checkbox label="Máscara facial Petit" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Mentonera" />
            <Checkbox label="Placa labio activa" />
            <Checkbox label="Pantalla oral" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Anclaje">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-6">
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-[#5B6973] md:w-16">Superior</label>
            <div className="flex-1"><Select options={['Máximo', 'Mediano', 'Mínimo']} /></div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-4">
            <label className="text-sm font-medium text-[#5B6973] md:w-16">Inferior</label>
            <div className="flex-1"><Select options={['Máximo', 'Mediano', 'Mínimo']} /></div>
          </div>
        </div>
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Mini implantes" />
            <Checkbox label="Bicorticales" />
            <Checkbox label="Mini placas" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Mini implantes palatinos paramediales" />
            <Checkbox label="Mini implantes bicorticales paramediales" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Aparatos">
        <div className="space-y-4 mb-6">
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Distal jet óseo" />
            <Checkbox label="ATP semi fijo" />
            <Checkbox label="Brazo de poder para tracción mesial de molar" />
            <Checkbox label="Placa activa de expansión" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Péndulo óseo" />
            <Checkbox label="ATP más botón de Nance" />
            <Checkbox label="Placa para levantar mordida" />
            <Checkbox label="Mantenedor de espacio" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Resorte vestibular para distalizar molar" />
            <Checkbox label="ATP fijo" />
            <Checkbox label="VAC modificado" />
            <Checkbox label="Recuperador de espacio" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="MUST óseo" />
            <Checkbox label="Arco lingual semi fijo" />
            <Checkbox label="ALF" />
            <Checkbox label="Rejilla lingual" />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="Cantilever óseo" />
            <Checkbox label="Botón de Nance óseo" />
            <Checkbox label="AEO ortodóntico" />
            <Checkbox label="Arco lingual semi fijo " />
          </div>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <Checkbox label="QUAD HÉLIX" />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Otros">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mb-6">
          <Field label="Técnica"><Select options={['CCO', 'Roth', 'Estándar', 'Mbt', 'Autoligantes', 'Linguales']} /></Field>
          <Field label="Brackets"><Select options={['Brackets de acero', 'Brackets de porcelana', 'Brackets de porcelana superiores y de acero inferiores']} /></Field>
          <Field label="Tubos adhesivos sup."><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>
          <Field label="Tubos adhesivos inf."><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>

          <Field label="Banda superior"><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>
          <Field label="Banda inferior"><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>
          <Field label="Tubos soldados sup."><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>
          <Field label="Tubos soldados inf."><Select options={['Primeras molares', 'Segundas molares', 'Primeras y segundas molares']} /></Field>

          <Field label="Extracciones"><Select options={['Primeras premolares superiores e inferiores', 'Primeras premolares superiores', 'Primeras premolares superiores y segundas premolares inferiores']} /></Field>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <div className="mt-6">
        <label className="block text-sm font-medium text-[#5B6973] mb-2">Descripción</label>
        <TextArea rows={4} />
      </div>

      <div className="flex justify-center mt-8">
        <button className="rounded-md bg-[#318B9F] px-8 py-2 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
          Guardar
        </button>
      </div>
    </div>
  )
}

import { Accordion, Field, TextInput, TextArea, Select, Checkbox } from './OrthodonticsUI'

export default function ExamenClinicoTab() {
  return (
    <div className="mx-auto max-w-6xl pt-4 pb-12 font-sans space-y-6">
      <Accordion title="Sección">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Field label="Motivo de consulta"><TextInput /></Field>
          <Field label="Historia médica"><TextInput /></Field>
          <Field label="Historia odontológica"><TextInput /></Field>
          <Field label="Historia Familiar"><TextInput /></Field>
        </div>
      </Accordion>

      <Accordion title="Examen Extraoral">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-4 mb-4">
          <Field label="Cráneo"><Select options={['Mesocéfalo', 'Braquicéfalo', 'Dolicocéfalo']} /></Field>
          <Field label="Cara"><Select options={['Mesofacial', 'Braquifacial', 'Dolicofacial']} /></Field>
          <Field label="Musculatura"><Select options={['Normal', 'Alterada']} /></Field>
          <Field label="ATM"><Select options={['Apertura bucal normal', 'Dolor al despertar', 'Dolor agudo', 'Dolor espontáneo', 'Click articular', 'Crepitación', 'Dolor a la palpación', 'Sensibilidad a la palpación', 'Apertura bucal disminuida']} /></Field>
          
          <Field label="Mentón"><Select options={['Normal', 'Pobre', 'Prominente']} /></Field>
          <Field label="ANL"><Select options={['Normal', 'Cerrado', 'Abierto', 'Cerrado con nariz baja', 'Abierto con nariz respingada']} /></Field>
          <Field label="Fonación"><Select options={['Normal', 'Rotacismo', 'Seseo']} /></Field>
          <Field label="Deglución"><Select options={['Normal', 'Atípica tipo I', 'Atípica tipo II', 'Atípica tipo III', 'Atípica tipo IV']} /></Field>
          
          <Field label="Respiración"><Select options={['Normal', 'Mixta']} /></Field>
          <Field label="Permeabilidad nasal"><Select options={['Normal', 'Disminuida']} /></Field>
          <Field label="Hábitos"><Select options={['Ausentes', 'Respiración oral', 'Succión del pulgar', 'Succión de otro dedo', 'Succión de objetos']} /></Field>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Asimetría facial">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Field label="Plano bipupilar"><Select options={['Adecuado', 'Discrepante']} /></Field>
          <Field label="Tabique nasal"><Select options={['Alineado', 'Desviado a la derecha', 'Desviado a la izquierda']} /></Field>
          <Field label="Comisura bucales"><Select options={['Niveladas', 'Discrepantes a la derecha', 'Discrepantes a la izquierda']} /></Field>
        </div>

        <div className="space-y-4 mb-6 px-2">
          {/* Filtrum Row */}
          <div className="flex items-center gap-6">
            <div className="w-32 text-sm text-[#5B6973]">Filtrum</div>
            <div className="w-24"><Checkbox label="Alineado" /></div>
            <div className="flex-1 text-sm text-[#5B6973]">Desviación lateral del filtrum</div>
            <div className="flex items-center gap-4">
              <Checkbox label="Izquierdo" />
              <Checkbox label="Derecha" />
            </div>
          </div>
          <hr className="border-gray-100" />
          {/* Mentón Row */}
          <div className="flex items-center gap-6">
            <div className="w-32 text-sm text-[#5B6973]">Mentón</div>
            <div className="w-24"><Checkbox label="Alineado" /></div>
            <div className="flex-1 text-sm text-[#5B6973]">Desviación lateral del mentón</div>
            <div className="flex items-center gap-4">
              <Checkbox label="Izquierdo" />
              <Checkbox label="Derecha" />
            </div>
          </div>
        </div>

        <div className="mb-8">
          <TextArea rows={4} />
        </div>

        {/* Perfil AP y proyección sagital de maxilares */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Perfil AP y proyección sagital de maxilares</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select options={['Convexo', 'Recto', 'Cóncavo']} />
            <Select options={['1/3 medio normal', '1/3 medio pobre', '1/3 medio aumentado']} />
            <Select options={['1/3 inferior normal', '1/3 inferior pobre', '1/3 inferior aumentado']} />
          </div>
        </div>

        {/* Perfil y desarrollo vertical de maxilares */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Perfil y desarrollo vertical de maxilares</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select options={['Normodivergente', 'Hipodivergente', 'Hiperdivergente']} />
            <Select options={['1/3 medio normal', '1/3 medio pobre', '1/3 medio aumentado']} />
            <Select options={['1/3 inferior normal', '1/3 inferior pobre', '1/3 inferior aumentado']} />
          </div>
        </div>

        {/* Labios */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Labios</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Select options={['En relación normal', 'En relación alterada']} />
            <Select options={['En posición retruída', 'En posición protruída', 'En posición normal']} />
            <div className="space-y-2">
              <Select options={['Componentes con sellado suave', 'Componentes con sellado excesivo', 'Incompetentes separados por']} />
              <TextInput placeholder="Nota..." />
            </div>
            <Select options={['Hipotónicos', 'Normales', 'Hipertónicos']} />
          </div>
        </div>

        {/* Labio inferior */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Labio inferior</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Select options={['En posición retruída', 'En posición protruída', 'En posición normal']} />
              <TextInput placeholder="Nota..." />
            </div>
            <Select options={['Evertido', 'No evertido']} />
            <Select options={['Delgado', 'Grueso', 'Promedio']} />
          </div>
        </div>

        {/* Labio superior */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Labio superior</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <Select options={['En posición retruída', 'En posición protruída', 'En posición normal']} />
              <TextInput placeholder="Nota..." />
            </div>
            <Select options={['Evertido', 'No evertido']} />
            <Select options={['Delgado', 'Grueso', 'Promedio']} />
          </div>
        </div>

        {/* Sonrisa */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Sonrisa</label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Select options={['Gingival (alta)', 'Media', 'Baja']} />
            <Select options={['Con corredores bucales normales', 'Con corredores bucales cerrados', 'Con corredores bucales amplios']} />
            <Select options={['Acompañada con el labio inferior', 'No acompañada con el labio inferior']} />
          </div>
        </div>
        <TextArea rows={4} />
      </Accordion>

      <Accordion title="Examen Intraoral">
        <div className="space-y-4 mb-8">
          {/* Mucosa rows */}
          {[
            'Mucosa de labio',
            'Mucosa vestibular',
            'Frenillos vestibulares',
            'Mucosa palatina',
            'Mucosa orofaríngea'
          ].map((label, idx) => (
            <div key={idx} className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
              <div className="md:w-48 text-sm text-[#5B6973]">{label}</div>
              <div className="flex items-center gap-4 md:w-48">
                <Checkbox label="Normal" />
                <Checkbox label="Alterada" />
              </div>
              <div className="flex-1">
                <TextInput />
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="md:w-48 text-sm text-[#5B6973]">Amígdalas</div>
            <div className="flex flex-wrap items-center gap-4 md:w-[450px]">
              <Checkbox label="Normales" />
              <Checkbox label="Hipertróficas" />
              <Checkbox label="Hipertróficas y crípticas" />
            </div>
            <div className="flex-1">
              <TextInput />
            </div>
          </div>
        </div>

        {/* Lengua */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Lengua</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Select options={['Normotónica', 'Hipotónica']} />
            <Select options={['Posición normal', 'Posición baja']} />
            <Select options={['Movilidad normal', 'Hipomovilidad', 'Hipermovilidad']} />
            <Select options={['Frenillo lingual normal', 'Frenillo lingual corto']} />
          </div>
        </div>

        {/* Gíngiva */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Gíngiva de incisivos inferiores</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select options={['Grosor normal', 'Delgada', 'Delgada y traslúcida', 'Gruesa', 'Muy gruesa']} />
              <Select options={['Encía adherida de 2.5mm', 'Encía adherida de 3mm', 'Encía adherida de 3.5mm', 'Encía adherida de 4mm', 'Encía adherida de 4.5mm']} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Evaluación general de la gíngiva</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select options={['Grosor normal', 'Delgada', 'Delgada y traslúcida', 'Gruesa', 'Muy gruesa']} />
              <div className="space-y-2">
                <Select options={['Margen gingival', 'Retraída en piezas']} />
                <TextInput placeholder="Nota..." />
              </div>
            </div>
          </div>
        </div>

        {/* Arco superior */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Arco superior</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Select options={['Ovoide', 'Triangular', 'Cuadrado']} />
            <Select options={['Simétrico', 'Asimétrico']} />
            <div className="space-y-2">
              <Select options={['Alineado', 'Apiñado en', 'Espaciado en']} />
              <TextInput placeholder="Nota..." />
            </div>
            <div className="space-y-2">
              <Select options={['Sin DAD', 'Con DAD de']} />
              <TextInput placeholder="Nota..." />
            </div>
          </div>
        </div>

        {/* Arco inferior */}
        <div className="mb-8">
          <label className="block text-sm font-medium text-[#5B6973] mb-2">Arco inferior</label>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Select options={['Ovoide', 'Triangular', 'Cuadrado']} />
            <Select options={['Simétrico', 'Asimétrico']} />
            <div className="space-y-2">
              <Select options={['Alienado', 'Apiñado en', 'Espaciado en']} />
              <TextInput placeholder="Nota..." />
            </div>
            <div className="space-y-2">
              <Select options={['Sin DAD', 'Con DAD de']} />
              <TextInput placeholder="Nota..." />
            </div>
          </div>
        </div>

        {/* Large Text inputs */}
        <div className="space-y-4 mb-8">
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Error molar derecho</label>
            <TextInput />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Error molar izquierdo</label>
            <TextInput />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Dientes ausentes</label>
            <TextInput />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#5B6973] mb-2">Alteraciones de número, forma y tamaño de dientes</label>
            <TextInput />
          </div>
        </div>

        {/* Big Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-x-6 gap-y-6 mb-8">
          <Field label="Relación molar derecha"><Select options={['Llave molar ideal', 'Clase I', 'Clase II', 'Clase III', 'NR']} /></Field>
          <Field label="Relación molar izquierda"><Select options={['Llave molar ideal', 'Clase I', 'Clase II', 'Clase III', 'NR']} /></Field>
          <Field label="Relación canina derecha"><Select options={['Clase I', 'Clase II', 'Clase III', 'NR']} /></Field>
          <Field label="Relación canina izquierda"><Select options={['Clase I', 'Clase II', 'Clase III', 'NR']} /></Field>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Mordida invertida</label>
            <Select options={['Dentaria', 'Funcional', 'Esquelética']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Resalte horizontal</label>
            <Select options={['NR', 'Normal', 'Aumentado', 'Invertido']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Curva de Spee</label>
            <Select options={['NR', 'Normal', 'Acentuada']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Resalte vertical</label>
            <Select options={['NR', 'Normal', 'Aumentado']} />
            <TextInput placeholder="Nota..." />
          </div>

          <Field label="Des. Vert. Proceso Alveolar Sup"><Select options={['Normal', 'Disminuido', 'Aumentado']} /></Field>
          <Field label="Mordida abierta anterior"><Select options={['Dentaria', 'Dentoalveolar por hábito', 'Esquelética']} /></Field>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Mordida abierta posterior</label>
            <Select options={['Dentaria', 'Dentoalveolar por hábito', 'Esquelética', 'Completa']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Dimensión transversal maxilar</label>
            <Select options={['Normal', 'Disminuida', 'Aumentada']} />
            <TextInput placeholder="Nota..." />
          </div>

          <Field label="Mordida cruzada posterior"><Select options={['Ausente', 'Presente']} /></Field>
          <Field label="Altura Cusp. Palatinas Sup."><Select options={['Normales', 'Altas', 'Bajas']} /></Field>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Línea media superior</label>
            <Select options={['Alineada', 'Discrepante a la derecha', 'Discrepante a la izquierda']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Línea media inferior</label>
            <Select options={['Alineada', 'Discrepante a la derecha', 'Discrepante a la izquierda']} />
            <TextInput placeholder="Nota..." />
          </div>

          <Field label="Incisivos superiores"><Select options={['Normales', 'Vestibularizados', 'Palatinizados', 'Protuidos', 'Retruidos', 'Vestibularizados y protruidos', 'Vestibularizados y retruidos', 'Palatinizados y protruidos', 'Palatinizados y retruidos']} /></Field>
          <Field label="Incisivos inferiores"><Select options={['Normales', 'Vestibularizados', 'Lingualizados', 'Protuidos', 'Retruidos', 'Vestibularizados y protruidos', 'Vestibularizados y retruidos', 'Lingualizados y protruidos', 'Lingualizados y retruidos']} /></Field>
          <div className="space-y-2">
            <label className="block text-sm font-medium text-[#5B6973]">Patrón de Clase II-2</label>
            <Select options={['Tipo A', 'Tipo B', 'Tipo C']} />
            <TextInput placeholder="Nota..." />
          </div>
          <div /> {/* Empty */}
        </div>

        {/* Observaciones y Maloclusión */}
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="md:w-32 text-sm text-[#5B6973]">Observaciones</div>
            <div className="flex-1">
              <TextInput />
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
            <div className="md:w-32 text-sm text-[#5B6973]">Maloclusión</div>
            <div className="flex-1">
              <TextInput />
            </div>
          </div>
        </div>
      </Accordion>

      <div className="flex justify-end mt-8">
        <button className="rounded-full bg-[#318B9F] px-8 py-2 text-sm font-medium text-white hover:bg-[#256c7d] transition-colors">
          Guardar
        </button>
      </div>
    </div>
  )
}

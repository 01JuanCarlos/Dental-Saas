import { FileText, User, Calendar, Stethoscope, Settings } from 'lucide-react'
import { PROCEDIMIENTOS, RANGOS_NINO } from '../../data/recetas.js'

export default function RecipeForm({
  form, fecha, errors, loading,
  onUpdate, onGenerate, onOpenTemplate,
  hideTemplateBtn = false,
}) {
  return (
    <div className="w-full lg:w-1/4 bg-slate-50 p-8 rounded-3xl shadow-2xl border-t-[10px] border-verde h-fit">

      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-verde flex items-center gap-3" style={{ fontFamily: 'Syne' }}>
            <FileText className="w-6 h-6" />
            Hacer Receta
          </h2>
          {!hideTemplateBtn && (
            <button
              onClick={onOpenTemplate}
              className="flex items-center gap-1 text-[11px] font-bold text-verde border border-verde/30 rounded-xl px-3 py-2 hover:bg-verde hover:text-white transition-all"
            >
              <Settings className="w-3.5 h-3.5" />
              Plantilla
            </button>
          )}
        </div>
        <p className="text-gray-500 text-xs mt-2">Complete los campos para generar la orden médica.</p>
      </header>

      <div className="space-y-6">

        {/* Paciente */}
        <div className="group">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1 group-focus-within:text-verde transition-colors">
            Nombre del Paciente <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={form.paciente}
              onChange={(e) => onUpdate('paciente', e.target.value)}
              placeholder="Ej. Juan Pérez"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl outline-none uppercase font-semibold text-sm transition-all focus:border-verde focus:ring-4 focus:ring-verde/10 shadow-sm"
            />
          </div>
        </div>

        {/* Edad + Fecha */}
        <div className="grid grid-cols-2 gap-4">
          <div className="group">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">Edad</label>
            <input
              type="number"
              value={form.edad}
              onChange={(e) => onUpdate('edad', e.target.value)}
              placeholder="00"
              min="0" max="120"
              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none text-sm transition-all focus:border-verde focus:ring-4 focus:ring-verde/10"
            />
          </div>
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-1 ml-1">Fecha</label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={fecha}
                readOnly
                className="w-full pl-10 pr-2 py-3 bg-gray-100 border border-gray-200 rounded-xl text-gray-500 text-xs cursor-not-allowed"
              />
            </div>
          </div>
        </div>

        {/* Tipo Paciente */}
        <div className="space-y-4">
          <div className="group">
            <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
              Tipo de Paciente
            </label>
            <select
              value={form.tipoPaciente}
              onChange={(e) => onUpdate('tipoPaciente', e.target.value)}
              className="w-full p-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-sm appearance-none cursor-pointer focus:border-verde focus:ring-4 focus:ring-verde/10 pr-8"
            >
              <option value="adulto">Adulto</option>
              <option value="nino">Niño</option>
            </select>
          </div>

          {form.tipoPaciente === 'nino' && (
            <div>
              <label className="block text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-1 ml-1">
                Rango de Edad Infantil
              </label>
              <select
                value={form.rangoNino}
                onChange={(e) => onUpdate('rangoNino', e.target.value)}
                className="w-full p-3 bg-blue-50 border border-blue-200 rounded-xl text-sm text-blue-800 outline-none pr-8"
              >
                {RANGOS_NINO.map((r) => (
                  <option key={r.value} value={r.value}>{r.label}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Procedimiento */}
        <div className="group">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
            Procedimiento <span className="text-red-400">*</span>
          </label>
          <div className="relative">
            <Stethoscope className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <select
              value={form.procedimiento}
              onChange={(e) => onUpdate('procedimiento', e.target.value)}
              className="w-full pl-10 pr-8 py-3 bg-white border border-gray-200 rounded-xl outline-none font-bold text-gray-700 text-sm appearance-none cursor-pointer focus:border-verde focus:ring-4 focus:ring-verde/10"
            >
              {PROCEDIMIENTOS.map((p) => (
                <option key={p.value} value={p.value}>{p.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Prescripción */}
        <div className="group">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
            Prescripción Médica
          </label>
          <textarea
            value={form.prescripcion}
            onChange={(e) => onUpdate('prescripcion', e.target.value)}
            rows={3}
            placeholder="Medicamentos y dosis..."
            className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none text-sm italic transition-all focus:border-verde focus:ring-4 focus:ring-verde/10 resize-none"
          />
        </div>

        {/* Indicaciones */}
        <div className="group">
          <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1 ml-1">
            Indicaciones Adicionales
          </label>
          <textarea
            value={form.indicaciones}
            onChange={(e) => onUpdate('indicaciones', e.target.value)}
            rows={3}
            placeholder="Recomendaciones de cuidado..."
            className="w-full p-4 bg-white border border-gray-200 rounded-xl outline-none text-[12px] italic transition-all focus:border-verde focus:ring-4 focus:ring-verde/10 resize-none"
          />
        </div>

        {/* Errors */}
        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl px-4 py-3">
            {errors.map((e, i) => <div key={i}>• {e}</div>)}
          </div>
        )}

        {/* Generate Button */}
        <button
          onClick={onGenerate}
          disabled={loading}
          className="w-full bg-verde text-white py-5 rounded-2xl font-bold hover:bg-verde-light transition-all shadow-xl hover:shadow-verde/20 active:scale-95 flex items-center justify-center gap-2 mt-4 disabled:opacity-70 disabled:cursor-not-allowed"
          style={{ fontFamily: 'Syne' }}
        >
          {loading ? (
            <>
              <span className="spinner" />
              GENERANDO...
            </>
          ) : (
            <>
              GENERAR RECETA
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 26 26" width="24" height="24" fill="#FFF" fillRule="evenodd">
                <path d="M13 26C5.82 26 0 20.18 0 13S5.82 0 13 0s13 5.82 13 13-5.82 13-13 13zm0-2c6.075 0 11-4.925 11-11S19.075 2 13 2 2 6.925 2 13s4.925 11 11 11z" fillRule="nonzero" />
                <path d="M18.684 13.105a.55.55 0 0 1-.148.378l-5.263 5.263a.55.55 0 0 1-.378.148.54.54 0 0 1-.526-.526V15.21H7.842a.54.54 0 0 1-.526-.526v-3.158A.54.54 0 0 1 7.842 11h4.526V7.842a.52.52 0 0 1 .526-.526c.148 0 .28.066.395.164l5.247 5.247a.55.55 0 0 1 .148.378z" />
              </svg>
            </>
          )}
        </button>

      </div>
    </div>
  )
}

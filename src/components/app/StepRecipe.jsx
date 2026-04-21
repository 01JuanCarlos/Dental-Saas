import { Settings } from 'lucide-react'
import RecipeForm from './RecipeForm.jsx'
import RecipePreview from './RecipePreview.jsx'

export default function StepRecipe({
  form, fecha, errors, loading,
  previewConfig, previewBlobUrl,
  onUpdate, onGenerate, onEditTemplate,
}) {
  return (
    <div className="max-w-[1600px] mx-auto p-4 md:p-8">

      {/* Bar above with edit template link */}
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-syne font-bold text-xl text-gray-900">Generar receta</h2>
          <p className="text-sm text-gray-400">Completa los datos y genera el PDF listo para compartir.</p>
        </div>
        <button
          onClick={onEditTemplate}
          className="flex items-center gap-2 text-sm font-semibold text-verde border border-verde/30 bg-verde-pale px-4 py-2 rounded-xl hover:bg-verde hover:text-white transition-all"
        >
          <Settings className="w-4 h-4" />
          Editar plantilla
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        <RecipeForm
          form={form}
          fecha={fecha}
          errors={errors}
          loading={loading}
          onUpdate={onUpdate}
          onGenerate={onGenerate}
          onOpenTemplate={onEditTemplate}
          hideTemplateBtn
        />
        <RecipePreview
          form={form}
          fecha={fecha}
          previewConfig={previewConfig}
          previewBlobUrl={previewBlobUrl}
        />
      </div>
    </div>
  )
}

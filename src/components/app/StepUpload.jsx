import { useRef, useState } from 'react'
import { Upload, ImageIcon, Sparkles } from 'lucide-react'

export default function StepUpload({ onImageSelected, onUseDefault }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  const handleFile = (file) => {
    if (!file || !file.type.startsWith('image/')) return
    const url = URL.createObjectURL(file)
    onImageSelected(file, url)
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-16">
      <div className="max-w-2xl w-full">

        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-verde-pale rounded-2xl mb-5">
            <ImageIcon className="w-8 h-8 text-verde" />
          </div>
          <h1 className="font-syne font-extrabold text-3xl text-gray-900 mb-3">
            Configura tu plantilla
          </h1>
          <p className="text-gray-400 font-light text-base max-w-md mx-auto leading-relaxed">
            Sube la imagen de tu recetario oficial para personalizarla, o usa la plantilla por defecto del sistema.
          </p>
        </div>

        <label
          className={`relative flex flex-col items-center justify-center gap-4 w-full rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-16 px-8 mb-5 ${
            dragging
              ? 'border-verde bg-verde-pale scale-[1.01]'
              : 'border-gray-200 bg-white hover:border-verde/50 hover:bg-verde-pale/30'
          }`}
          onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault()
            setDragging(false)
            handleFile(e.dataTransfer.files[0])
          }}
        >
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all ${dragging ? 'bg-verde' : 'bg-gray-100'}`}>
            <Upload className={`w-8 h-8 transition-colors ${dragging ? 'text-white' : 'text-gray-400'}`} />
          </div>
          <div className="text-center">
            <div className="font-syne font-bold text-lg text-gray-800 mb-1">
              {dragging ? 'Suelta aquí tu imagen' : 'Subir plantilla personalizada'}
            </div>
            <div className="text-sm text-gray-400">PNG o JPG · haz clic o arrastra aquí</div>
          </div>
          <div className="flex gap-2">
            {['PNG', 'JPG', 'JPEG'].map((fmt) => (
              <span key={fmt} className="text-xs font-bold text-gray-400 bg-gray-100 px-2.5 py-1 rounded-lg">{fmt}</span>
            ))}
          </div>
          <input ref={inputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={(e) => handleFile(e.target.files[0])} />
        </label>

        <div className="flex items-center gap-4 mb-5">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-medium">o también puedes</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <button
          onClick={onUseDefault}
          className="w-full flex items-center gap-4 p-5 bg-white border border-gray-200 rounded-2xl hover:border-verde hover:bg-verde-pale/20 transition-all group"
        >
          <div className="w-12 h-12 bg-verde-pale rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-verde transition-all">
            <Sparkles className="w-6 h-6 text-verde group-hover:text-white transition-colors" />
          </div>
          <div className="text-left">
            <div className="font-syne font-bold text-gray-800 text-base">Usar plantilla por defecto</div>
            <div className="text-xs text-gray-400 mt-0.5">Plantilla profesional del Consultorio Alta Gracia · Lista para usar</div>
          </div>
          <div className="ml-auto text-gray-300 group-hover:text-verde transition-colors font-bold text-lg">→</div>
        </button>

        <p className="text-center text-xs text-gray-400 mt-8">
          💡 Tip: Cualquier tamaño funciona — el sistema ajustará el tamaño de fuente automáticamente según las dimensiones de tu imagen.
        </p>
      </div>
    </div>
  )
}
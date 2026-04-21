import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowLeft, Check } from 'lucide-react'
import StepUpload from '../components/app/StepUpload.jsx'
import StepCalibrate from '../components/app/StepCalibrate.jsx'
import StepRecipe from '../components/app/StepRecipe.jsx'
import SuccessModal from '../components/app/SuccessModal.jsx'
import { useReceta } from '../hooks/useReceta.js'
import { getPlantillaConfig, CONFIG_DEFAULT } from '../utils/db.js'

const STEPS = [
  { id: 1, label: 'Plantilla' },
  { id: 2, label: 'Calibrar campos' },
  { id: 3, label: 'Generar receta' },
]

export default function AppPage() {
  const [step, setStep] = useState(1)
  const [wizardBlob, setWizardBlob] = useState(null)
  const [wizardBlobUrl, setWizardBlobUrl] = useState(null)

  const {
    form, fecha, errors, loading, pdfResult,
    previewConfig, previewBlobUrl, toast,
    updateForm, generatePDF,
    downloadPDF, shareWhatsApp, closeModal,
    activateCustomMode, activateOriginalMode,
    showToast,
  } = useReceta()

  // If template already saved, skip to step 3
  useEffect(() => {
    getPlantillaConfig()
      .then(({ imageBytes, config }) => {
        if (imageBytes) {
          const blob = new Blob([imageBytes])
          const url = URL.createObjectURL(blob)
          setWizardBlob(blob)
          setWizardBlobUrl(url)
          activateCustomMode(config, url)
          setStep(3)
        }
      })
      .catch(() => {})
  }, [])

  const handleImageSelected = (blob, url) => {
    setWizardBlob(blob)
    setWizardBlobUrl(url)
    setStep(2)
  }

  const handleUseDefault = () => {
    activateOriginalMode()
    setStep(3)
  }

  const handleCalibrateSave = (config, blobUrl, blob) => {
    setWizardBlobUrl(blobUrl)
    setWizardBlob(blob)
    activateCustomMode(config, blobUrl)
    setStep(3)
    showToast('✓ Plantilla configurada correctamente')
  }

  return (
    <div className="min-h-screen bg-[#f9fbfa] flex flex-col">

      {/* Topbar */}
      <div className="bg-verde px-6 py-3 flex items-center gap-4 shadow-lg flex-shrink-0">
        <Link to="/" className="flex items-center gap-2 text-white/70 hover:text-white text-sm transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Inicio
        </Link>
        <div className="flex-1 flex items-center justify-center">
          <span className="text-white font-syne font-extrabold text-lg">🦷 Recepta</span>
        </div>
        <div className="text-white/40 text-xs hidden md:block">v2.0</div>
      </div>

      {/* Step indicator */}
      <div className="bg-white border-b border-gray-100 px-6 py-5 flex-shrink-0">
        <div className="max-w-2xl mx-auto flex items-center justify-center">
          {STEPS.map((s, i) => {
            const done = step > s.id
            const active = step === s.id
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center gap-1.5">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300 ${
                    done ? 'bg-verde border-verde text-white'
                    : active ? 'bg-white border-verde text-verde shadow-md shadow-verde/20'
                    : 'bg-white border-gray-200 text-gray-300'
                  }`}>
                    {done ? <Check className="w-4 h-4" /> : s.id}
                  </div>
                  <span className={`text-xs font-semibold hidden sm:block transition-colors ${
                    active ? 'text-verde' : done ? 'text-verde/60' : 'text-gray-300'
                  }`}>{s.label}</span>
                </div>
                {i < STEPS.length - 1 && (
                  <div className={`w-24 md:w-36 h-0.5 mx-3 mb-5 rounded-full transition-all duration-500 ${step > s.id ? 'bg-verde' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Step content */}
      <div className="flex-1">
        {step === 1 && (
          <StepUpload
            onImageSelected={handleImageSelected}
            onUseDefault={handleUseDefault}
          />
        )}
        {step === 2 && (
          <StepCalibrate
            blob={wizardBlob}
            blobUrl={wizardBlobUrl}
            savedConfig={previewConfig}
            onSave={handleCalibrateSave}
            onBack={() => setStep(1)}
          />
        )}
        {step === 3 && (
          <StepRecipe
            form={form}
            fecha={fecha}
            errors={errors}
            loading={loading}
            previewConfig={previewConfig}
            previewBlobUrl={previewBlobUrl}
            onUpdate={updateForm}
            onGenerate={generatePDF}
            onEditTemplate={() => setStep(wizardBlobUrl ? 2 : 1)}
          />
        )}
      </div>

      {pdfResult && (
        <SuccessModal
          onDownload={downloadPDF}
          onShare={shareWhatsApp}
          onClose={closeModal}
        />
      )}

      {toast && (
        <div className="toast" style={{ background: toast.isError ? '#c0392b' : '#243e36' }}>
          {toast.msg}
        </div>
      )}
    </div>
  )
}
import { useState, useEffect, useCallback } from 'react'
import { recetasData } from '../data/recetas.js'
import { getPlantillaConfig } from '../utils/db.js'
import { generarPDF, getToday } from '../utils/pdf.js'

const INITIAL_FORM = {
  paciente: '',
  edad: '',
  tipoPaciente: 'adulto',
  rangoNino: '5-6',
  procedimiento: '',
  prescripcion: '',
  indicaciones: '',
}

export function useReceta() {
  const [form, setForm] = useState(INITIAL_FORM)
  const [fecha] = useState(getToday)
  const [errors, setErrors] = useState([])
  const [loading, setLoading] = useState(false)
  const [pdfResult, setPdfResult] = useState(null) // { blobUrl, nombre }
  const [previewConfig, setPreviewConfig] = useState(null)
  const [previewBlobUrl, setPreviewBlobUrl] = useState(null)
  const [toast, setToast] = useState(null)

  // Load saved template on mount
  useEffect(() => {
    getPlantillaConfig()
      .then(({ imageBytes, config }) => {
        if (imageBytes) {
          const blob = new Blob([imageBytes])
          const url = URL.createObjectURL(blob)
          setPreviewConfig(config)
          setPreviewBlobUrl(url)
        }
      })
      .catch(() => {})
  }, [])

  const updateForm = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }

      // Auto-fill prescription when procedure changes
      if (field === 'procedimiento' || field === 'tipoPaciente' || field === 'rangoNino') {
        const proc = field === 'procedimiento' ? value : next.procedimiento
        const tipo = field === 'tipoPaciente' ? value : next.tipoPaciente
        const rango = field === 'rangoNino' ? value : next.rangoNino

        const clave =
          proc === 'extraccion'
            ? tipo === 'adulto'
              ? 'extraccion_adulto'
              : `extraccion_nino_${rango}`
            : proc

        if (clave && recetasData[clave]) {
          next.prescripcion = recetasData[clave].p
          next.indicaciones = recetasData[clave].i
        }
      }
      return next
    })
  }, [])

  const validate = useCallback(() => {
    const errs = []
    if (!form.paciente.trim()) errs.push('El nombre del paciente es obligatorio.')
    if (!form.procedimiento) errs.push('Debe seleccionar un procedimiento.')
    setErrors(errs)
    return errs.length === 0
  }, [form])

  const showToast = useCallback((msg, isError = false) => {
    setToast({ msg, isError })
    setTimeout(() => setToast(null), 3000)
  }, [])

  const generatePDF = useCallback(async () => {
    if (!validate()) return
    setLoading(true)
    try {
      const { imageBytes, config } = await getPlantillaConfig()

      let bytes = imageBytes
      if (!bytes) {
        const resp = await fetch('/plantilla.png')
        if (!resp.ok) throw new Error('No se pudo cargar la plantilla.')
        bytes = await resp.arrayBuffer()
      }

      const pdfBytes = await generarPDF({
        valores: { ...form, fecha },
        imageBytes: bytes,
        config,
      })

      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      if (pdfResult?.blobUrl) URL.revokeObjectURL(pdfResult.blobUrl)
      const blobUrl = URL.createObjectURL(blob)
      const nombre = `Receta_${form.paciente.trim().replace(/\s+/g, '_')}.pdf`
      setPdfResult({ blobUrl, nombre })
    } catch (err) {
      setErrors([`Error al generar el PDF: ${err.message}`])
    } finally {
      setLoading(false)
    }
  }, [form, fecha, validate, pdfResult])

  const downloadPDF = useCallback(() => {
    if (!pdfResult) return
    const a = document.createElement('a')
    a.href = pdfResult.blobUrl
    a.download = pdfResult.nombre
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }, [pdfResult])

  const shareWhatsApp = useCallback(async () => {
    if (!pdfResult) return
    if (navigator.share && navigator.canShare) {
      try {
        const res = await fetch(pdfResult.blobUrl)
        const blob = await res.blob()
        const file = new File([blob], pdfResult.nombre, { type: 'application/pdf' })
        if (navigator.canShare({ files: [file] })) {
          await navigator.share({
            title: 'Receta Médica',
            text: `Hola, adjunto la receta médica de ${form.paciente}`,
            files: [file],
          })
          return
        }
      } catch {}
    }
    const msg = encodeURIComponent(`Hola, la receta de ${form.paciente} está lista.`)
    window.open(`https://wa.me/?text=${msg}`, '_blank')
  }, [pdfResult, form.paciente])

  const closeModal = useCallback(() => {
    setPdfResult(null)
    setForm(INITIAL_FORM)
    setErrors([])
  }, [])

  const activateCustomMode = useCallback((config, blobUrl) => {
    setPreviewConfig(config)
    setPreviewBlobUrl(blobUrl)
  }, [])

  const activateOriginalMode = useCallback(() => {
    setPreviewConfig(null)
    setPreviewBlobUrl(null)
  }, [])

  return {
    form,
    fecha,
    errors,
    loading,
    pdfResult,
    previewConfig,
    previewBlobUrl,
    toast,
    updateForm,
    generatePDF,
    downloadPDF,
    shareWhatsApp,
    closeModal,
    activateCustomMode,
    activateOriginalMode,
    showToast,
  }
}

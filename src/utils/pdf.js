import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'

const MULTILINE_FIELDS = ['prescripcion', 'indicaciones']

export async function generarPDF({ valores, imageBytes, config }) {
  const pdfDoc = await PDFDocument.create()

  let fondoImg
  try { fondoImg = await pdfDoc.embedPng(imageBytes) }
  catch { fondoImg = await pdfDoc.embedJpg(imageBytes) }

  const { pageWidth: W, pageHeight: H } = config
  const page = pdfDoc.addPage([W, H])
  page.drawImage(fondoImg, { x: 0, y: 0, width: W, height: H })

  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica)
  const fontItalic  = await pdfDoc.embedFont(StandardFonts.HelveticaOblique)
  const black       = rgb(0, 0, 0)

  const camposValores = {
    nombre:       valores.paciente.toUpperCase(),
    edad:         valores.edad,
    fecha:        valores.fecha,
    prescripcion: valores.prescripcion,
    indicaciones: valores.indicaciones,
  }

  Object.entries(config.campos).forEach(([key, campo]) => {
    const texto = camposValores[key]
    if (!texto) return

    const fontSize    = campo.size || config.fontSize
    const isMultiline = MULTILINE_FIELDS.includes(key)

    let pdf_x, pdf_y

    if (campo.xPct !== undefined && campo.yPct !== undefined) {
      pdf_x = campo.xPct * W

      if (isMultiline) {
        // Top of text block at click point → PDF bottom-left origin:
        // pdf_y = top of block in PDF = H - yPct*H - lineHeight
        // We subtract fontSize so the first baseline lands just below the click
        pdf_y = H - campo.yPct * H - fontSize
      } else {
        // Single-line: vertically center on click point
        // translateY(-50%) in HTML ≈ shift up by fontSize/2 in PDF
        pdf_y = H - campo.yPct * H - fontSize * 0.5
      }
    } else {
      // Legacy: use stored PDF coords
      pdf_x = campo.x
      pdf_y = campo.y
    }

    const font = campo.font === 'italic' ? fontItalic : fontRegular

    page.drawText(texto, {
      x:     Math.round(pdf_x),
      y:     Math.round(pdf_y),
      size:  fontSize,
      font,
      color: black,
      ...(campo.lineHeight ? { lineHeight: campo.lineHeight } : {}),
      ...(campo.maxWidth   ? { maxWidth:   campo.maxWidth   } : {}),
    })
  })

  return await pdfDoc.save()
}

export function getToday() {
  return new Date().toLocaleDateString('es-ES', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

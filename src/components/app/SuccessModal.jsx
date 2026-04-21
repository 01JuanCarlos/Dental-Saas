import { Download, Share2, X } from 'lucide-react'

export default function SuccessModal({ onDownload, onShare, onClose }) {
  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-3xl p-8 w-full max-w-sm text-center shadow-2xl">
        <div className="text-6xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-verde mb-2" style={{ fontFamily: 'Syne' }}>¡Receta Lista!</h3>
        <p className="text-gray-500 text-sm mb-8">Tu receta fue generada exitosamente.</p>

        <div className="space-y-3">
          <button
            onClick={onDownload}
            className="w-full flex items-center justify-center gap-2 bg-verde text-white py-4 rounded-2xl font-bold hover:bg-verde-light transition-all"
          >
            <Download className="w-5 h-5" />
            Descargar PDF
          </button>
          <button
            onClick={onShare}
            className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-4 rounded-2xl font-bold hover:bg-green-600 transition-all"
          >
            <Share2 className="w-5 h-5" />
            Compartir por WhatsApp
          </button>
          <button
            onClick={onClose}
            className="w-full py-3 text-gray-500 hover:text-gray-700 text-sm font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

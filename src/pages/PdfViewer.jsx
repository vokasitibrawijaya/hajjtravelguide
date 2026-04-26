import { useState, useEffect, useRef } from 'react'
import * as pdfjsLib from 'pdfjs-dist'
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Download, FileText, Loader2 } from 'lucide-react'

// Gunakan worker lokal yang sudah dicopy ke public agar reliable
// Set secara global di luar komponen untuk menghindari masalah lifecycle
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs'

const PDF_URL = '/jurnalhajiumrah.pdf'

export default function PdfViewer() {
  const canvasRef = useRef(null)
  const [pdfDoc, setPdfDoc] = useState(null)
  const [pageNum, setPageNum] = useState(1)
  const [numPages, setNumPages] = useState(0)
  const [scale, setScale] = useState(1.2)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const renderTaskRef = useRef(null)
  const loadingTaskRef = useRef(null)

  // Load PDF document
  useEffect(() => {
    let isMounted = true
    setLoading(true)
    setError(null)
    
    const loadingTask = pdfjsLib.getDocument(PDF_URL)
    loadingTaskRef.current = loadingTask

    loadingTask.promise
      .then((pdf) => {
        if (!isMounted) return
        setPdfDoc(pdf)
        setNumPages(pdf.numPages)
        setPageNum(1)
        setLoading(false)
      })
      .catch((err) => {
        if (!isMounted) return
        if (err?.name === 'WorkerTerminatedException') return
        console.error('Gagal memuat PDF:', err)
        setError('Gagal memuat PDF. Pastikan file tersedia.')
        setLoading(false)
      })

    return () => {
      isMounted = false
      // Jangan langsung destroy di sini jika menggunakan StrictMode agar tidak merusak mount kedua
      // Tapi kita perlu membersihkan task yang sedang berjalan
      if (loadingTaskRef.current) {
        loadingTaskRef.current.destroy().catch(() => {})
      }
    }
  }, [])

  // Render page ke canvas
  useEffect(() => {
    if (!pdfDoc || !canvasRef.current) return

    // Batalkan render sebelumnya jika ada
    if (renderTaskRef.current) {
      renderTaskRef.current.cancel()
    }

    pdfDoc.getPage(pageNum).then((page) => {
      const viewport = page.getViewport({ scale })
      const canvas = canvasRef.current
      if (!canvas) return
      canvas.height = viewport.height
      canvas.width = viewport.width
      const ctx = canvas.getContext('2d')
      const renderContext = { canvasContext: ctx, viewport }
      renderTaskRef.current = page.render(renderContext)
      renderTaskRef.current.promise.catch((err) => {
        if (err?.name !== 'RenderingCancelledException') console.error(err)
      })
    })
  }, [pdfDoc, pageNum, scale])

  const prevPage = () => setPageNum((p) => Math.max(1, p - 1))
  const nextPage = () => setPageNum((p) => Math.min(numPages, p + 1))
  const zoomIn = () => setScale((s) => Math.min(3, +(s + 0.2).toFixed(1)))
  const zoomOut = () => setScale((s) => Math.max(0.5, +(s - 0.2).toFixed(1)))

  return (
    <div className="pdf-viewer-page">
      {/* Header */}
      <div className="pdf-header">
        <div className="pdf-header-title">
          <FileText size={20} color="var(--primary)" />
          <span>Jurnal Haji &amp; Umrah</span>
        </div>
        <a
          href={PDF_URL}
          download="jurnalhajiumrah.pdf"
          className="pdf-download-btn"
          title="Download PDF"
        >
          <Download size={16} />
          Download
        </a>
      </div>

      {/* Toolbar Navigasi */}
      <div className="pdf-toolbar">
        <button className="pdf-btn" onClick={prevPage} disabled={pageNum <= 1} title="Halaman Sebelumnya">
          <ChevronLeft size={18} />
        </button>
        <span className="pdf-page-info">
          {loading ? '...' : `${pageNum} / ${numPages}`}
        </span>
        <button className="pdf-btn" onClick={nextPage} disabled={pageNum >= numPages} title="Halaman Berikutnya">
          <ChevronRight size={18} />
        </button>
        <div className="pdf-divider" />
        <button className="pdf-btn" onClick={zoomOut} disabled={scale <= 0.5} title="Perkecil">
          <ZoomOut size={18} />
        </button>
        <span className="pdf-zoom-info">{Math.round(scale * 100)}%</span>
        <button className="pdf-btn" onClick={zoomIn} disabled={scale >= 3} title="Perbesar">
          <ZoomIn size={18} />
        </button>
      </div>

      {/* Canvas Area */}
      <div className="pdf-canvas-wrapper">
        {loading && (
          <div className="pdf-loading">
            <Loader2 size={40} className="pdf-spinner" color="var(--primary)" />
            <p>Memuat jurnal...</p>
          </div>
        )}
        {error && (
          <div className="pdf-error">
            <p>{error}</p>
          </div>
        )}
        <canvas
          ref={canvasRef}
          className="pdf-canvas"
          style={{ display: loading || error ? 'none' : 'block' }}
        />
      </div>
    </div>
  )
}

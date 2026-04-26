import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Milestone from './pages/Milestone'
import Sejarah from './pages/Sejarah'
import Peta from './pages/Peta'
import Info from './pages/Info'
import Tracker from './pages/Tracker'
import PdfViewer from './pages/PdfViewer'
import './index.css'

function App() {
  return (
    <Router>
      <div className="page-container">
        <Routes>
          <Route path="/" element={<Milestone />} />
          <Route path="/sejarah" element={<Sejarah />} />
          <Route path="/peta" element={<Peta />} />
          <Route path="/info" element={<Info />} />
          <Route path="/tracker" element={<Tracker />} />
          <Route path="/pdf-viewer" element={<PdfViewer />} />
        </Routes>
      </div>
      <BottomNav />
    </Router>
  )
}

export default App

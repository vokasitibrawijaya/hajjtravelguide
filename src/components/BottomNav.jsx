import { NavLink } from 'react-router-dom'
import { Route, Map, BookOpen, Info, Navigation } from 'lucide-react'

export default function BottomNav() {
  return (
    <nav className="bottom-nav">
      <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Route size={24} className="nav-icon" />
        <span>Milestone</span>
      </NavLink>
      <NavLink to="/sejarah" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <BookOpen size={24} className="nav-icon" />
        <span>Sejarah</span>
      </NavLink>
      <NavLink to="/peta" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Map size={24} className="nav-icon" />
        <span>Peta</span>
      </NavLink>
      <NavLink to="/info" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Info size={24} className="nav-icon" />
        <span>Info</span>
      </NavLink>
      <NavLink to="/tracker" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
        <Navigation size={24} className="nav-icon" />
        <span>Pelacak</span>
      </NavLink>
    </nav>
  )
}

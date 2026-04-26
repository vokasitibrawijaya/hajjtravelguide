import { useState, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { historicalPlaces } from '../data/historicalPlaces'
import L from 'leaflet'

// Fix for default marker icons in React Leaflet
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Component to recenter map when location changes
function ChangeView({ center, zoom }) {
  const map = useMap()
  map.setView(center, zoom)
  return null
}

export default function Peta() {
  const [city, setCity] = useState('Makkah') // Makkah or Madinah
  const makkahCenter = [21.4225, 39.8262]
  const madinahCenter = [24.4672, 39.6111]
  
  const currentCenter = city === 'Makkah' ? makkahCenter : madinahCenter

  const placesToShow = historicalPlaces.filter(p => p.city === city)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <h1>Peta Lokasi</h1>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          className="btn" 
          style={{ background: city === 'Makkah' ? 'var(--primary)' : '#e0e0e0', color: city === 'Makkah' ? 'white' : 'var(--text-main)' }}
          onClick={() => setCity('Makkah')}
        >
          Makkah
        </button>
        <button 
          className="btn" 
          style={{ background: city === 'Madinah' ? 'var(--primary)' : '#e0e0e0', color: city === 'Madinah' ? 'white' : 'var(--text-main)' }}
          onClick={() => setCity('Madinah')}
        >
          Madinah
        </button>
      </div>

      <div style={{ flex: 1, minHeight: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee' }}>
        <MapContainer center={currentCenter} zoom={13} style={{ height: '100%', width: '100%' }}>
          <ChangeView center={currentCenter} zoom={13} />
          <TileLayer
            attribution='&copy; Google Maps'
            url="https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}"
            maxZoom={20}
          />
          
          {placesToShow.map(place => (
            <Marker key={place.id} position={place.coordinates}>
              <Popup>
                <div style={{ width: '200px' }}>
                  <img src={place.image} alt={place.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                  <h3 style={{ margin: '0 0 5px 0', fontSize: '16px' }}>{place.name}</h3>
                  <a 
                    href={`https://www.google.com/maps/dir/?api=1&destination=${place.coordinates[0]},${place.coordinates[1]}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ display: 'block', background: 'var(--primary)', color: 'white', textAlign: 'center', padding: '6px', borderRadius: '4px', textDecoration: 'none', marginTop: '10px', fontSize: '12px' }}
                  >
                    Buka di Google Maps
                  </a>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  )
}

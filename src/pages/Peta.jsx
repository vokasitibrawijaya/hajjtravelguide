import { useState, useRef } from 'react'
import Map, { Marker, Popup } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { historicalPlaces } from '../data/historicalPlaces'
import { MapPin } from 'lucide-react'

export default function Peta() {
  const [city, setCity] = useState('Makkah') // Makkah or Madinah
  const [selectedPlace, setSelectedPlace] = useState(null)
  const mapRef = useRef(null)

  const makkahCenter = { longitude: 39.8262, latitude: 21.4225 }
  const madinahCenter = { longitude: 39.6111, latitude: 24.4672 }

  const placesToShow = historicalPlaces.filter(p => p.city === city)

  const handleCityChange = (newCity) => {
    setCity(newCity)
    setSelectedPlace(null)
    const newCenter = newCity === 'Makkah' ? makkahCenter : madinahCenter
    
    if (mapRef.current) {
      mapRef.current.flyTo({
        center: [newCenter.longitude, newCenter.latitude],
        zoom: 13,
        duration: 1500
      })
    }
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <h1>Peta Terbuka (OpenFreeMap)</h1>
      <p className="text-muted" style={{ marginBottom: '16px' }}>Peta interaktif menggunakan data OpenStreetMap.</p>
      
      <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
        <button 
          className="btn" 
          style={{ background: city === 'Makkah' ? 'var(--primary)' : '#e0e0e0', color: city === 'Makkah' ? 'white' : 'var(--text-main)' }}
          onClick={() => handleCityChange('Makkah')}
        >
          Makkah
        </button>
        <button 
          className="btn" 
          style={{ background: city === 'Madinah' ? 'var(--primary)' : '#e0e0e0', color: city === 'Madinah' ? 'white' : 'var(--text-main)' }}
          onClick={() => handleCityChange('Madinah')}
        >
          Madinah
        </button>
      </div>

      {/* Fix height container agar map pasti muncul di layar sekecil apapun */}
      <div style={{ height: '65vh', minHeight: '400px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: makkahCenter.longitude,
            latitude: makkahCenter.latitude,
            zoom: 13
          }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          style={{ width: '100%', height: '100%' }}
        >
          {placesToShow.map((place) => (
            <Marker
              key={place.id}
              longitude={place.coordinates[1]}
              latitude={place.coordinates[0]}
              anchor="bottom"
              onClick={e => {
                e.originalEvent.stopPropagation();
                setSelectedPlace(place);
              }}
            >
              <div style={{ color: 'var(--primary)', cursor: 'pointer', filter: 'drop-shadow(0px 2px 2px rgba(0,0,0,0.3))' }}>
                <MapPin size={36} fill="white" strokeWidth={1.5} />
              </div>
            </Marker>
          ))}

          {selectedPlace && (
            <Popup
              longitude={selectedPlace.coordinates[1]}
              latitude={selectedPlace.coordinates[0]}
              anchor="bottom"
              offset={40}
              onClose={() => setSelectedPlace(null)}
              closeButton={true}
              closeOnClick={false}
              maxWidth="220px"
            >
              <div style={{ width: '200px', padding: '2px' }}>
                <img src={selectedPlace.image} alt={selectedPlace.name} style={{ width: '100%', height: '100px', objectFit: 'cover', borderRadius: '4px', marginBottom: '8px' }} />
                <h3 style={{ margin: '0 0 5px 0', fontSize: '15px', color: '#333' }}>{selectedPlace.name}</h3>
                <a 
                  href={`https://www.google.com/maps/dir/?api=1&destination=${selectedPlace.coordinates[0]},${selectedPlace.coordinates[1]}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'block', background: 'var(--primary)', color: 'white', textAlign: 'center', padding: '8px 6px', borderRadius: '6px', textDecoration: 'none', marginTop: '10px', fontSize: '13px', fontWeight: 'bold' }}
                >
                  Panduan Rute (Maps)
                </a>
              </div>
            </Popup>
          )}
        </Map>
      </div>
    </div>
  )
}

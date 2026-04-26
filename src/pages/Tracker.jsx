import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import Map, { Marker, Source, Layer } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin, Navigation, Radio, Search, Map as MapIcon } from 'lucide-react'

export default function Tracker() {
  const [myName, setMyName] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  
  const [targetName, setTargetName] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  
  const [targetLocation, setTargetLocation] = useState(null)
  const [myLocation, setMyLocation] = useState(null)

  const [routeData, setRouteData] = useState(null) // GeoJSON for path
  const [userSuggestions, setUserSuggestions] = useState([]) // autocomplete list

  const watchIdRef = useRef(null)
  const pollIntervalRef = useRef(null)
  const mapRef = useRef(null)

  // -- LOGIKA BROADCAST (Kirim Posisi Saya) --
  // Fetch distinct usernames for autocomplete on component mount
  useEffect(() => {
    const fetchUsernames = async () => {
      const { data, error } = await supabase
        .from('hajjtracker')
        .select('username')
        .order('username')
      if (error) {
        console.error('Error fetching usernames:', error)
        return
      }
      const uniq = Array.from(new Set(data.map(item => item.username).filter(Boolean)))
      setUserSuggestions(uniq)
    }
    fetchUsernames()
  }, [])
  // Filtered suggestions based on the current input values
  const filteredMyNameSuggestions = userSuggestions.filter(u =>
    myName && u.toLowerCase().includes(myName.toLowerCase())
  )
  const filteredTargetNameSuggestions = userSuggestions.filter(u =>
    targetName && u.toLowerCase().includes(targetName.toLowerCase())
  )

  // Broadcast location effect
  useEffect(() => {
    if (isBroadcasting && myName.trim() !== '') {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (position) => {
            const lat = position.coords.latitude.toString()
            const lng = position.coords.longitude.toString()
            setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude })
            const { error } = await supabase
              .from('hajjtracker')
              .insert([{ username: myName, lat, long: lng }])
            if (error) console.error('Error mempublikasikan lokasi:', error)
          },
          (error) => {
            console.error('Error mendapatkan lokasi:', error)
            alert('Akses lokasi ditolak atau tidak tersedia.')
            setIsBroadcasting(false)
          },
          { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 }
        )
      } else {
        alert('Geolocation tidak didukung oleh browser ini.')
        setIsBroadcasting(false)
      }
    } else {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }
    return () => {
      if (watchIdRef.current !== null) navigator.geolocation.clearWatch(watchIdRef.current)
    }
  }, [isBroadcasting, myName])

  // -- LOGIKA TRACKING (Cari Posisi Target) --
  useEffect(() => {
    const fetchTargetLocation = async () => {
      if (!targetName.trim()) return

      const { data, error } = await supabase
        .from('hajjtracker')
        .select('*')
        .eq('username', targetName)
        .order('created_at', { ascending: false })
        .limit(1)

      if (error) {
        console.error('Error mengambil lokasi target:', error)
      } else if (data && data.length > 0) {
        const loc = { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].long) }
        setTargetLocation(loc)
        
        // Pindahkan peta ke lokasi target
        if (mapRef.current) {
          mapRef.current.flyTo({
            center: [loc.lng, loc.lat],
            zoom: 15,
            duration: 1000
          })
        }
      }
    }

    if (isTracking && targetName.trim() !== '') {
      fetchTargetLocation() // Panggil segera
      pollIntervalRef.current = setInterval(fetchTargetLocation, 5000) // Polling tiap 5 detik
    } else {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
      setTargetLocation(null)
    }

    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current)
    }
  }, [isTracking, targetName])

  // Pusatkan ke lokasiku jika sedang broadcast tapi tidak tracking orang lain
  useEffect(() => {
    if (isBroadcasting && !isTracking && myLocation && mapRef.current) {
      mapRef.current.flyTo({
        center: [myLocation.lng, myLocation.lat],
        zoom: 15,
        duration: 1000
      })
    }
  }, [myLocation, isBroadcasting, isTracking])

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', gap: '16px', padding: '8px' }}>
      <div>
        <h1 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Navigation size={24} color="var(--primary)" />
          Pelacak Jemaah (GPS)
        </h1>
        <p className="text-muted">Bagikan lokasi Anda atau cari posisi jemaah lain secara real-time.</p>
      </div>

      {/* Panel Kontrol */}
      <div style={{ display: 'grid', gap: '16px', gridTemplateColumns: '1fr 1fr' }}>
        {/* Panel Bagikan Lokasi */}
        <div className="card" style={{ borderTop: '4px solid var(--primary)' }}>
          <div className="card-body">
            <h3 style={{ fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Radio size={16} /> Bagikan Lokasiku
            </h3>
            <input 
              type="text" 
              placeholder="Masukkan Nama Anda" 
              className="form-input"
              list="my-suggestions"
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              disabled={isBroadcasting}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <datalist id="my-suggestions">
              {filteredMyNameSuggestions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
            <button 
              className="btn" 
              style={{ width: '100%', background: isBroadcasting ? '#e74c3c' : 'var(--primary)', color: 'white' }}
              onClick={() => {
                if (!isBroadcasting && !myName.trim()) {
                  alert('Harap masukkan nama Anda terlebih dahulu.')
                  return
                }
                setIsBroadcasting(!isBroadcasting)
              }}
            >
              {isBroadcasting ? 'Berhenti' : 'Mulai Bagikan'}
            </button>
            {isBroadcasting && <p style={{ fontSize: '11px', color: 'var(--primary)', marginTop: '8px', textAlign: 'center' }}>Lokasi dibagikan...</p>}
          </div>
        </div>

        {/* Panel Cari Jemaah */}
        <div className="card" style={{ borderTop: '4px solid var(--gold)' }}>
          <div className="card-body">
            <h3 style={{ fontSize: '15px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Search size={16} /> Lacak Jemaah
            </h3>
            <input 
              type="text" 
              placeholder="Masukkan Nama Target" 
              className="form-input"
              list="target-suggestions"
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              disabled={isTracking}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
            <datalist id="target-suggestions">
              {filteredTargetNameSuggestions.map((u) => (
                <option key={u} value={u} />
              ))}
            </datalist>
            <button 
            className="btn" 
            style={{ width: '100%', background: isTracking ? '#e74c3c' : 'var(--gold)', color: 'white' }}
            onClick={() => {
              if (!isTracking && !targetName.trim()) {
                alert('Harap masukkan nama jemaah yang ingin dicari.')
                return
              }
              setIsTracking(!isTracking)
            }}
          >
            {isTracking ? 'Berhenti' : 'Mulai Lacak'}
          </button>
          {isTracking && !targetLocation && <p style={{ fontSize: '11px', color: 'var(--gold)', marginTop: '8px', textAlign: 'center' }}>Mencari lokasi...</p>}
          {/* Tampilkan Rute */}
          {targetName && (
            <button 
              className="btn" 
              style={{ width: '100%', marginTop: '8px', background: 'var(--primary)', color: 'white' }}
              onClick={async () => {
                if (!targetName.trim()) {
                  alert('Masukkan nama jemaah terlebih dahulu.')
                  return
                }
                const { data, error } = await supabase
                  .from('hajjtracker')
                  .select('lat,long,created_at')
                  .eq('username', targetName)
                  .order('created_at', { ascending: true })
                if (error) {
                  console.error('Error fetch route:', error)
                  alert('Gagal mengambil riwayat lokasi.')
                } else if (data && data.length > 0) {
                  const coords = data.map(d => [parseFloat(d.long), parseFloat(d.lat)])
                  const geojson = {
                    type: 'Feature',
                    geometry: {
                      type: 'LineString',
                      coordinates: coords
                    },
                    properties: {}
                  }
                  setRouteData(geojson)
                  // zoom ke seluruh path
                  if (mapRef.current && coords.length > 0) {
                    const bounds = coords.reduce((b, c) => {
                      return {
                        minLng: Math.min(b.minLng, c[0]),
                        minLat: Math.min(b.minLat, c[1]),
                        maxLng: Math.max(b.maxLng, c[0]),
                        maxLat: Math.max(b.maxLat, c[1])
                      }
                    }, { minLng: coords[0][0], minLat: coords[0][1], maxLng: coords[0][0], maxLat: coords[0][1] })
                    const padding = 0.01
                    mapRef.current.fitBounds([
                      [bounds.minLng - padding, bounds.minLat - padding],
                      [bounds.maxLng + padding, bounds.maxLat + padding]
                    ], { duration: 1000 })
                  }
                }
              }}
            >
              Tampilkan Rute
            </button>
          )}
          </div>
        </div>
      </div>

      {/* Peta */}
      <div style={{ flex: 1, minHeight: '200px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
        <Map
          ref={mapRef}
          initialViewState={{
            longitude: 39.8262, // Default Makkah
            latitude: 21.4225,
            zoom: 13
          }}
          mapStyle="https://tiles.openfreemap.org/styles/liberty"
          style={{ width: '100%', height: '100%' }}
        >
          {/* Marker Lokasi Sendiri */}
          {isBroadcasting && myLocation && (
            <Marker longitude={myLocation.lng} latitude={myLocation.lat} anchor="bottom">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid var(--primary)', marginBottom: '2px' }}>Anda</div>
                <MapPin size={32} fill="var(--primary)" color="white" />
              </div>
            </Marker>
          )}

          {/* Marker Lokasi Target */}
          {isTracking && targetLocation && (
            <Marker longitude={targetLocation.lng} latitude={targetLocation.lat} anchor="bottom">
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{ background: 'white', padding: '2px 6px', borderRadius: '4px', fontSize: '10px', fontWeight: 'bold', border: '1px solid var(--gold)', marginBottom: '2px' }}>{targetName}</div>
                <MapPin size={40} fill="var(--gold)" color="white" style={{ filter: 'drop-shadow(0px 2px 4px rgba(0,0,0,0.5))' }} />
              </div>
            </Marker>
          )}

          {/* Render Route Path if available */}
          {routeData && (
            <Source id="route" type="geojson" data={routeData}>
              <Layer
                id="route-line"
                type="line"
                paint={{
                  'line-color': '#FF5733',
                  'line-width': 4,
                  'line-opacity': 0.8
                }}
              />
            </Source>
          )}
        </Map>
      </div>
    </div>
  )
}

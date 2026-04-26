import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import Map, { Marker } from 'react-map-gl/maplibre'
import 'maplibre-gl/dist/maplibre-gl.css'
import { MapPin, Navigation, Radio, Search } from 'lucide-react'

export default function Tracker() {
  const [myName, setMyName] = useState('')
  const [isBroadcasting, setIsBroadcasting] = useState(false)
  
  const [targetName, setTargetName] = useState('')
  const [isTracking, setIsTracking] = useState(false)
  
  const [targetLocation, setTargetLocation] = useState(null)
  const [myLocation, setMyLocation] = useState(null)
  
  const watchIdRef = useRef(null)
  const pollIntervalRef = useRef(null)
  const mapRef = useRef(null)

  // -- LOGIKA BROADCAST (Kirim Posisi Saya) --
  useEffect(() => {
    if (isBroadcasting && myName.trim() !== '') {
      // Mulai watchPosition
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          async (position) => {
            const lat = position.coords.latitude.toString()
            const lng = position.coords.longitude.toString()
            
            setMyLocation({ lat: position.coords.latitude, lng: position.coords.longitude })

            // Kirim ke Supabase
            const { error } = await supabase
              .from('hajjtracker')
              .insert([
                { username: myName, lat: lat, long: lng }
              ])
            
            if (error) {
              console.error('Error mempublikasikan lokasi:', error)
            }
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
      // Hentikan watchPosition
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
        watchIdRef.current = null
      }
    }

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
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
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '16px' }}>
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
              value={myName}
              onChange={(e) => setMyName(e.target.value)}
              disabled={isBroadcasting}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
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
              value={targetName}
              onChange={(e) => setTargetName(e.target.value)}
              disabled={isTracking}
              style={{ width: '100%', padding: '8px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            />
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
          </div>
        </div>
      </div>

      {/* Peta */}
      <div style={{ flex: 1, height: '45vh', minHeight: '300px', borderRadius: '12px', overflow: 'hidden', border: '1px solid #eee', position: 'relative' }}>
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
        </Map>
      </div>
    </div>
  )
}

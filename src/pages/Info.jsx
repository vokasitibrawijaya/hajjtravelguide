import { useState } from 'react'
import { Phone, ShieldAlert, Book, Settings } from 'lucide-react'

export default function Info() {
  const [location, setLocation] = useState(null)
  
  const handleSOS = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const lat = position.coords.latitude
          const lng = position.coords.longitude
          const message = `Darurat! Saya Jemaah Haji Indonesia butuh bantuan. Lokasi saya saat ini: https://www.google.com/maps/search/?api=1&query=${lat},${lng}`
          
          // Membuka WhatsApp
          window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, '_blank')
        },
        (error) => {
          alert("Gagal mendapatkan lokasi. Pastikan GPS/Location service menyala. " + error.message)
        }
      )
    } else {
      alert("Browser Anda tidak mendukung fitur lokasi (Geolocation).")
    }
  }

  return (
    <div>
      <h1>Info & Bantuan</h1>
      <p className="text-muted">Pusat informasi dan bantuan darurat jemaah.</p>

      <div className="card" style={{ marginTop: '20px', borderLeft: '5px solid var(--danger)' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <ShieldAlert color="var(--danger)" size={24} style={{ marginRight: '10px' }} />
            <h2 style={{ margin: 0, color: 'var(--danger)' }}>Bantuan Darurat (SOS)</h2>
          </div>
          <p style={{ fontSize: '14px', marginBottom: '15px' }}>
            Tekan tombol di bawah jika Anda tersesat atau mengalami kondisi darurat. Sistem akan membagikan titik koordinat Anda via WhatsApp.
          </p>
          <button className="btn btn-danger" onClick={handleSOS}>
            Bagikan Lokasi Darurat
          </button>
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Nomor Penting PPIH</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          <li style={{ padding: '12px', background: 'var(--surface)', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', border: '1px solid #eee' }}>
            <div style={{ background: '#E8F6F3', padding: '10px', borderRadius: '50%', marginRight: '15px' }}>
              <Phone color="var(--primary)" size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Call Center Haji Arab Saudi</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>9200 13210</div>
            </div>
          </li>
          <li style={{ padding: '12px', background: 'var(--surface)', borderRadius: '8px', marginBottom: '10px', display: 'flex', alignItems: 'center', border: '1px solid #eee' }}>
            <div style={{ background: '#E8F6F3', padding: '10px', borderRadius: '50%', marginRight: '15px' }}>
              <Phone color="var(--primary)" size={20} />
            </div>
            <div>
              <div style={{ fontWeight: 'bold' }}>Sektor Khusus Masjidil Haram</div>
              <div style={{ color: 'var(--text-muted)', fontSize: '14px' }}>Tersedia 24 Jam di sekitar Terminal Syib Amir</div>
            </div>
          </li>
        </ul>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3>Tentang Aplikasi</h3>
        <div style={{ padding: '15px', background: 'var(--surface)', borderRadius: '8px', border: '1px solid #eee', fontSize: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <Book size={18} style={{ marginRight: '8px', color: 'var(--primary)' }} />
            <strong>Referensi Syariat</strong>
          </div>
          <p style={{ color: 'var(--text-muted)' }}>
            Seluruh panduan haji, doa, dan sejarah di aplikasi ini telah divalidasi dan bersumber secara eksklusif dari Al-Qur'an serta hadits-hadits shahih (Bukhari, Muslim, dll) untuk menghindari amalan tanpa tuntunan.
          </p>
        </div>
      </div>
    </div>
  )
}

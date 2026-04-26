import { historicalPlaces } from '../data/historicalPlaces'
import { biografiNabi } from '../data/biografiNabi'
import { silsilahData } from '../data/silsilah'
import SilsilahTree from '../components/SilsilahTree'
import { AlertTriangle, MapPin, BookOpen } from 'lucide-react'

export default function Sejarah() {
  return (
    <div>
      <h1>Jejak Sejarah & Sirah</h1>
      <p className="text-muted">Mengenal biografi Nabi Muhammad ﷺ dan tempat bersejarah sesuai riwayat shahih.</p>

      <div className="card" style={{ marginTop: '20px', background: '#F8F9F9', border: '1px solid #E0E0E0' }}>
        <div className="card-body">
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px', color: 'var(--primary)' }}>
            <BookOpen size={18} style={{ marginRight: '8px' }} />
            <h3 style={{ fontSize: '16px', margin: 0 }}>Sekilas Tentang Islam</h3>
          </div>
          <p style={{ fontSize: '13px', fontStyle: 'italic', marginBottom: '10px' }}>
            "Islam adalah agama besar dunia yang disebarkan oleh Nabi Muhammad ﷺ di jazirah Arab pada abad ke-7 Masehi. Istilah bahasa Arab islām, yang secara harfiah berarti 'berserah diri,' mencerminkan gagasan keagamaan mendasar dari Islam—bahwa orang yang beriman (Muslim) menerima kepasrahan kepada kehendak Allah. Kehendak Allah... diberitahukan melalui kitab suci, Al-Qur'an."
          </p>
          <div className="citation" style={{ fontSize: '11px', marginTop: 0, padding: '4px 8px' }}>
            <strong>Sumber:</strong> <a href="https://www.britannica.com/topic/Islam" target="_blank" rel="noreferrer" style={{ color: 'var(--primary)' }}>Britannica - Islam</a>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '4px' }}>Peta Silsilah & Jalur Nasab</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Garis keturunan dari Nabi Ibrahim AS hingga Nabi Muhammad ﷺ dan Khulafaur Rasyidin. Geser (scroll) ke kiri/kanan dan atas/bawah untuk melihat selengkapnya.</p>
        
        <div className="card" style={{ marginTop: '12px', overflowX: 'auto', overflowY: 'auto', maxHeight: '450px', background: '#FAFAFA', border: '1px solid #E0E0E0' }}>
          <div className="card-body" style={{ padding: '12px', minWidth: 'max-content' }}>
            <SilsilahTree data={silsilahData} />
          </div>
        </div>
      </div>


      <div style={{ marginTop: '24px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '4px' }}>Biografi Nabi Muhammad ﷺ</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '8px' }}>Disarikan dari ensiklopedia Britannica.</p>
        
        <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
          {biografiNabi.map((item) => (
            <div key={item.id} className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div className="card-body" style={{ padding: '12px 16px' }}>
                <h3 style={{ fontSize: '15px', marginBottom: '6px', color: 'var(--text)' }}>{item.question}</h3>
                <p style={{ fontSize: '13px', margin: 0, lineHeight: '1.5' }}>
                  {item.answer}{' '}
                  <a 
                    href={`https://www.google.com/search?q=${encodeURIComponent(item.question + ' Islam')}`} 
                    target="_blank" 
                    rel="noreferrer"
                    style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', marginTop: '4px' }}
                    title="Cari lebih lanjut di Google"
                  >
                    [🔍 Cari di Google]
                  </a>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ marginTop: '32px' }}>
        <h2 style={{ fontSize: '18px', borderBottom: '2px solid var(--gold)', display: 'inline-block', paddingBottom: '4px', marginBottom: '16px' }}>Direktori Tempat Bersejarah</h2>
        <div style={{ display: 'grid', gap: '20px' }}>
        {historicalPlaces.map((place) => (
          <div key={place.id} className="card">
            <img src={place.image} alt={place.name} className="card-img" />
            
            <div className="card-body">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h2 style={{ margin: 0 }}>
                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.name + ' ' + place.city)}`}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px dashed rgba(0,0,0,0.2)', cursor: 'pointer' }}
                    title={`Cari ${place.name} di Google Maps`}
                  >
                    {place.name}
                  </a>
                </h2>
                <div style={{ display: 'flex', alignItems: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                  <MapPin size={16} style={{ marginRight: '4px' }} />
                  {place.city}
                </div>
              </div>
              
              <p style={{ marginBottom: '15px' }}>
                {place.story}{' '}
                <a 
                  href={`https://www.google.com/search?q=${encodeURIComponent(place.name + ' sejarah Islam')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  style={{ color: 'var(--primary)', textDecoration: 'none', fontWeight: 'bold', fontSize: '13px' }}
                  title={`Cari sejarah ${place.name} di Google`}
                >
                  [🔍 Cari di Google]
                </a>
              </p>
              
              <div className="citation" style={{ marginBottom: '10px' }}>
                <strong>Referensi:</strong> {place.citation}
              </div>

              {place.warning && (
                <div style={{ background: '#FDEDEC', padding: '10px', borderRadius: '8px', borderLeft: '4px solid var(--danger)', marginTop: '15px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', color: 'var(--danger)', fontWeight: 'bold', marginBottom: '5px' }}>
                    <AlertTriangle size={18} style={{ marginRight: '8px' }} />
                    Peringatan Syariat
                  </div>
                  <p style={{ fontSize: '13px', margin: 0, color: '#C0392B' }}>
                    {place.warning.replace('Peringatan Syariat: ', '')}{' '}
                    <a 
                      href={`https://www.google.com/search?q=${encodeURIComponent(place.name + ' hukum ziarah dan bidah')}`} 
                      target="_blank" 
                      rel="noreferrer"
                      style={{ color: '#900C3F', textDecoration: 'underline', fontWeight: 'bold', marginLeft: '4px' }}
                      title="Cari penjelasan syariat di Google"
                    >
                      [🔍 Referensi Syariat]
                    </a>
                  </p>
                </div>
              )}
            </div>
          </div>
        ))}
        </div>
      </div>
    </div>
  )
}

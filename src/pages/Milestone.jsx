import { useState } from 'react'
import { hajjSteps } from '../data/hajjSteps'
import { CheckCircle2, Circle } from 'lucide-react'

export default function Milestone() {
  const [completedSteps, setCompletedSteps] = useState([])

  const toggleStep = (id) => {
    if (completedSteps.includes(id)) {
      setCompletedSteps(completedSteps.filter(stepId => stepId !== id))
    } else {
      setCompletedSteps([...completedSteps, id])
    }
  }

  return (
    <div>
      <h1>Tahapan Haji</h1>
      <p className="text-muted">Panduan langkah demi langkah ibadah haji sesuai tuntunan Sunnah.</p>

      <div className="timeline">
        {hajjSteps.map((step) => {
          const isCompleted = completedSteps.includes(step.id)
          return (
            <div key={step.id} className="timeline-item">
              <div className="timeline-dot" style={{ background: isCompleted ? 'var(--primary)' : 'var(--surface)' }} />
              
              <div className="timeline-content">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <h3 style={{ margin: 0, color: isCompleted ? 'var(--primary)' : 'var(--text-main)' }}>
                    {step.id}. {step.title}
                  </h3>
                  <button 
                    onClick={() => toggleStep(step.id)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: isCompleted ? 'var(--primary)' : '#ccc' }}
                  >
                    {isCompleted ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </button>
                </div>
                
                <p style={{ marginTop: '8px' }}>{step.description}</p>
                
                {step.prayer && (
                  <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '8px', marginTop: '10px' }}>
                    <div className="arab-text">{step.prayer.arab}</div>
                    <p style={{ fontStyle: 'italic', fontSize: '14px' }}>{step.prayer.latin}</p>
                    <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '5px' }}>Artinya: "{step.prayer.translate}"</p>
                  </div>
                )}
                
                <div className="citation">
                  <strong>Dalil:</strong> {step.citation}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

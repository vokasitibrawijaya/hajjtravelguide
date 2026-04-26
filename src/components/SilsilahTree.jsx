import React, { useState } from 'react';
import { ChevronDown, ChevronRight, User } from 'lucide-react';

export default function SilsilahTree({ data, level = 0 }) {
  // Buka semua cabang secara default agar silsilah langsung terlihat
  const [isOpen, setIsOpen] = useState(true);

  const hasChildren = data.children && data.children.length > 0;
  
  let bgColor = 'white';
  let borderColor = '#E0E0E0';
  let textColor = '#333';
  let fontWeight = 'normal';
  
  if (data.type === 'prophet') {
    bgColor = '#E8F5E9'; // Hijau muda (Sage)
    borderColor = 'var(--primary)';
    textColor = '#1B5E20';
    fontWeight = 'bold';
  } else if (data.type === 'companion') {
    bgColor = '#FEF9E7'; // Emas muda
    borderColor = 'var(--gold)';
    textColor = '#B9770E';
    fontWeight = 'bold';
  } else if (data.name.includes('...')) {
    // Penanda lompatan generasi
    bgColor = 'transparent';
    borderColor = 'transparent';
    textColor = 'var(--text-muted)';
    fontWeight = 'italic';
  }

  // Jarak indentasi yang cukup luas agar membentuk efek peta horizontal
  const indent = level === 0 ? 0 : 16;

  return (
    <div style={{ marginLeft: `${indent}px`, position: 'relative' }}>
      <div 
        onClick={() => hasChildren && setIsOpen(!isOpen)}
        style={{ 
          display: 'inline-flex', 
          alignItems: 'center', 
          background: bgColor, 
          border: `1px solid ${borderColor}`,
          borderRadius: '6px',
          padding: '6px 12px',
          marginTop: '6px',
          marginBottom: '6px',
          cursor: hasChildren ? 'pointer' : 'default',
          boxShadow: data.type !== 'ancestor' ? '0 1px 2px rgba(0,0,0,0.05)' : 'none',
          position: 'relative',
          zIndex: 2,
          maxWidth: 'max-content'
        }}
      >
        {hasChildren && (
          <span style={{ marginRight: '6px', color: textColor, display: 'flex', flexShrink: 0 }}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        )}
        {!hasChildren && data.type !== 'ancestor' && (
          <span style={{ marginRight: '6px', color: textColor, display: 'flex', flexShrink: 0 }}>
             <User size={12} />
          </span>
        )}
        <span 
          onClick={(e) => {
            e.stopPropagation();
            window.open(`https://www.google.com/search?q=${encodeURIComponent(data.name.replace('...', '').trim())}`, '_blank');
          }}
          style={{ 
            fontSize: '13px', 
            fontWeight: fontWeight, 
            color: textColor, 
            whiteSpace: 'nowrap',
            cursor: 'pointer',
            borderBottom: '1px dashed rgba(0,0,0,0.2)'
          }}
          title={`Cari ${data.name} di Google`}
        >
          {data.name}
        </span>
      </div>

      {hasChildren && isOpen && (
        <div style={{ 
          borderLeft: `2px solid #CCC`, 
          marginLeft: '12px',
          paddingLeft: '8px',
        }}>
          {data.children.map(child => (
            <SilsilahTree key={child.id} data={child} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  );
}

import React from 'react';
import { User } from '../../types';

interface DigitalPassModalProps {
  user: User;
  onClose: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({ user, onClose }) => {
  const qrData = encodeURIComponent(`HORECA-2026-PASS-${user.id}-${user.email}`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${qrData}`;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '460px', padding: '0', overflow: 'hidden', background: 'transparent', boxShadow: 'none', border: 'none' }}>
        
        {/* BADGE CARD CONTAINER */}
        <div style={{ background: 'white', borderRadius: '16px', border: '2px solid var(--accent)', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
          
          {/* BADGE HEADER */}
          <div style={{ background: 'var(--primary-dark)', color: 'white', padding: '24px', textAlign: 'center', position: 'relative' }}>
            <button
              onClick={onClose}
              style={{ position: 'absolute', top: '16px', right: '16px', background: 'transparent', border: 'none', color: 'white', cursor: 'pointer', fontSize: '1.2rem' }}
            >
              <i className="fas fa-times"></i>
            </button>
            <div style={{ fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 800, textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '4px' }}>
              BADGE OFFICIEL · HORECA 2026
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 900, margin: '0' }}>HORECA Africa</h2>
            <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '2px' }}>25 & 26 Novembre 2026 · Novotel Dakar</p>
          </div>

          {/* BADGE BODY */}
          <div style={{ padding: '24px', textAlign: 'center' }}>
            
            {/* ROLE BADGE */}
            <span
              className="badge"
              style={{
                background: user.isSuperAdmin ? 'var(--danger)' : user.role === 'Sponsor' ? '#fbbf24' : user.role === 'Exposant' ? 'var(--purple)' : 'var(--accent)',
                color: 'white',
                fontSize: '0.9rem',
                padding: '6px 16px',
                fontWeight: 800,
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '16px'
              }}
            >
              {user.isSuperAdmin ? 'ORGANISATEUR / ADMIN' : user.role.toUpperCase()}
            </span>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>
              {user.name}
            </h3>
            <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '16px' }}>
              {user.company}
            </p>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
              <span className="badge badge-sector" style={{ fontSize: '0.8rem' }}>📍 Secteur: {user.sector}</span>
              <span className="badge badge-sector" style={{ fontSize: '0.8rem' }}>🆔 ID: #{user.id}</span>
            </div>

            {/* QR CODE CONTAINER */}
            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '12px', display: 'inline-block', border: '1px dashed var(--gray-300)', marginBottom: '16px' }}>
              <img src={qrUrl} alt="Badge QR Code" width={160} height={160} style={{ display: 'block' }} />
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '8px', fontWeight: 600 }}>
                Scannez à l'entrée du Salon B2B
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-accent" style={{ flex: 1 }} onClick={handlePrint}>
                <i className="fas fa-print"></i> Imprimer / Télécharger Pass
              </button>
            </div>

          </div>

          {/* BADGE FOOTER */}
          <div style={{ background: '#f1f5f9', padding: '12px', textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-muted)', borderTop: '1px solid #e2e8f0' }}>
            Accès coupe-file aux conférences & espaces de rendez-vous B2B
          </div>

        </div>
      </div>
    </div>
  );
};

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

  const isActive = user.isSuperAdmin || user.isActive !== false;

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
            
            {!isActive && (
              <div style={{ background: '#fff7ed', border: '1px dashed #ea580c', borderRadius: '8px', padding: '10px 14px', marginBottom: '14px', fontSize: '0.82rem', color: '#c2410c', fontWeight: 700 }}>
                ⏳ <strong>STATUT ACCÈS : EN ATTENTE DE VALIDATION DU PAIEMENT</strong><br />
                <span style={{ fontWeight: 'normal', fontSize: '0.78rem' }}>Ce pass s'activera automatiquement dès confirmation de l'administrateur.</span>
              </div>
            )}

            {/* ROLE BADGE */}
            <span
              className="badge"
              style={{
                background: user.isSuperAdmin ? 'var(--danger)' : !isActive ? '#ea580c' : user.role === 'Sponsor' ? '#fbbf24' : user.role === 'Exposant' ? 'var(--purple)' : 'var(--accent)',
                color: 'white',
                fontSize: '0.9rem',
                padding: '6px 16px',
                fontWeight: 800,
                letterSpacing: '1px',
                display: 'inline-block',
                marginBottom: '16px'
              }}
            >
              {user.isSuperAdmin ? 'ORGANISATEUR / ADMIN' : !isActive ? 'ACCÈS EN ATTENTE' : user.role.toUpperCase()}
            </span>

            <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>
              {user.name}
            </h3>
            <p style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '16px' }}>
              {user.company}
            </p>

            {/* QR CODE CONTAINER */}
            <div style={{ background: 'var(--gray-100)', padding: '16px', borderRadius: '12px', display: 'inline-block', border: '1px border var(--gray-200)', marginBottom: '16px' }}>
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`HORECA-PASS-${user.id}-${user.email}-WA+221775428235`)}`}
                alt="QR Code Badge HORECA"
                style={{ width: '160px', height: '160px', borderRadius: '8px', opacity: isActive ? 1 : 0.4 }}
              />
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '8px', fontFamily: 'monospace', fontWeight: 700 }}>
                {user.email} · ID #{user.id}
              </div>
            </div>

            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px', lineHeight: '1.5' }}>
              <i className="fas fa-info-circle text-accent"></i> Présentez ce pass numérique à l'accueil du Novotel Dakar.<br />
              <i className="fab fa-whatsapp text-success" style={{ marginRight: '4px' }}></i> Assistance Conciergerie IA : <strong>+221 77 542 82 35</strong>
            </div>

            {/* ACTIONS */}
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn btn-accent btn-sm" onClick={handlePrint}>
                <i className="fas fa-print"></i> Imprimer / Télécharger
              </button>
              <button className="btn btn-outline btn-sm" onClick={onClose}>
                Fermer
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

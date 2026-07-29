import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Meeting } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const DayPassPage: React.FC = () => {
  const { currentUser } = useAuth();
  const [confirmedMeetings, setConfirmedMeetings] = useState<Meeting[]>([]);

  useEffect(() => {
    if (currentUser) {
      apiService.getMeetings(currentUser.id).then((data) => {
        setConfirmedMeetings(data.filter((m) => m.status === 'ACCEPTED'));
      });
    }
  }, [currentUser]);

  if (!currentUser) return null;

  return (
    <div>
      <div className="grid-2">
        {/* DIGITAL PASS CARD */}
        <div
          className="card"
          style={{
            background: 'linear-gradient(135deg, #021a4f 0%, #033498 100%)',
            color: 'white',
            textAlign: 'center',
            border: 'none',
            boxShadow: 'var(--shadow-lg)'
          }}
        >
          <span
            className="badge"
            style={{
              background: 'var(--accent)',
              color: 'white',
              marginBottom: '16px',
              display: 'inline-block'
            }}
          >
            BADGE DIGITALE ACCÈS SÉCURISÉ
          </span>
          <h3 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: '4px' }}>{currentUser.name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', marginBottom: '20px' }}>
            {currentUser.company} ({currentUser.role})
          </p>

          <div
            style={{
              background: 'white',
              padding: '16px',
              borderRadius: 'var(--radius-md)',
              display: 'inline-block',
              marginBottom: '20px',
              boxShadow: '0 4px 15px rgba(0,0,0,0.2)'
            }}
          >
            <QRCodeSVG value={`HORECA-PASS-${currentUser.id}`} size={160} />
          </div>

          <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)' }}>
            ID Pass: HORECA-2026-{currentUser.id} · Scannez à l'accueil Novotel Dakar
          </p>
        </div>

        {/* DAY J AGENDA TIMELINE */}
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-clock text-accent"></i> Mon Agenda du Jour J
            </h3>
            <span className="badge badge-success">{confirmedMeetings.length} RDV Confirmés</span>
          </div>

          {confirmedMeetings.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', padding: '20px 0' }}>
              Aucun rendez-vous confirmé aujourd'hui. Explorez le Matchmaking B2B pour réserver vos créneaux.
            </p>
          ) : (
            <div>
              {confirmedMeetings.map((m) => {
                const partnerCompany = m.fromId === currentUser.id ? m.toCompany : m.fromCompany;
                const partnerName = m.fromId === currentUser.id ? m.toName : m.fromName;

                return (
                  <div key={m.id} className="timeline-item">
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', minWidth: '70px' }}>
                      {m.time}
                    </div>
                    <div>
                      <h4 style={{ fontWeight: 700 }}>{partnerCompany}</h4>
                      <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Interlocuteur: {partnerName}</p>
                      <span className="badge badge-table" style={{ marginTop: '6px', background: 'var(--accent)', display: 'inline-block' }}>
                        Table N° {m.table}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

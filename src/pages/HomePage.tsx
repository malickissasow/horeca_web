import React, { useState } from 'react';
import { Countdown } from '../components';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const HomePage: React.FC = () => {
  const { setCurrentPage, showToast } = useAuth();
  const [cntFirstName, setCntFirstName] = useState('');
  const [cntLastName, setCntLastName] = useState('');
  const [cntEmail, setCntEmail] = useState('');
  const [cntPhone, setCntPhone] = useState('');
  const [cntCompany, setCntCompany] = useState('');
  const [cntMsg, setCntMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleContactSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.submitContact({
        firstName: cntFirstName,
        lastName: cntLastName,
        email: cntEmail,
        phone: cntPhone,
        company: cntCompany,
        message: cntMsg
      });
      showToast(`Merci ${cntFirstName} ! Votre demande a été transmise avec succès.`);
      setCntFirstName('');
      setCntLastName('');
      setCntEmail('');
      setCntPhone('');
      setCntCompany('');
      setCntMsg('');
    } catch (err: any) {
      showToast(err.message || 'Erreur d’envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO BANNER */}
      <div className="hero">
        <div style={{ maxWidth: '840px' }}>
          <span
            className="badge badge-sector"
            style={{
              background: 'rgba(243, 103, 29, 0.25)',
              color: '#ffffff',
              marginBottom: '14px',
              border: '1px solid rgba(243, 103, 29, 0.4)',
              display: 'inline-block'
            }}
          >
            📍 25 & 26 Novembre 2026 · Hôtel Novotel Dakar, Sénégal
          </span>
          <h1 className="hero-title">
            HORECA Africa <span>Business Matching & RH</span>
          </h1>
          <p className="hero-subtitle">
            La plateforme officielle B2B de l&apos;Hôtellerie, Restauration &amp; Tourisme en Afrique. Rencontrez vos futurs partenaires d&apos;affaires et recrutez les meilleurs talents du secteur.
          </p>

          <Countdown />

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
            <button className="btn btn-accent" onClick={() => setCurrentPage('search')}>
              <i className="fas fa-magic"></i> Explorer le Matchmaking B2B
            </button>
            <button className="btn btn-purple" onClick={() => setCurrentPage('jobs')}>
              <i className="fas fa-user-graduate"></i> Job Dating & Recrutement RH
            </button>
            <button
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.5)' }}
              onClick={() => setCurrentPage('pricing')}
            >
              <i className="fas fa-tags"></i> Tarifs & Packs 2026
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid-4">
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('search')}>
          <i className="fas fa-building" style={{ fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>500+</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Décideurs & Entreprises</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('search')}>
          <i className="fas fa-handshake" style={{ fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>1 200+</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>RDV B2B Ciblés</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('jobs')}>
          <i className="fas fa-user-graduate" style={{ fontSize: '2.2rem', color: 'var(--purple)', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>250+</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Talents & CVs Qualifiés</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('pricing')}>
          <i className="fas fa-globe-africa" style={{ fontSize: '2.2rem', color: 'var(--accent)', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>15</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Pays Représentés</p>
        </div>
      </div>

      {/* CONTACT & WHATSAPP SECTION */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-paper-plane text-accent"></i> Secrétariat & Assistance Inscription
          </h3>
        </div>
        <div className="grid-2">
          <form onSubmit={handleContactSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ex: Mamadou"
                  value={cntFirstName}
                  onChange={(e) => setCntFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nom</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ex: Ba"
                  value={cntLastName}
                  onChange={(e) => setCntLastName(e.target.value)}
                />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Email Professionnel *</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="direction@hotel.sn"
                value={cntEmail}
                onChange={(e) => setCntEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone / WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+221 77 ..."
                value={cntPhone}
                onChange={(e) => setCntPhone(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Message / Demande de Stand ou Pack</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Précisez vos besoins..."
                value={cntMsg}
                onChange={(e) => setCntMsg(e.target.value)}
              ></textarea>
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
              <i className="fas fa-paper-plane"></i> {loading ? 'Envoi...' : 'Envoyer ma demande'}
            </button>
          </form>

          <div
            style={{
              background: 'var(--gray-100)',
              padding: '24px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center'
            }}
          >
            <h4 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '10px' }}>
              <i className="fab fa-whatsapp text-success" style={{ fontSize: '1.4rem' }}></i> Direct WhatsApp Infoline
            </h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Scannez le QR Code pour chatter directement avec le comité d&apos;organisation :
            </p>
            <div
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-sm)'
              }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=135x135&data=https://wa.me/221775428235"
                alt="WhatsApp QR Code"
                width={135}
                height={135}
              />
            </div>
            <p style={{ fontSize: '0.9rem', fontWeight: 700, marginTop: '12px', color: 'var(--primary)' }}>
              +221 77 542 82 35
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

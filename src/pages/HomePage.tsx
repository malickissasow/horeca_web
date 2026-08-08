import React, { useState } from 'react';
import { Countdown } from '../components';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { apiService } from '../services/api';

export const HomePage: React.FC = () => {
  const { setCurrentPage, showToast } = useAuth();
  const { t } = useI18n();
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
      showToast(`Merci ${cntFirstName} ! Votre demande a été transmise au Comité d'Organisation.`);
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
        <div style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span
              className="badge"
              style={{
                background: 'rgba(243, 103, 29, 0.3)',
                color: '#ffffff',
                border: '1.5px solid rgba(243, 103, 29, 0.6)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem'
              }}
            >
              {t('heroBadgeVenue')}
            </span>
            <span
              className="badge"
              style={{
                background: 'rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.3)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 14px',
                fontSize: '0.82rem'
              }}
            >
              {t('heroBadgeType')}
            </span>
          </div>

          <h1 className="hero-title">
            HORECA Africa  <span>Business Week 2026</span>
          </h1>
          <p className="hero-subtitle">
            {t('heroSubtitle')}
          </p>

          <Countdown />

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '24px' }}>
            <button className="btn btn-accent" onClick={() => setCurrentPage('search')}>
              <i className="fas fa-handshake"></i> {t('btnExplorerMatchmaking')}
            </button>
            <button className="btn btn-purple" onClick={() => setCurrentPage('jobs')}>
              <i className="fas fa-user-graduate"></i> {t('btnJobDating')}
            </button>
            <button
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)' }}
              onClick={() => setCurrentPage('pricing')}
            >
              <i className="fas fa-tags"></i> {t('btnTarifs')}
            </button>
            <button
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'var(--accent)', background: 'rgba(243,103,29,0.25)' }}
              onClick={() => setCurrentPage('pricing')}
            >
              <i className="fas fa-calculator text-accent"></i> {t('btnSimulateur')}
            </button>
          </div>
        </div>
      </div>

      {/* STATS CARDS GRID */}
      <div className="grid-4" style={{ marginBottom: '36px' }}>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('search')}>
          <i className="fas fa-building text-accent" style={{ fontSize: '2.4rem', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>500+</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('statDecideurs')}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('search')}>
          <i className="fas fa-comments text-accent" style={{ fontSize: '2.4rem', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>1 200+</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('statMeetings')}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('jobs')}>
          <i className="fas fa-user-graduate" style={{ fontSize: '2.4rem', color: 'var(--purple)', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>250+</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('statTalents')}</p>
        </div>
        <div className="card" style={{ textAlign: 'center', cursor: 'pointer' }} onClick={() => setCurrentPage('pricing')}>
          <i className="fas fa-globe-africa text-accent" style={{ fontSize: '2.4rem', marginBottom: '12px' }}></i>
          <h3 style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--primary)', marginBottom: '4px' }}>15+</h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>{t('statCountries')}</p>
        </div>
      </div>

      {/* LES 3 PILIERS DE L'EVENEMENT */}
      <div style={{ marginBottom: '40px' }}>
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>
            {t('pillarsTitle')}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', margin: '8px auto 0' }}>
            Une plateforme complète pour dynamiser l&apos;écosystème CHR (Cafés, Hôtels, Restaurants) et du Tourisme en Afrique.
          </p>
        </div>

        <div className="grid-3">
          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sector-icon" style={{ background: 'rgba(3, 52, 152, 0.1)', color: 'var(--primary)' }}>
              <i className="fas fa-hotel"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
              {t('pillar1Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
              {t('pillar1Desc')}
            </p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start' }} onClick={() => setCurrentPage('search')}>
              Voir les exposants Hôtels <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sector-icon" style={{ background: 'rgba(243, 103, 29, 0.12)', color: 'var(--accent)' }}>
              <i className="fas fa-utensils"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
              {t('pillar2Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
              {t('pillar2Desc')}
            </p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start' }} onClick={() => setCurrentPage('search')}>
              Voir les exposants Resto <i className="fas fa-arrow-right"></i>
            </button>
          </div>

          <div className="card" style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div className="sector-icon" style={{ background: 'rgba(139, 92, 246, 0.15)', color: 'var(--purple)' }}>
              <i className="fas fa-user-graduate"></i>
            </div>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
              {t('pillar3Title')}
            </h3>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.6', flex: 1 }}>
              {t('pillar3Desc')}
            </p>
            <button className="btn btn-outline btn-sm" style={{ marginTop: '16px', alignSelf: 'flex-start' }} onClick={() => setCurrentPage('jobs')}>
              Accéder au Job Dating <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* SECTEURS D'ACTIVITE & POLES D'EXPOSITION */}
      <div className="card" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', marginBottom: '40px' }}>
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-th-large text-accent"></i> Pôles d'Exposition &amp; Secteurs d'Activité
          </h3>
          <span className="badge badge-sector">5 Pôles Spécialisés</span>
        </div>

        <div className="grid-3">
          <div className="sector-card">
            <div className="sector-icon"><i className="fas fa-blender"></i></div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Équipements &amp; Cuisine</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Fours, chambres froides, matériel inox, petit électroménager CHR.</p>
          </div>

          <div className="sector-card">
            <div className="sector-icon" style={{ color: 'var(--accent)', background: 'rgba(243,103,29,0.1)' }}><i className="fas fa-laptop-code"></i></div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Tech &amp; Logiciels PMS</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Caisse tactile, réservation en ligne, ERP hôtelier, clés digitales.</p>
          </div>

          <div className="sector-card">
            <div className="sector-icon" style={{ color: 'var(--purple)', background: 'rgba(139,92,246,0.1)' }}><i className="fas fa-apple-alt"></i></div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Agroalimentaire &amp; Boissons</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Produits locaux, jus artisanaux, produits frais, café &amp; thé premium.</p>
          </div>

          <div className="sector-card">
            <div className="sector-icon" style={{ color: 'var(--success)', background: 'rgba(16,185,129,0.1)' }}><i className="fas fa-couch"></i></div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Design &amp; Aménagement</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Mobilier de terrasse, linge d&apos;hôtel, literie pro, décoration.</p>
          </div>

          <div className="sector-card">
            <div className="sector-icon" style={{ color: '#ec4899', background: 'rgba(236,72,153,0.1)' }}><i className="fas fa-id-card"></i></div>
            <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '6px' }}>Recrutement &amp; Conseil</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Cabinets RH, écoles hôtelières, consulting en gestion et audit.</p>
          </div>

          <div className="sector-card" style={{ background: 'var(--primary-dark)', color: 'white' }}>
            <div className="sector-icon" style={{ color: 'var(--accent)', background: 'rgba(255,255,255,0.15)' }}><i className="fas fa-store"></i></div>
            <h4 style={{ fontWeight: 800, color: 'white', marginBottom: '6px' }}>Réserver un Stand</h4>
            <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.85)', marginBottom: '10px' }}>Exposez vos produits devant 500+ acheteurs.</p>
            <button className="btn btn-accent btn-sm" onClick={() => setCurrentPage('pricing')}>
              Packs Exposants <i className="fas fa-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

      {/* CONTACT & WHATSAPP SECTION */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-headset text-accent"></i> Secrétariat du Salon &amp; Infoline WhatsApp
          </h3>
          <span className="badge badge-success">Assistance 7j/7</span>
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

            <div className="grid-2">
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
                <label className="form-label">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="+221 77 ..."
                  value={cntPhone}
                  onChange={(e) => setCntPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Entreprise / Établissement</label>
              <input
                type="text"
                className="form-control"
                placeholder="ex: Hôtel Terrou-Bi, Restaurant Le Lagon..."
                value={cntCompany}
                onChange={(e) => setCntCompany(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Message / Demande d'Information ou Stand</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Précisez votre demande (réservation stand, pass B2B, partenariat...)"
                value={cntMsg}
                onChange={(e) => setCntMsg(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
              <i className="fas fa-paper-plane"></i> {loading ? 'Transmission en cours...' : 'Envoyer ma demande au Comité'}
            </button>
          </form>

          <div
            style={{
              background: 'linear-gradient(135deg, #021a4f 0%, #033498 100%)',
              color: 'white',
              padding: '30px',
              borderRadius: 'var(--radius-md)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ background: 'rgba(16,185,129,0.2)', width: '60px', height: '60px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '14px' }}>
              <i className="fab fa-whatsapp" style={{ fontSize: '2.2rem', color: '#25D366' }}></i>
            </div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.2rem', marginBottom: '8px' }}>
              Infoline Officielle WhatsApp
            </h4>
            <p style={{ fontSize: '0.88rem', color: 'rgba(255,255,255,0.85)', marginBottom: '18px', maxWidth: '320px' }}>
              Scannez le QR Code ou appuyez pour contacter directement l&apos;équipe HORECA Africa :
            </p>
            <a
              href="https://wa.me/221775428235"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                background: 'white',
                padding: '12px',
                borderRadius: 'var(--radius-md)',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                display: 'inline-block',
                transition: 'transform 0.2s'
              }}
            >
              <img
                src="https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=https://wa.me/221775428235"
                alt="WhatsApp HORECA Africa"
                width={140}
                height={140}
              />
            </a>
            <a
              href="https://wa.me/221775428235"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-sm"
              style={{ marginTop: '16px', textDecoration: 'none' }}
            >
              <i className="fab fa-whatsapp"></i> Chatter +221 77 542 82 35
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

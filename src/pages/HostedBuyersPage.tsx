import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { apiService } from '../services/api';

export const HostedBuyersPage: React.FC = () => {
  const { showToast } = useAuth();
  const { t } = useI18n();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [country, setCountry] = useState('Algérie');
  const [procurementVolume, setProcurementVolume] = useState('> 100 000 € / an');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.submitContact({
        firstName,
        lastName,
        email,
        phone,
        company: `${company} (${jobTitle} - ${country} - Achats: ${procurementVolume})`,
        message: `[POSTULATION HOSTED BUYER VIP] ${message}`
      });
      showToast(`Merci ${firstName} ! Votre candidature Hosted Buyer a été reçue par le Comité Demba Conciergerie DMC.`);
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setCompany('');
      setJobTitle('');
      setMessage('');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la postulation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* HERO SECTION */}
      <div
        className="hero"
        style={{
          background: 'linear-gradient(135deg, #021a4f 0%, #033498 60%, #f3671d 120%)',
          position: 'relative'
        }}
      >
        <div style={{ maxWidth: '880px', position: 'relative', zIndex: 2 }}>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '16px' }}>
            <span className="badge" style={{ background: 'rgba(243, 103, 29, 0.35)', color: 'white', border: '1px solid rgba(243, 103, 29, 0.6)' }}>
              👑 Programme Exclusive VIP Hosted Buyers
            </span>
            <span className="badge" style={{ background: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255,255,255,0.3)' }}>
              📍 Novotel Dakar · 27 &amp; 28 Novembre 2026
            </span>
          </div>

          <h1 className="hero-title">
            {t('hostedTitle')}
          </h1>
          <p className="hero-subtitle">
            {t('hostedSubtitle')}
          </p>

          <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', marginTop: '20px' }}>
            <a href="#hosted-form" className="btn btn-accent">
              <i className="fas fa-crown"></i> Postuler au Programme VIP
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb6sCqYGk1G1Kn8Hpc1Z"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', background: 'rgba(255,255,255,0.1)' }}
            >
              <i className="fab fa-whatsapp text-accent"></i> Suivre la Chaîne Dakar 2026
            </a>
          </div>
        </div>
      </div>

      {/* 3 VIP ADVANTAGES GRID */}
      <div className="grid-3" style={{ marginBottom: '40px' }}>
        <div className="card" style={{ textAlign: 'center', height: '100%' }}>
          <div className="sector-icon" style={{ margin: '0 auto 16px', background: 'rgba(3,52,152,0.1)', color: 'var(--primary)', width: '64px', height: '64px', fontSize: '1.8rem' }}>
            <i className="fas fa-plane-departure"></i>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
            {t('hostedBenefit1Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {t('hostedBenefit1Desc')}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', height: '100%' }}>
          <div className="sector-icon" style={{ margin: '0 auto 16px', background: 'rgba(243,103,29,0.12)', color: 'var(--accent)', width: '64px', height: '64px', fontSize: '1.8rem' }}>
            <i className="fas fa-hotel"></i>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
            {t('hostedBenefit2Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {t('hostedBenefit2Desc')}
          </p>
        </div>

        <div className="card" style={{ textAlign: 'center', height: '100%' }}>
          <div className="sector-icon" style={{ margin: '0 auto 16px', background: 'rgba(139,92,246,0.15)', color: 'var(--purple)', width: '64px', height: '64px', fontSize: '1.8rem' }}>
            <i className="fas fa-handshake"></i>
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '10px' }}>
            {t('hostedBenefit3Title')}
          </h3>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
            {t('hostedBenefit3Desc')}
          </p>
        </div>
      </div>

      {/* ELIGIBILITY & APPLICATION FORM */}
      <div className="card" id="hosted-form" style={{ background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)', border: '2px solid var(--accent)' }}>
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-user-check text-accent"></i> Candidature &amp; Éligibilité Hosted Buyer VIP
          </h3>
          <span className="badge badge-success">Demba Conciergerie Luxury DMC</span>
        </div>

        <div className="grid-2" style={{ gap: '30px', alignItems: 'flex-start' }}>
          <div>
            <h4 style={{ color: 'var(--primary)', fontWeight: 800, fontSize: '1.15rem', marginBottom: '14px' }}>
              Profils Éligibles à la Prise en Charge VIP :
            </h4>

            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <i className="fas fa-check-circle text-success" style={{ fontSize: '1.1rem' }}></i>
                <span><strong>Directeurs des Achats &amp; CPO</strong> de chaînes hôtelières et resorts.</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <i className="fas fa-check-circle text-success" style={{ fontSize: '1.1rem' }}></i>
                <span><strong>Propriétaires &amp; Gérants</strong> de groupes de restauration et cafés (CHR).</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <i className="fas fa-check-circle text-success" style={{ fontSize: '1.1rem' }}></i>
                <span><strong>Investisseurs Touristiques &amp; Promoteurs</strong> en Afrique de l&apos;Ouest &amp; Internationale.</span>
              </li>
              <li style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '0.9rem', color: 'var(--gray-700)' }}>
                <i className="fas fa-check-circle text-success" style={{ fontSize: '1.1rem' }}></i>
                <span><strong>Grossistes &amp; Distributeurs</strong> de matériel de cuisine et agroalimentaire.</span>
              </li>
            </ul>

            <div
              style={{
                marginTop: '24px',
                background: 'linear-gradient(135deg, #022068 0%, #033498 100%)',
                color: 'white',
                padding: '20px',
                borderRadius: 'var(--radius-md)',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <h5 style={{ color: 'white', fontWeight: 800, marginBottom: '6px', fontSize: '1rem' }}>
                <i className="fab fa-whatsapp text-accent"></i> Infoline Direct Hosted Buyers
              </h5>
              <p style={{ fontSize: '0.84rem', color: 'rgba(255,255,255,0.85)', marginBottom: '12px' }}>
                Contactez directement le comité d&apos;organisation par téléphone ou sur notre chaîne officielle WhatsApp :
              </p>
              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <a href="https://wa.me/221764205216" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
                  <i className="fab fa-whatsapp"></i> +221 76 420 52 16
                </a>
                <a href="https://whatsapp.com/channel/0029Vb6sCqYGk1G1Kn8Hpc1Z" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}>
                  📢 Chaîne Dakar 2026
                </a>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Prénom *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Mamadou"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nom *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="Diop"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
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
                  placeholder="direction@achats-hotel.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="+213 6... / +216..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Entreprise / Groupe *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ex: Groupe Hôtelier Azalaï"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Poste Occupé *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ex: Directeur des Achats"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Pays de Résidence *</label>
                <select className="form-control" value={country} onChange={(e) => setCountry(e.target.value)}>
                  <option value="Algérie">🇩🇿 Algérie</option>
                  <option value="Tunisie">🇹🇳 Tunisie</option>
                  <option value="Maroc">🇲🇦 Maroc</option>
                  <option value="France">🇫🇷 France</option>
                  <option value="Côte d'Ivoire">🇨🇮 Côte d'Ivoire</option>
                  <option value="Sénégal">🇸🇳 Sénégal</option>
                  <option value="Autre">🌐 Autre Pays</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Volume d'Achats Annuel Estimé *</label>
                <select className="form-control" value={procurementVolume} onChange={(e) => setProcurementVolume(e.target.value)}>
                  <option value="> 50 000 € / an">&gt; 50 000 € / an</option>
                  <option value="> 100 000 € / an">&gt; 100 000 € / an</option>
                  <option value="> 500 000 € / an">&gt; 500 000 € / an</option>
                  <option value="> 1 000 000 € / an">&gt; 1 000 000 € / an</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Produits &amp; Équipements Recherchés à HORECA Africa</label>
              <textarea
                className="form-control"
                rows={3}
                placeholder="Précisez vos besoins d'achats (Équipements de cuisine, linge, mobilier, logiciels PMS...)"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              ></textarea>
            </div>

            <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
              <i className="fas fa-paper-plane"></i> {loading ? 'Envoi en cours...' : 'Envoyer ma postulation Hosted Buyer VIP'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

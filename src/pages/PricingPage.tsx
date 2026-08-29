import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { apiService } from '../services/api';
import { ExhibitorBudgetCalculator } from '../components';

import { PaymentModal } from '../components/modals/PaymentModal';

export const PricingPage: React.FC = () => {
  const { setCurrentPage, showToast, currentUser } = useAuth();
  const { t, formatPrice, currency } = useI18n();
  const [selectedPackToPay, setSelectedPackToPay] = useState<{ packName: string; amount: number } | null>(null);

  const handlePayWave = async (packName: string, amount: number) => {
    if (amount === 0) {
      setCurrentPage('register');
      return;
    }
    setSelectedPackToPay({ packName, amount });
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-sector" style={{ marginBottom: '12px', display: 'inline-block' }}>
          📍 {t('venue')} · {t('dates')}
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 900, color: 'var(--primary)' }}>
          {t('pricingTitle')}
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '720px', margin: '10px auto 0', lineHeight: '1.6' }}>
          {t('pricingSubtitle')}
        </p>
      </div>

      <div className="grid-4" style={{ alignItems: 'stretch', marginBottom: '44px' }}>
        {/* STAND 1: DECOUVERTE 6M2 */}
        <div className="pricing-card">
          <div>
            <span className="badge badge-role" style={{ marginBottom: '8px', display: 'inline-block' }}>Stand Découverte</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Stand 6 m²</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Stand équipé &amp; 2 Badges</p>
            <div className="price-amount">{formatPrice(200000)}</div>
            <div className="price-sub">≈ 305 € · ≈ 333 USD TTC</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Stand équipé (cloisons, enseigne)</li>
              <li><i className="fas fa-check-circle"></i> 1 table + 2 chaises</li>
              <li><i className="fas fa-check-circle"></i> 1 prise électrique</li>
              <li><i className="fas fa-check-circle"></i> 2 badges exposants inclus</li>
              <li><i className="fas fa-check-circle"></i> Listing dans le catalogue &amp; le site</li>
              <li><i className="fas fa-check-circle"></i> Accès au Business Matching B2B</li>
            </ul>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            onClick={() => handlePayWave('Stand Découverte 6m²', 200000)}
          >
            💳 Réserver ({formatPrice(200000)})
          </button>
        </div>

        {/* STAND 2: BUSINESS 9M2 */}
        <div className="pricing-card">
          <div>
            <span className="badge badge-sector" style={{ marginBottom: '8px', display: 'inline-block' }}>Stand Business</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Stand 9 m²</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Stand équipé &amp; Communication</p>
            <div className="price-amount">{formatPrice(350000)}</div>
            <div className="price-sub">≈ 534 € · ≈ 583 USD TTC</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Stand équipé (cloisons, enseigne)</li>
              <li><i className="fas fa-check-circle"></i> 1 table + 3 chaises</li>
              <li><i className="fas fa-check-circle"></i> 1 prise électrique</li>
              <li><i className="fas fa-check-circle"></i> 4 badges exposants inclus</li>
              <li><i className="fas fa-check-circle"></i> Listing catalogue &amp; communication digitale</li>
              <li><i className="fas fa-check-circle"></i> Accès prioritaire Business Matching</li>
            </ul>
          </div>
          <button
            className="btn btn-accent"
            style={{ width: '100%' }}
            onClick={() => handlePayWave('Stand Business 9m²', 350000)}
          >
            💳 Réserver ({formatPrice(350000)})
          </button>
        </div>

        {/* STAND 3: PREMIUM 12M2 (FEATURED) */}
        <div className="pricing-card featured">
          <div className="featured-badge">STAR EXPOSANTS</div>
          <div>
            <span className="badge badge-sector" style={{ marginBottom: '8px', display: 'inline-block' }}>Stand Premium</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Stand 12 m²</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Emplacement privilégié &amp; Écran TV</p>
            <div className="price-amount">{formatPrice(450000)}</div>
            <div className="price-sub">≈ 686 € · ≈ 750 USD TTC</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Emplacement privilégié sur le salon</li>
              <li><i className="fas fa-check-circle"></i> Stand sur-mesure équipé</li>
              <li><i className="fas fa-check-circle"></i> 1 table + 4 chaises + 1 comptoir</li>
              <li><i className="fas fa-check-circle"></i> <strong>1 écran TV de présentation</strong></li>
              <li><i className="fas fa-check-circle"></i> 6 badges exposants inclus</li>
              <li><i className="fas fa-check-circle"></i> Visibilité renforcée &amp; RDV B2B VIP</li>
            </ul>
          </div>
          <button
            className="btn btn-accent"
            style={{ width: '100%' }}
            onClick={() => handlePayWave('Stand Premium 12m²', 450000)}
          >
            💳 Réserver ({formatPrice(450000)})
          </button>
        </div>

        {/* STAND 4: PRESTIGE 18M2 */}
        <div className="pricing-card" style={{ borderColor: 'var(--purple)' }}>
          <div>
            <span className="badge badge-student" style={{ marginBottom: '8px', display: 'inline-block' }}>Stand Prestige</span>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple)' }}>Stand 18 m²</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Visibilité Maximale &amp; Sur-mesure</p>
            <div className="price-amount" style={{ color: 'var(--purple)' }}>{formatPrice(600000)}</div>
            <div className="price-sub">≈ 915 € · ≈ 1000 USD TTC</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Emplacement Premium d&apos;entrée</li>
              <li><i className="fas fa-check-circle"></i> Stand sur-mesure haut de gamme</li>
              <li><i className="fas fa-check-circle"></i> Mobilier lounge + comptoir d&apos;accueil</li>
              <li><i className="fas fa-check-circle"></i> 1 écran TV + 8 badges exposants</li>
              <li><i className="fas fa-check-circle"></i> Visibilité maximale sur tous les supports</li>
              <li><i className="fas fa-check-circle"></i> Accès prioritaire Hosted Buyers VIP</li>
            </ul>
          </div>
          <button
            className="btn btn-purple"
            style={{ width: '100%' }}
            onClick={() => handlePayWave('Stand Prestige 18m²', 600000)}
          >
            💳 Réserver ({formatPrice(600000)})
          </button>
        </div>
      </div>

      {/* EXHIBITOR BUDGET & TRAVEL CALCULATOR SECTION */}
      <div id="calculator-section" style={{ marginBottom: '44px' }}>
        <ExhibitorBudgetCalculator />
      </div>

      {/* SECURE PAYMENT BANNER */}
      <div
        className="card"
        style={{
          marginTop: '36px',
          background: 'linear-gradient(135deg, #022068 0%, #033498 100%)',
          color: 'white',
          padding: '24px 32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <i className="fas fa-shield-alt text-accent" style={{ fontSize: '2.4rem' }}></i>
          <div>
            <h4 style={{ color: 'white', fontWeight: 800, fontSize: '1.15rem' }}>Paiement Sécurisé ({currency}) &amp; Facture Proforma</h4>
            <p style={{ fontSize: '0.86rem', color: 'rgba(255,255,255,0.85)' }}>
              Wave Mobile Money, Orange Money, Virement Bancaire SWIFT ou Chèque à l&apos;ordre de Demba Conciergerie Luxury DMC / Comité HORECA Africa.
            </p>
          </div>
        </div>
        <a href="https://wa.me/221775428235" target="_blank" rel="noopener noreferrer" className="btn btn-accent btn-sm">
          <i className="fab fa-whatsapp"></i> Demander un devis / proforma ({currency})
        </a>
      </div>

      {selectedPackToPay && (
        <PaymentModal
          packName={selectedPackToPay.packName}
          amount={selectedPackToPay.amount}
          onClose={() => setSelectedPackToPay(null)}
        />
      )}
    </div>
  );
};

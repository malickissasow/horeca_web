import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';

export const PricingPage: React.FC = () => {
  const { setCurrentPage, showToast, currentUser } = useAuth();
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const handlePayWave = async (packName: string, amount: number) => {
    if (amount === 0) {
      setCurrentPage('register');
      return;
    }

    setLoadingPack(packName);
    try {
      showToast(`🌊 Initialisation du paiement Wave pour le ${packName}...`);
      const res = await apiService.createWaveCheckout(amount, packName, currentUser?.email);
      if (res.wave_launch_url) {
        window.location.href = res.wave_launch_url;
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du paiement Wave');
    } finally {
      setLoadingPack(null);
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)' }}>
          Offres & Tarifs d'Accès <span style={{ color: 'var(--accent)' }}>2026</span>
        </h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '1.05rem', maxWidth: '680px', margin: '8px auto 0' }}>
          Choisissez la formule adaptée à vos objectifs B2B, d'exposition ou de recrutement RH pour les 25 & 26 Novembre 2026.
        </p>
      </div>

      <div className="grid-4" style={{ alignItems: 'stretch' }}>
        {/* PACK 1: VISITEUR PRO */}
        <div className="pricing-card">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Pass Visiteur Pro</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Accès conférences & salon</p>
            <div className="price-amount">25 000 FCFA</div>
            <div className="price-sub">par participant · 2 jours</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Accès aux 2 jours d'exposition</li>
              <li><i className="fas fa-check-circle"></i> Entrée aux conférences & panels</li>
              <li><i className="fas fa-check-circle"></i> Badge digital & QR Pass</li>
              <li><i className="fas fa-times-circle" style={{ color: 'var(--gray-300)' }}></i> <span style={{ color: 'var(--text-muted)' }}>Matchmaking B2B sur table</span></li>
            </ul>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%' }}
            disabled={loadingPack === 'Pass Visiteur Pro'}
            onClick={() => handlePayWave('Pass Visiteur Pro', 25000)}
          >
            {loadingPack === 'Pass Visiteur Pro' ? 'Wave en cours...' : '🌊 Payer 25 000 F via Wave'}
          </button>
        </div>

        {/* PACK 2: B2B MATCHMAKER (FEATURED) */}
        <div className="pricing-card featured">
          <div className="featured-badge">RECOMMANDÉ PRO</div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Pass B2B Matchmaker</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>RDV B2B Ciblés & Agenda</p>
            <div className="price-amount">150 000 FCFA</div>
            <div className="price-sub">par entreprise · 2 jours</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Tout le Pass Visiteur Pro</li>
              <li><i className="fas fa-check-circle"></i> <strong>Agenda RDV B2B Garantis</strong></li>
              <li><i className="fas fa-check-circle"></i> Attribution de Tables Numérotées</li>
              <li><i className="fas fa-check-circle"></i> Accès Annuaire Décideurs</li>
            </ul>
          </div>
          <button
            className="btn btn-accent"
            style={{ width: '100%' }}
            disabled={loadingPack === 'Pass B2B Matchmaker'}
            onClick={() => handlePayWave('Pass B2B Matchmaker', 150000)}
          >
            {loadingPack === 'Pass B2B Matchmaker' ? 'Wave en cours...' : '🌊 Payer 150 000 F via Wave'}
          </button>
        </div>

        {/* PACK 3: EXPOSANT & JOB DATING */}
        <div className="pricing-card">
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--primary)' }}>Pack Stand & Recrutement</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Stand Dédié & Job Dating RH</p>
            <div className="price-amount">450 000 FCFA</div>
            <div className="price-sub">Stand 6m² équipé · Novotel</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Stand d'exposition 6m² équipé</li>
              <li><i className="fas fa-check-circle"></i> <strong>Espace Recrutement RH / CVs</strong></li>
              <li><i className="fas fa-check-circle"></i> RDV B2B Illimités sur Stand</li>
              <li><i className="fas fa-check-circle"></i> Visibilité Catalogue Officiel</li>
            </ul>
          </div>
          <button
            className="btn btn-purple"
            style={{ width: '100%' }}
            disabled={loadingPack === 'Pack Stand & Recrutement'}
            onClick={() => handlePayWave('Pack Stand & Recrutement', 450000)}
          >
            {loadingPack === 'Pack Stand & Recrutement' ? 'Wave en cours...' : '🌊 Payer 450 000 F via Wave'}
          </button>
        </div>

        {/* PACK 4: CANDIDAT RH / ETUDIANT */}
        <div className="pricing-card" style={{ borderColor: 'var(--purple)' }}>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--purple)' }}>Pass Job Dating RH</h3>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Candidats & Étudiants HORECA</p>
            <div className="price-amount" style={{ color: 'var(--purple)' }}>GRATUIT</div>
            <div className="price-sub">sur sélection de CV</div>

            <ul className="pricing-features">
              <li><i className="fas fa-check-circle"></i> Publication du CV dans la CVthèque</li>
              <li><i className="fas fa-check-circle"></i> <strong>Entretiens avec les DRH</strong></li>
              <li><i className="fas fa-check-circle"></i> Accès Espace Job Dating RH</li>
              <li><i className="fas fa-check-circle"></i> Badge Digital Recrutement</li>
            </ul>
          </div>
          <button
            className="btn btn-outline"
            style={{ width: '100%', borderColor: 'var(--purple)', color: 'var(--purple)' }}
            onClick={() => setCurrentPage('register')}
          >
            🎓 Inscription Gratuite (CV)
          </button>
        </div>
      </div>
    </div>
  );
};

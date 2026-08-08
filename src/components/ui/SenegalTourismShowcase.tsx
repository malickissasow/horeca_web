import React from 'react';
import { useI18n } from '../../context/I18nContext';

export const SenegalTourismShowcase: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="card" style={{ overflow: 'hidden', padding: '0', borderRadius: 'var(--radius-lg)', border: '2px solid var(--accent)' }}>
      {/* HEADER BANNER WITH GRADIENT */}
      <div
        style={{
          background: 'linear-gradient(135deg, #021a4f 0%, #033498 60%, #f3671d 100%)',
          color: 'white',
          padding: '30px 36px',
          position: 'relative'
        }}
      >
        <span className="badge" style={{ background: 'var(--accent)', color: 'white', marginBottom: '10px', display: 'inline-block' }}>
          🇸🇳 Destination Sénégal 2026 · Teranga &amp; Affaires
        </span>
        <h2 style={{ fontSize: '2.2rem', fontWeight: 900, color: 'white', marginBottom: '8px' }}>
          Découvrez la Magie du Sénégal &amp; le Réseau HORECA
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1rem', maxWidth: '780px', lineHeight: '1.6' }}>
          Alliez vos opportunités de rendez-vous B2B à la découverte des trésors touristiques de Dakar et du Sénégal : du Lac Rose au Monument de la Renaissance Africaine.
        </p>
      </div>

      {/* 4 TOURISM HIGHLIGHT CARDS GRID */}
      <div style={{ padding: '30px', background: '#f8fafc' }}>
        <div className="grid-4">
          {/* CARD 1: LAC ROSE */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/tourism/lac_rose.jpg"
                alt="Lac Rose Sénégal & Pirogues"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(3, 52, 152, 0.85)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}
              >
                📍 Niaga · Lac Retba
              </span>
            </div>
            <div style={{ padding: '18px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                Le Mythique Lac Rose
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Célèbre plan d&apos;eau rose bordé de pirogues traditionnelles et de récolteurs de sel. Excursion incontournable à 45 min de Dakar.
              </p>
            </div>
          </div>

          {/* CARD 2: MONUMENT RENAISSANCE */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/tourism/monument_renaissance.jpg"
                alt="Monument de la Renaissance Africaine Dakar"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(243, 103, 29, 0.9)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}
              >
                📍 Ouakam · Dakar
              </span>
            </div>
            <div style={{ padding: '18px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                Monument de la Renaissance
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Statue monumentale en bronze de 52 mètres dominant l&apos;Atlantique, symbole d&apos;une Afrique tournée vers l&apos;avenir.
              </p>
            </div>
          </div>

          {/* CARD 3: LITTORAL & CÔTE DAKAROISE */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/tourism/littoral_dakar.jpg"
                alt="Littoral et côte de Dakar Sénégal"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(16, 185, 129, 0.9)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}
              >
                📍 La Presqu'île du Cap-Vert
              </span>
            </div>
            <div style={{ padding: '18px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                Littoral &amp; Plages de Dakar
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Des kilomètres de côtes prisées par l&apos;hôtellerie balnéaire, les clubs de surf, restaurants de fruits de mer et complexes resort.
              </p>
            </div>
          </div>

          {/* CARD 4: TERANGA & RESEAU REGIONAL */}
          <div
            style={{
              background: 'white',
              borderRadius: 'var(--radius-md)',
              overflow: 'hidden',
              boxShadow: 'var(--shadow-md)',
              border: '1px solid var(--gray-200)',
              transition: 'transform 0.25s ease'
            }}
          >
            <div style={{ height: '190px', overflow: 'hidden', position: 'relative' }}>
              <img
                src="/assets/tourism/reseau_senegal.png"
                alt="Réseau HORECA & Teranga Sénégalaise"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <span
                style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  background: 'rgba(139, 92, 246, 0.9)',
                  color: 'white',
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '3px 10px',
                  borderRadius: '12px'
                }}
              >
                🌍 Hub Régional Aérien
              </span>
            </div>
            <div style={{ padding: '18px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem', marginBottom: '6px' }}>
                L'Hospitalité &quot;Teranga&quot;
              </h4>
              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                Carrefour stratégique des liaisons aériennes en Afrique de l&apos;Ouest reliant Paris, Casablanca, Alger, Tunis et Abidjan à Dakar.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

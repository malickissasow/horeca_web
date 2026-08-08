import React from 'react';
import { useI18n, Language, Currency } from '../../context/I18nContext';

export const TopBar: React.FC = () => {
  const { language, setLanguage, currency, setCurrency, theme, toggleTheme, t } = useI18n();

  const socialIconStyle: React.CSSProperties = {
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.3)',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontSize: '0.8rem',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
    textDecoration: 'none',
  };

  return (
    <div className="top-bar">
      <div className="container" style={{ flexWrap: 'wrap', gap: '8px' }}>
        {/* LEFT: Contact Info */}
        <div className="top-info">
          <span>
            <i className="fas fa-envelope"></i>
            <a href="mailto:infos@horecafrica.com" style={{ color: 'white', opacity: 0.92 }}>
              infos@horecafrica.com
            </a>
          </span>
          <span><i className="fas fa-phone-alt"></i> +221 77 542 82 35</span>
          <span><i className="fas fa-map-marker-alt"></i> {t('venue')}</span>
        </div>

        {/* RIGHT: Language, Theme, Currency, Socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

          {/* MULTI-LANGUE SELECTOR */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(255,255,255,0.12)', padding: '3px 10px', borderRadius: '15px'
          }}>
            <i className="fas fa-globe" style={{ color: 'var(--horeca-orange)', fontSize: '0.78rem' }}></i>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              aria-label={t('selectLanguage')}
            >
              <option value="fr" style={{ background: '#1a2d6e', color: 'white' }}>🇫🇷 French</option>
              <option value="en" style={{ background: '#1a2d6e', color: 'white' }}>🇬🇧 English</option>
              <option value="ar" style={{ background: '#1a2d6e', color: 'white' }}>🇸🇦 العربية</option>
            </select>
          </div>

          {/* MULTI-DEVISE SELECTOR */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(240,120,32,0.22)', border: '1px solid rgba(240,120,32,0.45)',
            padding: '3px 10px', borderRadius: '15px'
          }}>
            <i className="fas fa-coins" style={{ color: '#ffb07a', fontSize: '0.78rem' }}></i>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '0.78rem', fontWeight: 700, cursor: 'pointer' }}
              aria-label={t('selectCurrency')}
            >
              <option value="FCFA" style={{ background: '#1a2d6e', color: 'white' }}>FCFA</option>
              <option value="EUR"  style={{ background: '#1a2d6e', color: 'white' }}>EUR €</option>
              <option value="USD"  style={{ background: '#1a2d6e', color: 'white' }}>USD $</option>
              <option value="DZD"  style={{ background: '#1a2d6e', color: 'white' }}>DZD</option>
              <option value="TND"  style={{ background: '#1a2d6e', color: 'white' }}>TND</option>
            </select>
          </div>

          {/* THEME TOGGLE */}
          <button
            onClick={toggleTheme}
            style={{
              background: 'rgba(255,255,255,0.12)', color: 'white',
              border: '1px solid rgba(255,255,255,0.25)', fontSize: '0.75rem',
              fontWeight: 700, padding: '3px 10px', borderRadius: '15px',
              cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px'
            }}
            title="Changer le thème"
          >
            {theme === 'dark' ? '🌙' : '☀️'} {theme === 'dark' ? 'Sombre' : 'Clair'}
          </button>

          {/* SOCIAL ICONS — comme horecafrica.com */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="Facebook HORECA Africa">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="YouTube HORECA Africa">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="LinkedIn HORECA Africa">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="https://whatsapp.com/channel/0029Vb6sCqYGk1G1Kn8Hpc1Z"
              target="_blank" rel="noopener noreferrer"
              style={{ ...socialIconStyle, border: '1.5px solid #25D366' }}
              title="Canal WhatsApp HORECA Africa"
            >
              <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

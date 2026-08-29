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
      <div className="container" style={{ flexWrap: 'wrap', gap: '10px' }}>
        {/* LEFT: Contact Info */}
        <div className="top-info">
          <span>
            <i className="fas fa-envelope"></i>
            <a href="mailto:infos@horecafrica.com" style={{ color: 'white', opacity: 0.95 }}>
              infos@horecafrica.com
            </a>
          </span>
          <span>
            <i className="fas fa-phone-alt"></i>{' '}
            <a href="https://wa.me/221764205216" target="_blank" rel="noopener noreferrer" style={{ color: 'white', opacity: 0.95 }}>
              +221 76 420 52 16
            </a>
          </span>
          <span>
            <i className="fas fa-map-marker-alt"></i>{' '}
            <a
              href="https://www.google.com/maps/place/H%C3%B4tel+Novotel+Dakar/@14.6687241,-17.4268024,17z/data=!3m1!4b1!4m9!3m8!1s0xec173b40f1ab0fb:0x5e1b6d1773491456!5m2!4m1!1i2!8m2!3d14.6687241!4d-17.4268024!16s%2Fg%2F1tf9pmlv?entry=ttu&g_ep=EgoyMDI2MDgxOS4wIKXMDSoASAFQAw%3D%3D"
              target="_blank"
              rel="noopener noreferrer"
              style={{ color: 'white', textDecoration: 'underline', textUnderlineOffset: '3px', fontWeight: 600 }}
              title="Voir l'Hôtel Novotel Dakar sur Google Maps"
            >
              {t('venue')}
            </a>
          </span>
        </div>

        {/* RIGHT: Language, Theme, Currency, Socials */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap' }}>

          {/* MULTI-LANGUE SELECTOR */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '5px',
            background: 'rgba(255,255,255,0.15)', padding: '4px 12px', borderRadius: '16px'
          }}>
            <i className="fas fa-globe" style={{ color: 'var(--horeca-orange)', fontSize: '0.85rem' }}></i>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value as Language)}
              style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
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
            background: 'rgba(240,120,32,0.25)', border: '1px solid rgba(240,120,32,0.5)',
            padding: '4px 12px', borderRadius: '16px'
          }}>
            <i className="fas fa-coins" style={{ color: '#ffb07a', fontSize: '0.85rem' }}></i>
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value as Currency)}
              style={{ background: 'transparent', color: 'white', border: 'none', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
              aria-label={t('selectCurrency')}
            >
              <option value="FCFA" style={{ background: '#1a2d6e', color: 'white' }}>FCFA</option>
              <option value="EUR"  style={{ background: '#1a2d6e', color: 'white' }}>EUR €</option>
              <option value="USD"  style={{ background: '#1a2d6e', color: 'white' }}>USD $</option>
              <option value="DZD"  style={{ background: '#1a2d6e', color: 'white' }}>DZD</option>
              <option value="TND"  style={{ background: '#1a2d6e', color: 'white' }}>TND</option>
            </select>
          </div>

          {/* CANAL WHATSAPP BUTTON */}
          <a
            href="https://whatsapp.com/channel/0029VaWOV0rHFxP5qPdtDS3Y"
            target="_blank" rel="noopener noreferrer"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: '#25D366', color: '#ffffff', border: 'none',
              padding: '4px 12px', borderRadius: '16px', fontSize: '0.8rem',
              fontWeight: 800, textDecoration: 'none', boxShadow: '0 2px 6px rgba(37,211,102,0.4)',
              transition: 'transform 0.2s ease'
            }}
            title="Rejoindre le Canal WhatsApp HORECA Africa"
          >
            <i className="fab fa-whatsapp" style={{ fontSize: '0.95rem' }}></i>
            Canal WhatsApp HORECA Africa
          </a>

          {/* SOCIAL ICONS */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <a href="https://www.facebook.com/horecafrique?locale=fr_FR" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="Facebook HORECA Africa">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://www.instagram.com/dembaconciergerie/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="Instagram Demba Conciergerie">
              <i className="fab fa-instagram"></i>
            </a>
            <a href="https://www.youtube.com/@HorecaAfricaTv" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="YouTube HORECA Africa">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://www.linkedin.com/company/reseau-horeca/" target="_blank" rel="noopener noreferrer" style={socialIconStyle}
               title="LinkedIn HORECA Africa">
              <i className="fab fa-linkedin-in"></i>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

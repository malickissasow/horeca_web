import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

export const Footer: React.FC = () => {
  const { setCurrentPage } = useAuth();
  const { t } = useI18n();

  const socialStyle: React.CSSProperties = {
    width: '36px', height: '36px', borderRadius: '50%',
    border: '1.5px solid rgba(255,255,255,0.2)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem',
    transition: 'all 0.2s ease', textDecoration: 'none',
  };

  return (
    <footer>
      <div className="container grid-4">
        {/* BRAND */}
        <div>
          <h4 style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img
              src="https://horecafrica.com/wp-content/uploads/2026/07/cropped-Horeca-Africa-Salon-3-192x192.jpeg"
              alt="HORECA Africa"
              style={{ height: '34px', borderRadius: '5px', verticalAlign: 'middle' }}
            />
            HORECA Africa 2026
          </h4>
          <p style={{ fontSize: '0.84rem', lineHeight: '1.65', color: 'rgba(255,255,255,0.75)', marginBottom: '16px' }}>
            {t('footerDesc')}
          </p>
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" style={socialStyle} title="Facebook">
              <i className="fab fa-facebook-f"></i>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" style={socialStyle} title="YouTube">
              <i className="fab fa-youtube"></i>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" style={socialStyle} title="LinkedIn">
              <i className="fab fa-linkedin-in"></i>
            </a>
            <a
              href="https://wa.me/221775428235" target="_blank" rel="noopener noreferrer"
              style={{ ...socialStyle, border: '1.5px solid #25D366' }} title="WhatsApp direct"
            >
              <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i>
            </a>
            <a href="https://horecafrica.com/" target="_blank" rel="noopener noreferrer" style={socialStyle} title="Site Officiel">
              <i className="fas fa-globe" style={{ color: 'var(--horeca-orange)' }}></i>
            </a>
          </div>
        </div>

        {/* NAV RAPIDE */}
        <div>
          <h4>Navigation Rapide</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>{t('navHome')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('pricing'); }}>{t('navPricing')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>{t('navMatchmaking')}</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('jobs'); }}>{t('navJobs')}</a></li>
            <li>
              <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('hosted'); }}
                 style={{ color: 'var(--horeca-orange)' }}>
                👑 {t('navHosted')}
              </a>
            </li>
            <li>
              <a href="https://whatsapp.com/channel/0029Vb6sCqYGk1G1Kn8Hpc1Z" target="_blank" rel="noopener noreferrer"
                 style={{ color: '#25D366' }}>
                📢 {t('waChannel')}
              </a>
            </li>
          </ul>
        </div>

        {/* POLES */}
        <div>
          <h4>Pôles d'Exposition</h4>
          <ul>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Équipements & Cuisine</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Technologies & ERP/PMS</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Agroalimentaire & Boissons</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}>Design & Mobilier</a></li>
            <li><a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('jobs'); }}>Recrutement & Formation</a></li>
          </ul>
        </div>

        {/* CONTACT */}
        <div>
          <h4>Secrétariat & Lieu</h4>
          <ul>
            <li>
              <i className="fas fa-map-marker-alt" style={{ color: 'var(--horeca-orange)', marginRight: '8px' }}></i>
              Hôtel Novotel Dakar, Sénégal
            </li>
            <li>
              <i className="fas fa-calendar-alt" style={{ color: 'var(--horeca-orange)', marginRight: '8px' }}></i>
              27 &amp; 28 Novembre 2026
            </li>
            <li>
              <i className="fas fa-phone-alt" style={{ color: 'var(--horeca-orange)', marginRight: '8px' }}></i>
              +221 77 542 82 35
            </li>
            <li>
              <i className="fas fa-envelope" style={{ color: 'var(--horeca-orange)', marginRight: '8px' }}></i>
              <a href="mailto:contact@horecafrica.com" style={{ color: 'rgba(255,255,255,0.72)' }}>
                contact@horecafrica.com
              </a>
            </li>
            <li>
              <i className="fas fa-globe" style={{ color: 'var(--horeca-orange)', marginRight: '8px' }}></i>
              <a href="https://horecafrica.com" target="_blank" rel="noopener noreferrer"
                 style={{ color: 'rgba(255,255,255,0.72)' }}>
                www.horecafrica.com
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* COPYRIGHT */}
      <div className="container" style={{
        textAlign: 'center', marginTop: '36px', paddingTop: '20px',
        borderTop: '1px solid rgba(255,255,255,0.1)',
        fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)'
      }}>
        {t('footerCopyright')}
      </div>
    </footer>
  );
};


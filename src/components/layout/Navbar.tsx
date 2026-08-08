import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useI18n } from '../../context/I18nContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenProfile?: () => void;
  onOpenPass?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenProfile, onOpenPass }) => {
  const { currentUser, logout, currentPage, setCurrentPage, pendingCount } = useAuth();
  const { t } = useI18n();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (page: string) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="container">
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}>
          <img
            src="https://horecafrica.com/wp-content/uploads/2026/07/cropped-Horeca-Africa-Salon-3-192x192.jpeg"
            alt="HORECA Africa"
            style={{ height: '44px', borderRadius: '6px', objectFit: 'contain' }}
          />
        </a>

        {/* MOBILE HAMBURGER BUTTON */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'}`}></i>
        </button>

        <div className={`nav-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          <a
            href="#"
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('home'); }}
          >
            <i className="fas fa-home"></i> {t('navHome')}
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'pricing' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('pricing'); }}
          >
            <i className="fas fa-tags"></i> {t('navPricing')}
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('search'); }}
          >
            <i className="fas fa-handshake"></i> {t('navMatchmaking')}
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'jobs' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('jobs'); }}
          >
            <i className="fas fa-user-graduate"></i> {t('navJobs')}
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'hosted' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); handleNavClick('hosted'); }}
            style={{ color: '#fca5a5' }}
          >
            <i className="fas fa-crown text-accent"></i> {t('navHosted')}
          </a>

          {currentUser && (
            <>
              <a
                href="#"
                className={`nav-item ${currentPage === 'meetings' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('meetings'); }}
              >
                <i className="fas fa-calendar-alt"></i> {t('navMeetings')}{' '}
                {pendingCount > 0 && (
                  <span
                    className="badge badge-accent"
                    style={{ background: 'var(--danger)', color: 'white', padding: '2px 6px', fontSize: '0.7rem', marginLeft: '4px', borderRadius: '10px' }}
                  >
                    {pendingCount}
                  </span>
                )}
              </a>
              <a
                href="#"
                className={`nav-item ${currentPage === 'day' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); handleNavClick('day'); }}
              >
                <i className="fas fa-mobile-alt"></i> {t('navDayPass')}
              </a>
            </>
          )}

          {currentUser?.isSuperAdmin && (
            <a
              href="#"
              className={`nav-item admin-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNavClick('admin'); }}
            >
              <i className="fas fa-shield-alt"></i> {t('navAdmin')}
            </a>
          )}
        </div>

        <div className={`user-menu ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {!currentUser ? (
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                className="btn btn-outline btn-sm"
                onClick={() => {
                  setMobileMenuOpen(false);
                  onOpenLogin();
                }}
              >
                <i className="fas fa-sign-in-alt"></i> {t('navLogin')}
              </button>
              <button
                className="btn btn-accent btn-sm"
                style={{ borderRadius: '6px', fontWeight: 800, letterSpacing: '0.3px' }}
                onClick={() => {
                  setMobileMenuOpen(false);
                  setCurrentPage('register');
                }}
              >
                <i className="fas fa-user-plus"></i> {t('navRegister')}
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
              {onOpenPass && (
                <button
                  className="btn btn-accent btn-sm"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenPass();
                  }}
                  title="Afficher mon Pass QR HORECA"
                >
                  <i className="fas fa-qrcode"></i> {t('navPass')}
                </button>
              )}
              {onOpenProfile && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenProfile();
                  }}
                  title="Éditer mon profil"
                >
                  <i className="fas fa-user-cog"></i> {t('navProfile')}
                </button>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  logout();
                }}
                title="Déconnexion"
                style={{ color: 'var(--danger)', padding: '6px 10px', fontSize: '0.9rem' }}
              >
                <i className="fas fa-power-off"></i> Déconnexion
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

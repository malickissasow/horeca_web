import React from 'react';
import { useAuth } from '../../context/AuthContext';

interface NavbarProps {
  onOpenLogin: () => void;
  onOpenProfile?: () => void;
  onOpenPass?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenLogin, onOpenProfile, onOpenPass }) => {
  const { currentUser, logout, switchDemoRole, currentPage, setCurrentPage, pendingCount } = useAuth();

  return (
    <nav className="navbar">
      <div className="container">
        <a href="#" className="brand-logo" onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}>
          <i className="fas fa-utensils"></i> HORECA AFRICA
          <span className="tag">Business & Jobs 2026</span>
        </a>

        <div className="nav-menu">
          <a
            href="#"
            className={`nav-item ${currentPage === 'home' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('home'); }}
          >
            <i className="fas fa-home"></i> Accueil
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'pricing' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('pricing'); }}
          >
            <i className="fas fa-tags"></i> Tarifs 2026
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'search' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('search'); }}
          >
            <i className="fas fa-magic"></i> Matchmaking B2B
          </a>
          <a
            href="#"
            className={`nav-item ${currentPage === 'jobs' ? 'active' : ''}`}
            onClick={(e) => { e.preventDefault(); setCurrentPage('jobs'); }}
          >
            <i className="fas fa-user-graduate"></i> Recrutement RH
          </a>

          {currentUser && (
            <>
              <a
                href="#"
                className={`nav-item ${currentPage === 'meetings' ? 'active' : ''}`}
                onClick={(e) => { e.preventDefault(); setCurrentPage('meetings'); }}
              >
                <i className="fas fa-calendar-alt"></i> Mes RDV{' '}
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
                onClick={(e) => { e.preventDefault(); setCurrentPage('day'); }}
              >
                <i className="fas fa-mobile-alt"></i> Pass & Jour J
              </a>
            </>
          )}

          {currentUser?.isSuperAdmin && (
            <a
              href="#"
              className={`nav-item admin-link ${currentPage === 'admin' ? 'active' : ''}`}
              onClick={(e) => { e.preventDefault(); setCurrentPage('admin'); }}
            >
              <i className="fas fa-crown"></i> Organisateur
            </a>
          )}
        </div>

        <div className="user-menu">
          {!currentUser ? (
            <div>
              <button
                className="btn btn-outline"
                style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', marginRight: '8px' }}
                onClick={onOpenLogin}
              >
                <i className="fas fa-sign-in-alt"></i> Se Connecter
              </button>
              <button
                className="btn btn-accent btn-sm"
                onClick={() => setCurrentPage('register')}
              >
                <i className="fas fa-user-plus"></i> S'inscrire
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {onOpenPass && (
                <button
                  className="btn btn-accent btn-sm"
                  style={{ padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={onOpenPass}
                  title="Afficher mon Pass HORECA"
                >
                  <i className="fas fa-qrcode"></i> Pass
                </button>
              )}
              {onOpenProfile && (
                <button
                  className="btn btn-outline btn-sm"
                  style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)', padding: '4px 10px', fontSize: '0.8rem' }}
                  onClick={onOpenProfile}
                  title="Éditer mon profil"
                >
                  <i className="fas fa-user-cog"></i> Profil
                </button>
              )}
              <button onClick={logout} title="Déconnexion" style={{ color: 'rgba(255,255,255,0.8)', marginLeft: '4px' }}>
                <i className="fas fa-power-off"></i>
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

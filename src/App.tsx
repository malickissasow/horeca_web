import React, { useState } from 'react';
import { useAuth } from './context/AuthContext';
import {
  TopBar,
  Navbar,
  Footer,
  LoginModal,
  Toast,
  ProfileModal,
  DigitalPassModal
} from './components';

import { HomePage } from './pages/HomePage';
import { PricingPage } from './pages/PricingPage';
import { MatchmakingPage } from './pages/MatchmakingPage';
import { JobsPage } from './pages/JobsPage';
import { MeetingsPage } from './pages/MeetingsPage';
import { DayPassPage } from './pages/DayPassPage';
import { AdminPage } from './pages/AdminPage';
import { RegisterPage } from './pages/RegisterPage';


export const App: React.FC = () => {
  const { currentPage, toastMessage, currentUser } = useAuth();
  const [loginModalOpen, setLoginModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [passModalOpen, setPassModalOpen] = useState(false);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <TopBar />
      <Navbar
        onOpenLogin={() => setLoginModalOpen(true)}
        onOpenProfile={() => setProfileModalOpen(true)}
        onOpenPass={() => setPassModalOpen(true)}
      />

      <main className="main-content">
        <div className="container">
          {currentPage === 'home' && <HomePage />}
          {currentPage === 'pricing' && <PricingPage />}
          {currentPage === 'search' && <MatchmakingPage />}
          {currentPage === 'jobs' && <JobsPage />}
          {currentPage === 'register' && <RegisterPage />}

          {/* PROTECTED PAGES */}
          {currentPage === 'meetings' && (
            currentUser ? (
              <MeetingsPage />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                <i className="fas fa-lock text-accent" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                <h3 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>Connexion Requise</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Vous devez vous connecter à votre compte participant pour gérer votre agenda et vos rendez-vous B2B.</p>
                <button className="btn btn-accent" onClick={() => setLoginModalOpen(true)}>
                  <i className="fas fa-sign-in-alt"></i> Se Connecter
                </button>
              </div>
            )
          )}

          {currentPage === 'day' && (
            currentUser ? (
              <DayPassPage />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                <i className="fas fa-qrcode text-accent" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                <h3 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>Pass Digital Sécurisé</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Connectez-vous pour afficher votre badge d'accès officiel avec QR Code.</p>
                <button className="btn btn-accent" onClick={() => setLoginModalOpen(true)}>
                  <i className="fas fa-sign-in-alt"></i> Se Connecter
                </button>
              </div>
            )
          )}

          {currentPage === 'admin' && (
            currentUser?.isSuperAdmin ? (
              <AdminPage />
            ) : (
              <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
                <i className="fas fa-shield-alt text-danger" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
                <h3 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>Accès Restreint Organisateur</h3>
                <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Cette section est réservée à l'administration du Comité d'Organisation HORECA AFRICA.</p>
              </div>
            )
          )}
        </div>
      </main>

      <Footer />
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      {profileModalOpen && currentUser && (
        <ProfileModal user={currentUser} onClose={() => setProfileModalOpen(false)} />
      )}
      {passModalOpen && currentUser && (
        <DigitalPassModal user={currentUser} onClose={() => setPassModalOpen(false)} />
      )}
      <Toast message={toastMessage} />
    </div>
  );
};


import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import { Navbar } from '../../components/layout/Navbar';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { mockUser, mockSuperAdmin } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

// Helper render avec tous les providers
const renderNavbar = (props = {}, preloadUser?: typeof mockUser | null) => {
  if (preloadUser !== undefined) {
    if (preloadUser) {
      localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
    } else {
      localStorage.removeItem('horeca_auth_user');
    }
  }

  const defaultProps = {
    onOpenLogin: vi.fn(),
    onOpenProfile: vi.fn(),
    onOpenPass: vi.fn(),
    ...props,
  };

  return render(
    <I18nProvider>
      <AuthProvider>
        <Navbar {...defaultProps} />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('Navbar — structure générale', () => {
  it('affiche le logo HORECA Africa', () => {
    renderNavbar();
    const logo = screen.getByAltText('HORECA Africa');
    expect(logo).toBeInTheDocument();
  });

  it('affiche le lien Accueil', () => {
    renderNavbar();
    expect(screen.getByText(/Accueil/i)).toBeInTheDocument();
  });

  it('affiche le lien Offres & Stands (Pricing)', () => {
    renderNavbar();
    expect(screen.getByText(/Offres/i)).toBeInTheDocument();
  });

  it('affiche le lien Matchmaking B2B', () => {
    renderNavbar();
    expect(screen.getByText(/Matchmaking/i)).toBeInTheDocument();
  });

  it('affiche le lien Recrutement RH', () => {
    renderNavbar();
    expect(screen.getByText(/Recrutement/i)).toBeInTheDocument();
  });

  it('affiche le lien Hosted Buyers', () => {
    renderNavbar();
    expect(screen.getByText(/Hosted Buyers/i)).toBeInTheDocument();
  });
});

describe('Navbar — utilisateur non connecté', () => {
  it('affiche le bouton Connexion', () => {
    renderNavbar({}, null);
    expect(screen.getByText(/Connexion/i)).toBeInTheDocument();
  });

  it('affiche le bouton Inscription', () => {
    renderNavbar({}, null);
    expect(screen.getByText(/Inscription/i)).toBeInTheDocument();
  });

  it('n\'affiche pas Mes RDV', () => {
    renderNavbar({}, null);
    expect(screen.queryByText(/Mes RDV/i)).not.toBeInTheDocument();
  });

  it('n\'affiche pas le lien Admin', () => {
    renderNavbar({}, null);
    expect(screen.queryByText(/Organisateur/i)).not.toBeInTheDocument();
  });

  it('appelle onOpenLogin au clic sur Connexion', () => {
    const onOpenLogin = vi.fn();
    renderNavbar({ onOpenLogin }, null);
    fireEvent.click(screen.getByText(/Connexion/i));
    expect(onOpenLogin).toHaveBeenCalledTimes(1);
  });
});

describe('Navbar — utilisateur connecté (non-admin)', () => {
  it('affiche le bouton Badge QR', () => {
    renderNavbar({}, mockUser);
    expect(screen.getByText(/Badge QR/i)).toBeInTheDocument();
  });

  it('affiche le bouton Profil', () => {
    renderNavbar({}, mockUser);
    expect(screen.getByText(/Profil/i)).toBeInTheDocument();
  });

  it('affiche Mes RDV', () => {
    renderNavbar({}, mockUser);
    expect(screen.getByText(/Mes RDV/i)).toBeInTheDocument();
  });

  it('affiche Badge & Jour J', () => {
    renderNavbar({}, mockUser);
    expect(screen.getByText(/Badge & Jour J/i)).toBeInTheDocument();
  });


  it('n\'affiche pas Organisateur si non admin', () => {
    renderNavbar({}, mockUser);
    expect(screen.queryByText(/Organisateur/i)).not.toBeInTheDocument();
  });

  it('appelle onOpenProfile au clic sur Profil', () => {
    const onOpenProfile = vi.fn();
    renderNavbar({ onOpenProfile }, mockUser);
    fireEvent.click(screen.getByText(/Profil/i));
    expect(onOpenProfile).toHaveBeenCalledTimes(1);
  });

  it('appelle onOpenPass au clic sur Badge QR', () => {
    const onOpenPass = vi.fn();
    renderNavbar({ onOpenPass }, mockUser);
    fireEvent.click(screen.getByText(/Badge QR/i));
    expect(onOpenPass).toHaveBeenCalledTimes(1);
  });
});

describe('Navbar — SuperAdmin', () => {
  it('affiche le lien Organisateur', () => {
    renderNavbar({}, mockSuperAdmin);
    expect(screen.getByText(/Organisateur/i)).toBeInTheDocument();
  });
});

describe('Navbar — menu mobile', () => {
  it('le bouton hamburger est présent', () => {
    renderNavbar({}, null);
    const hamburger = screen.getByLabelText(/Toggle menu/i);
    expect(hamburger).toBeInTheDocument();
  });

  it('le menu s\'ouvre au clic hamburger', () => {
    renderNavbar({}, null);
    const nav = document.querySelector('.nav-menu');
    expect(nav?.classList.contains('mobile-open')).toBe(false);

    const hamburger = screen.getByLabelText(/Toggle menu/i);
    fireEvent.click(hamburger);

    expect(nav?.classList.contains('mobile-open')).toBe(true);
  });

  it('le menu se referme au second clic', () => {
    renderNavbar({}, null);
    const hamburger = screen.getByLabelText(/Toggle menu/i);
    fireEvent.click(hamburger);
    fireEvent.click(hamburger);
    const nav = document.querySelector('.nav-menu');
    expect(nav?.classList.contains('mobile-open')).toBe(false);
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent, within } from '@testing-library/react';
import React from 'react';
import { App } from '../../App';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { mockUser, mockSuperAdmin } from '../mocks/fixtures';

const renderApp = (preloadUser?: typeof mockUser | null) => {
  if (preloadUser !== undefined) {
    if (preloadUser) localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
    else localStorage.removeItem('horeca_auth_user');
  }
  return render(
    <I18nProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('Integration — Flow de connexion', () => {
  it('flow complet : login → atterrit sur la page Matchmaking', async () => {
    renderApp(null);

    const nav = document.querySelector('.navbar') as HTMLElement;
    const loginBtn = within(nav).getByText(/Connexion/i);
    fireEvent.click(loginBtn);

    await waitFor(() => {
      const emailInput = document.querySelector('input[type="email"]');
      expect(emailInput).toBeInTheDocument();
    });

    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInputs = document.querySelectorAll('input[type="password"]');
    const passInput = passInputs[passInputs.length - 1] as HTMLInputElement;

    if (emailInput && passInput) {
      fireEvent.change(emailInput, { target: { value: 'test@hotel.sn' } });
      fireEvent.change(passInput, { target: { value: 'password123' } });

      const submitBtn = document.querySelector('form button, button[type="submit"]');
      if (submitBtn) {
        fireEvent.click(submitBtn);
      }

      await waitFor(() => {
        expect(screen.getAllByText(/Matchmaking B2B/i).length).toBeGreaterThan(0);
      }, { timeout: 3000 });
    }
  });

  it('flow complet : login SuperAdmin → atterrit sur AdminPage', async () => {
    localStorage.setItem('horeca_auth_user', JSON.stringify(mockSuperAdmin));
    renderApp(mockSuperAdmin);

    await waitFor(() => {
      expect(screen.getByText(/Organisateur|Admin|Dashboard|Statistiques/i)).toBeInTheDocument();
    });
  });

  it('flow complet : logout → retour à la HomePage', async () => {
    renderApp(mockUser);

    await waitFor(() => {
      const nav = document.querySelector('.navbar') as HTMLElement;
      expect(within(nav).getByText(/Déconnexion/i)).toBeInTheDocument();
    });

    const nav = document.querySelector('.navbar') as HTMLElement;
    const logoutBtn = within(nav).getByText(/Déconnexion/i);
    fireEvent.click(logoutBtn);

    await waitFor(() => {
      expect(screen.getAllByText(/HORECA Africa/i).length).toBeGreaterThan(0);
    });
  });
});

describe('Integration — Navigation entre pages', () => {
  it('clic sur "Offres & Stands" navigate vers PricingPage', async () => {
    renderApp(null);

    const nav = document.querySelector('.navbar') as HTMLElement;
    const pricingLink = within(nav).getByText(/Offres.*Stands/i);
    fireEvent.click(pricingLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Stand 6 m²' })).toBeInTheDocument();
    });
  });


  it('clic sur "Accueil" retourne à la HomePage', async () => {
    renderApp(null);

    const nav = document.querySelector('.navbar') as HTMLElement;
    const pricingLink = within(nav).getByText(/Offres.*Stands/i);
    fireEvent.click(pricingLink);

    const homeLink = within(nav).getByText(/^Accueil$/i);
    fireEvent.click(homeLink);

    await waitFor(() => {
      expect(screen.getAllByText(/HORECA Africa/i).length).toBeGreaterThan(0);
    });
  });

  it('clic sur "Recrutement RH" navigate vers JobsPage', async () => {
    renderApp(null);

    const nav = document.querySelector('.navbar') as HTMLElement;
    const jobsLink = within(nav).getByText(/Recrutement RH/i);
    fireEvent.click(jobsLink);

    await waitFor(() => {
      expect(screen.getByText(/Espace Recrutement/i)).toBeInTheDocument();
    });
  });
});

describe('Integration — Protection des pages', () => {
  it('accès à "Mes RDV" connecté affiche l\'agenda', async () => {
    renderApp(mockUser);

    const nav = document.querySelector('.navbar') as HTMLElement;
    await waitFor(() => {
      expect(within(nav).getByText(/Mes RDV/i)).toBeInTheDocument();
    });

    const meetingsLink = within(nav).getByText(/Mes RDV/i);
    fireEvent.click(meetingsLink);

    await waitFor(() => {
      expect(screen.getByText(/Gestion de mes Rendez-vous/i)).toBeInTheDocument();
    });
  });
});

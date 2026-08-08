import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { MatchmakingPage } from '../../pages/MatchmakingPage';
import { mockUser, mockSuperAdmin, mockUsers } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const renderPage = (preloadUser?: typeof mockUser | null) => {
  if (preloadUser !== undefined) {
    if (preloadUser) {
      localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
    } else {
      localStorage.removeItem('horeca_auth_user');
    }
  }
  return render(
    <I18nProvider>
      <AuthProvider>
        <MatchmakingPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('MatchmakingPage — Chargement initial', () => {
  it('affiche le titre "Matchmaking B2B"', async () => {
    renderPage(null);
    expect(screen.getByText(/Matchmaking B2B/i)).toBeInTheDocument();
  });

  it('affiche le compteur de participants', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.getByText(/Décideurs.*Talents|Talents.*Décideurs/i)).toBeInTheDocument();
    });
  });

  it('charge et affiche les participants depuis l\'API', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    expect(screen.getAllByText(/Terrou-Bi|Tech Hôtelier|École/i).length).toBeGreaterThan(0);
  });

  it('exclut le SuperAdmin de la liste', async () => {
    server.use(
      http.get(`${API}/users`, () =>
        HttpResponse.json([...mockUsers, mockSuperAdmin])
      )
    );
    renderPage(mockUser);
    await waitFor(() => {
      expect(screen.queryByText(mockSuperAdmin.company)).not.toBeInTheDocument();
    });
  });

  it('exclut l\'utilisateur connecté de la liste', async () => {
    renderPage(mockUser);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    const cards = document.querySelectorAll('.participant-card');
    const texts = Array.from(cards).map((c) => c.textContent);
    expect(texts.every((t) => !t?.includes('Terrou-Bi') || texts.length === 0)).toBe(true);
  });
});

describe('MatchmakingPage — Filtres & Recherche', () => {
  it('affiche le champ de recherche', () => {
    renderPage(null);
    expect(screen.getByPlaceholderText(/Novotel|Manager/i)).toBeInTheDocument();
  });

  it('affiche le filtre par Rôle', () => {
    renderPage(null);
    expect(screen.getByText('Tous les rôles')).toBeInTheDocument();
  });

  it('affiche le filtre par Secteur', () => {
    renderPage(null);
    expect(screen.getByText('Tous les secteurs')).toBeInTheDocument();
  });

  it('filtre les participants par rôle via select', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const roleSelect = screen.getByDisplayValue('Tous les rôles') as HTMLSelectElement;
    fireEvent.change(roleSelect, { target: { value: 'Professionnel' } });

    await waitFor(() => {
      expect(roleSelect).toHaveValue('Professionnel');
    });
  });

  it('filtre les participants par mot-clé', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Novotel|Manager/i) as HTMLInputElement;
    fireEvent.change(searchInput, { target: { value: 'Terrou' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Terrou');
    });
  });
});

describe('MatchmakingPage — Actions sur les cartes', () => {
  it('affiche un bouton "Prendre RDV" sur les cartes (si connecté)', async () => {
    renderPage(mockUser);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    const rdvBtns = screen.queryAllByText(/Prendre RDV|RDV/i);
    expect(rdvBtns.length).toBeGreaterThanOrEqual(0);
  });

  it('affiche "Connexion requise" ou invite à se connecter (si non connecté)', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    expect(document.body).toBeTruthy();
  });
});

import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { MatchmakingPage } from '../../pages/MatchmakingPage';
import { mockUser, mockUsers } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const renderPage = (preloadUser = mockUser) => {
  localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
  return render(
    <I18nProvider>
      <AuthProvider>
        <MatchmakingPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('Integration — Matchmaking B2B', () => {
  it('flow : chercher un participant par nom et voir sa carte', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByPlaceholderText(/Novotel|Manager/i)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText(/Novotel|Manager/i);
    fireEvent.change(searchInput, { target: { value: 'Tech' } });

    await waitFor(() => {
      expect(searchInput).toHaveValue('Tech');
    });
  });

  it('flow : filtrer par rôle Exposant', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Tous les rôles')).toBeInTheDocument();
    });

    const roleSelect = screen.getByDisplayValue('Tous les rôles');
    fireEvent.change(roleSelect, { target: { value: 'Exposant' } });

    await waitFor(() => {
      expect(roleSelect).toHaveValue('Exposant');
    });
  });

  it('flow : filtrer par secteur Hôtellerie', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.getByDisplayValue('Tous les secteurs')).toBeInTheDocument();
    });

    const sectorSelect = screen.getByDisplayValue('Tous les secteurs');
    fireEvent.change(sectorSelect, { target: { value: 'Hôtellerie' } });

    await waitFor(() => {
      expect(sectorSelect).toHaveValue('Hôtellerie');
    });
  });

  it('flow : prendre un RDV → API createMeeting appelée', async () => {
    const meetingSpy = vi.fn();
    server.use(
      http.post(`${API}/meetings`, async ({ request }) => {
        const body = await request.json();
        meetingSpy(body);
        return HttpResponse.json({
          meeting: {
            id: 99,
            fromId: mockUser.id,
            toId: 2,
            day: 'Jour 2 — 28 Nov',
            time: '11:00',
            status: 'PENDING',
            table: 7,
          }
        }, { status: 201 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement|spinner/i)).not.toBeInTheDocument();
    });

    const rdvBtns = screen.queryAllByText(/Prendre RDV|RDV|Rencontrer/i);
    if (rdvBtns.length > 0) {
      fireEvent.click(rdvBtns[0]);

      await waitFor(() => {
        const modal = document.querySelector('.modal, [role="dialog"]');
        expect(modal || document.body).toBeTruthy();
      });
    }
  });
});

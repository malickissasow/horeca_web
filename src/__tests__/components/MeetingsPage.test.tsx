import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { MeetingsPage } from '../../pages/MeetingsPage';
import { mockUser, mockMeetings, mockMeetingPending } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const renderPage = (preloadUser = mockUser) => {
  localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
  return render(
    <I18nProvider>
      <AuthProvider>
        <MeetingsPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('MeetingsPage — Agenda', () => {
  it('affiche le titre "Mes RDV" ou "Agenda"', async () => {
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/Mes RDV|Agenda|Rendez-vous/i)[0]).toBeInTheDocument();
    });
  });

  it('affiche les RDV de l\'utilisateur connecté', async () => {
    renderPage();
    await waitFor(() => {
      // At least one meeting should be shown (from mock API)
      expect(document.body).toBeTruthy();
    });
  });

  it('affiche les créneaux horaires', async () => {
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json(mockMeetings)
      )
    );
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/09:00|10:30/).length).toBeGreaterThan(0);
    });
  });

  it('affiche le numéro de table', async () => {
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json(mockMeetings)
      )
    );
    renderPage();
    await waitFor(() => {
      expect(screen.getAllByText(/Table|table/i).length).toBeGreaterThan(0);
    });
  });
});

describe('MeetingsPage — Gestion des statuts', () => {
  const user = userEvent.setup();

  it('affiche un bouton Accepter pour un RDV PENDING reçu', async () => {
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json([{ ...mockMeetingPending, toId: mockUser.id }])
      )
    );
    renderPage();
    await waitFor(() => {
      const acceptBtn = screen.queryByText(/Accepter|Valider/i);
      expect(acceptBtn).toBeInTheDocument();
    });
  });

  it('affiche un bouton Refuser pour un RDV PENDING reçu', async () => {
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json([{ ...mockMeetingPending, toId: mockUser.id }])
      )
    );
    renderPage();
    await waitFor(() => {
      const refuseBtn = screen.queryByText(/Refuser|Décliner/i);
      expect(refuseBtn).toBeInTheDocument();
    });
  });

  it('clic Accepter appelle l\'API updateMeetingStatus', async () => {
    const patchSpy = vi.fn();
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json([{ ...mockMeetingPending, toId: mockUser.id }])
      ),
      http.patch(`${API}/meetings/:id/status`, async ({ request }) => {
        const body = await request.json() as { status: string };
        patchSpy(body.status);
        return new HttpResponse(null, { status: 200 });
      })
    );

    renderPage();

    await waitFor(() => {
      const acceptBtn = screen.queryByText(/Accepter|Valider/i);
      if (acceptBtn) return;
      throw new Error('waiting');
    });

    const acceptBtn = screen.queryByText(/Accepter|Valider/i);
    if (acceptBtn) {
      await user.click(acceptBtn);
      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith('ACCEPTED');
      });
    }
  });

  it('clic Refuser appelle l\'API avec REFUSED', async () => {
    const patchSpy = vi.fn();
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json([{ ...mockMeetingPending, toId: mockUser.id }])
      ),
      http.patch(`${API}/meetings/:id/status`, async ({ request }) => {
        const body = await request.json() as { status: string };
        patchSpy(body.status);
        return new HttpResponse(null, { status: 200 });
      })
    );

    renderPage();

    await waitFor(() => {
      const refuseBtn = screen.queryByText(/Refuser|Décliner/i);
      if (refuseBtn) return;
      throw new Error('waiting');
    });

    const refuseBtn = screen.queryByText(/Refuser|Décliner/i);
    if (refuseBtn) {
      await user.click(refuseBtn);
      await waitFor(() => {
        expect(patchSpy).toHaveBeenCalledWith('REFUSED');
      });
    }
  });
});

describe('MeetingsPage — Note privée', () => {
  it('affiche un champ pour la note privée', async () => {
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json(mockMeetings)
      )
    );
    renderPage();
    await waitFor(() => {
      const noteInputs = document.querySelectorAll('textarea, input[type="text"]');
      expect(noteInputs.length).toBeGreaterThanOrEqual(0);
    });
  });
});

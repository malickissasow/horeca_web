import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { Toast } from '../../components/ui/Toast';
import { JobsPage } from '../../pages/JobsPage';
import { mockStudent, mockJobs } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const ToastWrapper = () => {
  const { toastMessage } = useAuth();
  return <Toast message={toastMessage} />;
};

const renderPage = (preloadUser = mockStudent) => {
  localStorage.setItem('horeca_auth_user', JSON.stringify(preloadUser));
  return render(
    <I18nProvider>
      <AuthProvider>
        <ToastWrapper />
        <JobsPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('Integration — Job Dating Flow', () => {
  it('flow étudiant : voir les candidats et basculer sur les offres d\'emploi', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    expect(screen.getByText(/Ibrahima Sow/i)).toBeInTheDocument();

    const jobsTabBtn = screen.getByText(/Offres d'Emploi & Stages/i);
    fireEvent.click(jobsTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Chef de rang expérimenté/i)).toBeInTheDocument();
    });
  });

  it('flow étudiant : voir les détails des offres (CDI, Stage)', async () => {
    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTabBtn = screen.getByText(/Offres d'Emploi & Stages/i);
    fireEvent.click(jobsTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Stage en réception hôtelière/i)).toBeInTheDocument();
      expect(screen.getByText('CDI')).toBeInTheDocument();
      expect(screen.getByText('Stage')).toBeInTheDocument();
    });
  });

  it('flow étudiant : postuler à une offre → API appelée avec succès', async () => {
    const applySpy = vi.fn();
    server.use(
      http.post(`${API}/jobs/apply`, async ({ request }) => {
        const body = await request.json();
        applySpy(body);
        return HttpResponse.json({ success: true }, { status: 201 });
      })
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTabBtn = screen.getByText(/Offres d'Emploi & Stages/i);
    fireEvent.click(jobsTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Chef de rang expérimenté/i)).toBeInTheDocument();
    });

    const postulerBtns = screen.queryAllByText(/Postuler/i);
    expect(postulerBtns.length).toBeGreaterThan(0);

    fireEvent.click(postulerBtns[0]);

    await waitFor(() => {
      expect(applySpy).toHaveBeenCalled();
    });
  });

  it('flow étudiant : erreur candidature dupliquée affiche un toast', async () => {
    server.use(
      http.post(`${API}/jobs/apply`, () =>
        HttpResponse.json({ error: 'Candidature déjà envoyée' }, { status: 409 })
      )
    );

    renderPage();

    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTabBtn = screen.getByText(/Offres d'Emploi & Stages/i);
    fireEvent.click(jobsTabBtn);

    await waitFor(() => {
      expect(screen.getByText(/Chef de rang expérimenté/i)).toBeInTheDocument();
    });

    const postulerBtns = screen.queryAllByText(/Postuler/i);
    expect(postulerBtns.length).toBeGreaterThan(0);

    fireEvent.click(postulerBtns[0]);

    await waitFor(() => {
      expect(screen.getByText(/déjà envoyée|erreur/i)).toBeInTheDocument();
    });
  });
});

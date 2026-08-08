import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { Toast } from '../../components/ui/Toast';
import { JobsPage } from '../../pages/JobsPage';
import { mockUser, mockExposant, mockStudent, mockJobs } from '../mocks/fixtures';

const API = 'http://localhost:5000/api';

const ToastWrapper = () => {
  const { toastMessage } = useAuth();
  return <Toast message={toastMessage} />;
};

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
        <ToastWrapper />
        <JobsPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('JobsPage — Chargement des candidats et offres', () => {
  it('affiche le titre de la page Recrutement/Jobs', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.getByText(/Recrutement & Talents/i)).toBeInTheDocument();
    });
  });

  it('charge et affiche les candidats par défaut', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });
    expect(screen.getByText(/Ibrahima Sow/i)).toBeInTheDocument();
  });

  it('affiche les offres au clic sur l\'onglet Offres', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTab = screen.getByRole('button', { name: /Offres d'Emploi/i });
    fireEvent.click(jobsTab);

    await waitFor(() => {
      expect(screen.getByText(/Chef de rang expérimenté/i)).toBeInTheDocument();
    });
  });
});

describe('JobsPage — Types de contrat', () => {
  it('affiche les badges CDI et Stage sur les offres', async () => {
    renderPage(null);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTabBtn = screen.getByRole('button', { name: /Offres d'Emploi/i });
    fireEvent.click(jobsTabBtn);

    await waitFor(() => {
      expect(screen.getByText('CDI')).toBeInTheDocument();
      expect(screen.getByText('Stage')).toBeInTheDocument();
    });
  });
});

describe('JobsPage — Exposant connecté : création d\'offre', () => {
  it('affiche un bouton "Publier une Offre" pour un Exposant', async () => {
    renderPage(mockExposant);
    await waitFor(() => {
      expect(screen.getByText(/Publier une Offre/i)).toBeInTheDocument();
    });
  });
});

describe('JobsPage — Étudiant connecté : postuler', () => {
  it('affiche un bouton "Postuler" pour l\'étudiant sur l\'onglet offres', async () => {
    renderPage(mockStudent);
    await waitFor(() => {
      expect(screen.queryByText(/Chargement/i)).not.toBeInTheDocument();
    });

    const jobsTab = screen.getByRole('button', { name: /Offres d'Emploi/i });
    fireEvent.click(jobsTab);

    await waitFor(() => {
      const postulerBtns = screen.queryAllByText(/Postuler/i);
      expect(postulerBtns.length).toBeGreaterThan(0);
    });
  });
});

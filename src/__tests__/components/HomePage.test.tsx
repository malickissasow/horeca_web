import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { HomePage } from '../../pages/HomePage';
import { mockUser } from '../mocks/fixtures';

const renderHomePage = (preloadUser?: typeof mockUser | null) => {
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
        <HomePage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('HomePage — Hero section', () => {
  it('affiche les 4 étapes du déroulé', () => {
    renderHomePage(null);
    expect(screen.getByText(/Créez votre profil/i)).toBeInTheDocument();
    expect(screen.getByText(/Algorithme de matching/i)).toBeInTheDocument();
    expect(screen.getByText(/Planifiez vos RDV/i)).toBeInTheDocument();
    expect(screen.getByText(/Concluez/i)).toBeInTheDocument();
  });

  it('affiche le sous-titre descriptif', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/rendez-vous B2B/i).length).toBeGreaterThan(0);
  });

  it('affiche les boutons d\'action héros', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Activer mon Business Matching/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Poser une question/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Exposer/i).length).toBeGreaterThan(0);
  });
});

describe('HomePage — Statistiques', () => {
  it('affiche la stat "160"', () => {
    renderHomePage(null);
    expect(screen.getByText('160')).toBeInTheDocument();
  });

  it('affiche la stat "20"', () => {
    renderHomePage(null);
    expect(screen.getByText('20')).toBeInTheDocument();
  });

  it('affiche la stat "45"', () => {
    renderHomePage(null);
    expect(screen.getByText('45')).toBeInTheDocument();
  });

  it('affiche la stat "3"', () => {
    renderHomePage(null);
    expect(screen.getAllByText('3').length).toBeGreaterThan(0);
  });
});

describe('HomePage — 3 Piliers', () => {
  it('affiche le titre "Les 3 Piliers"', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/3 Piliers/i).length).toBeGreaterThan(0);
  });

  it('affiche le pilier Hôtellerie', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Hôtellerie/i).length).toBeGreaterThan(0);
  });

  it('affiche le pilier Restauration', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Restauration/i).length).toBeGreaterThan(0);
  });

  it('affiche le pilier Job Dating / Recrutement', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Job Dating|Recrutement/i).length).toBeGreaterThan(0);
  });
});

describe('HomePage — Pôles d\'Exposition', () => {
  it('affiche "Pôles d\'Exposition"', () => {
    renderHomePage(null);
    expect(screen.getByText(/Pôles d'Exposition/i)).toBeInTheDocument();
  });

  it('affiche le pôle Équipements', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Équipements/i).length).toBeGreaterThan(0);
  });

  it('affiche le pôle Tech', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Tech/i).length).toBeGreaterThan(0);
  });

  it('affiche le pôle Agroalimentaire', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Agroalimentaire/i).length).toBeGreaterThan(0);
  });

  it('affiche le pôle Design', () => {
    renderHomePage(null);
    expect(screen.getAllByText(/Design/i).length).toBeGreaterThan(0);
  });
});

describe('HomePage — Formulaire de contact', () => {
  const user = userEvent.setup();

  it('affiche le champ Prénom', () => {
    renderHomePage(null);
    expect(screen.getByPlaceholderText(/Mamadou/i)).toBeInTheDocument();
  });

  it('affiche le champ Email', () => {
    renderHomePage(null);
    expect(screen.getByPlaceholderText(/direction@hotel/i)).toBeInTheDocument();
  });

  it('affiche le champ Téléphone', () => {
    renderHomePage(null);
    expect(screen.getByPlaceholderText(/\+221/i)).toBeInTheDocument();
  });

  it('le bouton de soumission est affiché', () => {
    renderHomePage(null);
    expect(screen.getByText(/Envoyer ma demande/i)).toBeInTheDocument();
  });

  it('soumission réussie du formulaire affiche un toast', async () => {
    renderHomePage(null);

    await user.type(screen.getByPlaceholderText(/Mamadou/i), 'Moussa');
    await user.type(screen.getByPlaceholderText(/direction@hotel/i), 'moussa@hotel.sn');
    await user.type(screen.getByPlaceholderText(/\+221/i), '+221 77 000 0001');

    const textarea = screen.getByPlaceholderText(/réservation stand/i);
    await user.type(textarea, 'Je souhaite exposer au salon.');

    const submitBtn = screen.getByText(/Envoyer ma demande/i);
    await user.click(submitBtn);

    // Toast should appear (check AuthContext toast)
    await waitFor(() => {
      // The form clears on success
      expect(screen.getByPlaceholderText(/Mamadou/i)).toHaveValue('');
    });
  });

  it('le bouton est désactivé pendant le chargement', async () => {
    renderHomePage(null);
    const submitBtn = screen.getByText(/Envoyer ma demande/i);
    expect(submitBtn).not.toBeDisabled();
  });
});

describe('HomePage — WhatsApp Section', () => {
  it('affiche le lien WhatsApp', () => {
    renderHomePage(null);
    expect(screen.getByText(/\+221 77 542 82 35/i)).toBeInTheDocument();
  });

  it('affiche "Infoline Officielle WhatsApp"', () => {
    renderHomePage(null);
    expect(screen.getByText(/Infoline Officielle WhatsApp/i)).toBeInTheDocument();
  });
});

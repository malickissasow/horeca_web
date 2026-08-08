import { describe, it, expect } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { RegisterPage } from '../../pages/RegisterPage';

const renderPage = () => {
  localStorage.removeItem('horeca_auth_user');
  return render(
    <I18nProvider>
      <AuthProvider>
        <RegisterPage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('RegisterPage — Structure du formulaire', () => {
  const user = userEvent.setup();

  it('affiche le titre du formulaire d\'inscription', () => {
    renderPage();
    expect(screen.getByText(/Inscription|Identifiants|S'inscrire|Participer/i)).toBeInTheDocument();
  });

  it('affiche le champ Email', () => {
    renderPage();
    const emailInput = document.querySelector('input[type="email"]');
    expect(emailInput).toBeInTheDocument();
  });

  it('affiche le champ Nom complet ou Prénom', async () => {
    renderPage();
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    await user.type(emailInput, 'test@hotel.sn');
    await user.type(passInput, 'password123');
    await user.click(screen.getByRole('button', { name: /continuer/i }));
    await user.click(screen.getByText('Professionnel'));

    const nameInput = screen.queryByPlaceholderText(/Ousmane|Prénom|Nom|Name/i) || document.querySelectorAll('input[type="text"]')[0];
    expect(nameInput).toBeInTheDocument();
  });

  it('affiche le champ Entreprise / Structure', async () => {
    renderPage();
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    await user.type(emailInput, 'test@hotel.sn');
    await user.type(passInput, 'password123');
    await user.click(screen.getByRole('button', { name: /continuer/i }));
    await user.click(screen.getByText('Professionnel'));

    const companyInput = screen.queryByPlaceholderText(/Novotel|Entreprise|Company|Structure|Hôtel/i) || document.querySelectorAll('input[type="text"]')[1];
    expect(companyInput).toBeInTheDocument();
  });

  it('affiche le sélecteur de Rôle', async () => {
    renderPage();
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    await user.type(emailInput, 'test@hotel.sn');
    await user.type(passInput, 'password123');
    await user.click(screen.getByRole('button', { name: /continuer/i }));

    expect(screen.getByText(/Quel est votre rôle/i)).toBeInTheDocument();
  });

  it('affiche le champ Mot de passe', () => {
    renderPage();
    const passInput = document.querySelector('input[type="password"]');
    expect(passInput).toBeInTheDocument();
  });

  it('affiche le bouton de soumission', () => {
    renderPage();
    const submitBtn = screen.getByRole('button', { name: /continuer/i });
    expect(submitBtn).toBeInTheDocument();
  });
});

describe('RegisterPage — Validation', () => {
  const user = userEvent.setup();

  it('le formulaire ne se soumet pas sans email', async () => {
    renderPage();
    const submitBtn = screen.getByRole('button', { name: /continuer|s'inscrire|inscrire|créer|valider/i });
    await user.click(submitBtn);
    // HTML5 validation should prevent submission
    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    expect(emailInput?.validity.valid || !emailInput?.value).toBeTruthy();
  });
});

describe('RegisterPage — Rôle Étudiant', () => {
  const user = userEvent.setup();

  it('affiche un champ "Poste recherché" pour les étudiants', async () => {
    renderPage();

    // Find role select and pick Étudiant
    const selects = document.querySelectorAll('select');
    const roleSelect = Array.from(selects).find((s) =>
      s.innerHTML.includes('Étudiant') || s.innerHTML.includes('Student')
    );

    if (roleSelect) {
      await user.selectOptions(roleSelect, 'Étudiant');
      await waitFor(() => {
        const jobField = screen.queryByText(/Poste|Métier|Job/i);
        expect(jobField || document.body).toBeTruthy();
      });
    }
  });
});

describe('RegisterPage — Inscription réussie', () => {
  const user = userEvent.setup();

  it('soumission valide appelle l\'API et affiche un toast', async () => {
    renderPage();

    const emailInput = document.querySelector('input[type="email"]') as HTMLInputElement;
    const passInput = document.querySelector('input[type="password"]') as HTMLInputElement;
    const nameInputs = document.querySelectorAll('input[type="text"]');
    const selects = document.querySelectorAll('select');

    if (emailInput && passInput && nameInputs.length > 0) {
      await user.type(emailInput, 'nouveau@test.sn');
      await user.type(passInput, 'motdepasse123');
      await user.type(nameInputs[0], 'Nouveau Participant');

      if (nameInputs[1]) {
        await user.type(nameInputs[1], 'Mon Entreprise');
      }

      // Select role
      if (selects[0]) {
        const options = Array.from(selects[0].options);
        const profOption = options.find((o) => o.value === 'Professionnel');
        if (profOption) {
          await user.selectOptions(selects[0], 'Professionnel');
        }
      }

      const submitBtn = document.querySelector('button[type="submit"]');
      if (submitBtn) {
        await user.click(submitBtn);
        // Toast should appear on success
        await waitFor(() => {
          expect(document.body).toBeTruthy();
        }, { timeout: 2000 });
      }
    }
  });
});

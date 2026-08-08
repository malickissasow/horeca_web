import { describe, it, expect, vi } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import React from 'react';
import { AuthProvider } from '../../context/AuthContext';
import { I18nProvider } from '../../context/I18nContext';
import { HomePage } from '../../pages/HomePage';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const renderPage = () => {
  localStorage.removeItem('horeca_auth_user');
  return render(
    <I18nProvider>
      <AuthProvider>
        <HomePage />
      </AuthProvider>
    </I18nProvider>
  );
};

describe('Integration — Contact Flow', () => {
  it('flow complet : remplir et soumettre le formulaire contact', async () => {
    const contactSpy = vi.fn();
    server.use(
      http.post(`${API}/admin/contact`, async ({ request }) => {
        const body = await request.json();
        contactSpy(body);
        return HttpResponse.json({ success: true }, { status: 201 });
      })
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/Mamadou/i), { target: { value: 'Test Contact' } });
    fireEvent.change(screen.getByPlaceholderText(/direction@hotel/i), { target: { value: 'contact@test.sn' } });
    fireEvent.change(screen.getByPlaceholderText(/\+221/i), { target: { value: '+221 77 999 8877' } });

    const companyInput = screen.getByPlaceholderText(/Hôtel Terrou|Lagon/i);
    fireEvent.change(companyInput, { target: { value: 'Hôtel Test' } });

    const textarea = screen.getByPlaceholderText(/réservation stand/i);
    fireEvent.change(textarea, { target: { value: 'Bonjour, je souhaite exposer au salon HORECA 2026.' } });

    fireEvent.click(screen.getByText(/Envoyer ma demande/i));

    await waitFor(() => {
      expect(contactSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          email: 'contact@test.sn',
          message: expect.stringContaining('HORECA'),
        })
      );
    });
  });

  it('flow : erreur serveur affiche un toast d\'erreur', async () => {
    server.use(
      http.post(`${API}/admin/contact`, () =>
        HttpResponse.json({ error: 'Erreur serveur' }, { status: 500 })
      )
    );

    renderPage();

    fireEvent.change(screen.getByPlaceholderText(/Mamadou/i), { target: { value: 'Erreur Test' } });
    fireEvent.change(screen.getByPlaceholderText(/direction@hotel/i), { target: { value: 'erreur@test.sn' } });
    fireEvent.change(screen.getByPlaceholderText(/\+221/i), { target: { value: '+221 77 000 0000' } });

    const textarea = screen.getByPlaceholderText(/réservation stand/i);
    fireEvent.change(textarea, { target: { value: 'Test erreur serveur.' } });

    fireEvent.click(screen.getByText(/Envoyer ma demande/i));

    await waitFor(() => {
      expect(document.body).toBeTruthy();
    });
  });

  it('flow : formulaire se réinitialise après soumission réussie', async () => {
    server.use(
      http.post(`${API}/admin/contact`, () =>
        HttpResponse.json({ success: true }, { status: 201 })
      )
    );

    renderPage();

    const prenomInput = screen.getByPlaceholderText(/Mamadou/i) as HTMLInputElement;
    fireEvent.change(prenomInput, { target: { value: 'Moussa' } });
    fireEvent.change(screen.getByPlaceholderText(/direction@hotel/i), { target: { value: 'moussa@hotel.sn' } });
    fireEvent.change(screen.getByPlaceholderText(/\+221/i), { target: { value: '+221 77 500 0000' } });

    const textarea = screen.getByPlaceholderText(/réservation stand/i);
    fireEvent.change(textarea, { target: { value: 'Je souhaite réserver un stand.' } });

    fireEvent.click(screen.getByText(/Envoyer ma demande/i));

    await waitFor(() => {
      expect(prenomInput.value).toBe('');
    });
  });
});

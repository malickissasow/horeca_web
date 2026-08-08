import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import React from 'react';
import { AuthProvider, useAuth } from '../../context/AuthContext';
import { mockUser, mockSuperAdmin, mockMeetings } from '../mocks/fixtures';
import { http, HttpResponse } from 'msw';
import { server } from '../mocks/server';

const API = 'http://localhost:5000/api';

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <AuthProvider>{children}</AuthProvider>
);

describe('AuthContext — état initial', () => {
  it('currentUser est null si localStorage vide', () => {
    localStorage.clear();
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentUser).toBeNull();
  });

  it('currentPage est "home" par défaut', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentPage).toBe('home');
  });

  it('pendingCount est 0 par défaut', () => {
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.pendingCount).toBe(0);
  });

  it('hydrate currentUser depuis localStorage', () => {
    localStorage.setItem('horeca_auth_user', JSON.stringify(mockUser));
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.currentUser?.id).toBe(mockUser.id);
    localStorage.clear();
  });
});

describe('AuthContext — login()', () => {
  beforeEach(() => localStorage.clear());

  it('login réussi → setCurrentUser + toast + page search', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@hotel.sn', 'password123');
    });

    expect(result.current.currentUser?.id).toBe(mockUser.id);
    expect(result.current.currentPage).toBe('search');
    expect(result.current.toastMessage).toContain('Bienvenue');
  });

  it('login SuperAdmin → redirect vers admin', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('admin@horecafrica.com', 'anything');
    });

    expect(result.current.currentUser?.isSuperAdmin).toBe(true);
    expect(result.current.currentPage).toBe('admin');
  });

  it('login échoué → toast erreur + throw', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    let errorThrown = false;
    await act(async () => {
      try {
        await result.current.login('bad@email.com', 'wrongpass');
      } catch (err) {
        errorThrown = true;
      }
    });

    expect(errorThrown).toBe(true);
    expect(result.current.currentUser).toBeNull();
    expect(result.current.toastMessage).toMatch(/incorrect|erreur/i);
  });




  it('login sauvegarde dans localStorage', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.login('test@hotel.sn', 'password123');
    });

    const saved = JSON.parse(localStorage.getItem('horeca_auth_user') || 'null');
    expect(saved?.id).toBe(mockUser.id);
  });
});

describe('AuthContext — switchDemoRole()', () => {
  beforeEach(() => localStorage.clear());

  it('bascule vers un rôle démo admin', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.switchDemoRole('admin');
    });

    expect(result.current.currentUser?.isSuperAdmin).toBe(true);
    expect(result.current.currentPage).toBe('admin');
  });

  it('ne fait rien si la clé est vide', async () => {
    localStorage.clear();
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.switchDemoRole('');
    });

    expect(result.current.currentUser).toBeNull();
  });


  it('affiche un toast erreur si clé invalide', async () => {
    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.switchDemoRole('invalid-key');
    });

    expect(result.current.toastMessage).toBeTruthy();
  });
});

describe('AuthContext — pendingCount', () => {
  it('pendingCount calculé depuis les meetings PENDING', async () => {
    // Override to return meetings with 1 PENDING for user id=1
    server.use(
      http.get(`${API}/meetings/user/:userId`, () =>
        HttpResponse.json([
          { ...mockMeetings[0], toId: 1, status: 'PENDING' },
          { ...mockMeetings[1], toId: 1, status: 'ACCEPTED' },
        ])
      )
    );

    localStorage.setItem('horeca_auth_user', JSON.stringify(mockUser));
    const { result } = renderHook(() => useAuth(), { wrapper });

    // Wait for effect to run
    await act(async () => {
      await result.current.refreshPendingCount();
    });

    expect(result.current.pendingCount).toBe(1);
    localStorage.clear();
  });

  it('pendingCount = 0 quand non connecté', () => {
    localStorage.clear();
    const { result } = renderHook(() => useAuth(), { wrapper });
    expect(result.current.pendingCount).toBe(0);
  });
});

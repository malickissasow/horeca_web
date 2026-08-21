import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { User } from '../types';
import { apiService } from '../services/api';

const env = (import.meta as any).env || {};
const isLocal = typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
const SOCKET_URL = (env.VITE_SOCKET_URL as string) || (isLocal || env.DEV || env.MODE === 'test' ? 'http://localhost:5000' : 'https://api.horecafrica.org');

interface AuthContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
  switchDemoRole: (key: string) => Promise<void>;
  toastMessage: string | null;
  showToast: (msg: string) => void;
  currentPage: string;
  setCurrentPage: (page: string) => void;
  pendingCount: number;
  refreshPendingCount: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const search = window.location.search;
      if (search.includes('login=1') || search.includes('email=')) {
        localStorage.removeItem('horeca_auth_user');
        return null;
      }
      const saved = localStorage.getItem('horeca_auth_user');
      return saved ? JSON.parse(saved) : null;
    } catch (e) {
      return null;
    }
  });

  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pendingCount, setPendingCount] = useState<number>(0);

  const refreshPendingCount = async () => {
    if (!currentUser) {
      setPendingCount(0);
      return;
    }
    try {
      const meetings = await apiService.getMeetings(currentUser.id);
      const count = meetings.filter(m => m.toId === currentUser.id && m.status === 'PENDING').length;
      setPendingCount(count);
    } catch (e) {
      // silent
    }
  };

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('horeca_auth_user', JSON.stringify(currentUser));
      refreshPendingCount();

      // Initialize Socket.io Connection with autoConnect control and error silencing
      let socket: Socket | null = null;
      try {
        socket = io(SOCKET_URL, {
          autoConnect: true,
          reconnectionAttempts: 3,
          timeout: 5000,
          transports: ['polling'],
          upgrade: false
        });
        socket.on('connect_error', () => {
          // Quietly ignore WebSocket/polling connection errors if server is HTTP only
        });
        socket.emit('join_user_room', currentUser.id);

        socket.on('meeting_created', (data: { fromCompany: string; day: string; time: string }) => {
          showToast(`🔔 Nouveau RDV B2B de ${data.fromCompany} (${data.day} à ${data.time}) !`);
          refreshPendingCount();
        });

        socket.on('meeting_status_changed', (data: { status: string }) => {
          const label = data.status === 'ACCEPTED' ? 'accepté ✅' : 'décliné ❌';
          showToast(`⚡ Statut rendez-vous mis à jour : ${label}`);
          refreshPendingCount();
        });
      } catch (e) {
        // Socket connection silent fallback
      }

      return () => {
        if (socket) socket.disconnect();
      };
    } else {
      localStorage.removeItem('horeca_auth_user');
      setPendingCount(0);
    }
  }, [currentUser]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const login = async (email: string, pass: string) => {
    try {
      const user = await apiService.login(email, pass);
      setCurrentUser(user);
      showToast(`Bienvenue sur HORECA AFRICA, ${user.company || user.name} !`);
      setCurrentPage(user.isSuperAdmin ? 'admin' : 'search');
    } catch (err: any) {
      showToast(err.message || 'Erreur de connexion');
      throw err;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    showToast('Vous êtes déconnecté.');
    setCurrentPage('home');
  };

  const switchDemoRole = async (key: string) => {
    if (!key) return;
    try {
      const demoUser = await apiService.getDemoUser(key);
      setCurrentUser(demoUser);
      showToast(`Basculement : ${demoUser.company || demoUser.name}`);
      setCurrentPage(demoUser.isSuperAdmin ? 'admin' : 'search');
    } catch (err: any) {
      showToast(err.message || 'Erreur démo role');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        setCurrentUser,
        login,
        logout,
        switchDemoRole,
        toastMessage,
        showToast,
        currentPage,
        setCurrentPage,
        pendingCount,
        refreshPendingCount
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({ isOpen, onClose }) => {
  const { login, showToast, setCurrentPage } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      onClose();
    } catch (err: any) {
      if (err.message && err.message.includes("n'existe pas encore")) {
        setTimeout(() => {
          onClose();
          setCurrentPage('register');
        }, 1000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.4rem' }}>
            <i className="fas fa-lock text-accent"></i> Connexion Espace Pro
          </h3>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        {/* QUICK TEST ACCOUNTS AUTO-FILL */}
        <div style={{ background: 'var(--gray-100)', padding: '12px', borderRadius: 'var(--radius-md)', marginBottom: '16px', border: '1px dashed var(--accent)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
            ⚡ <span>Comptes de Test (Cliquer pour pré-remplir) :</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '6px' }}>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem', padding: '5px', textAlign: 'left', background: 'white' }}
              onClick={() => { setEmail('admin@horecafrica.com'); setPassword('admin123'); }}
            >
              👑 <strong>SuperAdmin</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem', padding: '5px', textAlign: 'left', background: 'white' }}
              onClick={() => { setEmail('novotel@dakar.com'); setPassword('demo123'); }}
            >
              🏢 <strong>Novotel Dakar</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem', padding: '5px', textAlign: 'left', background: 'white' }}
              onClick={() => { setEmail('odyssee@restaurant.sn'); setPassword('demo123'); }}
            >
              🍽️ <strong>Resto Odyssée</strong>
            </button>
            <button
              type="button"
              className="btn btn-sm btn-outline"
              style={{ fontSize: '0.75rem', padding: '5px', textAlign: 'left', background: 'white' }}
              onClick={() => { setEmail('aissatou@etudiant.sn'); setPassword('demo123'); }}
            >
              🎓 <strong>Candidat CV</strong>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Adresse Email Professionnelle *</label>
            <input
              type="email"
              className="form-control"
              required
              placeholder="ex: direction@novotel.sn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Mot de passe *</label>
            <input
              type="password"
              className="form-control"
              required
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
            <i className="fas fa-sign-in-alt"></i> {loading ? 'Connexion en cours...' : 'Connexion'}
          </button>

          <div style={{ textAlign: 'center', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--gray-200)' }}>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>Vous n'avez pas encore de compte ?</p>
            <button
              type="button"
              className="btn btn-outline btn-sm"
              style={{ marginTop: '8px', width: '100%', borderColor: 'var(--primary)', color: 'var(--primary)', fontWeight: 700 }}
              onClick={() => {
                onClose();
                setCurrentPage('register');
              }}
            >
              <i className="fas fa-user-plus"></i> Créer un compte maintenant
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

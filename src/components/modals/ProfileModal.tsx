import React, { useState } from 'react';
import { User, UserSector } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

interface ProfileModalProps {
  user: User;
  onClose: () => void;
}

const ALL_SECTORS: UserSector[] = [
  'Hôtellerie', 'Restauration', 'Institutions', 'DMC', 'Agences de voyages', 'Équipementiers', 'Banques', 'Autre'
];

export const ProfileModal: React.FC<ProfileModalProps> = ({ user, onClose }) => {
  const { setCurrentUser, showToast } = useAuth();
  const [name, setName] = useState(user.name);
  const [company, setCompany] = useState(user.company);
  const [sector, setSector] = useState<UserSector>(user.sector);
  const [phone, setPhone] = useState(user.phone || '');
  const [studentJob, setStudentJob] = useState(user.studentJob || '');
  const [looking, setLooking] = useState<string[]>(user.looking || []);
  const [newPass, setNewPass] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleSector = (sec: string) => {
    if (looking.includes(sec)) {
      setLooking(looking.filter(s => s !== sec));
    } else {
      setLooking([...looking, sec]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updatedUser = await apiService.updateProfile(user.id, {
        name,
        company,
        sector,
        phone,
        studentJob: user.role === 'Étudiant' ? studentJob : undefined,
        looking,
        pass: newPass || undefined
      });
      setCurrentUser(updatedUser);
      showToast('Profil mis à jour avec succès !');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            <i className="fas fa-user-gear text-accent"></i> Mon Profil Participant
          </h3>
          <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Nom complet *</label>
              <input
                type="text"
                className="form-control"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Entreprise / Établissement *</label>
              <input
                type="text"
                className="form-control"
                required
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Secteur d'activité</label>
              <select
                className="form-control"
                value={sector}
                onChange={(e) => setSector(e.target.value as UserSector)}
              >
                {ALL_SECTORS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Téléphone / WhatsApp</label>
              <input
                type="tel"
                className="form-control"
                placeholder="+221 77 ..."
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
          </div>

          {user.role === 'Étudiant' && (
            <div className="form-group">
              <label className="form-label">Poste recherché / Titre étudiant</label>
              <input
                type="text"
                className="form-control"
                placeholder="ex: Assistant Manager Restauration"
                value={studentJob}
                onChange={(e) => setStudentJob(e.target.value)}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Partenaires / Secteurs recherchés pour Matchmaking B2B</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
              {ALL_SECTORS.map(sec => {
                const active = looking.includes(sec);
                return (
                  <button
                    key={sec}
                    type="button"
                    className={`badge ${active ? 'badge-accent' : 'badge-sector'}`}
                    style={{ cursor: 'pointer', border: '1px solid var(--gray-300)', padding: '6px 12px' }}
                    onClick={() => toggleSector(sec)}
                  >
                    {active ? '✓ ' : '+ '}{sec}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Nouveau mot de passe (laisser vide pour conserver)</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              value={newPass}
              onChange={(e) => setNewPass(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '24px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Enregistrement...' : 'Enregistrer les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

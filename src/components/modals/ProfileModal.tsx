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
  const [uploadingCv, setUploadingCv] = useState(false);

  const toggleSector = (sec: string) => {
    if (looking.includes(sec)) {
      setLooking(looking.filter(s => s !== sec));
    } else {
      setLooking([...looking, sec]);
    }
  };

  const handleCvUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
    const isValid = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      showToast('❌ Formats autorisés : PDF, Word (DOC/DOCX), Images (PNG, JPG, WEBP)');
      return;
    }

    setUploadingCv(true);
    try {
      showToast('📄 Téléversement de votre fichier CV en cours...');
      const res = await apiService.uploadCv(user.id, file);
      showToast('✅ Votre CV a été mis à jour avec succès !');
      setCurrentUser({
        ...user,
        cvAttached: true,
        cvUrl: res.cvUrl
      });
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du téléversement du fichier CV');
    } finally {
      setUploadingCv(false);
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
      setCurrentUser({
        ...updatedUser,
        cvUrl: user.cvUrl || updatedUser.cvUrl,
        cvAttached: user.cvAttached || updatedUser.cvAttached
      });
      showToast('Profil mis à jour avec succès !');
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la mise à jour');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
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
            <div style={{ background: 'rgba(139,92,246,0.08)', border: '1.5px dashed var(--purple)', padding: '18px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                  <i className="fas fa-briefcase"></i> Poste recherché pour Job Dating RH
                </label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="ex: Assistant Manager Restauration / Chef de Rang"
                  value={studentJob}
                  onChange={(e) => setStudentJob(e.target.value)}
                />
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="form-label" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                  <i className="fas fa-file-upload"></i> Mon Fichier CV (Word, PDF ou Image)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                  <label className="btn btn-purple btn-sm" style={{ margin: 0, cursor: 'pointer' }}>
                    <i className="fas fa-cloud-upload-alt"></i> {uploadingCv ? 'Téléversement...' : 'Mettre à jour mon CV'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      style={{ display: 'none' }}
                      onChange={handleCvUpload}
                      disabled={uploadingCv}
                    />
                  </label>
                  <span style={{ fontSize: '0.84rem', color: user.cvUrl ? 'var(--purple)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {user.cvUrl ? `📄 CV actuellement en ligne` : 'Aucun fichier CV téléversé'}
                  </span>
                </div>
              </div>
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

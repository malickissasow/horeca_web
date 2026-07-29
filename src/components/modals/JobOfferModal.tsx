import React, { useState } from 'react';
import { User, UserSector } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface JobOfferModalProps {
  user: User;
  onClose: () => void;
  onSuccess: () => void;
}

export const JobOfferModal: React.FC<JobOfferModalProps> = ({ user, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [title, setTitle] = useState('');
  const [contractType, setContractType] = useState<'CDI' | 'CDD' | 'Stage' | 'Alternance' | 'Autre'>('CDI');
  const [location, setLocation] = useState('Dakar, Sénégal');
  const [sector, setSector] = useState<UserSector>(user.sector || 'Hôtellerie');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await apiService.createJob({
        companyId: user.id,
        title,
        contractType,
        location,
        sector,
        description,
        requirements
      });
      showToast('Offre d’emploi publiée avec succès !');
      onSuccess();
      onClose();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la publication');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
            <i className="fas fa-briefcase text-accent"></i> Publier une Offre d'Emploi / Stage
          </h3>
          <button className="btn btn-outline" style={{ padding: '4px 10px' }} onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Titre du Poste *</label>
            <input
              type="text"
              className="form-control"
              required
              placeholder="ex: Chef de Rang, Assistant Manager, Stagiaire Réception..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>

          <div className="grid-3">
            <div className="form-group">
              <label className="form-label">Type de Contrat</label>
              <select
                className="form-control"
                value={contractType}
                onChange={(e) => setContractType(e.target.value as any)}
              >
                <option value="CDI">CDI</option>
                <option value="CDD">CDD</option>
                <option value="Stage">Stage</option>
                <option value="Alternance">Alternance</option>
                <option value="Autre">Autre</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Lieu</label>
              <input
                type="text"
                className="form-control"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Secteur</label>
              <select
                className="form-control"
                value={sector}
                onChange={(e) => setSector(e.target.value as UserSector)}
              >
                <option value="Hôtellerie">Hôtellerie</option>
                <option value="Restauration">Restauration</option>
                <option value="Institutions">Institutions</option>
                <option value="DMC">DMC</option>
                <option value="Agences de voyages">Agences de voyages</option>
                <option value="Équipementiers">Équipementiers</option>
                <option value="Banques">Banques</option>
                <option value="Autre">Autre</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Description des missions *</label>
            <textarea
              className="form-control"
              rows={4}
              required
              placeholder="Précisez les responsabilités quotidiennes et le contexte de recrutement..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>

          <div className="form-group">
            <label className="form-label">Profil & Prérequis</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Diplômes recherchés, années d'expérience, langues parlées..."
              value={requirements}
              onChange={(e) => setRequirements(e.target.value)}
            ></textarea>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
            <button type="button" className="btn btn-outline" onClick={onClose}>Annuler</button>
            <button type="submit" className="btn btn-accent" disabled={loading}>
              {loading ? 'Publication...' : 'Publier l’offre'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { User } from '../../types';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface BookingModalProps {
  targetUser: User | null;
  onClose: () => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({ targetUser, onClose }) => {
  const { currentUser, showToast, setCurrentPage } = useAuth();
  const [day, setDay] = useState('Mercredi 25 nov');
  const [time, setTime] = useState('09h30');
  const [note, setNote] = useState('');
  const [loading, setLoading] = useState(false);

  if (!targetUser) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setLoading(true);
    try {
      await apiService.createMeeting({
        fromId: currentUser.id,
        toId: targetUser.id,
        day,
        time,
        note
      });
      showToast('Demande de rendez-vous transmise avec succès !');
      onClose();
      setCurrentPage('meetings');
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la réservation');
    } finally {
      setLoading(false);
    }
  };

  const isStudent = targetUser.role === 'Étudiant';

  return (
    <div className="modal-overlay active">
      <div className="modal-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem' }}>
            {isStudent ? `Proposer un Entretien à ${targetUser.name}` : `Demander un RDV avec ${targetUser.company}`}
          </h3>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Jour souhaité</label>
            <div style={{ display: 'flex', gap: '10px' }}>
              {['Mercredi 25 nov', 'Jeudi 26 nov'].map((d) => (
                <button
                  key={d}
                  type="button"
                  className={`btn btn-sm ${day === d ? 'btn-accent' : 'btn-outline'}`}
                  style={{ flex: 1 }}
                  onClick={() => setDay(d)}
                >
                  🗓️ {d}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Créneau Horaire B2B (30 min)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '8px', marginTop: '6px' }}>
              {['09h00', '09h30', '10h00', '10h30', '11h00', '14h00', '14h30', '15h00', '15h30', '16h00'].map((slot) => (
                <button
                  key={slot}
                  type="button"
                  className={`btn btn-sm ${time === slot ? 'btn-accent' : 'btn-outline'}`}
                  style={time === slot ? { fontWeight: 800 } : { fontSize: '0.8rem' }}
                  onClick={() => setTime(slot)}
                >
                  ⏰ {slot}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Message / Motivations (ou sujet de l'entretien)</label>
            <textarea
              className="form-control"
              rows={3}
              placeholder="Indiquez l'objet du rendez-vous ou vos motivations..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
            ></textarea>
          </div>

          <button type="submit" className="btn btn-accent" style={{ width: '100%' }} disabled={loading}>
            <i className="fas fa-paper-plane"></i> {loading ? 'Envoi...' : 'Transmettre la demande'}
          </button>
        </form>
      </div>
    </div>
  );
};

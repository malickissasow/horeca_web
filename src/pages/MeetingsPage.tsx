import React, { useState, useEffect } from 'react';
import { Meeting, User } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ChatModal } from '../components';

export const MeetingsPage: React.FC = () => {
  const { currentUser, showToast } = useAuth();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [loading, setLoading] = useState(true);
  const [chatTarget, setChatTarget] = useState<User | null>(null);

  const loadMeetings = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      const data = await apiService.getMeetings(currentUser.id);
      setMeetings(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMeetings();
  }, [currentUser]);

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await apiService.updateMeetingStatus(id, status);
      showToast(`Statut mis à jour : ${status}`);
      loadMeetings();
    } catch (e: any) {
      showToast(e.message || 'Erreur mise à jour');
    }
  };

  const filteredMeetings = meetings.filter((m) => {
    if (statusFilter === 'ALL') return true;
    return m.status === statusFilter;
  });

  if (!currentUser) {
    return (
      <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
        <p style={{ color: 'var(--text-muted)' }}>Veuillez vous connecter pour accéder à vos rendez-vous.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="card">
        <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
          <h3 className="card-title">
            <i className="fas fa-calendar-alt text-accent"></i> Gestion de mes Rendez-vous B2B & Entretiens RH
          </h3>
          <span className="badge badge-sector">{meetings.length} RDV dans votre agenda</span>
        </div>

        {/* STATUS FILTER BUTTONS */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px', flexWrap: 'wrap' }}>
          {['ALL', 'PENDING', 'ACCEPTED', 'REFUSED'].map((st) => (
            <button
              key={st}
              className={`btn btn-sm ${statusFilter === st ? 'btn-accent' : 'btn-outline'}`}
              onClick={() => setStatusFilter(st)}
            >
              {st === 'ALL' ? 'Tous' : st === 'PENDING' ? 'En Attente' : st === 'ACCEPTED' ? 'Acceptés' : 'Refusés'}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <i className="fas fa-spinner fa-spin text-accent" style={{ fontSize: '1.8rem' }}></i>
            <p style={{ marginTop: '10px', color: 'var(--text-muted)' }}>Chargement de l'agenda...</p>
          </div>
        ) : filteredMeetings.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
            Aucun rendez-vous ne correspond à ce filtre.
          </p>
        ) : (
          <div>
            {filteredMeetings.map((m) => {
              const isIncoming = m.toId === currentUser.id;
              const partnerId = isIncoming ? m.fromId : m.toId;
              const partnerName = isIncoming ? m.fromName : m.toName;
              const partnerCompany = isIncoming ? m.fromCompany : m.toCompany;
              const partnerRole = isIncoming ? m.fromRole : m.toRole;

              return (
                <div
                  key={m.id}
                  style={{
                    padding: '18px',
                    borderBottom: '1px solid var(--gray-200)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '15px',
                    flexWrap: 'wrap'
                  }}
                >
                  <div>
                    <h4 style={{ fontWeight: 800, color: 'var(--primary)' }}>
                      {partnerCompany} {partnerRole === 'Étudiant' ? '(Candidat RH)' : ''}
                    </h4>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      Contact: {partnerName} · {m.day} à {m.time} ·{' '}
                      <span className="badge badge-table">Table N° {m.table}</span>
                    </p>
                    {m.note && (
                      <div className="chat-msg" style={{ marginTop: '6px' }}>
                        <i className="fas fa-comment text-accent"></i> <strong>Note RDV:</strong> {m.note}
                      </div>
                    )}

                    {/* PRIVATE NOTES & RATING FOR ACCEPTED MEETINGS */}
                    {m.status === 'ACCEPTED' && (
                      <div style={{ marginTop: '10px', background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <input
                            type="text"
                            className="form-control"
                            style={{ fontSize: '0.8rem', padding: '4px 8px' }}
                            placeholder="Note privée post-RDV (ex: Prospect chaud, envoyer devis...)"
                            defaultValue={m.privateNote || ''}
                            onBlur={(e) => {
                              apiService.savePrivateNote(m.id, e.target.value, m.rating || 5);
                              showToast('Note privée enregistrée');
                            }}
                          />
                        </div>
                      </div>
                    )}
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                    {m.status === 'PENDING' && isIncoming ? (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                          className="btn btn-success btn-sm"
                          onClick={() => handleUpdateStatus(m.id, 'ACCEPTED')}
                        >
                          Accepter
                        </button>
                        <button
                          className="btn btn-outline btn-sm"
                          onClick={() => handleUpdateStatus(m.id, 'REFUSED')}
                        >
                          Refuser
                        </button>
                      </div>
                    ) : (
                      <span
                        className={`badge ${
                          m.status === 'ACCEPTED'
                            ? 'badge-success'
                            : m.status === 'REFUSED'
                            ? 'badge-role'
                            : 'badge-sector'
                        }`}
                      >
                        {m.status}
                      </span>
                    )}

                    <button
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: '0.78rem' }}
                      onClick={() => setChatTarget({
                        id: partnerId,
                        email: '',
                        name: partnerName || 'Contact',
                        company: partnerCompany || 'Entreprise',
                        role: partnerRole || 'Professionnel',
                        sector: 'Hôtellerie'
                      })}
                    >
                      <i className="fas fa-comments text-accent"></i> Chat B2B
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ChatModal targetUser={chatTarget} onClose={() => setChatTarget(null)} />
    </div>
  );
};

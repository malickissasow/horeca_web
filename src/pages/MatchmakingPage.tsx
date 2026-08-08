import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';
import { BookingModal, CvModal, ChatModal, SenegalTourismShowcase } from '../components';

export const MatchmakingPage: React.FC = () => {
  const { currentUser, showToast } = useAuth();
  const { t } = useI18n();
  const [users, setUsers] = useState<User[]>([]);
  const [searchKw, setSearchKw] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [sectorFilter, setSectorFilter] = useState('');
  const [loading, setLoading] = useState(true);

  const [bookingTarget, setBookingTarget] = useState<User | null>(null);
  const [cvTarget, setCvTarget] = useState<User | null>(null);
  const [chatTarget, setChatTarget] = useState<User | null>(null);

  const loadParticipants = async () => {
    setLoading(true);
    try {
      const data = await apiService.getUsers({
        role: roleFilter,
        sector: sectorFilter,
        search: searchKw
      });
      setUsers(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadParticipants();
  }, [roleFilter, sectorFilter, searchKw]);

  const filteredUsers = users.filter((u) => {
    if (u.isSuperAdmin) return false;
    if (currentUser && u.id === currentUser.id) return false;
    return true;
  });

  return (
    <div>
      {/* SENEGAL TOURISM & TERANGA SHOWCASE BANNER */}
      <div style={{ marginBottom: '28px' }}>
        <SenegalTourismShowcase />
      </div>

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-magic text-accent"></i> Moteur de Matchmaking B2B &amp; Intelligence HORECA
          </h3>
          <span className="badge badge-sector" id="resultsTag" style={{ fontSize: '0.85rem' }}>
            {filteredUsers.length} Décideurs &amp; Talents
          </span>
        </div>

        {/* SEARCH & FILTERS BAR */}
        <div className="grid-3" style={{ marginBottom: '10px' }}>
          <div className="form-group">
            <label className="form-label">Recherche par Entreprise, Nom ou Poste</label>
            <input
              type="text"
              className="form-control"
              placeholder="ex: Novotel, Manager, Terrou-Bi..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Filtrer par Rôle</label>
            <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Tous les rôles</option>
              <option value="Professionnel">Professionnel</option>
              <option value="Exposant">Exposant</option>
              <option value="Sponsor">Sponsor</option>
              <option value="Hosted Buyer">Hosted Buyer</option>
              <option value="Étudiant">Étudiant / Candidat RH</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Filtrer par Secteur</label>
            <select className="form-control" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option value="">Tous les secteurs</option>
              <option value="Hôtellerie">Hôtellerie</option>
              <option value="Restauration">Restauration</option>
              <option value="Institutions">Institutions</option>
              <option value="DMC">DMC &amp; Agences Receptives</option>
              <option value="Agences de voyages">Agences de voyages</option>
              <option value="Équipementiers">Équipementiers</option>
              <option value="Banques">Banques</option>
            </select>
          </div>
        </div>

        {/* QUICK SECTOR PILLS */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '12px', paddingTop: '12px', borderTop: '1px solid var(--gray-200)' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-muted)', alignSelf: 'center', marginRight: '4px' }}>
            Filtre Rapide :
          </span>
          {['', 'Hôtellerie', 'Restauration', 'Institutions', 'DMC', 'Agences de voyages', 'Équipementiers', 'Banques'].map((sec) => (
            <button
              key={sec}
              type="button"
              className={`badge ${sectorFilter === sec ? 'badge-accent' : 'badge-sector'}`}
              style={{ cursor: 'pointer', border: '1px solid var(--gray-300)', padding: '6px 12px', fontSize: '0.8rem' }}
              onClick={() => setSectorFilter(sec)}
            >
              {sec === '' ? '🌐 Tous les Secteurs' : sec}
            </button>
          ))}
        </div>
      </div>

      {/* PARTICIPANTS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-spinner fa-spin text-accent" style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Chargement des décideurs B2B...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
          <i className="fas fa-search" style={{ fontSize: '2.5rem', color: 'var(--gray-300)', marginBottom: '14px' }}></i>
          <p style={{ color: 'var(--text-muted)' }}>Aucun décideur ne correspond à vos critères de recherche.</p>
        </div>
      ) : (
        <div className="grid-3">
          {filteredUsers.map((u) => {
            const isRecommended = currentUser?.looking && currentUser.looking.includes(u.sector);
            let matchScore = 75;
            if (isRecommended) matchScore = 98;
            else if (currentUser && u.sector === currentUser.sector) matchScore = 88;
            const isStudent = u.role === 'Étudiant';

            return (
              <div key={u.id} className="participant-card" style={isRecommended ? { border: '2px solid var(--accent)', boxShadow: '0 8px 20px rgba(243, 103, 29, 0.15)' } : {}}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span className="match-score-badge">
                    <i className="fas fa-bolt"></i> Match {matchScore}%
                  </span>
                  {isRecommended && (
                    <span className="badge badge-accent" style={{ fontSize: '0.7rem' }}>
                      ★ RECOMMANDÉ
                    </span>
                  )}
                </div>
                <div>
                  <div style={{ display: 'flex', gap: '6px', marginBottom: '10px', flexWrap: 'wrap' }}>
                    <span className={`badge ${isStudent ? 'badge-student' : 'badge-role'}`}>{u.role}</span>
                    <span className="badge badge-sector">{u.sector}</span>
                  </div>

                  <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>{u.company}</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{u.name}</p>

                  {isStudent && (
                    <>
                      <div
                        style={{
                          background: 'rgba(139,92,246,0.1)',
                          color: 'var(--purple)',
                          padding: '8px 12px',
                          borderRadius: 'var(--radius-sm)',
                          fontSize: '0.8rem',
                          fontWeight: 700,
                          margin: '10px 0'
                        }}
                      >
                        🎯 Recherche : {u.studentJob || 'Stage / Emploi'}
                      </div>
                      <button
                        className="btn btn-outline btn-sm"
                        style={{ width: '100%', marginBottom: '8px', borderColor: 'var(--purple)', color: 'var(--purple)' }}
                        onClick={() => setCvTarget(u)}
                      >
                        <i className="fas fa-file-pdf"></i> Consulter le CV
                      </button>
                    </>
                  )}
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '10px' }}>
                  <button
                    className={`btn ${isStudent ? 'btn-purple' : 'btn-accent'} btn-sm`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (!currentUser) {
                        showToast('🔒 Veuillez vous connecter pour réserver un créneau B2B');
                        return;
                      }
                      setBookingTarget(u);
                    }}
                  >
                    <i className={`fas ${isStudent ? 'fa-user-clock' : 'fa-calendar-plus'}`}></i>{' '}
                    {isStudent ? 'Entretien' : 'RDV B2B'}
                  </button>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ borderColor: 'var(--primary)', color: 'var(--primary)' }}
                    onClick={() => {
                      if (!currentUser) {
                        showToast('🔒 Veuillez vous connecter pour démarrer une discussion B2B');
                        return;
                      }
                      setChatTarget(u);
                    }}
                  >
                    <i className="fas fa-comments text-accent"></i> Chat
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      <BookingModal targetUser={bookingTarget} onClose={() => setBookingTarget(null)} />
      <CvModal user={cvTarget} onClose={() => setCvTarget(null)} />
      <ChatModal targetUser={chatTarget} onClose={() => setChatTarget(null)} />
    </div>
  );
};

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

      {/* PENDING ACCOUNT ACTIVATION WARNING BANNER */}
      {currentUser && !currentUser.isSuperAdmin && currentUser.isActive === false && (
        <div style={{ background: '#fff7ed', border: '2px solid #ea580c', borderRadius: '12px', padding: '20px', marginBottom: '24px', boxShadow: '0 4px 12px rgba(234,88,12,0.1)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#ffedd5', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <i className="fas fa-clock text-accent" style={{ fontSize: '1.5rem', color: '#ea580c' }}></i>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: '0 0 4px 0', color: '#9a3412', fontWeight: 800, fontSize: '1.1rem' }}>
                ⏳ Inscription Reçue — Accès B2B & Badges en Attente de Validation
              </h4>
              <p style={{ margin: 0, color: '#c2410c', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Votre compte est bien enregistré ! Dès confirmation et validation de votre paiement par l'administration HORECA AFRICA, vos droits de réservations de Rendez-vous B2B et votre Badge QR seront automatiquement activés et notifiés par email.
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h3 className="card-title">
            <i className="fas fa-magic text-accent"></i> Moteur de Matchmaking B2B &amp; Intelligence HORECA
          </h3>
          <span className="badge badge-sector" id="resultsTag" style={{ fontSize: '0.85rem' }}>
            {filteredUsers.length} Décideurs &amp; Talents
          </span>
        </div>

        <p className="subtitle">
          Trouvez instantanément les décideurs, acheteurs de l'hôtellerie, sponsors ou candidats qualifiés grâce à nos filtres métiers.
        </p>

        {/* FILTERS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginTop: '16px' }}>
          <div className="form-group" style={{ margin: 0 }}>
            <input
              type="text"
              className="form-control"
              placeholder="🔍 Recherche entreprise ou nom..."
              value={searchKw}
              onChange={(e) => setSearchKw(e.target.value)}
            />
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select className="form-control" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">Tous les Rôles ({t('allRoles')})</option>
              <option value="Exposant">🏢 Exposants</option>
              <option value="Professionnel">💼 Professionnels / Visiteurs Pro</option>
              <option value="Hosted Buyer">👑 Hosted Buyers VIP</option>
              <option value="Sponsor">⭐ Sponsors</option>
              <option value="Étudiant">🎓 Candidats / Étudiants</option>
            </select>
          </div>

          <div className="form-group" style={{ margin: 0 }}>
            <select className="form-control" value={sectorFilter} onChange={(e) => setSectorFilter(e.target.value)}>
              <option value="">Tous les Secteurs</option>
              <option value="Hôtellerie">Hôtellerie</option>
              <option value="Restauration">Restauration</option>
              <option value="Institutions">Institutions</option>
              <option value="DMC">DMC &amp; Conciergerie</option>
              <option value="Agences de voyages">Agences de Voyages</option>
              <option value="Équipementiers">Équipementiers</option>
              <option value="Banques">Banques &amp; Finance</option>
              <option value="Autre">Autre</option>
            </select>
          </div>
        </div>
      </div>

      {/* PARTICIPANTS GRID */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-spinner fa-spin text-accent" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
          <p style={{ color: 'var(--text-muted)' }}>Chargement de l'annuaire B2B HORECA...</p>
        </div>
      ) : filteredUsers.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
          <i className="fas fa-search text-muted" style={{ fontSize: '2.5rem', marginBottom: '12px' }}></i>
          <h4>Aucun participant ne correspond à vos filtres</h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Essayez de réinitialiser la recherche ou les filtres.</p>
        </div>
      ) : (
        <div className="grid grid-3" style={{ marginTop: '24px' }}>
          {filteredUsers.map((u) => {
            const isStudent = u.role === 'Étudiant';
            const isBuyer = u.role === 'Hosted Buyer';

            return (
              <div
                key={u.id}
                className="card card-hover"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  position: 'relative',
                  borderTop: isBuyer ? '4px solid #eab308' : isStudent ? '4px solid var(--purple)' : '4px solid var(--primary)'
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        background: isBuyer ? 'rgba(234,179,8,0.15)' : isStudent ? 'rgba(139,92,246,0.15)' : 'rgba(3,52,152,0.15)',
                        color: isBuyer ? '#ca8a04' : isStudent ? 'var(--purple)' : 'var(--primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 800,
                        fontSize: '1.1rem'
                      }}
                    >
                      {u.company ? u.company.charAt(0).toUpperCase() : u.name.charAt(0).toUpperCase()}
                    </div>

                    {isBuyer && (
                      <span className="badge badge-accent" style={{ background: '#fef08a', color: '#854d0e', fontWeight: 800 }}>
                        👑 VIP Buyer
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
                </div>

                <div style={{ display: 'flex', gap: '6px', marginTop: '14px' }}>
                  <button
                    className={`btn ${isStudent ? 'btn-purple' : 'btn-accent'} btn-sm`}
                    style={{ flex: 1 }}
                    onClick={() => {
                      if (!currentUser) {
                        showToast('🔒 Veuillez vous connecter pour réserver un créneau B2B');
                        return;
                      }
                      if (!currentUser.isSuperAdmin && currentUser.isActive === false) {
                        showToast('⏳ Votre compte est en attente de confirmation du paiement. Les RDV B2B seront activés dès la validation du SuperAdmin.');
                        return;
                      }
                      setBookingTarget(u);
                    }}
                  >
                    <i className={`fas ${isStudent ? 'fa-user-clock' : 'fa-calendar-plus'}`}></i>{' '}
                    {isStudent ? 'Entretien RH' : 'Demander RDV'}
                  </button>

                  <button
                    className="btn btn-outline btn-sm"
                    title="Envoyer un message direct"
                    onClick={() => {
                      if (!currentUser) {
                        showToast('🔒 Veuillez vous connecter pour échanger des messages');
                        return;
                      }
                      if (!currentUser.isSuperAdmin && currentUser.isActive === false) {
                        showToast('⏳ Votre compte est en attente de confirmation du paiement.');
                        return;
                      }
                      setChatTarget(u);
                    }}
                  >
                    <i className="fas fa-comments text-accent"></i>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* MODALS */}
      {bookingTarget && (
        <BookingModal
          targetUser={bookingTarget}
          onClose={() => setBookingTarget(null)}
        />
      )}

      {cvTarget && <CvModal user={cvTarget} onClose={() => setCvTarget(null)} />}
      {chatTarget && (
        <ChatModal targetUser={chatTarget} onClose={() => setChatTarget(null)} />
      )}
    </div>
  );
};

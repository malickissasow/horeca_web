import React, { useState, useEffect } from 'react';
import { User, JobOffer } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { BookingModal, CvModal, JobOfferModal } from '../components';

export const JobsPage: React.FC = () => {
  const { currentUser, showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'candidates' | 'jobs'>('candidates');
  const [candidates, setCandidates] = useState<User[]>([]);
  const [jobs, setJobs] = useState<JobOffer[]>([]);
  const [loading, setLoading] = useState(true);

  const [bookingTarget, setBookingTarget] = useState<User | null>(null);
  const [cvTarget, setCvTarget] = useState<User | null>(null);
  const [showJobModal, setShowJobModal] = useState(false);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cData, jData] = await Promise.all([
        apiService.getUsers({ role: 'Étudiant' }),
        apiService.getJobs()
      ]);
      setCandidates(cData);
      setJobs(jData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleApply = async (job: JobOffer) => {
    if (!currentUser) {
      showToast('Veuillez vous connecter pour postuler');
      return;
    }
    try {
      await apiService.applyToJob(job.id, currentUser.id, 'Candidature spontanée via Salon HORECA 2026');
      showToast(`Candidature envoyée avec succès pour : ${job.title}`);
      loadData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la postulation');
    }
  };

  return (
    <div>
      {/* HERO BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #033498 100%)',
          color: 'white',
          border: 'none'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ maxWidth: '700px' }}>
            <span className="badge badge-student" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', marginBottom: '12px', display: 'inline-block' }}>
              🎓 Job Dating & CVthèque HORECA Dakar 2026
            </span>
            <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '10px' }}>
              Espace Recrutement & Talents HORECA
            </h2>
            <p style={{ fontSize: '1rem', color: 'rgba(255,255,255,0.9)' }}>
              Rencontrez les diplômés d'écoles hôtelières ou découvrez les offres d'emplois et de stages publiées par les grands établissements.
            </p>
          </div>

          {currentUser && currentUser.role !== 'Étudiant' && (
            <button className="btn btn-accent" onClick={() => setShowJobModal(true)}>
              <i className="fas fa-plus-circle"></i> Publier une Offre
            </button>
          )}
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
          <button
            className={`btn ${activeTab === 'candidates' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'candidates' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('candidates')}
          >
            <i className="fas fa-user-graduate"></i> Talents & CVs ({candidates.length})
          </button>
          <button
            className={`btn ${activeTab === 'jobs' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'jobs' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('jobs')}
          >
            <i className="fas fa-briefcase"></i> Offres d'Emploi & Stages ({jobs.length})
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-spinner fa-spin text-purple" style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Chargement des données...</p>
        </div>
      ) : activeTab === 'candidates' ? (
        candidates.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Aucun candidat disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid-3">
            {candidates.map((u) => (
              <div key={u.id} className="participant-card" style={{ borderLeft: '4px solid var(--purple)' }}>
                <span className="badge badge-student" style={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
                  CANDIDAT VALIDÉ
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--primary)' }}>{u.name}</h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {u.company} ({u.sector})
                </p>
                <div style={{ background: 'rgba(139, 92, 246, 0.08)', padding: '10px', borderRadius: 'var(--radius-sm)', margin: '12px 0' }}>
                  <strong style={{ color: 'var(--purple)', fontSize: '0.85rem' }}>Poste visé :</strong>
                  <p style={{ fontWeight: 700, fontSize: '0.9rem' }}>{u.studentJob || 'Management Restauration'}</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    className="btn btn-outline btn-sm"
                    style={{ flex: 1, borderColor: 'var(--purple)', color: 'var(--purple)' }}
                    onClick={() => setCvTarget(u)}
                  >
                    <i className="fas fa-file-pdf"></i> CV PDF
                  </button>
                  <button className="btn btn-purple btn-sm" style={{ flex: 1 }} onClick={() => setBookingTarget(u)}>
                    <i className="fas fa-comments"></i> Recruter
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '50px' }}>
            <p style={{ color: 'var(--text-muted)' }}>Aucune offre d'emploi disponible pour le moment.</p>
          </div>
        ) : (
          <div className="grid-2">
            {jobs.map((job) => (
              <div key={job.id} className="card" style={{ borderLeft: '4px solid var(--accent)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span className="badge badge-accent" style={{ fontSize: '0.75rem' }}>
                      {job.contractType}
                    </span>
                    <span className="badge badge-sector" style={{ fontSize: '0.75rem' }}>
                      📍 {job.location}
                    </span>
                  </div>
                  <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '4px' }}>
                    {job.title}
                  </h3>
                  <p style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--accent)', marginBottom: '12px' }}>
                    🏢 {job.companyName}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                    {job.description}
                  </p>
                  {job.requirements && (
                    <div style={{ background: '#f8fafc', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.8rem', color: 'var(--text-main)', marginBottom: '14px' }}>
                      <strong>Prérequis :</strong> {job.requirements}
                    </div>
                  )}
                </div>
                <button
                  className="btn btn-accent"
                  style={{ width: '100%' }}
                  onClick={() => handleApply(job)}
                >
                  <i className="fas fa-paper-plane"></i> Postuler en 1 Clic
                </button>
              </div>
            ))}
          </div>
        )
      )}

      {/* MODALS */}
      <BookingModal targetUser={bookingTarget} onClose={() => setBookingTarget(null)} />
      <CvModal user={cvTarget} onClose={() => setCvTarget(null)} />
      {showJobModal && currentUser && (
        <JobOfferModal user={currentUser} onClose={() => setShowJobModal(false)} onSuccess={loadData} />
      )}
    </div>
  );
};


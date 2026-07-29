import React, { useState, useEffect } from 'react';
import { Meeting, AdminStats, User, ContactSubmission } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'contacts' | 'scanner'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [masterMeetings, setMasterMeetings] = useState<Meeting[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');

  // SCANNER STATE
  const [scanQuery, setScanQuery] = useState('');
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, mData, uData, cData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getMasterMeetings(),
        apiService.getUsers(),
        apiService.getContacts()
      ]);
      setStats(sData);
      setMasterMeetings(mData);
      setAllUsers(uData);
      setContacts(cData);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, []);

  const handleDeleteUser = async (user: User) => {
    if (!window.confirm(`Voulez-vous vraiment supprimer l'utilisateur ${user.name} (${user.company}) ?`)) {
      return;
    }
    try {
      await apiService.deleteUser(user.id);
      showToast(`Utilisateur ${user.name} supprimé`);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la suppression');
    }
  };

  const exportCSV = (type: 'users' | 'meetings') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'users') {
      csvContent += "ID,Nom,Entreprise,Role,Secteur,Email,Telephone\n";
      allUsers.forEach(u => {
        csvContent += `"${u.id}","${u.name}","${u.company}","${u.role}","${u.sector}","${u.email}","${u.phone || ''}"\n`;
      });
    } else {
      csvContent += "ID,Demandeur,Destinataire,Jour,Heure,Table,Statut\n";
      masterMeetings.forEach(m => {
        csvContent += `"${m.id}","${m.fromCompany}","${m.toCompany}","${m.day}","${m.time}","${m.table}","${m.status}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `horeca_${type}_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast(`Export CSV ${type} téléchargé !`);
  };

  const filteredUsers = allUsers.filter(u =>
    u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.company.toLowerCase().includes(userSearch.toLowerCase()) ||
    u.email.toLowerCase().includes(userSearch.toLowerCase())
  );

  return (
    <div>
      {/* HEADER BANNER */}
      <div className="card" style={{ background: 'var(--primary-dark)', color: 'white', border: 'none' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <span className="badge" style={{ background: 'var(--danger)', color: 'white', marginBottom: '8px', display: 'inline-block' }}>
              PANNEAU SUPERADMIN
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900 }}>Supervision Organisateur HORECA 2026</h2>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-outline" style={{ color: 'white', borderColor: 'rgba(255,255,255,0.4)' }} onClick={() => exportCSV('users')}>
              <i className="fas fa-file-csv"></i> Export Users CSV
            </button>
            <button className="btn btn-accent" onClick={loadAdminData}>
              <i className="fas fa-sync-alt"></i> Actualiser Data
            </button>
          </div>
        </div>

        {/* TABS */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px', flexWrap: 'wrap' }}>
          <button
            className={`btn ${activeTab === 'stats' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'stats' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('stats')}
          >
            <i className="fas fa-chart-pie"></i> Vue d'ensemble & Stats
          </button>
          <button
            className={`btn ${activeTab === 'users' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'users' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Participants ({allUsers.length})
          </button>
          <button
            className={`btn ${activeTab === 'contacts' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'contacts' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('contacts')}
          >
            <i className="fas fa-inbox"></i> Messages ({contacts.length})
          </button>
          <button
            className={`btn ${activeTab === 'scanner' ? 'btn-accent' : 'btn-outline'}`}
            style={activeTab === 'scanner' ? {} : { color: 'white', borderColor: 'rgba(255,255,255,0.4)' }}
            onClick={() => setActiveTab('scanner')}
          >
            <i className="fas fa-qrcode"></i> 📷 Scanner & Contrôle Badges
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px' }}>
          <i className="fas fa-spinner fa-spin text-accent" style={{ fontSize: '2rem' }}></i>
          <p style={{ marginTop: '12px', color: 'var(--text-muted)' }}>Chargement du panneau administrateur...</p>
        </div>
      ) : activeTab === 'stats' ? (
        <>
          {/* ADMIN STATS */}
          <div className="grid-3">
            <div className="card" style={{ textAlign: 'center' }}>
              <i className="fas fa-users text-accent" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{stats?.totalUsers || 0}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Participants Inscrits</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <i className="fas fa-handshake text-success" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{stats?.confirmedMeetings || 0}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>RDV B2B Confirmés</p>
            </div>
            <div className="card" style={{ textAlign: 'center' }}>
              <i className="fas fa-user-graduate text-purple" style={{ fontSize: '2rem', marginBottom: '8px' }}></i>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>{stats?.totalStudents || 0}</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Candidats & Talents RH</p>
            </div>
          </div>

          {/* MASTER MEETINGS MATRIX TABLE */}
          <div className="card">
            <div className="card-header">
              <h3 className="card-title">
                <i className="fas fa-table text-accent"></i> Matrice Globale des RDV B2B & Tables
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => exportCSV('meetings')}>
                <i className="fas fa-download"></i> Export RDV CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                    <th style={{ padding: '10px' }}>Demandeur (Partie A)</th>
                    <th style={{ padding: '10px' }}>Destinataire (Partie B)</th>
                    <th style={{ padding: '10px' }}>Horaire</th>
                    <th style={{ padding: '10px' }}>Table</th>
                    <th style={{ padding: '10px' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {masterMeetings.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>{m.fromCompany || 'Inconnu'}</td>
                      <td style={{ padding: '10px' }}>{m.toCompany || 'Inconnu'}</td>
                      <td style={{ padding: '10px' }}>{m.day} {m.time}</td>
                      <td style={{ padding: '10px' }}>
                        <span className="badge badge-table" style={{ background: 'var(--accent)' }}>
                          Table {m.table}
                        </span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <span className={`badge ${m.status === 'ACCEPTED' ? 'badge-success' : 'badge-role'}`}>
                          {m.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      ) : activeTab === 'users' ? (
        <div className="card">
          <div className="card-header" style={{ flexWrap: 'wrap', gap: '10px' }}>
            <h3 className="card-title">
              <i className="fas fa-users-cog text-accent"></i> Liste et Gestion des Comptes Participants
            </h3>
            <input
              type="text"
              className="form-control"
              style={{ maxWidth: '300px' }}
              placeholder="Rechercher par nom/entreprise..."
              value={userSearch}
              onChange={(e) => setUserSearch(e.target.value)}
            />
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                  <th style={{ padding: '10px' }}>ID</th>
                  <th style={{ padding: '10px' }}>Nom</th>
                  <th style={{ padding: '10px' }}>Entreprise</th>
                  <th style={{ padding: '10px' }}>Rôle</th>
                  <th style={{ padding: '10px' }}>Secteur</th>
                  <th style={{ padding: '10px' }}>Email / Téléphone</th>
                  <th style={{ padding: '10px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => (
                  <tr key={u.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                    <td style={{ padding: '10px', fontWeight: 700 }}>#{u.id}</td>
                    <td style={{ padding: '10px' }}>{u.name}</td>
                    <td style={{ padding: '10px', fontWeight: 700 }}>{u.company}</td>
                    <td style={{ padding: '10px' }}>
                      <span className="badge badge-role">{u.role}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span className="badge badge-sector">{u.sector}</span>
                    </td>
                    <td style={{ padding: '10px', fontSize: '0.85rem' }}>
                      {u.email} <br />
                      <span style={{ color: 'var(--text-muted)' }}>{u.phone || '-'}</span>
                    </td>
                    <td style={{ padding: '10px' }}>
                      {!u.isSuperAdmin && (
                        <button
                          className="btn btn-outline btn-sm"
                          style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                          onClick={() => handleDeleteUser(u)}
                        >
                          <i className="fas fa-trash-alt"></i> Sup.
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'contacts' ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-inbox text-accent"></i> Demandes de Contact & Secrétariat HORECA
            </h3>
          </div>

          {contacts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>
              Aucun message de contact reçu pour l'instant.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {contacts.map((c) => (
                <div key={c.id} style={{ background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', borderLeft: '4px solid var(--accent)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                    <strong style={{ fontSize: '1.05rem', color: 'var(--primary)' }}>
                      {c.firstName} {c.lastName} ({c.company || 'Sans entreprise'})
                    </strong>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'Aujourd’hui'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '8px' }}>
                    📧 {c.email} {c.phone ? `· 📞 ${c.phone}` : ''}
                  </div>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-main)', background: 'white', padding: '10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--gray-200)' }}>
                    "{c.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* SCANNER TAB */
        <div className="card" style={{ maxWidth: '640px', margin: '0 auto', textAlign: 'center' }}>
          <i className="fas fa-qrcode text-accent" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>
            Scanner & Vérificateur de Badges QR Code
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Entrez ou scannez le contenu du QR Code (ex: HORECA-2026-PASS-1-novotel@dakar.com ou novotel@dakar.com) pour vérifier l'accès du participant :
          </p>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const term = scanQuery.trim().toLowerCase();
              const found = allUsers.find(
                u => term.includes(u.email.toLowerCase()) || term.includes(u.id.toString()) || u.email.toLowerCase().includes(term)
              );
              if (found) {
                setScannedUser(found);
                setScanStatus('valid');
                showToast(`✅ Badge Valide : ${found.company || found.name}`);
              } else {
                setScannedUser(null);
                setScanStatus('invalid');
                showToast('❌ Badge Inconnu ou Non Valide');
              }
            }}
            style={{ marginBottom: '24px' }}
          >
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                className="form-control"
                placeholder="Scannez ou saisissez l'ID / email du badge..."
                value={scanQuery}
                onChange={(e) => setScanQuery(e.target.value)}
              />
              <button type="submit" className="btn btn-accent">
                <i className="fas fa-search"></i> Vérifier
              </button>
            </div>
          </form>

          {/* SCANNER RESULT DISPLAY */}
          {scanStatus === 'valid' && scannedUser && (
            <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px solid var(--success)', textAlign: 'center' }}>
              <span className="badge badge-success" style={{ fontSize: '0.9rem', padding: '6px 14px', marginBottom: '12px', display: 'inline-block' }}>
                ✅ BADGE OFFICIEL VALIDE · ACCÈS AUTORISÉ
              </span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--primary)', margin: '4px 0' }}>
                {scannedUser.name}
              </h3>
              <p style={{ fontWeight: 700, color: 'var(--accent)', fontSize: '1rem', marginBottom: '10px' }}>
                🏢 {scannedUser.company} ({scannedUser.role})
              </p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                📍 Secteur : {scannedUser.sector} · 📧 {scannedUser.email}
              </div>
            </div>
          )}

          {scanStatus === 'invalid' && (
            <div style={{ background: '#fef2f2', padding: '20px', borderRadius: 'var(--radius-md)', border: '2px solid var(--danger)', textAlign: 'center' }}>
              <span className="badge" style={{ background: 'var(--danger)', color: 'white', fontSize: '0.9rem', padding: '6px 14px', marginBottom: '12px', display: 'inline-block' }}>
                ❌ BADGE NON RECONNU · ACCÈS REFUSÉ
              </span>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Aucun participant enregistré correspondant à ces données.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};


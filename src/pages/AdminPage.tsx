import React, { useState, useEffect } from 'react';
import { Meeting, AdminStats, User, ContactSubmission } from '../types';
import { apiService } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const AdminPage: React.FC = () => {
  const { showToast } = useAuth();
  const [activeTab, setActiveTab] = useState<'stats' | 'users' | 'payments' | 'contacts' | 'scanner'>('stats');
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [masterMeetings, setMasterMeetings] = useState<Meeting[]>([]);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [contacts, setContacts] = useState<ContactSubmission[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [userSearch, setUserSearch] = useState('');
  const [verifyingOrderId, setVerifyingOrderId] = useState<number | null>(null);

  // SCANNER STATE
  const [scanQuery, setScanQuery] = useState('');
  const [scannedUser, setScannedUser] = useState<User | null>(null);
  const [scanStatus, setScanStatus] = useState<'idle' | 'valid' | 'invalid'>('idle');

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [sData, mData, uData, cData, oData] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getMasterMeetings(),
        apiService.getUsers(),
        apiService.getContacts(),
        apiService.getOrders().catch(() => [])
      ]);
      setStats(sData);
      setMasterMeetings(mData);
      setAllUsers(uData);
      setContacts(cData);
      setOrders(oData || []);
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

  const handleToggleUserActive = async (user: User) => {
    try {
      const res = await apiService.toggleUserActive(user.id);
      showToast(res.message);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Erreur modification statut utilisateur');
    }
  };

  const handleVerifyPayment = async (orderId: number, action: 'APPROVE' | 'REJECT') => {
    setVerifyingOrderId(orderId);
    try {
      const res = await apiService.verifyManualPayment(orderId, action);
      showToast(res.message);
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la validation du paiement');
    } finally {
      setVerifyingOrderId(null);
    }
  };

  const exportCSV = (type: 'users' | 'meetings') => {
    let csvContent = "data:text/csv;charset=utf-8,";
    if (type === 'users') {
      csvContent += "ID,Nom,Entreprise,Role,Secteur,Email,Telephone,StatutAccès\n";
      allUsers.forEach(u => {
        csvContent += `"${u.id}","${u.name}","${u.company}","${u.role}","${u.sector}","${u.email}","${u.phone || ''}","${u.isActive !== false ? 'Actif' : 'En attente'}"\n`;
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

  const handleScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scanQuery.trim()) return;

    const term = scanQuery.trim().toLowerCase();
    const found = allUsers.find(u =>
      u.email.toLowerCase().includes(term) ||
      term.includes(u.email.toLowerCase()) ||
      String(u.id) === term
    );

    if (found) {
      setScannedUser(found);
      setScanStatus('valid');
      showToast(`✅ Badge Valide : ${found.company} (${found.name})`);
    } else {
      setScannedUser(null);
      setScanStatus('invalid');
      showToast(`❌ Badge Inconnu ou Non Enregistré`);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '80px' }}>
        <i className="fas fa-spinner fa-spin text-accent" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
        <h3 style={{ fontWeight: 800, color: 'var(--primary)' }}>Chargement du Panneau SuperAdmin...</h3>
      </div>
    );
  }

  return (
    <div>
      {/* HEADER SUPERADMIN */}
      <div className="card" style={{ background: 'linear-gradient(135deg, var(--primary-dark) 0%, var(--primary) 100%)', color: 'white', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="badge badge-accent" style={{ background: 'var(--danger)', color: 'white', fontWeight: 800, marginBottom: '8px' }}>
              PANNEAU SUPERADMIN
            </span>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 900, margin: '4px 0 0 0' }}>Supervision Organisateur HORECA 2026</h2>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn btn-sm btn-outline" style={{ borderColor: 'white', color: 'white' }} onClick={() => exportCSV('users')}>
              <i className="fas fa-file-csv"></i> Export Users CSV
            </button>
            <button className="btn btn-sm btn-accent" onClick={loadAdminData}>
              <i className="fas fa-sync-alt"></i> Actualiser Data
            </button>
          </div>
        </div>

        {/* ADMIN TABS */}
        <div style={{ display: 'flex', gap: '8px', marginTop: '24px', flexWrap: 'wrap' }}>
          <button
            className={`btn btn-sm ${activeTab === 'stats' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => setActiveTab('stats')}
          >
            <i className="fas fa-chart-line"></i> Vue d'ensemble &amp; Stats
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'users' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => setActiveTab('users')}
          >
            <i className="fas fa-users"></i> Participants ({allUsers.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'payments' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => setActiveTab('payments')}
          >
            <i className="fas fa-credit-card"></i> Paiements &amp; Factures ({orders.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'contacts' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => setActiveTab('contacts')}
          >
            <i className="fas fa-envelope"></i> Messages ({contacts.length})
          </button>
          <button
            className={`btn btn-sm ${activeTab === 'scanner' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderColor: 'rgba(255,255,255,0.4)', color: 'white' }}
            onClick={() => setActiveTab('scanner')}
          >
            <i className="fas fa-qrcode"></i> 📷 Scanner &amp; Contrôle Badges
          </button>
        </div>
      </div>

      {/* TAB CONTENT */}
      {activeTab === 'stats' ? (
        <>
          {/* STATS CARDS */}
          <div className="grid grid-4" style={{ marginBottom: '24px' }}>
            <div className="card" style={{ borderLeft: '4px solid var(--primary)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>
                Total Inscrits
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--primary)', margin: '4px 0' }}>
                {stats?.totalUsers || allUsers.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Décideurs &amp; Participants B2B</div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--accent)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>
                RDV B2B Confirmés
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--accent)', margin: '4px 0' }}>
                {stats?.confirmedMeetings || masterMeetings.filter((m) => m.status === 'ACCEPTED').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Sur {stats?.totalMeetings || masterMeetings.length} demandes au total
              </div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--purple)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>
                Candidats / Étudiants
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--purple)', margin: '4px 0' }}>
                {stats?.totalStudents || allUsers.filter((u) => u.role === 'Étudiant').length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>CV &amp; Demandes d'entretiens RH</div>
            </div>

            <div className="card" style={{ borderLeft: '4px solid var(--danger)' }}>
              <div style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 800 }}>
                Demandes de Paiement
              </div>
              <div style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--danger)', margin: '4px 0' }}>
                {orders.length}
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Demandes de Stands &amp; Pass</div>
            </div>
          </div>

          {/* MASTER MEETINGS LIST */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 className="card-title">
                <i className="fas fa-calendar-check text-accent"></i> Planning Global des Rendez-vous B2B ({masterMeetings.length})
              </h3>
              <button className="btn btn-outline btn-sm" onClick={() => exportCSV('meetings')}>
                <i className="fas fa-download"></i> Export Planning CSV
              </button>
            </div>

            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid var(--gray-200)' }}>
                    <th style={{ padding: '10px' }}>ID</th>
                    <th style={{ padding: '10px' }}>Demandeur (From)</th>
                    <th style={{ padding: '10px' }}>Destinataire (To)</th>
                    <th style={{ padding: '10px' }}>Créneau</th>
                    <th style={{ padding: '10px' }}>Table assigned</th>
                    <th style={{ padding: '10px' }}>Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {masterMeetings.map((m) => (
                    <tr key={m.id} style={{ borderBottom: '1px solid var(--gray-100)' }}>
                      <td style={{ padding: '10px', fontWeight: 700 }}>#{m.id}</td>
                      <td style={{ padding: '10px' }}>
                        <strong>{m.fromCompany}</strong> <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.fromName}</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        <strong>{m.toCompany}</strong> <br />
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{m.toName}</span>
                      </td>
                      <td style={{ padding: '10px' }}>
                        {m.day} à <strong>{m.time}</strong>
                      </td>
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
      ) : activeTab === 'payments' ? (
        /* PAYMENTS TAB */
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' }}>
            <div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--primary)' }}>
                💳 Commandes, Paiements &amp; Validation des Factures ({orders.length})
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Vérifiez les transferts manuels (Wave / Orange Money au +221 76 420 52 16), validez et envoyez automatiquement la facture acquittée par email.
              </p>
            </div>
            <button className="btn btn-outline btn-sm" onClick={loadAdminData}>
              <i className="fas fa-sync-alt"></i> Rafraîchir
            </button>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-muted)' }}>
              Aucune commande ou demande de paiement enregistrée pour le moment.
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="table" style={{ width: '100%', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-subtle)', textAlign: 'left' }}>
                    <th style={{ padding: '10px' }}>Date / Réf</th>
                    <th style={{ padding: '10px' }}>Client / Entreprise</th>
                    <th style={{ padding: '10px' }}>Offre / Pack</th>
                    <th style={{ padding: '10px' }}>Montant</th>
                    <th style={{ padding: '10px' }}>Mode &amp; Réf Transfert</th>
                    <th style={{ padding: '10px' }}>Statut</th>
                    <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o: any) => (
                    <tr key={o.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 700 }}>{o.reference}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                          {new Date(o.created_at || Date.now()).toLocaleDateString('fr-FR')}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 700, color: 'var(--primary)' }}>{o.customer_name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{o.customer_email}</div>
                        {o.customer_phone && <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>📞 {o.customer_phone}</div>}
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <span className="badge badge-sector" style={{ fontSize: '0.78rem' }}>
                          {o.pack_name}
                        </span>
                      </td>
                      <td style={{ padding: '12px 10px', fontWeight: 800, color: 'var(--accent)' }}>
                        {Number(o.amount).toLocaleString('fr-FR')} FCFA
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        <div style={{ fontWeight: 700 }}>
                          {o.payment_method === 'MANUAL_OM' ? '🟧 Orange Money' : o.payment_method === 'MANUAL_WAVE' ? '📲 Transfert Wave' : '🌊 Wave Direct API'}
                        </div>
                        <div style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 600 }}>
                          Réf: {o.transaction_ref || 'Non renseigné'}
                        </div>
                      </td>
                      <td style={{ padding: '12px 10px' }}>
                        {o.status === 'COMPLETED' ? (
                          <span className="badge badge-success" style={{ background: '#22c55e', color: 'white', fontWeight: 700 }}>
                            ✓ PAYÉ &amp; VALIDÉ ({o.invoice_number || 'INV-2026'})
                          </span>
                        ) : o.status === 'REJECTED' ? (
                          <span className="badge badge-danger">❌ REJETÉ</span>
                        ) : (
                          <span className="badge badge-warning" style={{ background: '#f59e0b', color: 'white' }}>
                            ⏳ EN ATTENTE DE VALIDATION
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '12px 10px', textAlign: 'right' }}>
                        {o.status !== 'COMPLETED' && (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className="btn btn-sm btn-accent"
                              disabled={verifyingOrderId === o.id}
                              onClick={() => handleVerifyPayment(o.id, 'APPROVE')}
                            >
                              {verifyingOrderId === o.id ? 'Validation...' : '✅ Valider & Envoyer Facture'}
                            </button>
                            <button
                              className="btn btn-sm btn-outline"
                              style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}
                              disabled={verifyingOrderId === o.id}
                              onClick={() => handleVerifyPayment(o.id, 'REJECT')}
                            >
                              ❌ Rejeter
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : activeTab === 'users' ? (
        /* USERS TAB */
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', flexWrap: 'wrap', gap: '12px' }}>
            <h3 className="card-title">
              <i className="fas fa-users text-accent"></i> Annuaire des Participants ({allUsers.length})
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
                  <th style={{ padding: '10px' }}>Statut Accès</th>
                  <th style={{ padding: '10px', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((u) => {
                  const isActive = u.isSuperAdmin || u.isActive !== false;
                  return (
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
                        {isActive ? (
                          <span className="badge badge-success" style={{ background: '#22c55e', color: 'white', fontWeight: 700 }}>
                            ✓ Actif
                          </span>
                        ) : (
                          <span className="badge" style={{ background: '#ea580c', color: 'white', fontWeight: 700 }}>
                            ⏳ En attente
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '10px', textAlign: 'right' }}>
                        {!u.isSuperAdmin && (
                          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                            <button
                              className={`btn btn-sm ${!isActive ? 'btn-accent' : 'btn-outline'}`}
                              style={{ fontSize: '0.75rem', padding: '4px 8px' }}
                              onClick={() => handleToggleUserActive(u)}
                              title={isActive ? "Suspendre l'accès B2B" : "Activer l'accès B2B & Badges"}
                            >
                              <i className={`fas ${!isActive ? 'fa-check-circle' : 'fa-lock'}`}></i>{' '}
                              {!isActive ? 'Activer Accès' : 'Suspendre'}
                            </button>

                            <button
                              className="btn btn-outline btn-sm"
                              style={{ borderColor: 'var(--danger)', color: 'var(--danger)', fontSize: '0.75rem', padding: '4px 8px' }}
                              onClick={() => handleDeleteUser(u)}
                            >
                              <i className="fas fa-trash-alt"></i> Sup.
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'contacts' ? (
        <div className="card">
          <div className="card-header">
            <h3 className="card-title">
              <i className="fas fa-inbox text-accent"></i> Demandes de Contact &amp; Secrétariat HORECA
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
            Scanner &amp; Contrôle de Badges QR Code
          </h3>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
            Entrez ou scannez le contenu du QR Code (ex: HORECA-2026-PASS-1-novotel@dakar.com ou novotel@dakar.com) pour vérifier l'accès du participant :
          </p>

          <form onSubmit={handleScanSubmit} style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            <input
              type="text"
              className="form-control"
              placeholder="Scannez ou tapez l'email/code QR du badge..."
              value={scanQuery}
              onChange={(e) => setScanQuery(e.target.value)}
              autoFocus
            />
            <button type="submit" className="btn btn-accent">
              Vérifier
            </button>
          </form>

          {scanStatus === 'valid' && scannedUser && (
            <div style={{ background: '#ecfdf5', border: '2px solid #10b981', borderRadius: '12px', padding: '20px', textAlign: 'left' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <span className="badge badge-success" style={{ fontSize: '1rem', padding: '6px 14px' }}>
                  ✓ BADGE VALIDE &amp; ACCÈS AUTORISÉ
                </span>
              </div>
              <h3 style={{ margin: '0 0 4px 0', color: 'var(--primary)', fontWeight: 800 }}>{scannedUser.company}</h3>
              <p style={{ margin: '0 0 10px 0', fontSize: '1rem', color: 'var(--text-main)' }}>Participant : <strong>{scannedUser.name}</strong></p>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Rôle: <strong>{scannedUser.role}</strong> · Secteur: <strong>{scannedUser.sector}</strong> <br />
                Email: <strong>{scannedUser.email}</strong>
              </div>
            </div>
          )}

          {scanStatus === 'invalid' && (
            <div style={{ background: '#fef2f2', border: '2px solid #ef4444', borderRadius: '12px', padding: '20px', color: '#991b1b' }}>
              <h4 style={{ margin: 0, fontWeight: 800 }}>❌ BADGE NON VALIDE / ACCÈS REFUSÉ</h4>
              <p style={{ margin: '6px 0 0 0', fontSize: '0.85rem' }}>
                Ce QR code ne correspond à aucun participant actif enregistré dans la base HORECA.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

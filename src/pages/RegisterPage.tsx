import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { apiService } from '../services/api';
import { UserRole, UserSector } from '../types';

const PASS_PRICES: Record<string, number> = {
  'Pass Visiteur Pro': 25000,
  'Pass B2B Matchmaker': 150000,
  'Pack Stand & Recrutement': 450000,
  'Pass Job Dating RH': 0
};

export const RegisterPage: React.FC = () => {
  const { setCurrentUser, showToast, setCurrentPage } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [role, setRole] = useState<UserRole>('Professionnel');
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [sector, setSector] = useState<UserSector>('Hôtellerie');
  const [phone, setPhone] = useState('');
  const [studentJob, setStudentJob] = useState('');
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [looking, setLooking] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedPass, setSelectedPass] = useState<string>('Pass B2B Matchmaker');
  const [paymentMethod, setPaymentMethod] = useState<'wave' | 'om' | 'card'>('wave');
  const [loadingPack, setLoadingPack] = useState<string | null>(null);

  const toggleLooking = (item: string) => {
    setLooking((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSelectRole = (r: UserRole) => {
    setRole(r);
    showToast(`Rôle sélectionné : ${r}`);
    if (r === 'Exposant') {
      setSelectedPass('Pack Stand & Recrutement');
    } else if (r === 'Étudiant') {
      setSelectedPass('Pass Job Dating RH');
    } else {
      setSelectedPass('Pass B2B Matchmaker');
    }
    setCurrentStep(3);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selected = e.target.files[0];
      const validExts = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
      const isExtValid = validExts.some((ext) => selected.name.toLowerCase().endsWith(ext));

      if (!isExtValid) {
        showToast('⚠️ Format non supporté. Formats autorisés : PDF, DOC, DOCX, PNG, JPG');
        return;
      }

      setCvFile(selected);
      showToast(`📄 CV sélectionné : ${selected.name}`);
    }
  };

  const registerUserInternal = async () => {
    const user = await apiService.register({
      email,
      pass,
      name,
      company: company || name,
      role,
      sector,
      phone,
      studentJob,
      cvAttached: role === 'Étudiant' || !!cvFile,
      looking
    });

    if (cvFile && user.id) {
      try {
        showToast('Envoi du fichier CV en cours...');
        const uploadRes = await apiService.uploadCv(user.id, cvFile);
        user.cvUrl = uploadRes.cvUrl;
        user.cvAttached = true;
      } catch (err: any) {
        console.error('Erreur envoi CV:', err);
        showToast(err.message || 'Attention: l’inscription a réussi mais l’envoi du CV a échoué.');
      }
    }

    return user;
  };

  const handlePayWaveForPass = async (passName: string, amount: number) => {
    setLoadingPack(passName);
    setSelectedPass(passName);
    try {
      showToast(`Création du compte et initialisation Wave pour ${passName}...`);
      const user = await registerUserInternal();
      setCurrentUser(user);

      if (amount === 0) {
        showToast('Pass Job Dating RH (Gratuit) activé !');
        setCurrentPage('search');
        return;
      }

      const res = await apiService.createWaveCheckout(amount, passName, email);
      if (res.wave_launch_url) {
        window.location.href = res.wave_launch_url;
      } else {
        showToast('Session Wave créée avec succès');
        setCurrentPage('search');
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de l’inscription ou du paiement Wave');
    } finally {
      setLoadingPack(null);
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await registerUserInternal();
      setCurrentUser(user);

      const price = PASS_PRICES[selectedPass] ?? 0;
      if (paymentMethod === 'wave' && price > 0) {
        showToast(`🌊 Initialisation du paiement Wave pour ${selectedPass}...`);
        const res = await apiService.createWaveCheckout(price, selectedPass, email);
        if (res.wave_launch_url) {
          window.location.href = res.wave_launch_url;
          return;
        }
      }

      showToast(`Compte créé avec succès ! Pass activé : ${selectedPass}`);
      setCurrentPage('search');
    } catch (err: any) {
      showToast(err.message || 'Erreur d’inscription');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card" style={{ maxWidth: currentStep === 4 ? '1100px' : '800px', margin: '0 auto', transition: 'max-width 0.3s ease' }}>
        {/* STEP PROGRESS BAR */}
        <div className="step-progress">
          <div className={`step-item ${currentStep >= 1 ? 'active' : ''}`}>
            <div className="step-circle">1</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Compte</span>
          </div>
          <div className={`step-item ${currentStep >= 2 ? 'active' : ''}`}>
            <div className="step-circle">2</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Rôle Pro</span>
          </div>
          <div className={`step-item ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-circle">3</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Profil & Secteur</span>
          </div>
          <div className={`step-item ${currentStep >= 4 ? 'active' : ''}`}>
            <div className="step-circle">4</div>
            <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>Paiement / Pass</span>
          </div>
        </div>

        {/* STEP 1: ACCOUNT INFO */}
        {currentStep === 1 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(2);
            }}
          >
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '20px' }}>
              Étape 1 : Identifiants de connexion
            </h3>
            <div className="form-group">
              <label className="form-label">Adresse Email Professionnelle *</label>
              <input
                type="email"
                className="form-control"
                required
                placeholder="ex: direction@hotel.sn"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Créer un Mot de passe *</label>
              <input
                type="password"
                className="form-control"
                required
                placeholder="Minimum 6 caractères"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
              />
            </div>
            <button type="submit" className="btn btn-accent" style={{ width: '100%' }}>
              Continuer vers la sélection du Rôle <i className="fas fa-arrow-right"></i>
            </button>
          </form>
        )}

        {/* STEP 2: ROLE SELECTION */}
        {currentStep === 2 && (
          <div>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '20px' }}>
              Étape 2 : Quel est votre rôle à HORECA AFRICA 2026 ?
            </h3>
            <div className="role-cards-grid">
              <div
                className={`role-select-card ${role === 'Professionnel' ? 'selected' : ''}`}
                onClick={() => handleSelectRole('Professionnel')}
              >
                <i className="fas fa-building text-accent" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <h4 style={{ fontWeight: 800 }}>Professionnel</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Hôtel, Restaurant, Acheteur B2B</p>
              </div>

              <div
                className={`role-select-card ${role === 'Exposant' ? 'selected' : ''}`}
                onClick={() => handleSelectRole('Exposant')}
              >
                <i className="fas fa-store text-accent" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <h4 style={{ fontWeight: 800 }}>Exposant / Stand</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Fournisseur, Stand 6m²</p>
              </div>

              <div
                className={`role-select-card ${role === 'Étudiant' ? 'selected' : ''}`}
                onClick={() => handleSelectRole('Étudiant')}
              >
                <i className="fas fa-user-graduate text-purple" style={{ fontSize: '2rem', marginBottom: '10px' }}></i>
                <h4 style={{ fontWeight: 800 }}>Étudiant / Candidat RH</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Job Dating & Dépot CV</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(1)}>
                <i className="fas fa-arrow-left"></i> Retour
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROFILE & SECTOR */}
        {currentStep === 3 && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setCurrentStep(4);
            }}
          >
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '20px' }}>
              Étape 3 : Profil & Secteur d'Activité
            </h3>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Prénom & Nom du Représentant *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ex: Ousmane Sow"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Nom de l'Entreprise ou Établissement *</label>
                <input
                  type="text"
                  className="form-control"
                  required
                  placeholder="ex: Novotel Dakar / Restaurant..."
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                />
              </div>
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label className="form-label">Secteur Principal</label>
                <select className="form-control" value={sector} onChange={(e) => setSector(e.target.value as UserSector)}>
                  <option value="Hôtellerie">Hôtellerie</option>
                  <option value="Restauration">Restauration</option>
                  <option value="Institutions">Institutions</option>
                  <option value="DMC">DMC</option>
                  <option value="Agences de voyages">Agences de voyages</option>
                  <option value="Équipementiers">Équipementiers</option>
                  <option value="Banques">Banques</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Téléphone / WhatsApp *</label>
                <input
                  type="tel"
                  className="form-control"
                  required
                  placeholder="+221 77 ..."
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {role === 'Étudiant' && (
              <div style={{ background: 'rgba(139,92,246,0.08)', border: '1.5px dashed var(--purple)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '18px' }}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label className="form-label" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                    <i className="fas fa-briefcase"></i> Poste recherché pour Job Dating RH *
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    required={role === 'Étudiant'}
                    placeholder="ex: Assistant Manager Restauration / Chef de Rang..."
                    value={studentJob}
                    onChange={(e) => setStudentJob(e.target.value)}
                  />
                </div>

                <div className="form-group" style={{ marginBottom: 0 }}>
                  <label className="form-label" style={{ color: 'var(--purple)', fontWeight: 700 }}>
                    <i className="fas fa-file-upload"></i> Déposer votre CV (PDF, Word DOC/DOCX, ou Image PNG/JPG)
                  </label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                    <label className="btn btn-purple" style={{ margin: 0, padding: '10px 18px', fontSize: '0.85rem', cursor: 'pointer' }}>
                      <i className="fas fa-cloud-upload-alt"></i> {cvFile ? 'Changer le CV' : 'Choisir un fichier CV'}
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                      />
                    </label>
                    <span style={{ fontSize: '0.85rem', color: cvFile ? 'var(--purple)' : 'var(--text-muted)', fontWeight: cvFile ? 600 : 400 }}>
                      {cvFile ? `📄 ${cvFile.name} (${Math.round(cvFile.size / 1024)} KB)` : 'Aucun fichier sélectionné (PDF, DOC, DOCX, PNG, JPG)'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            <div className="form-group">
              <label className="form-label">Quels profils recherchez-vous en priorité (Matchmaking) ?</label>
              <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '8px' }}>
                {['Hôtels', 'Restaurants', 'Fournisseurs', 'Investisseurs', 'DMC', 'Agences de voyages'].map((item) => (
                  <label key={item} style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                    <input
                      type="checkbox"
                      checked={looking.includes(item)}
                      onChange={() => toggleLooking(item)}
                    />
                    {item}
                  </label>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(2)}>
                <i className="fas fa-arrow-left"></i> Retour
              </button>
              <button type="submit" className="btn btn-accent" style={{ flex: 1 }}>
                Passer au Paiement / Confirmation <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </form>
        )}

        {/* STEP 4: PAYMENT / CONFIRMATION & PASS SELECTION */}
        {currentStep === 4 && (
          <form onSubmit={handleFinalSubmit}>
            <h3 style={{ color: 'var(--primary)', fontWeight: 800, marginBottom: '20px' }}>
              Étape 4 : Validation & Activation du Pass HORECA
            </h3>

            <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', marginBottom: '8px' }}>Récapitulatif du Compte</h4>
              <p style={{ fontSize: '0.9rem' }}><strong>Email:</strong> {email || 'non renseigné'}</p>
              <p style={{ fontSize: '0.9rem' }}><strong>Nom / Entreprise:</strong> {company || name || 'non renseigné'} ({role})</p>
              <p style={{ fontSize: '0.9rem' }}><strong>Secteur:</strong> {sector}</p>
            </div>

            {(role === 'Étudiant' || selectedPass === 'Pass Job Dating RH') && (
              <div style={{ background: '#f5f3ff', border: '1px solid var(--purple)', padding: '14px 18px', borderRadius: 'var(--radius-md)', marginBottom: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                  <div>
                    <span style={{ fontWeight: 700, color: 'var(--purple)', fontSize: '0.9rem' }}>
                      🎓 CV Candidat RH :
                    </span>
                    <span style={{ fontSize: '0.88rem', marginLeft: '8px', color: cvFile ? 'var(--text-dark)' : 'var(--danger)', fontWeight: cvFile ? 600 : 500 }}>
                      {cvFile ? `📄 ${cvFile.name}` : '⚠️ Aucun CV n’a été téléversé'}
                    </span>
                  </div>
                  <label className="btn btn-sm btn-outline" style={{ borderColor: 'var(--purple)', color: 'var(--purple)', margin: 0, cursor: 'pointer' }}>
                    <i className="fas fa-paperclip"></i> {cvFile ? 'Changer le CV' : 'Joindre mon CV (PDF, DOC, Image)'}
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                      style={{ display: 'none' }}
                      onChange={handleFileChange}
                    />
                  </label>
                </div>
              </div>
            )}

            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Sélectionnez un mode de règlement pour activer instantanément votre badge digital :
            </p>

            <div className="grid-3" style={{ marginBottom: '24px' }}>
              <button
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '16px',
                  flexDirection: 'column',
                  gap: '6px',
                  borderColor: paymentMethod === 'om' ? 'var(--accent)' : 'var(--primary)',
                  background: paymentMethod === 'om' ? '#fff7ed' : 'white',
                  boxShadow: paymentMethod === 'om' ? '0 0 0 2px var(--accent)' : 'none'
                }}
                onClick={() => {
                  setPaymentMethod('om');
                  showToast('Paiement via Orange Money sélectionné');
                }}
              >
                <i className="fas fa-mobile-alt text-accent" style={{ fontSize: '1.5rem' }}></i>
                <span>Orange Money</span>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '16px',
                  flexDirection: 'column',
                  gap: '6px',
                  borderColor: paymentMethod === 'wave' ? 'var(--accent)' : 'var(--primary)',
                  background: paymentMethod === 'wave' ? '#fff7ed' : 'white',
                  boxShadow: paymentMethod === 'wave' ? '0 0 0 2px var(--accent)' : 'none'
                }}
                onClick={() => {
                  setPaymentMethod('wave');
                  showToast('🌊 Wave Digital sélectionné');
                }}
              >
                <i className="fas fa-water text-accent" style={{ fontSize: '1.5rem' }}></i>
                <strong>🌊 Wave Digital</strong>
              </button>

              <button
                type="button"
                className="btn btn-outline"
                style={{
                  padding: '16px',
                  flexDirection: 'column',
                  gap: '6px',
                  borderColor: paymentMethod === 'card' ? 'var(--accent)' : 'var(--primary)',
                  background: paymentMethod === 'card' ? '#fff7ed' : 'white',
                  boxShadow: paymentMethod === 'card' ? '0 0 0 2px var(--accent)' : 'none'
                }}
                onClick={() => {
                  setPaymentMethod('card');
                  showToast('Paiement par Carte bancaire sélectionné');
                }}
              >
                <i className="fas fa-credit-card text-accent" style={{ fontSize: '1.5rem' }}></i>
                <span>Carte Visa / MC</span>
              </button>
            </div>

            <div style={{ display: 'flex', gap: '10px', marginBottom: '32px' }}>
              <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => setCurrentStep(3)}>
                <i className="fas fa-arrow-left"></i> Retour
              </button>
              <button type="submit" className="btn btn-accent" style={{ flex: 1 }} disabled={loading}>
                <i className="fas fa-check-circle"></i> {loading ? 'Validation...' : 'Finaliser & Activer mon Pass'}
              </button>
            </div>

            {/* OFFRES & TARIFS D'ACCES 2026 */}
            <div style={{ borderTop: '2px solid var(--gray-200)', paddingTop: '28px', marginTop: '12px' }}>
              <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary)' }}>
                  Offres & Tarifs d'Accès <span style={{ color: 'var(--accent)' }}>2026</span>
                </h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', maxWidth: '680px', margin: '6px auto 0' }}>
                  Choisissez la formule adaptée à vos objectifs B2B, d'exposition ou de recrutement RH pour les 25 & 26 Novembre 2026.
                </p>
              </div>

              <div className="grid-4" style={{ alignItems: 'stretch' }}>
                {/* PACK 1: VISITEUR PRO */}
                <div
                  className={`pricing-card ${selectedPass === 'Pass Visiteur Pro' ? 'featured' : ''}`}
                  onClick={() => {
                    setSelectedPass('Pass Visiteur Pro');
                    showToast('Pass Visiteur Pro sélectionné');
                  }}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedPass === 'Pass Visiteur Pro' ? 'var(--accent)' : undefined
                  }}
                >
                  {selectedPass === 'Pass Visiteur Pro' && (
                    <div className="featured-badge" style={{ background: 'var(--primary)' }}>SÉLECTIONNÉ</div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>Pass Visiteur Pro</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Accès conférences & salon</p>
                    <div className="price-amount" style={{ fontSize: '1.8rem' }}>25 000 FCFA</div>
                    <div className="price-sub">par participant · 2 jours</div>

                    <ul className="pricing-features">
                      <li><i className="fas fa-check-circle"></i> Accès aux 2 jours d'exposition</li>
                      <li><i className="fas fa-check-circle"></i> Entrée aux conférences & panels</li>
                      <li><i className="fas fa-check-circle"></i> Badge digital & QR Pass</li>
                      <li><i className="fas fa-times-circle" style={{ color: 'var(--gray-300)' }}></i> <span style={{ color: 'var(--text-muted)' }}>Matchmaking B2B sur table</span></li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '10px 8px' }}
                    disabled={loadingPack === 'Pass Visiteur Pro'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWaveForPass('Pass Visiteur Pro', 25000);
                    }}
                  >
                    {loadingPack === 'Pass Visiteur Pro' ? 'Wave en cours...' : '🌊 Payer 25 000 F via Wave'}
                  </button>
                </div>

                {/* PACK 2: B2B MATCHMAKER (FEATURED / RECOMMANDE PRO) */}
                <div
                  className={`pricing-card featured ${selectedPass === 'Pass B2B Matchmaker' ? 'selected' : ''}`}
                  onClick={() => {
                    setSelectedPass('Pass B2B Matchmaker');
                    showToast('Pass B2B Matchmaker sélectionné');
                  }}
                  style={{
                    cursor: 'pointer',
                    borderColor: 'var(--accent)',
                    borderWidth: selectedPass === 'Pass B2B Matchmaker' ? '3px' : '2px'
                  }}
                >
                  <div className="featured-badge">RECOMMANDÉ PRO</div>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>Pass B2B Matchmaker</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>RDV B2B Ciblés & Agenda</p>
                    <div className="price-amount" style={{ fontSize: '1.8rem' }}>150 000 FCFA</div>
                    <div className="price-sub">par entreprise · 2 jours</div>

                    <ul className="pricing-features">
                      <li><i className="fas fa-check-circle"></i> Tout le Pass Visiteur Pro</li>
                      <li><i className="fas fa-check-circle"></i> <strong>Agenda RDV B2B Garantis</strong></li>
                      <li><i className="fas fa-check-circle"></i> Attribution de Tables Numérotées</li>
                      <li><i className="fas fa-check-circle"></i> Accès Annuaire Décideurs</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn btn-accent"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '10px 8px' }}
                    disabled={loadingPack === 'Pass B2B Matchmaker'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWaveForPass('Pass B2B Matchmaker', 150000);
                    }}
                  >
                    {loadingPack === 'Pass B2B Matchmaker' ? 'Wave en cours...' : '🌊 Payer 150 000 F via Wave'}
                  </button>
                </div>

                {/* PACK 3: EXPOSANT & JOB DATING */}
                <div
                  className={`pricing-card ${selectedPass === 'Pack Stand & Recrutement' ? 'featured' : ''}`}
                  onClick={() => {
                    setSelectedPass('Pack Stand & Recrutement');
                    showToast('Pack Stand & Recrutement sélectionné');
                  }}
                  style={{
                    cursor: 'pointer',
                    borderColor: selectedPass === 'Pack Stand & Recrutement' ? 'var(--purple)' : undefined
                  }}
                >
                  {selectedPass === 'Pack Stand & Recrutement' && (
                    <div className="featured-badge" style={{ background: 'var(--purple)' }}>SÉLECTIONNÉ</div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--primary)' }}>Pack Stand & Recrutement</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Stand Dédié & Job Dating RH</p>
                    <div className="price-amount" style={{ fontSize: '1.8rem' }}>450 000 FCFA</div>
                    <div className="price-sub">Stand 6m² équipé · Novotel</div>

                    <ul className="pricing-features">
                      <li><i className="fas fa-check-circle"></i> Stand d'exposition 6m² équipé</li>
                      <li><i className="fas fa-check-circle"></i> <strong>Espace Recrutement RH / CVs</strong></li>
                      <li><i className="fas fa-check-circle"></i> RDV B2B Illimités sur Stand</li>
                      <li><i className="fas fa-check-circle"></i> Visibilité Catalogue Officiel</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn btn-purple"
                    style={{ width: '100%', fontSize: '0.82rem', padding: '10px 8px' }}
                    disabled={loadingPack === 'Pack Stand & Recrutement'}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePayWaveForPass('Pack Stand & Recrutement', 450000);
                    }}
                  >
                    {loadingPack === 'Pack Stand & Recrutement' ? 'Wave en cours...' : '🌊 Payer 450 000 F via Wave'}
                  </button>
                </div>

                {/* PACK 4: CANDIDAT RH / ETUDIANT */}
                <div
                  className={`pricing-card ${selectedPass === 'Pass Job Dating RH' ? 'featured' : ''}`}
                  onClick={() => {
                    setSelectedPass('Pass Job Dating RH');
                    showToast('Pass Job Dating RH (Gratuit) sélectionné');
                  }}
                  style={{
                    cursor: 'pointer',
                    borderColor: 'var(--purple)',
                    borderWidth: selectedPass === 'Pass Job Dating RH' ? '3px' : '1px'
                  }}
                >
                  {selectedPass === 'Pass Job Dating RH' && (
                    <div className="featured-badge" style={{ background: 'var(--purple)' }}>SÉLECTIONNÉ</div>
                  )}
                  <div>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--purple)' }}>Pass Job Dating RH</h3>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Candidats & Étudiants HORECA</p>
                    <div className="price-amount" style={{ color: 'var(--purple)', fontSize: '1.8rem' }}>GRATUIT</div>
                    <div className="price-sub">sur sélection de CV</div>

                    <ul className="pricing-features">
                      <li><i className="fas fa-check-circle"></i> Publication du CV dans la CVthèque</li>
                      <li><i className="fas fa-check-circle"></i> <strong>Entretiens avec les DRH</strong></li>
                      <li><i className="fas fa-check-circle"></i> Accès Espace Job Dating RH</li>
                      <li><i className="fas fa-check-circle"></i> Badge Digital Recrutement</li>
                    </ul>
                  </div>
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ width: '100%', borderColor: 'var(--purple)', color: 'var(--purple)', fontSize: '0.82rem', padding: '10px 8px' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedPass('Pass Job Dating RH');
                      showToast('Pass Job Dating RH (Gratuit) sélectionné');
                    }}
                  >
                    🎓 Inscription Gratuite (CV)
                  </button>
                </div>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};



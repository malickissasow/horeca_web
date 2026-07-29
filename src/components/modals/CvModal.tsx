import React, { useState } from 'react';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

interface CvModalProps {
  user: User | null;
  onClose: () => void;
}

export const CvModal: React.FC<CvModalProps> = ({ user, onClose }) => {
  const { currentUser, showToast, setCurrentUser } = useAuth();
  const [uploading, setUploading] = useState(false);

  if (!user) return null;

  const isOwnProfile = currentUser && currentUser.id === user.id;
  const pdfFullUrl = user.cvUrl ? `http://localhost:5000${user.cvUrl}` : null;
  const safeName = user.name.replace(/\s+/g, '_');
  const fileName = `CV_${safeName}.pdf`;

  const handleDownload = () => {
    if (pdfFullUrl) {
      const a = document.createElement('a');
      a.href = pdfFullUrl;
      a.download = fileName;
      a.target = '_blank';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast(`📥 Téléchargement du CV de ${user.name} en cours...`);
    } else {
      // Generate downloadable official Candidate CV document
      const cvContent = `===================================================================
                   HORECA AFRICA 2026 - CV OFFICIEL
===================================================================

INFORMATIONS CANDIDAT :
-----------------------
• Nom & Prénom : ${user.name}
• Établissement / Université : ${user.company || 'Université Cheikh Anta Diop'}
• Secteur d'Activité : ${user.sector || 'Restauration'}

OBJECTIF PROFESSIONNEL :
------------------------
• Poste recherché : ${user.studentJob || 'Chef de Rang / Sommelier'}
• Statut : Candidat RH / Job Dating HORECA 2026

COORDONNÉES DE CONTACT :
-------------------------
• Téléphone / WhatsApp : ${user.phone || '+221 76 543 21 09'}
• Email Professionnel : ${user.email || 'moussa@candidat.sn'}

-------------------------------------------------------------------
QUALIFICATIONS & INTÉRÊTS RH
-------------------------------------------------------------------
- Participation active au Job Dating RH & Entretiens DRH
- Compétences en Gestion de Salle, Service Restauration & Hôtellerie
- Disponible pour recrutement immédiat ou stage d'excellence HORECA

===================================================================
      Document délivré par le Comité d'Organisation HORECA AFRICA
===================================================================`;

      const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `CV_${safeName}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      showToast(`📥 Téléchargement du CV de ${user.name} déclenché avec succès !`);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
    const isValid = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      showToast('❌ Formats acceptés : PDF, Word (DOC/DOCX), Images (PNG, JPG)');
      return;
    }

    setUploading(true);
    try {
      const res = await apiService.uploadCv(user.id, file);
      showToast('✅ Votre CV a été téléversé avec succès !');
      if (isOwnProfile && currentUser) {
        setCurrentUser({ ...currentUser, cvAttached: true, cvUrl: res.cvUrl });
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du téléversement du fichier CV');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container" style={{ maxWidth: '640px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 800, color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '1.3rem' }}>
            <i className="fas fa-file-pdf"></i> Aperçu du CV - Candidat
          </h3>
          <button onClick={onClose} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* CANDIDATE INFO BOX */}
        <div style={{ background: 'var(--gray-100)', padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--purple)', marginBottom: '20px' }}>
          <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.25rem', marginBottom: '4px' }}>
            {user.name}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '12px' }}>
            {user.company || 'Université Cheikh Anta Diop'} · {user.sector || 'Restauration'}
          </p>

          <hr style={{ margin: '12px 0', border: 'none', borderTop: '1px solid var(--gray-300)' }} />

          <p style={{ fontSize: '0.95rem', marginBottom: '8px' }}>
            <strong>Poste recherché :</strong>{' '}
            <span style={{ color: 'var(--purple)', fontWeight: 700 }}>
              {user.studentJob || 'Chef de Rang / Sommelier'}
            </span>
          </p>

          <p style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
            <strong>Contact :</strong> 📞 {user.phone || '+221 76 543 21 09'} · ✉️ {user.email || 'moussa@candidat.sn'}
          </p>
        </div>

        {/* DOWNLOAD ACTION CARD */}
        <div style={{ background: 'white', padding: '18px 22px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--gray-200)', marginBottom: '20px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left' }}>
              <i className="fas fa-file-pdf text-danger" style={{ fontSize: '2.2rem' }}></i>
              <div>
                <strong style={{ fontSize: '0.98rem', color: 'var(--primary)', display: 'block' }}>
                  📄 {fileName}
                </strong>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  (Profil Candidat RH HORECA 2026)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-purple"
              style={{ padding: '10px 22px', fontSize: '0.9rem', fontWeight: 700 }}
            >
              <i className="fas fa-download"></i> Télécharger le CV
            </button>
          </div>
        </div>

        {/* IFRAME PREVIEW IF CV URL EXISTS */}
        {pdfFullUrl && (
          <div style={{ marginBottom: '20px' }}>
            <iframe
              src={pdfFullUrl}
              title={`CV ${user.name}`}
              style={{ width: '100%', height: '320px', border: '1px solid var(--gray-300)', borderRadius: '8px' }}
            ></iframe>
          </div>
        )}

        {/* OWN PROFILE UPLOAD ACTION */}
        {isOwnProfile && (
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '16px', textAlign: 'center' }}>
            <label className="btn btn-accent" style={{ cursor: 'pointer', padding: '10px 20px', fontSize: '0.88rem' }}>
              <i className="fas fa-upload"></i> {uploading ? 'Téléversement...' : 'Mettre à jour mon CV (PDF, Word, Image)'}
              <input
                type="file"
                accept=".pdf,.doc,.docx,.png,.jpg,.jpeg,.webp"
                onChange={handleFileChange}
                style={{ display: 'none' }}
                disabled={uploading}
              />
            </label>
          </div>
        )}
      </div>
    </div>
  );
};


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
  const rawCvUrl = user.cvUrl;
  const fullCvUrl = rawCvUrl ? (rawCvUrl.startsWith('http') ? rawCvUrl : `http://localhost:5000${rawCvUrl}`) : null;
  const safeName = user.name.replace(/\s+/g, '_');

  // Detect file extension
  const fileExt = rawCvUrl ? rawCvUrl.split('.').pop()?.toLowerCase() || '' : '';
  const isImage = ['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(fileExt);
  const isPdf = fileExt === 'pdf';
  const isWord = ['doc', 'docx'].includes(fileExt);

  const getDownloadFileName = () => {
    if (fileExt) {
      return `CV_${safeName}.${fileExt}`;
    }
    return `CV_${safeName}.pdf`;
  };

  const handleDownload = async () => {
    if (fullCvUrl) {
      try {
        showToast(`📥 Téléchargement du CV de ${user.name}...`);
        const response = await fetch(fullCvUrl);
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = getDownloadFileName();
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        showToast(`✅ CV de ${user.name} téléchargé avec succès !`);
      } catch (err) {
        // Fallback direct link
        const a = document.createElement('a');
        a.href = fullCvUrl;
        a.download = getDownloadFileName();
        a.target = '_blank';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      }
    } else {
      // Generate official Candidate CV document
      const cvContent = `===================================================================
                   HORECA AFRICA 2026 - CV OFFICIEL CANDIDAT
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
• Téléphone / WhatsApp : ${user.phone || '+221 77 542 82 35'}
• Email Professionnel : ${user.email || 'candidat@horeca.sn'}

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
      showToast(`📥 Fiche CV de ${user.name} téléchargée avec succès !`);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validExts = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg', '.webp'];
    const isValid = validExts.some((ext) => file.name.toLowerCase().endsWith(ext));

    if (!isValid) {
      showToast('❌ Formats acceptés : PDF, Word (DOC/DOCX), Images (PNG, JPG, WEBP)');
      return;
    }

    setUploading(true);
    try {
      showToast('📄 Envoi du fichier CV au serveur...');
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
      <div className="modal-container" style={{ maxWidth: '680px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h3 style={{ fontWeight: 800, color: 'var(--purple)', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '1.3rem' }}>
            <i className="fas fa-file-invoice"></i> CV &amp; Dossier Candidat RH
          </h3>
          <button onClick={onClose} style={{ fontSize: '1.2rem', color: 'var(--text-muted)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* CANDIDATE PROFILE CARD */}
        <div style={{ background: 'var(--gray-100)', padding: '22px', borderRadius: 'var(--radius-md)', border: '1.5px dashed var(--purple)', marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '10px' }}>
            <div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.3rem', marginBottom: '4px' }}>
                {user.name}
              </h4>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', fontWeight: 600 }}>
                {user.company || 'Université Cheikh Anta Diop'} · {user.sector || 'Restauration'}
              </p>
            </div>
            <span className="badge badge-student" style={{ padding: '6px 14px', fontSize: '0.8rem' }}>
              🎓 Candidat RH Job Dating
            </span>
          </div>

          <hr style={{ margin: '14px 0', border: 'none', borderTop: '1px solid var(--gray-300)' }} />

          <p style={{ fontSize: '0.98rem', marginBottom: '10px' }}>
            <strong>Poste recherché :</strong>{' '}
            <span style={{ color: 'var(--purple)', fontWeight: 800 }}>
              {user.studentJob || 'Chef de Rang / Sommelier / Assistant Manager'}
            </span>
          </p>

          <p style={{ fontSize: '0.92rem', color: 'var(--gray-700)' }}>
            <strong>Contact Recruteur :</strong> 📞 {user.phone || '+221 77 542 82 35'} · ✉️ {user.email || 'candidat@horeca.sn'}
          </p>
        </div>

        {/* FILE FORMAT PREVIEW / DOWNLOAD CARD */}
        <div style={{ background: 'white', padding: '20px', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--gray-200)', marginBottom: '22px', boxShadow: 'var(--shadow-sm)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
              {isWord ? (
                <i className="fas fa-file-word" style={{ fontSize: '2.5rem', color: '#2b579a' }}></i>
              ) : isImage ? (
                <i className="fas fa-file-image" style={{ fontSize: '2.5rem', color: '#10b981' }}></i>
              ) : (
                <i className="fas fa-file-pdf text-danger" style={{ fontSize: '2.5rem' }}></i>
              )}

              <div>
                <strong style={{ fontSize: '1.02rem', color: 'var(--primary)', display: 'block' }}>
                  📄 {getDownloadFileName()}
                </strong>
                <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  Format : {fileExt ? fileExt.toUpperCase() : 'PDF / Word / Image'} (Dossier Officiel HORECA 2026)
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownload}
              className="btn btn-purple"
              style={{ padding: '12px 24px', fontSize: '0.92rem', fontWeight: 800 }}
            >
              <i className="fas fa-download"></i> Télécharger le CV ({fileExt.toUpperCase() || 'DOCUMENT'})
            </button>
          </div>
        </div>

        {/* IMAGE PREVIEW IF FORMAT IS PNG/JPG */}
        {fullCvUrl && isImage && (
          <div style={{ marginBottom: '22px', textAlign: 'center', background: '#f8fafc', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid var(--gray-300)' }}>
            <h5 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '10px', fontWeight: 700 }}>
              📷 Aperçu Visuel du CV (Image) :
            </h5>
            <img
              src={fullCvUrl}
              alt={`CV ${user.name}`}
              style={{ maxWidth: '100%', maxHeight: '450px', objectFit: 'contain', borderRadius: '8px', boxShadow: 'var(--shadow-md)' }}
            />
          </div>
        )}

        {/* IFRAME PREVIEW IF FORMAT IS PDF */}
        {fullCvUrl && isPdf && (
          <div style={{ marginBottom: '22px' }}>
            <h5 style={{ fontSize: '0.9rem', color: 'var(--primary)', marginBottom: '8px', fontWeight: 700 }}>
              📄 Aperçu PDF du CV :
            </h5>
            <iframe
              src={fullCvUrl}
              title={`CV ${user.name}`}
              style={{ width: '100%', height: '360px', border: '1px solid var(--gray-300)', borderRadius: '8px' }}
            ></iframe>
          </div>
        )}

        {/* WORD NOTICE IF FORMAT IS DOC/DOCX */}
        {fullCvUrl && isWord && (
          <div style={{ marginBottom: '22px', background: '#eff6ff', border: '1px solid #bfdbfe', padding: '16px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <i className="fas fa-file-word" style={{ fontSize: '2rem', color: '#1d4ed8' }}></i>
            <div>
              <h5 style={{ color: '#1e40af', fontWeight: 800, fontSize: '0.95rem', marginBottom: '2px' }}>
                Document Microsoft Word (.${fileExt})
              </h5>
              <p style={{ fontSize: '0.84rem', color: '#1e3a8a', margin: 0 }}>
                Ce candidat a téléversé son CV au format Word. Cliquez sur le bouton ci-dessus pour le télécharger directement et l&apos;ouvrir dans Word.
              </p>
            </div>
          </div>
        )}

        {/* OWN PROFILE UPLOAD / UPDATE ACTION */}
        {isOwnProfile && (
          <div style={{ borderTop: '1px solid var(--gray-200)', paddingTop: '18px', textAlign: 'center' }}>
            <label className="btn btn-accent" style={{ cursor: 'pointer', padding: '11px 24px', fontSize: '0.9rem' }}>
              <i className="fas fa-upload"></i> {uploading ? 'Téléversement en cours...' : 'Téléverser / Remplacer mon CV (Word, PDF, Image)'}
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

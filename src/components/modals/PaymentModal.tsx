import React, { useState } from 'react';
import { apiService } from '../../services/api';
import { useAuth } from '../../context/AuthContext';

interface PaymentModalProps {
  packName: string;
  amount: number;
  customerEmail?: string;
  customerName?: string;
  customerPhone?: string;
  companyName?: string;
  onClose: () => void;
  onSuccess?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  packName,
  amount,
  customerEmail = '',
  customerName = '',
  customerPhone = '',
  companyName = '',
  onClose,
  onSuccess
}) => {
  const { currentUser, showToast } = useAuth();
  const [method, setMethod] = useState<'MANUAL_WAVE' | 'MANUAL_OM'>('MANUAL_WAVE');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [name, setName] = useState(customerName || currentUser?.name || '');
  const [email, setEmail] = useState(customerEmail || currentUser?.email || '');
  const [phone, setPhone] = useState(customerPhone || currentUser?.phone || '');
  const [company, setCompany] = useState(companyName || currentUser?.company || '');
  const [password, setPassword] = useState('horeca2026');
  const [txRef, setTxRef] = useState('');

  const formattedAmount = amount.toLocaleString('fr-FR') + ' FCFA';

  // Submit Manual Payment (Wave / Orange Money to +221 77 542 82 35)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !txRef || !password) {
      showToast('Veuillez remplir votre nom, email, mot de passe et référence du transfert');
      return;
    }

    setLoading(true);
    try {
      await apiService.submitManualPayment({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        companyName: company,
        packName,
        amount,
        paymentMethod: method,
        transactionRef: txRef,
        password
      });

      setSubmitted(true);
      showToast('🎉 Demande enregistrée ! Votre compte participant est créé et vos accès seront activés dès validation par l\'administrateur.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la soumission du paiement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose} style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '16px'
    }}>
      <div className="modal-card" onClick={e => e.stopPropagation()} style={{
        backgroundColor: 'var(--bg-card)', borderRadius: 'var(--radius-lg)',
        width: '100%', maxWidth: '560px', padding: '28px', color: 'var(--text-main)',
        boxShadow: 'var(--shadow-xl)', border: '1px solid var(--border-color)', position: 'relative'
      }}>
        {/* Close Button */}
        <button onClick={onClose} style={{
          position: 'absolute', top: '18px', right: '18px', background: 'none', border: 'none',
          fontSize: '1.4rem', color: 'var(--text-muted)', cursor: 'pointer'
        }}>
          &times;
        </button>

        {/* Modal Header */}
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '8px', display: 'inline-block' }}>
            💳 Règlement &amp; Création Compte Participant HORECA
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '4px 0' }}>
            {packName}
          </h2>
          <p style={{ fontSize: '1.3rem', fontWeight: 900, color: 'var(--accent)', margin: 0 }}>
            Montant : {formattedAmount}
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
              Compte Participant Créé &amp; Demande Transmise !
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Votre compte participant <strong>{email}</strong> a été enregistré.<br />
              Dès confirmation de votre dépôt au <strong>+221 77 542 82 35</strong> par le SuperAdmin, vos accès B2B et votre badge QR seront activés et notifiés par email.
            </p>
            <button className="btn btn-accent" onClick={onClose} style={{ width: '100%' }}>
              Fermer et Retourner au Site
            </button>
          </div>
        ) : (
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {/* Method Selector Tabs */}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="button"
                onClick={() => setMethod('MANUAL_WAVE')}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 800,
                  fontSize: '0.9rem', cursor: 'pointer', border: method === 'MANUAL_WAVE' ? '2px solid #1dcaff' : '1px solid var(--border-color)',
                  background: method === 'MANUAL_WAVE' ? 'rgba(29, 202, 255, 0.12)' : 'var(--bg-subtle)',
                  color: method === 'MANUAL_WAVE' ? '#0284c7' : 'var(--text-muted)'
                }}
              >
                🌊 Transfert Wave
              </button>
              <button
                type="button"
                onClick={() => setMethod('MANUAL_OM')}
                style={{
                  flex: 1, padding: '12px', borderRadius: 'var(--radius-md)', fontWeight: 800,
                  fontSize: '0.9rem', cursor: 'pointer', border: method === 'MANUAL_OM' ? '2px solid #ff7900' : '1px solid var(--border-color)',
                  background: method === 'MANUAL_OM' ? 'rgba(255, 121, 0, 0.12)' : 'var(--bg-subtle)',
                  color: method === 'MANUAL_OM' ? '#ea580c' : 'var(--text-muted)'
                }}
              >
                🟧 Orange Money
              </button>
            </div>

            {/* Instruction Box */}
            <div style={{
              background: 'linear-gradient(135deg, #033498 0%, #1e1b4b 100%)',
              color: 'white', padding: '16px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(243, 103, 29, 0.3)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px', color: '#f3671d' }}>
                📲 Procédure de Règlement {method === 'MANUAL_OM' ? 'Orange Money' : 'Wave'} :
              </div>
              <ol style={{ margin: '0 0 0 18px', padding: 0, fontSize: '0.85rem', lineHeight: 1.55 }}>
                <li>Ouvrez votre application {method === 'MANUAL_OM' ? 'Orange Money' : 'Wave'}.</li>
                <li>Effectuez un transfert du montant exact de <strong>{formattedAmount}</strong> au numéro :</li>
                <li style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fba919', margin: '4px 0' }}>
                  📞 +221 77 542 82 35
                </li>
                <li>Saisissez vos identifiants ci-dessous pour créer votre Compte Participant.</li>
              </ol>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Nom &amp; Prénom du Participant / Représentant *
              </label>
              <input
                type="text"
                className="input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ex: Massinissa Sow"
              />
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Email Pro (votre Identifiant de Connexion) *
                </label>
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="massinissa@entreprise.com"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Téléphone / WhatsApp
                </label>
                <input
                  type="tel"
                  className="input"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="+221 77 000 00 00"
                />
              </div>
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Mot de passe Secret (pour vous connecter) *
                </label>
                <input
                  type="password"
                  className="input"
                  required
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Choisissez un mot de passe"
                />
              </div>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Référence / Transaction {method === 'MANUAL_OM' ? 'Orange Money' : 'Wave'} *
                </label>
                <input
                  type="text"
                  className="input"
                  required
                  value={txRef}
                  onChange={e => setTxRef(e.target.value)}
                  placeholder="ex: TXN-99841029"
                  style={{ borderColor: 'var(--accent)', fontWeight: 700 }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '6px', padding: '14px', fontSize: '1rem', fontWeight: 800 }}
            >
              {loading ? 'Création du compte & Enregistrement...' : ' Créer Mon Compte & Demander la Validation'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

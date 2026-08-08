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
  const [paymentMode, setPaymentMode] = useState<'SELECT' | 'MANUAL_WAVE' | 'MANUAL_OM'>('SELECT');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form State
  const [name, setName] = useState(customerName || currentUser?.name || '');
  const [email, setEmail] = useState(customerEmail || currentUser?.email || '');
  const [phone, setPhone] = useState(customerPhone || currentUser?.phone || '');
  const [company, setCompany] = useState(companyName || currentUser?.company || '');
  const [txRef, setTxRef] = useState('');

  const formattedAmount = amount.toLocaleString('fr-FR') + ' FCFA';

  // Direct Wave API Payment
  const handleWaveDirect = async () => {
    setLoading(true);
    try {
      const res = await apiService.createWaveCheckout(amount, packName, email || currentUser?.email);
      if (res.wave_launch_url) {
        window.location.href = res.wave_launch_url;
      } else {
        showToast('Erreur d\'initialisation Wave');
      }
    } catch (err: any) {
      showToast(err.message || 'Erreur lors du paiement Wave Direct');
    } finally {
      setLoading(false);
    }
  };

  // Submit Manual Payment (Wave / Orange Money to +221 77 542 82 35)
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !txRef) {
      showToast('Veuillez remplir votre nom, email et la référence du transfert');
      return;
    }

    setLoading(true);
    try {
      const res = await apiService.submitManualPayment({
        customerName: name,
        customerEmail: email,
        customerPhone: phone,
        companyName: company,
        packName,
        amount,
        paymentMethod: paymentMode === 'MANUAL_OM' ? 'MANUAL_OM' : 'MANUAL_WAVE',
        transactionRef: txRef
      });

      setSubmitted(true);
      showToast(' Demande transmise ! L\'admin valide votre paiement et vous recevrez la facture par email.');
      if (onSuccess) onSuccess();
    } catch (err: any) {
      showToast(err.message || 'Erreur lors de la soumission du paiement manuel');
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
        width: '100%', maxWidth: '540px', padding: '28px', color: 'var(--text-main)',
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
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span className="badge badge-accent" style={{ marginBottom: '8px', display: 'inline-block' }}>
            💳 Règlement HORECA AFRICA 2026
          </span>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary)', margin: '6px 0' }}>
            {packName}
          </h2>
          <p style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent)', margin: 0 }}>
            Montant : {formattedAmount}
          </p>
        </div>

        {submitted ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>🎉</div>
            <h3 style={{ color: '#22c55e', fontSize: '1.3rem', fontWeight: 800, marginBottom: '8px' }}>
              Demande enregistrée avec succès !
            </h3>
            <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              Votre référence de transaction <strong>{txRef}</strong> a été transmise à l'administrateur.<br />
              Dès validation du transfert au <strong>+221 77 542 82 35</strong>, vous recevrez votre <strong>facture acquittée par email</strong> à <strong>{email}</strong>.
            </p>
            <button className="btn btn-accent" onClick={onClose} style={{ width: '100%' }}>
              Fermer et Retourner à l'Accueil
            </button>
          </div>
        ) : paymentMode === 'SELECT' ? (
          /* Selection Screen */
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', textAlign: 'center', marginBottom: '8px' }}>
              Choisissez votre méthode de règlement préférée :
            </p>

            {/* Option 1: Wave Direct API */}
            <button
              onClick={handleWaveDirect}
              disabled={loading}
              className="card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                borderRadius: 'var(--radius-md)', border: '2px solid #1dcaff',
                background: 'linear-gradient(135deg, rgba(29, 202, 255, 0.08) 0%, rgba(3, 52, 152, 0.05) 100%)',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <div style={{ fontSize: '2rem' }}>🌊</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                  Paiement Direct Wave API (Automatique)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Paiement instantané sécurisé par l'application Wave
                </div>
              </div>
              <i className="fas fa-chevron-right" style={{ color: '#1dcaff' }}></i>
            </button>

            {/* Option 2: Manual Wave Transfer to +221 77 542 82 35 */}
            <button
              onClick={() => setPaymentMode('MANUAL_WAVE')}
              className="card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                borderRadius: 'var(--radius-md)', border: '2px solid var(--accent)',
                background: 'rgba(234, 88, 12, 0.05)',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <div style={{ fontSize: '2rem' }}>📲</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                  Transfert Manuel Wave (+221 77 542 82 35)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Envoyez au 77 542 82 35 et recevez la facture validée par email
                </div>
              </div>
              <i className="fas fa-chevron-right" style={{ color: 'var(--accent)' }}></i>
            </button>

            {/* Option 3: Manual Orange Money Transfer to +221 77 542 82 35 */}
            <button
              onClick={() => setPaymentMode('MANUAL_OM')}
              className="card-hover"
              style={{
                display: 'flex', alignItems: 'center', gap: '16px', padding: '16px',
                borderRadius: 'var(--radius-md)', border: '2px solid #ff7900',
                background: 'rgba(255, 121, 0, 0.05)',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}
            >
              <div style={{ fontSize: '2rem' }}>🟧</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 800, fontSize: '1.05rem', color: 'var(--primary)' }}>
                  Transfert Manuel Orange Money (+221 77 542 82 35)
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Envoyez au 77 542 82 35 et l'admin valide avec envoi de facture
                </div>
              </div>
              <i className="fas fa-chevron-right" style={{ color: '#ff7900' }}></i>
            </button>
          </div>
        ) : (
          /* Manual Payment Form */
          <form onSubmit={handleManualSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <button
              type="button"
              onClick={() => setPaymentMode('SELECT')}
              style={{ background: 'none', border: 'none', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.85rem', textAlign: 'left', padding: 0 }}
            >
              &larr; Choisir une autre méthode
            </button>

            {/* Manual Instruction Box */}
            <div style={{
              background: 'linear-gradient(135deg, #033498 0%, #1e1b4b 100%)',
              color: 'white', padding: '16px', borderRadius: 'var(--radius-md)'
            }}>
              <div style={{ fontWeight: 800, fontSize: '0.95rem', marginBottom: '6px' }}>
                📋 Instructions de Transfert {paymentMode === 'MANUAL_OM' ? 'Orange Money' : 'Wave'} :
              </div>
              <ol style={{ margin: '0 0 0 18px', padding: 0, fontSize: '0.85rem', lineHeight: 1.5 }}>
                <li>Ouvrez votre application {paymentMode === 'MANUAL_OM' ? 'Orange Money' : 'Wave'}.</li>
                <li>Effectuez un transfert de <strong>{formattedAmount}</strong> au numéro :</li>
                <li style={{ fontSize: '1.1rem', fontWeight: 900, color: '#fba919', marginTop: '4px' }}>
                  📞 +221 77 542 82 35
                </li>
                <li>Notez ou copiez la **Référence de transaction** (ex: TXN-XXXXXX ou le numéro d'envoi).</li>
              </ol>
            </div>

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Nom Complet du Participant / Représentant *
              </label>
              <input
                type="text"
                className="input"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="ex: Malick Sow"
              />
            </div>

            <div className="grid-2" style={{ gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                  Email (pour recevoir la Facture) *
                </label>
                <input
                  type="email"
                  className="input"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contact@entreprise.com"
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

            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 700, display: 'block', marginBottom: '4px' }}>
                Référence / ID du Transfert {paymentMode === 'MANUAL_OM' ? 'Orange Money' : 'Wave'} *
              </label>
              <input
                type="text"
                className="input"
                required
                value={txRef}
                onChange={e => setTxRef(e.target.value)}
                placeholder="ex: TXN-88492019 ou N° d'expéditeur +221..."
                style={{ borderColor: 'var(--accent)', fontWeight: 700 }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-accent"
              style={{ width: '100%', marginTop: '8px', padding: '14px' }}
            >
              {loading ? 'Transmissions...' : ' Transmettre la Demande pour Validation & Facture'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

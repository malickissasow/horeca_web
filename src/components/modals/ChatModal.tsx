import React, { useState, useEffect } from 'react';
import { User, ChatMessage } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { apiService } from '../../services/api';

interface ChatModalProps {
  targetUser: User | null;
  onClose: () => void;
}

export const ChatModal: React.FC<ChatModalProps> = ({ targetUser, onClose }) => {
  const { currentUser, showToast } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser && targetUser) {
      apiService.getMessages(currentUser.id, targetUser.id).then(setMessages).catch(console.error);
    }
  }, [currentUser, targetUser]);

  if (!targetUser || !currentUser) return null;

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const content = inputText.trim();
    setInputText('');
    setLoading(true);

    try {
      const msg = await apiService.sendMessage(currentUser.id, targetUser.id, content);
      setMessages((prev) => [...prev, msg]);
    } catch (err: any) {
      showToast(err.message || 'Erreur d’envoi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay active">
      <div className="modal-container" style={{ maxWidth: '560px', display: 'flex', flexDirection: 'column', height: '520px' }}>
        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid var(--gray-200)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'var(--accent)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800 }}>
              {targetUser.company.charAt(0)}
            </div>
            <div>
              <h4 style={{ fontWeight: 800, color: 'var(--primary)', margin: 0 }}>{targetUser.company}</h4>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{targetUser.name} · {targetUser.sector}</span>
            </div>
          </div>
          <button onClick={onClose}><i className="fas fa-times"></i></button>
        </div>

        {/* MESSAGES BODY */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '10px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {messages.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', textAlign: 'center', marginTop: '40px', fontSize: '0.9rem' }}>
              💬 Démarrez la conversation avec {targetUser.name} ({targetUser.company}).
            </p>
          ) : (
            messages.map((m, index) => {
              const isMine = m.fromId === currentUser.id;
              return (
                <div
                  key={m.id || index}
                  style={{
                    alignSelf: isMine ? 'flex-end' : 'flex-start',
                    maxWidth: '78%',
                    background: isMine ? 'var(--primary)' : 'var(--gray-100)',
                    color: isMine ? 'white' : 'var(--text-main)',
                    padding: '10px 14px',
                    borderRadius: isMine ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                    fontSize: '0.88rem',
                    boxShadow: '0 2px 5px rgba(0,0,0,0.05)'
                  }}
                >
                  {m.content}
                </div>
              );
            })
          )}
        </div>

        {/* INPUT FORM */}
        <form onSubmit={handleSend} style={{ display: 'flex', gap: '8px', paddingTop: '12px', borderTop: '1px solid var(--gray-200)', marginTop: '8px' }}>
          <input
            type="text"
            className="form-control"
            placeholder="Écrivez votre message B2B..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
          />
          <button type="submit" className="btn btn-accent" disabled={loading}>
            <i className="fas fa-paper-plane"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

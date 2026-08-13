import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useI18n } from '../context/I18nContext';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
}

const FAQ_DATA: FAQItem[] = [
  // 1. Général & Accès
  {
    id: 'gen-1',
    category: 'Accès & Dates',
    question: "Où et quand se déroule l'événement HORECA Africa Business Week 2026 ?",
    answer: "L'événement aura lieu les 27 & 28 Novembre 2026 à l'Hôtel Novotel Dakar, Sénégal. Les portes ouvrent chaque jour de 08h30 à 18h30 GMT."
  },
  {
    id: 'gen-2',
    category: 'Accès & Dates',
    question: "Comment accéder à l'Hôtel Novotel Dakar depuis l'aéroport DSS ?",
    answer: "Des navettes privées sont affrétées par Demba Conciergerie (+221 76 420 52 16). Vous pouvez aussi réserver un taxi agréé directement sur votre espace participant."
  },
  {
    id: 'gen-3',
    category: 'Accès & Dates',
    question: "Qui peut participer au salon HORECA Africa 2026 ?",
    answer: "Le salon est exclusivement réservé aux professionnels du secteur HORECA (Hôtellerie, Restauration, Cafés, Tourisme, Transport, Distribution) ainsi qu'aux jeunes diplômés qualifiés."
  },

  // 2. Business Matching & RDV B2B
  {
    id: 'b2b-1',
    category: 'Business Matching',
    question: "Comment fonctionne la plate-forme de Business Matching 1-to-1 ?",
    answer: "Notre plate-forme vous permet de parcourir le catalogue des 160 décideurs et 20 exposants, puis de solliciter des rendez-vous d'affaires de 30 minutes sur des tables numérotées au Novotel Dakar."
  },
  {
    id: 'b2b-2',
    category: 'Business Matching',
    question: "Combien de rendez-vous B2B puis-je réaliser au salon ?",
    answer: "Chaque participant peut planifier jusqu'à 10 à 15 rendez-vous B2B qualifiés sur les 2 jours de salon (+300 rendez-vous au total sur l'événement)."
  },
  {
    id: 'b2b-3',
    category: 'Business Matching',
    question: "Puis-je échanger des messages avec d'autres participants avant l'événement ?",
    answer: "Oui ! Une fois votre inscription validée, la messagerie privée intégrée vous permet de contacter directement les exposants et décisionnaires."
  },

  // 3. Exposants & Stands
  {
    id: 'exp-1',
    category: 'Exposants & Stands',
    question: "Quels sont les types de stands disponibles pour les entreprises ?",
    answer: "Nous proposons 4 formules : Découverte (6m²), Business (9m²), Premium (12m²) et Prestige (18m²). Tous les stands incluent cloisons, enseigne, électricité et accès au Matchmaking B2B."
  },
  {
    id: 'exp-2',
    category: 'Exposants & Stands',
    question: "Quand s'effectue le montage et la livraison du matériel de stand ?",
    answer: "Le montage s'effectue le 26 Novembre 2026 de 14h00 à 22h00 au Novotel Dakar. Notre équipe logistique sur place vous assiste pour la réception de vos colis."
  },

  // 4. Hosted Buyers VIP & Emirates
  {
    id: 'vip-1',
    category: 'Hosted Buyers VIP',
    question: "Qu'est-ce que le programme Hosted Buyers VIP ?",
    answer: "C'est un programme d'invitation exclusive dédié aux acheteurs internationaux majeurs (directeurs d'achats chaînes hôtelières, investisseurs). Il inclut le billet d'avion et l'hôtel Novotel pris en charge."
  },
  {
    id: 'vip-2',
    category: 'Hosted Buyers VIP',
    question: "Comment bénéficier de la réduction partenaire aérien Emirates ?",
    answer: "En tant que participant accrédité, un code tarif congrès Emirates dédié vous sera envoyé pour bénéficier de remises négociées et d'une franchise bagages renforcée."
  },

  // 5. HORECA Jobs Africa
  {
    id: 'job-1',
    category: 'HORECA Jobs',
    question: "Comment fonctionne le pôle Recrutement RH HORECA Jobs Africa ?",
    answer: "Les hôteliers et restaurateurs peuvent publier leurs offres d'emploi. Les 45 jeunes diplômés sélectionnés peuvent déposer leur CV et solliciter des entretiens de recrutement."
  },

  // 6. Paiement & Badges QR
  {
    id: 'pay-1',
    category: 'Paiements & Badges',
    question: "Quels sont les modes de paiement acceptés ?",
    answer: "Nous acceptons Wave Sénégal, Orange Money Sénégal ainsi que le virement bancaire manuel. Votre badge numérique QR est généré immédiatement."
  },
  {
    id: 'pay-2',
    category: 'Paiements & Badges',
    question: "Où trouver mon Badge QR Code numérique ?",
    answer: "Cliquez sur 'Badge QR' dans le menu principal une fois connecté. Vous pouvez le télécharger ou le présenter directement sur votre smartphone à l'accueil du salon."
  },

  // 7. Infos Pratiques & Farm Trips
  {
    id: 'inf-1',
    category: 'Infos Pratiques',
    question: "Qu'est-ce que le Farm Trip post-événement (2 à 3 jours) ?",
    answer: "Opéré par Demba Conciergerie, le Farm Trip fait découvrir les resorts de Saly, Pointe Sarène et les éco-lodges du Sine Saloum aux investisseurs et acheteurs internationaux."
  },
  {
    id: 'inf-2',
    category: 'Infos Pratiques',
    question: "Comment contacter l'assistant IA WhatsApp pour une réponse immédiate ?",
    answer: "Scannez le QR Code ou envoyez un message au +221 76 420 52 16. Notre assistant IA répond 24h/24 à toutes vos questions sur les accès, le programme et les réservations."
  }
];

export const FAQPage: React.FC = () => {
  const { setCurrentPage } = useAuth();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({'gen-1': true, 'b2b-1': true});

  const categories = ['Toutes', 'Accès & Dates', 'Business Matching', 'Exposants & Stands', 'Hosted Buyers VIP', 'HORECA Jobs', 'Paiements & Badges', 'Infos Pratiques'];

  const toggleAccordion = (id: string) => {
    setOpenIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const filteredFaq = FAQ_DATA.filter(item => {
    const matchCat = activeCategory === 'Toutes' || item.category === activeCategory;
    const matchSearch = item.question.toLowerCase().includes(search.toLowerCase()) || item.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ paddingBottom: '60px' }}>
      
      {/* HEADER HERO BANNER */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--horeca-blue) 0%, #1e3a8a 100%)',
          color: 'white',
          padding: '40px 32px',
          borderRadius: '16px',
          marginBottom: '32px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <span
          className="badge"
          style={{ background: 'var(--horeca-orange)', color: 'white', fontWeight: 800, letterSpacing: '1px', marginBottom: '12px', padding: '6px 14px' }}
        >
          CENTRE D'AIDE & INFOS PRATIQUES
        </span>
        <h1 style={{ fontSize: '2.4rem', fontWeight: 900, marginBottom: '12px', color: '#ffffff' }}>
          Foire Aux Questions & Guide Participant
        </h1>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '720px', margin: '0 auto 24px auto', lineHeight: '1.6' }}>
          Retrouvez toutes les réponses aux questions sur le salon <strong>HORECA Africa 2026</strong> (27 & 28 Nov. 2026, Hôtel Novotel Dakar).
        </p>

        {/* SEARCH BAR */}
        <div style={{ maxWidth: '600px', margin: '0 auto', position: 'relative' }}>
          <i
            className="fas fa-search"
            style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }}
          ></i>
          <input
            type="text"
            placeholder="Rechercher une question (ex: stand, badges, hôtel, Wave, RDV B2B...)"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '14px 16px 14px 44px',
              borderRadius: '50px',
              border: 'none',
              fontSize: '0.95rem',
              fontWeight: 600,
              boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
              outline: 'none'
            }}
          />
        </div>
      </div>

      {/* CATEGORY TABS */}
      <div style={{ display: 'flex', gap: '8px', overflowX: 'auto', paddingBottom: '12px', marginBottom: '28px' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`btn ${activeCategory === cat ? 'btn-accent' : 'btn-outline'}`}
            style={{
              borderRadius: '50px',
              padding: '8px 18px',
              fontSize: '0.84rem',
              fontWeight: 700,
              whiteSpace: 'nowrap'
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* FAQ GRID & ACCORDION */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '28px' }}>
        
        {/* LEFT: FAQ ACCORDION LIST */}
        <div>
          {filteredFaq.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <i className="fas fa-search text-muted" style={{ fontSize: '3rem', marginBottom: '16px' }}></i>
              <h3>Aucune question trouvée pour "{search}"</h3>
              <p style={{ color: 'var(--text-muted)' }}>Essayez un autre terme de recherche ou contactez notre assistant IA.</p>
            </div>
          ) : (
            filteredFaq.map(item => {
              const isOpen = !!openIds[item.id];
              return (
                <div
                  key={item.id}
                  className="card"
                  style={{
                    marginBottom: '14px',
                    padding: '0',
                    overflow: 'hidden',
                    border: isOpen ? '1.5px solid var(--horeca-orange)' : '1px solid var(--border)',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div
                    onClick={() => toggleAccordion(item.id)}
                    style={{
                      padding: '18px 24px',
                      background: isOpen ? 'var(--gray-50)' : 'white',
                      cursor: 'pointer',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      userSelect: 'none'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <span className="badge badge-accent" style={{ fontSize: '0.72rem', padding: '4px 10px' }}>
                        {item.category}
                      </span>
                      <h3 style={{ fontSize: '1.02rem', fontWeight: 800, color: 'var(--horeca-blue)', margin: 0 }}>
                        {item.question}
                      </h3>
                    </div>
                    <i className={`fas ${isOpen ? 'fa-chevron-up text-accent' : 'fa-chevron-down text-muted'}`} style={{ fontSize: '0.9rem' }}></i>
                  </div>

                  {isOpen && (
                    <div style={{ padding: '20px 24px', borderTop: '1px solid var(--border)', fontSize: '0.92rem', lineHeight: '1.68', color: 'var(--text-body)' }}>
                      {item.answer}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* RIGHT: AI ASSISTANT & CONTACT WIDGET */}
        <div>
          <div
            className="card"
            style={{
              position: 'sticky',
              top: '90px',
              border: '2px solid #25D366',
              background: 'linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)',
              padding: '24px',
              textAlign: 'center'
            }}
          >
            <div
              style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                background: '#25D366',
                color: 'white',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.8rem',
                marginBottom: '16px',
                boxShadow: '0 8px 20px rgba(37,211,102,0.3)'
              }}
            >
              <i className="fab fa-whatsapp"></i>
            </div>

            <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#166534', marginBottom: '8px' }}>
              Assistant IA WhatsApp 24/7
            </h3>
            <p style={{ fontSize: '0.86rem', color: '#15803d', lineHeight: '1.5', marginBottom: '20px' }}>
              Une question spécifique ? Discutez en direct avec notre assistant IA entraîné sur l'événement HORECA Africa.
            </p>

            <a
              href="https://wa.me/221764205216?text=Bonjour%20Assistant%20IA%20HORECA%2C%20j%27ai%20une%20question%20sur%20le%20salon."
              target="_blank"
              rel="noopener noreferrer"
              className="btn"
              style={{
                width: '100%',
                background: '#25D366',
                color: 'white',
                fontWeight: 800,
                borderRadius: '50px',
                padding: '12px 20px',
                fontSize: '0.92rem',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                boxShadow: '0 4px 12px rgba(37,211,102,0.3)'
              }}
            >
              <i className="fab fa-whatsapp" style={{ fontSize: '1.2rem' }}></i>
              Écrire au +221 76 420 52 16
            </a>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #dcfce7', fontSize: '0.78rem', color: '#166534' }}>
              <strong>Secrétariat &amp; Conciergerie :</strong><br />
              <i className="fas fa-envelope" style={{ marginRight: '4px' }}></i> infos@horecafrica.com<br />
              <i className="fas fa-phone-alt" style={{ marginRight: '4px' }}></i> +221 76 420 52 16 / +221 77 542 82 35
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};

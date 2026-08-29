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
    answer: "Des navettes privées sont affrétées par Demba Conciergerie (+221 77 542 82 35). Vous pouvez aussi réserver un taxi agréé directement sur votre espace participant."
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
    answer: "Scannez le QR Code ou envoyez un message au +221 77 542 82 35. Notre assistant IA répond 24h/24 à toutes vos questions sur les accès, le programme et les réservations."
  }
];

export const FAQPage: React.FC = () => {
  const { setCurrentPage } = useAuth();
  const { t } = useI18n();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('Toutes');
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({'gen-1': true, 'b2b-1': true});
  const [infoTab, setInfoTab] = useState<'meteo' | 'visa' | 'hotel' | 'transfert' | 'essentiels'>('meteo');

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
      
      {/* INFORMATIONS PRATIQUES BANNER & GUIDE */}
      <div
        className="card"
        style={{
          background: 'linear-gradient(135deg, #021a4f 0%, #1e3a8a 100%)',
          color: 'white',
          padding: '36px 32px',
          borderRadius: '16px',
          marginBottom: '36px',
          boxShadow: '0 12px 30px rgba(2,26,79,0.25)'
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <span
            className="badge"
            style={{ background: 'var(--horeca-orange)', color: 'white', fontWeight: 800, letterSpacing: '1px', marginBottom: '10px', padding: '6px 14px' }}
          >
            INFORMATIONS PRATIQUES
          </span>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: '10px', color: '#ffffff' }}>
            Venir à Dakar en novembre 2026
          </h1>
          <p style={{ fontSize: '1rem', opacity: 0.9, maxWidth: '760px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
            Visa, hébergement, transferts, météo et tenues : tout ce qu'il faut pour préparer sereinement votre séjour autour des 27 &amp; 28 novembre 2026.
          </p>

          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <a
              href="https://wa.me/221775428235?text=Bonjour%20Conciergerie%20HORECA%2C%20je%20souhaite%20une%20assistance%20voyage%20pour%20Dakar."
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-accent btn-sm"
              style={{ fontWeight: 800, padding: '10px 20px' }}
            >
              <i className="fab fa-whatsapp"></i> Demander une assistance voyage
            </a>
            <a
              href="#faqSection"
              className="btn btn-outline btn-sm"
              style={{ color: 'white', borderColor: 'rgba(255,255,255,0.6)', padding: '10px 20px' }}
            >
              <i className="fas fa-question-circle"></i> Consulter la FAQ
            </a>
          </div>
        </div>

        {/* SUB-TABS NAVIGATION */}
        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '24px' }}>
          <button
            className={`btn ${infoTab === 'meteo' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderRadius: '30px', fontSize: '0.86rem', fontWeight: 800, padding: '8px 18px', color: infoTab === 'meteo' ? 'white' : 'rgba(255,255,255,0.85)' }}
            onClick={() => setInfoTab('meteo')}
          >
            ☀️ Météo et tenues
          </button>
          <button
            className={`btn ${infoTab === 'visa' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderRadius: '30px', fontSize: '0.86rem', fontWeight: 800, padding: '8px 18px', color: infoTab === 'visa' ? 'white' : 'rgba(255,255,255,0.85)' }}
            onClick={() => setInfoTab('visa')}
          >
            📑 Visa et entrée
          </button>
          <button
            className={`btn ${infoTab === 'hotel' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderRadius: '30px', fontSize: '0.86rem', fontWeight: 800, padding: '8px 18px', color: infoTab === 'hotel' ? 'white' : 'rgba(255,255,255,0.85)' }}
            onClick={() => setInfoTab('hotel')}
          >
            🏨 Hébergement
          </button>
          <button
            className={`btn ${infoTab === 'transfert' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderRadius: '30px', fontSize: '0.86rem', fontWeight: 800, padding: '8px 18px', color: infoTab === 'transfert' ? 'white' : 'rgba(255,255,255,0.85)' }}
            onClick={() => setInfoTab('transfert')}
          >
            🚕 Transferts
          </button>
          <button
            className={`btn ${infoTab === 'essentiels' ? 'btn-accent' : 'btn-outline'}`}
            style={{ borderRadius: '30px', fontSize: '0.86rem', fontWeight: 800, padding: '8px 18px', color: infoTab === 'essentiels' ? 'white' : 'rgba(255,255,255,0.85)' }}
            onClick={() => setInfoTab('essentiels')}
          >
            🧳 Essentiels
          </button>
        </div>

        {/* TAB CONTENTS */}
        <div style={{ background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)', padding: '24px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.15)' }}>

          {/* TAB 1: METEO ET TENUES */}
          {infoTab === 'meteo' && (
            <div>
              <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', overflowX: 'auto' }}>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>Septembre</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>Octobre</span>
                <span className="badge" style={{ background: 'var(--horeca-orange)', color: 'white', fontWeight: 900 }}>Novembre 2026 (Salon)</span>
                <span className="badge" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.7)' }}>Décembre</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#fba565' }}>30 °C</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>Dakar · Maximale 30 °C / minimale 22 °C</div>
                  <div style={{ fontSize: '0.78rem', color: '#6ee7b7', marginTop: '4px' }}>Ensoleillé, sec, alizé maritime en soirée</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>🌧️ Précipitations</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#93c5fd', marginTop: '4px' }}>3 mm</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Climat sec &amp; agréable</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>💧 Humidité</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#a7f3d0', marginTop: '4px' }}>65 %</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Brise marine tempérée</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.1)', padding: '16px', borderRadius: '10px', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>🌊 Temp. de la mer</div>
                  <div style={{ fontSize: '1.4rem', fontWeight: 900, color: '#67e8f9', marginTop: '4px' }}>26 °C</div>
                  <div style={{ fontSize: '0.78rem', opacity: 0.8 }}>Ensoleillement ≈ 9 h / jour</div>
                  <div style={{ fontSize: '0.72rem', opacity: 0.7 }}>Lever ≈ 07h05 · Coucher ≈ 18h50</div>
                </div>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--horeca-orange)', marginBottom: '12px' }}>
                👔 Quoi porter en Novembre
              </h3>
              <p style={{ fontSize: '0.9rem', fontStyle: 'italic', opacity: 0.85, marginBottom: '14px' }}>
                Costume léger, blazer déstructuré, robe fluide
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>Journée salon (business) :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Costume léger sans cravate ou tailleur en lin/coton, chemise claire, mocassins. Les salles sont climatisées : prévoyez une veste fine.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>Soirée de réseautage et gala :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Business chic : blazer sombre, robe de cocktail, ou tenue africaine élégante (bazin, boubou brodé) — très apprécié localement.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>Visites et excursion à la ferme :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Tenue décontractée respirante, chaussures fermées confortables, chapeau, lunettes de soleil et crème solaire SPF 50.
                  </p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>Bord de mer et hôtel :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Maillot, sandales et paréo : la mer est encore à 26 °C fin novembre.
                  </p>
                </div>
              </div>

              <div style={{ marginTop: '16px', fontSize: '0.76rem', opacity: 0.75 }}>
                * Valeurs indicatives basées sur les moyennes climatiques de Dakar (station de Yoff). Consultez la prévision à 7 jours avant votre départ.
              </div>
            </div>
          )}

          {/* TAB 2: VISA ET ENTREE */}
          {infoTab === 'visa' && (
            <div>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--horeca-orange)', marginBottom: '8px' }}>
                  Entrée au Sénégal
                </h3>
                <p style={{ fontSize: '0.9rem', lineHeight: '1.6', opacity: 0.95 }}>
                  Passeport valide au minimum 6 mois après la date d'entrée. Le Sénégal exempte de visa les ressortissants de nombreux pays pour un séjour d'affaires ou touristique inférieur à 90 jours.
                </p>
              </div>

              <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '10px', marginBottom: '20px' }}>
                <strong style={{ fontSize: '0.95rem', color: '#6ee7b7' }}>🌍 Principales nationalités exemptées de visa :</strong>
                <ul style={{ fontSize: '0.85rem', margin: '10px 0 0 18px', padding: 0, opacity: 0.95, lineHeight: '1.6' }}>
                  <li><strong>CEDEAO :</strong> Sénégal, Côte d'Ivoire, Ghana, Nigeria, Mali, Bénin, Togo, etc.</li>
                  <li><strong>Europe &amp; Amérique :</strong> Union européenne, Royaume-Uni, Suisse, États-Unis, Canada, Brésil</li>
                  <li><strong>Maghreb :</strong> Maroc, Tunisie, Algérie</li>
                  <li><strong>Afrique :</strong> Afrique du Sud, Kenya, Rwanda, Maurice</li>
                  <li><strong>Moyen-Orient &amp; Asie :</strong> Émirats arabes unis, Qatar, Arabie saoudite, Turquie</li>
                </ul>
                <p style={{ fontSize: '0.78rem', margin: '8px 0 0 0', opacity: 0.8, fontStyle: 'italic' }}>
                  Cette liste est indicative : vérifiez toujours auprès de l'ambassade ou du consulat du Sénégal de votre pays de résidence avant de réserver vos vols.
                </p>
              </div>

              <div style={{ background: 'rgba(243,103,29,0.15)', border: '1px solid rgba(243,103,29,0.4)', padding: '18px', borderRadius: '10px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '1.05rem', color: '#ffb07a', fontWeight: 800 }}>
                  ✉️ Lettre d'invitation officielle
                </h4>
                <p style={{ fontSize: '0.86rem', margin: '0 0 12px 0', opacity: 0.95 }}>
                  Exposants, sponsors, Hosted Buyers et délégations : l'organisation délivre une lettre d'invitation officielle pour votre demande de visa ou votre service voyages.
                </p>
                <div style={{ display: 'flex', gap: '10px', fontSize: '0.82rem', flexWrap: 'wrap', marginBottom: '14px' }}>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>1. Finalisez votre inscription</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>2. Envoyez scan passeport + société</span>
                  <span className="badge" style={{ background: 'rgba(255,255,255,0.15)', color: 'white' }}>3. Réception sous 72h ouvrées</span>
                </div>
                <a
                  href="mailto:infos@horecafrica.com?subject=Demande%20de%20lettre%20d%27invitation%20Visa%20HORECA%202026"
                  className="btn btn-accent btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <i className="fas fa-paper-plane"></i> Demander la lettre (infos@horecafrica.com)
                </a>
              </div>
            </div>
          )}

          {/* TAB 3: HEBERGEMENT */}
          {infoTab === 'hotel' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--horeca-orange)', marginBottom: '8px' }}>
                Où dormir à Dakar
              </h3>
              <p style={{ fontSize: '0.88rem', opacity: 0.9, marginBottom: '20px' }}>
                L'Hôtel Novotel Dakar est l'hôtel partenaire tarifs officiels : négociés simples et doubles du 26 au 29 novembre 2026 pour les exposants, sponsors et Hosted Buyers. D'autres établissements partenaires complètent l'offre selon votre budget.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(243,103,29,0.2)', border: '2px solid var(--horeca-orange)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1.05rem', color: '#ffffff', fontWeight: 900 }}>Novotel Dakar (officiel)</h4>
                    <span className="badge" style={{ background: 'var(--horeca-orange)', color: 'white', fontSize: '0.72rem' }}>0 min (Sur site)</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', margin: '6px 0 12px 0', opacity: 0.9 }}>
                    Sur site — salon, conférences et rendez-vous B2B. Tarifs négociés HORECA 2026.
                  </p>
                  <a
                    href="https://wa.me/221775428235?text=Bonjour%20HORECA%2C%20je%20souhaite%20r%C3%A9server%20une%20chambre%20tarif%20officiel%20au%20Novotel%20Dakar."
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-accent btn-sm"
                    style={{ width: '100%', fontWeight: 800, textAlign: 'center' }}
                  >
                    Réserver au Novotel
                  </a>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Terrou Bi 5★</h4>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem' }}>Prime · 8 min</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', margin: '6px 0 0 0', opacity: 0.85 }}>
                    5★ bord de mer, à quelques minutes du Novotel. Hôtel resort d'exception.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Radisson Blu Dakar</h4>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem' }}>Prime · 12 min</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', margin: '6px 0 0 0', opacity: 0.85 }}>
                    Corniche Ouest, cadre moderne favorable aux réunions d'entreprises.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Pullman Dakar Teranga</h4>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem' }}>Entreprise · 5 min</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', margin: '6px 0 0 0', opacity: 0.85 }}>
                    Centre-ville, proche Plateau. Accès très rapide au Novotel.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 style={{ margin: 0, fontSize: '1rem', color: '#ffffff' }}>Hôtel Onomo Dakar</h4>
                    <span className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.72rem' }}>Intelligent · 15 min</span>
                  </div>
                  <p style={{ fontSize: '0.82rem', margin: '6px 0 0 0', opacity: 0.85 }}>
                    Rapport qualité/prix, idéal pour les délégations et équipes de stand.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: TRANSFERTS */}
          {infoTab === 'transfert' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--horeca-orange)', marginBottom: '14px' }}>
                Transferts Aéroport &amp; Déplacements
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '14px', marginBottom: '20px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#93c5fd' }}>🛬 Aéroport AIBD</h4>
                  <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                    Aéroport International Blaise Diagne, à 47 km du centre. Comptez 1h à 1h15 jusqu'au Novotel via l'autoroute à péage.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#6ee7b7' }}>🚐 Navettes officielles</h4>
                  <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                    Transferts privés réservés par Demba Conciergerie Services Africa, DMC officiel : accueil personnalisé à l'arrivée, véhicules climatisés, chauffeur bilingue.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '16px', borderRadius: '12px' }}>
                  <h4 style={{ margin: '0 0 6px 0', color: '#fba565' }}>✈️ Transporteur officiel</h4>
                  <p style={{ fontSize: '0.84rem', margin: 0, opacity: 0.9 }}>
                    Emirates accompagne les Hosted Buyers et clients internationaux avec des conditions dédiées sur les vols vers Dakar.
                  </p>
                </div>
              </div>

              <div style={{ background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.4)', padding: '18px', borderRadius: '12px' }}>
                <h4 style={{ margin: '0 0 6px 0', color: '#4ade80', fontWeight: 800 }}>
                  🚘 Réserver votre transfert aéroport
                </h4>
                <p style={{ fontSize: '0.86rem', margin: '0 0 14px 0', opacity: 0.95 }}>
                  Communiquez vos numéros de vol et horaires au moins 7 jours avant votre arrivée pour bénéficier de l'accueil aéroport et du transfert groupé vers l'hôtel.
                </p>
                <a
                  href="https://wa.me/221775428235?text=Bonjour%20Demba%20Conciergerie%2C%20je%20souhaite%20r%C3%A9server%20un%20transfert%20depuis%20l%27a%C3%A9roport%20AIBD."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-accent btn-sm"
                  style={{ fontWeight: 800 }}
                >
                  <i className="fab fa-whatsapp"></i> Organiser mon transfert (+221 77 542 82 35)
                </a>
              </div>
            </div>
          )}

          {/* TAB 5: ESSENTIELS */}
          {infoTab === 'essentiels' && (
            <div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--horeca-orange)', marginBottom: '14px' }}>
                Les Essentiels de votre séjour à Dakar
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '12px' }}>
                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>⏰ Fuseau horaire :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    GMT / UTC+0 toute l'année. Pas de changement d'heure.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>🗣️ Langues :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Français (officiel) et wolof. L'anglais est courant dans l'hôtellerie d'affaires.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>💶 Monnaie et paiement :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Franc CFA (XOF) — 1 EUR ≈ 656 FCFA. Carte acceptée en hôtel ; Wave et Orange Money partout.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>🔌 Électricité :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    230 V / 50 Hz, prises type C et E (norme européenne).
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>📶 Connectivité :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    4G/5G très correcte. SIM prépayée Orange / Gratuite à l'aéroport avec passeport.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>🛡️ Sécurité :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Destination sûre pour les voyages d'affaires. Précautions urbaines habituelles le soir.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>🩺 Santé :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Aucun vaccin obligatoire contre la fièvre jaune si provenance de zone non endémique. Eau en bouteille conseillée.
                  </p>
                </div>

                <div style={{ background: 'rgba(255,255,255,0.08)', padding: '14px', borderRadius: '10px' }}>
                  <strong style={{ color: '#ffb07a' }}>🚕 Se déplacer :</strong>
                  <p style={{ fontSize: '0.84rem', margin: '4px 0 0 0', opacity: 0.9 }}>
                    Yango / Heetch, taxis jaunes-noirs et navettes officielles du DMC organisateur.
                  </p>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* HEADER HERO BANNER FOR FAQ ACCORDION */}
      <div
        id="faqSection"
        className="card"
        style={{
          background: 'linear-gradient(135deg, var(--horeca-blue) 0%, #1e3a8a 100%)',
          color: 'white',
          padding: '32px',
          borderRadius: '16px',
          marginBottom: '28px',
          textAlign: 'center',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <span
          className="badge"
          style={{ background: 'var(--horeca-orange)', color: 'white', fontWeight: 800, letterSpacing: '1px', marginBottom: '12px', padding: '6px 14px' }}
        >
          FOIRE AUX QUESTIONS
        </span>
        <h2 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '12px', color: '#ffffff' }}>
          Questions Fréquemment Posées
        </h2>
        <p style={{ fontSize: '0.95rem', opacity: 0.9, maxWidth: '720px', margin: '0 auto 20px auto', lineHeight: '1.6' }}>
          Toutes les réponses pour réussir votre participation à <strong>HORECA Africa 2026</strong>.
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
              href="https://wa.me/221775428235?text=Bonjour%20Assistant%20IA%20HORECA%2C%20j%27ai%20une%20question%20sur%20le%20salon."
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
              Écrire au +221 77 542 82 35
            </a>

            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid #dcfce7', fontSize: '0.78rem', color: '#166534' }}>
              <strong>Secrétariat &amp; Conciergerie :</strong><br />
              <i className="fas fa-envelope" style={{ marginRight: '4px' }}></i> infos@horecafrica.com<br />
              <i className="fas fa-phone-alt" style={{ marginRight: '4px' }}></i> +221 77 542 82 35
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
